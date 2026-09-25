import assert from 'node:assert/strict';
import test from 'node:test';
import { collectorEnabled } from '../../src/lib/analytics/rollout';
import { readConsentSnapshot,hasStoredConsent,writeConsentSnapshot,defaultConsent } from '../../src/lib/analytics/consent';
import { buildAttributionContext,classifyAttributionContext } from '../../src/lib/analytics/source-context';
import { normalizeCollectedEvent } from '../../src/lib/analytics/collect-core';
import { validateClientEvent } from '../../src/lib/analytics/validation';
import { handleCollectRequest } from '../../src/lib/analytics/collect-handler';
import { MemoryAnalyticsStorage } from '../../src/lib/analytics/memory-storage';
import { event,request } from './fixtures';

test('Rollout is explicit in local/Preview and always off in Production', () => {
  assert.equal(collectorEnabled({}),false);
  assert.equal(collectorEnabled({PUBLIC_PA_ENABLED:'true',VERCEL_ENV:'preview'}),true);
  assert.equal(collectorEnabled({PUBLIC_PA_ENABLED:'true',VERCEL_ENV:'production'}),false);
  assert.equal(collectorEnabled({PUBLIC_PA_ENABLED:'true'}),true);
});
test('Blocked storage fails closed without throwing', () => {
  const storage={getItem(){throw new Error('blocked');},setItem(){throw new Error('blocked');}};
  assert.deepEqual(readConsentSnapshot(storage),defaultConsent());
  assert.equal(hasStoredConsent(storage),false);
  assert.doesNotThrow(()=>writeConsentSnapshot(defaultConsent(),storage));
});
test('Migration and withdrawal preserve independent categories', () => {
  const map=new Map([['pb_cookie_consent','accepted']]);
  const s={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};
  assert.equal(readConsentSnapshot(s).personalization,false);
  writeConsentSnapshot({...defaultConsent(),analytics:true,personalization:true},s);
  assert.equal(readConsentSnapshot(s).marketing,false); assert.equal(readConsentSnapshot(s).personalization,true);
  writeConsentSnapshot(defaultConsent(),s); assert.equal(readConsentSnapshot(s).analytics,false);
});
test('Own Preview and sensitive internal referrer are stripped', () => {
  for (const [landing,ref] of [
    ['https://preview-test.vercel.app/galeria/','https://preview-test.vercel.app/sercemmalowane/'],
    ['https://www.permanentnybielsko.com/','https://permanentnybielsko.com/sercemmalowane/'],
  ]) {
    const c=buildAttributionContext(landing,ref); assert.equal(c.referrerHost,null); assert.equal(c.referrerPath,null);
  }
});
test('AI domain values in UTM retain AI attribution', () => {
  for (const [source,label] of [['chatgpt.com','ChatGPT'],['perplexity.ai','Perplexity']]) {
    const s=classifyAttributionContext(buildAttributionContext(`https://www.permanentnybielsko.com/?utm_source=${source}`),'www.permanentnybielsko.com');
    assert.equal(s.source,label); assert.equal(s.channelGroup,'ai');
  }
});
test('Collector removes sensitive navigation and same-site attribution paths', () => {
  const n=normalizeCollectedEvent(event({eventName:'menu_click',eventProperties:{target_path:'/sercemmalowane/',item_id:'health'}}));
  assert.ok(n.ok); if(n.ok) assert.deepEqual(n.event.eventProperties,{});
  const s=normalizeCollectedEvent(event({eventName:'session_start',attributionContext:{referrerHost:'www.permanentnybielsko.com',referrerPath:'/sercemmalowane/',campaignParams:{}}}));
  assert.ok(s.ok); if(s.ok) assert.equal(s.event.attributionContext?.referrerPath,null);
});
test('Consent fields reject malformed boolean values before SQL', () => {
  for (const key of ['marketing','personalization']) {
    const e=event(); (e.consent as any)[key]='yes'; assert.equal(validateClientEvent(e).ok,false);
  }
});
test('Origin comparison requires matching scheme and port', async () => {
  for (const [origin,status] of [['https://preview-test.vercel.app',202],['http://preview-test.vercel.app',403],['https://preview-test.vercel.app:444',403],['https://foreign.example',403]] as const) {
    const response=await handleCollectRequest(request(event(),origin),{storage:new MemoryAnalyticsStorage()});
    assert.equal(response.status,status);
  }
});
test('Server environment replaces browser-supplied environment', async () => {
  const storage=new MemoryAnalyticsStorage();
  assert.equal((await handleCollectRequest(request(event({environment:'production'})),{storage,environment:'preview'})).status,202);
  assert.equal(storage.events[0].environment,'preview');
});
