import { prisma } from "@/lib/db";
import { AdminUsersClient } from "./usersClient";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { cases: true, subscriptions: true, payments: true } },
    },
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • Users
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Users & roles.
        </h1>
      </header>

      <AdminUsersClient initialUsers={users as any} />
    </div>
  );
}

