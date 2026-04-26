import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

const variants = [
  {
    href: "/demos/share-variants/a",
    title: "Option A (recommended)",
    desc: "“My skin plan” card. No faces. Personal outcome + next steps.",
  },
  {
    href: "/demos/share-variants/b",
    title: "Option B",
    desc: "Abstract gradient + dermatologist-reviewed badge. Very shareable, brand-safe.",
  },
  {
    href: "/demos/share-variants/c",
    title: "Option C",
    desc: "User-owned artifact: case ID, steps count, timeline. Minimal + credible.",
  },
] as const;

export default function ShareVariantsIndexPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Demos</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Social share card variants
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Three privacy-safe directions that feel personal (higher likelihood users will share).
          </p>
        </header>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {variants.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="seren-card p-8 sm:p-9 hover:bg-surface-container transition-colors"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">
                Variant
              </p>
              <p className="text-lg font-headline tracking-tight">{v.title}</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
              <p className="mt-6 text-sm text-primary underline underline-offset-4">Open</p>
            </Link>
          ))}
        </section>

        <section className="mt-12">
          <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">
              Note
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-[85ch]">
              These are mockups only. Next step would be generating real OpenGraph images per report
              (e.g. <span className="text-on-surface">/og/report/[id]</span>) and a real share page
              (<span className="text-on-surface">/share/report/[id]</span>) with copy link /
              download.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

