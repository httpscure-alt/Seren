import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

const demos = [
  {
    href: "/demos/journey-library/a",
    title: "Option A — Journey timeline",
    desc: "Feed-style cards that feel like a personal skin journey (not medical records).",
  },
  {
    href: "/demos/journey-library/b",
    title: "Option B — Results gallery",
    desc: "Gallery-style report cards with covers + quick actions.",
  },
] as const;

export default function JourneyLibraryDemoIndex() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
            Demos
          </p>
          <h1 className="font-headline tracking-[-0.03em] leading-[1.0] text-3xl sm:text-4xl">
            Consumer-friendly My Journey layouts
          </h1>
          <p className="mt-5 text-on-surface-variant leading-relaxed">
            These are UI mockups for how “Reports library” could look for users (non-clinical).
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {demos.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)] hover:bg-surface-container-low transition-colors"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                Layout option
              </p>
              <p className="mt-3 font-headline tracking-tight text-xl">{d.title}</p>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">{d.desc}</p>
              <div className="mt-6 inline-flex rounded-full border border-outline-variant/25 px-5 py-2.5 text-sm text-on-surface-variant">
                Open preview
              </div>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

