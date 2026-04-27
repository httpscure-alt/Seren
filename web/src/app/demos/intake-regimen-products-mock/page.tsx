import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { IntakeRegimenProductsClient } from "./IntakeRegimenProductsClient";

export default function IntakeRegimenProductsMockPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface text-on-surface">
      <SiteNavbar />

      <main className="seren-container pb-24 pt-28 sm:pt-32">
        <header className="max-w-3xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Demos · Intake · Catalog
          </p>
          <h1 className="font-headline text-3xl tracking-[-0.02em] sm:text-4xl">
            Regimen products (brand + catalog)
          </h1>
          <p className="mt-4 leading-[1.65] text-on-surface-variant">
            UX mock wired to <span className="font-mono text-xs">GET /api/skincare-products</span>.
            Run <span className="font-mono text-xs">npx prisma migrate deploy</span> (or dev) and{" "}
            <span className="font-mono text-xs">npx prisma db seed</span> so search returns rows.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/consult/intake"
              className="inline-flex h-12 items-center justify-center rounded-full border border-outline-variant/25 px-8 text-sm font-medium text-on-surface transition hover:border-primary/25 hover:bg-primary/5"
            >
              Compare: live intake
            </Link>
          </div>
          <p className="mt-4 rounded-2xl border border-outline-variant/12 bg-surface-container-low px-4 py-3 font-mono text-xs text-on-surface">
            <span className="text-on-surface/45">Open: </span>
            http://localhost:3000/demos/intake-regimen-products-mock
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos">
              All demos
            </Link>
            {" · "}
            <Link className="text-primary underline underline-offset-4" href="/demos/intake-routine-mock">
              Category chips mock
            </Link>
          </p>
          <p className="mt-3 text-xs text-on-surface/45">
            Guardrails &amp; skills: <span className="font-mono">docs/ai/guardrails-regimen-products.md</span>,{" "}
            <span className="font-mono">docs/ai/skills.md</span> (repo root).
          </p>
        </header>

        <div className="mt-12 max-w-3xl">
          <IntakeRegimenProductsClient />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
