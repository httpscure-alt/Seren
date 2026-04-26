import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

import { HeroCaseCarousel } from "@/components/HeroCaseCarousel";
import { HeroIdeaGradientCarousel } from "@/components/HeroIdeaGradientCarousel";
import { HeroIdeaPolaroidStack } from "@/components/HeroIdeaPolaroidStack";
import { HeroIdeaJourneyCarousel } from "@/components/HeroIdeaJourneyCarousel";
import { HeroIdeaRealPhotoMock } from "@/components/HeroIdeaRealPhotoMock";

export default function HeroIdeasDemoPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Hero “Case Preview” Visual Ideas
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            These are four alternative treatments for the landing hero’s case
            preview area. They’re meant to help you decide the visual direction
            before we lock it in.
          </p>
          <p className="mt-6 text-sm text-on-surface/60">
            Tip: open this on mobile too —{" "}
            <Link
              className="text-primary underline underline-offset-4"
              href="/demos/hero-ideas?v=1"
            >
              refresh this page
            </Link>
            .
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="seren-card p-8 sm:p-10">
            <h2 className="text-lg font-headline tracking-tight">
              1) Abstract “skin light” variations (recommended)
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Same abstract hero visual, but subtly shifts per slide (warm/cool/
              neutral). Feels premium, avoids privacy concerns.
            </p>

            <div className="mt-8 grid place-items-center">
              <div className="w-full max-w-[520px] relative rounded-[2.25rem] seren-card overflow-hidden min-h-[320px]">
                <HeroIdeaGradientCarousel />
              </div>
            </div>
          </section>

          <section className="seren-card p-8 sm:p-10">
            <h2 className="text-lg font-headline tracking-tight">
              2) Polaroid-style mini clinical photo placeholders
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              A small stack of “photo frames” (still abstract textures), plus the
              case status. Communicates photo-upload flow without real images.
            </p>

            <div className="mt-8 grid place-items-center">
              <div className="w-full max-w-[520px] relative rounded-[2.25rem] seren-card overflow-hidden min-h-[320px] bg-surface-container-low">
                <HeroIdeaPolaroidStack />
              </div>
            </div>
          </section>

          <section className="seren-card p-8 sm:p-10">
            <h2 className="text-lg font-headline tracking-tight">
              3) Icon-based journey carousel (Upload → Review → Routine)
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Very clean, product-forward. Each slide highlights a step with a
              soft icon and short copy.
            </p>

            <div className="mt-8 grid place-items-center">
              <div className="w-full max-w-[520px] relative rounded-[2.25rem] seren-card overflow-hidden min-h-[320px]">
                <HeroIdeaJourneyCarousel />
              </div>
            </div>
          </section>

          <section className="seren-card p-8 sm:p-10">
            <h2 className="text-lg font-headline tracking-tight">
              4) Real photos per slide (mocked)
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Highest clinical realism, but requires consent + careful privacy.
              This demo uses abstract placeholders where photos would go.
            </p>

            <div className="mt-8 grid place-items-center">
              <div className="w-full max-w-[520px] relative rounded-[2.25rem] seren-card overflow-hidden min-h-[320px] bg-surface-container-low">
                <HeroIdeaRealPhotoMock />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-14 seren-card-quiet p-8 sm:p-10">
          <h3 className="text-lg font-headline tracking-tight">
            Current implementation on landing
          </h3>
          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
            This is what you currently have on <code>/</code> (the text carousel
            inside the hero). We can swap it to any of the four styles above.
          </p>
          <div className="mt-8 flex justify-center">
            <HeroCaseCarousel />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

