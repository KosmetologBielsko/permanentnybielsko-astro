import assert from 'node:assert/strict';
import test from 'node:test';

import { ANALYTICS_CONFIG } from '../../src/lib/analytics/config';
import { normalizeCollectedEvent } from '../../src/lib/analytics/collect-core';
import { defaultConsent, readConsentSnapshot } from '../../src/lib/analytics/consent';
import { semanticDedupeKey } from '../../src/lib/analytics/dedupe';
import { resolvePage, DEFAULT_PAGE_CATALOG } from '../../src/lib/analytics/page-catalog';
import { buildAttributionContext, classifyAttributionContext, acquisitionSource } from '../../src/lib/analytics/source-context';
import { createSession, isSessionExpired } from '../../src/lib/analytics/session';
import type { RawClientEventInput, VisitorState } from '../../src/lib/analytics/types';
import { extractCampaignParams, sanitizePath } from '../../src/lib/analytics/url-sanitize';
import { validateClientEvent } from '../../src/lib/analytics/validation';

class MemoryStorage {
  map = new Map<string,string>();
  getItem(key:string){ return this.map.get(key) ?? null; }
  setItem(key:string,value:string){ this.map.set(key,value); }
  removeItem(key:string){ this.map.delete(key); }
}

function event(overrides: Partial<RawClientEventInput> = {}): RawClientEventInput {
  return {
    eventId: 'e_12345678-1234-1234-1234-123456789012',
    eventName: 'page_view',
    eventVersion: 1,
    schemaVersion: ANALYTICS_CONFIG.schemaVersion,
    occurredAtClient: new Date().toISOString(),
    visitorId: 'v_12345678-1234-1234-1234-123456789012',
    sessionId: 's_12345678-1234-1234-1234-123456789012',
    pageViewId: 'pv_12345678-1234-1234-1234-123456789012',
    tabId: 'tab_12345678-1234-1234-1234-123456789012',
    pagePath: '/makijaz-permanentny-brwi/',
    consent: { necessary:true, analytics:true, marketing:false, personalization:false, policyVersion:'2' },
    eventProperties: {},
    attributionContext: null,
    trackerVersion: ANALYTICS_CONFIG.trackerVersion,
    environment: 'production',
    ...overrides,
  };
}

test('ChatGPT is AI, not referral', () => {
  const c = buildAttributionContext('https://www.permanentnybielsko.com/poradnik/x/', 'https://chatgpt.com/');
  const s = classifyAttributionContext(c, ANALYTICS_CONFIG.siteHostname);
  assert.equal(s.channelGroup, 'ai');
  assert.equal(s.source, 'ChatGPT');
});

test('Gemini / Perplexity / Copilot classify as AI', () => {
  for (const [ref, expected] of [
    ['https://gemini.google.com/app','Gemini'],
    ['https://www.perplexity.ai/search/x','Perplexity'],
    ['https://copilot.microsoft.com/','Copilot'],
  ] as const) {
    const s = classifyAttributionContext(
      buildAttributionContext('https://www.permanentnybielsko.com/', ref),
      ANALYTICS_CONFIG.siteHostname,
    );
    assert.equal(s.channelGroup, 'ai');
    assert.equal(s.source, expected);
  }
});

test('Google click id becomes Google Ads without storing raw id', () => {
  const params = extractCampaignParams('https://www.permanentnybielsko.com/?gclid=SECRET123&utm_campaign=brwi');
  assert.equal(params.has_gclid, true);
  assert.equal('gclid' in params, false);
  const s = acquisitionSource(
    buildAttributionContext('https://www.permanentnybielsko.com/?gclid=SECRET123&utm_campaign=brwi', null),
    ANALYTICS_CONFIG.siteHostname,
  );
  assert.equal(s.source, 'Google Ads');
  assert.equal(s.channelGroup, 'paid_search');
});

test('Google referrer is organic', () => {
  const s = classifyAttributionContext(
    buildAttributionContext('https://www.permanentnybielsko.com/', 'https://www.google.pl/search?q=brwi'),
    ANALYTICS_CONFIG.siteHostname,
  );
  assert.equal(s.source, 'Google Organic');
  assert.equal(s.channelGroup, 'organic_search');
});

test('same-site referrer is Direct for new session', () => {
  const s = acquisitionSource(
    buildAttributionContext('https://www.permanentnybielsko.com/galeria/', 'https://www.permanentnybielsko.com/'),
    ANALYTICS_CONFIG.siteHostname,
  );
  assert.equal(s.source, 'Direct');
  assert.equal(s.channelGroup, 'direct');
});

test('inactivity resume starts Direct even if stale URL contains click id', () => {
  const c = buildAttributionContext(
    'https://www.permanentnybielsko.com/?gclid=OLD',
    null,
    'inactivity_resume',
  );
  const s = acquisitionSource(c, ANALYTICS_CONFIG.siteHostname);
  assert.equal(s.source, 'Direct');
});

test('URL sanitizer drops arbitrary query/hash', () => {
  assert.equal(sanitizePath('/poradnik/test?email=x@example.com#x'), '/poradnik/test/');
});

test('legacy accepted consent migrates to v2', () => {
  const storage = new MemoryStorage();
  storage.setItem('pb_cookie_consent','accepted');
  const c = readConsentSnapshot(storage as unknown as Storage);
  assert.equal(c.analytics, true);
  assert.equal(c.marketing, true);
  assert.ok(storage.getItem('pb_consent_v2'));
});

test('no stored consent defaults to necessary-only', () => {
  const c = defaultConsent();
  assert.equal(c.necessary, true);
  assert.equal(c.analytics, false);
  assert.equal(c.marketing, false);
});

test('session expires at 30 minutes', () => {
  const visitor: VisitorState = { visitorId:'v_12345678', createdAt:0, firstSeenAt:0, lastSeenAt:0 };
  const s = createSession(visitor, '/', 1000);
  assert.equal(isSessionExpired(s, 1000 + ANALYTICS_CONFIG.sessionTimeoutMs - 1), false);
  assert.equal(isSessionExpired(s, 1000 + ANALYTICS_CONFIG.sessionTimeoutMs), true);
});

test('sensitive page is aggregate-only but preserves ephemeral pageViewId', () => {
  const raw = event({
    pagePath: '/sercemmalowane/',
    eventName: 'booksy_click',
    eventProperties: { placement:'content', service_key:'brows', is_cta:true, target_host:'booksy.com' },
  });
  const result = normalizeCollectedEvent(raw, DEFAULT_PAGE_CATALOG);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.event.privacyScope, 'aggregate_only');
  assert.equal(result.event.visitorId, null);
  assert.equal(result.event.sessionId, null);
  assert.equal(result.event.tabId, null);
  assert.equal(result.event.pageViewId, raw.pageViewId);
  assert.deepEqual(result.event.eventProperties, {});
});

test('health-related guide pattern is sensitive', () => {
  const page = resolvePage(DEFAULT_PAGE_CATALOG, '/poradnik/onkologia-a-brwi-permanentne/');
  assert.equal(page.privacyClass, 'sensitive');
});

test('standard PMU service remains pseudonymous after analytics consent', () => {
  const result = normalizeCollectedEvent(event(), DEFAULT_PAGE_CATALOG);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.event.privacyScope, 'pseudonymous');
  assert.ok(result.event.visitorId);
  assert.ok(result.event.sessionId);
});

test('form field values are stripped from event properties', () => {
  const raw = event({
    eventName:'form_start',
    eventProperties:{ form_id:'pmu_lead', name:'Anna', phone:'500000000', message:'health data' },
  });
  const validation = validateClientEvent(raw);
  assert.equal(validation.ok, true);
  assert.deepEqual(validation.sanitized?.eventProperties, { form_id:'pmu_lead' });
});

test('Booksy click cannot be named booking_completed', () => {
  const invalid = event({ eventName:'booking_completed' as any });
  const validation = validateClientEvent(invalid);
  assert.equal(validation.ok, false);
  assert.ok(validation.errors.includes('unknown_event_name'));
});

test('page_view semantic dedupe is page-view scoped', () => {
  const a = event();
  const b = event({ eventId:'e_22345678-1234-1234-1234-123456789012', pageViewId:'pv_22345678-1234-1234-1234-123456789012' });
  assert.notEqual(semanticDedupeKey(a), semanticDedupeKey(b));
});
