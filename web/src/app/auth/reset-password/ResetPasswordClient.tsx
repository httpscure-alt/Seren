"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AsyncButton } from "@/components/AsyncButton";
import { useToast } from "@/components/ToastProvider";

export function ResetPasswordClient({ initialToken }: { initialToken: string }) {
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!initialToken) {
      toast.push({ tone: "error", title: "Invalid or missing reset link." });
      return;
    }
    if (password.length < 8) {
      toast.push({ tone: "error", title: "Password must be at least 8 characters." });
      return;
    }
    if (password !== password2) {
      toast.push({ tone: "error", title: "Passwords don’t match." });
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: initialToken, password }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error ?? "Reset failed.");

      toast.push({ tone: "success", title: "Password updated.", detail: "You can sign in now." });
      router.push("/auth");
      router.refresh();
    } catch (err) {
      toast.push({
        tone: "error",
        title: "Couldn’t reset password.",
        detail: err instanceof Error ? err.message : "Try requesting a new link.",
      });
    } finally {
      setStatus("idle");
    }
  }

  if (!initialToken) {
    return (
      <main className="seren-container py-14 sm:py-20">
        <div className="max-w-md mx-auto">
          <h1 className="font-headline text-2xl text-on-surface">Invalid link</h1>
          <p className="mt-3 text-sm text-on-surface-variant">
            This reset link is missing a token. Open the link from your email, or request a new one.
          </p>
          <p className="mt-8">
            <Link href="/auth/forgot-password" className="text-primary hover:underline underline-offset-4">
              Request reset
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="seren-container py-14 sm:py-20">
      <div className="max-w-md mx-auto">
        <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">Account</p>
        <h1 className="font-headline text-3xl tracking-[-0.02em] text-on-surface">Choose a new password</h1>
        <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
          Use at least 8 characters. After saving, you’ll receive a confirmation email.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
              New password
            </label>
            <input
              className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
              Confirm password
            </label>
            <input
              className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              type="password"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          <AsyncButton
            type="submit"
            isLoading={status === "loading"}
            className="btn-gradient w-full text-center text-on-primary py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm block"
          >
            Update password
          </AsyncButton>
        </form>

        <p className="mt-10 text-sm">
          <Link href="/auth" className="text-primary hover:underline underline-offset-4">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
