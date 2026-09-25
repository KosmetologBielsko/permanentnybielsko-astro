import type { RawClientEventInput } from './types';

export function semanticDedupeKey(event: RawClientEventInput): string | null {
  const pageViewId = event.pageViewId;

  if (event.eventName === 'session_start') {
    return event.sessionId ? `session_start:${event.sessionId}` : null;
  }
  if (event.eventName === 'page_view') return `page_view:${pageViewId}`;
  if (/^scroll_(25|50|75|90|100)$/.test(event.eventName)) {
    return `${event.eventName}:${pageViewId}`;
  }
  if (event.eventName === 'price_view') {
    const section = String(event.eventProperties?.price_section_id ?? 'default');
    return `price_view:${pageViewId}:${section}`;
  }
  if (event.eventName === 'form_start') {
    const form = String(event.eventProperties?.form_id ?? 'default');
    return `form_start:${pageViewId}:${form}`;
  }
  return null;
}
