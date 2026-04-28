import Link from "next/link";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";

type Params = { id: string };

export default async function ShareReportPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const publicId = String(id).toUpperCase();

  // Privacy-safe share page: no PHI, no diagnosis details, no photos.
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Share</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Share your Seren card
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            This link is designed to be safe by default (no clinical photos, no private medical details).
          </p>
        </header>

        <section className="mt-12 grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-[2.5rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/10 shadow-[0_22px_70px_-42px_rgba(47,51,48,0.22)]">
              <div className="p-7 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Seren</p>
                <p className="mt-3 text-2xl font-headline tracking-tight">Clinical skin report</p>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  A dermatologist-reviewed routine you can actually follow.
                </p>
              </div>

              <div className="px-7 sm:px-8 pb-7 sm:pb-8">
                <div className="rounded-[2rem] bg-surface border border-outline-variant/12 overflow-hidden p-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-xs text-on-surface/60">Report ID</p>
                      <p className="text-lg font-headline tracking-tight">{publicId}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
                      Share card
                    </span>
                  </div>
                  <p className="mt-5 text-sm text-on-surface-variant leading-relaxed">
                    Want the full report? Sign in to Seren to view it securely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
              <p className="font-headline tracking-tight text-base">Share options</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                Copy the link from your browser address bar, or open your report and use the Share button.
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  href={`/report/${publicId.toLowerCase()}`}
                  className="w-full inline-flex items-center justify-center btn-gradient text-on-primary px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-headline shadow-sm"
                >
                  Open report (requires login)
                </Link>
                <Link
                  href="/results"
                  className="w-full inline-flex items-center justify-center rounded-full border border-outline-variant/25 px-6 py-3 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

