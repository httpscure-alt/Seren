import Image from "next/image";
import {
  PitchDeckHero,
  PitchDeckSection,
  PitchDeckSubhead,
  PitchIcon,
  PitchProse,
  PitchTable,
} from "@/components/pitch/PitchChrome";
import { PitchDeckCenterTitle, PitchDeckFeatureStrip } from "@/components/pitch/PitchDeckVisual";

type SectionTone = "canvas" | "muted" | "mist" | "white" | "bright" | "jewel";

function VcSection({
  tone,
  forExport,
  className = "",
  children,
}: {
  tone: SectionTone;
  forExport: boolean;
  /** Passed to `PitchDeckSection` (print hooks, spacing). */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <PitchDeckSection tone={tone} motion={!forExport} className={className}>
      {children}
    </PitchDeckSection>
  );
}

export function PitchVcMemoBody({ forExport = false }: { forExport?: boolean } = {}) {
  return (
    <>
      <PitchDeckHero
        eyebrow="Ventures & Angels"
        title="Seren — AI-Assisted Dermatology"
        tagline="guided routines · adherence · point-of-care downstream"
        sentenceCaseTitle
        sentenceCaseEyebrow
      />

      {/* 1. Problem */}
      <VcSection tone="canvas" forExport={forExport} className="pitch-vc-memo-page">
        <PitchDeckSubhead eyebrow="01" title="Problem — Access, continuity, and throughput" lowerCaseTitle={false} />
        <div className="mb-8 max-w-3xl border-l-[3px] border-primary/50 bg-primary/6 py-4 pl-5 pr-4 font-body text-lg leading-relaxed text-on-surface md:text-xl">
          <p className="m-0 font-medium">
            Indonesia has <strong>about 279 million people</strong> (BPS, 2024) but <strong>limited dermatology access</strong>{" "}
            relative to demand, with <strong>specialists concentrated in major cities</strong>.
          </p>
        </div>
        <PitchProse>
          <p>
            Wait times and out-of-pocket cost push millions toward informal channels: friends, creators, pharmacy
            counters, and algorithmic feeds built for engagement — not longitudinal safety, contraindications, or follow-up
            when skin worsens.
          </p>
          <p>
            Beauty and skincare spending is culturally central — serums, sunscreens, actives, and routines are mainstream.
            Households spend heavily, but without a single clinical thread tying diagnosis to routine, outcomes stay
            noisy: trial-and-error stacks, abandoned products, and repeated spend without progress.
          </p>
          <p>
            Clinics see the other side: dense calendars, short consults, uneven conversion to treatment, and equipment
            that sits idle between peaks because intake and education are not standardized before the patient is in the
            chair. The gap is not only “more doctors online” — it is <strong>structured intake → plan → follow-up</strong>{" "}
            at scale.
          </p>
          <ul className="list-disc space-y-2 pl-6 marker:text-primary/50">
            <li>Consumer path: discovery without continuity — high spend, uneven outcomes.</li>
            <li>Clinical path: compressed consults and weak digital intake before the visit.</li>
            <li>System path: no shared record tying retail, social, and clinic into one accountable loop.</li>
          </ul>
        </PitchProse>
      </VcSection>

      {/* 2. Solution (AI + derm loop) */}
      <VcSection tone="muted" forExport={forExport} className="pitch-vc-memo-page">
        <PitchDeckSubhead eyebrow="02" title="Solution — AI + dermatologist loop" lowerCaseTitle={false} />
        <div className="mb-8 max-w-3xl rounded-xl border border-outline-variant/25 bg-surface-container-lowest/80 px-5 py-4 font-body text-sm font-medium leading-snug text-on-surface shadow-sm md:px-6 md:py-4 md:text-base md:leading-relaxed">
          <p className="m-0">
            We are not telemedicine, not beauty e-commerce — Seren sits between both as the{" "}
            <strong>structured clinical layer</strong>.
          </p>
        </div>
        <PitchProse>
          <p>
            Seren converts photos, symptoms, history, and goals into a <strong>structured care record</strong>. Models
            draft routines and plain-language explanations; <strong>board-certified dermatologists</strong> review,
            edit, and escalate so output stays clinically grounded and accountable.
          </p>
          <p>
            Users get a plan they can execute day by day; doctors receive organized context instead of cold starts.
            The same record later powers clinic handoffs, adherence measurement, and brand-safe education — moats in
            workflow and longitudinal data, not a single model score.
          </p>
        </PitchProse>
        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-primary/25 bg-primary/8 px-5 py-4 font-body text-base leading-relaxed text-on-surface md:px-6 md:py-5">
          <p className="mb-1 font-headline text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Current focus
          </p>
          <p className="m-0 text-on-surface">
            Currently onboarding early users and validating engagement, repeat usage, and willingness to pay.
          </p>
        </div>
      </VcSection>

      {/* 3. Founders — one mist band; print uses 2-column grid so Aldy + Riris + “Why this team” fit one sheet */}
      <VcSection tone="mist" forExport={forExport} className="pitch-vc-founders-band pitch-vc-memo-page">
        <PitchDeckSubhead eyebrow="03" title="Founders" lowerCaseTitle={false} />

        <div className="pitch-vc-founders-stack mx-auto mt-2 max-w-5xl">
          <div className="pitch-vc-founders-print-grid flex flex-col gap-8 md:grid md:grid-cols-2 md:items-stretch md:gap-x-8 md:gap-y-6 lg:gap-x-10">
            <article className="pitch-vc-founder-card flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm sm:p-8 md:p-8 print:overflow-visible">
              <div className="pitch-vc-founder-print-row relative flex min-h-0 flex-1 flex-col gap-8 md:flex-row md:items-stretch md:gap-6 lg:gap-8">
                <div className="pitch-vc-founder-photo-outer relative mx-auto w-full max-w-[min(100%,280px)] shrink-0 md:mx-0 md:max-w-[240px]">
                  <div className="pitch-vc-founder-photo-wrap relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/15">
                    <Image
                      src="/pitch/founder-aldy-bagus-prabowo.png"
                      alt="Portrait of Aldy Bagus Prabowo"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 90vw, 260px"
                    />
                  </div>
                </div>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-start">
                  <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 font-headline text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Founder
                  </span>
                  <h3 className="mt-4 font-headline text-2xl font-light tracking-tight text-on-surface md:text-[1.75rem] md:leading-tight lg:text-3xl">
                    Aldy Bagus Prabowo
                  </h3>
                  <div className="mt-3 h-0.5 w-10 rounded-full bg-primary/45" aria-hidden />
                  <div className="pitch-vc-founder-prose-print mt-6 max-w-prose [&>div]:max-w-none">
                    <PitchProse>
                      <p>
                        Former Chief Strategy Officer at PT Epsylon Citra Informatika with background in product marketing and
                        digital strategy across Gojek, Dentsu, and Wavemaker. Experience in building and scaling digital products,
                        user acquisition, and data-driven decision making.
                      </p>
                      <p>
                        Combines deep understanding of consumer behavior with execution in high-growth environments, now focused
                        on structuring fragmented skincare decision-making into a scalable product.
                      </p>
                      <p>
                        Previously worked on scaling consumer platforms and growth systems, now applying the same principles to
                        healthcare access.
                      </p>
                    </PitchProse>
                  </div>
                </div>
              </div>
            </article>

            <div
              className="pitch-vc-founder-connector flex items-center justify-center gap-4 py-6 print:hidden md:hidden"
              aria-hidden
            >
              <div className="h-px max-w-[min(40%,9rem)] flex-1 bg-gradient-to-r from-transparent to-outline-variant/35" />
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-outline-variant/25 bg-surface-container-high/90 shadow-sm ring-4 ring-primary/5">
                <PitchIcon name="diversity_3" className="!text-2xl text-primary/85" />
              </div>
              <div className="h-px max-w-[min(40%,9rem)] flex-1 bg-gradient-to-l from-transparent to-outline-variant/35" />
            </div>

            <article className="pitch-vc-founder-card flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm sm:p-8 md:p-8 print:overflow-visible">
              <div className="pitch-vc-founder-print-row relative flex min-h-0 flex-1 flex-col gap-8 md:flex-row-reverse md:items-stretch md:gap-6 lg:gap-8">
                <div className="pitch-vc-founder-photo-outer relative mx-auto w-full max-w-[min(100%,280px)] shrink-0 md:mx-0 md:max-w-[240px]">
                  <div className="pitch-vc-founder-photo-wrap relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/15">
                    <Image
                      src="/doctors/dr-riris.png"
                      alt="Portrait of dr. Riris Asti Respati, Sp.D.V"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 90vw, 260px"
                    />
                  </div>
                </div>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-start md:pr-1">
                  <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 font-headline text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Co-Founder (Clinical)
                  </span>
                  <h3 className="mt-4 font-headline text-2xl font-light tracking-tight text-on-surface md:text-[1.75rem] md:leading-tight lg:text-3xl">
                    dr. Riris Asti Respati, Sp.D.V
                  </h3>
                  <div className="mt-3 h-0.5 w-10 rounded-full bg-primary/45" aria-hidden />
                  <div className="pitch-vc-founder-prose-print mt-6 max-w-prose [&>div]:max-w-none">
                    <PitchProse>
                      <p>
                        Board-certified Dermatology &amp; Venereology Specialist (University of Indonesia, Cum Laude), with clinical
                        experience across hospital, specialist, and aesthetic dermatology practices.
                      </p>
                      <p>
                        Ranked 2nd nationally in the Indonesian dermatology board examination (KDVI); previously contributed to
                        clinical validation and dermatological R&amp;D at Paragon Technology and Innovation.
                      </p>
                      <p>
                        Combines clinical dermatology, aesthetic practice, and product R&amp;D so Seren stays evidence-based in
                        practice — aligned with our consumer, clinic, and brand model.
                      </p>
                    </PitchProse>
                  </div>
                </div>
              </div>
            </article>

            <div className="pitch-vc-founder-team-foot pitch-vc-founders-team-span mx-auto mt-8 max-w-4xl rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-6 py-7 text-center shadow-sm md:col-span-2 md:mt-8 md:px-10 md:py-8 md:text-left print:mx-0 print:mt-0 print:max-w-none">
              <p className="font-headline text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Why this team</p>
              <p className="mx-auto mt-3 max-w-3xl font-headline text-lg font-light leading-snug tracking-tight text-on-surface md:mx-0 md:text-xl md:leading-relaxed">
                Product + growth execution paired with clinical and product dermatology expertise — enabling Seren to bridge
                consumer behavior, clinical accuracy, and skincare product ecosystems.
              </p>
            </div>
          </div>
        </div>
      </VcSection>

      {/* 4. Product (2 SKUs) */}
      <VcSection tone="canvas" forExport={forExport} className="pitch-vc-memo-page">
        <PitchDeckSubhead eyebrow="04" title="Product — Two SKUs (live pricing)" lowerCaseTitle={false} />
        <PitchProse>
          <p>
            Consumer SKUs are fixed in-product today: a one-off dermatologist-reviewed report for focused concerns, and a
            30-day journey for users who want cadence, checkpoints, and follow-up. Early cohorts exercise both paths so we
            can compare depth of assessment against adherence over time.
          </p>
        </PitchProse>
        <div className="mt-6 max-w-3xl">
          <PitchTable
            uppercaseHeaders={false}
            headers={["SKU", "IDR price", "What the user receives"]}
            rows={[
              [
                "Single Report",
                "Rp49,000",
                "Structured assessment + dermatologist-reviewed routine aligned to uploaded photos and stated goals.",
              ],
              [
                "30-Day Skin Journey",
                "Rp99,000",
                "Guided checkpoints and follow-up across 30 days — built for habit formation and measurable progress.",
              ],
            ]}
          />
        </div>
      </VcSection>

      {/* 5. Market */}
      <VcSection tone="muted" forExport={forExport} className="pitch-vc-memo-page">
        <PitchDeckSubhead eyebrow="05" title="Market — Indonesia beauty & care" lowerCaseTitle={false} />
        <PitchProse>
          <p>
            Indonesia&apos;s population is <strong>about 279 million</strong> (Badan Pusat Statistik, 2024 national
            projection). That base sustains heavy demand for acne, pigment, sensitivity, barrier repair, and
            photoaging — categories where consumers already photograph skin, compare routines, and buy repeatedly online.
          </p>
          <p>
            Reported <strong>beauty and personal care retail in Indonesia</strong> has landed in the roughly{" "}
            <strong>US$6.5–8.5 billion</strong> annual range in 2023–2024 filings and syndicated trackers (Euromonitor
            market sizing; Statista category dashboards; broker summaries on Indonesian BPC). <strong>Skincare</strong> is
            the fastest-growing slice; <strong>Shopee</strong>, <strong>Tokopedia</strong>, and short-form commerce drive a
            large share of discovery and repurchase.
          </p>
        </PitchProse>
        <div className="mt-8 max-w-3xl space-y-4 border-t border-outline-variant/20 pt-8">
          <p className="m-0 font-body text-base leading-relaxed text-on-surface md:text-lg">
            If <strong>1M users</strong> purchase a <strong>Rp49K</strong> report (~<strong>$3</strong>), this represents{" "}
            <strong>~$3M+ revenue</strong> from a single SKU before downstream clinic and brand monetization.
          </p>
          <p className="m-0 font-headline text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface-variant">
            Initial focus: Indonesia
          </p>
        </div>
      </VcSection>

      {/* 6. Business model (3 layers) */}
      <VcSection tone="canvas" forExport={forExport} className="pitch-vc-memo-page">
        <PitchDeckSubhead eyebrow="06" title="Business model — Three layers" lowerCaseTitle={false} />
        <PitchProse>
          <p>
            <strong>B2C — paid reports and journeys.</strong> The primary engine validates willingness to pay, retention,
            and unit economics while clinical operations and the AI stack harden.
          </p>
          <p>
            <strong>B2B — clinic partnerships.</strong> Workflow and routing so Seren-qualified patients arrive prepared,
            improving consult yield, treatment acceptance, and device utilization. Economics are SaaS, rev-share, or
            booking fees depending on partner.
          </p>
          <p>
            <strong>B2B2C — brand integration.</strong> Education and product modules sit inside clinically bounded
            journeys, with attribution and adherence reporting and without abandoning safety guardrails.
          </p>
          <p>
            <strong>Stage.</strong> B2C is live with paid SKUs; clinic and brand conversations are active for design
            partnerships once cohort behavior is sufficiently instrumented.
          </p>
        </PitchProse>
      </VcSection>

      {/* 7. Vision (strongest — expanded) */}
      <VcSection tone="jewel" forExport={forExport} className="pitch-vc-memo-page">
        <PitchDeckSubhead eyebrow="07" title="Vision — Vertically integrated dermatology OS" lowerCaseTitle={false} />
        <PitchProse>
          <p>
            We believe the winning company in this category does not stop at a consumer app — it owns the{" "}
            <strong>operating system for dermatology</strong> in a high-friction market: how intake is captured, how
            plans are authored and revised, how follow-up is measured, and how demand is handed off to physical care when
            hands-on procedures matter.
          </p>
          <p>
            Indonesia is the right wedge: massive unmet demand, digital-native distribution, and a beauty culture that
            already trains users to photograph skin and iterate routines. Seren starts as the trusted layer between
            that behavior and clinical truth — then expands into clinic workflows so the same platform increases
            throughput and margin for providers, not only convenience for users.
          </p>
          <p>
            Long term, the vision is a <strong>vertically integrated stack</strong>: owned or deeply partnered clinics,
            standardized protocols, inventory and device utilization aligned to journeys, and selective distribution
            where product narrative matches what the clinical record says. Brands pay for access to that loop because it
            is where adherence and outcomes are legible — not because we rent banner space.
          </p>
          <p>
            AI is the accelerant, not the company: multimodal assessment and drafting let a small specialist bench cover
            national volume with consistent quality. The moat is the combined{" "}
            <strong>clinical network + workflow + data + distribution</strong> — the same rails that make B2C retention
            defensible make B2B partnerships inevitable once cohort proof is in place.
          </p>
          <p>
            Human-in-the-loop review, clear scope for async care, and documented escalation remain non-negotiable as we
            scale — speed cannot trade off against patient safety or clinical credibility.
          </p>
          <p>
            AI makes structured dermatology scalable for the first time — while skincare demand and digital behavior are
            already in place.
          </p>
        </PitchProse>
      </VcSection>

      {/* Funding objective — three parallel tracks (pairs with Ask) */}
      <VcSection tone="bright" forExport={forExport} className="pitch-vc-memo-page">
        <div className="pitch-vc-funding-print">
          <PitchDeckCenterTitle
            title="Funding objective"
            subtitle="Target raise: $50,000 — $100,000"
            lowerCaseTitle={false}
          />
          <PitchDeckFeatureStrip
            flatCards
            lowerCaseTitles={false}
            items={[
              {
                icon: "verified",
                title: "Retention & cohort quality",
                body: "Paid journeys and reports to prove repeat use, NPS, and willingness to pay in Bahasa-led acquisition — before scaling paid spend.",
              },
              {
                icon: "clinical_notes",
                title: "Dermatologist operations",
                body: "Expand review desk capacity, SLAs, and protocols so human-in-the-loop stays fast and safe as volume grows.",
              },
              {
                icon: "database",
                title: "AI & infrastructure",
                body: "Multimodal assessment across skin tones and lighting; secure media pipeline, eval harness, and monitoring for drift.",
              },
            ]}
          />
        </div>
      </VcSection>

      {/* 8. Ask */}
      <VcSection tone="jewel" forExport={forExport} className="pitch-vc-memo-page">
        <div className="mx-auto max-w-3xl">
          <PitchDeckSubhead eyebrow="08" title="Ask — pre-seed round" lowerCaseTitle={false} />
          <div className="pitch-vc-ask-block pitch-editorial-shadow rounded-2xl border border-outline-variant/20 bg-gradient-to-br from-surface-container-lowest/95 via-primary-container/15 to-tertiary-container/20 px-7 py-9 md:px-10 md:py-11">
            <p className="text-center font-headline text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
              Target raise
            </p>
            <p className="mt-2 text-center font-headline text-4xl font-light tracking-tight text-on-surface md:text-5xl">
              US$50k–$100k
            </p>
            <p className="mx-auto mt-3 max-w-md text-center font-body text-sm leading-relaxed text-on-surface-variant">
              Three parallel tracks through the next gate: retention economics, dermatologist operations, and AI /
              infrastructure.
            </p>
            <div className="mt-8 border-t border-outline-variant/20 pt-8">
              <PitchProse>
                <p>
                  Raising <strong>US$50,000–$100,000</strong> to run three parallel tracks:{" "}
                  <strong>retention validation</strong> (paid cohorts, LTV/CAC, referral loops),{" "}
                  <strong>dermatologist operations</strong> (desk throughput, SLAs, protocols, liability posture), and{" "}
                  <strong>AI & infrastructure</strong> (secure media, eval harnesses, drift monitoring across skin tones and
                  devices). The outcome is audited cohort economics and live clinic design partners ahead of a disciplined
                  seed round.
                </p>
                <p>
                  Near-term success looks like stable review SLAs, repeat purchase or journey continuation in a defined
                  cohort, and qualitative signal that users understand what they are doing to their skin and why — before we
                  widen paid acquisition.
                </p>
                <p>
                  This round is focused on proving retention, unit economics, and clinical scalability before expanding
                  acquisition and partnerships.
                </p>
              </PitchProse>
            </div>
          </div>
        </div>
      </VcSection>
    </>
  );
}
