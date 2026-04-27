import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { IntakeRoutineMockClient } from "./IntakeRoutineMockClient";

export default function IntakeRoutineMockPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface text-on-surface">
      <SiteNavbar />

      <main className="seren-container pb-24 pt-28 sm:pt-32">
        <header className="max-w-3xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Demos · Intake
          </p>
          <h1 className="font-headline text-3xl tracking-[-0.02em] sm:text-4xl">
            Current routine — UI mock
          </h1>
          <p className="mt-4 leading-[1.65] text-on-surface-variant">
            Interactive prototype for a new block inside{" "}
            <span className="text-on-surface font-medium">Step 3 · Skin</span> (after sensitivity,
            before or after lesions — your call). Not wired to{" "}
            <span className="font-mono text-xs">/api/cases/submit</span> yet.
          </p>
          <p className="mt-4 rounded-2xl border border-outline-variant/12 bg-surface-container-low px-4 py-3 font-mono text-xs text-on-surface">
            <span className="text-on-surface/45">Path: </span>/demos/intake-routine-mock
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos">
              All demos
            </Link>
            {" · "}
            <Link className="text-primary underline underline-offset-4" href="/consult/intake">
              Live intake (current)
            </Link>
            {" · "}
            <Link className="text-primary underline underline-offset-4" href="/demos/budget-tier">
              Budget tier demos
            </Link>
          </p>
        </header>

        <div className="mt-12 max-w-3xl">
          <IntakeRoutineMockClient />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
