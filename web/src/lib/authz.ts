export type AppRole = "USER" | "PHYSICIAN" | "ADMIN";

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

