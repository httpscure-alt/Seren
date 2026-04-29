import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

const variants = [
  {
    href: "/demos/share-card-v2/a",
    title: "V2-A: Aura hero (clean)",
    desc: "Full-bleed aura card with minimal, readable overlay. Feels premium and share-first.",
  },
  {
    href: "/demos/share-card-v2/b",
    title: "V2-B: Aura + stats strip",
    desc: "Aura card on the left, three simple stats on the right. Balanced brand + credibility.",
  },
  {
    href: "/demos/share-card-v2/c",
    title: "V2-C: Timeline receipt",
    desc: "Minimal ‘receipt’ layout with routine counts + next step. Looks clinical, not gimmicky.",
  },
] as const;

export default function ShareCardV2IndexPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Demos</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Share card mockups (V2)
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Three cleaner directions to replace the current broken-looking share card. These are UI
            mockups you can iterate on quickly before generating final OG images.
          </p>
        </header>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {variants.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="seren-card p-8 sm:p-9 hover:bg-surface-container transition-colors"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">Variant</p>
              <p className="text-lg font-headline tracking-tight">{v.title}</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
              <p className="mt-6 text-sm text-primary underline underline-offset-4">Open</p>
            </Link>
          ))}
        </section>

        <section className="mt-12">
          <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">Quick rules</p>
            <ul className="text-sm text-on-surface-variant leading-relaxed list-disc pl-5 space-y-2">
              <li>No faces or clinical photos on the card.</li>
              <li>Single primary message. No tiny unreadable text.</li>
              <li>All layouts are 1200×630 safe (no cropping assumptions).</li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

