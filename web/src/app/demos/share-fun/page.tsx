import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

const variants = [
  {
    href: "/demos/share-fun/program-mock",
    title: "Program mock — share · Points · creators",
    desc: "Three flows on one page: shareable card journey, Seren Points earn/see/redeem, creator vs member table + dashboard.",
  },
  {
    href: "/demos/share-fun/wrapped",
    title: "★ Share + discover (on-brand)",
    desc: "Design-system colors & type; left = progress, right = what Seren is + check-in CTA.",
  },
  {
    href: "/demos/share-fun/d",
    title: "Option D — Journey stamp",
    desc: "A collectible stamp vibe: week marker + focus. Calm but shareable.",
  },
  {
    href: "/demos/share-fun/e",
    title: "Option E — Abstract polaroid",
    desc: "Polaroid frame, but abstract texture. Feels personal, not clinical.",
  },
  {
    href: "/demos/share-fun/f",
    title: "Option F — Routine checklist",
    desc: "Habit-tracker vibe. The easiest ‘fun’ share format.",
  },
] as const;

export default function ShareFunIndexPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Demos</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Fun share cards
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Start with <span className="text-on-surface font-medium">Wrapped + invite</span> if the goal
            is “I’d post this” <em>and</em> “my friend would tap.” The rest are layout experiments.
          </p>
          <p className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos">
              All demos
            </Link>
            <Link className="text-primary underline underline-offset-4" href="/demos/share-variants">
              Compare the clinical variants (A–C)
            </Link>
          </p>
        </header>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {variants.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className={[
                "seren-card p-8 sm:p-9 hover:bg-surface-container transition-colors",
                v.href.includes("wrapped")
                  ? "ring-2 ring-primary/25 bg-gradient-to-br from-primary/5 to-transparent md:col-span-2 xl:col-span-3"
                  : "",
              ].join(" ")}
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">
                {v.href.includes("wrapped") ? "Recommended" : "Variant"}
              </p>
              <p className="text-lg font-headline tracking-tight">{v.title}</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
              <p className="mt-6 text-sm text-primary underline underline-offset-4">Open</p>
            </Link>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

