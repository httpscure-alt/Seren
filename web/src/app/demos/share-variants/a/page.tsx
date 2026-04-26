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
        This approximates what WhatsApp/iMessage/X would render from <code>og:image</code>.
      </p>
    </div>
  );
}

function CardA() {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 bg-surface-container-lowest shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)]">
      <div className="h-full grid grid-cols-12">
        <div className="col-span-5 p-8 border-r border-outline-variant/10 bg-[radial-gradient(circle_at_20%_20%,rgba(190,242,220,0.65),transparent_55%),radial-gradient(circle_at_80%_25%,rgba(211,226,247,0.75),transparent_60%),radial-gradient(circle_at_55%_80%,rgba(248,215,223,0.55),transparent_60%)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/55">
            My Seren skin plan
          </p>
          <p className="mt-4 text-4xl font-headline tracking-tight leading-[1.0]">
            Barrier-first.
            <br />
            Then one active.
          </p>
          <p className="mt-5 text-sm text-on-surface-variant leading-relaxed max-w-[42ch]">
            Dermatologist-reviewed routine built for consistency (not perfection).
          </p>
          <div className="mt-7 inline-flex rounded-full bg-surface/70 backdrop-blur border border-outline-variant/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-on-surface/70">
            Next 7 days
          </div>
        </div>

        <div className="col-span-7 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                  Skin report preview
                </p>
                <p className="mt-3 text-3xl font-headline tracking-tight">
                  Clarity + calm routine
                </p>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed max-w-[56ch]">
                  AM: cleanse • moisturize • sunscreen. PM: cleanse • barrier repair.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] shrink-0">
                Reviewed
              </span>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-4">
              {[
                { k: "Clarity", v: "7.8" },
                { k: "Barrier", v: "6.4" },
                { k: "Inflamm.", v: "4.9" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 p-5 text-center"
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{m.k}</p>
                  <p className="mt-2 text-2xl font-headline tracking-tight text-on-surface">{m.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
                Next step
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Introduce azelaic acid slowly once irritation is calm.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-7">
            <p className="text-xs text-on-surface/45">Seren • SRN-8821</p>
            <div className="rounded-full bg-surface border border-outline-variant/12 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface/70">
              View report
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareVariantA() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Share variants • A
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Option A: “My skin plan” (no faces)
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Personal outcome + next steps. Clinician credit stays subtle.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-variants">
              Back to variants
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <Frame>
            <CardA />
          </Frame>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

