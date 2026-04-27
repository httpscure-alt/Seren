export type BudgetTier = "EVERYDAY" | "BALANCED" | "DERM_BRANDS";
export type RoutineStyle = "MINIMAL" | "STANDARD" | "INTENSIVE";

export type ProductCategory =
  | "CLEANSER"
  | "MAKEUP_REMOVER"
  | "MOISTURIZER"
  | "SUNSCREEN"
  | "NIACINAMIDE"
  | "AZELAIC_ACID"
  | "SALICYLIC_ACID_BHA"
  | "BENZOYL_PEROXIDE"
  | "RETINOID"
  | "SOOTHING_BARRIER_SERUM"
  | "SPOT_TREATMENT";

export type ProductCatalogItem = {
  id: string;
  name: string;
  category: ProductCategory;
  tier: BudgetTier;
  tags: string[]; // e.g. ["SENSITIVE_SAFE", "OILY_FRIENDLY", "FRAGRANCE_FREE_PREFERRED"]
  notes?: string;
};

export type AiCaseInput = {
  symptoms: string[];
  note?: string | null;
  // Optional personalization inputs (recommended UX)
  budgetTier?: BudgetTier;
  routineStyle?: RoutineStyle;
  isSensitiveSkin?: boolean;
  /**
   * Grounded regimen lines (catalog actives when matched). LLM context only — not a label claim.
   */
  currentRegimen?: Array<{
    line: string;
    usage: string;
    catalogActivesSummary?: string | null;
    source: string;
  }> | null;
};

export type PromptBundle = {
  system: string;
  user: string;
  outputSchemaJson: string;
};

const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionSummary: { type: "string" },
    severity: { type: "string", enum: ["Mild", "Moderate", "Severe"] },
    keySignals: { type: "array", items: { type: "string" }, maxItems: 8 },
    safety: {
      type: "object",
      additionalProperties: false,
      properties: {
        redFlags: { type: "array", items: { type: "string" }, maxItems: 8 },
        contraindications: { type: "array", items: { type: "string" }, maxItems: 8 },
        escalationAdvice: { type: "string" },
      },
      required: ["redFlags", "contraindications", "escalationAdvice"],
    },
    routine: {
      type: "object",
      additionalProperties: false,
      properties: {
        morning: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              step: { type: "string" },
              productIds: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 3 },
              why: { type: "string" },
              alternatives: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 3 },
            },
            required: ["step", "productIds", "why", "alternatives"],
          },
          minItems: 2,
          maxItems: 6,
        },
        evening: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              step: { type: "string" },
              productIds: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 3 },
              why: { type: "string" },
              alternatives: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 3 },
            },
            required: ["step", "productIds", "why", "alternatives"],
          },
          minItems: 2,
          maxItems: 6,
        },
      },
      required: ["morning", "evening"],
    },
    routineAnalysis: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          productName: { type: "string" },
          scores: {
            type: "object",
            additionalProperties: false,
            properties: {
              concernFit: { type: "integer", minimum: 0, maximum: 5 },
              ingredientQuality: { type: "integer", minimum: 0, maximum: 5 },
              tolerance: { type: "integer", minimum: 0, maximum: 5 },
              durationResult: { type: "integer", minimum: 0, maximum: 5 },
              compatibility: { type: "integer", minimum: 0, maximum: 5 },
            },
            required: ["concernFit", "ingredientQuality", "tolerance", "durationResult", "compatibility"],
          },
          action: { type: "string", enum: ["KEEP", "UPGRADE_CANDIDATE", "IMMEDIATE_REPLACE"] },
          reasoning: { type: "string" },
        },
        required: ["productName", "scores", "action", "reasoning"],
      },
    },
    next7Days: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
    next30Days: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
  },
  required: [
    "conditionSummary",
    "severity",
    "keySignals",
    "safety",
    "routine",
    "routineAnalysis",
    "next7Days",
    "next30Days",
  ],
} as const;

function json(v: unknown) {
  return JSON.stringify(v, null, 2);
}

function tierLabel(tier: BudgetTier | undefined) {
  if (tier === "EVERYDAY") return "Everyday (value / drugstore)";
  if (tier === "DERM_BRANDS") return "Derm brands (premium)";
  return "Balanced (mid)";
}

function styleLabel(style: RoutineStyle | undefined) {
  if (style === "MINIMAL") return "Minimal (lowest steps)";
  if (style === "INTENSIVE") return "Intensive (more steps; still safe)";
  return "Standard";
}

export function buildAiDraftPrompt(args: {
  input: AiCaseInput;
  catalog: ProductCatalogItem[];
  clinicianName?: string;
}): PromptBundle {
  const { input, catalog } = args;
  const clinicianName = args.clinicianName ?? "Dr. Riris Asti Respati, SpDVE";

  const system = [
    "You are Seren’s clinical drafting assistant.",
    "You MUST be conservative and safety-first.",
    "",
    "Hard rules:",
    "- Do NOT claim a definitive diagnosis. Use neutral, descriptive language.",
    "- Do NOT recommend prescription medicines (antibiotics, topical steroids, isotretinoin, etc.).",
    "- Do NOT provide emergency instructions beyond advising medical care.",
    "- If symptoms suggest severity/uncertainty, advise dermatologist review and escalation.",
    "- Output MUST be valid JSON that conforms to the provided JSON Schema. No extra keys. No markdown.",
    "",
    "Product rules:",
    "- You may ONLY recommend products by referencing catalog `id`s provided in the catalog list.",
    "- Prefer products tagged SENSITIVE_SAFE when sensitivity is true or uncertain.",
    "- Always include sunscreen in the morning routine unless explicitly impossible.",
    "- Keep routines simple and realistic. Avoid stacking multiple strong actives.",
    "",
    "Current regimen analysis (5-Pillar Scoring Framework):",
    "For EVERY product in `currentRegimen`, you must provide a mathematical score (0-5) based on these strict clinical pillars:",
    "1. Concern Fit: 0-2 (mismatch) -> suggest replace; 3-5 (matches concern, e.g. BHA for acne).",
    "2. Ingredient Quality: Evaluate formulation. Weak/no actives -> upgrade candidate.",
    "3. Tolerance: Any user-reported redness/stinging/breakout -> score 0-1 and set action to IMMEDIATE_REPLACE.",
    "4. Duration vs Result: <2 weeks (neutral); 6-8+ weeks with no improvement -> score 0-2 and suggest change.",
    "5. Routine Compatibility: Check conflicts (e.g. retinol + exfoliating acid same day). Conflict -> score 0-2.",
    "",
    "Action Logic:",
    "- score 0-2 on key pillars -> REPLACE_CANDIDATE / IMMEDIATE_REPLACE.",
    "- score 3-5 -> KEEP.",
    "",
    `All drafts will be reviewed by ${clinicianName}.`,
  ].join("\n");

  const user = [
    "Create a dermatologist-style draft report based on intake.",
    "",
    "Intake input:",
    json({
      symptoms: input.symptoms ?? [],
      note: input.note ?? null,
      preferences: {
        budgetTier: tierLabel(input.budgetTier),
        routineStyle: styleLabel(input.routineStyle),
        sensitiveSkin: Boolean(input.isSensitiveSkin),
      },
      currentRegimen: input.currentRegimen?.length ? input.currentRegimen : null,
    }),
    "",
    "Catalog (only allowed recommendations):",
    json(
      catalog.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        tier: p.tier,
        tags: p.tags,
        notes: p.notes ?? undefined,
      })),
    ),
    "",
    "Return JSON only.",
    "JSON Schema:",
    json(OUTPUT_SCHEMA),
  ].join("\n");

  return { system, user, outputSchemaJson: json(OUTPUT_SCHEMA) };
}

