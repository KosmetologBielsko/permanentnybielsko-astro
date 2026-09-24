import type { APIRoute } from 'astro';
import { handleCollectRequest } from '../../../lib/analytics/collect-handler';
import { createNeonAnalyticsStorage } from '../../../lib/analytics/neon-storage';

export const prerender = false;

let cachedStorage: ReturnType<typeof createNeonAnalyticsStorage> | null = null;

function getStorage() {
  if (cachedStorage) return cachedStorage;
  const databaseUrl = process.env.DATABASE_URL ?? import.meta.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('PERMANENTNY_ANALYTICS_DATABASE_URL_MISSING');
  cachedStorage = createNeonAnalyticsStorage(databaseUrl);
  return cachedStorage;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    return await handleCollectRequest(request, { storage: getStorage() });
  } catch (error) {
    console.error('[Permanentny Analytics] collector bootstrap error', error instanceof Error ? error.message : 'unknown');
    return new Response(JSON.stringify({ error: 'collector_unavailable' }), {
      status: 503,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  }
};
