import { ANALYTICS_CONFIG } from './config';
import type { ConsentSnapshot } from './types';

export const CONSENT_STORAGE_KEY = 'pb_consent_v2';
export const LEGACY_CONSENT_STORAGE_KEY = 'pb_cookie_consent';
export const CONSENT_CHANGED_EVENT = 'pb:consent-changed';

type PersistedConsentV2 = {
  v: 2;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  updatedAt: string;
};

export function defaultConsent(): ConsentSnapshot {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
    policyVersion: ANALYTICS_CONFIG.consentPolicyVersion,
  };
}

function parseV2(raw: string | null): ConsentSnapshot | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<PersistedConsentV2>;
    if (value.v !== 2) return null;
    return {
      necessary: true,
      analytics: value.analytics === true,
      marketing: value.marketing === true,
      personalization: value.personalization === true,
      policyVersion: ANALYTICS_CONFIG.consentPolicyVersion,
    };
  } catch {
    return null;
  }
}

export function readConsentSnapshot(storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage): ConsentSnapshot {
  const v2 = parseV2(storage.getItem(CONSENT_STORAGE_KEY));
  if (v2) return v2;

  // One-time migration from the previous bundled choice.
  const legacy = storage.getItem(LEGACY_CONSENT_STORAGE_KEY);
  if (legacy === 'accepted' || legacy === 'rejected') {
    const granted = legacy === 'accepted';
    const migrated = {
      necessary: true as const,
      analytics: granted,
      marketing: granted,
      personalization: granted,
      policyVersion: ANALYTICS_CONFIG.consentPolicyVersion,
    };
    writeConsentSnapshot(migrated, storage);
    return migrated;
  }

  return defaultConsent();
}

export function hasStoredConsent(storage: Pick<Storage, 'getItem'> = localStorage): boolean {
  const raw = storage.getItem(CONSENT_STORAGE_KEY);
  if (parseV2(raw)) return true;
  const legacy = storage.getItem(LEGACY_CONSENT_STORAGE_KEY);
  return legacy === 'accepted' || legacy === 'rejected';
}

export function writeConsentSnapshot(
  consent: ConsentSnapshot,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  const value: PersistedConsentV2 = {
    v: 2,
    analytics: consent.analytics === true,
    marketing: consent.marketing === true,
    personalization: consent.personalization === true,
    updatedAt: new Date().toISOString(),
  };
  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
}

export function canCollectClientAnalytics(consent: ConsentSnapshot): boolean {
  return consent.analytics === true;
}

export function canPersonalize(consent: ConsentSnapshot): boolean {
  return consent.analytics === true && consent.personalization === true;
}

export function canRecordReplay(consent: ConsentSnapshot): boolean {
  return consent.analytics === true;
}
