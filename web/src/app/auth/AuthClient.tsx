"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithCredentials } from "@/lib/credentialsSignIn";
import { getSession, signIn } from "next-auth/react";
import { AsyncButton } from "@/components/AsyncButton";
import { useToast } from "@/components/ToastProvider";

const showSocialAuth = process.env.NEXT_PUBLIC_SHOW_SOCIAL_AUTH === "true";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.8 2.8 29.8 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.7 6C12.4 13.3 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.6 24.5c0-1.6-.1-2.7-.4-3.9H24v7.4h12.9c-.3 1.9-1.8 4.8-5 6.7l7.6 5.9c4.5-4.2 7.1-10.3 7.1-16.1z"
      />
      <path
        fill="#FBBC05"
        d="M10.4 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.7-6C1 16.8 0 20.3 0 24s1 7.2 2.7 10.6l7.7-6z"
      />
      <path
        fill="#34A853"
        d="M24 48c5.8 0 10.7-1.9 14.3-5.2l-7.6-5.9c-2 1.4-4.8 2.4-6.7 2.4-6.3 0-11.6-3.8-13.6-9.1l-7.7 6C6.6 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
      fill="currentColor"
    >
      <path d="M16.7 13.6c0 2.8 2.5 3.7 2.5 3.7s-1.9 5.5-4.6 5.5c-1.2 0-2.1-.8-3.3-.8s-2.4.8-3.7.8c-2.5 0-5.6-5.2-5.6-9.4 0-3.6 2.3-5.5 4.6-5.5 1.2 0 2.2.8 3.3.8 1 0 2.3-.9 3.9-.9.6 0 2.6.1 3.9 2-.1.1-2.3 1.3-2.3 3.8z" />
      <path d="M15.4 0c.1 1.2-.4 2.4-1.1 3.3-.8 1-2.1 1.8-3.3 1.7-.1-1.2.4-2.3 1.1-3.2C12.9.8 14.2.1 15.4 0z" />
    </svg>
  );
}

export function AuthClient({
  returnTo,
  oauth,
  authFlash,
}: {
  returnTo: string;
  oauth: { google: boolean; apple: boolean };
  authFlash: "verified" | "verify-failed" | null;
}) {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authFlash === "verified") {
      toast.push({
        tone: "success",
        title: "Email confirmed.",
        detail: "You can sign in below.",
      });
    } else if (authFlash === "verify-failed") {
      toast.push({
        tone: "error",
        title: "That confirmation link didn’t work.",
        detail: "It may have expired. Sign in if you already confirmed, or create an account again.",
      });
    }
  }, [authFlash, toast]);

  async function resolveRedirectAfterLogin(fallback: string) {
    // After credentials sign-in, the role is carried on the session by our callbacks.
    // Physicians should always land on the physician portal.
    const session = await getSession();
    const role = (session as any)?.role as string | undefined;
    if (role === "PHYSICIAN") return "/physician";
    if (role === "ADMIN") return "/admin";
    return fallback;
  }

  async function oauthSignIn(provider: "google" | "apple") {
    setMessage(null);
    setStatus("loading");
    try {
      await signIn(provider, { callbackUrl: returnTo });
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      setStatus("error");
      setMessage(msg);
      toast.push({ tone: "error", title: "Sign-in failed.", detail: msg });
    } finally {
      setStatus("idle");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Enter your email address.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim() || undefined,
            email: trimmedEmail,
            password,
            inviteCode: inviteCode.trim() || undefined,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Failed to create account.");
        toast.push({
          tone: "success",
          title: "Account created.",
          detail: "Check your email to confirm your address.",
        });
      }

      await signInWithCredentials(trimmedEmail, password);
      toast.push({ tone: "success", title: "Signed in." });

      const next = await resolveRedirectAfterLogin(returnTo);
      router.push(next);
      router.refresh();
      setStatus("idle");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setMessage(msg);
      toast.push({ tone: "error", title: "Couldn’t sign in.", detail: msg });
    }
  }

  return (
    <main className="seren-container py-14 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-12 gap-12 lg:gap-16 items-start">
          <section className="col-span-12 lg:col-span-7">
            <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <h1 className="text-4xl sm:text-[2.65rem] font-headline tracking-[-0.02em] leading-[1.08]">
                Save your assessment
              </h1>
              <p className="mt-4 text-on-surface-variant leading-[1.65] text-[0.95rem]">
                Create an account to save your photos, track your skin journey, and receive a
                dermatologist-reviewed routine you can actually follow.
              </p>

              {showSocialAuth ? (
                <>
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      disabled={!oauth.google}
                      onClick={() => oauthSignIn("google")}
                      className={[
                        "seren-card py-3.5 px-5 text-sm font-medium inline-flex items-center justify-center gap-3 rounded-2xl",
                        oauth.google
                          ? "hover:bg-surface-container transition-colors"
                          : "opacity-50 cursor-not-allowed",
                      ].join(" ")}
                      title={
                        oauth.google
                          ? "Continue with Google"
                          : "Google sign-in will be enabled when OAuth credentials are configured."
                      }
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>
                    <button
                      type="button"
                      disabled={!oauth.apple}
                      onClick={() => oauthSignIn("apple")}
                      className={[
                        "seren-card py-3.5 px-5 text-sm font-medium inline-flex items-center justify-center gap-3 rounded-2xl",
                        oauth.apple
                          ? "hover:bg-surface-container transition-colors"
                          : "opacity-50 cursor-not-allowed",
                      ].join(" ")}
                      title={
                        oauth.apple
                          ? "Continue with Apple"
                          : "Apple sign-in will be enabled when OAuth credentials are configured."
                      }
                    >
                      <AppleIcon />
                      Continue with Apple
                    </button>
                  </div>

                  <div className="mt-12 flex items-center gap-4">
                    <div className="h-px bg-outline-variant/20 flex-1" />
                    <span className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                      Or email
                    </span>
                    <div className="h-px bg-outline-variant/20 flex-1" />
                  </div>
                </>
              ) : null}

              <div className="mt-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={[
                    "rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] transition-colors",
                    mode === "signup"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-outline-variant/20 text-on-surface/55 hover:text-primary hover:border-primary/25",
                  ].join(" ")}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={[
                    "rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] transition-colors",
                    mode === "login"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-outline-variant/20 text-on-surface/55 hover:text-primary hover:border-primary/25",
                  ].join(" ")}
                >
                  Log in
                </button>
              </div>

              <form className="mt-8 text-left space-y-6" onSubmit={onSubmit}>
                {mode === "signup" ? (
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
                      Full name
                    </label>
                    <input
                      className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Your name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                ) : null}

                {mode === "signup" ? (
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
                      Invite code (optional)
                    </label>
                    <input
                      className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="SERENFRIENDS"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-on-surface/45">
                      For friends & family testing. Grants access automatically.
                    </p>
                  </div>
                ) : null}

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
                    Email address
                  </label>
                  <input
                    className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
                    Password
                  </label>
                  {mode === "signup" ? (
                    <p className="text-xs text-on-surface-variant mb-2">
                      Use at least 8 characters.
                    </p>
                  ) : null}
                  <div className="flex items-center rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3">
                    <input
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="••••••••"
                      type="password"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="text-on-surface/30 text-sm select-none">◦</span>
                  </div>
                  {mode === "login" ? (
                    <p className="mt-2 text-right">
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-primary hover:underline underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </p>
                  ) : null}
                </div>

                {message ? <p className="text-sm text-error leading-relaxed">{message}</p> : null}

                <AsyncButton
                  type="submit"
                  isLoading={status === "loading"}
                  className="btn-gradient w-full text-center text-on-primary py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm block"
                >
                  {mode === "signup" ? "Create account" : "Log in"}
                </AsyncButton>
              </form>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-5">
            <div className="seren-card p-8 sm:p-10 lg:sticky lg:top-28">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/15 mb-6" />
              <h3 className="font-headline text-lg mb-2">Clinical security</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Your health data is encrypted using hospital-grade protocols.
              </p>
            </div>
          </aside>
        </div>
      </main>
  );
}

