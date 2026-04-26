import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SiteFooter } from "@/components/SiteFooter";

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 7v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M8.8 7.2 10 5.5h4l1.2 1.7H18a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9.2a2 2 0 0 1 2-2h2.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 17a3.2 3.2 0 1 0-3.2-3.2A3.2 3.2 0 0 0 12 17Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 12.2l1.8 1.8 3.8-3.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEPS = [
  {
    title: "takes 2–3 minutes",
    desc: "a brief questionnaire about your lifestyle and skin goals.",
    icon: <IconClock />,
  },
  {
    title: "prepare clear photos",
    desc: "high-resolution images ensure precision in our analysis.",
    icon: <IconCamera />,
  },
  {
    title: "reviewed by dermatologist",
    desc: "every plan is validated by clinical professionals.",
    icon: <IconShield />,
  },
] as const;

/** Terracotta field behind cream art (mock panel). */
const CREAM_PANEL_BG = "#c66b52";

/**
 * Pre-intake welcome — matches product mock: checklist left, overlapping clinical + cream cards right.
 */
export function ConsultWelcomeScreen() {
  return (
    <div className="min-h-screen bg-[#f2f1ee] text-on-surface overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-outline-variant/10 bg-[#f2f1ee]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <BrandMark href="/" className="lowercase text-lg" />
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium lowercase tracking-wide text-on-primary shadow-sm transition hover:brightness-95"
          >
            exit
          </Link>
        </div>
      </header>

      <main className="pt-24 sm:pt-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-5 pb-24 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:items-center lg:pb-32">
          <div className="min-w-0">
            <h1 className="font-headline text-[2.25rem] font-medium leading-[1.05] tracking-[-0.03em] text-on-surface sm:text-5xl lg:text-[3.25rem] lowercase">
              your skin journey
              <br />
              begins here
            </h1>
            <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-on-surface-variant lowercase sm:text-base">
              a personalized clinical assessment designed to understand your unique dermal profile.
            </p>

            <div className="mt-10 space-y-6 max-w-lg">
              {STEPS.map((it) => (
                <div key={it.title} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/15 bg-primary/10 text-primary shadow-sm">
                    {it.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline text-sm tracking-tight text-on-surface lowercase">{it.title}</p>
                    <p className="mt-1 text-xs lowercase leading-relaxed text-on-surface/60">{it.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/consult/intake"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-10 text-sm font-medium lowercase tracking-wide text-on-primary shadow-[0_18px_40px_-28px_rgba(61,99,116,0.55)] transition hover:brightness-[1.03]"
              >
                begin assessment
              </Link>
              <p className="mt-4 max-w-lg text-[11px] lowercase leading-relaxed text-on-surface/45">
                by continuing, you agree to our{" "}
                <a className="underline underline-offset-[4px] decoration-on-surface/25 hover:text-primary" href="/privacy">
                  privacy policy
                </a>{" "}
                and{" "}
                <a className="underline underline-offset-[4px] decoration-on-surface/25 hover:text-primary" href="/terms">
                  terms
                </a>
                .
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[400px] lg:mx-0 lg:ml-auto lg:max-w-[420px]">
            <div className="relative z-20 mx-auto w-full max-w-[340px] rounded-2xl border border-outline-variant/12 bg-white p-5 shadow-[0_24px_60px_-32px_rgba(47,51,48,0.35)] sm:p-6">
              <div className="flex gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-outline-variant/10 bg-surface-container-lowest">
                  <Image
                    src="/doctors/dr-riris.png"
                    alt="dr. riris asti respati, sp.dve"
                    fill
                    className="object-cover object-top"
                    sizes="56px"
                    priority
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">clinical lead</p>
                  <p className="mt-1.5 font-headline text-base font-semibold lowercase leading-snug tracking-tight text-on-surface">
                    dr. riris asti respati, sp.dve
                  </p>
                </div>
              </div>
              <p className="mt-4 border-t border-outline-variant/10 pt-4 text-xs italic leading-relaxed text-on-surface-variant lowercase">
                “we treat skin as a living ecosystem. this assessment is the first step in restoring your natural
                balance.”
              </p>
            </div>

            <div
              className="relative z-10 -mt-8 w-full overflow-hidden rounded-[1.75rem] shadow-[0_32px_80px_-40px_rgba(47,51,48,0.45)] sm:-mt-10 sm:rounded-[2rem]"
              style={{ aspectRatio: "4 / 5", backgroundColor: CREAM_PANEL_BG }}
            >
              <Image
                src="/demo/welcome-cream-swatch.png"
                alt=""
                fill
                className="object-contain object-center p-4 sm:p-6"
                sizes="(max-width: 1024px) 100vw, 420px"
              />

              <div
                className="pointer-events-none absolute right-3 top-3 z-[2] w-[5.5rem] rounded-xl bg-primary px-2 py-2.5 text-center text-on-primary shadow-lg sm:right-4 sm:top-4 sm:w-[6.25rem]"
                style={{ transform: "rotate(-6deg)" }}
              >
                <p className="font-headline text-xl font-bold leading-none">98%</p>
                <p className="mt-1.5 text-[7px] font-semibold uppercase leading-tight tracking-tight opacity-95">
                  accuracy in
                  <br />
                  skin typing
                </p>
              </div>

              <div className="absolute inset-x-4 bottom-4 z-[2] flex justify-center sm:inset-x-6 sm:bottom-5">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/25 px-4 py-2.5 shadow-sm backdrop-blur-md sm:gap-3 sm:px-5">
                  <span className="text-sm leading-none text-primary" aria-hidden="true">
                    ★
                  </span>
                  <span className="text-xs font-medium lowercase tracking-wide text-on-surface">
                    clinical grade methodology
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
