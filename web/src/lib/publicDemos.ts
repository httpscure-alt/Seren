/**
 * Controls whether public prototype routes (`/demos/*`, `/mock/*`) are served.
 *
 * - On Vercel **production** (`VERCEL_ENV=production`), routes are blocked unless
 *   `ENABLE_PUBLIC_DEMOS=true`.
 * - On preview / local dev, routes stay available unless you set `DISABLE_PUBLIC_DEMOS=true`.
 * - Self‑hosted production without Vercel: set `DISABLE_PUBLIC_DEMOS=true`.
 */
export function isPublicDemosBlocked(): boolean {
  if (process.env.ENABLE_PUBLIC_DEMOS === "true") return false;
  if (process.env.DISABLE_PUBLIC_DEMOS === "true" || process.env.DISABLE_PUBLIC_DEMOS === "1") return true;
  return process.env.VERCEL_ENV === "production";
}
