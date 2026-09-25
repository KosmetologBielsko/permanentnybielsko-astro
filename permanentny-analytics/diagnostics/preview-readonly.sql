-- ONLY NEON PREVIEW. Read-only: no user payloads, IDs or connection strings.
SELECT current_setting('server_version') AS postgres_version;
SELECT table_name,column_name,data_type,is_nullable
FROM information_schema.columns
WHERE table_schema=current_schema()
AND table_name IN ('pa_events_raw','pa_visitors','pa_sessions','pa_attribution_touches','pa_data_quality_events')
ORDER BY table_name,ordinal_position;
SELECT c.relname AS table_name,con.conname AS constraint_name,pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname=current_schema() AND c.relname LIKE 'pa_%'
ORDER BY c.relname,con.conname;
SELECT occurred_at,code,detail->>'code' AS sqlstate,detail->>'message' AS error_category,
  detail->>'position' AS sql_position,detail->>'routine' AS routine,
  detail->>'table' AS table_name,detail->>'column' AS column_name,detail->>'constraint' AS constraint_name
FROM pa_data_quality_events WHERE code='collector_storage_error'
ORDER BY occurred_at DESC LIMIT 10;
SELECT event_name,privacy_scope,environment,COUNT(*) AS events
FROM pa_events_raw WHERE received_at_server>=now()-interval '1 day'
GROUP BY event_name,privacy_scope,environment ORDER BY event_name,privacy_scope;
