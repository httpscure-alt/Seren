import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const session = await requireRole(["PHYSICIAN", "ADMIN"]);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { caseId } = await params;

  const theCase = await prisma.case.findUnique({
    where: { id: caseId },
    select: { id: true, publicId: true },
  });
  if (!theCase) {
    return NextResponse.json({ ok: false, error: "Case not found." }, { status: 404 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const report = await tx.report.upsert({
      where: { caseId },
      create: {
        caseId,
        clinicianId: userId,
        publishedAt: new Date(),
        contentJson: {
          clinician: { name: "Dr. Riris Asti Respati, SpDVE" },
          publishedFromPortal: true,
        } as any,
      },
      update: {
        clinicianId: userId,
        publishedAt: new Date(),
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

  return NextResponse.json({ ok: true, reportId: result.id, publicId: theCase.publicId });
}

