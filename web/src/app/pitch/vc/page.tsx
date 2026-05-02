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
  pitchDeckLinkClass,
} from "@/components/pitch/PitchChrome";
import {
  PitchDeckBentoAllocation,
  PitchDeckCenterTitle,
  PitchDeckFeatureStrip,
  PitchDeckKpiStrip,
  PitchDeckQuote,
  PitchDeckRoadmapDeck,
  PitchDeckSplit,
} from "@/components/pitch/PitchDeckVisual";
import { resolvePitchAccess } from "@/lib/investorPitchProposal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pitch — VC",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type PageProps = { searchParams: Promise<{ t?: string }> };

export default async function PitchVCPage({ searchParams }: PageProps) {
  const { query } = await resolvePitchAccess(searchParams);

  return (
    <PitchChrome query={query}>
      <PitchDeckHero
        eyebrow="venture & angels"
        title="vc & pre-seed memo"
        tagline="$50k–$100k · the clinical atelier · scalable dermatology"
      />

      {/* Deck §2 — split narrative */}
      <PitchDeckSection tone="canvas">
        <PitchDeckSplit variant="vc">
          <PitchDeckSubhead eyebrow="the clinical atelier" title="the gap in access—and the opening." />
          <div className="space-y-8 font-body text-lg leading-relaxed text-on-surface-variant">
            <p>
              Dermatology remains a luxury of access: long waits, expertise concentrated in urban hubs, and millions
              steered toward retail counters or unvetted social trends. Seren bridges high-fidelity clinical structure
              with the frictionless rhythm of a premium lifestyle product.
            </p>
            <PitchDeckQuote>
              “seren bridges the high-fidelity accuracy of clinical diagnosis with the frictionless delivery of a
              premium lifestyle app.”
            </PitchDeckQuote>
            <p>
              Our vision is the <span className="font-semibold text-primary">Scalable Atelier</span>: multimodal AI
              plus dermatologist review—expanding from validated B2C retention into clinics, brands, and over time
              owned care and consumables.
            </p>
          </div>
        </PitchDeckSplit>
      </PitchDeckSection>

      {/* Deck §3 — funding objective strip */}
      <PitchDeckSection tone="muted">
        <PitchDeckCenterTitle title="funding objective" subtitle="Target raise: $50,000 — $100,000" />
        <PitchDeckFeatureStrip
          items={[
            {
              icon: "verified",
              title: "market validation",
              body: "First paid cohorts to validate LTV/CAC, referral loops, and retention against clinical SLAs.",
            },
            {
              icon: "database",
              title: "ai optimization",
              body: "Multimodal CV across skin tones and lighting; secure media pipeline and eval harness.",
            },
            {
              icon: "clinical_notes",
              title: "clinical network",
              body: "Human-in-the-loop dermatologists, protocols, and liability posture scaled with volume.",
            },
          ]}
        />
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <PitchDeckSubhead eyebrow="narrative" title="why seren, why now" />
        <PitchProse>
          <p>
            Seren is an AI-assisted dermatology platform designed to scale access through structured workflows and
            dermatologist review. The core problem is limited access to dermatologists, fragmented skincare decisions,
            and inefficient clinic utilization—acute in emerging markets such as Indonesia where demand outpaces
            qualified capacity in tier-1 and tier-2 cities.
          </p>
          <p>
            We start with B2C to validate retention and willingness to pay, then clinic partnerships for conversion and
            utilization, then brand integrations for downstream value—toward a vertically integrated dermatology stack.
          </p>
          <p>
            We are raising <strong>$50K–$100K</strong> to validate retention, scale AI infrastructure, and expand
            dermatologist operations—while onboarding initial clinic design partners and multi-layer revenue rails.
          </p>
        </PitchProse>
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <PitchDeckSubhead eyebrow="market" title="problem & why now" />
        <PitchProse>
          <ul className="list-disc space-y-3 pl-6 marker:text-primary/50">
            <li>Long wait times and geographic concentration of dermatology expertise.</li>
            <li>Retail and social optimize for engagement, not clinical safety or continuity.</li>
            <li>Clinics underutilize digital intake; consults start cold, lowering treatment acceptance.</li>
            <li>Brands lack a trusted, longitudinal surface to prove adherence and outcomes.</li>
          </ul>
        </PitchProse>
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <PitchDeckSubhead eyebrow="geography" title="indonesia dermatology & skin-care context" />
        <PitchProse>
          <p>
            Public market monitors converge on Indonesia’s{" "}
            <strong className="text-on-surface">skin-care retail market at roughly US$2.8–3.2B (2024)</strong> depending
            on category scope (Inkwood / GIIR / Vyans-style industry releases cluster in this band), with headline{" "}
            <strong className="text-on-surface">~5–7% CAGR</strong> into the early 2030s as discretionary spend rises and{" "}
            <strong className="text-on-surface">Shopee & Tokopedia</strong> concentrate online beauty baskets—especially in
            tier-1 corridors.
          </p>
          <p>
            With <strong className="text-on-surface">~280M residents</strong> and national physician counts on the order of{" "}
            <strong className="text-on-surface">high-200Ks registered doctors</strong> (aggregate MoH/stat releases), specialty
            access remains structurally tighter than OECD norms—clinical dermatology is a small slice of specialist capacity versus
            social-commerce-driven demand for appearance and acne care.
          </p>
          <p>
            Seren models{" "}
            <strong className="text-on-surface">clinically legible journeys</strong> (assessment → plan → follow-up) where AI
            scaffolding plus asynchronous derm review expands throughput before—and during—hands-on visits.
          </p>
          <p className="border-l-[3px] border-primary/30 py-2 pl-5 text-[13px] leading-relaxed text-on-surface-variant">
            Figures are <strong className="text-on-surface/90">rounded estimates for decks</strong>—not audited financial line
            items. Tie to your mandate’s third-party excerpts (market PDFs), BPS population tables, MoH manpower releases, and
            replace before formal diligence if required.
          </p>
        </PitchProse>
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <PitchDeckSubhead eyebrow="product" title="solution & moat" />
        <PitchProse>
          <p>
            Structured multimodal intake, AI drafting, and human-in-the-loop dermatologist review create a reproducible
            clinical record—not a one-off chat. That record powers retention, safer escalation, and routing to in-person
            care with machines, doctors, and inventory already aligned.
          </p>
        </PitchProse>
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <PitchDeckSubhead eyebrow="economics" title="revenue architecture" />
        <div className="mt-6">
          <PitchTable
            headers={["layer", "mechanic", "notes"]}
            rows={[
              ["B2C subscription", "Plans + derm review", "Validates LTV/CAC and habit formation"],
              ["Clinic", "Rev share / SaaS / booking fee", "Qualified demand + prep before consult"],
              ["Brand", "Sponsored modules, bundles, insights", "Attribution inside a clinical journey"],
              ["Vertical (later)", "Owned clinic + consumables", "Margin expansion at point of care"],
            ]}
          />
        </div>
        <div className="mt-14">
          <PitchDeckSubhead eyebrow="b2b" title="partnership pricing (proposed)" />
        </div>
        <PitchProse>
          <p className="text-sm text-on-surface-variant/90">
            Ranges are anchor points for first contracts—adjusted for ticket size, exclusivity, and integration depth.
            USD; equivalent IDR at spot for local quotes.
          </p>
        </PitchProse>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-headline text-xs uppercase tracking-[0.2em] text-primary">clinics</p>
            <PitchTable
              headers={["component", "proposed band"]}
              rows={[
                ["Implementation (one-time)", "$2,800–$4,200 / site — catalog, SLAs, staff training, light booking sync"],
                ["Platform (recurring)", "$429–$649 / month / active location — routing, intake handoff, analytics"],
                [
                  "Performance",
                  "12–18% of Seren-attributed consult or procedure revenue (tier down with volume); or equivalent booking fee on first visit",
                ],
                ["Founding partners (limited)", "Waived or reduced platform fee months 1–4 in exchange for case-study rights + feedback cadence"],
              ]}
            />
          </div>
          <div>
            <p className="mb-3 font-headline text-xs uppercase tracking-[0.2em] text-primary">brands</p>
            <PitchTable
              headers={["component", "proposed band"]}
              rows={[
                ["Pilot (≈90 days)", "$14,000–$22,000 — journey mapping, claims review, one geo, cohort reporting"],
                ["Always-on module", "$3,800–$6,200 / month — hosted SKUs in protocol, adherence reporting, rev ops"],
                ["Attributed D2C", "8–14% revenue share on sales through Seren journeys (stacked or net of pilot minimum)"],
                ["Campaign burst", "+$7,500–$16,000 per launch — education + creator layer with clinical guardrails"],
              ]}
            />
          </div>
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <PitchDeckSubhead eyebrow="model" title="projected milestones" />
        <PitchProse>
          <p className="text-sm text-on-surface-variant/90">
            Horizons below tie to the internal cohort model (ARPU ~$6–9/mo early, paid + organic mix, derm desk cost
            curve)—recalibrate with live data each quarter.
          </p>
        </PitchProse>
        <div className="mt-6">
          <PitchTable
            headers={["horizon", "focus", "target KPIs"]}
            rows={[
              ["0–6 mo", "Retention & unit economics", "M1 retention 24–30%, CAC band $24–32, review p95 under 48h"],
              ["6–18 mo", "Clinic attach & ARPU mix", "8–15 partner sites, attach 6–12%, clinic revenue / routed user"],
              ["18–36 mo", "Brand + treatment routing", "2–4 brand programs, NPS +30–45, in-clinic conversion uplift"],
            ]}
          />
        </div>
      </PitchDeckSection>

      {/* Deck §4 — bento allocation (pixel language from deck) */}
      <PitchDeckSection tone="canvas">
        <h2 className="mb-12 text-center font-headline text-3xl font-light lowercase tracking-tight text-on-surface md:mb-16 md:text-4xl">
          strategic allocation of capital.
        </h2>
        <PitchDeckBentoAllocation />
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <PitchDeckSubhead eyebrow="capital" title="structure (conversation starter)" />
        <PitchProse>
          <p>
            Typical instruments at this stage: SAFE or convertible note with a valuation cap / discount, plus pro-rata
            rights for lead angels. Align economics with milestones before locking legal terms with counsel.
          </p>
        </PitchProse>
      </PitchDeckSection>

      {/* Deck §5 — execution roadmap */}
      <PitchDeckSection tone="bright">
        <PitchDeckRoadmapDeck
          sidebarTitle="execution roadmap."
          sidebarLead="Our sprint to primary validation and seed-round readiness—mirroring the deck structure."
          bullets={[
            { label: "month 01: alpha launch" },
            { label: "month 02: scale & refine", dim: true },
          ]}
          phases={[
            {
              phase: "month 01",
              title: "initial cohort & system hardening",
              strength: "strong",
              columns: [
                {
                  label: "product",
                  text: "Release of v1.0 multimodal skin tracker for the first 500 waitlist users.",
                },
                {
                  label: "operations",
                  text: "Live clinical review desk staffed by board-certified dermatologists.",
                },
              ],
            },
            {
              phase: "month 02 – 03",
              title: "growth & localization",
              strength: "mid",
              columns: [
                {
                  label: "acquisition",
                  text: "Activation of Bahasa-speaking creator network for SE Asia pilot.",
                },
                {
                  label: "engineering",
                  text: "Integration of prescription payment rails and local delivery loops.",
                },
              ],
            },
            {
              phase: "month 04",
              title: "partnership & seed prep",
              strength: "soft",
              columns: [
                {
                  label: "strategic",
                  text: "Initial B2B partnerships with aesthetic clinics for O2O referrals.",
                },
                {
                  label: "capital",
                  text: "Seed data room focusing on retention and cohort margins.",
                },
              ],
            },
          ]}
        />
      </PitchDeckSection>

      <PitchDeckSection tone="canvas">
        <PitchDeckSubhead eyebrow="risk" title="mitigations" />
        <PitchProse>
          <ul className="list-disc space-y-3 pl-6 marker:text-primary/50">
            <li>
              <strong>Clinical & regulatory:</strong> scope derm review tightly; escalate red flags; document SOPs.
            </li>
            <li>
              <strong>Model drift:</strong> continuous eval across Fitzpatrick bands and lighting conditions.
            </li>
            <li>
              <strong>Go-to-market:</strong> prove one geography before broad paid spend.
            </li>
          </ul>
        </PitchProse>
      </PitchDeckSection>

      {/* Deck §6 — KPI strip */}
      <PitchDeckSection tone="mist">
        <PitchDeckCenterTitle
          title="signals of success."
          subtitle="Key performance indicators — year-one model projections (not actuals)"
        />
        <PitchDeckKpiStrip
          items={[
            { value: "31%", label: "M1 cohort retention (Y1)" },
            { value: "~$21", label: "Blended CAC, USD (Y1)" },
            { value: "91%", label: "Primary-concern derm agreement (Y1)" },
            { value: "+34", label: "Net promoter score (Y1)" },
          ]}
        />
        <div className="mx-auto mt-10 max-w-3xl px-2">
          <p className="text-center font-body text-[13px] leading-relaxed text-on-surface-variant">
            Retention assumes paid + organic mix and Bahasa-led acquisition; CAC blends creator tests and restrained paid
            social. Concordance measured against blinded panel review on a fixed taxonomy; NPS surveyed post-review.
            Replace with audited cohort exports before diligence.
          </p>
        </div>
      </PitchDeckSection>

      <PitchDeckSection tone="muted">
        <PitchCard>
          <p className="text-center font-body text-sm leading-relaxed text-on-surface-variant">
            Pair with your data room model and the{" "}
            <Link href={`/pitch/deck${query}`} className={pitchDeckLinkClass()}>
              visual deck
            </Link>
            . For clinics and brands:{" "}
            <Link href={`/pitch/clinic${query}`} className={pitchDeckLinkClass()}>
              clinic
            </Link>{" "}
            ·{" "}
            <Link href={`/pitch/brand${query}`} className={pitchDeckLinkClass()}>
              brand
            </Link>
            .
          </p>
        </PitchCard>
      </PitchDeckSection>
    </PitchChrome>
  );
}
