import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  // ── Auth: PHYSICIAN or ADMIN only ────────────────────────────────────────
  const session = await requireRole(["PHYSICIAN", "ADMIN"]);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  const userId = (session as any)?.userId as string;

  const { caseId } = await params;
  const body = await req.json().catch(() => ({}));

  // ── Find the case ────────────────────────────────────────────────────────
  const theCase = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, publicId: true },
  });
  if (!theCase) {
    return NextResponse.json({ ok: false, error: "Case not found." }, { status: 404 });
  }

  // ── Save report + update case status atomically ──────────────────────────
  const result = await prisma.$transaction(async (tx) => {
    const contentJson = {
      clinician: { name: session.user?.name ?? "Dr. Riris Asti Respati, SpDVE" },
      clinicianEdits: {
        diagnosis: body.diagnosis ?? "",
        routine: body.routine ?? "",
      },
      selectedAdvice: Array.isArray(body.selectedAdvice) ? body.selectedAdvice : [],
      aiDraft: body.aiDraft ?? {},
      publishedFromPortal: true,
      publishedAt: new Date().toISOString(),
    };

    const report = await tx.report.upsert({
      where: { caseId },
      create: {
        caseId,
        clinicianId: userId,
        publishedAt: new Date(),
        contentJson: contentJson as any,
      },
      update: {
        clinicianId: userId,
        publishedAt: new Date(),
        contentJson: contentJson as any,
      },
      select: { id: true },
    });

    await tx.case.update({
      where: { id: caseId },
      data: { status: "PUBLISHED" },
    });

    await tx.auditLog.create({
      data: {
        caseId,
        actorId: userId,
        action: "physician.case.published",
        meta: { reportId: report.id } as any,
      },
    });

    return report;
  });

  return NextResponse.json({
    ok: true,
    reportId: result.id,
    publicId: theCase.publicId,
  });
}
