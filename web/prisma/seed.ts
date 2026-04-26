/**
 * Seeds dermatologist + platform admin demo accounts (idempotent upserts).
 * Run when Postgres is up: `npx prisma db seed`
 *
 * Override with SEED_STAFF_PASSWORD (both) or SEED_PHYSICIAN_PASSWORD / SEED_ADMIN_PASSWORD.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const PHYSICIAN_EMAIL = "dermatologist@seren.local";
const ADMIN_EMAIL = "admin@seren.local";

const defaultPass = process.env.SEED_STAFF_PASSWORD ?? "1234";
const PHYSICIAN_PASS = process.env.SEED_PHYSICIAN_PASSWORD ?? defaultPass;
const ADMIN_PASS = process.env.SEED_ADMIN_PASSWORD ?? defaultPass;

async function upsertStaff(
  prisma: PrismaClient,
  email: string,
  password: string,
  role: Role,
  name?: string,
) {
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      password: hashed,
      role,
      name: name ?? null,
      emailVerified: new Date(),
    },
    update: {
      password: hashed,
      role,
      emailVerified: new Date(),
      ...(name ? { name } : {}),
    },
  });
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for seeding.");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await upsertStaff(
    prisma,
    PHYSICIAN_EMAIL,
    PHYSICIAN_PASS,
    Role.PHYSICIAN,
    "Dr. Riris Asti Respati",
  );
  await upsertStaff(prisma, ADMIN_EMAIL, ADMIN_PASS, Role.ADMIN, "Seren Admin");

  // Friends & family invite coupon (Option B) — used at signup to auto-grant access.
  await prisma.coupon.upsert({
    where: { code: "SERENFRIENDS" },
    create: {
      code: "SERENFRIENDS",
      kind: "PERCENT",
      percentOff: 100,
      eligiblePlans: ["journey"],
    },
    update: {
      kind: "PERCENT",
      percentOff: 100,
      eligiblePlans: ["journey"],
    },
  });

  console.log("Seed OK — staff accounts:");
  console.log(`  PHYSICIAN  ${PHYSICIAN_EMAIL}`);
  console.log(`  ADMIN      ${ADMIN_EMAIL}`);
  console.log("  (passwords from env SEED_* or defaults in prisma/seed.ts)");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
