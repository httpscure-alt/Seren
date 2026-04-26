import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

/**
 * Consult welcome — layout from design export, brand + typography aligned with SiteNavbar / philosophy.
 * Material Symbols: `consult/welcome/layout.tsx`.
 */
export function ConsultWelcomeScreen() {
  return (
    <div className="consult-welcome flex min-h-screen flex-col bg-surface text-on-surface">
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant/10 bg-surface/75 backdrop-blur-2xl">
        <div className="seren-container flex items-center justify-between py-5 sm:py-6">
          <BrandMark href="/" />
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="btn-gradient rounded-full px-6 py-2.5 text-center text-sm font-medium tracking-wide text-on-primary shadow-sm transition-all duration-200 active:scale-95"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-grow items-center justify-center py-16 sm:py-20">
        <div className="seren-container w-full">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="space-y-10 md:col-span-5 md:col-start-2 md:space-y-12">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl md:text-[3.25rem]">
                Your skin journey <br />
                begins here
              </h1>
              <p className="max-w-md text-[0.98rem] leading-[1.75] text-on-surface-variant">
                A personalized clinical assessment designed to understand your unique dermal profile.
              </p>
            </div>

            <div className="space-y-8">
              <div className="group flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-high">
                  <span className="material-symbols-outlined text-primary" aria-hidden>
                    schedule
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="font-headline text-lg tracking-tight">Takes 2–3 minutes</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    A brief questionnaire about your lifestyle and skin goals.
                  </p>
                </div>
              </div>
              <div className="group flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-high">
                  <span className="material-symbols-outlined text-primary" aria-hidden>
                    add_a_photo
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="font-headline text-lg tracking-tight">Prepare clear photos</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    High-resolution images ensure precision in our analysis.
                  </p>
                </div>
              </div>
              <div className="group flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-high">
                  <span className="material-symbols-outlined text-primary" aria-hidden>
                    verified_user
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="font-headline text-lg tracking-tight">Reviewed by a dermatologist</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    Every plan is validated by clinical professionals.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/consult/intake"
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-center text-sm font-medium tracking-wide text-on-primary shadow-sm transition-all duration-200 btn-gradient hover:brightness-[1.03]"
              >
                Begin assessment
              </Link>
              <p className="mt-6 text-sm leading-relaxed text-on-surface/55">
                By continuing, you agree to our{" "}
                <Link className="text-on-surface/70 underline underline-offset-[6px] decoration-on-surface/20 hover:text-primary" href="/privacy">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link className="text-on-surface/70 underline underline-offset-[6px] decoration-on-surface/20 hover:text-primary" href="/terms">
                  Terms
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="relative hidden md:col-span-5 md:block">
            <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-primary-container/30 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-80 w-80 rounded-full bg-tertiary-container/20 blur-[100px]" />

            <div className="relative z-10 space-y-6">
              <div className="translate-x-12 rotate-2 rounded-xl border border-white/20 bg-surface-container-lowest/80 p-8 shadow-sm backdrop-blur-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-surface-container-high">
                    <Image
                      src="/doctors/dr-riris.png"
                      alt="clinical expert"
                      fill
                      className="object-cover"
                      sizes="40px"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">Clinical lead</p>
                    <p className="mt-1 font-headline font-semibold tracking-tight text-on-surface">
                      Dr. Riris Asti Respati, SpDVE
                    </p>
                  </div>
                </div>
                <p className="text-sm italic leading-relaxed text-on-surface-variant">
                  &ldquo;We treat skin as a living ecosystem. This assessment is the first step in restoring your natural
                  balance.&rdquo;
                </p>
              </div>

              <div className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src="/demo/welcome-cream-swatch.png"
                  alt="skincare texture"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-on-surface/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/20 p-3 backdrop-blur-xl">
                    <span className="material-symbols-outlined ms-fill text-sm text-white" aria-hidden>
                      star
                    </span>
                    <span className="text-xs font-medium tracking-wide text-white">
                      Clinical grade methodology
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 top-1/2 z-20 -translate-y-1/2 -rotate-6 rounded-xl bg-tertiary px-6 py-4 text-on-tertiary shadow-xl">
                <p className="font-headline text-3xl font-semibold tracking-tight">98%</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-on-tertiary/85">
                  Accuracy in
                  <br />
                  skin typing
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}
