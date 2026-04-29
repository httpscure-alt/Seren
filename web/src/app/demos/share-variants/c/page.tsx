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
        Feels like a personal artifact. Minimal, not promotional.
      </p>
    </div>
  );
}

function CardC() {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 bg-surface-container-lowest shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)]">
      <div className="h-full p-10 grid grid-cols-12 gap-8">
        <div className="col-span-7 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
              Seren report artifact
            </p>
            <p className="mt-4 text-5xl font-headline tracking-tight leading-[0.95]">
              SRN-8821
            </p>
            <p className="mt-4 text-base text-on-surface-variant leading-relaxed max-w-[62ch]">
              A dermatologist-reviewed plan you can actually follow.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { k: "AM steps", v: "3" },
                { k: "PM steps", v: "2" },
                { k: "Focus", v: "Barrier" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 p-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{m.k}</p>
                  <p className="mt-2 text-2xl font-headline tracking-tight text-on-surface">{m.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
              Next 7 days
            </p>
            <p className="text-lg font-headline tracking-tight">
              Keep it simple. Keep it daily.
            </p>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Cleanse → moisturize → sunscreen. Night: cleanse → barrier repair.
            </p>
          </div>
        </div>

        <div className="col-span-5 flex flex-col justify-between">
          <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
              Snapshot
            </p>
            <div className="space-y-3 text-sm text-on-surface-variant">
              {[
                { k: "Clarity", v: "7.8" },
                { k: "Barrier", v: "6.4" },
                { k: "Inflammation", v: "4.9" },
              ].map((m) => (
                <div key={m.k} className="flex items-center justify-between gap-4">
                  <span>{m.k}</span>
                  <span className="text-on-surface font-headline tracking-tight">{m.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
              Reviewed by
            </p>
            <p className="text-sm text-on-surface">dr. Riris Asti Respati, SpDVE</p>
            <p className="mt-4 text-xs text-on-surface/45">
              No clinical photos included in previews.
            </p>
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

export default function ShareVariantC() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Share variants • C
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Option C: report artifact (minimal)
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Feels personal and non-promotional. Clinician is credited in small text.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-variants">
              Back to variants
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <Frame>
            <CardC />
          </Frame>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

