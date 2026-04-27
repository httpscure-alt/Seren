import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, type PoolConfig } from "pg";
import { DATABASE_URL_BUILD_PLACEHOLDER } from "@/lib/database-url-placeholder";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
  loggedDatabaseTarget?: boolean;
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
  let connectionString = resolveConnectionString();
  if (process.env.NODE_ENV === "production" && !globalForPrisma.loggedDatabaseTarget) {
    globalForPrisma.loggedDatabaseTarget = true;
    try {
      const u = new URL(connectionString);
      // Never log secrets (password). Host/user are enough to confirm which DB prod is using.
      console.warn(
        `[prisma] production database target host=${u.hostname} port=${u.port || "(default)"} db=${u.pathname.replace("/", "")} user=${decodeURIComponent(u.username)}`,
      );
    } catch {
      console.warn("[prisma] production database target: could not parse DATABASE_URL");
    }
  }

  let ssl: PoolConfig["ssl"] | undefined;
  try {
    const u = new URL(connectionString);
    // Supabase pooler certificates may not chain to Node's default trust store.
    // Prefer providing a CA, but for now allow opting out of verification for the pooler.
    if (u.hostname.endsWith(".pooler.supabase.com")) {
      // Avoid pg-connection-string sslmode defaults overriding our ssl setting.
      u.searchParams.delete("sslmode");
      connectionString = u.toString();
      ssl = { rejectUnauthorized: false };
    } else if (process.env.NODE_ENV === "development" && process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
      ssl = { rejectUnauthorized: false };
    }
  } catch {
    // ignore
  }
  const pool =
    globalForPrisma.prismaPool ??
    new Pool({
      connectionString,
      ssl,
    });
  const adapter = new PrismaPg(pool);
  if (process.env.NODE_ENV !== "production") globalForPrisma.prismaPool = pool;

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

