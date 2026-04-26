import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ couponId: string }> },
) {
  const session = await requireRole(["ADMIN"]);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const { couponId } = await params;
  await prisma.coupon.delete({ where: { id: couponId } });
  return NextResponse.json({ ok: true });
}

