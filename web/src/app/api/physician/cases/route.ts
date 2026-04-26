import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

export async function GET() {
  const session = await requireRole(["PHYSICIAN", "ADMIN"]);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const cases = await prisma.case.findMany({
    where: {
      status: { in: ["AI_DRAFTED", "UNDER_REVIEW", "SUBMITTED"] },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      publicId: true,
      status: true,
      createdAt: true,
      symptoms: true,
      note: true,
      uploads: { select: { id: true, kind: true, url: true, createdAt: true } },
      aiJobs: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, status: true, inputJson: true, createdAt: true },
      },
      report: {
        select: {
          id: true,
          publishedAt: true,
          clinicianId: true,
          contentJson: true,
          updatedAt: true,
        },
      },
      user: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, cases });
}

