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
        Abstract background. No people. Very shareable.
      </p>
    </div>
  );
}

function CardB() {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)] bg-surface-container-lowest relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_25%,rgba(211,226,247,0.85),transparent_55%),radial-gradient(circle_at_85%_20%,rgba(249,232,179,0.75),transparent_55%),radial-gradient(circle_at_55%_78%,rgba(205,232,218,0.78),transparent_60%),radial-gradient(circle_at_35%_80%,rgba(248,215,223,0.68),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#2f3330_0.55px,transparent_0.55px)] [background-size:14px_14px]" />

      <div className="relative h-full p-10 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/55">
              Seren • dermatologist-reviewed
            </p>
            <p className="mt-4 text-5xl font-headline tracking-tight leading-[0.95]">
              Your routine,
              <br />
              simplified.
            </p>
            <p className="mt-5 text-base text-on-surface-variant leading-relaxed max-w-[62ch]">
              A calm plan for the next 7 days. No clinical photos included in share previews.
            </p>
          </div>
          <span className="rounded-full bg-surface/70 backdrop-blur border border-outline-variant/15 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-on-surface/70 shrink-0">
            Signed report
          </span>
        </div>

        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-7 rounded-[2rem] bg-surface/70 backdrop-blur border border-outline-variant/12 p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
              Next 7 days
            </p>
            <p className="text-lg font-headline tracking-tight">Barrier-first + sunscreen daily.</p>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Introduce one active slowly once irritation is calm.
            </p>
          </div>

          <div className="col-span-5 rounded-[2rem] bg-surface/70 backdrop-blur border border-outline-variant/12 p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
              Snapshot
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { k: "Clarity", v: "7.8" },
                { k: "Barrier", v: "6.4" },
                { k: "Inflamm.", v: "4.9" },
              ].map((m) => (
                <div key={m.k} className="rounded-2xl bg-surface border border-outline-variant/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{m.k}</p>
                  <p className="mt-2 text-xl font-headline tracking-tight text-on-surface">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-6">
          <p className="text-xs text-on-surface/45">SRN-8821</p>
          <div className="rounded-full bg-surface border border-outline-variant/12 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface/70">
            View report
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareVariantB() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Share variants • B
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Option B: abstract gradient (brand-safe)
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            No portraits. Looks premium and neutral when shared.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-variants">
              Back to variants
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <Frame>
            <CardB />
          </Frame>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

