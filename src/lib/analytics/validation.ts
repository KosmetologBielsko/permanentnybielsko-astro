import { ANALYTICS_CONFIG } from './config';
import { isRawClientEvent } from './event-dictionary';
import type { AttributionContext, CampaignParams, RawClientEventInput } from './types';
import { sanitizePath } from './url-sanitize';

const LINKED_ID_PATTERN = /^[a-z]{1,3}_[A-Za-z0-9-]{8,128}$/;
const EVENT_ID_PATTERN = /^e_[A-Za-z0-9-]{8,160}$/;
const PAGE_VIEW_ID_PATTERN = /^pv_[A-Za-z0-9-]{8,160}$/;

const ALLOWED_PROPERTY_KEYS: Record<string, Set<string>> = {
  session_start: new Set(['landing_path', 'start_reason']),
  attribution_touch: new Set(['landing_path']),
  page_view: new Set(['navigation_type']),
  cta_click: new Set(['cta_id', 'placement', 'service_key', 'is_cta']),
  booksy_click: new Set(['placement', 'service_key', 'is_cta', 'target_host']),
  phone_click: new Set(['placement', 'service_key', 'is_cta']),
  form_start: new Set(['form_id']),
  form_submit: new Set(['form_id']),
  instagram_click: new Set(['placement', 'target_host']),
  facebook_click: new Set(['placement', 'target_host']),
  gallery_open: new Set(['gallery_id', 'service_key']),
  gallery_image_view: new Set(['gallery_id', 'asset_id', 'service_key', 'asset_kind']),
  price_view: new Set(['price_section_id', 'service_key']),
  outbound_click: new Set(['placement', 'target_host', 'target_category']),
  menu_click: new Set(['item_id', 'target_path']),
  js_error: new Set(['error_type', 'message_code', 'script_path', 'line', 'column']),
  resource_error: new Set(['resource_type', 'resource_host', 'resource_path']),
  web_vital: new Set(['metric', 'value', 'rating', 'navigation_type']),
  scroll_25: new Set(),
  scroll_50: new Set(),
  scroll_75: new Set(),
  scroll_90: new Set(),
  scroll_100: new Set(),
};

const CAMPAIGN_STRING_KEYS: (keyof CampaignParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
];
const CAMPAIGN_BOOL_KEYS: (keyof CampaignParams)[] = [
  'has_gclid',
  'has_gbraid',
  'has_wbraid',
  'has_msclkid',
];

function sanitizeAttributionContext(value: unknown): AttributionContext | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Partial<AttributionContext>;
  const params: CampaignParams = {};

  if (v.campaignParams && typeof v.campaignParams === 'object') {
    const source = v.campaignParams as Record<string, unknown>;
    for (const key of CAMPAIGN_STRING_KEYS) {
      const raw = source[key];
      if (typeof raw === 'string' && raw.trim()) {
        (params as Record<string, unknown>)[key] = raw
          .replace(/[\u0000-\u001f\u007f]/g, '')
          .trim()
          .slice(0, ANALYTICS_CONFIG.maxCampaignStringLength);
      }
    }
    for (const key of CAMPAIGN_BOOL_KEYS) {
      if (source[key] === true) (params as Record<string, unknown>)[key] = true;
    }
  }

  const host =
    typeof v.referrerHost === 'string'
      ? v.referrerHost.toLowerCase().replace(/[^a-z0-9.:-]/g, '').slice(0, 253)
      : null;
  const path =
    typeof v.referrerPath === 'string'
      ? sanitizePath(v.referrerPath).slice(0, 1024)
      : null;
  const reasonHint =
    v.reasonHint === 'inactivity_resume' ||
    v.reasonHint === 'consent_granted' ||
    v.reasonHint === 'document_entry'
      ? v.reasonHint
      : undefined;

  return { referrerHost: host, referrerPath: path, campaignParams: params, reasonHint };
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  sanitized?: RawClientEventInput;
}

function sanitizeProperties(
  eventName: string,
  properties: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!properties) return {};
  const allowed = ALLOWED_PROPERTY_KEYS[eventName] ?? new Set<string>();
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (!allowed.has(key)) continue;
    if (typeof value === 'string') {
      output[key] = value
        .replace(/[\u0000-\u001f\u007f]/g, '')
        .slice(0, ANALYTICS_CONFIG.maxPropertyStringLength);
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      output[key] = value;
    } else if (typeof value === 'boolean') {
      output[key] = value;
    }
  }
  return output;
}

export function validateClientEvent(input: unknown, nowMs = Date.now()): ValidationResult {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') return { ok: false, errors: ['body_not_object'] };

  const event = input as Partial<RawClientEventInput>;

  if (typeof event.eventId !== 'string' || !EVENT_ID_PATTERN.test(event.eventId)) {
    errors.push('invalid_event_id');
  }
  if (typeof event.eventName !== 'string' || !isRawClientEvent(event.eventName)) {
    errors.push('unknown_event_name');
  }
  if (event.eventVersion !== 1) errors.push('event_version_mismatch');
  if (event.schemaVersion !== ANALYTICS_CONFIG.schemaVersion) errors.push('schema_version_mismatch');

  const clientTime = typeof event.occurredAtClient === 'string' ? Date.parse(event.occurredAtClient) : NaN;
  if (!Number.isFinite(clientTime)) {
    errors.push('invalid_client_time');
  } else {
    if (clientTime - nowMs > ANALYTICS_CONFIG.allowedClockSkewFutureMs) errors.push('client_time_too_far_future');
    if (nowMs - clientTime > ANALYTICS_CONFIG.maxClientEventAgeMs) errors.push('client_event_too_old');
  }

  if (typeof event.pagePath !== 'string' || event.pagePath.length > 2048) errors.push('invalid_page_path');

  if (
    !event.consent ||
    event.consent.necessary !== true ||
    event.consent.analytics !== true ||
    typeof event.consent.marketing !== 'boolean' ||
    typeof event.consent.personalization !== 'boolean' ||
    event.consent.policyVersion !== ANALYTICS_CONFIG.consentPolicyVersion
  ) {
    errors.push('analytics_consent_missing_or_policy_mismatch');
  }

  if (event.visitorId != null && (typeof event.visitorId !== 'string' || !LINKED_ID_PATTERN.test(event.visitorId))) {
    errors.push('invalid_visitor_id');
  }
  if (event.sessionId != null && (typeof event.sessionId !== 'string' || !LINKED_ID_PATTERN.test(event.sessionId))) {
    errors.push('invalid_session_id');
  }
  if (event.tabId != null && (typeof event.tabId !== 'string' || !LINKED_ID_PATTERN.test(event.tabId))) {
    errors.push('invalid_tab_id');
  }
  if (typeof event.pageViewId !== 'string' || !PAGE_VIEW_ID_PATTERN.test(event.pageViewId)) {
    errors.push('invalid_page_view_id');
  }

  if (
    event.environment !== 'production' &&
    event.environment !== 'preview' &&
    event.environment !== 'development'
  ) {
    errors.push('invalid_environment');
  }

  if (errors.length || typeof event.eventName !== 'string') return { ok: false, errors };

  const sanitized: RawClientEventInput = {
    ...(event as RawClientEventInput),
    pagePath: sanitizePath(event.pagePath!),
    eventProperties: sanitizeProperties(event.eventName, event.eventProperties),
    attributionContext:
      event.eventName === 'session_start' || event.eventName === 'attribution_touch'
        ? sanitizeAttributionContext(event.attributionContext)
        : null,
  };

  return { ok: true, errors: [], sanitized };
}
