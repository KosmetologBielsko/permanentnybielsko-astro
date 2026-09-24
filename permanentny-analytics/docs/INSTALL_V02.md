# Permanentny Analytics CORE v0.2 — installation plan

Do not enable production tracking before the Preview checks pass.

## 1. Dependencies

From the root of `permanentnybielsko.com`:

```powershell
npm install @neondatabase/serverless web-vitals
npm install -D tsx
```

Then:

```powershell
npm run build
npm run test:analytics
```

## 2. PostgreSQL / Neon

Create a PostgreSQL database. The supplied implementation uses the Neon serverless driver, but the SQL model is ordinary PostgreSQL.

Run in order:

1. `permanentny-analytics/sql/001_core_schema.sql`
2. `permanentny-analytics/sql/002_views.sql`

Do not put `DATABASE_URL` in browser code.

## 3. Environment variables

Local `.env` or Vercel environment:

```text
DATABASE_URL=postgresql://...
PUBLIC_PA_ENABLED=false
```

First deploy Preview with `PUBLIC_PA_ENABLED=false`.

After schema + collector are confirmed, set **Preview only**:

```text
PUBLIC_PA_ENABLED=true
```

Production stays false until Preview passes.

## 4. Preview smoke test

Use a fresh browser profile.

### Necessary-only

- decline optional cookies;
- verify `/api/analytics/collect` is not called by Permanentny Analytics;
- no `pa_visitor_v2` and no `pa_session_v2`.

### Analytics yes / Marketing no

- Permanentny Analytics calls collector;
- Clarity receives analytics consent;
- Google ad storage remains denied;
- first-party `visitor_id` exists on standard pages;
- Google Ads conversion events are not emitted by our custom Booksy/form hooks.

### All accepted

- client analytics works;
- Google Ads measurement may run;
- Clarity gets granted analytics/ad signal according to the chosen categories.

### Sensitive page

Open `/sercemmalowane/` after consenting to Analytics.

DB row should have:

- `privacy_scope = aggregate_only`
- `visitor_id IS NULL`
- `session_id IS NULL`
- `tab_id IS NULL`
- `attribution_context IS NULL`

Then move to a standard page: it must get a fresh session.

### Conversion semantics

- Booksy: `booksy_click`, never `booking_completed`
- tel link: `phone_click`
- successful Formspree response: `form_submit`
- form validation/error must not emit `form_submit`

## 5. Network checks

Collector endpoint:

```text
POST /api/analytics/collect
```

Expected successful status:

```text
202
```

Retries use the same `event_id`; duplicates must not create another RAW event.

## 6. Only after Preview passes

Enable `PUBLIC_PA_ENABLED=true` for Production and deploy.

For the first 48–72 hours review RAW + Data Quality before creating any management dashboard.
