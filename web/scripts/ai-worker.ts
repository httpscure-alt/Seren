import "dotenv/config";
import { prisma } from "../src/lib/db";
import { log } from "../src/lib/logger";
import { buildAiDraftPrompt, type ProductCatalogItem } from "../src/lib/aiPrompt";

type Draft = {
  condition: string;
  severity: "Mild" | "Moderate" | "Severe";
  routine: {
    morning: string[];
    evening: string[];
  };
  pathway: string[];
};

const DEFAULT_CATALOG: ProductCatalogItem[] = [
  {
    id: "cleanser_cetaphil_gentle",
    name: "Cetaphil Gentle Skin Cleanser",
    category: "CLEANSER",
    tier: "BALANCED",
    tags: ["SENSITIVE_SAFE"],
  },
  {
    id: "moisturizer_skintific_5x_ceramide",
    name: "Skintific 5X Ceramide Moisturizer",
    category: "MOISTURIZER",
    tier: "BALANCED",
    tags: ["SENSITIVE_SAFE", "BARRIER_SUPPORT"],
  },
  {
    id: "sunscreen_azarine_hydrasoothe_spf45",
    name: "Azarine Hydrasoothe Sunscreen Gel SPF45 PA++++",
    category: "SUNSCREEN",
    tier: "EVERYDAY",
    tags: ["OILY_FRIENDLY"],
  },
  {
    id: "acne_bpo_benzolac",
    name: "Benzolac (benzoyl peroxide) spot treatment",
    category: "BENZOYL_PEROXIDE",
    tier: "EVERYDAY",
    tags: ["ACNE_TREATMENT", "SPOT_TREATMENT"],
  },
] as const;

function makeDraftFromInput(input: any): Draft {
  const symptoms: string[] = Array.isArray(input?.symptoms) ? input.symptoms : [];
  const hasInflammation = symptoms.some((s) => /red|inflam|pain|tender/i.test(s));
  const severity: Draft["severity"] = hasInflammation ? "Moderate" : "Mild";
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

async function claimJob() {
  const now = new Date();
  return await prisma.$transaction(async (tx) => {
    const job = await tx.aiJob.findFirst({
      where: {
        status: "QUEUED",
        OR: [{ lockedAt: null }, { lockedAt: { lt: new Date(Date.now() - 5 * 60_000) } }],
      },
      orderBy: { createdAt: "asc" },
      select: { id: true, caseId: true, attempts: true, inputJson: true },
    });

    if (!job) return null;

    const updated = await tx.aiJob.update({
      where: { id: job.id },
      data: {
        status: "RUNNING",
        lockedAt: now,
        startedAt: now,
        attempts: { increment: 1 },
      },
      select: { id: true, caseId: true, attempts: true, inputJson: true },
    });

    await tx.case.update({
      where: { id: updated.caseId },
      data: { status: "SUBMITTED" },
    });

    return updated;
  });
}

async function processJob(job: { id: string; caseId: string; attempts: number; inputJson: any }) {
  log("ai_job.start", { jobId: job.id, caseId: job.caseId, attempts: job.attempts });

  try {
    // Prompt builder (for real LLM integration). We still generate deterministic mock output for now.
    const prompt = buildAiDraftPrompt({
      input: {
        symptoms: Array.isArray(job.inputJson?.symptoms) ? job.inputJson.symptoms : [],
        note: typeof job.inputJson?.note === "string" ? job.inputJson.note : null,
        isSensitiveSkin: Boolean(job.inputJson?.isSensitiveSkin),
        budgetTier: job.inputJson?.budgetTier,
        routineStyle: job.inputJson?.routineStyle,
      } as any,
      catalog: DEFAULT_CATALOG as any,
      clinicianName: "Dr. Riris Asti Respati, SpDVE",
    });
    log("ai_job.prompt_built", { jobId: job.id, chars: prompt.user.length + prompt.system.length });

    const draft = makeDraftFromInput(job.inputJson);

    await prisma.$transaction(async (tx) => {
      await tx.aiJob.update({
        where: { id: job.id },
        data: {
          status: "SUCCEEDED",
          finishedAt: new Date(),
          outputJson: draft as any,
        },
      });

      await tx.report.upsert({
        where: { caseId: job.caseId },
        create: {
          caseId: job.caseId,
          contentJson: {
            aiDraft: draft,
            clinician: { name: "Dr. Riris Asti Respati, SpDVE" },
          } as any,
        },
        update: {
          contentJson: {
            aiDraft: draft,
            clinician: { name: "Dr. Riris Asti Respati, SpDVE" },
          } as any,
        },
      });

      await tx.case.update({
        where: { id: job.caseId },
        data: {
          status: "AI_DRAFTED",
          audits: {
            create: {
              action: "ai.drafted",
              meta: { severity: draft.severity },
            },
          },
        },
      });
    });

    log("ai_job.success", { jobId: job.id, caseId: job.caseId });
  } catch (err: any) {
    const message = err?.message ? String(err.message) : "Unknown error";
    await prisma.aiJob.update({
      where: { id: job.id },
      data: { status: "FAILED", finishedAt: new Date(), error: message },
    });
    await prisma.case.update({
      where: { id: job.caseId },
      data: { status: "SUBMITTED" },
    });
    log("ai_job.failed", { jobId: job.id, caseId: job.caseId, error: message });
  }
}

async function main() {
  const once = process.argv.includes("--once");
  const intervalMs = 1500;

  log("worker.start", { once });

  while (true) {
    const job = await claimJob();
    if (job) {
      await processJob(job);
    } else if (once) {
      break;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  log("worker.stop", {});
}

main()
  .catch((e) => {
    log("worker.crash", { error: String(e?.message ?? e) });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

