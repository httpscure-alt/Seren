import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const origin = req.nextUrl.origin;
  const fail = () => NextResponse.redirect(new URL("/auth?error=verify", origin));

  if (!token || token.length < 16) return fail();

  const row = await prisma.verificationToken.findFirst({
    where: { token, expires: { gt: new Date() } },
  });

  if (!row) return fail();

  const email = row.identifier.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail();

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return fail();

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.deleteMany({ where: { token } }),
  ]);

  return NextResponse.redirect(new URL("/auth?verified=1", origin));
}
