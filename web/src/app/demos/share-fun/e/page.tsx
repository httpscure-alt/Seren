import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="seren-card p-8 sm:p-10">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-6">
        OG preview frame (mock)
      </p>
      <div className="w-full aspect-[1200/630] max-w-[1200px] mx-auto">{children}</div>
      <p className="mt-6 text-sm text-on-surface-variant leading-relaxed">
        Dark “aurora” canvas so the card pops in feeds; polaroid stays bright. Abstract or opt-in
        texture only—no faces by default.
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
    <div className="w-full h-full rounded-[24px] overflow-hidden ring-2 ring-primary/20 shadow-[0_40px_100px_-30px_rgba(48,87,103,0.55)] bg-[#0f1c22] relative">
      {/* Saturated aurora — reads as “premium” not “clinical beige” */}
      <div className="absolute -top-32 -left-32 size-[480px] rounded-full bg-primary/45 blur-3xl" />
      <div className="absolute -top-20 right-0 size-[400px] rounded-full bg-[#7fb8d4]/35 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 size-[560px] rounded-full bg-[#e8c547]/22 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c22] via-transparent to-transparent opacity-90" />

      <div className="relative h-full p-10 grid grid-cols-12 gap-8 text-white">
        <div className="col-span-7 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a8d4e8]">Seren</p>
            <p className="mt-5 text-5xl sm:text-6xl font-headline tracking-[-0.03em] leading-[0.95]">
              My routine is finally{" "}
              <span className="italic font-light text-[#ffe08a]">consistent.</span>
            </p>
            <p className="mt-5 text-base leading-relaxed max-w-[52ch] text-white/85">
              7 days in — simple steps, derm-reviewed. The kind of win people{" "}
              <span className="font-semibold text-white">actually post.</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 border border-white/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              Real plan
            </span>
            <span className="rounded-full bg-[#305767]/80 border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-on-primary">
              Sensitive-safe
            </span>
            <span className="rounded-full bg-[#c9a227]/25 border border-[#e8c547]/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffe9a8]">
              ~5 min / day
            </span>
          </div>
        </div>

        <div className="col-span-5 flex flex-col justify-between">
          <div className="rounded-[1.75rem] bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 mb-4">
              Polaroid moment
            </p>
            <div className="rounded-[1.35rem] bg-white p-4 shadow-2xl shadow-black/25">
              <div className="rounded-[1rem] overflow-hidden border-[3px] border-primary/20 bg-[#eef4f6] relative aspect-[1/1]">
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
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dim px-4 py-3 text-on-primary shadow-lg">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-on-primary/85">
                      SRN‑8821 · Week 1
                    </p>
                    <p className="mt-1 text-base font-headline tracking-tight">Barrier first</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-primary">— Seren</p>
                <span className="text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                  {includePhoto ? "Opt-in texture" : "Abstract only"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-white/70">seren.skin</p>
            <div className="rounded-full btn-gradient text-on-primary px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
              Brag (share)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ShareFunE({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const paramPhoto = readParam(resolvedParams?.photo);
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

