import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

function OgMockCard() {
  return (
    <div className="w-full overflow-hidden rounded-[28px] bg-surface-container-lowest border border-outline-variant/10 shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)]">
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-5 relative min-h-[315px]">
          <Image
            src="/doctors/dr-riris.png"
            alt="Reviewing dermatologist"
            fill
            sizes="420px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.52))]" />
          <div className="absolute left-6 bottom-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/80">
              Dermatologist-reviewed
            </p>
            <p className="mt-1 text-white text-xl font-headline tracking-tight">Seren skin report</p>
            <p className="mt-2 text-white/80 text-sm">
              dr. Riris Asti Respati, SpDVE
            </p>
          </div>
        </div>

        <div className="col-span-7 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                Report preview
              </p>
              <p className="mt-3 text-3xl font-headline tracking-tight text-on-surface">
                Barrier stress + congestion
              </p>
              <p className="mt-4 text-sm text-on-surface-variant leading-relaxed max-w-[52ch]">
                A clear routine built for consistency. No clinical photos included in previews.
              </p>
            </div>
            <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] shrink-0">
              Signed
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

          <div className="mt-7 flex items-center justify-between gap-4">
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

export default function SharePreviewDemoPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Demos</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Social share preview (mock)
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            This approximates what the shared link preview should feel like (OG image style:
            1200×630). In production, this would be generated dynamically for each report.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-report">
              Back to share page mock
            </Link>
          </p>
        </div>

        <section className="mt-12">
          <div className="seren-card p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-6">
              OG preview frame
            </p>
            <div className="w-full aspect-[1200/630] max-w-[1200px] mx-auto">
              <OgMockCard />
            </div>
            <p className="mt-6 text-xs text-on-surface/45 leading-relaxed max-w-[90ch]">
              When you paste the link into WhatsApp/iMessage/X, the platform reads OpenGraph tags
              (title/description/image) and renders a card like this.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

