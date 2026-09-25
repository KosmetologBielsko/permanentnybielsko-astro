import { ANALYTICS_CONFIG } from './config';
import { DEFAULT_PAGE_CATALOG, resolvePage, type PageCatalog } from './page-catalog';
import { acquisitionSource, classifyAttributionContext } from './source-context';
import type { NormalizedEvent, RawClientEventInput } from './types';
import { validateClientEvent } from './validation';
import { isSameSiteHost } from './url-sanitize';

export type NormalizeResult =
  | { ok: true; event: NormalizedEvent }
  | { ok: false; errors: string[] };

function sensitiveProperties(event: RawClientEventInput): Record<string, unknown> {
  // Sensitive URLs may be counted in aggregate, but no cross-page identity/profile is retained.
  // Only performance measurements keep minimal numeric properties.
  if (event.eventName !== 'web_vital') return {};
  const p = event.eventProperties ?? {};
  return {
    ...(typeof p.metric === 'string' ? { metric: p.metric } : {}),
    ...(typeof p.value === 'number' ? { value: p.value } : {}),
    ...(typeof p.rating === 'string' ? { rating: p.rating } : {}),
  };
}

export function normalizeCollectedEvent(
  raw: unknown,
  catalog: PageCatalog = DEFAULT_PAGE_CATALOG,
  now = new Date(),
): NormalizeResult {
  const validation = validateClientEvent(raw, now.getTime());
  if (!validation.ok || !validation.sanitized) {
    return { ok: false, errors: validation.errors };
  }

  const input = validation.sanitized;
  if (input.attributionContext?.referrerHost && isSameSiteHost(input.attributionContext.referrerHost, ANALYTICS_CONFIG.siteHostname)) {
    input.attributionContext.referrerHost = null;
    input.attributionContext.referrerPath = null;
  }
  const targetPath = input.eventProperties?.target_path;
  if (typeof targetPath === 'string' && resolvePage(catalog, targetPath).privacyClass === 'sensitive') {
    input.eventProperties = {};
  }
  const page = resolvePage(catalog, input.pagePath);
  const sensitive = page.privacyClass === 'sensitive';

  let source = null;
  let medium = null;
  let channelGroup = null;
  let campaign = null;
  let sourceClassifierVersion = null;

  if (!sensitive && input.attributionContext && (input.eventName === 'session_start' || input.eventName === 'attribution_touch')) {
    const classified =
      input.eventName === 'session_start'
        ? acquisitionSource(input.attributionContext, ANALYTICS_CONFIG.siteHostname)
        : classifyAttributionContext(input.attributionContext, ANALYTICS_CONFIG.siteHostname);
    source = classified.source;
    medium = classified.medium;
    channelGroup = classified.channelGroup;
    campaign = classified.campaign;
    sourceClassifierVersion = classified.classifierVersion;
  }

  const event: NormalizedEvent = {
    ...input,
    visitorId: sensitive ? null : input.visitorId ?? null,
    sessionId: sensitive ? null : input.sessionId ?? null,
    // pageViewId intentionally stays: it is ephemeral and is needed only for within-page
    // semantic deduplication. It never links the sensitive page to a visitor/session.
    pageViewId: input.pageViewId!,
    tabId: sensitive ? null : input.tabId ?? null,
    attributionContext: sensitive ? null : input.attributionContext ?? null,
    eventProperties: sensitive ? sensitiveProperties(input) : input.eventProperties ?? {},
    receivedAtServer: now.toISOString(),
    eventSource: 'client',
    pageId: page.pageId,
    pageType: page.pageType,
    serviceKey: sensitive ? null : page.serviceKey ?? null,
    privacyScope: sensitive ? 'aggregate_only' : 'pseudonymous',
    source,
    medium,
    channelGroup,
    campaign,
    sourceClassifierVersion,
    collectorVersion: ANALYTICS_CONFIG.collectorVersion,
    receivedValid: true,
    validationErrorCode: null,
  };

  return { ok: true, event };
}
