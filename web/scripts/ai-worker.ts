import "dotenv/config";
import { prisma } from "../src/lib/db";
import { log } from "../src/lib/logger";
import { DEFAULT_AI_PRODUCT_CATALOG } from "../src/lib/ai/defaultCatalog";
import {
  DEFAULT_CLINICIAN_LABEL,
  resolveLlmRoute,
  runAiDraftPipeline,
} from "../src/lib/ai/llmDraft";

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

async function processJob(job: { id: string; caseId: string; attempts: number; inputJson: unknown }) {
  log("ai_job.start", { jobId: job.id, caseId: job.caseId, attempts: job.attempts });

  try {
    const caseRow = await prisma.case.findUnique({
      where: { id: job.caseId },
      select: { uploads: { select: { url: true } } },
    });
    const imageUrls = caseRow?.uploads.map((u) => u.url) ?? [];

    const result = await runAiDraftPipeline({
      inputJson: job.inputJson,
      catalog: DEFAULT_AI_PRODUCT_CATALOG,
      imageUrls,
    });

    if (!result.ok) {
      throw new Error(result.error);
    }

    if (result.mode === "mock") {
      log("ai_job.mock_fallback", {
        jobId: job.id,
        caseId: job.caseId,
        hint: "Set MOONSHOT_API_KEY (Kimi) or OPENAI_API_KEY to call a real model.",
      });
    } else {
      log("ai_job.llm_ok", {
        jobId: job.id,
        caseId: job.caseId,
        model: result.model,
        images: imageUrls.length,
      });
    }

    const defaultEdits = {
      diagnosis: "",
      routine: "",
      updatedAt: new Date().toISOString(),
    };

    await prisma.$transaction(async (tx) => {
      const existingReport = await tx.report.findUnique({
        where: { caseId: job.caseId },
        select: { contentJson: true },
      });
      const prev =
        existingReport?.contentJson && typeof existingReport.contentJson === "object"
          ? { ...(existingReport.contentJson as Record<string, unknown>) }
          : {};

      const nextContent: Record<string, unknown> = {
        ...prev,
        aiDraft: result.draft,
      };

      if (!prev.clinician || typeof prev.clinician !== "object") {
        nextContent.clinician = { name: DEFAULT_CLINICIAN_LABEL };
      }
      if (!prev.clinicianEdits || typeof prev.clinicianEdits !== "object") {
        nextContent.clinicianEdits = defaultEdits;
      }

      await tx.aiJob.update({
        where: { id: job.id },
        data: {
          status: "SUCCEEDED",
          finishedAt: new Date(),
          outputJson: {
            mode: result.mode,
            model: result.model ?? null,
            imageCount: imageUrls.length,
            physicianDraft: result.draft,
          } as object,
        },
      });

      await tx.report.upsert({
        where: { caseId: job.caseId },
        create: {
          caseId: job.caseId,
          contentJson: nextContent as object,
        },
        update: {
          contentJson: nextContent as object,
        },
      });

      await tx.case.update({
        where: { id: job.caseId },
        data: {
          status: "AI_DRAFTED",
          audits: {
            create: {
              action: "ai.drafted",
              meta: {
                severity: result.draft.severity,
                mode: result.mode,
                model: result.model ?? null,
              },
            },
          },
        },
      });
    });

    log("ai_job.success", { jobId: job.id, caseId: job.caseId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
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

  log("worker.start", { once, llm: resolveLlmRoute().kind });

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
