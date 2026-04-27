import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

const demos = [
  {
    href: "/demos/intake-regimen-products-mock",
    title: "Intake · brand + catalog search (mock)",
    desc: "Search SkincareProduct API, pick or free-text, regimenLines JSON for submit.",
  },
  {
    href: "/demos/intake-routine-mock",
    title: "Intake · current routine (mock)",
    desc: "Proposed Step 3 block: what they use now, recent changes, JSON preview.",
  },
  {
    href: "/demos/share-fun/program-mock",
    title: "Referral program flows (mock)",
    desc: "Share card journey, Seren Points, creators vs members.",
  },
  {
    href: "/demos/share-fun/wrapped",
    title: "Share card + referral link",
    desc: "On-brand wrapped + ?ref= and rewards catalog.",
  },
  {
    href: "/demos/budget-tier",
    title: "Budget tier UI",
    desc: "Where to ask value / mid / premium preference.",
  },
  {
    href: "/demos/share-variants",
    title: "Share variants (A–C)",
    desc: "Clinical share layout experiments.",
  },
  {
    href: "/demos/journey-library",
    title: "Journey library",
    desc: "Journey UI explorations.",
  },
] as const;

export default function DemosIndexPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface text-on-surface">
      <SiteNavbar />

      <main className="seren-container pb-24 pt-28 sm:pt-32">
        <header className="max-w-3xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Internal
          </p>
          <h1 className="font-headline text-3xl tracking-[-0.02em] sm:text-4xl">Demos</h1>
          <p className="mt-4 leading-[1.65] text-on-surface-variant">
            Design and flow prototypes. Production consult flow:{" "}
            <Link className="text-primary underline underline-offset-4" href="/consult/welcome">
              /consult/welcome
            </Link>
            .
          </p>
        </header>

        <ul className="mt-12 grid list-none gap-4 p-0 sm:grid-cols-1 lg:grid-cols-2">
          {demos.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="block rounded-[1.75rem] border border-outline-variant/12 bg-surface-container-lowest p-6 transition hover:border-primary/20 hover:bg-surface-container-low sm:p-8"
              >
                <p className="font-mono text-[11px] text-on-surface/45">{d.href}</p>
                <p className="mt-2 font-headline text-lg tracking-tight text-on-surface">{d.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{d.desc}</p>
                <p className="mt-4 text-sm text-primary underline underline-offset-4">Open</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
