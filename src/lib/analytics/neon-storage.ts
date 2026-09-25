import { neon } from '@neondatabase/serverless';
import type { AnalyticsStorage, DataQualityIssue, InsertResult } from './storage';
import type { NormalizedEvent } from './types';

export function createNeonAnalyticsStorage(databaseUrl: string): AnalyticsStorage {
  const sql = neon(databaseUrl);

  return {
    async insertRawEvent(event: NormalizedEvent, semanticKey: string | null): Promise<InsertResult> {
      const props = JSON.stringify(event.eventProperties ?? {});
      const attribution = event.attributionContext ? JSON.stringify(event.attributionContext) : null;
      const consent = event.consent;
      const touchId = `t_${event.eventId}`;

      const rows = await sql`
        WITH ins AS (
          INSERT INTO pa_events_raw (
            event_id,event_name,event_version,schema_version,occurred_at_client,received_at_server,event_source,
            visitor_id,session_id,page_view_id,tab_id,page_id,page_path,page_type,service_key,privacy_scope,
            source,medium,channel_group,campaign,source_classifier_version,
            consent_analytics,consent_marketing,consent_personalization,consent_policy_version,
            event_properties,attribution_context,tracker_version,collector_version,environment,
            received_valid,validation_error_code,semantic_dedupe_key
          ) VALUES (
            ${event.eventId},${event.eventName},${event.eventVersion},${event.schemaVersion},
            ${event.occurredAtClient},${event.receivedAtServer},${event.eventSource},
            ${event.visitorId ?? null},${event.sessionId ?? null},${event.pageViewId ?? null},${event.tabId ?? null},
            ${event.pageId},${event.pagePath},${event.pageType},${event.serviceKey ?? null},${event.privacyScope},
            ${event.source ?? null},${event.medium ?? null},${event.channelGroup ?? null},${event.campaign ?? null},${event.sourceClassifierVersion ?? null},
            ${consent.analytics},${consent.marketing},${consent.personalization},${consent.policyVersion},
            ${props}::jsonb,${attribution}::jsonb,${event.trackerVersion},${event.collectorVersion},${event.environment},
            TRUE,NULL,${semanticKey}
          )
          ON CONFLICT DO NOTHING
          RETURNING *
        ),
        touch_insert AS (
          INSERT INTO pa_attribution_touches (
            touch_id,source_event_id,visitor_id,session_id,touched_at,landing_path,
            raw_referrer_host,raw_referrer_path,campaign_params,
            classified_source,classified_medium,classified_channel,campaign,classifier_version
          )
          SELECT
            ${touchId},event_id,visitor_id,session_id,received_at_server,page_path,
            attribution_context->>'referrerHost',attribution_context->>'referrerPath',
            COALESCE(attribution_context->'campaignParams','{}'::jsonb),
            source,medium,channel_group,campaign,source_classifier_version
          FROM ins
          WHERE privacy_scope = 'pseudonymous'
            AND event_name IN ('session_start','attribution_touch')
            AND visitor_id IS NOT NULL AND session_id IS NOT NULL AND source IS NOT NULL
          ON CONFLICT (source_event_id) DO NOTHING
          RETURNING touch_id
        ),
        visitor_upsert AS (
          -- One write per visitor: sibling CTE updates cannot see a just-inserted row.
          INSERT INTO pa_visitors (
            visitor_id,created_at,first_seen_at,last_seen_at,last_session_id,
            first_touch_id,last_touch_id,last_non_direct_touch_id
          )
          SELECT i.visitor_id,i.received_at_server,i.received_at_server,i.received_at_server,i.session_id,
            t.touch_id,t.touch_id,CASE WHEN i.channel_group <> 'direct' THEN t.touch_id END
          FROM ins i LEFT JOIN touch_insert t ON TRUE
          WHERE i.privacy_scope = 'pseudonymous' AND i.visitor_id IS NOT NULL
          ON CONFLICT (visitor_id) DO UPDATE SET
            last_seen_at = GREATEST(pa_visitors.last_seen_at, EXCLUDED.last_seen_at),
            last_session_id = COALESCE(EXCLUDED.last_session_id, pa_visitors.last_session_id),
            first_touch_id = COALESCE(pa_visitors.first_touch_id, EXCLUDED.first_touch_id),
            last_touch_id = COALESCE(EXCLUDED.last_touch_id, pa_visitors.last_touch_id),
            last_non_direct_touch_id = COALESCE(EXCLUDED.last_non_direct_touch_id, pa_visitors.last_non_direct_touch_id)
          RETURNING visitor_id
        ),
        session_upsert AS (
          INSERT INTO pa_sessions (
            session_id,visitor_id,started_at,last_activity_at,landing_path,
            entry_source,entry_medium,entry_channel,entry_campaign
          )
          SELECT session_id,visitor_id,received_at_server,received_at_server,page_path,
            CASE WHEN event_name='session_start' THEN source END,
            CASE WHEN event_name='session_start' THEN medium END,
            CASE WHEN event_name='session_start' THEN channel_group END,
            CASE WHEN event_name='session_start' THEN campaign END
          FROM ins
          WHERE privacy_scope = 'pseudonymous' AND session_id IS NOT NULL AND visitor_id IS NOT NULL
          ON CONFLICT (session_id) DO UPDATE SET
            last_activity_at = GREATEST(pa_sessions.last_activity_at, EXCLUDED.last_activity_at),
            landing_path = CASE WHEN pa_sessions.entry_source IS NULL AND EXCLUDED.entry_source IS NOT NULL
              THEN EXCLUDED.landing_path ELSE pa_sessions.landing_path END,
            entry_source = COALESCE(pa_sessions.entry_source, EXCLUDED.entry_source),
            entry_medium = COALESCE(pa_sessions.entry_medium, EXCLUDED.entry_medium),
            entry_channel = COALESCE(pa_sessions.entry_channel, EXCLUDED.entry_channel),
            entry_campaign = CASE WHEN pa_sessions.entry_source IS NULL THEN EXCLUDED.entry_campaign ELSE pa_sessions.entry_campaign END
          RETURNING session_id
        )
        SELECT EXISTS(SELECT 1 FROM ins) AS inserted
      `;

      const inserted = Boolean(rows[0]?.inserted);
      if (inserted) return 'inserted';

      const duplicateById = await sql`
        SELECT event_id FROM pa_events_raw WHERE event_id=${event.eventId} LIMIT 1
      `;
      if (duplicateById.length) return 'duplicate_event_id';

      if (semanticKey) {
        const duplicateSemantic = await sql`
          SELECT event_id FROM pa_events_raw WHERE semantic_dedupe_key=${semanticKey} LIMIT 1
        `;
        if (duplicateSemantic.length) return 'duplicate_semantic';
      }

      // Extremely unlikely race: treat an unclassified conflict as transport duplicate.
      return 'duplicate_event_id';
    },

    async recordDataQuality(issue: DataQualityIssue): Promise<void> {
      await sql`
        INSERT INTO pa_data_quality_events (occurred_at,code,detail)
        VALUES (${issue.occurredAt},${issue.code},${JSON.stringify(issue.detail ?? {})}::jsonb)
      `;
    },
  };
}
