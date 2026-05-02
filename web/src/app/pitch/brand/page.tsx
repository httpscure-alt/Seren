import type { Metadata } from "next";
import Link from "next/link";
import {
  PitchCard,
  PitchChrome,
  PitchDeckHero,
  PitchDeckSection,
  PitchDeckSubhead,
  PitchProse,
  PitchTable,
  PitchTimeline,
  pitchDeckLinkClass,
} from "@/components/pitch/PitchChrome";
import {
  PitchDeckCenterTitle,
  PitchDeckFeatureStrip,
  PitchDeckSplit,
} from "@/components/pitch/PitchDeckVisual";
import { resolvePitchAccess } from "@/lib/investorPitchProposal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pitch — brands",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type PageProps = { searchParams: Promise<{ t?: string }> };

export default async function PitchBrandPage({ searchParams }: PageProps) {
  const { query } = await resolvePitchAccess(searchParams);

  return (
    <PitchChrome query={query}>
      <PitchDeckHero
        eyebrow="cosmetic brands"
        title="for skincare & beauty houses"
        tagline="guided routines · adherence · point-of-care downstream"
      />

      <PitchDeckSection tone="canvas">
        <PitchDeckSplit variant="brand">
          <PitchDeckSubhead eyebrow="the brand thesis" title="from awareness to protocol." />
          <PitchProse>
            <p>
              Seren moves brands from generic reach to guided, condition-aware usage. Routines tie to profile and clinician
              review—your SKUs live inside a coherent journey instead of floating next to TikTok impulse buys.
            </p>
            <p>
              That improves adherence, outcomes, and repeat purchase—community and education sit beside the clinical spine,
              so credibility compounds instead of dissipating feed-by-feed.
            </p>
          </PitchProse>
        </PitchDeckSplit>
      </PitchDeckSection>

      <PitchDeckSection tone="jewel">
        <PitchDeckCenterTitle title="lift you can merchandise" subtitle="Shelf · journey · cohort story" />
        <PitchDeckFeatureStrip
          items={[
            {
              icon: "track_changes",
              title: "attribution inside protocol",
              body: "See which hero SKUs persist week 8—not vanity impressions peeled from storefront links.",
            },
            {
              icon: "schedule",
              title: "adherence nudges",
              body: "Cadence keyed to clinician checkpoints so restock moments feel supportive, not spammy.",
            },
            {
              icon: "diversity_3",
              title: "community with spine",
              body: "Creators tether to clinician guardrails—instruction stays legible as buzz scales.",
            },
          ]}
        />
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <PitchDeckSubhead eyebrow="value" title="for your brand & community" />
        <div className="mt-6">
          <PitchTable
            headers={["value", "what changes"]}
            rows={[
              ["Attribution", "SKUs inside compliant routines—not vanity impressions"],
              ["Adherence", "Nudges and reviews reinforce correct frequency and pairing"],
              ["Education", "Science-backed storytelling anchored to user condition"],
              ["Trust", "Derm-reviewed guardrails reduce backlash from over-claiming"],
              ["Lifecycle", "Entry SKUs can graduate users toward clinical steps when appropriate"],
            ]}
          />
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <PitchDeckSubhead eyebrow="formats" title="partnership methods" />
        <PitchProse>
          <ul className="list-disc space-y-3 pl-6 marker:text-primary/50">
            <li>
              <strong>Curated integration:</strong> SKU lines mapped to indication tags and contraindications.
            </li>
            <li>
              <strong>Sponsored modules:</strong> transparently labeled educational or sample touchpoints inside journeys.
            </li>
            <li>
              <strong>Co-branded journeys:</strong> limited drops tied to clinical milestones (e.g., post-procedure care kits).
            </li>
            <li>
              <strong>Insights (aggregated):</strong> anonymized adherence and outcome signals for R&amp;D—governed by consent
              and policy.
            </li>
          </ul>
        </PitchProse>
      </PitchDeckSection>

      <PitchDeckSection tone="mist">
        <PitchDeckSubhead eyebrow="economics" title="proposal bands (usd)" />
        <PitchProse>
          <p className="text-sm text-on-surface-variant/95">
            Mid-market cosmetics / derm-aligned beauty lines—not luxury flagship minimums. Exclusivity or multi-SKU breadth
            moves quotes toward the top of each band.
          </p>
        </PitchProse>
        <div className="mt-6">
          <PitchTable
            headers={["model", "range & notes"]}
            rows={[
              [
                "90-day pilot",
                "$14,000–$22,000 — indication mapping, claims review, single geo, adherence + repurchase cohort readout",
              ],
              ["Always-on journey module", "$3,800–$6,200 / month — hosted routines, ops support, aggregated performance"],
              [
                "Attributed D2C",
                "8–14% revenue share on SKUs converted inside Seren paths (tracked checkout or validated codes)",
              ],
              [
                "Launch / burst",
                "+$7,500–$16,000 per campaign — education spine + creator layer with clinician guardrails",
              ],
              ["Clinic bundle tie-in", "Packaged separately with partner clinics; usually rev share plus placement fee"],
            ]}
          />
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="bright">
        <PitchDeckSubhead eyebrow="cadence" title="how we partner" />
        <div className="mt-6">
          <PitchTimeline
            items={[
              {
                phase: "discover",
                title: "brand fit & claims review",
                detail: "Align SKUs to indications; legal review of copy and packaging hooks.",
              },
              {
                phase: "design",
                title: "journey mapping",
                detail: "Insert products into templates with derm-approved guardrails.",
              },
              {
                phase: "measure",
                title: "cohort readouts",
                detail: "Adherence, repurchase, and satisfaction vs control cohorts.",
              },
              {
                phase: "scale",
                title: "multi-market + clinic tie-ins",
                detail: "Expand to additional geos and partner sites with shared reporting.",
              },
            ]}
          />
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="jewel">
        <PitchCard>
          <p className="text-center font-body text-sm leading-relaxed text-on-surface">
            Company narrative:{" "}
            <Link href={`/pitch/vc${query}`} className={pitchDeckLinkClass()}>
              vc memo
            </Link>
            . Visual deck:{" "}
            <Link href={`/pitch/deck${query}`} className={pitchDeckLinkClass()}>
              deck
            </Link>
            .
          </p>
        </PitchCard>
      </PitchDeckSection>
    </PitchChrome>
  );
}
