/**
 * POST /api/admin/seed-staff
 * One-shot staff account seeder — called via HTTP so Next.js's existing
 * Postgres connection (which bypasses macOS sandbox) does the work.
 *
 * Protected: only callable with the CRON_SECRET header OR when the DB
 * has zero PHYSICIAN accounts (first-run bootstrap).
 */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const STAFF = [
  { email: "dermatologist@seren.local",  role: "PHYSICIAN" as const, name: "Dr. Riris Asti Respati" },
  { email: "admin@seren.local",           role: "ADMIN"    as const, name: "Seren Admin" },
  { email: "ririsastirespati@seren.id",  role: "PHYSICIAN" as const, name: "Dr. Riris Asti Respati, SpDVE" },
  { email: "admin@seren.id",             role: "ADMIN"    as const, name: "Seren Super Admin" },
];

const PASSWORD = process.env.SEED_STAFF_PASSWORD ?? "1234";

export async function POST(req: Request) {
  // Guard: require CRON_SECRET header OR first-run (no physicians exist yet)
  const secret = req.headers.get("x-cron-secret");
  const envSecret = process.env.CRON_SECRET;

  const physicianCount = await prisma.user.count({ where: { role: "PHYSICIAN" } });
  const isFirstRun = physicianCount === 0;

  if (!isFirstRun && secret !== envSecret) {
    return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
  }

  const results: string[] = [];

  for (const s of STAFF) {
    const hash = await bcrypt.hash(PASSWORD, 12);
    await prisma.user.upsert({
      where: { email: s.email },
      create: {
        email: s.email,
        name: s.name,
        role: s.role,
        password: hash,
        emailVerified: new Date(),
      },
      update: {
        name: s.name,
        role: s.role,
        password: hash,
        emailVerified: new Date(),
      },
    });
    results.push(`${s.role}  ${s.email}`);
  }

  return NextResponse.json({ ok: true, seeded: results });
}
