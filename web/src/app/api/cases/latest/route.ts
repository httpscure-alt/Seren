import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const latest = await prisma.case.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      publicId: true,
      status: true,
      createdAt: true,
      aiJobs: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { status: true, error: true, updatedAt: true },
      },
      report: { select: { publishedAt: true } },
    },
  });

  return NextResponse.json({ ok: true, latest });
}

