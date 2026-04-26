import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

const schema = z.object({
  role: z.enum(["USER", "PHYSICIAN", "ADMIN"]),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await requireRole(["ADMIN"]);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const { userId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.data.role as any },
  });

  return NextResponse.json({ ok: true });
}

