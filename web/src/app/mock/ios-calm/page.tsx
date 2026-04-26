import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { getDictionary } from "@/i18n/getDictionary";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant/10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">{title}</p>
      </div>
      <div className="divide-y divide-outline-variant/10">{children}</div>
    </div>
  );
}

function Row({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="font-headline tracking-tight text-sm text-on-surface">{title}</p>
        <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">{subtitle}</p>
      </div>
      <div className="shrink-0 text-on-surface/35">{right ?? "›"}</div>
    </div>
  );
}

export default async function MockIosCalmLanding() {
  const { dict } = await getDictionary();
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Mock • iOS calm
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Start a skin consultation.
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            A system-like layout: grouped lists, clear hierarchy, and a sticky action area.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <section className="col-span-12 lg:col-span-7 space-y-6">
            <Group title="Overview">
              <Row
                title="Time required"
                subtitle="2–3 minutes for intake. Report ready after dermatologist review."
                right="⏱"
              />
              <Row
                title="What you’ll get"
                subtitle="Condition summary, routine, and treatment pathway."
                right="✓"
              />
            </Group>

            <Group title="Personalization (optional)">
              <Row
                title="Budget comfort"
                subtitle="Everyday • Balanced • Derm brands"
              />
              <Row title="Routine style" subtitle="Minimal • Standard • Intensive" />
              <Row title="Sensitive skin mode" subtitle="Extra-gentle defaults and slower actives." right="On" />
            </Group>

            <Group title="Next steps">
              <Row title="Upload photos" subtitle="Guided clinical photo checklist." />
              <Row title="Answer intake" subtitle="Concerns, symptoms, and context." />
              <Row title="Submit for review" subtitle="AI drafts • dermatologist refines." />
            </Group>
          </section>

          <aside className="col-span-12 lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="rounded-[1.75rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
                Primary action
              </p>
              <Link
                href="/consult/intake"
                className="btn-gradient w-full text-on-primary px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-headline text-center shadow-sm block"
              >
                {dict.landing.ctaStart}
              </Link>
              <p className="mt-4 text-xs text-on-surface/45 leading-relaxed">
                Clear CTA, no distraction. This is the “Apple Health” style.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
              <p className="font-headline tracking-tight text-base">Secondary</p>
              <div className="mt-4 space-y-3">
                <Link
                  href="/philosophy"
                  className="block rounded-2xl border border-outline-variant/15 px-5 py-4 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Read the philosophy
                </Link>
                <Link
                  href="/auth"
                  className="block rounded-2xl border border-outline-variant/15 px-5 py-4 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

