import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { DATABASE_URL_BUILD_PLACEHOLDER } from "@/lib/database-url-placeholder";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

function resolveConnectionString(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;
  // Next sets this during `next build` while collecting page data; real URL must exist at runtime.
  if (process.env.NEXT_PHASE === "phase-production-build") {
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

