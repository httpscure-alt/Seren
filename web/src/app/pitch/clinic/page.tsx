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
  title: "Pitch — clinics",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type PageProps = { searchParams: Promise<{ t?: string }> };

export default async function PitchClinicPage({ searchParams }: PageProps) {
  const { query } = await resolvePitchAccess(searchParams);

  return (
    <PitchChrome query={query}>
      <PitchDeckHero
        eyebrow="clinic partners"
        title="for owners & operators"
        tagline="prepared patients · geo-aware routing · aligned economics"
      />

      <PitchDeckSection tone="canvas">
        <PitchDeckSplit variant="clinic">
          <PitchDeckSubhead eyebrow="the partner thesis" title="seren fills chairs with the right cases." />
          <PitchProse>
            <p>
              Seren helps clinics increase revenue and efficiency by structuring patient intake and improving treatment
              conversion. Users describe their goals in Seren; the platform produces a structured assessment and pathway
              aligned to how dermatologists already think—not a generic lead form.
            </p>
            <p>
              Instead of cold traffic, Seren filters and prepares patients before arrival: clearer expectations, fewer
              mismatched consults, and higher acceptance of appropriate in-office procedures—mapped to the devices,
              doctors, and inventory you actually run.
            </p>
            <p>
              We are onboarding a limited set of founding clinics for priority routing, workflow influence, and cohort
              analytics that improve utilization—not just volume.
            </p>
          </PitchProse>
        </PitchDeckSplit>
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <PitchDeckCenterTitle title="what you unlock" subtitle="Operational lift, not vanity leads" />
        <PitchDeckFeatureStrip
          items={[
            {
              icon: "patient_list",
              title: "pre-qualified intake",
              body: "Structured history + derm-reviewed plan before the chair—shorter consults, higher acceptance.",
            },
            {
              icon: "location_on",
              title: "geo-aware demand",
              body: "Surface patients near your sites when they are ready to book—not nationwide noise.",
            },
            {
              icon: "payments",
              title: "aligned economics",
              body: "Rev share, booking fees, or packages tied to conversion and procedure mix you control.",
            },
          ]}
        />
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <PitchDeckSubhead eyebrow="detail" title="benefit matrix" />
        <div className="mt-6">
          <PitchTable
            headers={["benefit", "how seren helps"]}
            rows={[
              ["Higher-quality leads", "Structured intake + derm-reviewed plan before consult"],
              ["Shorter consults", "Less time rediscovering history; focus on procedure fit"],
              ["Machine & room utilization", "Match indication to available devices and capacity"],
              ["Geo-aware demand", "Surface patients near your locations when they are ready to book"],
              ["Transparent economics", "Rev share / booking fee / package—aligned to conversion, not clicks"],
            ]}
          />
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <PitchDeckSubhead eyebrow="flow" title="patient to chair" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {[
            "User completes guided skin assessment in Seren",
            "AI drafts structured plan; dermatologist validates",
            "Seren maps plan to treatments your clinic lists as available",
            "User books slot; chart summary arrives for your team",
            "In-clinic: confirm, treat, log outcomes; Seren supports follow-up",
          ].map((step, i) => (
            <PitchCard key={step} className="!p-6 sm:!p-7">
              <span className="font-headline text-[10px] font-medium uppercase tracking-[0.2em] text-primary sm:text-[11px]">
                step {i + 1}
              </span>
              <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">{step}</p>
            </PitchCard>
          ))}
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <PitchDeckSubhead eyebrow="economics" title="proposed economics" />
        <PitchProse>
          <p>
            Anchor quotes for first partnerships (USD)—adjusted for ticket size and integration depth. Rupiah equivalents
            quoted at signing spot. Month 4+ platform fees often waived during design-partner cohorts when we prioritize
            workflow feedback and attribution proof.
          </p>
        </PitchProse>
        <div className="mt-6">
          <PitchTable
            headers={["component", "proposal"]}
            rows={[
              [
                "Implementation (one-time)",
                "$2,800–$4,200 per site — service catalog, devices, SLAs, staff training, basic booking hooks",
              ],
              [
                "Platform (recurring)",
                "$429–$649 per month per active location — geo routing, intake handoff to your team, utilization views",
              ],
              [
                "Performance",
                "12–18% of gross consult or in-scope procedure revenue we can attribute through Seren; fee steps down once monthly attributed revenue clears agreed thresholds",
              ],
              ["Founding cohort (limited)", "Reduced or waived platform fee in pilots in exchange for case study + monthly product review"],
            ]}
          />
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="bright">
        <PitchDeckSubhead eyebrow="cadence" title="rollout (example)" />
        <div className="mt-6">
          <PitchTimeline
            items={[
              {
                phase: "weeks 1–2",
                title: "service catalog & compliance",
                detail: "Define treatments, contraindications, and booking rules.",
              },
              {
                phase: "weeks 3–6",
                title: "pilot routing",
                detail: "Limited patient volume; weekly review with clinic lead.",
              },
              {
                phase: "month 2+",
                title: "scale + optimization",
                detail: "Tune match quality, waitlists, and upsell pathways with live data.",
              },
            ]}
          />
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="mist">
        <PitchCard>
          <p className="text-center font-body text-sm text-on-surface-variant">
            Company narrative:{" "}
            <Link href={`/pitch/vc${query}`} className={pitchDeckLinkClass()}>
              vc memo
            </Link>
            . Visual one-pager:{" "}
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
