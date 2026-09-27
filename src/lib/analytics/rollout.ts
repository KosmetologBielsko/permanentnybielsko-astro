export interface RolloutEnvironment {
  PUBLIC_PA_ENABLED?: string;
  PUBLIC_PA_PRODUCTION_ENABLED?: string;
  VERCEL_ENV?: string;
}

// Both switches must be explicitly enabled for the reviewed production rollout.
export function collectorEnabled(env: RolloutEnvironment): boolean {
  if (env.PUBLIC_PA_ENABLED !== 'true') return false;
  if (env.VERCEL_ENV === 'production') return env.PUBLIC_PA_PRODUCTION_ENABLED === 'true';
  return env.VERCEL_ENV === 'preview' || env.VERCEL_ENV === 'development' || !env.VERCEL_ENV;
}

export function analyticsEnvironment(environment?: string): 'production' | 'preview' | 'development' {
  if (environment === 'production' || environment === 'preview') return environment;
  return 'development';
}
