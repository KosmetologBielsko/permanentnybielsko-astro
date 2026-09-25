import type { AnalyticsStorage, DataQualityIssue, InsertResult } from './storage';
import type { NormalizedEvent } from './types';

export class MemoryAnalyticsStorage implements AnalyticsStorage {
  readonly events: NormalizedEvent[] = [];
  readonly quality: DataQualityIssue[] = [];
  private readonly eventIds = new Set<string>();
  private readonly semanticKeys = new Set<string>();

  async insertRawEvent(event: NormalizedEvent, semanticKey: string | null): Promise<InsertResult> {
    if (this.eventIds.has(event.eventId)) return 'duplicate_event_id';
    if (semanticKey && this.semanticKeys.has(semanticKey)) return 'duplicate_semantic';
    this.eventIds.add(event.eventId);
    if (semanticKey) this.semanticKeys.add(semanticKey);
    this.events.push(event);
    return 'inserted';
  }

  async recordDataQuality(issue: DataQualityIssue): Promise<void> {
    this.quality.push(issue);
  }
}
