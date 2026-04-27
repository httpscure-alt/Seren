/**
 * Create a dermatologist (PHYSICIAN) or platform admin (ADMIN) account.
 * Customer accounts (USER) come from normal signup at /auth — never grant staff roles from the public API.
 *
 * Usage (from web/):
 *   npx tsx scripts/create-staff-user.ts --email=derm@clinic.com --password='YourLongPass1' --role=PHYSICIAN --name='Dr. Name'
 *   npx tsx scripts/create-staff-user.ts --email=admin@seren.com --password='YourLongPass1' --role=ADMIN
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, type PoolConfig } from "pg";

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const raw = process.argv.find((a) => a.startsWith(prefix));
  return raw ? raw.slice(prefix.length) : undefined;
}

async function main() {
  const email = arg("email")?.trim().toLowerCase();
  const password = arg("password");
  const roleRaw = arg("role")?.toUpperCase();
  const name = arg("name")?.trim() || undefined;

  if (!email || !password || !roleRaw) {
    console.error(`
Missing arguments. Staff roles: PHYSICIAN (dermatologist) | ADMIN (super admin).

  npx tsx scripts/create-staff-user.ts --email=you@clinic.com --password='8+chars' --role=PHYSICIAN --name='Dr. Example'

Customer accounts: use /auth (role is always USER).
`);
    process.exit(1);
  }

  if (!["PHYSICIAN", "ADMIN"].includes(roleRaw)) {
    console.error("role must be PHYSICIAN or ADMIN (not USER — use /auth for customers).");
    process.exit(1);
  }

  const role = roleRaw as Role;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
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

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { password: hashed, role, name: name ?? existing.name, emailVerified: new Date() },
    });
    console.log(`Updated existing user ${email} → role ${role}.`);
  } else {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
        name,
        emailVerified: new Date(),
      },
    });
    console.log(`Created ${role} user ${email}.`);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
