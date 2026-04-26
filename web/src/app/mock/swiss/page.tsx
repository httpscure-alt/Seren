import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-outline-variant/10 text-sm text-on-surface-variant">
      {children}
    </div>
  );
}

export default function MockSwissClinicLanding() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Mock • Swiss grid clinic
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Structured, operational, clinical.
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            A tighter grid language that works well for admin/physician views and can be brought
            into the public site subtly.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-12 gap-8 lg:gap-10 items-start">
          <aside className="col-span-12 lg:col-span-3">
            <div className="rounded-[1.25rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden lg:sticky lg:top-32">
              <div className="px-4 py-4 border-b border-outline-variant/10">
                <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">Navigation</p>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { href: "/mock/swiss", label: "Overview" },
                  { href: "/admin", label: "Admin" },
                  { href: "/physician", label: "Physician" },
                  { href: "/results", label: "Dashboard" },
                ].map((i) => (
                  <Link
                    key={i.href}
                    href={i.href}
                    className="block rounded-xl px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    {i.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-9 space-y-6">
            <div className="rounded-[1.25rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
              <div className="grid grid-cols-12 text-[10px] uppercase tracking-[0.28em] text-on-surface/45 bg-surface-container-low/60 border-b border-outline-variant/10">
                {["Module", "Signal", "Owner", "Status"].map((h) => (
                  <div key={h} className="col-span-12 sm:col-span-3 px-4 py-3">
                    {h}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-12 sm:col-span-3">
                  <Cell>Intake</Cell>
                  <Cell>Analyzing</Cell>
                  <Cell>Report</Cell>
                </div>
                <div className="col-span-12 sm:col-span-3">
                  <Cell>Symptoms + photos</Cell>
                  <Cell>AI draft</Cell>
                  <Cell>Signed routine</Cell>
                </div>
                <div className="col-span-12 sm:col-span-3">
                  <Cell>User</Cell>
                  <Cell>AI + clinician</Cell>
                  <Cell>Clinician</Cell>
                </div>
                <div className="col-span-12 sm:col-span-3">
                  <Cell>
                    <span className="text-on-surface">Active</span>
                  </Cell>
                  <Cell>
                    <span className="text-on-surface">Active</span>
                  </Cell>
                  <Cell>
                    <span className="text-on-surface">Active</span>
                  </Cell>
                </div>
              </div>
            </div>

            <div className="rounded-[1.25rem] bg-surface-container-lowest border border-outline-variant/10 p-6 sm:p-7">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
                Primary CTA
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Link
                  href="/consult/intake"
                  className="rounded-full bg-primary text-on-primary px-6 py-3 text-xs uppercase tracking-[0.2em] font-headline shadow-sm text-center"
                >
                  Start consultation
                </Link>
                <Link
                  href="/admin"
                  className="rounded-full border border-outline-variant/25 px-6 py-3 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors text-center"
                >
                  Admin panel
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

