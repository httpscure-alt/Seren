import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, password: true, emailVerified: true },
    });

    return NextResponse.json({
      ok: true,
      email,
      found: user != null,
      user: user
        ? {
            id: user.id,
            email: user.email,
            role: String(user.role),
            hasPassword: user.password != null && user.password.length > 0,
            emailVerified: user.emailVerified != null,
          }
        : null,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        email,
        error: "db_error",
        code: typeof e?.code === "string" ? e.code : undefined,
        message: typeof e?.message === "string" ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}

