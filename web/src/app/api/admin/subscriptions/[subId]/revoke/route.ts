import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ subId: string }> },
) {
  const session = await requireRole(["ADMIN"]);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const { subId } = await params;
  await prisma.subscription.update({
    where: { id: subId },
    data: { status: "CANCELED" },
  });
  return NextResponse.json({ ok: true });
}

