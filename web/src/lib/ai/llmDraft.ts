import OpenAI from "openai";
import { z } from "zod";
import {
  buildAiDraftPrompt,
  type AiCaseInput,
  type ProductCatalogItem,
} from "@/lib/aiPrompt";

const zRoutineStep = z.object({
  step: z.string(),
  productIds: z.array(z.string()).max(3),
  why: z.string(),
  alternatives: z.array(z.string()).max(3),
});

export const aiDraftLlmOutputSchema = z.object({
  conditionSummary: z.string(),
  severity: z.enum(["Mild", "Moderate", "Severe"]),
  keySignals: z.array(z.string()).max(8),
  safety: z.object({
    redFlags: z.array(z.string()).max(8),
    contraindications: z.array(z.string()).max(8),
    escalationAdvice: z.string(),
  }),
  routine: z.object({
    morning: z.array(zRoutineStep).min(2).max(6),
    evening: z.array(zRoutineStep).min(2).max(6),
  }),
  next7Days: z.array(z.string()).min(2).max(6),
  next30Days: z.array(z.string()).min(2).max(6),
});

export type AiDraftLlmOutput = z.infer<typeof aiDraftLlmOutputSchema>;

/** Shape stored in `Report.contentJson.aiDraft` for the physician portal. */
export type PhysicianAiDraftShape = {
  condition: string;
  severity: "Mild" | "Moderate" | "Severe";
  routine: { morning: string[]; evening: string[] };
  pathway: string[];
  /** Full model output for debugging / future UI. */
  structured?: AiDraftLlmOutput;
};

export const DEFAULT_CLINICIAN_LABEL = "Dr. Riris Asti Respati, SpDVE";

export function buildAiCaseInputFromJobInput(inputJson: unknown): AiCaseInput {
  const j = inputJson as Record<string, unknown> | null;
  const intake = j?.intake as Record<string, unknown> | undefined;
  const symptoms = Array.isArray(j?.symptoms)
    ? (j!.symptoms as unknown[]).filter((s): s is string => typeof s === "string")
    : [];
  const note = typeof j?.note === "string" ? j.note : null;

  const isSensitiveSkin = Boolean(
    intake?.stingsWithProducts === true ||
      intake?.easyRed === true ||
      intake?.historyAllergy === true ||
      (Array.isArray(intake?.barrierSigns) && (intake!.barrierSigns as unknown[]).length > 0),
  );

  const regimenRaw = intake?.regimen;
  let currentRegimen: AiCaseInput["currentRegimen"] = null;
  if (Array.isArray(regimenRaw) && regimenRaw.length > 0) {
    currentRegimen = regimenRaw.map((r: Record<string, unknown>) => {
      const brandRaw = typeof r.brandRaw === "string" ? r.brandRaw : "";
      const nameRaw = typeof r.nameRaw === "string" ? r.nameRaw : "";
      const catalog = r.catalog && typeof r.catalog === "object" ? (r.catalog as Record<string, unknown>) : null;
      return {
        line: `${brandRaw} ${nameRaw}`.trim() || String(r.nameRaw ?? ""),
        usage: String(r.usageSlot ?? "UNKNOWN"),
        catalogActivesSummary:
          catalog && typeof catalog.activesSummary === "string" ? catalog.activesSummary : null,
        source: String(r.source ?? "PICKED"),
      };
    });
  }

  return {
    symptoms,
    note,
    budgetTier: intake?.budgetTier as AiCaseInput["budgetTier"],
    routineStyle: intake?.routineStyle as AiCaseInput["routineStyle"],
    isSensitiveSkin,
    currentRegimen,
  };
}

function routineStepsToStrings(
  steps: AiDraftLlmOutput["routine"]["morning"],
  catalog: ProductCatalogItem[],
): string[] {
  const idToName = new Map(catalog.map((p) => [p.id, p.name]));
  return steps.map((s) => {
    const names = s.productIds.map((id) => idToName.get(id) ?? id).filter(Boolean);
    const productPart = names.length ? ` — ${names.join(", ")}` : "";
    return `${s.step}${productPart}. ${s.why}`.trim();
  });
}

export function normalizeLlmOutputToPhysicianDraft(
  parsed: AiDraftLlmOutput,
  catalog: ProductCatalogItem[],
): PhysicianAiDraftShape {
  return {
    severity: parsed.severity,
    condition: parsed.conditionSummary,
    routine: {
      morning: routineStepsToStrings(parsed.routine.morning, catalog),
      evening: routineStepsToStrings(parsed.routine.evening, catalog),
    },
    pathway: [...parsed.next7Days, ...parsed.next30Days].slice(0, 8),
    structured: parsed,
  };
}

/** Deterministic fallback when `OPENAI_API_KEY` is unset (local dev without billing). */
export function mockDraftFromInput(inputJson: unknown): PhysicianAiDraftShape {
  const j = inputJson as Record<string, unknown> | null;
  const symptoms: string[] = Array.isArray(j?.symptoms)
    ? (j!.symptoms as unknown[]).filter((s): s is string => typeof s === "string")
    : [];
  const hasInflammation = symptoms.some((s) => /red|inflam|pain|tender|acne|breakout/i.test(s));
  const severity: PhysicianAiDraftShape["severity"] = hasInflammation ? "Moderate" : "Mild";
  return {
    condition: hasInflammation
      ? "Localized erythema with barrier stress and reactive sensitivity."
      : "Mild barrier dysregulation with intermittent congestion.",
    severity,
    routine: {
      morning: ["Gentle cleanser", "Hydrating serum", "Barrier moisturizer", "SPF 50+"],
      evening: ["Gentle cleanse", "Targeted treatment (low-irritant)", "Barrier repair cream"],
    },
    pathway: [
      "Reassess in 10–14 days for inflammation trend.",
      "If persistent flare, escalate to dermatologist-guided treatment.",
    ],
  };
}

const MAX_IMAGES = 4;

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export type LlmProviderKind = "openai" | "moonshot";

type LlmRoute =
  | { kind: "openai"; apiKey: string; defaultModel: string }
  | {
      kind: "moonshot";
      apiKey: string;
      baseURL: string;
      defaultModel: string;
    }
  | { kind: "none" };

/** Resolve API keys / vendor. Moonshot (Kimi) wins when its key is set unless `AI_LLM_PROVIDER=openai`. */
export function resolveLlmRoute(): LlmRoute {
  const provider = process.env.AI_LLM_PROVIDER?.trim().toLowerCase();
  const moonshotKey =
    process.env.MOONSHOT_API_KEY?.trim() || process.env.KIMI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  if (provider === "openai") {
    if (!openaiKey) return { kind: "none" };
    return { kind: "openai", apiKey: openaiKey, defaultModel: "gpt-4o-mini" };
  }
  if (provider === "moonshot") {
    if (!moonshotKey) return { kind: "none" };
    return {
      kind: "moonshot",
      apiKey: moonshotKey,
      baseURL: process.env.MOONSHOT_BASE_URL?.trim() || "https://api.moonshot.ai/v1",
      defaultModel: "kimi-k2.6",
    };
  }

  if (moonshotKey) {
    return {
      kind: "moonshot",
      apiKey: moonshotKey,
      baseURL: process.env.MOONSHOT_BASE_URL?.trim() || "https://api.moonshot.ai/v1",
      defaultModel: "kimi-k2.6",
    };
  }
  if (openaiKey) {
    return { kind: "openai", apiKey: openaiKey, defaultModel: "gpt-4o-mini" };
  }
  return { kind: "none" };
}

export type RunAiDraftResult =
  | { ok: true; draft: PhysicianAiDraftShape; mode: LlmProviderKind | "mock"; model?: string }
  | { ok: false; error: string };

/** Parse model output; tolerate ```json fences and leading prose. */
function parseModelJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```/m.exec(trimmed);
  if (fence?.[1]) {
    return JSON.parse(fence[1].trim());
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }
  return JSON.parse(trimmed);
}

/**
 * Calls OpenAI or Moonshot (Kimi) when configured; otherwise returns a mock draft.
 * Moonshot uses the OpenAI-compatible endpoint (`MOONSHOT_BASE_URL`, default `https://api.moonshot.ai/v1`).
 * Optional `imageUrls` are passed when the chosen model supports vision.
 */
export async function runAiDraftPipeline(opts: {
  inputJson: unknown;
  catalog: ProductCatalogItem[];
  imageUrls?: string[];
}): Promise<RunAiDraftResult> {
  const input = buildAiCaseInputFromJobInput(opts.inputJson);
  const catalog = opts.catalog;
  const clinicianName = DEFAULT_CLINICIAN_LABEL;

  const prompt = buildAiDraftPrompt({
    input,
    catalog,
    clinicianName,
  });

  const route = resolveLlmRoute();
  if (route.kind === "none") {
    return { ok: true, draft: mockDraftFromInput(opts.inputJson), mode: "mock" };
  }

  const model = process.env.AI_MODEL?.trim() || route.defaultModel;
  const imageUrls = (opts.imageUrls ?? []).filter(isHttpUrl).slice(0, MAX_IMAGES);

  const visionNote =
    imageUrls.length > 0
      ? "\n\nThe patient attached skin photo(s). Use them only as supportive context; do not claim a definitive diagnosis from images alone."
      : "";

  const client =
    route.kind === "moonshot"
      ? new OpenAI({
          apiKey: route.apiKey,
          baseURL: route.baseURL,
        })
      : new OpenAI({ apiKey: route.apiKey });

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
    { type: "text", text: `${prompt.user}${visionNote}` },
    ...imageUrls.map(
      (url): OpenAI.Chat.ChatCompletionContentPart => ({
        type: "image_url",
        image_url: { url, detail: "low" },
      }),
    ),
  ];

  const mode: LlmProviderKind = route.kind === "moonshot" ? "moonshot" : "openai";

  try {
    const baseReq = {
      model,
      max_tokens: 4096,
      messages: [
        { role: "system" as const, content: prompt.system },
        {
          role: "user" as const,
          content: imageUrls.length > 0 ? userContent : prompt.user + visionNote,
        },
      ],
    };

    // Kimi K2 models often reject custom `temperature`; OpenAI benefits from JSON mode + low temperature.
    let completion: OpenAI.Chat.ChatCompletion;
    if (route.kind === "moonshot") {
      const thinking =
        process.env.KIMI_THINKING === "enabled" || process.env.KIMI_THINKING === "disabled"
          ? { thinking: { type: process.env.KIMI_THINKING as "enabled" | "disabled" } }
          : {};
      completion = (await client.chat.completions.create({
        ...baseReq,
        response_format: { type: "json_object" },
        ...thinking,
      })) as OpenAI.Chat.ChatCompletion;
    } else {
      completion = await client.chat.completions.create({
        ...baseReq,
        temperature: 0.35,
        response_format: { type: "json_object" },
      });
    }

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return { ok: false, error: "Empty model response." };
    }

    let json: unknown;
    try {
      json = parseModelJson(raw);
    } catch {
      return { ok: false, error: "Model returned non-JSON." };
    }

    const parsed = aiDraftLlmOutputSchema.safeParse(json);
    if (!parsed.success) {
      return {
        ok: false,
        error: `Schema validation failed: ${parsed.error.message}`,
      };
    }

    const draft = normalizeLlmOutputToPhysicianDraft(parsed.data, catalog);
    return { ok: true, draft, mode, model };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}
