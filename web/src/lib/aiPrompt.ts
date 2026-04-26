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
    next7Days: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
    next30Days: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
  },
  required: ["conditionSummary", "severity", "keySignals", "safety", "routine", "next7Days", "next30Days"],
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

