"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatIdr, PRICING_JOURNEY_30D_IDR, PRICING_SINGLE_IDR } from "@/lib/pricingIdr";

type Tab = "overview" | "plans" | "settings";

export type PostIntakePendingPaymentViewProps = {
  variant: "demo" | "live";
  /** When false, parent should render `SiteNavbar` — only the tab strip shows here. */
  showStandaloneBrandHeader?: boolean;
  concerns: string[];
  goals: string[];
  hasUploadedPhotos: boolean;
  uploadedImagesCount: number;
  createdAt: Date;
  selectedPlan: "single" | "journey" | null;
  /** Used for checkout links (encoded in URLs) */
  paywallReturnTo: string;
};

const LOCKED_FEATURES = [
  {
    title: "Personalized skin analysis",
    description:
      "Structured read on your photos and concerns — grounded in clinical language, not generic tips.",
  },
  {
    title: "Dermatologist-reviewed report",
    description: "Your AM/PM ritual, lifestyle guidance, and rationale signed off by a licensed clinician.",
  },
  {
    title: "Progress tracking",
    description: "Check in on My Journey with photos and notes so your plan can evolve safely over time.",
  },
  {
    title: "Secure inbox messaging",
    description: "Ask short questions and share updates where your dermatologist already has your context.",
  },
  {
    title: "Skin journey timeline",
    description: "See how your case moves from analysis to review to your signed report — in one calm view.",
  },
] as const;

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" className="fill-primary/15 stroke-primary/40" strokeWidth="1" />
      <path
        d="M5.2 9l2.3 2.3L12.8 6"
        className="stroke-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCircle({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7.5" className="stroke-outline-variant/55" strokeWidth="1.2" strokeDasharray="2.5 2" />
    </svg>
  );
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 9V7a5 5 0 0110 0v2"
        className="stroke-on-surface-variant/55"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <rect x="4" y="9" width="12" height="8" rx="2" className="stroke-on-surface-variant/45" strokeWidth="1.2" />
      <circle cx="10" cy="13" r="1.2" className="fill-on-surface-variant/35" />
    </svg>
  );
}

function paywallHref(returnTo: string) {
  const u = new URLSearchParams();
  u.set("returnTo", returnTo);
  return `/paywall?${u.toString()}`;
}

export function PostIntakePendingPaymentView({
  variant,
  showStandaloneBrandHeader = true,
  concerns,
  goals,
  hasUploadedPhotos,
  uploadedImagesCount,
  createdAt,
  selectedPlan,
  paywallReturnTo,
}: PostIntakePendingPaymentViewProps) {
  const [tab, setTab] = useState<Tab>("overview");

  const createdLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(createdAt),
    [createdAt],
  );

  const planHint =
    selectedPlan === "journey"
      ? "You chose the 30-day journey — ongoing checkpoints after your first report."
      : selectedPlan === "single"
        ? "You chose a single consultation — one full report and routine."
        : "You can pick a plan on the next step — both include dermatologist review.";

  const checkoutHref = paywallHref(paywallReturnTo);
  const plansBlurb =
    variant === "demo"
      ? "Same offerings as checkout — pick what fits your goals. Prices are illustrative for this demo."
      : "Same offerings as checkout — pick what fits your goals.";

  const concernItems =
    concerns.length > 0 ? concerns : ["Not specified on your intake — you can clarify after checkout if needed."];

  const tabNav = (
    <nav className="flex flex-wrap gap-2" aria-label="Dashboard sections">
      {(
        [
          { id: "overview" as const, label: "Overview" },
          { id: "plans" as const, label: "Plans" },
          { id: "settings" as const, label: "Settings" },
        ] as const
      ).map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {showStandaloneBrandHeader ? (
        <header className="sticky top-0 z-30 border-b border-outline-variant/12 bg-surface/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <Link href="/" className="font-headline text-lg font-semibold tracking-tight text-on-surface">
                Seren
              </Link>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface/45">
                {variant === "demo" ? "Demo · after intake, before payment" : "After intake · before checkout"}
              </p>
            </div>
            {tabNav}
          </div>
        </header>
      ) : (
        <div className="border-b border-outline-variant/12 bg-surface/95">
          <div className="seren-container flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface/45">
              {variant === "live" ? "After intake · before checkout" : null}
            </p>
            {tabNav}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        {tab === "overview" ? (
          <div className="space-y-12 sm:space-y-14">
            <section
              aria-labelledby="hero-title"
              className="rounded-[2.5rem] border border-primary/18 bg-gradient-to-br from-primary/[0.07] via-surface-container-lowest to-surface-container-lowest p-8 shadow-[0_22px_70px_-42px_rgba(47,51,48,0.16)] sm:p-10"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/80">Intake received</p>
              <h1
                id="hero-title"
                className="mt-3 font-headline text-2xl font-light tracking-[-0.02em] text-on-surface sm:text-[2.1rem] sm:leading-tight"
              >
                Your intake is ready for analysis
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                Your photos and skin concerns have been securely prepared. Complete payment to begin AI-assisted
                analysis and dermatologist review — nothing runs until you unlock your plan.
              </p>
              <p className="mt-3 max-w-2xl text-sm text-on-surface/70">{planHint}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={checkoutHref}
                  className="btn-gradient inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide text-on-primary shadow-sm"
                >
                  Continue to checkout
                </Link>
                <Link
                  href="/paywall"
                  className="inline-flex items-center justify-center rounded-full border border-outline-variant/25 bg-surface px-8 py-3.5 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary/25 hover:bg-surface-container-low"
                >
                  View plans
                </Link>
              </div>
            </section>

            <section
              aria-labelledby="summary-title"
              className="rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-7 sm:p-9"
            >
              <h2 id="summary-title" className="font-headline text-lg text-on-surface sm:text-xl">
                Your submission
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">A light recap of what you invested — not a medical readout.</p>
              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface/45">
                    Submitted concerns
                  </dt>
                  <dd className="mt-2">
                    <ul className="list-inside list-disc space-y-1.5 text-sm text-on-surface">
                      {concernItems.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface/45">Goals you shared</dt>
                  <dd className="mt-2">
                    {goals.length > 0 ? (
                      <ul className="flex flex-wrap gap-2">
                        {goals.map((g) => (
                          <li
                            key={g}
                            className="rounded-full border border-outline-variant/18 bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant"
                          >
                            {g}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-on-surface-variant">No separate goals on file — that is OK.</p>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface/45">Photos</dt>
                  <dd className="mt-2 text-sm text-on-surface">
                    {hasUploadedPhotos ? (
                      <>
                        <span className="font-semibold tabular-nums">{uploadedImagesCount}</span> clinical photos uploaded
                      </>
                    ) : (
                      "No photos on file — you can add them after checkout if needed."
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface/45">
                    Intake completed
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-on-surface">{createdLabel}</dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="timeline-title">
              <h2 id="timeline-title" className="font-headline text-lg text-on-surface sm:text-xl">
                What happens next
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                Clear stages — payment unlocks analysis; we don&apos;t simulate processing here.
              </p>
              <ol className="mt-8 space-y-0 rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest/80 p-6 sm:p-8">
                <li className="flex gap-4 border-b border-outline-variant/10 pb-6">
                  <div className="shrink-0 pt-0.5">
                    <IconCheck className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="font-headline text-base text-on-surface">Intake completed</p>
                    <p className="mt-1 text-sm text-on-surface-variant">Your answers and photos are on file.</p>
                  </div>
                </li>
                <li className="flex gap-4 border-b border-outline-variant/10 py-6">
                  <div className="shrink-0 pt-0.5">
                    <IconCircle className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="font-headline text-base text-on-surface/80">Analysis pending</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Starts after checkout — structured AI pass, then clinician tools.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 border-b border-outline-variant/10 py-6">
                  <div className="shrink-0 pt-0.5">
                    <IconCircle className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="font-headline text-base text-on-surface/80">Dermatologist review pending</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      A licensed dermatologist signs off before you see recommendations.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 pt-6">
                  <div className="shrink-0 pt-0.5">
                    <IconCircle className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="font-headline text-base text-on-surface/80">Personalized report pending</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Your AM/PM ritual, lifestyle notes, and rationale — in one calm report.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section aria-labelledby="preview-title">
              <h2 id="preview-title" className="font-headline text-lg text-on-surface sm:text-xl">
                Inside Seren after checkout
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                A quiet preview of the member experience — locked until you subscribe. No fake loaders or scores.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {LOCKED_FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="relative overflow-hidden rounded-[1.75rem] border border-outline-variant/12 bg-surface-container-lowest"
                  >
                    <div className="pointer-events-none select-none p-6 blur-[1.5px] opacity-[0.65]">
                      <p className="font-headline text-base text-on-surface">{f.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{f.description}</p>
                    </div>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface/55 backdrop-blur-[2px]">
                      <IconLock className="text-on-surface/50" />
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-on-surface/55">
                        Included after checkout
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              aria-label="Inbox preview"
              className="rounded-[2rem] border border-dashed border-outline-variant/25 bg-surface-container-low/40 p-6 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface/45">Care inbox</p>
                  <p className="mt-1 font-headline text-base text-on-surface">Message your dermatologist</p>
                  <p className="mt-2 max-w-xl text-sm text-on-surface-variant">
                    Short, secure threads tied to your case — available once your plan is active.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-xl border border-outline-variant/20 bg-surface/80 px-4 py-3 text-sm text-on-surface-variant">
                  <IconLock className="h-4 w-4 shrink-0 opacity-70" />
                  <span>Locked until checkout</span>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-outline-variant/10 bg-surface-container-low/50 p-7 sm:p-9">
              <h2 className="font-headline text-lg text-on-surface">Clinical trust</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
                Your information and photos are securely handled within Seren&apos;s clinical workflow. AI assists
                clinicians — it does not replace dermatologist judgment on what you should do next. You can review how we
                use data in our{" "}
                <Link href="/terms" className="font-medium text-primary underline-offset-4 hover:underline">
                  Terms &amp; privacy
                </Link>
                .
              </p>
            </section>

            {variant === "demo" ? (
              <p className="text-center text-xs text-on-surface/45">
                <Link href="/demos/paid" className="text-primary underline-offset-4 hover:underline">
                  Compare with the paid dashboard mock
                </Link>
                {" · "}
                <Link href="/demos" className="text-primary underline-offset-4 hover:underline">
                  All demos
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}

        {tab === "plans" ? (
          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-xl text-on-surface">Plans</h2>
              <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">{plansBlurb}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-7 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface/45">Single</p>
                <p className="mt-2 font-headline text-2xl font-light text-on-surface">{formatIdr(PRICING_SINGLE_IDR)}</p>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  One full consultation path with dermatologist-reviewed report and routine.
                </p>
                <Link
                  href={checkoutHref}
                  className="mt-6 inline-flex rounded-full border border-outline-variant/25 px-6 py-2.5 text-sm font-medium text-on-surface transition hover:border-primary/30"
                >
                  Choose single
                </Link>
              </div>
              <div className="rounded-[2rem] border border-primary/20 bg-primary/[0.04] p-7 sm:p-8 shadow-[0_18px_56px_-40px_rgba(47,51,48,0.12)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">30-day journey</p>
                <p className="mt-2 font-headline text-2xl font-light text-on-surface">{formatIdr(PRICING_JOURNEY_30D_IDR)}</p>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  Checkpoints and routine refinements across 30 days — still clinician-governed.
                </p>
                <Link
                  href={checkoutHref}
                  className="btn-gradient mt-6 inline-flex rounded-full px-6 py-2.5 text-sm font-semibold text-on-primary"
                >
                  Choose journey
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "settings" ? (
          <div className="mx-auto max-w-lg rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-8 text-center sm:p-10">
            {variant === "live" ? (
              <>
                <h2 className="font-headline text-xl text-on-surface">Account &amp; privacy</h2>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  Update your profile, password, and subscription preferences anytime — even before checkout.
                </p>
                <Link
                  href="/account"
                  className="btn-gradient mt-8 inline-flex rounded-full px-8 py-3 text-sm font-semibold text-on-primary"
                >
                  Open account settings
                </Link>
              </>
            ) : (
              <>
                <IconLock className="mx-auto h-8 w-8 text-on-surface/35" />
                <h2 className="mt-4 font-headline text-xl text-on-surface">Settings</h2>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  Account and notification preferences unlock after you complete checkout — we keep this screen uncluttered
                  until then.
                </p>
                <Link
                  href={checkoutHref}
                  className="btn-gradient mt-8 inline-flex rounded-full px-8 py-3 text-sm font-semibold text-on-primary"
                >
                  Continue to checkout
                </Link>
              </>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
