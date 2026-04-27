import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/authz";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/cases", label: "Cases" },
  { href: "/admin/ai-jobs", label: "AI jobs" },
  { href: "/admin/messages", label: "Care threads" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/promos", label: "Promos" },
  { href: "/admin/audit", label: "Audit log" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/catalog", label: "Product catalog" },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["ADMIN"]);
  if (!session) redirect("/auth?returnTo=%2Fadmin");

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <div className="seren-container pt-28 sm:pt-32 pb-24">
        <div className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <aside className="col-span-12 lg:col-span-3">
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-6 sm:p-7 lg:sticky lg:top-32">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-5">
                Admin
              </p>
              <nav className="space-y-2">
                {nav.map((i) => (
                  <Link
                    key={i.href}
                    href={i.href}
                    className="block rounded-xl px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    {i.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <main className="col-span-12 lg:col-span-9 min-w-0">{children}</main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

