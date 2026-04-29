import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { OgFrame } from "../_frame";

function CardA() {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 bg-surface-container-lowest shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)] relative">
      <Image
        src="/og/share-thumb-concept-a.jpg"
        alt="Seren share card (aura)"
        fill
        priority
        className="object-cover"
        sizes="1200px"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(0,0,0,0.0),rgba(0,0,0,0.22)_55%,rgba(0,0,0,0.35)_88%)]" />

      <div className="absolute inset-x-0 bottom-0 p-10">
        <div className="max-w-[66ch]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">Seren</p>
          <h2 className="mt-3 text-5xl font-headline tracking-tight leading-[1.0] text-white">
            My day & night skin plan
          </h2>
          <p className="mt-4 text-base text-white/80 leading-relaxed">
            Dermatologist-reviewed routine that’s actually doable.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3">
          {[
            { k: "Day", v: "3 steps" },
            { k: "Night", v: "3 steps" },
            { k: "Focus", v: "Barrier-first" },
          ].map((pill) => (
            <div
              key={pill.k}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/15 px-4 py-2 text-xs text-white/85"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/70">{pill.k}</span>
              <span className="font-headline tracking-tight">{pill.v}</span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <p className="text-xs text-white/65">seren.id</p>
          <div className="rounded-full bg-white text-on-surface px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] font-headline">
            View plan
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareCardV2A() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Share card V2 • A
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">Aura hero (clean)</h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Full-bleed aura with minimal overlay. Designed to stay readable even in compressed link previews.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-card-v2">
              Back to V2 index
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <OgFrame>
            <CardA />
          </OgFrame>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

