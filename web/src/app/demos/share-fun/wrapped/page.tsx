import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { ReferralRewardsCatalog } from "./ReferralRewardsCatalog";

type PageProps = {
  searchParams?: Promise<{ ref?: string }>;
};

function normalizeReferralCode(raw: string | undefined): string {
  const s = (raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
  if (s.length >= 4 && s.length <= 16) return s;
  return "ALEX7K2";
}

function buildInviteUrl(origin: string, code: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}/consult/welcome?ref=${encodeURIComponent(code)}`;
}

/**
 * Share asset: design-system UI + personal referral link so attributed subs earn points for the sharer.
 */
function WrappedShareCard({ referralCode, inviteUrl }: { referralCode: string; inviteUrl: string }) {
  return (
    <div
      className={[
        "relative h-full w-full min-h-[280px] overflow-hidden rounded-[2rem]",
        "border border-outline-variant/15 bg-surface-container-lowest",
        "shadow-[0_28px_80px_-40px_rgba(61,99,116,0.35)]",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background: [
            "radial-gradient(ellipse 85% 70% at 100% 0%, rgba(61,99,116,0.12) 0%, transparent 55%)",
            "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(192,233,252,0.35) 0%, transparent 50%)",
            "linear-gradient(180deg, var(--color-surface-container-lowest) 0%, var(--color-surface) 100%)",
          ].join(", "),
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(var(--color-primary)_0.55px,transparent_0.55px)] [background-size:14px_14px]" />

      <div className="relative grid h-full grid-cols-12 gap-8 p-8 sm:p-10 lg:gap-10 lg:p-12">
        <div className="col-span-12 flex flex-col justify-center lg:col-span-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">Seren</p>
          <p className="mt-5 font-headline text-4xl tracking-[-0.03em] text-on-surface sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            Seven nights.
            <br />
            <span className="text-primary">One plan</span> I’m following.
          </p>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-on-surface-variant">
            AI drafts a routine; a dermatologist refines it. I’m sharing the streak—not clinical
            photos.
          </p>

          <div className="mt-6 rounded-[1.75rem] border border-primary/20 bg-primary/5 px-5 py-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
              Your referral link
            </p>
            <p className="mt-2 break-all font-mono text-xs leading-relaxed text-on-surface sm:text-sm">
              {inviteUrl}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              When friends subscribe through this link, you earn{" "}
              <span className="font-medium text-on-surface">Seren Points</span> (mock — ledger
              TBD).
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-end gap-4">
            <div className="rounded-[1.75rem] border border-outline-variant/15 bg-surface-container-low/80 px-6 py-5 backdrop-blur-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                This week
              </p>
              <p className="mt-2 font-headline text-3xl tracking-tight text-on-surface sm:text-4xl">
                7<span className="text-on-surface-variant font-light">/</span>7 days
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Derm-reviewed", "Sunscreen daily", "Barrier-first"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-outline-variant/20 bg-surface-container-lowest px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-on-surface/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-8 font-mono text-xs text-on-surface/45">
            Code <span className="text-on-surface font-semibold">{referralCode}</span> · SRN‑8821 ·
            share preview
          </p>
        </div>

        <div className="col-span-12 flex flex-col justify-center lg:col-span-5">
          <div className="rounded-[2rem] border border-outline-variant/15 bg-surface/90 p-7 shadow-[0_20px_50px_-30px_rgba(47,51,48,0.18)] backdrop-blur-md">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
              New to Seren?
            </p>
            <p className="mt-4 font-headline text-xl tracking-tight text-on-surface sm:text-2xl">
              Clinical skin analysis—not another generic routine.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Use your friend’s link above so their invite is recognized. Short check-in, optional
              photos, derm-reviewed plan.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-on-surface-variant">
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>
                  <span className="font-medium text-on-surface">Clear priorities</span> for your
                  skin—not a random product list.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>
                  <span className="font-medium text-on-surface">A plan between visits</span> you can
                  follow day to day.
                </span>
              </li>
            </ul>

            <div className="mt-8">
              <Link
                href={`/consult/welcome?ref=${encodeURIComponent(referralCode)}`}
                className="inline-flex h-12 w-full items-center justify-center rounded-full px-8 text-sm font-medium tracking-wide btn-gradient text-on-primary shadow-[0_16px_40px_-24px_rgba(61,99,116,0.55)] transition hover:brightness-[1.03] sm:w-auto"
              >
                Take the check-in
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-on-surface/45 sm:text-left">
              <Link href="/philosophy" className="text-primary underline underline-offset-4">
                How Seren works
              </Link>
              <span className="text-on-surface/35"> · </span>
              <Link
                href="/demos/share-fun/wrapped/rewards"
                className="text-primary underline underline-offset-4"
              >
                Points rewards (mock)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DmTeaserMock({ inviteUrl }: { inviteUrl: string }) {
  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-[0_20px_50px_-30px_rgba(47,51,48,0.12)]">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
        Example message (mock)
      </p>
      <div className="rounded-2xl border border-outline-variant/12 bg-surface px-4 py-4 text-sm leading-relaxed text-on-surface">
        <p>
          I’ve been on Seren for a week—derm-reviewed routine, not TikTok guesses. If you try it, use
          my link so Seren can connect us for their referral points thing.
        </p>
        <p className="mt-3 break-all font-mono text-xs text-primary">{inviteUrl}</p>
      </div>
    </div>
  );
}

export default async function ShareWrappedPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const referralCode = normalizeReferralCode(sp.ref);
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://seren.skin";
  const inviteUrl = buildInviteUrl(site, referralCode);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pb-24 pt-28 sm:pt-32">
        <header className="max-w-3xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Demos · Share · Referral link
          </p>
          <h1 className="font-headline text-3xl tracking-[-0.02em] sm:text-4xl">
            Share card + personal invite URL
          </h1>
          <p className="mt-4 leading-[1.65] text-on-surface-variant">
            The card surfaces <span className="text-on-surface font-medium">your referral link</span>{" "}
            (<span className="font-mono text-xs">?ref=</span>) so attributed subscriptions can credit{" "}
            <span className="text-on-surface font-medium">Seren Points</span>. Try another code:{" "}
            <Link
              className="text-primary underline underline-offset-4"
              href="/demos/share-fun/wrapped?ref=MIA9Q1"
            >
              ?ref=MIA9Q1
            </Link>
            .
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-fun">
              ← All share demos
            </Link>
            {" · "}
            <Link className="text-primary underline underline-offset-4" href="/referral">
              Referral hub
            </Link>
            {" · "}
            <Link className="text-primary underline underline-offset-4" href="/demos/share-fun/wrapped/rewards">
              Rewards table only
            </Link>
          </p>
        </header>

        <section className="mt-12 space-y-10">
          <div className="seren-card p-6 sm:p-10">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
              Story / OG size (1200×630)
            </p>
            <div className="mx-auto aspect-[1200/630] w-full max-w-[1200px]">
              <WrappedShareCard referralCode={referralCode} inviteUrl={inviteUrl} />
            </div>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
              Example DM copy
            </p>
            <DmTeaserMock inviteUrl={inviteUrl} />
          </div>

          <div>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
              Seren Points — redemption catalog (mock)
            </p>
            <ReferralRewardsCatalog />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
