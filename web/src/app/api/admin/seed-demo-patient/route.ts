import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

async function handle(req: Request, body: any) {
  const email = String(body?.email || "patient.demo@seren.id")
    .trim()
    .toLowerCase();
  const password = String(body?.password || "1234");
  const name = String(body?.name || "Demo Patient");
  const publicId = String(body?.publicId || "SRN-9901").trim().toUpperCase();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  try {
    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name,
        role: "USER",
        password: hashed,
        emailVerified: now,
      },
      update: {
        name,
        role: "USER",
        password: hashed,
        emailVerified: now,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    // Ensure subscription so /report doesn't redirect to /paywall
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "JOURNEY_30D",
        status: "ACTIVE",
        startsAt: now,
        expiresAt,
        provider: "MIDTRANS",
        providerRef: null,
      },
    }).catch(() => {
      // ignore duplicates (if any); entitlement checks only need one ACTIVE row.
    });

    const c = await prisma.case.upsert({
      where: { publicId },
      create: {
        publicId,
        userId: user.id,
        status: "PUBLISHED",
        symptoms: ["acne", "sensitivity"],
        note: "Demo case for patient POV",
      },
      update: {
        userId: user.id,
        status: "PUBLISHED",
      },
      select: { id: true, publicId: true },
    });

    const report = await prisma.report.upsert({
      where: { caseId: c.id },
      create: {
        caseId: c.id,
        version: 1,
        publishedAt: now,
        clinicianId: null,
        contentJson: {
          aiDraft: { condition: "Acne + barrier irritation (demo)", severity: "Mild" },
          clinicianEdits: {
            diagnosis: "Mild acne with skin barrier sensitivity (demo report).",
            routine:
              "AM:\n- Gentle cleanser\n- Lightweight moisturizer\n- Sunscreen\n\nPM:\n- Gentle cleanser\n- Moisturizer",
            topline: "Your skin will calm down with consistent barrier support.",
          },
          selectedAdvice: ["sun", "pillow", "hands"],
        },
      },
      update: {
        publishedAt: now,
        contentJson: {
          aiDraft: { condition: "Acne + barrier irritation (demo)", severity: "Mild" },
          clinicianEdits: {
            diagnosis: "Mild acne with skin barrier sensitivity (demo report).",
            routine:
              "AM:\n- Gentle cleanser\n- Lightweight moisturizer\n- Sunscreen\n\nPM:\n- Gentle cleanser\n- Moisturizer",
            topline: "Your skin will calm down with consistent barrier support.",
          },
          selectedAdvice: ["sun", "pillow", "hands"],
        },
      },
      select: { id: true, publishedAt: true },
    });

    return NextResponse.json({
      ok: true,
      user,
      publicId: c.publicId,
      reportPublishedAt: report.publishedAt,
      login: { email, password },
      links: { dashboard: "/results", report: `/report/${c.publicId.toLowerCase()}` },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "seed_failed",
        code: typeof e?.code === "string" ? e.code : undefined,
        message: typeof e?.message === "string" ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}

async function ensureAuthorized(req: Request) {
  if (isAuthorized(req)) return;
  // Allow staff (ADMIN/PHYSICIAN) to trigger from browser session.
  const session = await getServerSession(authOptions).catch(() => null);
  const role = (session as any)?.role as string | undefined;
  const isStaff = !!session?.user?.email && (role === "ADMIN" || role === "PHYSICIAN");
  if (!isStaff) {
    throw new Error("unauthorized");
  }
}

export async function POST(req: Request) {
  try {
    await ensureAuthorized(req);
    const body = await req.json().catch(() => ({} as any));
    return await handle(req, body);
  } catch (e: any) {
    if (String(e?.message) === "unauthorized") {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    throw e;
  }
}

export async function GET(req: Request) {
  try {
    await ensureAuthorized(req);
    // Allow seeding by just opening in browser.
    const { searchParams } = new URL(req.url);
    const body = {
      email: searchParams.get("email") ?? undefined,
      password: searchParams.get("password") ?? undefined,
      name: searchParams.get("name") ?? undefined,
      publicId: searchParams.get("publicId") ?? undefined,
    };
    return await handle(req, body);
  } catch (e: any) {
    if (String(e?.message) === "unauthorized") {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { ok: false, error: "seed_failed", message: typeof e?.message === "string" ? e.message : String(e) },
      { status: 500 },
    );
  }
}

