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
      <p className="mt-6 text-sm text-on-surface-variant leading-relaxed">
        Dark “streak” canvas + big completion meter + crisp white checklist — reads as Duolingo /
        Strava energy, not a beige brochure.
      </p>
    </div>
  );
}

function Check({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl px-4 py-3.5 border-2 transition-shadow",
        checked
          ? "bg-white border-primary/25 shadow-[0_8px_24px_-12px_rgba(61,99,116,0.35)]"
          : "bg-white/50 border-outline-variant/20 border-dashed",
      ].join(" ")}
    >
      <span
        className={[
          "grid place-items-center size-8 rounded-xl text-sm font-headline shrink-0",
          checked
            ? "bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-md"
            : "bg-surface-container text-on-surface/30 border border-outline-variant/20",
        ].join(" ")}
        aria-hidden="true"
      >
        {checked ? "✓" : ""}
      </span>
      <span className={["text-sm font-medium", checked ? "text-on-surface" : "text-on-surface/45"].join(" ")}>
        {label}
      </span>
    </div>
  );
}

function ChecklistCard() {
  return (
    <div className="w-full h-full rounded-[24px] overflow-hidden ring-2 ring-[#c9a227]/30 shadow-[0_36px_110px_-28px_rgba(61,99,116,0.45)] relative bg-[#102018]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(61,99,116,0.55),transparent),radial-gradient(circle_at_90%_20%,rgba(232,197,71,0.2),transparent_50%),radial-gradient(circle_at_40%_100%,rgba(120,180,160,0.25),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_0.5px,transparent_0.5px)] [background-size:10px_10px]" />

      <div className="relative h-full p-10 grid grid-cols-12 gap-8 text-white">
        <div className="col-span-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#9fd4b8]">
              Seren · streak mode
            </p>
            <div className="mt-6 flex items-end gap-3">
              <p className="text-6xl sm:text-7xl font-headline font-light tracking-[-0.04em] leading-none text-white">
                86%
              </p>
              <p className="pb-2 text-sm font-semibold uppercase tracking-widest text-[#ffe08a]">
                week done
              </p>
            </div>
            <p className="mt-4 text-3xl font-headline tracking-tight leading-tight">
              7-day streak
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Habit energy beats “before/after” shame. Share the discipline, not the diagnosis.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">Goal</p>
            <p className="mt-2 text-lg font-headline tracking-tight">Daily SPF + barrier repair</p>
            <div className="mt-4 h-2 rounded-full bg-black/30 overflow-hidden">
              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[#3d6374] to-[#e8c547]" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["AM", "PM", "SPF"].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-black/25 border border-white/15 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-7 rounded-[1.75rem] bg-white text-on-surface p-8 shadow-2xl border border-primary/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Day 7</p>
              <p className="mt-2 text-2xl font-headline tracking-tight">Today’s checklist</p>
            </div>
            <span className="rounded-full btn-gradient text-on-primary px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] shadow-md shrink-0">
              Derm-reviewed
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface/45">AM</p>
              <Check checked label="Cleanser (gentle)" />
              <Check checked label="Moisturizer" />
              <Check checked label="Sunscreen (2 fingers)" />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface/45">PM</p>
              <Check checked label="Cleanser (double if makeup)" />
              <Check checked={false} label="Active (1–2×/week)" />
              <Check checked label="Moisturizer (repair)" />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 pt-2 border-t border-outline-variant/15">
            <p className="text-xs font-mono font-semibold text-primary">SRN‑8821</p>
            <div className="rounded-full bg-primary text-on-primary px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/25">
              Post my streak
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

