import type { Metadata } from "next";
import Link from "next/link";
import {
  PitchCard,
  PitchChrome,
  PitchDeckHero,
  PitchDeckQuickLinks,
  PitchDeckSection,
  PitchDeckSubhead,
  PitchProse,
} from "@/components/pitch/PitchChrome";
import {
  PitchDeckCenterTitle,
  PitchDeckFeatureStrip,
  PitchDeckSplit,
} from "@/components/pitch/PitchDeckVisual";
import { resolvePitchAccess } from "@/lib/investorPitchProposal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pitch — overview",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type PageProps = { searchParams: Promise<{ t?: string }> };

const cards = [
  {
    href: "/pitch/vc",
    title: "venture & angels",
    subtitle: "capital & narrative",
    blurb: "Market, unit economics, projections, structure, and the path to a vertically integrated dermatology OS.",
  },
  {
    href: "/pitch/clinic",
    title: "clinic partners",
    subtitle: "demand & utilization",
    blurb: "Prepared patients, geo-aware routing, and economics aligned to conversion—not empty clicks.",
  },
  {
    href: "/pitch/brand",
    title: "cosmetic brands",
    subtitle: "guided routines",
    blurb: "Condition-aware journeys, adherence, partnerships, and downstream value at point of care.",
  },
] as const;

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function PitchHubPage({ searchParams }: PageProps) {
  const { query } = await resolvePitchAccess(searchParams);

  return (
    <PitchChrome query={query}>
      <PitchDeckHero
        eyebrow="pitch room"
        title="three perspectives, one spine"
        tagline="the clinical atelier — same visual language as the deck, tuned per audience"
        compact
      >
        <PitchDeckQuickLinks query={query} />
      </PitchDeckHero>

      <PitchDeckSection tone="muted">
        <PitchDeckCenterTitle title="three doors into the same thesis" subtitle="Pick the memo that matches the room" />
        <PitchDeckFeatureStrip
          items={[
            {
              icon: "trending_up",
              title: "capital",
              body: "How we scale AI infra, derm operations, and the arc toward owned clinics & consumables.",
            },
            {
              icon: "clinical_notes",
              title: "clinical throughput",
              body: "How Seren prepares patients, respects capacity, and converts indication to booked care.",
            },
            {
              icon: "palette",
              title: "brand craft",
              body: "How routines, adherence, and clinic tie-ins move SKUs from awareness to protocol.",
            },
          ]}
        />
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <PitchDeckSplit>
          <PitchDeckSubhead eyebrow="inside the atelier" title="designed like the deck—built for each table." />
          <PitchProse>
            <p>
              The visual deck is the cinematic one-pager. These memos reuse its typography, spacing, split layouts,
              icon strips, bento allocation, roadmap spine, and KPI band—so every audience feels the same Seren world,
              with content that respects their incentives.
            </p>
          </PitchProse>
        </PitchDeckSplit>
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={`${c.href}${query}`}
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
            >
              <PitchCard className="flex h-full min-h-[220px] flex-col transition duration-300 group-hover:-translate-y-0.5">
                <span className="font-headline text-xs font-medium tracking-[0.2em] text-primary uppercase">
                  {c.title}
                </span>
                <span className="mt-2 font-headline text-sm font-medium tracking-tight text-on-surface lowercase">
                  {c.subtitle}
                </span>
                <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-on-surface-variant">{c.blurb}</p>
                <span className="mt-8 inline-flex items-center gap-2 font-headline text-[10px] font-medium uppercase tracking-[0.2em] text-primary sm:text-[11px]">
                  open memo
                  <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                </span>
              </PitchCard>
            </Link>
          ))}
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <p className="text-center font-headline text-[10px] font-medium uppercase leading-loose tracking-[0.2em] text-on-surface-variant/75 sm:text-[11px]">
          want the cinematic one-pager?
          <Link href={`/pitch/deck${query}`} className="ml-2 text-primary underline-offset-4 hover:underline">
            open full deck
          </Link>
        </p>
      </PitchDeckSection>
    </PitchChrome>
  );
}
