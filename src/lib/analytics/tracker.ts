import { ANALYTICS_CONFIG } from './config';
import {
  canCollectClientAnalytics,
  CONSENT_CHANGED_EVENT,
} from './consent';
import { createId } from './ids';
import { DEFAULT_PAGE_CATALOG, resolvePage, type PageCatalog } from './page-catalog';
import {
  buildAttributionContext,
  hasExternalAttributionSignal,
} from './source-context';
import {
  createSession,
  forgetSession,
  isSessionExpired,
  loadOrCreateSession,
  touchSession,
} from './session';
import type {
  ConsentSnapshot,
  RawClientEventInput,
  RawEventName,
  RuntimePage,
  SessionState,
  VisitorState,
} from './types';
import { sanitizePath } from './url-sanitize';
import { forgetVisitor, loadOrCreateVisitor } from './visitor';

const TAB_STORAGE_KEY = 'pa_tab_v2';
const TECHNICAL_EVENTS = new Set<RawEventName>(['js_error', 'resource_error', 'web_vital']);
const SESSION_META_EVENTS = new Set<RawEventName>(['session_start', 'attribution_touch']);

export interface PermanentnyAnalyticsInit {
  getConsent: () => ConsentSnapshot;
  endpoint?: string;
  pageCatalog?: PageCatalog;
  environment?: 'production' | 'preview' | 'development';
}

interface LinkedRuntime extends RuntimePage {
  privacyClass: 'standard';
  visitor: VisitorState;
  session: SessionState;
  tabId: string;
}

interface AggregateRuntime extends RuntimePage {
  privacyClass: 'sensitive';
  visitor: null;
  session: null;
  tabId: null;
}

type RuntimeState = LinkedRuntime | AggregateRuntime;

function getOrCreateTabId(): string {
  try {
    const existing = sessionStorage.getItem(TAB_STORAGE_KEY);
    if (existing) return existing;
    const id = createId('tab');
    sessionStorage.setItem(TAB_STORAGE_KEY, id);
    return id;
  } catch {
    return createId('tab');
  }
}

function safeStorageGet(storage: 'sessionStorage', key: string): string | null {
  try { return window[storage].getItem(key); } catch { return null; }
}
function safeStorageSet(storage: 'sessionStorage', key: string, value: string): void {
  try { window[storage].setItem(key, value); } catch {}
}
function safeStorageRemove(storage: 'sessionStorage', key: string): void {
  try { window[storage].removeItem(key); } catch {}
}

function isHost(host: string | null, domain: string): boolean {
  return !!host && (host === domain || host.endsWith(`.${domain}`));
}

function anchorTarget(anchor: HTMLAnchorElement) {
  try {
    const url = new URL(anchor.href, location.href);
    return {
      host: url.hostname.toLowerCase(),
      path: sanitizePath(url.pathname),
      protocol: url.protocol,
    };
  } catch {
    return { host: null, path: null, protocol: '' };
  }
}

function inferPlacement(el: Element): string {
  const explicit = el.closest<HTMLElement>('[data-analytics-placement]')?.dataset.analyticsPlacement;
  if (explicit) return explicit.slice(0, 80);
  if (el.closest('header')) return 'header';
  if (el.closest('footer')) return 'footer';
  if (el.closest('nav')) return 'navigation';
  const section = el.closest<HTMLElement>('section[id], article[id], [data-section-id]');
  const id = section?.id || section?.dataset.sectionId;
  return id ? `section:${id}`.slice(0, 120) : 'content';
}

function assetIdFromUrl(value: string): string {
  try {
    const path = new URL(value, location.href).pathname;
    const base = path.split('/').filter(Boolean).pop() || 'asset';
    return base.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 160) || 'asset';
  } catch {
    return 'asset';
  }
}

function hashString(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  return (hash >>> 0).toString(36);
}

export function initPermanentnyAnalytics(options: PermanentnyAnalyticsInit) {
  const endpoint = options.endpoint ?? '/api/analytics/collect';
  const catalog = options.pageCatalog ?? DEFAULT_PAGE_CATALOG;
  const environment =
    options.environment ??
    (location.hostname.endsWith('.vercel.app')
      ? 'preview'
      : location.hostname === 'localhost' || location.hostname === '127.0.0.1'
        ? 'development'
        : 'production');

  let runtime: RuntimeState | null = null;
  let queue: RawClientEventInput[] = [];
  let flushTimer: number | null = null;
  let webVitalsStarted = false;
  let destroyed = false;
  let pageCleanup: Array<() => void> = [];
  let lastBeginHref = '';
  let lastBeginAt = 0;

  function getConsent(): ConsentSnapshot {
    return options.getConsent();
  }

  function persistPending(): void {
    const consent = getConsent();
    if (!canCollectClientAnalytics(consent)) {
      safeStorageRemove('sessionStorage', ANALYTICS_CONFIG.pendingQueueStorageKey);
      return;
    }
    // Sensitive aggregate-only events are deliberately never persisted across documents.
    const persistable = queue.filter((event) => !!event.visitorId);
    if (!persistable.length) {
      safeStorageRemove('sessionStorage', ANALYTICS_CONFIG.pendingQueueStorageKey);
      return;
    }
    safeStorageSet(
      'sessionStorage',
      ANALYTICS_CONFIG.pendingQueueStorageKey,
      JSON.stringify(persistable.slice(-ANALYTICS_CONFIG.maxQueueSize)),
    );
  }

  function restorePending(): void {
    if (!canCollectClientAnalytics(getConsent())) return;
    const raw = safeStorageGet('sessionStorage', ANALYTICS_CONFIG.pendingQueueStorageKey);
    if (!raw) return;
    try {
      const value = JSON.parse(raw);
      if (!Array.isArray(value)) return;
      const restored = value
        .filter((item) =>
          item &&
          typeof item === 'object' &&
          typeof item.eventId === 'string' &&
          item.schemaVersion === ANALYTICS_CONFIG.schemaVersion &&
          item.consent?.policyVersion === ANALYTICS_CONFIG.consentPolicyVersion,
        )
        .slice(-ANALYTICS_CONFIG.maxQueueSize) as RawClientEventInput[];
      queue = restored;
    } catch {
      safeStorageRemove('sessionStorage', ANALYTICS_CONFIG.pendingQueueStorageKey);
    }
  }

  function clearPageBindings(): void {
    for (const cleanup of pageCleanup.splice(0)) cleanup();
  }

  function clearIdentityAndQueue(): void {
    try { forgetVisitor(localStorage); } catch {}
    try { forgetSession(localStorage); } catch {}
    safeStorageRemove('sessionStorage', TAB_STORAGE_KEY);
    safeStorageRemove('sessionStorage', ANALYTICS_CONFIG.pendingQueueStorageKey);
    queue = [];
    runtime = null;
    clearPageBindings();
  }

  function consentStillAllowsCollection(): boolean {
    if (!canCollectClientAnalytics(getConsent())) {
      clearIdentityAndQueue();
      return false;
    }
    return true;
  }

  function makeEvent(
    eventName: RawEventName,
    properties: Record<string, unknown> = {},
    attributionContext: RawClientEventInput['attributionContext'] = null,
  ): RawClientEventInput | null {
    if (!runtime || !consentStillAllowsCollection()) return null;
    const consent = getConsent();
    const linked = runtime.privacyClass === 'standard';

    return {
      eventId: createId('e'),
      eventName,
      eventVersion: 1,
      schemaVersion: ANALYTICS_CONFIG.schemaVersion,
      occurredAtClient: new Date().toISOString(),
      visitorId: linked ? runtime.visitor.visitorId : null,
      sessionId: linked ? runtime.session.sessionId : null,
      pageViewId: runtime.pageViewId,
      tabId: linked ? runtime.tabId : null,
      pagePath: runtime.pagePath,
      consent,
      eventProperties: properties,
      attributionContext: linked ? attributionContext : null,
      trackerVersion: ANALYTICS_CONFIG.trackerVersion,
      environment,
    };
  }

  function pushEvent(
    eventName: RawEventName,
    properties: Record<string, unknown> = {},
    attributionContext: RawClientEventInput['attributionContext'] = null,
    touch = true,
  ): void {
    const event = makeEvent(eventName, properties, attributionContext);
    if (!event || !runtime) return;

    queue.push(event);
    if (queue.length > ANALYTICS_CONFIG.maxQueueSize) {
      queue.splice(0, queue.length - ANALYTICS_CONFIG.maxQueueSize);
    }

    if (
      touch &&
      runtime.privacyClass === 'standard' &&
      !TECHNICAL_EVENTS.has(eventName) &&
      !SESSION_META_EVENTS.has(eventName)
    ) {
      try {
        runtime.session = touchSession(localStorage, runtime.session);
      } catch {}
    }

    persistPending();
    if (queue.length >= ANALYTICS_CONFIG.maxBatchSize) void flush(false);
  }

  function rotateExpiredSessionIfNeeded(): void {
    if (!runtime || runtime.privacyClass !== 'standard') return;
    const now = Date.now();
    if (!isSessionExpired(runtime.session, now)) return;

    const visitor = runtime.visitor;
    const session = createSession(visitor, runtime.pagePath, now);
    try { localStorage.setItem('pa_session_v2', JSON.stringify(session)); } catch {}

    runtime.session = session;
    runtime.pageViewId = createId('pv');

    const context = buildAttributionContext(
      location.href,
      null,
      'inactivity_resume',
    );
    pushEvent(
      'session_start',
      { landing_path: runtime.pagePath, start_reason: 'inactivity_resume' },
      context,
      false,
    );
    pushEvent('page_view', { navigation_type: 'inactivity_resume' }, null, true);
  }

  function track(
    eventName: RawEventName,
    properties: Record<string, unknown> = {},
    attributionContext: RawClientEventInput['attributionContext'] = null,
  ): void {
    if (!runtime || !consentStillAllowsCollection()) return;
    if (!TECHNICAL_EVENTS.has(eventName) && !SESSION_META_EVENTS.has(eventName) && eventName !== 'page_view') {
      rotateExpiredSessionIfNeeded();
    }
    pushEvent(eventName, properties, attributionContext, true);
  }

  async function flush(useBeacon = false): Promise<void> {
    if (!queue.length || !consentStillAllowsCollection()) return;
    const batch = queue.slice(0, ANALYTICS_CONFIG.maxBatchSize);
    const body = JSON.stringify({ events: batch });

    if (useBeacon && typeof navigator.sendBeacon === 'function') {
      // Keep the same event IDs persisted. On the next page they are retried and collector
      // deduplication makes delivery at-least-once rather than silently losing data.
      navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
      persistPending();
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'same-origin',
        keepalive: true,
        body,
      });
      if (!response.ok) return;
      const sentIds = new Set(batch.map((item) => item.eventId));
      queue = queue.filter((item) => !sentIds.has(item.eventId));
      persistPending();
    } catch {
      persistPending();
    }
  }

  function bindScroll(): void {
    const reached = new Set<number>();
    let frame = 0;
    const measure = () => {
      frame = 0;
      const root = document.documentElement;
      const total = Math.max(root.scrollHeight, document.body?.scrollHeight || 0, 1);
      const bottom = Math.min(total, window.scrollY + window.innerHeight);
      const pct = Math.min(100, (bottom / total) * 100);
      for (const milestone of [25, 50, 75, 90, 100] as const) {
        if (pct >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          track(`scroll_${milestone}` as RawEventName);
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    pageCleanup.push(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    });
    measure();
  }

  function bindPriceViews(): void {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-analytics-price]'));
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return;

    const timers = new Map<Element, number>();
    const emitted = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (emitted.has(entry.target)) continue;
          if (entry.intersectionRatio >= ANALYTICS_CONFIG.priceView.minimumVisibleRatio) {
            if (timers.has(entry.target)) continue;
            const timer = window.setTimeout(() => {
              timers.delete(entry.target);
              emitted.add(entry.target);
              const el = entry.target as HTMLElement;
              track('price_view', {
                price_section_id: el.dataset.analyticsPrice || 'default',
                service_key: el.dataset.serviceKey || runtime?.serviceKey || undefined,
              });
            }, ANALYTICS_CONFIG.priceView.minimumVisibleMs);
            timers.set(entry.target, timer);
          } else {
            const timer = timers.get(entry.target);
            if (timer) window.clearTimeout(timer);
            timers.delete(entry.target);
          }
        }
      },
      { threshold: [ANALYTICS_CONFIG.priceView.minimumVisibleRatio] },
    );

    nodes.forEach((node) => observer.observe(node));
    pageCleanup.push(() => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    });
  }

  function bindForms(): void {
    const started = new WeakSet<HTMLFormElement>();
    const handler = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const form = target.closest<HTMLFormElement>('form[data-analytics-form]');
      if (!form || started.has(form)) return;
      started.add(form);
      track('form_start', { form_id: form.dataset.analyticsForm || 'default' });
    };
    document.addEventListener('focusin', handler, true);
    document.addEventListener('input', handler, true);
    document.addEventListener('change', handler, true);
    pageCleanup.push(() => {
      document.removeEventListener('focusin', handler, true);
      document.removeEventListener('input', handler, true);
      document.removeEventListener('change', handler, true);
    });
  }

  function beginPageView(reason: 'navigate' | 'consent_granted' | 'astro_client_router'): void {
    if (!consentStillAllowsCollection()) return;
    const now = Date.now();
    if (location.href === lastBeginHref && now - lastBeginAt < 400) return;
    lastBeginHref = location.href;
    lastBeginAt = now;

    clearPageBindings();
    const page = resolvePage(catalog, location.pathname);
    const pageViewId = createId('pv');

    if (page.privacyClass === 'sensitive') {
      // Cut the pseudonymous path before entering sensitive content.
      try { forgetSession(localStorage); } catch {}
      runtime = {
        pagePath: sanitizePath(location.pathname),
        pageViewId,
        privacyClass: 'sensitive',
        pageType: page.pageType,
        pageId: page.pageId,
        serviceKey: null,
        visitor: null,
        session: null,
        tabId: null,
      };
      pushEvent('page_view', { navigation_type: reason }, null, false);
    } else {
      const consent = getConsent();
      let visitor: VisitorState | null;
      let result: ReturnType<typeof loadOrCreateSession>;
      try {
        visitor = loadOrCreateVisitor(localStorage, consent, now);
        if (!visitor) return;
        result = loadOrCreateSession(localStorage, visitor, location.pathname, now);
      } catch {
        // Browser storage can become unavailable even after consent was saved.
        // Stop tracking and clear the in-memory queue without interrupting the page.
        clearIdentityAndQueue();
        return;
      }
      runtime = {
        pagePath: sanitizePath(location.pathname),
        pageViewId,
        privacyClass: 'standard',
        pageType: page.pageType,
        pageId: page.pageId,
        serviceKey: page.serviceKey ?? null,
        visitor,
        session: result.session,
        tabId: getOrCreateTabId(),
      };

      const context = buildAttributionContext(
        location.href,
        document.referrer,
        reason === 'consent_granted' ? 'consent_granted' : 'document_entry',
      );

      if (result.isNew) {
        pushEvent(
          'session_start',
          { landing_path: runtime.pagePath, start_reason: reason },
          context,
          false,
        );
      } else if (
        reason !== 'astro_client_router' &&
        hasExternalAttributionSignal(context, ANALYTICS_CONFIG.siteHostname)
      ) {
        pushEvent('attribution_touch', { landing_path: runtime.pagePath }, context, false);
      }
      pushEvent('page_view', { navigation_type: reason }, null, true);
    }

    bindScroll();
    bindPriceViews();
    bindForms();
    startWebVitals();
  }

  function clickHandler(event: MouseEvent): void {
    if (!runtime || !canCollectClientAnalytics(getConsent())) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest<HTMLAnchorElement>('a');

    if (anchor) {
      const info = anchorTarget(anchor);
      const placement = inferPlacement(anchor);
      const serviceKey = anchor.dataset.serviceKey || runtime.serviceKey || undefined;

      if (info.protocol === 'tel:') {
        track('phone_click', { placement, service_key: serviceKey, is_cta: true });
        return;
      }
      if (isHost(info.host, 'booksy.com') || isHost(info.host, 'booksy.pl') || isHost(info.host, 'booksy.net')) {
        track('booksy_click', {
          placement,
          service_key: serviceKey,
          is_cta: true,
          target_host: info.host,
        });
        return;
      }
      if (isHost(info.host, 'instagram.com')) {
        track('instagram_click', { placement, target_host: info.host });
        return;
      }
      if (isHost(info.host, 'facebook.com') || isHost(info.host, 'fb.com')) {
        track('facebook_click', { placement, target_host: info.host });
        return;
      }

      const siteRoot = ANALYTICS_CONFIG.siteHostname.replace(/^www\./, '');
      const internal = !!info.host && (info.host === location.hostname || info.host === siteRoot || info.host.endsWith(`.${siteRoot}`));
      if (info.host && !internal) {
        track('outbound_click', {
          placement,
          target_host: info.host,
          target_category: 'external',
        });
        return;
      }

      if (internal && (anchor.closest('header') || anchor.closest('nav') || anchor.matches('[data-analytics-menu]'))) {
        if (info.path && resolvePage(catalog, info.path).privacyClass === 'sensitive') return;
        track('menu_click', {
          item_id: (anchor.dataset.analyticsMenu || anchor.textContent || 'menu-item').trim().slice(0, 120),
          target_path: info.path || undefined,
        });
        return;
      }
    }

    const genericCta = target.closest<HTMLElement>('[data-analytics-cta]');
    if (genericCta) {
      track('cta_click', {
        cta_id: genericCta.dataset.analyticsCta || 'generic',
        placement: inferPlacement(genericCta),
        service_key: genericCta.dataset.serviceKey || runtime.serviceKey || undefined,
        is_cta: true,
      });
    }
  }

  function jsErrorHandler(event: ErrorEvent): void {
    let scriptPath: string | undefined;
    if (event.filename) {
      try { scriptPath = sanitizePath(new URL(event.filename, location.href).pathname); } catch {}
    }
    track('js_error', {
      error_type: event.error?.name || 'Error',
      message_code: event.message ? `m_${hashString(event.message)}` : 'unknown',
      script_path: scriptPath,
      line: event.lineno || undefined,
      column: event.colno || undefined,
    });
  }

  function rejectionHandler(event: PromiseRejectionEvent): void {
    const reason = event.reason;
    const message =
      typeof reason === 'string'
        ? reason
        : reason && typeof reason === 'object' && typeof reason.message === 'string'
          ? reason.message
          : 'unhandled_rejection';
    track('js_error', {
      error_type: 'UnhandledRejection',
      message_code: `m_${hashString(message)}`,
    });
  }

  function resourceErrorHandler(event: Event): void {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const element = target as HTMLImageElement | HTMLScriptElement | HTMLLinkElement | HTMLVideoElement;
    const candidate =
      ('currentSrc' in element && element.currentSrc) ||
      ('src' in element && typeof element.src === 'string' && element.src) ||
      ('href' in element && typeof element.href === 'string' && element.href) ||
      '';
    if (!candidate) return;
    try {
      const url = new URL(candidate, location.href);
      track('resource_error', {
        resource_type: target.tagName.toLowerCase(),
        resource_host: url.hostname.toLowerCase(),
        resource_path: sanitizePath(url.pathname),
      });
    } catch {}
  }

  function formSubmitHandler(event: Event): void {
    const detail = (event as CustomEvent).detail as { formId?: unknown } | undefined;
    const formId =
      typeof detail?.formId === 'string' && detail.formId.length <= 120
        ? detail.formId
        : 'default';
    track('form_submit', { form_id: formId });
  }

  function galleryOpenHandler(event: Event): void {
    const detail = (event as CustomEvent).detail as { galleryId?: unknown } | undefined;
    const galleryId =
      typeof detail?.galleryId === 'string' ? detail.galleryId.slice(0, 160) : 'gallery';
    track('gallery_open', {
      gallery_id: galleryId,
      service_key: runtime?.serviceKey || undefined,
    });
  }

  function galleryViewHandler(event: Event): void {
    const detail = (event as CustomEvent).detail as {
      galleryId?: unknown;
      assetUrl?: unknown;
      assetKind?: unknown;
    } | undefined;
    const galleryId =
      typeof detail?.galleryId === 'string' ? detail.galleryId.slice(0, 160) : 'gallery';
    const assetUrl = typeof detail?.assetUrl === 'string' ? detail.assetUrl : '';
    const kind = detail?.assetKind === 'video' ? 'video' : 'image';
    track('gallery_image_view', {
      gallery_id: galleryId,
      asset_id: assetIdFromUrl(assetUrl),
      asset_kind: kind,
      service_key: runtime?.serviceKey || undefined,
    });
  }

  async function startWebVitals(): Promise<void> {
    if (webVitalsStarted || !runtime || !canCollectClientAnalytics(getConsent())) return;
    webVitalsStarted = true;
    try {
      const vitals = await import('web-vitals');
      const report = (metric: { name: string; value: number; rating?: string; navigationType?: string }) => {
        if (!['LCP', 'INP', 'CLS', 'TTFB'].includes(metric.name)) return;
        track('web_vital', {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          navigation_type: metric.navigationType,
        });
      };
      vitals.onLCP(report);
      vitals.onINP(report);
      vitals.onCLS(report);
      vitals.onTTFB(report);
    } catch {
      // Analytics remains functional even if optional RUM module fails to load.
    }
  }

  function refreshConsent(): void {
    if (destroyed) return;
    if (!canCollectClientAnalytics(getConsent())) {
      clearIdentityAndQueue();
      return;
    }
    if (!runtime) {
      restorePending();
      beginPageView('consent_granted');
      if (queue.length) void flush(false);
    }
  }

  function onConsentChanged(): void {
    refreshConsent();
  }

  function onVisibilityChange(): void {
    if (document.visibilityState === 'hidden') void flush(true);
  }
  function onPageHide(): void {
    void flush(true);
  }
  function onAstroPageLoad(): void {
    beginPageView('astro_client_router');
  }

  document.addEventListener('click', clickHandler, true);
  window.addEventListener('error', jsErrorHandler);
  window.addEventListener('error', resourceErrorHandler, true);
  window.addEventListener('unhandledrejection', rejectionHandler);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);
  document.addEventListener('astro:page-load', onAstroPageLoad);
  window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
  window.addEventListener('pa:form-submit', formSubmitHandler);
  window.addEventListener('pa:gallery-open', galleryOpenHandler);
  window.addEventListener('pa:gallery-view', galleryViewHandler);

  flushTimer = window.setInterval(() => void flush(false), ANALYTICS_CONFIG.flushIntervalMs);

  if (canCollectClientAnalytics(getConsent())) {
    restorePending();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => beginPageView('navigate'), { once: true });
    } else {
      beginPageView('navigate');
    }
  }

  return {
    flush: () => flush(false),
    refreshConsent,
    destroy() {
      destroyed = true;
      clearPageBindings();
      if (flushTimer != null) window.clearInterval(flushTimer);
      document.removeEventListener('click', clickHandler, true);
      window.removeEventListener('error', jsErrorHandler);
      window.removeEventListener('error', resourceErrorHandler, true);
      window.removeEventListener('unhandledrejection', rejectionHandler);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('astro:page-load', onAstroPageLoad);
      window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
      window.removeEventListener('pa:form-submit', formSubmitHandler);
      window.removeEventListener('pa:gallery-open', galleryOpenHandler);
      window.removeEventListener('pa:gallery-view', galleryViewHandler);
    },
  };
}
