import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { hasActiveSubscription } from "@/lib/entitlement";
import { prisma } from "@/lib/db";

type Params = { id: string };

function RingGauge({
  value,
  label,
  tone = "primary",
}: {
  value: number; // 0..1
  label: string;
  tone?: "primary" | "muted";
}) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, value)) * c;
  const track = "stroke-outline-variant/25";
  const stroke = tone === "primary" ? "stroke-primary" : "stroke-on-surface/35";
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-20 w-20">
          <circle cx="40" cy="40" r={r} className={track} strokeWidth="8" fill="none" />
          <circle
            cx="40" cy="40" r={r}
            className={stroke}
            strokeWidth="8" fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            transform="rotate(-90 40 40)"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-lg font-headline tracking-tight">
              {String(Math.round(value * 10)).padStart(2, "0")}
            </div>
            <div className="text-[9px] uppercase tracking-[0.22em] text-on-surface/45">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ADVICE_MAP: Record<string, { label: string; detail: string; icon: string }> = {
  pick:    { label: "Don't Squeeze/Pick",   detail: "Avoids scarring and bacterial spread.",            icon: "🚫" },
  pillow:  { label: "Change Pillowcase",    detail: "Twice weekly (reduce oil/bacteria).",              icon: "🛌" },
  phone:   { label: "Clean Phone Screen",   detail: "Wipe daily with alcohol to avoid cheek acne.",    icon: "📱" },
  hands:   { label: "Wash Hands First",     detail: "Never touch face with unwashed hands.",            icon: "🧼" },
  makeup:  { label: "Clean Brushes",        detail: "Wash tools every 7 days.",                         icon: "💄" },
  scrub:   { label: "No Physical Scrubs",   detail: "Damages barrier; use chemical exfoliants only.",  icon: "❌" },
  water:   { label: "Lukewarm Water Only",  detail: "Hot water triggers inflammation/dryness.",         icon: "💧" },
  sleep:   { label: "7-8h Sleep",           detail: "Vital for overnight skin repair cycle.",           icon: "😴" },
  stress:  { label: "Stress Management",    detail: "Cortisol triggers sebum production.",             icon: "🧘" },
  dairy:   { label: "Limit Dairy/Milk",     detail: "Hormone triggers for inflammatory acne.",          icon: "🥛" },
  sugar:   { label: "Low Sugar Diet",       detail: "High GI foods trigger insulin & sebum.",           icon: "🍭" },
  hydrate: { label: "Drink 2L+ Water",      detail: "Maintains systemic skin hydration.",               icon: "🚰" },
  sun:     { label: "Strict Sun Protection",detail: "Vital to prevent dark marks (PIH).",              icon: "☀️" },
  peak:    { label: "Avoid Peak Sun",       detail: "Stay indoors between 10am - 4pm.",                icon: "🏠" },
  reapply: { label: "Reapply SPF",          detail: "Every 2-3 hours if outdoors.",                    icon: "🧴" },
};

export default async function ReportPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // ── Auth guard ────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    redirect(`/auth?returnTo=${encodeURIComponent(`/report/${id}`)}`);
  }

  // ── Subscription guard (admins & physicians are always allowed) ───────────
  const role = (session as any)?.role as string | undefined;
  const isStaff = role === "PHYSICIAN" || role === "ADMIN";
  if (!isStaff) {
    const active = await hasActiveSubscription(userId);
    if (!active) redirect(`/paywall?returnTo=${encodeURIComponent(`/report/${id}`)}`);
  }

  // ── Fetch the case ────────────────────────────────────────────────────────
  const caseData = await prisma.case.findFirst({
    where: { publicId: String(id).toUpperCase() },
    select: {
      id: true,
      publicId: true,
      userId: true,
      status: true,
      report: {
        select: { contentJson: true, publishedAt: true, clinicianId: true },
      },
    },
  });

  // Ownership check: only the case owner (or staff) can view
  if (!caseData) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <SiteNavbar />
        <main className="seren-container py-32 text-center">
          <h1 className="font-headline text-3xl">Report not found.</h1>
          <Link href="/results" className="mt-8 inline-block text-primary font-bold underline">
            Back to dashboard
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!isStaff && caseData.userId !== userId) {
    redirect("/results");
  }

  if (!caseData.report) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <SiteNavbar />
        <main className="seren-container py-32 text-center">
          <h1 className="font-headline text-3xl italic">Report is pending.</h1>
          <p className="mt-4 text-outline">Your dermatologist is currently finalizing your results.</p>
          <Link href="/results" className="mt-8 inline-block text-primary font-bold underline">
            Back to dashboard
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const content = (caseData.report.contentJson as any) || {};
  const edits   = content.clinicianEdits || {};
  const aiDraft = content.aiDraft || {};
  const adviceIds = (content.selectedAdvice as string[]) || [];

  const severityValue =
    aiDraft.severity === "Severe"   ? 0.9 :
    aiDraft.severity === "Moderate" ? 0.6 : 0.3;

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-14 sm:mb-18 lg:mb-20">
          <div className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="col-span-12 lg:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-primary font-bold mb-5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Clinical Skin Report
              </p>
              <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.6rem] sm:text-[3.3rem] lg:text-[3.8rem]">
                Your tailored<br />
                <span className="italic font-light text-primary/60">skin blueprint.</span>
              </h1>
              <p className="mt-7 text-on-surface-variant leading-[1.75] max-w-[60ch]">
                Verified results from Dr. Riris Asti Respati based on your clinical photos and assessment.
              </p>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="relative rounded-[2.75rem] overflow-hidden bg-surface-container-lowest shadow-[0_30px_100px_-60px_rgba(47,51,48,0.35)]">
                <div className="relative aspect-[4/5]">
                  <Image src="/doctors/dr-riris.png" alt="Reviewing dermatologist" fill className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute left-6 right-6 bottom-6 rounded-3xl bg-surface/80 backdrop-blur-2xl border border-white/20 p-6 shadow-2xl">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-on-surface/40 font-bold">Certified Clinician</p>
                    <p className="mt-1 font-headline text-lg tracking-tight">Dr. Riris Asti Respati, SpDVE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── 1. Assessment & Severity ────────────────────────────────────── */}
        <section className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-6">Dermatologist Assessment</p>
            <h2 className="font-headline text-xl sm:text-2xl leading-relaxed italic text-primary/80">
              &ldquo;{edits.diagnosis || aiDraft.condition || "No specific assessment provided."}&rdquo;
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-6">Condition Severity</p>
            <RingGauge value={severityValue} label="Level" />
            <p className="mt-4 font-headline text-lg text-primary">{aiDraft.severity || "Mild"}</p>
          </div>
        </section>

        {/* ── 2. Daily Ritual ─────────────────────────────────────────────── */}
        <section className="rounded-[3rem] bg-primary/5 border border-primary/10 p-8 sm:p-14 mb-14">
          <div className="mb-10">
            <h2 className="font-headline text-3xl">Daily Ritual</h2>
            <p className="mt-2 text-on-surface-variant font-medium">Tailored for consistency and clinical results.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold mb-8 flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />AM (Morning)
              </p>
              <div className="space-y-7">
                {(edits.routine || "")
                  .split("PM:")[0]
                  ?.replace("AM:", "")
                  .trim()
                  .split("\n")
                  .filter(Boolean)
                  .map((line: string, i: number) => (
                    <div key={i} className="flex gap-5 items-start">
                      <span className="text-2xl font-headline text-primary/15 shrink-0 pt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-lg font-headline leading-tight tracking-tight pt-0.5">
                        {line.replace(/^- /, "")}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold mb-8 flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />PM (Evening)
              </p>
              <div className="space-y-7">
                {(edits.routine || "")
                  .split("PM:")[1]
                  ?.split("Notes:")[0]
                  ?.trim()
                  .split("\n")
                  .filter(Boolean)
                  .map((line: string, i: number) => (
                    <div key={i} className="flex gap-5 items-start">
                      <span className="text-2xl font-headline text-primary/15 shrink-0 pt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-lg font-headline leading-tight tracking-tight pt-0.5">
                        {line.replace(/^- /, "")}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Non-Medica Mentosa lifestyle advice ──────────────────────── */}
        {adviceIds.length > 0 && (
          <section className="mb-14">
            <div className="mb-10">
              <h2 className="font-headline text-2xl">Clinical Lifestyle Advice</h2>
              <p className="text-sm text-outline mt-1 italic">Behavior changes for faster recovery.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {adviceIds.map((adviceId) => {
                const item = ADVICE_MAP[adviceId];
                if (!item) return null;
                return (
                  <div
                    key={adviceId}
                    className="bg-surface-container-lowest p-6 sm:p-7 rounded-[2.5rem] border border-outline-variant/10 hover:border-primary/20 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl bg-surface p-3 rounded-2xl border border-outline-variant/10">{item.icon}</span>
                      <p className="font-headline text-base leading-tight">{item.label}</p>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 4. Clinical Product Audit ───────────────────────────────────── */}
        {Array.isArray(aiDraft.routineAnalysis) && aiDraft.routineAnalysis.length > 0 && (
          <section className="mb-20">
            <div className="mb-10">
              <h2 className="font-headline text-2xl">Clinical Product Audit</h2>
              <p className="text-sm text-outline mt-1 italic">Rationale behind the changes to your previous routine.</p>
            </div>
            <div className="space-y-6">
              {(aiDraft.routineAnalysis as any[]).map((audit, i) => (
                <div
                  key={i}
                  className="bg-surface-container-low/40 p-7 sm:p-8 rounded-[3rem] border border-outline-variant/10 flex flex-col lg:flex-row justify-between gap-8 hover:bg-surface-container-low transition-colors"
                >
                  <div className="max-w-xl">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        audit.action === "REPLACE" || audit.action === "IMMEDIATE REPLACE"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {audit.action}
                    </span>
                    <p className="font-headline text-xl mt-4 mb-3">{audit.productName}</p>
                    <p className="text-base text-on-surface-variant leading-relaxed italic">&ldquo;{audit.rationale}&rdquo;</p>
                  </div>
                  {audit.scores && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 shrink-0">
                      {Object.entries(audit.scores).map(([k, v]: [string, any]) => (
                        <div
                          key={k}
                          className="flex flex-col items-center bg-surface p-4 rounded-3xl border border-outline-variant/5 shadow-sm"
                        >
                          <div
                            className={`text-xl font-headline ${
                              v >= 4 ? "text-primary" : v >= 3 ? "text-amber-500" : "text-red-500"
                            }`}
                          >
                            {v}<span className="text-[10px] opacity-40 ml-0.5">/5</span>
                          </div>
                          <span className="text-[8px] uppercase tracking-widest mt-2 text-outline text-center leading-tight font-bold">
                            {k.replace(/([A-Z])/g, " $1")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer nav ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-6 flex-wrap border-t border-outline-variant/10 pt-12">
          <Link
            href="/results"
            className="inline-flex px-10 py-4 rounded-full bg-surface-container text-on-surface-variant text-sm font-headline hover:bg-surface-container-high transition-all"
          >
            ← Back to dashboard
          </Link>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-bold">Report ID</p>
            <p className="text-sm font-mono text-on-surface/40">{caseData.publicId}</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
