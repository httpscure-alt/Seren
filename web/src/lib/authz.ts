export type AppRole =
  | "USER"
  | "PHYSICIAN"
  | "ADMIN"
  | "SUPPORT"
  | "PARTNERSHIP_MANAGER";

export async function requireUser() {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/authOptions");
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return session;
}

export async function requireRole(allowed: AppRole[]) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/authOptions");
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role as AppRole | undefined;
  if (!session?.user?.email) return null;
  if (!role) return null;
  if (!allowed.includes(role)) return null;
  return session;
}

/**
 * Logged-in journeys that should mirror paid entitlement (reports, routine, inbox).
 * PHYSICIAN/ADMIN bypass; USER must have an active subscription.
 */
export async function requirePatientEntitlement(returnToPath: string) {
  const { redirect } = await import("next/navigation");
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/authOptions");
  const { hasActiveSubscription } = await import("@/lib/entitlement");

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const cookieUserId = (session as { userId?: string }).userId;
  const role = (session as any)?.role as AppRole | undefined;

  if (!email || cookieUserId == null || cookieUserId === "") {
    redirect(`/auth?returnTo=${encodeURIComponent(returnToPath)}`);
  }
  const userId = cookieUserId as string;

  if (role === "PHYSICIAN" || role === "ADMIN") {
    return session;
  }

  if (role === "SUPPORT") {
    redirect("/support");
  }
  if (role === "PARTNERSHIP_MANAGER") {
    redirect("/partner");
  }

  const sub = await hasActiveSubscription(userId);
  if (!sub) {
    redirect(`/paywall?returnTo=${encodeURIComponent(returnToPath)}`);
  }

  return session;
}

/**
 * Authenticated patient session without subscription gating.
 * Use for post-intake surfaces (e.g. `/results/pending-payment`) where the user
 * should see real data before checkout.
 */
export async function requireSignedInPatientUser(returnToPath: string) {
  const { redirect } = await import("next/navigation");
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/authOptions");

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const cookieUserId = (session as { userId?: string }).userId;
  const role = (session as any)?.role as AppRole | undefined;

  if (!email || cookieUserId == null || cookieUserId === "") {
    redirect(`/auth?returnTo=${encodeURIComponent(returnToPath)}`);
  }

  if (role === "PHYSICIAN" || role === "ADMIN") {
    redirect("/physician");
  }
  if (role === "SUPPORT") {
    redirect("/support");
  }
  if (role === "PARTNERSHIP_MANAGER") {
    redirect("/partner");
  }
  if (role !== "USER") {
    redirect(`/auth?returnTo=${encodeURIComponent(returnToPath)}`);
  }

  return session;
}
