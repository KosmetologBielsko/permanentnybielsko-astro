import { ANALYTICS_CONFIG } from './config';
import { createId } from './ids';
import type { SessionState, VisitorState } from './types';
import { sanitizePath } from './url-sanitize';

export const SESSION_STORAGE_KEY = 'pa_session_v2';

export function isSessionExpired(session: SessionState, now = Date.now()): boolean {
  return now - session.lastActivityAt >= ANALYTICS_CONFIG.sessionTimeoutMs;
}

export function createSession(visitor: VisitorState, landingPath: string, now = Date.now()): SessionState {
  return {
    sessionId: createId('s'),
    visitorId: visitor.visitorId,
    startedAt: now,
    lastActivityAt: now,
    landingPath: sanitizePath(landingPath),
  };
}

export function loadOrCreateSession(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
  visitor: VisitorState,
  landingPath: string,
  now = Date.now(),
): { session: SessionState; isNew: boolean } {
  const existing = storage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as SessionState;
      if (
        parsed.visitorId === visitor.visitorId &&
        Number.isFinite(parsed.lastActivityAt) &&
        !isSessionExpired(parsed, now)
      ) {
        return { session: parsed, isNew: false };
      }
    } catch {
      // Replace invalid state.
    }
  }

  const session = createSession(visitor, landingPath, now);
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return { session, isNew: true };
}

export function touchSession(
  storage: Pick<Storage, 'setItem'>,
  session: SessionState,
  now = Date.now(),
): SessionState {
  const updated = { ...session, lastActivityAt: now };
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function forgetSession(storage: Pick<Storage, 'removeItem'>): void {
  storage.removeItem(SESSION_STORAGE_KEY);
}
