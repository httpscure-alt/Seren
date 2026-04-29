import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

const patchSchema = z.object({
  diagnosis: z.string().max(4000).optional(),
  routine: z.string().max(6000).optional(),
  setUnderReview: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const session = await requireRole(["PHYSICIAN", "ADMIN"]);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { caseId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const theCase = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, status: true, report: { select: { id: true, contentJson: true } } },
  });
  if (!theCase) {
    return NextResponse.json({ ok: false, error: "Case not found." }, { status: 404 });
  }

  const current = (theCase.report?.contentJson ?? {}) as any;
  const clinicianEdits = {
    ...(current?.clinicianEdits ?? {}),
    ...(parsed.data.diagnosis !== undefined ? { diagnosis: parsed.data.diagnosis } : {}),
    ...(parsed.data.routine !== undefined ? { routine: parsed.data.routine } : {}),
    updatedAt: new Date().toISOString(),
    updatedByUserId: userId,
  };

  const nextContent = {
    ...current,
    clinician: current?.clinician ?? { name: "dr. Riris Asti Respati, SpDVE" },
    clinicianEdits,
  } as any;

  const updated = await prisma.$transaction(async (tx) => {
    const report = await tx.report.upsert({
      where: { caseId },
      create: {
        caseId,
        clinicianId: userId,
        contentJson: nextContent,
      },
      update: {
        clinicianId: userId,
        contentJson: nextContent,
      },
      select: { id: true, updatedAt: true },
    });

    if (parsed.data.setUnderReview) {
      await tx.case.update({ where: { id: caseId }, data: { status: "UNDER_REVIEW" } });
    }

    await tx.auditLog.create({
      data: {
        caseId,
        actorId: userId,
        action: "physician.case.updated",
        meta: {
          diagnosisChanged: parsed.data.diagnosis !== undefined,
          routineChanged: parsed.data.routine !== undefined,
        } as any,
      },
    });

    return report;
  });

  return NextResponse.json({ ok: true, reportId: updated.id });
}

