import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

const FLOW_STEPS = [
  {
    title: "Milestone",
    body: "User finishes a meaningful moment—wrapped, checkpoint, or chosen shareable result.",
  },
  {
    title: "Preview",
    body: "On-brand card: headline, streak or summary, no clinical photos unless they opt in.",
  },
  {
    title: "Personal link",
    body: "Same layout for everyone; URL always carries their ref code (?ref=) for attribution.",
  },
  {
    title: "Share",
    body: "OS share sheet, copy link, or save image—whatever you ship first.",
  },
  {
    title: "Friend lands",
    body: "Landing keeps ref through signup and checkout so the sale can be matched.",
  },
  {
    title: "Points credit",
    body: "After rules clear (e.g. paid, refund window), Seren Points post to the sharer’s balance.",
  },
] as const;

const POINTS_PHASES = [
  {
    tag: "Earn",
    headline: "Attributed subscriptions",
    body: "When someone subscribes through your link, points credit based on program rules (mock: % of sub value).",
    mock: "+2,400 pts · Friend subscribed · 12 Apr",
  },
  {
    tag: "See",
    headline: "Balance & history",
    body: "One wallet per verified account: running balance, line items, dates—same for members and creators.",
    mock: "Balance 8,420 · View all activity",
  },
  {
    tag: "Redeem",
    headline: "Shared catalog",
    body: "Clinic treatment, subscription perks, then cash—tiers and copy from your rewards mock.",
    mock: "Browse rewards →",
  },
] as const;

export default function ProgramMockPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface text-on-surface">
      <SiteNavbar />

      <main className="seren-container pb-24 pt-28 sm:pt-32">
        <header className="max-w-3xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Demos · Product mock
          </p>
          <h1 className="font-headline text-3xl tracking-[-0.02em] sm:text-4xl">
            Referral program — three flows (mock UI)
          </h1>
          <p className="mt-4 leading-[1.65] text-on-surface-variant">
            Static mock of the shareable card journey, the Seren Points loop, and how creators plug
            into the same ledger. No live ledger—layout and copy only.
          </p>
          <nav
            className="mt-8 flex flex-wrap gap-2 border-b border-outline-variant/10 pb-8"
            aria-label="On this page"
          >
            {[
              { href: "#share-flow", label: "1 · Share card" },
              { href: "#seren-points", label: "2 · Seren Points" },
              { href: "#creators", label: "3 · Creators" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-outline-variant/20 bg-surface-container-low/80 px-4 py-2 text-xs font-medium text-on-surface transition hover:border-primary/25 hover:bg-primary/5"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-fun">
              ← All share demos
            </Link>
            {" · "}
            <Link className="text-primary underline underline-offset-4" href="/demos/share-fun/wrapped">
              Live wrapped + ref link
            </Link>
          </p>
        </header>

        {/* 1 · Shareable card flow */}
        <section id="share-flow" className="scroll-mt-28 pt-16">
          <div className="seren-card overflow-hidden">
            <div className="border-b border-outline-variant/10 bg-surface-container-low/40 px-6 py-8 sm:px-10 sm:py-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
                1 · Shareable card
              </p>
              <h2 className="mt-3 font-headline text-2xl tracking-[-0.02em] text-on-surface sm:text-3xl">
                From milestone to attributed points
              </h2>
              <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-on-surface-variant">
                The card is distribution + attribution: pride in the journey, a clear CTA for
                friends, and a URL that ties conversions back to the sharer.
              </p>
            </div>

            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start">
              <div className="relative">
                <div
                  className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/35 via-outline-variant/25 to-transparent sm:left-[21px]"
                  aria-hidden
                />
                <ol className="relative space-y-8">
                  {FLOW_STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-5 sm:gap-6">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-headline text-sm font-semibold text-primary sm:h-11 sm:w-11"
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="font-headline text-base font-medium tracking-tight text-on-surface">
                          {step.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <aside className="rounded-[1.75rem] border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-[0_20px_50px_-32px_rgba(61,99,116,0.25)]">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                  Card preview (mock)
                </p>
                <p className="mt-4 font-headline text-xl tracking-tight text-on-surface">
                  Seven nights.{" "}
                  <span className="text-primary">One plan</span> I’m following.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                  AI + derm-reviewed routine—not clinical photos in the feed.
                </p>
                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
                    Referral link
                  </p>
                  <p className="mt-2 break-all font-mono text-[11px] leading-snug text-on-surface">
                    seren.app/consult/welcome?ref=<span className="font-semibold">ALEX7K2</span>
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Share", "Copy", "Save image"].map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-outline-variant/20 bg-surface px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-on-surface/70"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* 2 · Seren Points */}
        <section id="seren-points" className="scroll-mt-28 pt-16">
          <div className="seren-card overflow-hidden">
            <div className="border-b border-outline-variant/10 bg-surface-container-low/40 px-6 py-8 sm:px-10 sm:py-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
                2 · Seren Points
              </p>
              <h2 className="mt-3 font-headline text-2xl tracking-[-0.02em] text-on-surface sm:text-3xl">
                Earn, see, redeem — one program
              </h2>
              <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-on-surface-variant">
                Same points currency whether someone shared a card to friends or drove traffic as a
                creator. Rules and caps can differ; the wallet does not need to.
              </p>
            </div>

            <div className="grid gap-5 p-6 sm:p-10 md:grid-cols-3">
              {POINTS_PHASES.map((phase) => (
                <div
                  key={phase.tag}
                  className="flex flex-col rounded-[1.75rem] border border-outline-variant/12 bg-surface-container-lowest p-6 shadow-[0_14px_44px_-22px_rgba(47,51,48,0.12)]"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                    {phase.tag}
                  </p>
                  <p className="mt-3 font-headline text-lg tracking-tight text-on-surface">
                    {phase.headline}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-on-surface-variant">
                    {phase.body}
                  </p>
                  <div className="mt-6 rounded-xl border border-outline-variant/10 bg-surface-container-low/90 px-4 py-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-on-surface/45">
                      UI hint (mock)
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-on-surface">{phase.mock}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant/10 px-6 py-8 sm:px-10 sm:py-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                Wallet strip (mock)
              </p>
              <div className="mt-5 flex flex-col gap-4 rounded-[1.75rem] border border-outline-variant/12 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                    Available balance
                  </p>
                  <p className="mt-1 font-headline text-3xl tabular-nums tracking-tight text-primary">
                    8,420
                    <span className="ml-2 text-base font-normal text-on-surface-variant">points</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/demos/share-fun/wrapped/rewards"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-on-primary transition hover:brightness-[1.03]"
                  >
                    Redeem (mock catalog)
                  </Link>
                  <span className="inline-flex h-11 items-center justify-center rounded-full border border-outline-variant/25 px-6 text-sm font-medium text-on-surface">
                    Activity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 · Creators */}
        <section id="creators" className="scroll-mt-28 pt-16">
          <div className="seren-card overflow-hidden">
            <div className="border-b border-outline-variant/10 bg-surface-container-low/40 px-6 py-8 sm:px-10 sm:py-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
                3 · Creators
              </p>
              <h2 className="mt-3 font-headline text-2xl tracking-[-0.02em] text-on-surface sm:text-3xl">
                Same Seren Points — different front door
              </h2>
              <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-on-surface-variant">
                Members use the share card; creators use a dashboard link, assets, and (optionally)
                stricter verification. Attribution and redemption stay on one ledger.
              </p>
            </div>

            <div className="overflow-x-auto p-6 sm:p-10">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <caption className="sr-only">Members versus creators in the referral program</caption>
                <thead>
                  <tr className="border-b border-outline-variant/15">
                    <th className="pb-4 pr-4 font-headline font-medium text-on-surface" scope="col">
                      &nbsp;
                    </th>
                    <th className="pb-4 pr-4 font-headline font-medium text-on-surface" scope="col">
                      Members
                    </th>
                    <th className="pb-4 font-headline font-medium text-on-surface" scope="col">
                      Creators
                    </th>
                  </tr>
                </thead>
                <tbody className="text-on-surface-variant">
                  {[
                    ["Primary earn", "Friends & family via personal ref", "Audience via creator / campaign ref"],
                    ["Surface", "Wrapped, results, settings", "Creator dashboard + brand kit"],
                    ["Scale", "Usually lower volume", "Higher volume → caps, review, delayed payout"],
                    ["Points", "Seren Points", "Same Seren Points"],
                    ["Redeem", "Catalog (clinic → sub → cash)", "Same catalog; cash may need extra KYC"],
                  ].map(([label, a, b]) => (
                    <tr key={label} className="border-b border-outline-variant/10">
                      <th
                        scope="row"
                        className="py-4 pr-4 font-medium text-on-surface"
                      >
                        {label}
                      </th>
                      <td className="py-4 pr-4 leading-relaxed">{a}</td>
                      <td className="py-4 leading-relaxed">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-outline-variant/10 px-6 pb-10 pt-2 sm:px-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                Creator dashboard (mock)
              </p>
              <div className="mt-5 grid gap-5 lg:grid-cols-12">
                <div className="rounded-[1.75rem] border border-outline-variant/12 bg-surface-container-lowest p-6 lg:col-span-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-headline text-lg tracking-tight text-on-surface">
                        @skinwithnadia
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant">Creator · Tier mock</p>
                    </div>
                    <span className="rounded-full border border-tertiary/25 bg-tertiary-container/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-on-tertiary-container">
                      Active
                    </span>
                  </div>
                  <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
                      Creator referral link
                    </p>
                    <p className="mt-2 break-all font-mono text-[11px] text-on-surface">
                      seren.app/consult/welcome?ref=<span className="font-semibold">NADIA-CRT</span>
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Copy", "UTM presets", "Download assets"].map((x) => (
                      <span
                        key={x}
                        className="rounded-full border border-outline-variant/20 bg-surface px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-on-surface/70"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
                  {[
                    { k: "30d attributed GMV", v: "Rp 48.2M", sub: "mock" },
                    { k: "Subs (paid)", v: "112", sub: "after refunds window" },
                    { k: "Points pending → cleared", v: "12.4k / 38.1k", sub: "same wallet rules" },
                  ].map((stat) => (
                    <div
                      key={stat.k}
                      className="rounded-[1.75rem] border border-outline-variant/12 bg-surface p-5"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface/45">
                        {stat.k}
                      </p>
                      <p className="mt-2 font-headline text-xl tabular-nums tracking-tight text-on-surface">
                        {stat.v}
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <p className="mt-14 text-center text-xs leading-relaxed text-on-surface/45">
          Mock only — flows and figures are for product discussion, not live data.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
