import type { NormalizedEvent } from './types';

export type InsertResult = 'inserted' | 'duplicate_event_id' | 'duplicate_semantic';

export interface DataQualityIssue {
  occurredAt: string;
  code: string;
  detail?: Record<string, unknown>;
}

export interface AnalyticsStorage {
  insertRawEvent(event: NormalizedEvent, semanticKey: string | null): Promise<InsertResult>;
  recordDataQuality(issue: DataQualityIssue): Promise<void>;
}
