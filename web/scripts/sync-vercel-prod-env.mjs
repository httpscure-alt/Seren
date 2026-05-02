#!/usr/bin/env node
/**
 * Pushes production env vars to the linked Vercel project (non-interactive).
 * Does NOT print secret values. Skips DATABASE_URL if only a local URL exists in .env.
 *
 * Usage: node scripts/sync-vercel-prod-env.mjs
 */
import { spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const envPath = path.join(webRoot, ".env");

function parseEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const vercelBin = path.join(webRoot, "node_modules", ".bin", "vercel");

function add(name, value, target = "production") {
  if (value === undefined || value === null || value === "") return false;
  const cmd = fs.existsSync(vercelBin) ? vercelBin : "npx";
  const args = fs.existsSync(vercelBin)
    ? ["env", "add", name, target, "--value", String(value), "--yes", "--force"]
    : ["--yes", "vercel", "env", "add", name, target, "--value", String(value), "--yes", "--force"];
  const r = spawnSync(cmd, args, {
    cwd: webRoot,
    stdio: "inherit",
    env: process.env,
    // Guard against occasional CLI hangs (network/auth edge cases).
    timeout: 90_000,
  });
  if (r.error?.name === "Error" && String(r.error?.message || "").includes("timed out")) {
    throw new Error(`vercel env add ${name} timed out`);
  }
  if (r.status !== 0) throw new Error(`vercel env add ${name} failed`);
  return true;
}

function randB64() {
  return randomBytes(32).toString("base64");
}

const local = parseEnv(envPath);
const site = "https://seren.id";

console.log("[sync-vercel] Setting production URL + auth + cron (+ optional keys from .env)…");

add("NEXTAUTH_URL", site);
add("NEXT_PUBLIC_SITE_URL", site);
add("AUTH_TRUST_HOST", local.AUTH_TRUST_HOST || "true");

const authSecret = local.AUTH_SECRET?.length >= 16 ? local.AUTH_SECRET : randB64();
add("AUTH_SECRET", authSecret);
add("NEXTAUTH_SECRET", local.NEXTAUTH_SECRET?.length >= 16 ? local.NEXTAUTH_SECRET : authSecret);

const cron =
  local.CRON_SECRET?.length >= 8
    ? local.CRON_SECRET
    : createHash("sha256").update(randB64()).digest("hex").slice(0, 48);
add("CRON_SECRET", cron);

const db = local.DATABASE_URL || "";
const isLocalDb =
  /localhost|127\.0\.0\.1/.test(db) || db.startsWith("postgresql://seren:seren@");
if (!isLocalDb && db.length > 12) {
  add("DATABASE_URL", db);
  console.log("[sync-vercel] DATABASE_URL: set from .env (non-local).");
} else {
  console.log(
    "[sync-vercel] DATABASE_URL: skipped (local or missing). Add Supabase URI in Vercel or run again with DATABASE_URL in .env.",
  );
}

const optionalKeys = [
  // Payments (provider switch + additional gateways)
  "PAYMENT_PROVIDER",
  "NEXT_PUBLIC_PAYMENT_PROVIDER",
  "MIDTRANS_ENV",
  "MIDTRANS_SERVER_KEY",
  "MIDTRANS_QA_EMAIL",
  "MIDTRANS_QA_PASSWORD",
  "MIDTRANS_QA_NAME",
  "DOKU_ENV",
  "DOKU_CLIENT_ID",
  "DOKU_SECRET_KEY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "APPLE_CLIENT_ID",
  "APPLE_CLIENT_SECRET",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST",
  "NEXT_PUBLIC_GA4_ID",
  "MOONSHOT_API_KEY",
  "OPENAI_API_KEY",
  "AI_MODEL",
  "AI_LLM_PROVIDER",
  "MOONSHOT_BASE_URL",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "PRE_SEED_PAGE_TOKEN",
  "INVESTOR_DECK_PATH_SECRET",
];

for (const k of optionalKeys) {
  const v = local[k];
  if (v && v !== "replace" && !/^replace-with/i.test(v) && v !== "SB-Mid-server-xxxxxxxxxxxxxxxx") {
    add(k, v);
  }
}

console.log("[sync-vercel] Done.");
