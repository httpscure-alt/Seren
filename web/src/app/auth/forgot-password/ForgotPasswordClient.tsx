"use client";

import Link from "next/link";
import { useState } from "react";
import { AsyncButton } from "@/components/AsyncButton";
import { useToast } from "@/components/ToastProvider";

export function ForgotPasswordClient() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      toast.push({ tone: "error", title: "Enter your email address." });
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? "Request failed.");
      }
      setStatus("done");
      toast.push({
        tone: "success",
        title: "Check your inbox.",
        detail: "If an account exists for that email, we sent reset instructions.",
      });
    } catch (err) {
      setStatus("idle");
      toast.push({
        tone: "error",
        title: "Couldn’t send reset email.",
        detail: err instanceof Error ? err.message : "Try again.",
      });
    }
  }

  return (
    <main className="seren-container py-14 sm:py-20">
      <div className="max-w-md mx-auto">
        <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">Account</p>
        <h1 className="font-headline text-3xl tracking-[-0.02em] text-on-surface">Reset password</h1>
        <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
          Enter the email you use for Seren. We’ll send a link to choose a new password.
        </p>

        {status === "done" ? (
          <p className="mt-8 text-sm text-on-surface-variant leading-relaxed">
            You can close this tab after you’ve checked your email.
          </p>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
                Email address
              </label>
              <input
                className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <AsyncButton
              type="submit"
              isLoading={status === "loading"}
              className="btn-gradient w-full text-center text-on-primary py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm block"
            >
              Send reset link
            </AsyncButton>
          </form>
        )}

        <p className="mt-10 text-sm">
          <Link href="/auth" className="text-primary hover:underline underline-offset-4">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
