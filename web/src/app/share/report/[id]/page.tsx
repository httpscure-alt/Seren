import Link from "next/link";
import Image from "next/image";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/db";
import { ShareActions } from "./share-actions";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

/** Never serve stale OG tags when chat apps fetch this page. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { id: string };

function absoluteSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://seren.id";
  return raw.replace(/\/$/, "");
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const publicId = String(id).toUpperCase();
  const title = `My Seren skin plan • ${publicId}`;
  const description =
    "Dermatologist-reviewed Day/Night routine preview. Want yours? Take the 2-minute intake and get a plan you can follow.";
  const origin = absoluteSiteUrl();
  /** Must match a file that actually ships in `web/public/og/` (committed so deploys don’t 404). */
  const ogImageUrl = `${origin}/og/share-thumb-concept-a.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${origin}/share/report/${String(id).toLowerCase()}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `Seren share card ${publicId}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ShareReportPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();

  const session = await getServerSession(authOptions);
  const role = (session as any)?.role as ("USER" | "PHYSICIAN" | "ADMIN") | undefined;
  const viewerKind: "anon" | "user" | "staff" =
    !session?.user?.email ? "anon" : role === "PHYSICIAN" || role === "ADMIN" ? "staff" : "user";

  const caseData = await prisma.case.findFirst({
    where: { publicId },
    select: {
      publicId: true,
      uploads: { select: { kind: true, url: true, createdAt: true } },
      report: { select: { publishedAt: true, contentJson: true } },
    },
  });
  const statusLabel = caseData?.report?.publishedAt ? "Signed" : "Preview";
  const primaryUpload =
    (caseData?.uploads ?? []).find((u) => String(u.kind).toLowerCase() === "primary") ??
    (caseData?.uploads ?? [])[0] ??
    null;
  // This page is intentionally shareable: show the branded aura card (not a face) in the on-page preview too.
  const heroImageSrc = "/og/share-thumb-concept-a.jpg";
  const content = (caseData?.report?.contentJson as any) || {};
  const aiDraft = content.aiDraft || {};
  const structured = aiDraft.structured || null;

  const metricItems: Array<{ k: string; v: string }> = [
    { k: "Severity", v: String(aiDraft.severity || structured?.severity || "—") },
    { k: "Day steps", v: String(structured?.routine?.morning?.length ?? aiDraft.routine?.morning?.length ?? "—") },
    { k: "Night steps", v: String(structured?.routine?.evening?.length ?? aiDraft.routine?.evening?.length ?? "—") },
  ];
  const next7 = Array.isArray(structured?.next7Days) ? (structured.next7Days as string[]) : [];
  const next7Text = next7[0] || "Routine-first focus, then add one active slowly.";

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-clip flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl min-w-0">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Share</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">Share your skin plan</h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Made for sharing: no diagnosis details and no personal identity in this preview. Link preview image is a
            privacy-safe card (not your photo).
          </p>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          <section className="col-span-12 lg:col-span-8 min-w-0 max-w-full">
            <div className="rounded-[2.5rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/10 shadow-[0_22px_70px_-42px_rgba(47,51,48,0.22)]">
              <div className="p-7 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Share preview</p>
                <p className="mt-3 text-2xl font-headline tracking-tight">Seren skin plan</p>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  Dermatologist-reviewed Day/Night routine, simplified for daily consistency.
                </p>
              </div>

              <div className="px-7 sm:px-8 pb-7 sm:pb-8">
                <div className="rounded-[2rem] bg-surface border border-outline-variant/12 overflow-hidden">
                  <div className="grid grid-cols-12 gap-0">
                    <div className="col-span-12 sm:col-span-5 relative min-h-[220px] sm:min-h-[190px]">
                      <Image
                        src={heroImageSrc}
                        alt="Seren share card"
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.32))]" />
                      <div className="absolute left-4 bottom-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/80">
                          Privacy-safe preview
                        </p>
                        <p className="text-sm text-white font-headline tracking-tight">
                          No faces • No diagnosis
                        </p>
                      </div>
                    </div>

                    <div className="col-span-12 sm:col-span-7 p-5 sm:p-6 min-w-0">
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

                      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                        {metricItems.map((m) => (
                          <div
                            key={m.k}
                            className="rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 p-3 sm:p-4 text-center"
                          >
                            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{m.k}</p>
                            <p className="mt-2 text-lg sm:text-xl font-headline tracking-tight text-on-surface">{m.v}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">Next 7 days</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{next7Text}</p>
                      </div>

                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <p className="text-xs text-on-surface/45">Seren • {publicId}</p>
                        <Link
                          href={`/report/${publicId.toLowerCase()}`}
                          className="btn-gradient text-on-primary px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-headline shadow-sm w-full sm:w-auto text-center"
                        >
                          View report
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-on-surface/45 leading-relaxed">
                  Privacy-safe by design for link previews: OG image is a branded card (
                  <code className="text-[11px]">/og/share-thumb-concept-a.jpg</code>
                  ), not your intake photo.
                </p>
              </div>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-32 min-w-0 max-w-full">
            <ShareActions publicId={publicId} viewerKind={viewerKind} />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
