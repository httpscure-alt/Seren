import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

type Note = {
  id: string;
  date: string;
  clinician: string;
  reason: string;
  summary: string;
  assessment: string[];
  plan: string[];
  status: "Draft" | "Signed";
};

const NOTES: Note[] = [
  {
    id: "SRN-8821",
    date: "Sep 12, 2024 • 09:42",
    clinician: "Dr. Riris Asti Respati, SpDVE",
    reason: "Barrier stress + congestion",
    summary:
      "Findings consistent with mild inflammatory acne and compromised barrier. No red-flag symptoms reported in intake.",
    assessment: [
      "Mild inflammatory acne (papules) — malar region",
      "Barrier compromise with dehydration",
      "Post-inflammatory hyperpigmentation risk (phototype dependent)",
    ],
    plan: [
      "Barrier-first routine for 14 days; avoid over-exfoliation",
      "Daily broad-spectrum SPF 50+",
      "Reassess at day 14; escalate actives if tolerated",
    ],
    status: "Signed",
  },
  {
    id: "SRN-7710",
    date: "Jul 02, 2024 • 18:10",
    clinician: "Clinical team",
    reason: "Initial skin analysis",
    summary:
      "Baseline intake recorded. Photos adequate; lighting acceptable. Symptoms suggest sensitivity + texture concerns.",
    assessment: [
      "Sensitive skin tendency (reactive)",
      "Uneven tone/texture concerns",
      "No systemic symptoms reported",
    ],
    plan: [
      "Gentle cleanser + ceramide moisturizer",
      "Introduce actives slowly (2–3x/week) if no irritation",
      "Follow-up after 30 days for adjustment",
    ],
    status: "Signed",
  },
] as const;

export default function ClinicalNotesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="mb-10 sm:mb-14 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
            Clinical notes
          </p>
          <h1 className="font-headline tracking-[-0.03em] leading-[1.0] text-3xl sm:text-4xl">
            Consultation record
          </h1>
          <p className="mt-5 text-on-surface-variant leading-relaxed">
            A structured log of clinician-reviewed notes for your assessments.
            This is a demo dataset for now.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-8 space-y-6">
            {NOTES.map((n) => (
              <article
                key={n.id}
                className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]"
              >
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                      {n.date}
                    </p>
                    <p className="mt-2 font-headline tracking-tight text-lg">
                      {n.reason}
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      Clinician: <span className="text-on-surface">{n.clinician}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] px-3 py-1 rounded-full bg-surface-container-low text-on-surface/60 border border-outline-variant/12">
                      {n.status}
                    </span>
                    <Link
                      href="/demos/share-report"
                      className="btn-gradient text-on-primary px-5 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-sm"
                    >
                      Open report
                    </Link>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-3xl bg-surface-container-low p-6">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
                      Summary
                    </p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {n.summary}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-surface-container-low p-6">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
                      Assessment
                    </p>
                    <ul className="text-sm text-on-surface-variant leading-relaxed space-y-2 list-disc pl-5">
                      {n.assessment.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-surface-container-low p-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
                    Plan
                  </p>
                  <ul className="text-sm text-on-surface-variant leading-relaxed space-y-2 list-disc pl-5">
                    {n.plan.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-16 rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/12">
                  <Image
                    src="/doctors/dr-riris.png"
                    alt="reviewing dermatologist"
                    width={56}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                    Reviewing dermatologist
                  </p>
                  <p className="mt-2 font-headline tracking-tight">
                    Dr. Riris Asti Respati, SpDVE
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm text-on-surface-variant leading-relaxed">
                Notes are signed only after clinician review. This section will
                eventually include attachments (photos, annotations) and
                follow-up messages.
              </p>
            </div>

            <div className="rounded-[2.5rem] bg-surface-container-low p-7 sm:p-9 border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
                Navigation
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/results"
                  className="rounded-full border border-outline-variant/25 px-6 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Back to results
                </Link>
                <Link
                  href="/consult/welcome"
                  className="btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
                >
                  Start consultation
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

