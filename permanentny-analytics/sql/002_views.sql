-- Rebuildable reporting views. RAW remains the source of truth.

CREATE OR REPLACE VIEW pa_v_session_summary AS
SELECT
  s.session_id,
  s.visitor_id,
  s.started_at,
  s.last_activity_at,
  EXTRACT(EPOCH FROM (s.last_activity_at - s.started_at))::bigint AS duration_seconds,
  s.landing_path,
  s.entry_source,
  s.entry_medium,
  s.entry_channel,
  s.entry_campaign,
  COUNT(*) FILTER (WHERE e.event_name='page_view') AS page_views,
  COUNT(*) AS event_count,
  BOOL_OR(e.event_name='booksy_click') AS booksy_click,
  BOOL_OR(e.event_name='phone_click') AS phone_click,
  BOOL_OR(e.event_name='form_submit') AS form_submit,
  BOOL_OR(e.event_name='price_view') AS price_view,
  BOOL_OR(e.event_name='gallery_open') AS gallery_open
FROM pa_sessions s
LEFT JOIN pa_events_raw e ON e.session_id=s.session_id
GROUP BY s.session_id;

CREATE OR REPLACE VIEW pa_v_primary_conversions AS
SELECT
  event_id,
  received_at_server,
  visitor_id,
  session_id,
  page_id,
  page_path,
  page_type,
  service_key,
  event_name AS conversion_type
FROM pa_events_raw
WHERE event_name IN ('booksy_click','phone_click','form_submit');

CREATE OR REPLACE VIEW pa_v_page_daily AS
SELECT
  date_trunc('day', received_at_server) AS day,
  page_id,
  page_path,
  page_type,
  privacy_scope,
  COUNT(*) FILTER (WHERE event_name='page_view') AS page_views,
  COUNT(*) FILTER (WHERE event_name='booksy_click') AS booksy_clicks,
  COUNT(*) FILTER (WHERE event_name='phone_click') AS phone_clicks,
  COUNT(*) FILTER (WHERE event_name='form_submit') AS form_submits,
  COUNT(*) FILTER (WHERE event_name='price_view') AS price_views,
  COUNT(*) FILTER (WHERE event_name='gallery_open') AS gallery_opens,
  COUNT(*) FILTER (WHERE event_name='scroll_90') AS scroll_90
FROM pa_events_raw
GROUP BY 1,2,3,4,5;

CREATE OR REPLACE VIEW pa_v_ai_touches AS
SELECT
  t.touch_id,
  t.touched_at,
  t.visitor_id,
  t.session_id,
  t.classified_source AS ai_source,
  t.classified_medium,
  t.campaign,
  t.landing_path
FROM pa_attribution_touches t
WHERE t.classified_channel='ai';

CREATE OR REPLACE VIEW pa_v_ai_session_performance AS
SELECT
  t.classified_source AS ai_source,
  date_trunc('day', t.touched_at) AS day,
  COUNT(DISTINCT t.session_id) AS touched_sessions,
  COUNT(DISTINCT e.visitor_id) FILTER (WHERE e.visitor_id IS NOT NULL) AS visitors,
  COUNT(*) FILTER (WHERE e.event_name='page_view') AS page_views,
  COUNT(*) FILTER (WHERE e.event_name='booksy_click') AS booksy_clicks,
  COUNT(*) FILTER (WHERE e.event_name='phone_click') AS phone_clicks,
  COUNT(*) FILTER (WHERE e.event_name='form_submit') AS form_submits
FROM pa_attribution_touches t
LEFT JOIN pa_events_raw e ON e.session_id=t.session_id
WHERE t.classified_channel='ai'
GROUP BY 1,2;

CREATE OR REPLACE VIEW pa_v_data_quality_daily AS
SELECT
  date_trunc('day', occurred_at) AS day,
  code,
  COUNT(*) AS occurrences
FROM pa_data_quality_events
GROUP BY 1,2;
