import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { DATABASE_URL_BUILD_PLACEHOLDER } from "@/lib/database-url-placeholder";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

let loggedMissingDatabaseUrl = false;

function resolveConnectionString(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;
  // `next build` — avoid requiring a live DB in CI.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return DATABASE_URL_BUILD_PLACEHOLDER;
  }
  // Vercel / `next start` without DATABASE_URL: importing Prisma must not throw or every page 500s.
  // DB queries will fail until Production DATABASE_URL is set in the project env.
  if (process.env.NODE_ENV === "production") {
    if (!loggedMissingDatabaseUrl) {
      loggedMissingDatabaseUrl = true;
      console.warn(
        "[prisma] DATABASE_URL is unset in production. Set it in Vercel → Settings → Environment Variables. Using a non-routable placeholder so the app can boot.",
      );
    }
    return DATABASE_URL_BUILD_PLACEHOLDER;
  }
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

function makeClient() {
  const connectionString = resolveConnectionString();
  const pool = globalForPrisma.prismaPool ?? new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  if (process.env.NODE_ENV !== "production") globalForPrisma.prismaPool = pool;

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

