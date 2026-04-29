import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { OgFrame } from "../_frame";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-outline-variant/10">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">{k}</p>
      <p className="text-sm font-headline tracking-tight text-on-surface text-right">{v}</p>
    </div>
  );
}

function CardC() {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 bg-surface-container-lowest shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)]">
      <div className="h-full grid grid-cols-12">
        <div className="col-span-4 p-8 bg-[radial-gradient(circle_at_30%_20%,rgba(190,242,220,0.55),transparent_55%),radial-gradient(circle_at_85%_35%,rgba(211,226,247,0.62),transparent_60%),radial-gradient(circle_at_45%_85%,rgba(248,215,223,0.45),transparent_60%)] border-r border-outline-variant/10 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/55">Seren</p>
            <p className="mt-4 text-4xl font-headline tracking-tight leading-[1.0]">
              Skin plan
              <br />
              receipt
            </p>
            <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
              A clinical-looking artifact that’s still private enough to share.
            </p>
          </div>

          <div className="rounded-2xl bg-surface/75 backdrop-blur border border-outline-variant/15 p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/55">Privacy</p>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Aura-only. No face. No diagnosis.
            </p>
          </div>
        </div>

        <div className="col-span-8 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">Plan preview</p>
                <p className="mt-3 text-4xl font-headline tracking-tight leading-[1.0]">Day & night routine</p>
              </div>
              <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] shrink-0">
                Signed
              </span>
            </div>

            <div className="mt-7 rounded-2xl bg-surface border border-outline-variant/10 px-6">
              <Row k="Case" v="SRN-7691" />
              <Row k="Severity" v="Severe" />
              <Row k="Day" v="3 steps" />
              <Row k="Night" v="3 steps" />
              <div className="py-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">Next step</p>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  Patch test new products for 24h before full use.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-7">
            <p className="text-xs text-on-surface/45">seren.id</p>
            <div className="rounded-full bg-primary text-on-primary px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] font-headline shadow-sm">
              View plan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareCardV2C() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Share card V2 • C
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">Timeline receipt</h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Minimal “receipt” that reads clinical and trustworthy in previews, without the current broken composition.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-card-v2">
              Back to V2 index
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <OgFrame>
            <CardC />
          </OgFrame>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

