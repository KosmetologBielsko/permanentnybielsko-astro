import type { AnalyticsEventName, RawEventName } from './types';

export type EventStage = 'core' | 'replay_1b' | 'derived';
export type ConversionClass = 'primary' | 'micro' | 'none';

export interface EventDefinition {
  name: AnalyticsEventName;
  emittedBy: 'client' | 'server' | 'derived';
  stage: EventStage;
  conversion: ConversionClass;
  description: string;
}

export const EVENT_DICTIONARY: Record<AnalyticsEventName, EventDefinition> = {
  session_start: { name: 'session_start', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Starts a consented pseudonymous session and carries sanitized entry attribution.' },
  attribution_touch: { name: 'attribution_touch', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'New external/campaign touch without forcing a new session.' },
  page_view: { name: 'page_view', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'One logical document display.' },
  scroll_25: { name: 'scroll_25', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Viewport reached at least 25% of document content.' },
  scroll_50: { name: 'scroll_50', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Viewport reached at least 50% of document content.' },
  scroll_75: { name: 'scroll_75', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Viewport reached at least 75% of document content.' },
  scroll_90: { name: 'scroll_90', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Viewport reached at least 90% of document content.' },
  scroll_100: { name: 'scroll_100', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Viewport reached the end of document content.' },
  cta_click: { name: 'cta_click', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Explicit generic CTA only when no more specific event applies.' },
  booksy_click: { name: 'booksy_click', emittedBy: 'client', stage: 'core', conversion: 'primary', description: 'Outbound intent to Booksy; never a confirmed booking.' },
  phone_click: { name: 'phone_click', emittedBy: 'client', stage: 'core', conversion: 'primary', description: 'Activation of a tel: link.' },
  form_start: { name: 'form_start', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'First form interaction; field values are never captured.' },
  form_submit: { name: 'form_submit', emittedBy: 'client', stage: 'core', conversion: 'primary', description: 'Confirmed successful form submission.' },
  instagram_click: { name: 'instagram_click', emittedBy: 'client', stage: 'core', conversion: 'micro', description: 'Outbound click to Instagram.' },
  facebook_click: { name: 'facebook_click', emittedBy: 'client', stage: 'core', conversion: 'micro', description: 'Outbound click to Facebook.' },
  gallery_open: { name: 'gallery_open', emittedBy: 'client', stage: 'core', conversion: 'micro', description: 'Gallery/lightbox successfully opened.' },
  gallery_image_view: { name: 'gallery_image_view', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'A gallery image/video became the active item.' },
  price_view: { name: 'price_view', emittedBy: 'client', stage: 'core', conversion: 'micro', description: 'A configured price block was meaningfully visible for at least 1 second.' },
  outbound_click: { name: 'outbound_click', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Outbound click not represented by Booksy/social-specific events.' },
  menu_click: { name: 'menu_click', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Internal site navigation click in header/menu.' },
  js_error: { name: 'js_error', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Uncaught JS error or unhandled rejection after redaction/hashing.' },
  resource_error: { name: 'resource_error', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'Failed browser resource load with sanitized static path.' },
  web_vital: { name: 'web_vital', emittedBy: 'client', stage: 'core', conversion: 'none', description: 'RUM metric LCP, INP, CLS or TTFB.' },

  guide_view: { name: 'guide_view', emittedBy: 'derived', stage: 'derived', conversion: 'none', description: 'Derived from page_view where page_type=guide.' },
  service_view: { name: 'service_view', emittedBy: 'derived', stage: 'derived', conversion: 'none', description: 'Derived from page_view where page_type=service.' },
  guide_to_service: { name: 'guide_to_service', emittedBy: 'derived', stage: 'derived', conversion: 'micro', description: 'Consecutive consented page views: guide to service.' },
  service_to_gallery: { name: 'service_to_gallery', emittedBy: 'derived', stage: 'derived', conversion: 'micro', description: 'Consecutive consented page views: service to gallery.' },
  service_to_price: { name: 'service_to_price', emittedBy: 'derived', stage: 'derived', conversion: 'micro', description: 'Service to pricing page, or configured price_view on service page.' },
  quick_exit: { name: 'quick_exit', emittedBy: 'derived', stage: 'derived', conversion: 'none', description: 'Versioned short-session heuristic.' },
  rage_click: { name: 'rage_click', emittedBy: 'derived', stage: 'replay_1b', conversion: 'none', description: 'Repeated-click heuristic; Stage 1B.' },
  dead_click: { name: 'dead_click', emittedBy: 'derived', stage: 'replay_1b', conversion: 'none', description: 'No-effect click heuristic; Stage 1B.' },
  quick_back: { name: 'quick_back', emittedBy: 'derived', stage: 'replay_1b', conversion: 'none', description: 'Navigation heuristic; Stage 1B.' },
};

export const RAW_CLIENT_EVENTS = Object.values(EVENT_DICTIONARY)
  .filter((event) => event.emittedBy === 'client')
  .map((event) => event.name) as RawEventName[];

export function isRawClientEvent(value: string): value is RawEventName {
  return RAW_CLIENT_EVENTS.includes(value as RawEventName);
}
