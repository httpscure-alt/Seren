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
          <circle
            cx="40"
            cy="40"
            r={r}
            className={track}
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            className={stroke}
            strokeWidth="8"
            fill="none"
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
            <div className="text-[9px] uppercase tracking-[0.22em] text-on-surface/45">
              {label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ReportPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    redirect(`/auth?returnTo=${encodeURIComponent(`/report/${id}`)}`);
  }
  const active = await hasActiveSubscription(userId);
  if (!active) {
    redirect(`/paywall?returnTo=${encodeURIComponent(`/report/${id}`)}`);
  }

  await prisma.userSeenState.upsert({
    where: { userId },
    create: { userId, lastSeenReportAt: new Date() },
    update: { lastSeenReportAt: new Date() },
  });

  // Track per-report opened state for the user gallery.
  await (prisma as any).userOpenedReport.upsert({
    where: { userId_publicId: { userId, publicId: String(id).toUpperCase() } },
    create: { userId, publicId: String(id).toUpperCase() },
    update: { openedAt: new Date() },
  });

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="mb-14 sm:mb-18 lg:mb-20">
          <div className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="col-span-12 lg:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-5">
                Your dermatologist-reviewed skin report.
              </p>
              <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.6rem] sm:text-[3.3rem] lg:text-[3.8rem]">
                Dermatologist-reviewed
                <br />
                <span className="italic font-light">skin report.</span>
              </h1>
              <p className="mt-7 text-on-surface-variant leading-[1.75] max-w-[60ch]">
                Based on your intake assessment and visual analysis, this report
                outlines your current condition, the routine you can follow, and
                the next steps if symptoms persist.
              </p>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="relative rounded-[2.75rem] overflow-hidden bg-surface-container-lowest shadow-[0_30px_100px_-60px_rgba(47,51,48,0.35)]">
                <div className="relative aspect-[4/5] sm:aspect-[4/5]">
                  <Image
                    src="/doctors/dr-riris.png"
                    alt="Reviewing dermatologist"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,0,0,0.22),transparent_55%),linear-gradient(180deg,rgba(0,0,0,0.08),transparent_45%)]" />

                  <div className="absolute left-7 bottom-7 w-[min(360px,calc(100%-3.5rem))] rounded-3xl bg-surface/70 backdrop-blur-2xl border border-outline-variant/15 shadow-[0_26px_80px_-44px_rgba(47,51,48,0.45)] p-6">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                      Reviewing dermatologist
                    </p>
                    <p className="mt-2 font-headline tracking-tight">
                      Dr. Riris Asti Respati, SpDVE
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                      R.A. Respati
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-12 gap-6 mb-10 sm:mb-12">
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2.5rem] p-7 sm:p-9 shadow-[0_22px_70px_-46px_rgba(47,51,48,0.20)]">
            <p className="font-headline tracking-tight text-base mb-5">
              Primary assessment
            </p>
            <p className="text-on-surface-variant leading-relaxed max-w-[70ch]">
              Localized erythema with compromised skin barrier in the malar
              region.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                ["Hydration", "42% (deficient)", "bg-primary", "w-[42%]"],
                ["Elasticity", "78% (optimal)", "bg-primary", "w-[78%]"],
                ["Sensitivity", "65% (reactive)", "bg-error-container", "w-[65%]"],
              ].map(([k, v, color, w]) => (
                <div key={k} className="rounded-3xl bg-surface-container-low p-6">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 block mb-2">
                    {k}
                  </span>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full ${color} ${w}`} />
                  </div>
                  <span className="text-sm font-medium mt-3 block text-on-surface">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-[2.5rem] p-7 sm:p-9 shadow-[0_22px_70px_-46px_rgba(47,51,48,0.20)]">
            <p className="font-headline tracking-tight text-base mb-2">
              Severity level
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Moderate • monitor inflammation and barrier response.
            </p>
            <RingGauge value={0.2} label="level" />
          </div>
        </section>

        <section className="rounded-[2.75rem] bg-surface-container-lowest shadow-[0_22px_70px_-46px_rgba(47,51,48,0.20)] overflow-hidden mb-12 sm:mb-16">
          <div className="p-7 sm:p-9">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              Dermal topography map
            </p>
          </div>
          <div className="relative h-[260px] sm:h-[340px] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%),linear-gradient(180deg,rgba(175,179,174,0.28),rgba(175,179,174,0.10))]" />
        </section>

        <section className="grid grid-cols-12 gap-6 mb-12 sm:mb-16">
          <div className="col-span-12 lg:col-span-4">
            <h2 className="font-headline tracking-[-0.02em] text-2xl sm:text-3xl">
              Recommended
              <br />
              <span className="italic font-light">actions.</span>
            </h2>
            <p className="mt-4 text-on-surface-variant leading-relaxed">
              Focus on barrier support and gentle inflammation control.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {[
              {
                title: "Barrier restoration",
                body: "Improve ceramide-rich hydration to reduce redness and sensitivity.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
                    <path
                      d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.2 12.2l1.8 1.8 3.8-3.8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                title: "UV protective protocol",
                body: "SPF daily to prevent post-inflammatory hyperpigmentation.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
                    <path
                      d="M12 3v3M12 18v3M4.5 12h3M16.5 12h3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 8a4 4 0 1 0 4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                title: "Active supervision",
                body: "If symptoms persist, dermatologist-guided treatment is recommended.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
                    <path
                      d="M8.5 3h7l2 2v14.5a2.5 2.5 0 0 1-2.5 2.5h-6A4 4 0 0 1 5 18V6.5A3.5 3.5 0 0 1 8.5 3Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 9h8M8 12h6M8 15h7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
            ].map((a) => (
              <div
                key={a.title}
                className="rounded-[2rem] bg-surface-container-low/60 px-6 sm:px-7 py-6 flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-2xl bg-surface/70 backdrop-blur-xl grid place-items-center shrink-0">
                  {a.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-headline tracking-tight text-sm">{a.title}</p>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                    {a.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2.75rem] bg-surface-container-lowest shadow-[0_22px_70px_-46px_rgba(47,51,48,0.20)] p-7 sm:p-9 mb-12 sm:mb-16">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h2 className="font-headline tracking-[-0.02em] text-2xl sm:text-3xl">
                Daily ritual
              </h2>
              <p className="mt-3 text-on-surface-variant leading-relaxed max-w-[62ch]">
                A routine you can actually follow—morning and evening, built for
                consistency.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full bg-primary text-on-primary px-6 py-3 text-sm font-medium tracking-wide shadow-sm"
            >
              Start consultation
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                morning (am)
              </p>
              <div className="space-y-5">
                {[
                  ["Gentle milk cleanser", "Cleanse", "01"],
                  ["Hyaluronic serum", "Hydrate", "02"],
                  ["Broad spectrum SPF 50+", "Protect", "03"],
                ].map(([title, meta, n]) => (
                  <div key={title} className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-2">
                      <div className="text-on-surface/20 font-headline text-3xl tracking-tighter">
                        {n}
                      </div>
                    </div>
                    <div className="col-span-10">
                      <p className="font-headline tracking-tight">{title}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">{meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                evening (pm)
              </p>
              <div className="space-y-5">
                {[
                  ["Lipids cleanse", "Cleanse", "01"],
                  ["Copper peptide complex", "Treat", "02"],
                  ["Night ceramide concentrate", "Repair", "03"],
                ].map(([title, meta, n]) => (
                  <div key={title} className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-2">
                      <div className="text-on-surface/20 font-headline text-3xl tracking-tighter">
                        {n}
                      </div>
                    </div>
                    <div className="col-span-10">
                      <p className="font-headline tracking-tight">{title}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">{meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] bg-surface-container-low/60 p-6 sm:p-7 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-16 rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/12 shadow-sm shrink-0">
                <Image
                  src="/doctors/dr-riris.png"
                  alt="reviewing dermatologist"
                  width={56}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-bold mb-1">
                  Reviewing dermatologist
                </p>
                <p className="font-headline text-sm">Dr. Riris Asti Respati, SpDVE</p>
              </div>
            </div>
            <div className="text-xs text-on-surface/50">
              Traceable • dermatologist-reviewed
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between gap-6 flex-wrap">
          <Link
            href="/results"
            className="inline-flex px-8 py-3.5 rounded-full border border-outline-variant/25 text-on-surface-variant text-sm font-headline hover:bg-surface-container transition-colors"
          >
            Back to results
          </Link>
          <span className="text-xs text-on-surface/45">
            Report ID: <span className="text-on-surface">{id}</span>
          </span>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
