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
        “Collectible stamp” energy — easy to share without feeling like an ad.
      </p>
    </div>
  );
}

function StampCard() {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)] bg-surface-container-lowest relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(249,232,179,0.75),transparent_55%),radial-gradient(circle_at_85%_20%,rgba(211,226,247,0.85),transparent_55%),radial-gradient(circle_at_55%_78%,rgba(205,232,218,0.78),transparent_60%),radial-gradient(circle_at_35%_80%,rgba(248,215,223,0.65),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#2f3330_0.55px,transparent_0.55px)] [background-size:14px_14px]" />

      <div className="relative h-full p-10 grid grid-cols-12 gap-8">
        <div className="col-span-7 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/55">
              Seren skin journey
            </p>
            <p className="mt-5 text-6xl font-headline tracking-tight leading-[0.9]">
              Week 1
            </p>
            <p className="mt-4 text-base text-on-surface-variant leading-relaxed max-w-[52ch]">
              Barrier reset + sunscreen consistency. Calm, simple, repeatable.
            </p>
          </div>

          <div className="rounded-[2rem] bg-surface/70 backdrop-blur border border-outline-variant/12 p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                  Today’s focus
                </p>
                <p className="mt-2 text-xl font-headline tracking-tight">
                  Keep it gentle. Keep it daily.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] shrink-0">
                Derm‑reviewed
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["AM 3 steps", "PM 2 steps", "Sensitive‑safe"].map((t) => (
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

        <div className="col-span-5 flex flex-col justify-between">
          <div className="rounded-[2rem] bg-surface/70 backdrop-blur border border-outline-variant/12 p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
              Stamp
            </p>
            <div className="rounded-[1.75rem] border border-outline-variant/15 bg-surface p-6">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                SRN‑8821
              </p>
              <p className="mt-3 text-3xl font-headline tracking-tight">Barrier</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                Reset • protect • then introduce one active slowly.
              </p>
              <div className="mt-5 h-px w-full bg-outline-variant/15" />
              <p className="mt-4 text-xs text-on-surface/45">
                No clinical photos in previews.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-on-surface/45">Seren</p>
            <div className="rounded-full bg-surface border border-outline-variant/12 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface/70">
              View report
            </div>
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

