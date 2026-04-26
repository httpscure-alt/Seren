import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SEREN_MARKETING_PAGE_SKY } from "@/components/SerenHeroVisual";

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

/**
 * Pre-intake welcome: dermatologist introduction, then digital intake.
 */
export async function ConsultWelcomeScreen() {
  const { dict } = await getDictionary();
  const items = [
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

  return (
    <div
      className="min-h-screen overflow-x-hidden text-on-surface"
      style={{ background: SEREN_MARKETING_PAGE_SKY }}
    >
      <SiteNavbar />

      <main className="pt-24 sm:pt-28">
        <section className="seren-container seren-section">
          <div className="grid grid-cols-12 gap-10 lg:gap-14 items-start lg:items-center">
            <div className="col-span-12 lg:col-span-6 min-w-0">
              <h1 className="font-headline tracking-[-0.03em] leading-[0.98] text-5xl sm:text-6xl lg:text-[4.1rem] text-on-surface">
                your skin journey
                <br />
                begins here
              </h1>
              <p className="mt-6 text-on-surface-variant leading-[1.7] max-w-xl text-[0.95rem]">
                a personalized clinical assessment designed to understand your unique dermal profile.
              </p>

              <div className="mt-10 space-y-6 max-w-xl">
                {items.map((it) => (
                  <div key={it.title} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-surface-container-lowest border border-outline-variant/12 shadow-sm grid place-items-center text-primary">
                      {it.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline text-sm tracking-tight text-on-surface">{it.title}</p>
                      <p className="text-xs text-on-surface/55 leading-relaxed mt-1">{it.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  href="/consult/intake"
                  className="inline-flex h-12 items-center justify-center rounded-full px-10 text-sm font-medium tracking-wide btn-gradient text-on-primary shadow-[0_18px_50px_-35px_rgba(61,99,116,0.45)] hover:brightness-[1.03] transition"
                >
                  {dict.landing.ctaStart}
                </Link>
                <p className="mt-4 text-[11px] text-on-surface/45">
                  by continuing you agree to our{" "}
                  <a
                    className="underline underline-offset-[5px] decoration-on-surface/20 hover:text-primary"
                    href="/privacy"
                  >
                    privacy policy
                  </a>{" "}
                  and{" "}
                  <a
                    className="underline underline-offset-[5px] decoration-on-surface/20 hover:text-primary"
                    href="/terms"
                  >
                    terms
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 min-w-0 lg:pr-8">
              <div className="mx-auto flex w-full max-w-md flex-col gap-8 lg:max-w-lg lg:ml-auto">
                <div className="rounded-2xl border border-outline-variant/15 bg-surface/90 px-5 py-5 sm:px-6 sm:py-6 shadow-[0_20px_50px_-28px_rgba(47,51,48,0.3)] backdrop-blur-md">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="relative h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-outline-variant/12 bg-surface-container-lowest shadow-sm">
                      <Image
                        src="/doctors/dr-riris.png"
                        alt="Dr. Riris Asti Respati, Sp.DVE"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 72px, 80px"
                        priority
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                        dermatologist-reviewed
                      </p>
                      <p className="font-headline text-[0.95rem] sm:text-base leading-snug tracking-tight text-on-surface mt-1.5">
                        Dr. Riris Asti Respati, Sp.DVE
                      </p>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                        An unhurried read of what you share—so what comes next can feel like it fits you, not a
                        template.
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-xs italic leading-relaxed text-on-surface-variant/90 border-t border-outline-variant/10 pt-5">
                    “Skin shifts from week to week. This short step is just us getting to know where you are
                    today—gently, with room to breathe.”
                  </p>
                </div>

                <div
                  className="relative w-full overflow-hidden rounded-2xl border border-outline-variant/12 shadow-[0_28px_80px_-40px_rgba(47,51,48,0.28)]"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image
                    src="/demo/welcome-cream-swatch.png"
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
