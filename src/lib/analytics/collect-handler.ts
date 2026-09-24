import { ANALYTICS_CONFIG } from './config';
import { normalizeCollectedEvent } from './collect-core';
import { semanticDedupeKey } from './dedupe';
import { DEFAULT_PAGE_CATALOG, type PageCatalog } from './page-catalog';
import type { AnalyticsStorage } from './storage';

export interface CollectHandlerDeps {
  storage: AnalyticsStorage;
  pageCatalog?: PageCatalog;
  allowedHosts?: string[];
}

function json(body: unknown, status = 200, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      ...extra,
    },
  });
}

function requestOriginAllowed(request: Request, allowedHosts: string[]): boolean {
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');

  if (origin) {
    try {
      const originHost = new URL(origin).hostname.toLowerCase();
      const requestHost = new URL(request.url).hostname.toLowerCase();

      // Allow exact same-origin requests, including ephemeral Vercel Preview hosts.
      // Production remains protected because foreign origins still do not match.
      return originHost === requestHost || allowedHosts.includes(originHost);
    } catch {
      return false;
    }
  }

  // Browser same-origin requests may omit Origin in some cases.
  return fetchSite === 'same-origin' || fetchSite === 'same-site';
}

export async function handleCollectRequest(request: Request, deps: CollectHandlerDeps): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405, { allow: 'POST' });
  }

  const allowedHosts = deps.allowedHosts ?? [
    ANALYTICS_CONFIG.siteHostname,
    ...ANALYTICS_CONFIG.alternateSiteHostnames,
  ];
  if (!requestOriginAllowed(request, allowedHosts)) return json({ error: 'origin_not_allowed' }, 403);

  let rawText = '';
  try {
    rawText = await request.text();
  } catch {
    return json({ error: 'body_read_failed' }, 400);
  }

  const bytes = new TextEncoder().encode(rawText).byteLength;
  if (bytes < 2 || bytes > ANALYTICS_CONFIG.maxEventBodyBytes) {
    return json({ error: 'payload_size_invalid' }, bytes > ANALYTICS_CONFIG.maxEventBodyBytes ? 413 : 400);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const candidate = parsed as { events?: unknown[] };
  const events = Array.isArray(candidate?.events) ? candidate.events : [parsed];
  if (events.length < 1 || events.length > ANALYTICS_CONFIG.maxBatchSize) {
    return json({ error: 'invalid_batch_size' }, 400);
  }

  let accepted = 0;
  let duplicates = 0;
  let rejected = 0;
  const catalog = deps.pageCatalog ?? DEFAULT_PAGE_CATALOG;

  for (const raw of events) {
    const normalized = normalizeCollectedEvent(raw, catalog);
    if (!normalized.ok) {
      rejected += 1;
      try {
        await deps.storage.recordDataQuality({
          occurredAt: new Date().toISOString(),
          code: 'schema_validation_error',
          detail: { errors: normalized.errors.slice(0, 10) },
        });
      } catch {
        // Quality logging must never turn a client validation error into a collector outage.
      }
      continue;
    }

    const semanticKey = semanticDedupeKey(normalized.event);
    try {
      const result = await deps.storage.insertRawEvent(normalized.event, semanticKey);
      if (result === 'inserted') accepted += 1;
      else {
        duplicates += 1;
        if (result === 'duplicate_semantic') {
          try {
            await deps.storage.recordDataQuality({
              occurredAt: new Date().toISOString(),
              code: 'duplicate_semantic_event',
              detail: { event_name: normalized.event.eventName },
            });
          } catch {}
        }
      }
    } catch {
      try {
        await deps.storage.recordDataQuality({
          occurredAt: new Date().toISOString(),
          code: 'collector_storage_error',
        });
      } catch {}
      return json({ accepted, duplicates, rejected, error: 'storage_unavailable' }, 503);
    }
  }

  return json(
    { accepted, duplicates, rejected },
    rejected > 0 && accepted === 0 && duplicates === 0 ? 422 : 202,
  );
}
