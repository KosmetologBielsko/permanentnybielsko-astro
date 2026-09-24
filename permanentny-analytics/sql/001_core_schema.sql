-- Permanentny Analytics CORE v0.2
-- PostgreSQL / Neon. RAW tables are append-only by application convention.

BEGIN;

CREATE TABLE IF NOT EXISTS pa_events_raw (
  event_id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_version SMALLINT NOT NULL,
  schema_version TEXT NOT NULL,
  occurred_at_client TIMESTAMPTZ NOT NULL,
  received_at_server TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_source TEXT NOT NULL CHECK (event_source IN ('client','server','derived')),

  visitor_id TEXT NULL,
  session_id TEXT NULL,
  page_view_id TEXT NOT NULL,
  tab_id TEXT NULL,

  page_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_type TEXT NOT NULL,
  service_key TEXT NULL,
  privacy_scope TEXT NOT NULL CHECK (privacy_scope IN ('pseudonymous','aggregate_only')),

  source TEXT NULL,
  medium TEXT NULL,
  channel_group TEXT NULL,
  campaign TEXT NULL,
  source_classifier_version INTEGER NULL,

  consent_analytics BOOLEAN NOT NULL,
  consent_marketing BOOLEAN NOT NULL,
  consent_personalization BOOLEAN NOT NULL,
  consent_policy_version TEXT NOT NULL,

  event_properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  attribution_context JSONB NULL,

  tracker_version TEXT NOT NULL,
  collector_version TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('production','preview','development')),
  received_valid BOOLEAN NOT NULL DEFAULT TRUE,
  validation_error_code TEXT NULL,
  semantic_dedupe_key TEXT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS pa_events_raw_semantic_uq
  ON pa_events_raw (semantic_dedupe_key)
  WHERE semantic_dedupe_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS pa_events_raw_received_idx ON pa_events_raw (received_at_server DESC);
CREATE INDEX IF NOT EXISTS pa_events_raw_session_idx ON pa_events_raw (session_id, received_at_server) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS pa_events_raw_visitor_idx ON pa_events_raw (visitor_id, received_at_server) WHERE visitor_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS pa_events_raw_page_idx ON pa_events_raw (page_id, received_at_server);
CREATE INDEX IF NOT EXISTS pa_events_raw_event_idx ON pa_events_raw (event_name, received_at_server);
CREATE INDEX IF NOT EXISTS pa_events_raw_channel_idx ON pa_events_raw (channel_group, received_at_server) WHERE channel_group IS NOT NULL;

CREATE TABLE IF NOT EXISTS pa_visitors (
  visitor_id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  first_touch_id TEXT NULL,
  last_touch_id TEXT NULL,
  last_non_direct_touch_id TEXT NULL,
  last_session_id TEXT NULL
);

CREATE INDEX IF NOT EXISTS pa_visitors_last_seen_idx ON pa_visitors (last_seen_at DESC);

CREATE TABLE IF NOT EXISTS pa_sessions (
  session_id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ NOT NULL,
  landing_path TEXT NOT NULL,
  entry_source TEXT NULL,
  entry_medium TEXT NULL,
  entry_channel TEXT NULL,
  entry_campaign TEXT NULL
);

CREATE INDEX IF NOT EXISTS pa_sessions_visitor_idx ON pa_sessions (visitor_id, started_at DESC);
CREATE INDEX IF NOT EXISTS pa_sessions_started_idx ON pa_sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS pa_sessions_channel_idx ON pa_sessions (entry_channel, started_at DESC);

CREATE TABLE IF NOT EXISTS pa_attribution_touches (
  touch_id TEXT PRIMARY KEY,
  source_event_id TEXT NOT NULL UNIQUE,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  touched_at TIMESTAMPTZ NOT NULL,
  landing_path TEXT NOT NULL,

  raw_referrer_host TEXT NULL,
  raw_referrer_path TEXT NULL,
  campaign_params JSONB NOT NULL DEFAULT '{}'::jsonb,

  classified_source TEXT NOT NULL,
  classified_medium TEXT NOT NULL,
  classified_channel TEXT NOT NULL,
  campaign TEXT NULL,
  classifier_version INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS pa_touch_visitor_idx ON pa_attribution_touches (visitor_id, touched_at);
CREATE INDEX IF NOT EXISTS pa_touch_session_idx ON pa_attribution_touches (session_id, touched_at);
CREATE INDEX IF NOT EXISTS pa_touch_source_idx ON pa_attribution_touches (classified_channel, classified_source, touched_at DESC);

CREATE TABLE IF NOT EXISTS pa_data_quality_events (
  quality_id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  code TEXT NOT NULL,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS pa_quality_time_idx ON pa_data_quality_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS pa_quality_code_idx ON pa_data_quality_events (code, occurred_at DESC);

-- Reserved for Stage 1 server-side request collection. It is intentionally separate
-- from user/session analytics because REQUEST != USER.
CREATE TABLE IF NOT EXISTS pa_technical_requests_raw (
  request_id TEXT PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL,
  method TEXT NOT NULL,
  host TEXT NOT NULL,
  path TEXT NOT NULL,
  status_code INTEGER NULL,
  response_time_ms INTEGER NULL,
  referrer_host TEXT NULL,
  referrer_path TEXT NULL,
  bot_class TEXT NOT NULL CHECK (bot_class IN ('human_likely','known_bot','crawler','unknown')),
  bot_name TEXT NULL,
  device_class TEXT NULL,
  browser_family TEXT NULL,
  environment TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS pa_technical_path_idx ON pa_technical_requests_raw (path, occurred_at DESC);
CREATE INDEX IF NOT EXISTS pa_technical_bot_idx ON pa_technical_requests_raw (bot_class, bot_name, occurred_at DESC);

COMMIT;
