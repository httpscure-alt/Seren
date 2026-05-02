import { timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

function tokenMatches(provided: string | undefined, expected: string): boolean {
  if (!provided) return false;
  try {
    const a = Buffer.from(provided, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Gate: production requires PRE_SEED_PAGE_TOKEN and matching ?t=; dev allows open access if token env is unset. */
export async function requireInvestorPitchToken(t: string | undefined): Promise<void> {
  const expected = process.env.PRE_SEED_PAGE_TOKEN?.trim() ?? "";
  const isDev = process.env.NODE_ENV === "development";

  if (!expected) {
    if (!isDev) notFound();
  } else if (!tokenMatches(t, expected)) {
    notFound();
  }
}

/**
 * Optional path-token deck URL: `/invest/deck/[slug]` matches `INVESTOR_DECK_PATH_SECRET` exactly.
 * Enables a single bookmarkable link without query strings (still do not expose in public nav/sitemap).
 * If env is unset → route always 404 (feature disabled).
 */
export async function requireInvestorDeckPathSecret(slug: string | undefined): Promise<void> {
  const expected = process.env.INVESTOR_DECK_PATH_SECRET?.trim() ?? "";
  if (!slug || !expected || !tokenMatches(slug, expected)) {
    notFound();
  }
}

/** Runs gate and returns `t` for building same-origin links that keep access. */
export async function resolvePitchAccess(
  searchParams: Promise<{ t?: string }>,
): Promise<{ t?: string; query: string }> {
  const { t } = await searchParams;
  await requireInvestorPitchToken(t);
  const query = t ? `?t=${encodeURIComponent(t)}` : "";
  return { t, query };
}

export function InvestorPitchProposalIframe({
  embedded = false,
}: {
  /** When true, drop fixed positioning so the deck can sit under the pitch nav. */
  embedded?: boolean;
}) {
  const htmlPath = path.join(process.cwd(), "src/invest/pre-seed-proposal.html");
  const html = readFileSync(htmlPath, "utf8");

  return (
    <iframe
      title="Seren pre-seed funding proposal"
      className={
        embedded
          ? "h-[min(88vh,960px)] w-full rounded-lg border-0 bg-background sm:min-h-[640px]"
          : "fixed inset-0 z-[100] h-[100dvh] w-full border-0 bg-[#faf9f6]"
      }
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      referrerPolicy="no-referrer"
    />
  );
}
