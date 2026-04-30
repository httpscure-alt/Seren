"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { AsyncButton } from "@/components/AsyncButton";

export function PaywallCheckoutClient() {
  const sp = useSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const paymentProvider = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "").toUpperCase();
  const providerLabel =
    paymentProvider === "XENDIT"
      ? "Xendit"
      : paymentProvider === "DUITKU"
      ? "Duitku"
      : "Midtrans";

  const plan = (sp.get("plan") ?? "journey") as "single" | "journey";
  const next = sp.get("next") ?? "/results";
  const coupon = sp.get("coupon") ?? "";

  const payload = useMemo(() => ({ plan, next, coupon }), [plan, next, coupon]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/payments/midtrans/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Payment init failed.");
        if (json?.redirectUrl) {
          window.location.href = String(json.redirectUrl);
          return;
        }
        toast.push({ tone: "success", title: "Access activated." });
        window.location.href = next;
      } catch (e: any) {
        toast.push({
          tone: "error",
          title: "Could not start payment.",
          detail: e?.message ? String(e.message) : "Try again.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [payload, next, toast]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="seren-container pt-28 sm:pt-32 pb-24">
        <div className="max-w-lg mx-auto rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-8 sm:p-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
            Secure checkout
          </p>
          <h1 className="font-headline tracking-tight text-2xl">Connecting to {providerLabel}…</h1>
          <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
            We’ll open {providerLabel} to complete your payment. If nothing happens, tap below.
          </p>
          <AsyncButton
            type="button"
            isLoading={loading}
            onClick={() => window.location.reload()}
            className="mt-8 btn-gradient text-on-primary px-7 py-3 rounded-full text-sm font-medium tracking-wide"
          >
            Retry
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}

