import { ANALYTICS_CONFIG } from './config';
import type { CampaignParams } from './types';

function cleanCampaignValue(value: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, ANALYTICS_CONFIG.maxCampaignStringLength);
  return normalized || undefined;
}

export function extractCampaignParams(urlString: string): CampaignParams {
  const url = new URL(urlString);
  const output: CampaignParams = {};

  const source = cleanCampaignValue(url.searchParams.get('utm_source'));
  const medium = cleanCampaignValue(url.searchParams.get('utm_medium'));
  const campaign = cleanCampaignValue(url.searchParams.get('utm_campaign'));
  const content = cleanCampaignValue(url.searchParams.get('utm_content'));

  if (source) output.utm_source = source;
  if (medium) output.utm_medium = medium;
  if (campaign) output.utm_campaign = campaign;
  if (content) output.utm_content = content;

  // Click identifiers are deliberately reduced to presence flags.
  // Raw gclid/gbraid/wbraid/msclkid values are not stored by CORE.
  if (url.searchParams.has('gclid')) output.has_gclid = true;
  if (url.searchParams.has('gbraid')) output.has_gbraid = true;
  if (url.searchParams.has('wbraid')) output.has_wbraid = true;
  if (url.searchParams.has('msclkid')) output.has_msclkid = true;

  return output;
}

export function sanitizePath(path: string): string {
  const q = path.indexOf('?');
  const hash = path.indexOf('#');
  let cut = path.length;
  if (q >= 0) cut = Math.min(cut, q);
  if (hash >= 0) cut = Math.min(cut, hash);
  const clean = path.slice(0, cut) || '/';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.length > 1 && !withSlash.endsWith('/') && !/\.[a-z0-9]{1,8}$/i.test(withSlash)
    ? `${withSlash}/`
    : withSlash;
}

export function sanitizedReferrer(referrer?: string | null): { host: string | null; path: string | null } {
  if (!referrer) return { host: null, path: null };
  try {
    const url = new URL(referrer);
    return {
      host: url.hostname.toLowerCase().slice(0, 253),
      path: sanitizePath(url.pathname).slice(0, 1024),
    };
  } catch {
    return { host: null, path: null };
  }
}

export function hostnameMatches(host: string, domain: string): boolean {
  const h = host.toLowerCase().replace(/\.$/, '');
  const d = domain.toLowerCase().replace(/\.$/, '');
  return h === d || h.endsWith(`.${d}`);
}

export function isSameSiteHost(host: string | null | undefined, canonicalHost: string): boolean {
  if (!host) return false;
  return hostnameMatches(host, canonicalHost.replace(/^www\./, ''));
}
