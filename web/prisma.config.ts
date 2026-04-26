import "dotenv/config";
import { defineConfig } from "prisma/config";
import { DATABASE_URL_BUILD_PLACEHOLDER } from "./src/lib/database-url-placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL?.trim() || DATABASE_URL_BUILD_PLACEHOLDER,
  },
});

