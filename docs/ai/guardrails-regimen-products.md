# Guardrails: regimen products & catalog

Seren captures **brand/product** selections during intake, optionally linked to rows in `SkincareProduct`. This document governs how AI and humans should treat that data.

## Source of truth

| Layer | Role |
|--------|------|
| **`CaseRegimenLine`** | What the patient said they use (`brandRaw`, `nameRaw`, `usageSlot`, `userNote`). |
| **`SkincareProduct.activesSummary`** | Short internal hint for derm + LLM context — **not** a legal INCI or label claim. |
| **LLM output** | Draft only; must not invent definitive ingredient lists for unmatched products. |
| **Dermatologist** | Final clinical judgment; may override any catalog hint. |

## Model behavior

1. **Catalog match** — When `productId` resolves, use `activesSummary` as a **hint**. Prefer language like “often includes / typical focus: …” in narrative if needed; do not present as fact to patients.
2. **No match (`FREE_TEXT` or unresolved)** — Do **not** guess specific concentrations or full INCI. Acknowledge uncertainty; rely on symptoms, photos (supportive only), and escalation language.
3. **Safety** — Use regimen hints to **avoid duplicate strong actives** (e.g. retinoid + adapalene OTC + acid stack) unless the draft explicitly plans a supervised taper; default to conservative routines.
4. **Regional SKUs** — Same brand name may differ by country. Never assert equivalence across markets without verified data.

## Patient-facing copy

- Never promise that Seren “knows exactly what is inside” a product from name alone.
- Maintain alignment with Terms: automated suggestions are reviewed or refined by a dermatologist before publication.

## Data hygiene

- Keep `SkincareProduct` rows **active** only when clinically reviewed for your market.
- Prefer **slug** uniqueness; update `activesSummary` when reformulations are confirmed — do not silently change meaning without audit.

## Related code

- `web/prisma/schema.prisma` — `SkincareProduct`, `CaseRegimenLine`
- `web/src/lib/skincareCatalogSeed.ts` — seed list
- `web/src/lib/regimenEnrichment.ts` — resolves IDs at submit
- `web/src/lib/aiPrompt.ts` — `currentRegimen` in LLM user payload
- `web/src/lib/ai/llmDraft.ts` — maps `intake.regimen` → `AiCaseInput`
