import Link from "next/link";
import Image from "next/image";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/db";
import { ShareActions } from "./share-actions";
import type { Metadata } from "next";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const publicId = String(id).toUpperCase();
  const title = `My Seren skin plan • ${publicId}`;
  const description =
    "Dermatologist-reviewed routine preview. Want yours? Take the 2-minute intake and get a plan you can follow.";
  // Stable thumbnail: matches the agreed share-card screenshot exactly.
  // Later we'll replace this with a dynamic per-patient OG image generator.
  const ogImage = `/og/share-card-template.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Seren share card ${publicId}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ShareReportPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();

  // Privacy-safe share page: no patient name, no diagnosis details, no clinical photos.
  const caseData = await prisma.case.findFirst({
    where: { publicId },
    select: { publicId: true, report: { select: { publishedAt: true } } },
  });
  const statusLabel = caseData?.report?.publishedAt ? "Signed" : "Preview";

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Share</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Share skin report
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Safe by default: no clinical photos and no private medical details in share previews.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <section className="col-span-12 lg:col-span-8">
            <div className="rounded-[2.5rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/10 shadow-[0_22px_70px_-42px_rgba(47,51,48,0.22)]">
              <div className="p-7 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Share preview</p>
                <p className="mt-3 text-2xl font-headline tracking-tight">Seren skin report</p>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  Dermatologist-reviewed routine. Built for consistency.
                </p>
              </div>

              <div className="px-7 sm:px-8 pb-7 sm:pb-8">
                <div className="rounded-[2rem] bg-surface border border-outline-variant/12 overflow-hidden">
                  <div className="grid grid-cols-12 gap-0">
                    <div className="col-span-5 relative min-h-[190px]">
                      <Image
                        src="/doctors/dr-riris.png"
                        alt="Reviewing dermatologist"
                        fill
                        sizes="240px"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.32))]" />
                      <div className="absolute left-4 bottom-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/80">
                          Reviewing dermatologist
                        </p>
                        <p className="text-sm text-white font-headline tracking-tight">
                          Dr. Riris Asti Respati, SpDVE
                        </p>
                      </div>
                    </div>

                    <div className="col-span-7 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs text-on-surface/60">Report</p>
                          <p className="text-lg font-headline tracking-tight truncate">
                            {caseData ? "Dermatologist-reviewed routine" : "Report preview"}
                          </p>
                        </div>
                        <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] shrink-0">
                          {statusLabel}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {[
                          { k: "Clarity", v: "7.8" },
                          { k: "Barrier", v: "6.4" },
                          { k: "Inflamm.", v: "4.9" },
                        ].map((m) => (
                          <div
                            key={m.k}
                            className="rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 p-4 text-center"
                          >
                            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{m.k}</p>
                            <p className="mt-2 text-xl font-headline tracking-tight text-on-surface">{m.v}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
                          Next 7 days
                        </p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          Barrier-first routine, then introduce one active slowly.
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <p className="text-xs text-on-surface/45">Seren • {publicId}</p>
                        <Link
                          href={`/report/${publicId.toLowerCase()}`}
                          className="btn-gradient text-on-primary px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-headline shadow-sm"
                        >
                          View report
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-on-surface/45 leading-relaxed">
                  Safe by default: no patient name, no diagnosis details, and no clinical photos are included in share previews.
                </p>
              </div>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <ShareActions publicId={publicId} />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

