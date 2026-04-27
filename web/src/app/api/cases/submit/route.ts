import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { makePublicCaseId } from "@/lib/publicId";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { rateLimit } from "@/lib/rateLimit";
import { log } from "@/lib/logger";
import {
  enrichRegimenLinesForIntake,
  regimenProductIdsValid,
} from "@/lib/regimenEnrichment";

const regimenLineSchema = z.object({
  productId: z.string().cuid().optional().nullable(),
  brandRaw: z.string().min(1).max(120),
  nameRaw: z.string().min(1).max(200),
  usageSlot: z.enum(["UNKNOWN", "AM", "PM", "BOTH"]).default("UNKNOWN"),
  userNote: z.string().max(500).optional().nullable(),
  source: z.enum(["PICKED", "FREE_TEXT"]).default("PICKED"),
});

const schema = z.object({
  symptoms: z.array(z.string().min(1).max(80)).max(30).default([]),
  note: z.string().max(4000).optional(),
  intake: z.record(z.string(), z.any()).optional(),
  regimenLines: z.array(regimenLineSchema).max(20).optional(),
  // For now we accept placeholders; production should use signed uploads.
  uploads: z
    .array(
      z.object({
        kind: z.string().min(1).max(40),
        // HTTPS object URLs or inline data URLs from intake (until signed uploads ship).
        url: z
          .string()
          .min(1)
          .max(5_500_000)
          .refine(
            (s) =>
              /^https?:\/\//i.test(s) ||
              s.startsWith("data:image/"),
            "Invalid upload URL",
          ),
      }),
    )
    .max(10)
    .optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const rl = rateLimit({ key: `cases.submit:${userId}`, limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again soon." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const regimenPayload = parsed.data.regimenLines ?? [];
  const enrichedRegimen =
    regimenPayload.length > 0 ? await enrichRegimenLinesForIntake(prisma, regimenPayload) : [];
  if (!regimenProductIdsValid(regimenPayload, enrichedRegimen)) {
    return NextResponse.json(
      { ok: false, error: "One or more product IDs are invalid or inactive." },
      { status: 400 },
    );
  }

  const intakeForAi = {
    ...(parsed.data.intake ?? {}),
    ...(enrichedRegimen.length ? { regimen: enrichedRegimen } : {}),
  };

  // Ensure publicId uniqueness (cheap retry loop).
  let publicId = makePublicCaseId();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.case.findUnique({ where: { publicId } });
    if (!exists) break;
    publicId = makePublicCaseId();
  }

  const created = await prisma.case.create({
    data: {
      publicId,
      userId,
      status: "SUBMITTED",
      symptoms: parsed.data.symptoms,
      note: parsed.data.note,
      uploads: parsed.data.uploads?.length
        ? {
            create: parsed.data.uploads.map((u) => ({ kind: u.kind, url: u.url })),
          }
        : undefined,
      regimenLines:
        enrichedRegimen.length > 0
          ? {
              create: enrichedRegimen.map((row) => ({
                sortOrder: row.sortOrder,
                usageSlot: row.usageSlot,
                productId: row.productId,
                brandRaw: row.brandRaw,
                nameRaw: row.nameRaw,
                userNote: row.userNote,
                source: row.source,
              })),
            }
          : undefined,
      aiJobs: {
        create: {
          status: "QUEUED",
          inputJson: {
            symptoms: parsed.data.symptoms,
            note: parsed.data.note ?? null,
            intake: intakeForAi,
          },
        },
      },
      audits: {
        create: {
          actorId: userId,
          action: "case.submitted",
          meta: {
            symptomsCount: parsed.data.symptoms.length,
            hasIntake: !!parsed.data.intake,
            regimenLineCount: enrichedRegimen.length,
          },
        },
      },
    },
    select: {
      id: true,
      publicId: true,
      status: true,
      createdAt: true,
    },
  });

  log("case.submitted", { userId, caseId: created.id, publicId: created.publicId });
  return NextResponse.json({ ok: true, case: created });
}

