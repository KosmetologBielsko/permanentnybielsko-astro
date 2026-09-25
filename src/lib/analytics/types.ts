export type AnalyticsEnvironment = 'production' | 'preview' | 'development';
export type EventSource = 'client' | 'server' | 'derived';
export type PrivacyClass = 'standard' | 'sensitive';
export type PrivacyScope = 'pseudonymous' | 'aggregate_only';
export type PageType =
  | 'home'
  | 'service'
  | 'guide'
  | 'gallery'
  | 'pricing'
  | 'contact'
  | 'training'
  | 'campaign'
  | 'legal'
  | 'bridge'
  | 'other';

export type ChannelGroup =
  | 'paid_search'
  | 'organic_search'
  | 'ai'
  | 'social'
  | 'direct'
  | 'referral'
  | 'internal'
  | 'other';

export interface ConsentSnapshot {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  policyVersion: string;
}

export interface CampaignParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  has_gclid?: boolean;
  has_gbraid?: boolean;
  has_wbraid?: boolean;
  has_msclkid?: boolean;
}

export interface ClassifiedSource {
  source: string;
  medium: string;
  channelGroup: ChannelGroup;
  campaign: string | null;
  rawReferrerHost: string | null;
  rawReferrerPath: string | null;
  campaignParams: CampaignParams;
  classifierVersion: number;
  reason: string;
}

export interface PageDefinition {
  pageId: string;
  path: string;
  pageType: PageType;
  serviceKey?: string | null;
  privacyClass: PrivacyClass;
}

export interface AttributionContext {
  referrerHost: string | null;
  referrerPath: string | null;
  campaignParams: CampaignParams;
  reasonHint?: 'document_entry' | 'inactivity_resume' | 'consent_granted';
}

export type RawEventName =
  | 'session_start'
  | 'attribution_touch'
  | 'page_view'
  | 'scroll_25'
  | 'scroll_50'
  | 'scroll_75'
  | 'scroll_90'
  | 'scroll_100'
  | 'cta_click'
  | 'booksy_click'
  | 'phone_click'
  | 'form_start'
  | 'form_submit'
  | 'instagram_click'
  | 'facebook_click'
  | 'gallery_open'
  | 'gallery_image_view'
  | 'price_view'
  | 'outbound_click'
  | 'menu_click'
  | 'js_error'
  | 'resource_error'
  | 'web_vital';

export type DerivedEventName =
  | 'guide_view'
  | 'service_view'
  | 'guide_to_service'
  | 'service_to_gallery'
  | 'service_to_price'
  | 'quick_exit'
  | 'rage_click'
  | 'dead_click'
  | 'quick_back';

export type AnalyticsEventName = RawEventName | DerivedEventName;

export interface RawClientEventInput {
  eventId: string;
  eventName: RawEventName;
  eventVersion: number;
  schemaVersion: string;
  occurredAtClient: string;
  visitorId?: string | null;
  sessionId?: string | null;
  pageViewId?: string | null;
  tabId?: string | null;
  pagePath: string;
  consent: ConsentSnapshot;
  eventProperties?: Record<string, unknown>;
  attributionContext?: AttributionContext | null;
  trackerVersion: string;
  environment: AnalyticsEnvironment;
}

export interface NormalizedEvent extends RawClientEventInput {
  receivedAtServer: string;
  eventSource: EventSource;
  pageId: string;
  pageType: PageType;
  serviceKey: string | null;
  privacyScope: PrivacyScope;
  source: string | null;
  medium: string | null;
  channelGroup: ChannelGroup | null;
  campaign: string | null;
  sourceClassifierVersion: number | null;
  collectorVersion: string;
  receivedValid: boolean;
  validationErrorCode: string | null;
}

export interface VisitorState {
  visitorId: string;
  createdAt: number;
  firstSeenAt: number;
  lastSeenAt: number;
}

export interface SessionState {
  sessionId: string;
  visitorId: string;
  startedAt: number;
  lastActivityAt: number;
  landingPath: string;
}

export interface RuntimePage {
  pagePath: string;
  pageViewId: string;
  privacyClass: PrivacyClass;
  pageType: PageType;
  pageId: string;
  serviceKey: string | null;
}
