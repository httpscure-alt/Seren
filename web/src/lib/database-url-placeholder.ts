/** Non-routable URL so `prisma generate` and `next build` can run when DATABASE_URL is unset. Runtime must set a real DATABASE_URL. */
export const DATABASE_URL_BUILD_PLACEHOLDER =
  "postgresql://build_placeholder:build@127.0.0.1:5432/seren?schema=public";
