import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SerenHeroVisual } from "@/components/SerenHeroVisual";

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
 * Pre-intake welcome: Dr. Riris + cream texture art, expectations, then digital intake.
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
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_35%_20%,rgba(61,99,116,0.08),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(246,217,166,0.12),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.92))] text-on-surface">
      <SiteNavbar />

      <main className="pt-24 sm:pt-28">
        <section className="seren-container seren-section">
          <div className="rounded-[1.75rem] p-px bg-gradient-to-br from-primary/35 via-surface-container to-amber-200/25 shadow-[0_28px_80px_-48px_rgba(61,99,116,0.3)]">
            <div className="rounded-[calc(1.75rem-1px)] bg-surface/92 backdrop-blur-md px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
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

                <div className="col-span-12 lg:col-span-6 min-w-0 pr-6 sm:pr-10 md:pr-14">
                  <div className="mx-auto flex w-full max-w-[360px] flex-col gap-8 lg:max-w-[380px] lg:ml-auto lg:mr-0">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="relative h-[5.5rem] w-[5.5rem] sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-[0_12px_40px_-24px_rgba(47,51,48,0.25)]">
                        <Image
                          src="/doctors/dr-riris.png"
                          alt="Dr. Riris — dermatologist"
                          fill
                          className="object-cover object-top"
                          sizes="96px"
                          priority
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                          your dermatologist
                        </p>
                        <p className="font-headline text-lg sm:text-xl tracking-tight text-on-surface">Dr. Riris</p>
                        <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                          Board-certified dermatologist reviewing your intake
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-outline-variant/15 bg-surface/95 px-5 py-4 shadow-[0_20px_50px_-28px_rgba(47,51,48,0.35)] backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full border border-outline-variant/12 bg-primary/10 grid place-items-center text-primary">
                          <IconShield />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                            dermatologist-reviewed
                          </p>
                          <p className="text-sm font-headline font-medium lowercase leading-snug text-on-surface">
                            real clinicians, not algorithms alone
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs italic leading-relaxed text-on-surface-variant">
                        “we treat skin as something that changes week to week. this assessment helps us meet you where
                        you are—not where a trend says you should be.”
                      </p>
                    </div>

                    <div className="relative w-full pr-3 sm:pr-4">
                      <div
                        className="relative w-full overflow-hidden rounded-[1.75rem] p-px bg-gradient-to-br from-primary/28 via-surface-container to-amber-100/18 shadow-[0_28px_80px_-40px_rgba(47,51,48,0.35)]"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-[calc(1.75rem-1px)] bg-surface-container">
                          <SerenHeroVisual imageSrc="/demo/welcome-cream-swatch.png" />

                          <div className="absolute inset-x-4 bottom-4 z-[2] flex justify-center sm:inset-x-6 sm:bottom-6">
                            <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-outline-variant/15 bg-surface/90 px-4 py-2.5 shadow-[0_12px_40px_-24px_rgba(47,51,48,0.2)] backdrop-blur-xl sm:px-5 sm:py-3">
                              <span className="text-sm leading-none text-primary" aria-hidden="true">
                                ★
                              </span>
                              <span className="text-xs font-medium tracking-wide text-on-surface">
                                clinical grade methodology
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="pointer-events-none w-[96px] rounded-2xl bg-primary px-2.5 py-3 text-center text-on-primary shadow-xl sm:w-[100px]"
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 0,
                          zIndex: 20,
                          transform: "translate(16px, -50%) rotate(-8deg)",
                        }}
                      >
                        <p className="text-2xl font-headline font-bold leading-none">98%</p>
                        <p className="mt-2 text-[8px] font-semibold uppercase leading-snug tracking-tight opacity-90">
                          accuracy in
                          <br />
                          skin typing
                        </p>
                      </div>
                    </div>
                  </div>
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
