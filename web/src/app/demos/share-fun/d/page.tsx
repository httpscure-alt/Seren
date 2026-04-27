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
        Bold split layout: dark hero for thumb-stopping contrast + warm “stamp” panel for collectible
        energy. Still no clinical photos.
      </p>
    </div>
  );
}

function StampCard() {
  return (
    <div className="w-full h-full rounded-[24px] overflow-hidden shadow-[0_36px_120px_-28px_rgba(61,99,116,0.5)] ring-[3px] ring-[#c9a227]/35 flex min-h-[320px]">
      {/* High-contrast hero column — reads instantly in a tiny OG thumbnail */}
      <div className="relative w-[42%] min-w-[200px] bg-gradient-to-br from-primary via-[#2f4f5c] to-[#1e3a45] p-8 sm:p-10 flex flex-col justify-between text-on-primary">
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 size-[180px] rounded-full bg-[#e8c547]/25 blur-3xl" />
        <div className="absolute top-6 right-6 rounded-full bg-on-primary/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-on-primary border border-on-primary/25">
          Unlocked
        </div>
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-on-primary/75">
            Seren skin journey
          </p>
          <p className="mt-4 text-sm font-medium text-[#f4e4a6] uppercase tracking-widest">Week</p>
          <p className="mt-1 text-[4.5rem] sm:text-[5.5rem] font-headline font-light tracking-[-0.06em] leading-[0.85] text-white drop-shadow-sm">
            1
          </p>
          <p className="mt-4 text-sm leading-relaxed text-on-primary/90 max-w-[28ch]">
            Post-worthy progress: barrier reset + daily SPF. Derm-reviewed.
          </p>
        </div>
        <div className="relative flex flex-wrap gap-2">
          {["Shareable", "No face photos", "Private by default"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-on-primary/95 border border-on-primary/20"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Warm stamp panel — collectible energy */}
      <div className="flex-1 relative bg-gradient-to-br from-[#fdf8ee] via-[#f7f4ec] to-[#eef6f4] p-8 sm:p-10 flex flex-col justify-between">
        <div className="absolute inset-0 opacity-[0.09] [background-image:radial-gradient(#305767_0.65px,transparent_0.65px)] [background-size:12px_12px]" />
        <div className="relative rounded-[1.75rem] border-2 border-dashed border-primary/25 bg-white/90 p-7 shadow-inner shadow-primary/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Journey stamp</p>
              <p className="mt-3 text-xs font-mono tracking-wide text-on-surface/55">SRN‑8821</p>
              <p className="mt-2 text-3xl font-headline tracking-tight text-primary">Barrier focus</p>
            </div>
            <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#a67c00] text-white shadow-lg shadow-amber-900/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7L12 15.9 6.4 19.5l2.1-6.7L3 8.8h6.8L12 2z"
                  fill="currentColor"
                  opacity="0.95"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-on-surface leading-relaxed">
            Reset → protect → one new active, slowly.
          </p>
          <div className="mt-5 rounded-xl bg-primary/8 px-4 py-3 border border-primary/15">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Today</p>
            <p className="mt-1 text-base font-headline tracking-tight text-on-surface">
              Gentle wins. Show it off.
            </p>
          </div>
        </div>
        <div className="relative flex items-center justify-between gap-4 pt-2">
          <p className="text-xs font-semibold text-primary">seren.skin</p>
          <div className="rounded-full btn-gradient text-on-primary px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] shadow-[0_12px_36px_-16px_rgba(61,99,116,0.65)]">
            Share my week
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareFunD() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Fun share • D
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Option D: journey stamp
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            A collectible vibe that people share like “week 1 progress”.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-fun">
              Back to fun variants
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <Frame>
            <StampCard />
          </Frame>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

