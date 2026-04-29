import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { requireUser } from "@/lib/authz";
import { CareInboxClient } from "@/app/results/CareInboxClient";
import { prisma } from "@/lib/db";

export default async function InboxPage() {
  const session = await requireUser();
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    redirect("/auth?returnTo=/results/inbox");
  }

  await prisma.userSeenState.upsert({
    where: { userId },
    create: { userId, lastSeenInboxAt: new Date() },
    update: { lastSeenInboxAt: new Date() },
  });

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="mb-10 sm:mb-14 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
            Inbox
          </p>
          <h1 className="font-headline tracking-[-0.03em] leading-[1.0] text-3xl sm:text-4xl">
            dr. Riris
          </h1>
          <p className="mt-5 text-on-surface-variant leading-relaxed">
            Send updates anytime. If something feels off, attach a photo and mention what changed.
          </p>
        </header>

        <div className="max-w-3xl">
          <CareInboxClient />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

