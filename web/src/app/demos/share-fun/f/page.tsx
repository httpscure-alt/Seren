import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="seren-card p-8 sm:p-10">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-6">
        OG preview frame (mock)
      </p>
      <div className="w-full aspect-[1200/630] max-w-[1200px] mx-auto">{children}</div>
      <p className="mt-6 text-xs text-on-surface/45 leading-relaxed">
        Habit-tracker energy — shareable because it’s about consistency, not “skin problems”.
      </p>
    </div>
  );
}

function Check({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface border border-outline-variant/10 px-4 py-3">
      <span
        className={[
          "grid place-items-center size-6 rounded-xl border text-xs font-headline",
          checked
            ? "bg-primary/10 border-primary/20 text-primary"
            : "bg-surface border-outline-variant/15 text-on-surface/35",
        ].join(" ")}
        aria-hidden="true"
      >
        {checked ? "✓" : "•"}
      </span>
      <span className="text-sm text-on-surface/80">{label}</span>
    </div>
  );
}

function ChecklistCard() {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)] bg-surface-container-lowest relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(202,225,250,0.88),transparent_55%),radial-gradient(circle_at_82%_22%,rgba(249,232,179,0.62),transparent_55%),radial-gradient(circle_at_56%_82%,rgba(201,232,220,0.72),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.1] [background-image:radial-gradient(#2f3330_0.6px,transparent_0.6px)] [background-size:18px_18px]" />

      <div className="relative h-full p-10 grid grid-cols-12 gap-8">
        <div className="col-span-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/55">
              Seren routine checklist
            </p>
            <p className="mt-5 text-5xl font-headline tracking-tight leading-[0.95]">
              7‑day streak
            </p>
            <p className="mt-4 text-base text-on-surface-variant leading-relaxed">
              A calm routine you can actually keep.
            </p>
          </div>

          <div className="rounded-[2rem] bg-surface/70 backdrop-blur border border-outline-variant/12 p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              This week’s goal
            </p>
            <p className="mt-2 text-xl font-headline tracking-tight">
              Protect daily. Introduce actives slowly.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["AM", "PM", "Sunscreen"].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-surface border border-outline-variant/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-on-surface/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-7 rounded-[2rem] bg-surface/70 backdrop-blur border border-outline-variant/12 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                Today (Day 7)
              </p>
              <p className="mt-2 text-2xl font-headline tracking-tight">Checklist</p>
            </div>
            <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] shrink-0">
              Derm‑reviewed
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">AM</p>
              <Check checked label="Cleanser (gentle)" />
              <Check checked label="Moisturizer" />
              <Check checked label="Sunscreen (2 fingers)" />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">PM</p>
              <Check checked label="Cleanser (double if makeup)" />
              <Check checked={false} label="Active (1–2×/week)" />
              <Check checked label="Moisturizer (repair)" />
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <p className="text-xs text-on-surface/45">SRN‑8821</p>
            <div className="rounded-full bg-surface border border-outline-variant/12 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface/70">
              Copy routine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareFunF() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Fun share • F
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Option F: routine checklist
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            A habit-tracker look — shares as “streak / routine” instead of “skin condition”.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-fun">
              Back to fun variants
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <Frame>
            <ChecklistCard />
          </Frame>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

