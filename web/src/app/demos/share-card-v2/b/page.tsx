import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { OgFrame } from "../_frame";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{label}</p>
      <p className="mt-2 text-2xl font-headline tracking-tight text-on-surface">{value}</p>
    </div>
  );
}

function CardB() {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 bg-surface-container-lowest shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)]">
      <div className="h-full grid grid-cols-12">
        <div className="col-span-5 p-7 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">Share card</p>
          <p className="mt-4 text-3xl font-headline tracking-tight leading-[1.05]">
            My Seren
            <br />
            skin plan
          </p>
          <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
            Aura-only. Private by default.
          </p>

          <div className="mt-6 rounded-2xl overflow-hidden border border-outline-variant/10 bg-surface">
            <div className="relative w-full aspect-[1200/630]">
              <Image
                src="/og/share-thumb-concept-a.jpg"
                alt="Seren aura card"
                fill
                className="object-cover"
                sizes="520px"
                priority
              />
            </div>
          </div>

          <div className="mt-auto pt-6 flex items-center justify-between">
            <p className="text-xs text-on-surface/45">seren.id</p>
            <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
              Reviewed
            </span>
          </div>
        </div>

        <div className="col-span-7 p-8 flex flex-col justify-between bg-[radial-gradient(circle_at_20%_20%,rgba(190,242,220,0.28),transparent_55%),radial-gradient(circle_at_90%_25%,rgba(211,226,247,0.35),transparent_60%),radial-gradient(circle_at_55%_85%,rgba(248,215,223,0.28),transparent_60%)]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">Plan preview</p>
            <p className="mt-3 text-4xl font-headline tracking-tight leading-[1.0]">
              Day & night routine
            </p>
            <p className="mt-4 text-sm text-on-surface-variant leading-relaxed max-w-[58ch]">
              Simple steps you’ll actually repeat. Start barrier-first, then introduce one active slowly.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-4">
              <Stat label="Severity" value="Severe" />
              <Stat label="Day" value="3 steps" />
              <Stat label="Night" value="3 steps" />
            </div>

            <div className="mt-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Next 7 days</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                Patch test new products for 24h before full use.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-7">
            <p className="text-xs text-on-surface/45">Seren • SRN-7691</p>
            <div className="rounded-full bg-primary text-on-primary px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] font-headline shadow-sm">
              View plan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareCardV2B() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Share card V2 • B
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">Aura + stats strip</h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Keeps the aura card but adds simple stats for credibility—without turning into a dense report screenshot.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-card-v2">
              Back to V2 index
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <OgFrame>
            <CardB />
          </OgFrame>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

