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
        Dark premium canvas + gold accent + metric bars—reads as “I’m doing something right” in a
        feed. Still abstract / no portraits.
      </p>
    </div>
  );
}

function CardB() {
  return (
    <div className="w-full h-full rounded-[24px] overflow-hidden shadow-[0_40px_100px_-28px_rgba(48,87,103,0.5)] ring-2 ring-primary/20 relative bg-gradient-to-br from-[#1a2e36] via-[#243d47] to-[#0f1c22]">
      <div className="absolute -top-20 right-0 size-[340px] rounded-full bg-primary/35 blur-3xl" />
      <div className="absolute bottom-0 left-0 size-[400px] rounded-full bg-[#c9a227]/12 blur-3xl" />

      <div className="relative h-full p-10 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a8d4e8]">
              Seren · dermatologist-reviewed
            </p>
            <p className="mt-4 text-5xl sm:text-6xl font-headline tracking-[-0.03em] leading-[0.95]">
              Your routine,
              <br />
              <span className="italic font-light text-[#ffe08a]">unlocked.</span>
            </p>
            <p className="mt-5 text-base leading-relaxed max-w-[62ch] text-white/85">
              Seven days you can brag about—clarity without oversharing. No clinical photos in
              previews.
            </p>
          </div>
          <span className="rounded-full bg-white/15 border border-white/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white shrink-0 backdrop-blur-sm">
            Signed
          </span>
        </div>

        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-7 rounded-[1.75rem] bg-white/10 backdrop-blur-md border border-white/15 p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 mb-3">
              Next 7 days
            </p>
            <p className="text-xl font-headline tracking-tight">Barrier-first + sunscreen daily.</p>
            <p className="mt-2 text-sm text-white/75 leading-relaxed">
              One new active, slowly—once skin is calm.
            </p>
          </div>

          <div className="col-span-5 rounded-[1.75rem] bg-white text-on-surface p-6 shadow-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-3">
              Snapshot
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { k: "Clarity", v: "7.8", bar: 88 },
                { k: "Barrier", v: "6.4", bar: 72 },
                { k: "Calm", v: "4.9", bar: 55 },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-2xl bg-gradient-to-b from-surface-container-lowest to-white border-2 border-primary/10 p-4"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-on-surface/45">
                    {m.k}
                  </p>
                  <p className="mt-2 text-2xl font-headline tracking-tight text-primary">{m.v}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-outline-variant/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-[#c9a227]"
                      style={{ width: `${m.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-6">
          <p className="text-xs font-mono font-semibold text-[#a8d4e8]">SRN-8821</p>
          <div className="rounded-full btn-gradient text-on-primary px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
            Share snapshot
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

