# AI / engineering skills — Seren intake & regimen

Use this file when implementing or changing **digital intake**, **skincare catalog**, **case submit**, or **LLM drafting**. It complements Cursor project rules.

## Intake regimen flow

1. **Autocomplete** — `GET /api/skincare-products?q=` returns active `SkincareProduct` rows (public, rate-limited). UI sends selected `id` as `productId` with `brandRaw` / `nameRaw` copied from the row for display consistency.
2. **Submit** — `POST /api/cases/submit` accepts optional `regimenLines[]` (`regimenLineSchema` in route). Server validates `productId` against active catalog, creates `CaseRegimenLine` rows, and embeds enriched `intake.regimen` in the `AiJob.inputJson` for the worker.
3. **AI worker** — `buildAiCaseInputFromJobInput` reads `intake.regimen` and sets `AiCaseInput.currentRegimen` for `buildAiDraftPrompt`.
4. **Physician portal** — Cases expose `regimenLines` with optional `product` join for `activesSummary`.

## When editing prompts

- Read **`docs/ai/guardrails-regimen-products.md`** and keep system/user prompts consistent: hints ≠ verified INCI; no definitive diagnosis from product names.
- After changing `aiPrompt.ts` or `llmDraft.ts`, run `npx tsc --noEmit` in `web/` and smoke the worker with `npm run ai-worker` (or project script) if present.

## When editing the catalog

- Update **`web/src/lib/skincareCatalogSeed.ts`** and re-run **`npx prisma db seed`** (or upsert in admin later). Keep `slug` stable for analytics.
- `activesSummary` should be **short** and **qualitative**; avoid unverified medical claims.

## Schema migrations

- Apply Prisma migrations that add `SkincareProduct` / `CaseRegimenLine` before relying on submit + search in deployed environments.

## Testing checklist

- Submit with valid `productId` → lines persisted; AI job `intake.regimen` includes `catalog.activesSummary`.
- Submit with invalid `productId` → 400.
- Submit with `FREE_TEXT` lines (`productId` null) → stored; LLM receives lines without catalog actives.
- Physician UI lists regimen with catalog hint when present.
