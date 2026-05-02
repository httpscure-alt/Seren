"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { AsyncButton } from "@/components/AsyncButton";

const PLAN_DETAIL = {
  single: {
    title: "Single report",
    subtitle: "Full skin analysis unlock · 7 days access",
    priceIdr: 49_000,
  },
  journey: {
    title: "30-day skin journey",
    subtitle: "Guided plan with ongoing dermatology support · 30 days access",
    priceIdr: 99_000,
  },
} as const;

function formatIdr(n: number) {
  return `Rp ${n.toLocaleString("id-ID", { maximumFractionDigits: 0 })},-`;
}

export type PaywallCheckoutPreset = {
  plan: "single" | "journey";
  next?: string;
  coupon?: string;
  /** Uppercase PSP id, e.g. DOKU */
  provider?: string;
  backHref?: string;
};

export function PaywallCheckoutClient(props: { preset?: PaywallCheckoutPreset }) {
  const { preset } = props;
  const sp = useSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const planRaw = preset?.plan ?? sp.get("plan");
  const plan = ((planRaw ?? "journey") === "single" ? "single" : "journey") as keyof typeof PLAN_DETAIL;
  const nextRaw = preset?.next ?? sp.get("next") ?? "/results";
  const coupon = preset?.coupon ?? sp.get("coupon") ?? "";
  const providerOverride = (preset?.provider ?? sp.get("provider"))?.toUpperCase();
  const payFailed = sp.get("failed") === "1";

  const activeProvider = providerOverride || (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "").toUpperCase();
  const providerLabel =
    activeProvider === "XENDIT"
      ? "Xendit"
      : activeProvider === "DUITKU"
        ? "Duitku"
        : activeProvider === "DOKU"
          ? "DOKU"
          : "Midtrans";

  const payload = useMemo(
    () => ({ plan, next: nextRaw, coupon, provider: providerOverride }),
    [plan, nextRaw, coupon, providerOverride],
  );

  const planDetail = PLAN_DETAIL[plan];

  const paywallBackHref = useMemo(() => {
    if (preset?.backHref) return preset.backHref;
    const qs = new URLSearchParams();
    qs.set("returnTo", nextRaw.startsWith("/") ? nextRaw : "/results");
    if (coupon) qs.set("coupon", coupon);
    if (providerOverride) qs.set("provider", providerOverride);
    return `/paywall?${qs.toString()}`;
  }, [coupon, nextRaw, preset?.backHref, providerOverride]);

  const continueLabel = useMemo(() => `Continue to ${providerLabel}`, [providerLabel]);

  const startPayment = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/midtrans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        window.location.href = `/auth?returnTo=${encodeURIComponent(returnTo)}`;
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Payment init failed.");
      if (json?.redirectUrl) {
        window.location.href = String(json.redirectUrl);
        return;
      }
      toast.push({ tone: "success", title: "Access activated." });
      window.location.href = nextRaw;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Try again.";
      toast.push({
        tone: "error",
        title: "Could not start payment.",
        detail: msg,
      });
    } finally {
      setLoading(false);
    }
  }, [nextRaw, payload, toast]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="seren-container pt-28 sm:pt-32 pb-24">
        <div className="max-w-lg mx-auto rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-8 sm:p-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4 text-center">
            Order summary
          </p>

          {payFailed ? (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-on-surface text-center"
            >
              Payment wasn’t completed. Review your order and try again below.
            </div>
          ) : null}

          <div className="rounded-[1.35rem] border border-outline-variant/10 bg-surface-container-low/60 px-5 py-5 sm:px-6 sm:py-6">
            <p className="font-headline tracking-tight text-xl">{planDetail.title}</p>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{planDetail.subtitle}</p>

            <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-outline-variant/10 pt-5">
              <span className="text-xs uppercase tracking-[0.18em] text-on-surface/50">Due today</span>
              <span className="font-headline text-3xl tracking-tight tabular-nums">{formatIdr(planDetail.priceIdr)}</span>
            </div>

            {coupon.trim() ? (
              <p className="mt-3 text-xs text-on-surface-variant">
                Promo code <span className="font-medium text-on-surface">{coupon.trim()}</span> — validated when you pay.
              </p>
            ) : null}

            <div className="mt-5 rounded-2xl bg-surface-container-lowest/80 px-4 py-3 border border-outline-variant/8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface/45 mb-2">After payment</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                We’ll send you back to this route on Seren after {providerLabel} finishes:
              </p>
              <p className="mt-2 font-mono text-[11px] sm:text-xs text-on-surface break-all leading-snug">{nextRaw}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-stretch">
            <Link
              href={paywallBackHref}
              className="inline-flex justify-center rounded-full border border-outline-variant/25 px-7 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Change selection
            </Link>
            <AsyncButton
              type="button"
              isLoading={loading}
              onClick={() => startPayment()}
              className="btn-gradient text-on-primary px-7 py-3 rounded-full text-sm font-medium tracking-wide justify-center"
            >
              {continueLabel}
            </AsyncButton>
          </div>

          <p className="mt-6 text-xs text-center text-on-surface/45 leading-relaxed">
            Opens {providerLabel} in your browser · secure payment
          </p>
        </div>
      </div>
    </div>
  );
}
