import { neon } from '@neondatabase/serverless';
import type { AnalyticsStorage, DataQualityIssue, InsertResult } from './storage';
import type { NormalizedEvent } from './types';

export function createNeonAnalyticsStorage(databaseUrl: string): AnalyticsStorage {
  const sql = neon(databaseUrl);

  return {
    async insertRawEvent(event: NormalizedEvent, semanticKey: string | null): Promise<InsertResult> {
      const props = JSON.stringify(event.eventProperties ?? {});
      const attribution = JSON.stringify(event.attributionContext ?? null);
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
          RETURNING event_id
        ),
        visitor_upsert AS (
          INSERT INTO pa_visitors (visitor_id,created_at,first_seen_at,last_seen_at,last_session_id)
          SELECT ${event.visitorId ?? null},${event.receivedAtServer},${event.receivedAtServer},${event.receivedAtServer},${event.sessionId ?? null}
          FROM ins
          WHERE ${event.privacyScope}::text = 'pseudonymous' AND ${event.visitorId ?? null}::text IS NOT NULL
          ON CONFLICT (visitor_id) DO UPDATE SET
            last_seen_at = GREATEST(pa_visitors.last_seen_at, EXCLUDED.last_seen_at),
            last_session_id = COALESCE(EXCLUDED.last_session_id, pa_visitors.last_session_id)
          RETURNING visitor_id
        ),
        session_upsert AS (
          INSERT INTO pa_sessions (session_id,visitor_id,started_at,last_activity_at,landing_path)
          SELECT ${event.sessionId ?? null},${event.visitorId ?? null},${event.receivedAtServer},${event.receivedAtServer},${event.pagePath}
          FROM ins
          WHERE ${event.privacyScope}::text = 'pseudonymous'
            AND ${event.sessionId ?? null}::text IS NOT NULL
            AND ${event.visitorId ?? null}::text IS NOT NULL
          ON CONFLICT (session_id) DO UPDATE SET
            last_activity_at = GREATEST(pa_sessions.last_activity_at, EXCLUDED.last_activity_at)
          RETURNING session_id
        ),
        touch_insert AS (
          INSERT INTO pa_attribution_touches (
            touch_id,source_event_id,visitor_id,session_id,touched_at,landing_path,
            raw_referrer_host,raw_referrer_path,campaign_params,
            classified_source,classified_medium,classified_channel,campaign,classifier_version
          )
          SELECT
            ${touchId},${event.eventId},${event.visitorId ?? null},${event.sessionId ?? null},${event.receivedAtServer},${event.pagePath},
            ${event.attributionContext?.referrerHost ?? null},${event.attributionContext?.referrerPath ?? null},
            ${JSON.stringify(event.attributionContext?.campaignParams ?? {})}::jsonb,
            ${event.source ?? null},${event.medium ?? null},${event.channelGroup ?? null},${event.campaign ?? null},${event.sourceClassifierVersion ?? null}
          FROM ins
          WHERE ${event.privacyScope}::text = 'pseudonymous'
            AND ${event.eventName} IN ('session_start','attribution_touch')
            AND ${event.visitorId ?? null}::text IS NOT NULL
            AND ${event.sessionId ?? null}::text IS NOT NULL
            AND ${event.source ?? null}::text IS NOT NULL
          ON CONFLICT (source_event_id) DO NOTHING
          RETURNING touch_id
        ),
        session_entry AS (
          UPDATE pa_sessions
          SET entry_source=${event.source ?? null},
              entry_medium=${event.medium ?? null},
              entry_channel=${event.channelGroup ?? null},
              entry_campaign=${event.campaign ?? null}
          WHERE session_id=${event.sessionId ?? null}
            AND ${event.eventName}='session_start'
            AND EXISTS (SELECT 1 FROM ins)
          RETURNING session_id
        ),
        visitor_touch AS (
          UPDATE pa_visitors
          SET first_touch_id = COALESCE(first_touch_id, ${touchId}),
              last_touch_id = ${touchId},
              last_non_direct_touch_id = CASE
                WHEN ${event.channelGroup ?? null}::text IS NOT NULL AND ${event.channelGroup ?? null}::text <> 'direct'
                THEN ${touchId}
                ELSE last_non_direct_touch_id
              END
          WHERE visitor_id=${event.visitorId ?? null}
            AND EXISTS (SELECT 1 FROM touch_insert)
          RETURNING visitor_id
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
