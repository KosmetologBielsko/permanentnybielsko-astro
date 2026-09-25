import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultConsent } from '../../src/lib/analytics/consent';
import { initPermanentnyAnalytics } from '../../src/lib/analytics/tracker';

test('Blocked browser storage does not break consent withdrawal or start collection', async () => {
  const keys = ['window', 'document', 'location', 'localStorage', 'sessionStorage', 'fetch'] as const;
  const saved = new Map(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const blocked = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
  const browserWindow = Object.assign(new EventTarget(), {
    setInterval: () => 1,
    clearInterval: () => {},
  });
  Object.defineProperty(browserWindow, 'sessionStorage', { get: blocked });
  let requests = 0;
  let consent = defaultConsent();
  let tracker: ReturnType<typeof initPermanentnyAnalytics> | undefined;

  try {
    Object.defineProperties(globalThis, {
      window: { configurable: true, value: browserWindow },
      document: { configurable: true, value: Object.assign(new EventTarget(), { readyState: 'complete' }) },
      location: { configurable: true, value: new URL('https://preview-test.vercel.app/') },
      localStorage: { configurable: true, get: blocked },
      sessionStorage: { configurable: true, get: blocked },
      fetch: { configurable: true, value: async () => { requests++; return new Response(null, { status: 202 }); } },
    });
    tracker = initPermanentnyAnalytics({ getConsent: () => consent });
    assert.doesNotThrow(() => tracker!.refreshConsent());
    consent = { ...defaultConsent(), analytics: true };
    assert.doesNotThrow(() => tracker!.refreshConsent());
    await tracker.flush();
    consent = defaultConsent();
    assert.doesNotThrow(() => tracker!.refreshConsent());
    await tracker.flush();
    assert.equal(requests, 0);
  } finally {
    tracker?.destroy();
    for (const key of keys) {
      const descriptor = saved.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
