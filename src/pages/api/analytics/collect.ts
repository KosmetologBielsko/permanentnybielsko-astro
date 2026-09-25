import type { APIRoute } from 'astro';
import { handleCollectRequest } from '../../../lib/analytics/collect-handler';
import { createNeonAnalyticsStorage } from '../../../lib/analytics/neon-storage';

import { collectorEnabled } from '../../../lib/analytics/rollout';
import { safeStorageError } from '../../../lib/analytics/storage-error';

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
  const deploymentEnv = process.env.VERCEL_ENV ?? import.meta.env.VERCEL_ENV;
  if (!collectorEnabled({
    PUBLIC_PA_ENABLED: process.env.PUBLIC_PA_ENABLED ?? import.meta.env.PUBLIC_PA_ENABLED,
    VERCEL_ENV: deploymentEnv,
  })) {
    return new Response(null, { status: 404, headers: { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' } });
  }
  try {
    return await handleCollectRequest(request, { storage: getStorage(), environment: deploymentEnv === 'preview' ? 'preview' : 'development' });
  } catch (error) {
    console.error('[Permanentny Analytics] collector bootstrap error', safeStorageError(error));
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
