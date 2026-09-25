import assert from 'node:assert/strict';
import { before, after, beforeEach, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { neonConfig } from '@neondatabase/serverless';
import { createNeonAnalyticsStorage } from '../../src/lib/analytics/neon-storage';
import { normalizeCollectedEvent } from '../../src/lib/analytics/collect-core';
import { handleCollectRequest } from '../../src/lib/analytics/collect-handler';
import { semanticDedupeKey } from '../../src/lib/analytics/dedupe';
import { buildAttributionContext } from '../../src/lib/analytics/source-context';
import { safeStorageError } from '../../src/lib/analytics/storage-error';
import { event, request } from './fixtures';
import type { RawClientEventInput } from '../../src/lib/analytics/types';

const db = new PGlite();
const originalFetch = neonConfig.fetchFunction;
// Driver generates the SQL and parameters. Only transport is replaced by local PG.
const storage = createNeonAnalyticsStorage('postgresql://test:test@pa-test.invalid/test');
before(async () => {
  await db.exec(await readFile(new URL('../sql/001_core_schema.sql', import.meta.url), 'utf8'));
  neonConfig.fetchFunction = async (url, init) => {
    assert.equal(new URL(String(url)).hostname, 'api.invalid');
    const body = JSON.parse(String(init?.body));
    try {
      const result = await db.query(body.query, body.params);
      const fields = result.fields.map(f => ({ name:f.name, dataTypeID:f.dataTypeID }));
      const rows = result.rows.map((r:any) => fields.map(f => {
        const v = r[f.name];
        return v == null ? null : v instanceof Date ? v.toISOString() : typeof v === 'object' ? JSON.stringify(v) : String(v);
      }));
      return new Response(JSON.stringify({fields,rows,rowCount:result.affectedRows}),{status:200});
    } catch (e:any) {
      return new Response(JSON.stringify({ message:e.message, code:e.code, position:e.position,
        routine:e.routine, table:e.table, column:e.column, constraint:e.constraint }),{status:400});
    }
  };
});
beforeEach(async () => { await db.exec('TRUNCATE pa_events_raw,pa_visitors,pa_sessions,pa_attribution_touches,pa_data_quality_events'); });
after(async () => { neonConfig.fetchFunction = originalFetch; await db.close(); });
function start(ref='https://chatgpt.com/', overrides:Partial<RawClientEventInput>={}) {
  return event({eventName:'session_start', attributionContext:buildAttributionContext('https://www.permanentnybielsko.com/',ref),...overrides});
}
async function insert(raw:RawClientEventInput) {
  const normalized = normalizeCollectedEvent(raw);
  assert.equal(normalized.ok,true);
  if (!normalized.ok) throw new Error('Fixture invalid');
  return storage.insertRawEvent(normalized.event,semanticDedupeKey(normalized.event));
}
async function row(sql:string) { return (await db.query<any>(sql)).rows[0]; }

test('SQL stores RAW, first/last/non-direct touch and session entry atomically', async () => {
  const e = start(); assert.equal(await insert(e),'inserted');
  const visitor = await row('SELECT * FROM pa_visitors');
  assert.equal(visitor.first_touch_id,`t_${e.eventId}`);
  assert.equal(visitor.last_touch_id,`t_${e.eventId}`);
  assert.equal(visitor.last_non_direct_touch_id,`t_${e.eventId}`);
  assert.equal((await row('SELECT * FROM pa_sessions')).entry_source,'ChatGPT');
  assert.equal(Number((await row('SELECT count(*) AS n FROM pa_attribution_touches')).n),1);
});
test('Direct returning session preserves first and last non-direct touch', async () => {
  const a=start(); await insert(a);
  const b=start('',{sessionId:'s_87654321-test'}); await insert(b);
  const v=await row('SELECT * FROM pa_visitors');
  assert.equal(v.first_touch_id,`t_${a.eventId}`); assert.equal(v.last_touch_id,`t_${b.eventId}`);
  assert.equal(v.last_non_direct_touch_id,`t_${a.eventId}`);
});
test('Later attribution touch does not overwrite session acquisition', async () => {
  const a=start(); await insert(a);
  const b=start('https://www.google.pl/',{eventName:'attribution_touch'}); await insert(b);
  assert.equal((await row('SELECT * FROM pa_sessions')).entry_source,'ChatGPT');
  assert.equal((await row('SELECT * FROM pa_visitors')).last_touch_id,`t_${b.eventId}`);
});
test('Transport and semantic duplicates do not create extra touches', async () => {
  const a=start(); await insert(a);
  assert.equal(await insert(a),'duplicate_event_id');
  assert.equal(await insert(start()),'duplicate_semantic');
  assert.equal(Number((await row('SELECT count(*) AS n FROM pa_events_raw')).n),1);
  assert.equal(Number((await row('SELECT count(*) AS n FROM pa_attribution_touches')).n),1);
});
test('Sensitive page stores SQL NULL attribution and no identity tables', async () => {
  await insert(start('https://chatgpt.com/',{pagePath:'/sercemmalowane/'}));
  const r=await row('SELECT visitor_id,session_id,tab_id,attribution_context IS NULL AS empty,privacy_scope FROM pa_events_raw');
  assert.deepEqual(r,{visitor_id:null,session_id:null,tab_id:null,empty:true,privacy_scope:'aggregate_only'});
  for (const t of ['pa_visitors','pa_sessions','pa_attribution_touches']) assert.equal(Number((await row(`SELECT count(*) AS n FROM ${t}`)).n),0);
});
test('Delayed session_start fills entry after page_view arrives first', async () => {
  await insert(event({pagePath:'/galeria/'})); await insert(start());
  const s=await row('SELECT * FROM pa_sessions');
  assert.equal(s.entry_source,'ChatGPT'); assert.equal(s.landing_path,'/makijaz-permanentny-brwi/');
});
test('Constraint failure rolls back every CTE', async () => {
  await db.exec("ALTER TABLE pa_visitors ADD CONSTRAINT test_reject CHECK (visitor_id <> 'v_12345678-test')");
  try {
    await assert.rejects(insert(start()),(e:any)=>e.code==='23514');
    for (const t of ['pa_events_raw','pa_sessions','pa_attribution_touches']) assert.equal(Number((await row(`SELECT count(*) AS n FROM ${t}`)).n),0);
  } finally { await db.exec('ALTER TABLE pa_visitors DROP CONSTRAINT test_reject'); }
});
test('Collector gives 202, or safe 503 with SQLSTATE persisted', async () => {
  assert.equal((await handleCollectRequest(request(start()),{storage,environment:'preview'})).status,202);
  const failing={ ...storage, insertRawEvent:async () => { throw Object.assign(new Error('SECRET database URL'),{code:'23502',column:'page_view_id',routine:'ExecConstraints'}); } };
  const response=await handleCollectRequest(request(event()),{storage:failing});
  assert.equal(response.status,503); assert.ok(!(await response.text()).includes('SECRET'));
  const {detail}=await row("SELECT detail FROM pa_data_quality_events WHERE code='collector_storage_error'");
  assert.equal(detail.code,'23502'); assert.equal(detail.column,'page_view_id'); assert.ok(!JSON.stringify(detail).includes('SECRET'));
});
test('Diagnostic drops untrusted driver message, detail and identifiers', () => {
  const d=safeStorageError({code:'23502',message:'SECRET',detail:'SECRET',column:'email@example.com',routine:'ExecConstraints'});
  assert.equal(d.message,'not_null_violation'); assert.equal(d.column,null);
  assert.ok(!JSON.stringify(d).includes('SECRET'));
});
