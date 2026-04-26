"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export function NavbarAuthControls({
  isAuthed,
  role,
  userInboxLabel,
}: {
  isAuthed: boolean;
  role?: "USER" | "PHYSICIAN" | "ADMIN";
  userInboxLabel?: string;
}) {
  if (!isAuthed) {
    return (
      <Link
        href="/auth?returnTo=/results"
        className="text-on-surface/70 hover:text-primary transition-colors duration-300 shrink-0 text-[9px] sm:text-xs uppercase tracking-[0.2em] font-headline"
      >
        Sign in
      </Link>
    );
  }

  const userInbox = userInboxLabel ?? "Inbox";

  return (
    <div className="flex items-center gap-3 sm:gap-5 shrink-0">
      {role === "USER" ? (
        <Link
          href="/results/inbox"
          className="text-on-surface/70 hover:text-primary transition-colors duration-300 shrink-0 text-[9px] sm:text-xs uppercase tracking-[0.2em] font-headline"
        >
          {userInbox}
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-on-surface/55 hover:text-on-surface transition-colors duration-300 shrink-0 text-[9px] sm:text-xs uppercase tracking-[0.2em] font-headline"
      >
        Log out
      </button>
    </div>
  );
}

