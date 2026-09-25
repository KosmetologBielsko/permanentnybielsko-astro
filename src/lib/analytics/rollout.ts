export interface RolloutEnvironment {
  PUBLIC_PA_ENABLED?: string;
  VERCEL_ENV?: string;
}

// Preview/development only. Production requires a separate reviewed rollout.
export function collectorEnabled(env: RolloutEnvironment): boolean {
  return env.PUBLIC_PA_ENABLED === 'true' &&
    (env.VERCEL_ENV === 'preview' || env.VERCEL_ENV === 'development' || !env.VERCEL_ENV);
}
