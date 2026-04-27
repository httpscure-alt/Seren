/**
 * Standalone seed for production staff accounts.
 * Uses pg + bcryptjs directly — no tsx IPC, no Prisma CLI needed.
 * Run: node prisma/seed-staff.mjs
 */
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const dotenv = require("dotenv");
dotenv.config({ path: join(__dirname, "../.env") });

const { Pool } = require("pg");
const bcrypt   = require("bcryptjs");

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const pool = new Pool({ connectionString: DB_URL });

const STAFF = [
  { email: "dermatologist@seren.local",   role: "PHYSICIAN", name: "Dr. Riris Asti Respati" },
  { email: "admin@seren.local",            role: "ADMIN",     name: "Seren Admin" },
  { email: "ririsastirespati@seren.id",   role: "PHYSICIAN", name: "Dr. Riris Asti Respati, SpDVE" },
  { email: "admin@seren.id",              role: "ADMIN",     name: "Seren Super Admin" },
];

const PASSWORD = process.env.SEED_STAFF_PASSWORD ?? "1234";

async function main() {
  const client = await pool.connect();
  try {
    for (const s of STAFF) {
      const hash = await bcrypt.hash(PASSWORD, 12);
      await client.query(
        `INSERT INTO "User" (id, email, name, role, password, "emailVerified", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW(), NOW())
         ON CONFLICT (email) DO UPDATE
           SET password = $4, role = $3, name = $2, "emailVerified" = NOW(), "updatedAt" = NOW()`,
        [s.email, s.name, s.role, hash]
      );
      console.log(`  ✓  ${s.role.padEnd(9)}  ${s.email}`);
    }
    console.log("\nDone — all staff accounts seeded.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
