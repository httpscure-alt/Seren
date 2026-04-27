# Seren repo summary (living doc)

This repo contains the **Seren web app** (Next.js App Router) and a **standalone referral service design** (not wired into the main app yet).

---

## What’s in the repo

- **`web/`**: Main Next.js app (Next 16, React 19) with Prisma/Postgres, Auth (next-auth), admin + physician portals, intake → AI draft worker pipeline.
- **`referral-service/`**: Separate bounded-context **design** for referrals/affiliates (its own Prisma schema + docs). Not integrated into `web/`.
- **`docs/ai/`**: AI policy + “skills” documentation for intake regimen + catalog behavior.

---

## Quick start (local)

From repo root:

- **Run the app**: `npm run dev`
- **Run Postgres** (optional, but required for most flows):

```bash
cd web
docker compose up -d
```

Then (in `web/`):

- **Migrate + seed**:
  - `npx prisma migrate dev` (or `npx prisma migrate deploy`)
  - `npx prisma db seed`
- **Start AI worker** (separate process):
  - `npm run worker` (or `npm run worker:once`)

---

## Environment variables (web)

Minimum for a real backend:

- **`DATABASE_URL`**: Postgres connection string.

AI drafting (optional):

- **`AI_LLM_PROVIDER`**: `openai` or `moonshot` (optional; auto-detects keys).
- **`OPENAI_API_KEY`**: enables OpenAI calls.
- **`MOONSHOT_API_KEY`** or **`KIMI_API_KEY`**: enables Moonshot/Kimi calls.
- **`AI_MODEL`**: overrides default model (otherwise `gpt-4o-mini` or `kimi-k2.6`).

Email (optional):

- **`RESEND_API_KEY`**
- **`RESEND_FROM`** (default fallback is used if unset)

Share/ref links (optional but recommended):

- **`NEXT_PUBLIC_SITE_URL`**: used by share demos to build referral URLs.

Payments (optional):

- Midtrans env is read via `midtransConfig()` (see `web/src/lib/midtrans` and Midtrans routes).

---

## Product flows (current implementation)

### Intake → case submit → AI draft → dermatologist review

1. **Intake UI**: `web/src/app/consult/intake/IntakeClient.tsx`
2. **Submit**: `POST web/src/app/api/cases/submit/route.ts`
   - Creates `Case` (status `SUBMITTED`)
   - Creates `AiJob` (status `QUEUED`) with `inputJson` containing `symptoms`, `note`, `intake`
   - Optionally persists **regimen product lines** (see below)
3. **Worker**: `web/scripts/ai-worker.ts`
   - Claims queued jobs, runs `runAiDraftPipeline()`
   - Upserts `Report.contentJson.aiDraft`
   - Sets `Case.status = AI_DRAFTED`
4. **Physician portal**: `/physician`
   - `web/src/app/physician/PhysicianPortalClient.tsx` renders intake + `aiDraft`

### Admin portal

Routes live under `web/src/app/admin/` (all require ADMIN):

- `/admin` dashboard
- `/admin/users`, `/admin/cases`, `/admin/ai-jobs`, `/admin/messages` (care threads),
  `/admin/subscriptions`, `/admin/promos`, `/admin/audit`, `/admin/analytics`

### Payments (Midtrans)

Key routes:

- `POST /api/payments/midtrans/create`
- `POST /api/payments/midtrans/webhook`

Webhook marks payment success/failure and creates a subscription on settlement/capture.

---

## Skincare product catalog + intake regimen lines (new)

Goal: let users pick **brand + product name** (or free-text) and store it in DB for:

- dermatologists to see “what they actually use”
- AI draft to avoid stacking duplicate actives (guardrail)

### Database models

In `web/prisma/schema.prisma`:

- `SkincareProduct`: curated SKU catalog (`brand`, `name`, `slug`, `activesSummary`, `ingredientsJson`, `isActive`)
- `CaseRegimenLine`: per-case regimen rows with `usageSlot` (`AM/PM/etc`), optional `productId`, plus `brandRaw/nameRaw`

Migration:

- `web/prisma/migrations/20260427120000_skincare_regimen_catalog/migration.sql`

Seed:

- `web/src/lib/skincareCatalogSeed.ts`
- `web/prisma/seed.ts` upserts by `slug`

### API

- `GET /api/skincare-products?q=`: public autocomplete feed for intake search (`web/src/app/api/skincare-products/route.ts`)
- `POST /api/cases/submit`: accepts optional `regimenLines[]` and persists them; also enriches `intake.regimen` for the AI worker.

### AI integration

- `web/src/lib/regimenEnrichment.ts`: server-side enrichment and validation
- `web/src/lib/ai/llmDraft.ts`: maps `intake.regimen` → `AiCaseInput.currentRegimen`
- `web/src/lib/aiPrompt.ts`: includes `currentRegimen` in the LLM input + extra rules (avoid duplicates; hint ≠ verified INCI)

### Physician UI integration

`/physician` now fetches and renders `regimenLines` with optional catalog `activesSummary` hint.

---

## Demos (UX prototypes)

Central index:

- **`/demos`** (new hub)

Intake mocks:

- **`/demos/intake-routine-mock`**: friendly routine step mock + embedded product picker
- **`/demos/intake-regimen-products-mock`**: standalone product picker demo wired to `/api/skincare-products`

Share/referral mocks (design-only):

- **`/demos/share-fun/wrapped`**: on-brand share card + referral URL (`?ref=`) + points catalog mock
- **`/demos/share-fun/program-mock`**: “share → points → creators” program story page

Dev convenience:

- `DevDemoLinksBanner` shows quick mock links on `/consult/welcome` and `/consult/intake` in `NODE_ENV=development`.

---

## Docs: AI guardrails & skills

- `docs/ai/guardrails-regimen-products.md`: rules for using regimen/product info safely (no inventing ingredients, hint-only `activesSummary`, conservative stacking)
- `docs/ai/skills.md`: engineering checklist for intake regimen plumbing (API → submit → worker → portal)

---

## “Things to do next” (prioritized)

### P0 — make the regimen picker production-ready

- **Add the regimen picker into the real intake UI** (`IntakeClient`) and include `regimenLines` in the `POST /api/cases/submit` payload.
- Add basic UX polish for search:
  - empty-state guidance (e.g. “try brand only”)
  - dedupe identical selected products
  - optional “how often” / “strength” free text per line

### P0 — migrate + seed in all environments

- Ensure the migration is applied anywhere you run the app.
- Run `npx prisma db seed` so `/api/skincare-products` returns results.

### P1 — catalog management

- Add admin UI (or internal script) to manage `SkincareProduct`:
  - activate/deactivate SKUs
  - edit `activesSummary` safely
  - optionally record verified INCI and sources (future)

### P1 — AI quality & guardrails

- Extend prompt to better handle “unknown product” cases and to **explicitly** avoid claims based on bottle names.
- Add lightweight eval fixtures (seed sample cases + expected JSON schema validity).

### P2 — referral system (real, not demo)

- Integrate `referral-service/` (or an equivalent service) into `web/`:
  - persist `ref` from landing → signup → payment
  - ledger + points balance
  - creator support (codes, dashboards, payouts)

### P2 — ops and reliability

- Replace in-memory rate limiter (`web/src/lib/rateLimit.ts`) with a shared store (Redis) in production.
- Productionize uploads (move away from intake `data:image/*` URLs → signed uploads).

