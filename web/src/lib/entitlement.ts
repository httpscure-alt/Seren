import { prisma } from "@/lib/db";

export async function hasActiveSubscription(userId: string) {
  const now = new Date();
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", expiresAt: { gt: now } },
    orderBy: { expiresAt: "desc" },
    select: { id: true, plan: true, expiresAt: true },
  });
  return sub;
}

export async function getExpiringSoonSubscription(userId: string, withinDays = 3) {
  const now = Date.now();
  const soon = new Date(now + withinDays * 24 * 60 * 60 * 1000);
  return await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", expiresAt: { gt: new Date(now), lte: soon } },
    orderBy: { expiresAt: "asc" },
    select: { plan: true, expiresAt: true },
  });
}

