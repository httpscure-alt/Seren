import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { HeroCaseCarousel } from "@/components/HeroCaseCarousel";

type Slide = {
  eyebrow: string;
  title: string;
  status: string;
};

const processSlides: Slide[] = [
  {
    eyebrow: "How it works",
    title: "Upload photos + concerns",
    status: "Guided intake in under 3 minutes",
  },
  {
    eyebrow: "How it works",
    title: "Dermatologist review",
    status: "AI drafts • dermatologist refines",
  },
  {
    eyebrow: "How it works",
    title: "Your routine + treatment path",
    status: "Clear morning + evening steps",
  },
];

const exampleCaseSlides: Slide[] = [
  {
    eyebrow: "Example case",
    title: "Barrier stress + congestion",
    status: "Draft routine ready • awaiting dermatologist review",
  },
  {
    eyebrow: "Example case",
    title: "Post-acne marks + sensitivity",
    status: "Dermatologist edits • finalizing routine",
  },
  {
    eyebrow: "Example case",
    title: "Texture + uneven tone",
    status: "Approved • routine adjustments suggested",
  },
];

const deliverableSlides: Slide[] = [
  {
    eyebrow: "What you’ll receive",
    title: "Your skin condition",
    status: "A clear explanation of what’s happening",
  },
  {
    eyebrow: "What you’ll receive",
    title: "A routine you can actually follow",
    status: "Simple steps, built for consistency",
  },
  {
    eyebrow: "What you’ll receive",
    title: "Treatment pathway",
    status: "Next steps if symptoms persist",
  },
];

function DemoCard({
  title,
  description,
  slides,
}: {
  title: string;
  description: string;
  slides: Slide[];
}) {
  return (
    <section className="seren-card p-8 sm:p-10">
      <h2 className="text-lg font-headline tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
        {description}
      </p>
      <div className="mt-8 flex justify-center">
        <HeroCaseCarousel slides={slides} />
      </div>
    </section>
  );
}

export default function HeroLabelsDemoPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Hero label options
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            This compares three copy directions for the hero carousel label. Pick
            the one that matches what you want the hero to communicate: the
            process, a sample outcome, or the deliverables.
          </p>
          <p className="mt-6 text-sm text-on-surface/60">
            Related demo:{" "}
            <Link
              className="text-primary underline underline-offset-4"
              href="/demos/hero-ideas?v=1"
            >
              Hero visual ideas
            </Link>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DemoCard
            title="Option A — “How it works”"
            description="Best if the hero is meant to explain the flow (Upload → Review → Routine)."
            slides={processSlides}
          />
          <DemoCard
            title="Option B — “Example case”"
            description="Best if you want the hero to feel like a realistic preview of what a case looks like."
            slides={exampleCaseSlides}
          />
          <DemoCard
            title="Option C — “What you’ll receive”"
            description="Best if you want the hero to focus on outcomes and deliverables (condition, routine, treatment)."
            slides={deliverableSlides}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

