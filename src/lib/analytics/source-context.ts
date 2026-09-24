import { ANALYTICS_CONFIG } from './config';
import type { AttributionContext, CampaignParams, ClassifiedSource } from './types';
import { extractCampaignParams, hostnameMatches, isSameSiteHost, sanitizedReferrer } from './url-sanitize';

export function buildAttributionContext(
  landingUrl: string,
  referrer?: string | null,
  reasonHint: AttributionContext['reasonHint'] = 'document_entry',
): AttributionContext {
  const ref = sanitizedReferrer(referrer);
  return {
    referrerHost: ref.host,
    referrerPath: ref.path,
    campaignParams: extractCampaignParams(landingUrl),
    reasonHint,
  };
}

const AI_DOMAINS: Array<[string, string]> = [
  ['chatgpt.com', 'ChatGPT'],
  ['chat.openai.com', 'ChatGPT'],
  ['gemini.google.com', 'Gemini'],
  ['perplexity.ai', 'Perplexity'],
  ['copilot.microsoft.com', 'Copilot'],
  ['claude.ai', 'Claude'],
  ['poe.com', 'Poe'],
  ['meta.ai', 'Meta AI'],
  ['grok.com', 'Grok'],
  ['deepseek.com', 'DeepSeek'],
  ['you.com', 'You.com'],
];

const SOCIAL_DOMAINS: Array<[string, string]> = [
  ['instagram.com', 'Instagram'],
  ['facebook.com', 'Facebook'],
  ['fb.com', 'Facebook'],
  ['tiktok.com', 'Other Social'],
  ['x.com', 'Other Social'],
  ['t.co', 'Other Social'],
  ['linkedin.com', 'Other Social'],
  ['pinterest.com', 'Other Social'],
];

const OTHER_SEARCH_DOMAINS = [
  'duckduckgo.com',
  'search.yahoo.com',
  'yahoo.com',
  'ecosia.org',
  'yandex.com',
  'baidu.com',
];

function sourceForHost(host: string, rows: Array<[string, string]>): string | null {
  for (const [domain, source] of rows) {
    if (hostnameMatches(host, domain)) return source;
  }
  return null;
}

function isGoogle(host: string): boolean {
  return host === 'google.com' || host.startsWith('google.') || host.includes('.google.');
}

function isBing(host: string): boolean {
  return host === 'bing.com' || host.endsWith('.bing.com');
}

function cleanLower(value?: string): string {
  return (value || '').trim().toLowerCase();
}

function base(context: AttributionContext) {
  return {
    campaign: context.campaignParams.utm_campaign ?? null,
    rawReferrerHost: context.referrerHost,
    rawReferrerPath: context.referrerPath,
    campaignParams: context.campaignParams,
    classifierVersion: ANALYTICS_CONFIG.sourceClassifierVersion,
  };
}

export function classifyAttributionContext(
  context: AttributionContext,
  siteHostname: string,
): ClassifiedSource {
  const p: CampaignParams = context.campaignParams;
  const host = context.referrerHost;
  const common = base(context);

  if (context.reasonHint === 'inactivity_resume') {
    return { ...common, source: 'Direct', medium: 'none', channelGroup: 'direct', reason: 'inactivity_resume' };
  }

  if (p.has_gclid || p.has_gbraid || p.has_wbraid) {
    return { ...common, source: 'Google Ads', medium: 'cpc', channelGroup: 'paid_search', reason: 'google_paid_click_id_present' };
  }
  if (p.has_msclkid) {
    return { ...common, source: 'Microsoft Ads', medium: 'cpc', channelGroup: 'paid_search', reason: 'microsoft_paid_click_id_present' };
  }

  const us = cleanLower(p.utm_source);
  const um = cleanLower(p.utm_medium);
  if (us || um) {
    const label = p.utm_source?.trim() || 'Unknown UTM';
    const medium = p.utm_medium?.trim() || 'campaign';

    if (/^(cpc|ppc|paidsearch|paid_search)$/.test(um)) {
      return {
        ...common,
        source: us === 'google' ? 'Google Ads' : us === 'bing' || us === 'microsoft' ? 'Microsoft Ads' : label,
        medium,
        channelGroup: 'paid_search',
        reason: 'utm_paid_search',
      };
    }

    const aiMap: Record<string, string> = {
      chatgpt: 'ChatGPT',
      openai: 'ChatGPT',
      gemini: 'Gemini',
      perplexity: 'Perplexity',
      copilot: 'Copilot',
      claude: 'Claude',
      poe: 'Poe',
      'meta-ai': 'Meta AI',
      metaai: 'Meta AI',
      grok: 'Grok',
      deepseek: 'DeepSeek',
      you: 'You.com',
    };
    if (aiMap[us]) {
      return { ...common, source: aiMap[us], medium, channelGroup: 'ai', reason: 'utm_ai' };
    }

    if (us === 'instagram' || us === 'ig') {
      return { ...common, source: 'Instagram', medium, channelGroup: 'social', reason: 'utm_social' };
    }
    if (us === 'facebook' || us === 'fb') {
      return { ...common, source: 'Facebook', medium, channelGroup: 'social', reason: 'utm_social' };
    }

    return { ...common, source: label, medium, channelGroup: 'other', reason: 'utm_other' };
  }

  if (host) {
    if (isSameSiteHost(host, siteHostname)) {
      // Internal navigation is not an acquisition source.
      return { ...common, source: 'Internal', medium: 'internal', channelGroup: 'internal', reason: 'same_site_referrer' };
    }

    // Bing's AI experience can use bing.com/chat.
    if (isBing(host) && (context.referrerPath || '').startsWith('/chat')) {
      return { ...common, source: 'Copilot', medium: 'referral', channelGroup: 'ai', reason: 'bing_chat_referrer' };
    }

    const ai = sourceForHost(host, AI_DOMAINS);
    if (ai) {
      return { ...common, source: ai, medium: 'referral', channelGroup: 'ai', reason: 'known_ai_referrer' };
    }

    const social = sourceForHost(host, SOCIAL_DOMAINS);
    if (social) {
      return { ...common, source: social, medium: 'social', channelGroup: 'social', reason: 'known_social_referrer' };
    }

    if (isGoogle(host)) {
      return { ...common, source: 'Google Organic', medium: 'organic', channelGroup: 'organic_search', reason: 'google_referrer' };
    }
    if (isBing(host)) {
      return { ...common, source: 'Bing Organic', medium: 'organic', channelGroup: 'organic_search', reason: 'bing_referrer' };
    }
    if (OTHER_SEARCH_DOMAINS.some((domain) => hostnameMatches(host, domain))) {
      return { ...common, source: 'Other Search', medium: 'organic', channelGroup: 'organic_search', reason: 'other_search_referrer' };
    }

    return { ...common, source: host, medium: 'referral', channelGroup: 'referral', reason: 'external_referrer' };
  }

  return { ...common, source: 'Direct', medium: 'none', channelGroup: 'direct', reason: 'no_campaign_or_referrer' };
}

export function acquisitionSource(context: AttributionContext, siteHostname: string): ClassifiedSource {
  const classified = classifyAttributionContext(context, siteHostname);
  if (classified.channelGroup !== 'internal') return classified;
  return {
    ...classified,
    source: 'Direct',
    medium: 'none',
    channelGroup: 'direct',
    reason: 'same_site_referrer_new_session',
  };
}

export function hasExternalAttributionSignal(context: AttributionContext, siteHostname: string): boolean {
  if (Object.keys(context.campaignParams).length > 0) return true;
  if (!context.referrerHost) return false;
  return !isSameSiteHost(context.referrerHost, siteHostname);
}
