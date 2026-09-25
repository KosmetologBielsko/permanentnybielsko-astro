import type { ClassifiedSource } from './types';
import { buildAttributionContext, classifyAttributionContext } from './source-context';

export function classifySource(input: {
  landingUrl: string;
  referrer?: string | null;
  siteHostname: string;
}): ClassifiedSource {
  return classifyAttributionContext(
    buildAttributionContext(input.landingUrl, input.referrer),
    input.siteHostname,
  );
}
