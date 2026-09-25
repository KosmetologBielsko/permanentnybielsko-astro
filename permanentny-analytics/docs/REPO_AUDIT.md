# Permanentny Analytics — audit repo permanentnybielsko.com

Audit basis: uploaded project snapshot `permanentnybielsko-project.zip.zip`, 2026-09-24.

## Confirmed stack

- Astro 6.3.8
- `@astrojs/vercel` 10.0.8
- static-first Astro with Vercel adapter
- one shared `src/layouts/Layout.astro`
- current Google Ads tag: `AW-18200277713`
- Microsoft Clarity project: `y4x08qso9k`
- custom cookie banner
- 89 `.astro` page files, including 60 poradnik article files
- existing APIs: `/api/assistant` and `/api/pmu-lead`

No explicit `G-...` GA4 measurement ID was found in the source snapshot. This does **not** prove GA4 is absent from the account; it may be connected through Google tag configuration outside this repo.

## Integration findings

### Consent

Current banner stored one binary value:

- `pb_cookie_consent=accepted`
- `pb_cookie_consent=rejected`

`accepted` granted analytics and Google advertising storage together and loaded Clarity.

CORE v0.2 migrates this to:

- Necessary
- Analytics
- Marketing / Personalization

New key: `pb_consent_v2`.

Legacy decisions are migrated once. A historic `accepted` maps to all optional categories granted because that was exactly the bundled choice presented by the previous banner. A historic `rejected` maps to necessary-only.

### Form

`PmuLeadForm.astro` currently submits to Formspree. The repo also contains `/api/pmu-lead.ts`, but the displayed form does not currently use that API.

CORE v0.2 does **not** alter the business delivery path. It emits `form_submit` only after the existing Formspree request returns success. It never reads or transmits the user's form field values to Permanentny Analytics.

### Gallery

The existing `pmu-gallery.ts` opens the native dialog only after `showModal()` succeeds. Analytics hooks are inserted after that success and when a gallery asset is actually rendered. This prevents counting a failed click as an open/view.

### Booksy / phone / social

There are many Booksy and `tel:` links across the site, so CORE uses delegated click handling at document level. This avoids editing dozens of pages and keeps one source of truth.

### Prices

Meaningful price views are explicitly instrumented on:

- brows service: `brows`
- lips service: `lips`
- eyes service: `eyes`
- PMU pricing catalog groups

A price view requires at least 50% visibility for at least 1000 ms.

### Sensitive content

`/sercemmalowane/` and health-related guide slugs are `sensitive`.

For sensitive pages:

- analytics consent is still required;
- visitor ID = null;
- session ID = null;
- tab ID = null;
- attribution = null;
- service interest = null;
- event properties are stripped except minimal Web Vital measurements;
- page-view ID is ephemeral and retained only to deduplicate events within that one document view.

Entering a sensitive page also breaks the current pseudonymous session. A later standard page starts a fresh session, so the system cannot reconstruct `standard -> sensitive -> standard` as a health-interest journey.

## Rollout safety

`PUBLIC_PA_ENABLED=false` disables the first-party tracker. This allows the code to be merged and built before any data collection starts.

Recommended sequence:

1. merge code with tracker disabled;
2. install dependencies;
3. create Preview PostgreSQL/Neon DB;
4. apply SQL;
5. set `DATABASE_URL`;
6. set `PUBLIC_PA_ENABLED=true` only in Vercel Preview;
7. verify collection and privacy;
8. then enable Production.

## Deliberately deferred

Not in v0.2:

- session replay / rrweb;
- rage/dead click algorithms;
- personalization;
- health or inferred sensitive segments;
- global Edge request logging;
- dashboard;
- first-party remarketing;
- confirmed Booksy booking (we only know outbound click).
