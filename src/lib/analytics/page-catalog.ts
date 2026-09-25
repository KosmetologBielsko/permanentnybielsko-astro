import type { PageDefinition } from './types';
import { sanitizePath } from './url-sanitize';

export interface PageCatalog {
  byPath: Map<string, PageDefinition>;
}

export function createPageCatalog(definitions: PageDefinition[]): PageCatalog {
  return {
    byPath: new Map(
      definitions.map((p) => [sanitizePath(p.path), { ...p, path: sanitizePath(p.path) }]),
    ),
  };
}

const SENSITIVE_GUIDE_SLUGS = new Set([
  'botoks-a-makijaz-permanentny-brwi',
  'kwas-hialuronowy-w-ustach-a-makijaz-permanentny',
  'makijaz-permanentny-a-rezonans-magnetyczny-mri',
  'makijaz-permanentny-na-bliznie',
  'opryszczka-a-makijaz-permanentny-ust',
  'przeciwwskazania-do-makijazu-permanentnego',
  'reakcja-alergiczna-czy-normalne-gojenie-po-pmu',
  'retinol-kwasy-a-makijaz-permanentny',
  'skutki-uboczne-makijazu-permanentnego-brwi',
]);

const FUTURE_SENSITIVE_GUIDE_PATTERN =
  /(onkolog|alopec|chorob|leki?|cukrzyc|ciaz|nowotwor|chemioter|radioter|autoimmun|zdrow)/i;

function guideServiceKey(slug: string): string {
  if (/szkol|kurs/.test(slug)) return 'training';
  if (/usta|opryszcz|hialuron/.test(slug)) return 'lips';
  if (/kres|oczu|powiek|rzes/.test(slug)) return 'eyes';
  if (/usun|laser|stary|nieudany/.test(slug)) return 'removal';
  if (/brwi|microblad|wlosk|piork|silky/.test(slug)) return 'brows';
  return 'pmu';
}

function guidePrivacyClass(slug: string): 'standard' | 'sensitive' {
  return SENSITIVE_GUIDE_SLUGS.has(slug) || FUTURE_SENSITIVE_GUIDE_PATTERN.test(slug)
    ? 'sensitive'
    : 'standard';
}

export function resolvePage(catalog: PageCatalog, path: string): PageDefinition {
  const clean = sanitizePath(path);
  const exact = catalog.byPath.get(clean);
  if (exact) return exact;

  if (clean.startsWith('/poradnik/') && clean !== '/poradnik/') {
    const slug = clean.slice('/poradnik/'.length).replace(/\/$/, '') || 'unknown';
    return {
      pageId: `guide:${slug}`,
      path: clean,
      pageType: 'guide',
      serviceKey: guideServiceKey(slug),
      privacyClass: guidePrivacyClass(slug),
    };
  }

  return {
    pageId: `unknown:${clean}`,
    path: clean,
    pageType: 'other',
    serviceKey: null,
    privacyClass: 'standard',
  };
}

export const DEFAULT_PAGE_CATALOG = createPageCatalog([
  { pageId: 'home', path: '/', pageType: 'home', serviceKey: 'pmu', privacyClass: 'standard' },
  { pageId: 'service:pmu', path: '/makijaz-permanentny-bielsko/', pageType: 'service', serviceKey: 'pmu', privacyClass: 'standard' },
  { pageId: 'service:brows', path: '/makijaz-permanentny-brwi/', pageType: 'service', serviceKey: 'brows', privacyClass: 'standard' },
  { pageId: 'service:lips', path: '/makijaz-permanentny-ust/', pageType: 'service', serviceKey: 'lips', privacyClass: 'standard' },
  { pageId: 'service:eyes', path: '/makijaz-permanentny-oczu/', pageType: 'service', serviceKey: 'eyes', privacyClass: 'standard' },
  { pageId: 'service:removal', path: '/usuwanie-makijazu-permanentnego/', pageType: 'service', serviceKey: 'removal', privacyClass: 'standard' },
  { pageId: 'training:pmu', path: '/szkolenie-makijaz-permanentny/', pageType: 'training', serviceKey: 'training', privacyClass: 'standard' },
  { pageId: 'training:legacy', path: '/szkolenia/', pageType: 'training', serviceKey: 'training', privacyClass: 'standard' },
  { pageId: 'gallery', path: '/galeria/', pageType: 'gallery', serviceKey: 'pmu', privacyClass: 'standard' },
  { pageId: 'pricing:pmu', path: '/cennik-makijaz-permanentny/', pageType: 'pricing', serviceKey: 'pmu', privacyClass: 'standard' },
  { pageId: 'contact', path: '/kontakt/', pageType: 'contact', serviceKey: 'pmu', privacyClass: 'standard' },
  { pageId: 'guide:index', path: '/poradnik/', pageType: 'guide', serviceKey: 'pmu', privacyClass: 'standard' },
  { pageId: 'campaign:sercemmalowane', path: '/sercemmalowane/', pageType: 'campaign', serviceKey: null, privacyClass: 'sensitive' },

  { pageId: 'legal:privacy', path: '/rodo-polityka-prywatnosci-regulamin/', pageType: 'legal', serviceKey: null, privacyClass: 'standard' },
  { pageId: 'legal:terms', path: '/regulamin-salonu/', pageType: 'legal', serviceKey: null, privacyClass: 'standard' },

  { pageId: 'bridge:cosmetology', path: '/kosmetologia-estetyczna/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
  { pageId: 'bridge:cosmetics', path: '/kosmetyka/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
  { pageId: 'bridge:biostimulators', path: '/biostymulatory-odnowa-skory/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
  { pageId: 'bridge:mesotherapy', path: '/mezoterapia/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
  { pageId: 'bridge:peeling', path: '/peeling-medyczny/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
  { pageId: 'bridge:skinpen', path: '/skinpen-kosmetolog-bielsko-biala/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
  { pageId: 'bridge:cosmetology-pricing', path: '/cennik-kosmetologia-estetyczna/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
  { pageId: 'bridge:cosmetics-pricing', path: '/cennik-kosmetyka/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
  { pageId: 'bridge:legacy-offer', path: '/oferta-permanentny-kosmetolog/', pageType: 'bridge', serviceKey: 'pmu', privacyClass: 'standard' },
  { pageId: 'bridge:legacy-eyes', path: '/trwaly-i-estetyczny-makijaz-permanentny-oczu/', pageType: 'bridge', serviceKey: 'eyes', privacyClass: 'standard' },

  // Redirect endpoints can still appear in technical traffic; client tracking normally never executes on them.
  { pageId: 'redirect:cennik', path: '/cennik/', pageType: 'other', serviceKey: 'pmu', privacyClass: 'standard' },
  { pageId: 'redirect:lips3', path: '/makijaz-permanentny-ust3/', pageType: 'other', serviceKey: 'lips', privacyClass: 'standard' },
  { pageId: 'redirect:face', path: '/zabiegi-na-twarz-bielsko-biala/', pageType: 'bridge', serviceKey: 'cosmetology', privacyClass: 'standard' },
]);
