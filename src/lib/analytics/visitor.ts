import { createId } from './ids';
import type { ConsentSnapshot, VisitorState } from './types';

export const VISITOR_STORAGE_KEY = 'pa_visitor_v2';

export function createVisitor(now = Date.now()): VisitorState {
  return { visitorId: createId('v'), createdAt: now, firstSeenAt: now, lastSeenAt: now };
}

export function loadOrCreateVisitor(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
  consent: ConsentSnapshot,
  now = Date.now(),
): VisitorState | null {
  if (!consent.analytics) {
    storage.removeItem(VISITOR_STORAGE_KEY);
    return null;
  }

  const existing = storage.getItem(VISITOR_STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as VisitorState;
      if (
        typeof parsed.visitorId === 'string' &&
        Number.isFinite(parsed.createdAt) &&
        Number.isFinite(parsed.firstSeenAt)
      ) {
        const updated = { ...parsed, lastSeenAt: now };
        storage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
    } catch {
      // Replace corrupt local state with a fresh random ID.
    }
  }

  const created = createVisitor(now);
  storage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(created));
  return created;
}

export function forgetVisitor(storage: Pick<Storage, 'removeItem'>): void {
  storage.removeItem(VISITOR_STORAGE_KEY);
}
