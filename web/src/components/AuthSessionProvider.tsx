"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Required for `signIn("credentials", { redirect: false })` to refresh session state
 * and for NextAuth client helpers to work reliably in the App Router.
 */
export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
