import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="seren-card p-8 sm:p-10">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-6">
        OG preview frame (mock)
      </p>
      <div className="w-full aspect-[1200/630] max-w-[1200px] mx-auto">{children}</div>
      <p className="mt-6 text-xs text-on-surface/45 leading-relaxed">
        “Polaroid” without vulnerability — uses abstract texture instead of a face.
      </p>
    </div>
  );
}

function readParam(
  value: string | string[] | undefined,
  fallback?: string,
): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return fallback;
}

function PolaroidCard({
  includePhoto,
  photoUrl,
}: {
  includePhoto: boolean;
  photoUrl?: string;
}) {
  return (
    <div className="w-full h-full rounded-[28px] overflow-hidden border border-outline-variant/10 shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)] bg-surface-container-lowest relative">
      {/* Brand-tinted blobs (Seren) */}
      <div className="absolute -top-24 -left-24 size-[420px] rounded-full bg-primary/18 blur-3xl" />
      <div className="absolute -top-28 -right-24 size-[440px] rounded-full bg-tertiary-container/55 blur-3xl" />
      <div className="absolute -bottom-28 left-[25%] size-[520px] rounded-full bg-secondary-container/55 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(to_right,rgba(47,51,48,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,51,48,0.22)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative h-full p-10 grid grid-cols-12 gap-8">
        <div className="col-span-7 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/55">Seren</p>
            <p className="mt-5 text-5xl font-headline tracking-tight leading-[0.95]">
              My routine is finally
              <br />
              consistent.
            </p>
            <p className="mt-4 text-base text-on-surface-variant leading-relaxed max-w-[52ch]">
              7 days of a calm routine — simple steps, derm reviewed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
              Routine plan
            </span>
            <span className="rounded-full bg-surface border border-outline-variant/10 text-on-surface/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
              Sensitive‑safe
            </span>
            <span className="rounded-full bg-surface border border-outline-variant/10 text-on-surface/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
              5 minutes
            </span>
          </div>
        </div>

        <div className="col-span-5 flex flex-col justify-between">
          <div className="rounded-[2rem] bg-surface/70 backdrop-blur border border-outline-variant/12 p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
              Polaroid
            </p>
            <div className="rounded-[1.75rem] bg-surface border border-outline-variant/12 p-5">
              <div className="rounded-[1.25rem] overflow-hidden border border-outline-variant/12 bg-surface-container-lowest relative aspect-[1/1]">
                {includePhoto && photoUrl ? (
                  <>
                    <div
                      className="absolute inset-0 bg-center bg-cover scale-[1.15]"
                      style={{ backgroundImage: `url("${photoUrl}")` }}
                    />
                    <div className="absolute inset-0 bg-surface/10" />
                    <div className="absolute inset-0 [filter:blur(10px)] opacity-80" />
                    <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.66),transparent_56%)]" />
                  </>
                ) : (
                  <>
                    <div className="absolute -top-16 -left-16 size-[320px] rounded-full bg-primary/22 blur-3xl" />
                    <div className="absolute -top-20 -right-16 size-[340px] rounded-full bg-tertiary-container/65 blur-3xl" />
                    <div className="absolute -bottom-24 left-[15%] size-[380px] rounded-full bg-secondary-container/65 blur-3xl" />
                  </>
                )}
                <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#2f3330_0.55px,transparent_0.55px)] [background-size:16px_16px]" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="rounded-2xl bg-surface/75 backdrop-blur border border-outline-variant/12 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                      SRN‑8821 • Week 1
                    </p>
                    <p className="mt-1 text-sm font-headline tracking-tight">Barrier first</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-xs text-on-surface/55">— Seren</p>
                <span className="text-xs text-on-surface/45">
                  {includePhoto ? "Photo included (opt‑in)" : "No photos shared"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-on-surface/45">seren.skin</p>
            <div className="rounded-full bg-surface border border-outline-variant/12 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface/70">
              See routine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareFunE({ searchParams }: PageProps) {
  const paramPhoto = readParam(searchParams?.photo);
  const photoUrl = paramPhoto ?? "/demo/clinical-board-example.png";
  const includePhoto = !!photoUrl;
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Fun share • E
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Option E: abstract polaroid
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            The “personal” look of a polaroid, but with abstract art so it’s safe to post.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/share-fun">
              Back to fun variants
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <Frame>
            <PolaroidCard includePhoto={includePhoto} photoUrl={photoUrl} />
          </Frame>
          <div className="mt-6 text-sm text-on-surface-variant max-w-3xl">
            Demo: this page uses an example portrait by default. You can override via{" "}
            <span className="font-mono text-on-surface">?photo=</span>
            <span className="font-mono text-on-surface">https://…</span>.
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

