/**
 * Seeds dermatologist + platform admin demo accounts (idempotent upserts).
 * Run when Postgres is up: `npx prisma db seed`
 *
 * Override with SEED_STAFF_PASSWORD (both) or SEED_PHYSICIAN_PASSWORD / SEED_ADMIN_PASSWORD.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, type PoolConfig } from "pg";
import { SKINCARE_CATALOG_SEED } from "../src/lib/skincareCatalogSeed";

const PHYSICIAN_EMAIL = "dermatologist@seren.local";
const ADMIN_EMAIL     = "admin@seren.local";

// Production staff
const PROD_PHYSICIAN_EMAIL = "ririsastirespati@seren.id";
const PROD_ADMIN_EMAIL     = "admin@seren.id";

const defaultPass   = process.env.SEED_STAFF_PASSWORD ?? "1234";
const PHYSICIAN_PASS = process.env.SEED_PHYSICIAN_PASSWORD ?? defaultPass;
const ADMIN_PASS     = process.env.SEED_ADMIN_PASSWORD    ?? defaultPass;

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
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for seeding.");
  }

  let ssl: PoolConfig["ssl"] | undefined;
  try {
    const u = new URL(connectionString);
    if (u.hostname.endsWith(".pooler.supabase.com")) {
      u.searchParams.delete("sslmode");
      connectionString = u.toString();
      ssl = { rejectUnauthorized: false };
    }
  } catch {
    // ignore
  }
  const pool = new Pool({ connectionString, ssl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await upsertStaff(prisma, PHYSICIAN_EMAIL, PHYSICIAN_PASS, Role.PHYSICIAN, "Dr. Riris Asti Respati");
  await upsertStaff(prisma, ADMIN_EMAIL,     ADMIN_PASS,     Role.ADMIN,      "Seren Admin");

  // Production staff accounts
  await upsertStaff(prisma, PROD_PHYSICIAN_EMAIL, PHYSICIAN_PASS, Role.PHYSICIAN, "Dr. Riris Asti Respati, SpDVE");
  await upsertStaff(prisma, PROD_ADMIN_EMAIL,     ADMIN_PASS,     Role.ADMIN,     "Seren Super Admin");

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

  for (const row of SKINCARE_CATALOG_SEED) {
    await prisma.skincareProduct.upsert({
      where: { slug: row.slug },
      create: {
        brand: row.brand,
        name: row.name,
        slug: row.slug,
        market: row.market ?? null,
        activesSummary: row.activesSummary ?? null,
        category: row.category ?? null,
        ingredientsJson: row.ingredientsJson
          ? (row.ingredientsJson as Prisma.InputJsonValue)
          : undefined,
      },
      update: {
        brand: row.brand,
        name: row.name,
        market: row.market ?? null,
        activesSummary: row.activesSummary ?? null,
        category: row.category ?? null,
        ingredientsJson: row.ingredientsJson
          ? (row.ingredientsJson as Prisma.InputJsonValue)
          : undefined,
        isActive: true,
      },
    });
  }

  console.log("Seed OK — staff accounts:");
  console.log(`  PHYSICIAN  ${PHYSICIAN_EMAIL}  (dev/local)`);
  console.log(`  ADMIN      ${ADMIN_EMAIL}  (dev/local)`);
  console.log(`  PHYSICIAN  ${PROD_PHYSICIAN_EMAIL}  (production)`);
  console.log(`  ADMIN      ${PROD_ADMIN_EMAIL}  (production)`);
  console.log("  (passwords from env SEED_* or defaults in prisma/seed.ts)");
  console.log(`  Skincare catalog: ${SKINCARE_CATALOG_SEED.length} products (by slug upsert)`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
