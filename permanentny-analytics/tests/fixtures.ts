import { randomUUID } from 'node:crypto';
import { ANALYTICS_CONFIG } from '../../src/lib/analytics/config';
import type { RawClientEventInput } from '../../src/lib/analytics/types';
export function event(overrides: Partial<RawClientEventInput> = {}): RawClientEventInput {
  return {
    eventId: `e_${randomUUID()}`, eventName:'page_view', eventVersion:1,
    schemaVersion:ANALYTICS_CONFIG.schemaVersion, occurredAtClient:new Date().toISOString(),
    visitorId:'v_12345678-test', sessionId:'s_12345678-test', pageViewId:`pv_${randomUUID()}`, tabId:'tab_12345678-test',
    pagePath:'/makijaz-permanentny-brwi/',
    consent:{necessary:true, analytics:true, marketing:false, personalization:false, policyVersion:'2'},
    eventProperties:{}, attributionContext:null, trackerVersion:ANALYTICS_CONFIG.trackerVersion,
    environment:'preview', ...overrides,
  };
}
export function request(raw: unknown, origin='https://preview-test.vercel.app') {
  return new Request('https://preview-test.vercel.app/api/analytics/collect', {
    method:'POST', headers:{origin,'content-type':'application/json'}, body:JSON.stringify(raw),
  });
}
