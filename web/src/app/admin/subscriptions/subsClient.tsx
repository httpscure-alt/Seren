"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { AsyncButton } from "@/components/AsyncButton";

type SubRow = {
  id: string;
  userId: string;
  plan: "SINGLE" | "JOURNEY_30D";
  status: "ACTIVE" | "EXPIRED" | "CANCELED";
  startsAt: string;
  expiresAt: string;
  provider: "MIDTRANS";
  providerRef: string | null;
  user: { email: string; name: string | null };
};

type PayRow = {
  id: string;
  userId: string;
  provider: "MIDTRANS";
  orderId: string;
  amountIdr: number;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELED";
  createdAt: string;
  user: { email: string; name: string | null };
};

export function AdminSubscriptionsClient({
  initialSubs,
  initialPayments,
}: {
  initialSubs: SubRow[];
  initialPayments: PayRow[];
}) {
  const toast = useToast();
  const [subs, setSubs] = useState(initialSubs);
  const [payments] = useState(initialPayments);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return subs;
    return subs.filter(
      (s) =>
        s.user.email.toLowerCase().includes(query) ||
        (s.user.name ?? "").toLowerCase().includes(query) ||
        s.plan.toLowerCase().includes(query) ||
        s.status.toLowerCase().includes(query),
    );
  }, [q, subs]);

  async function grant(userEmail: string, plan: "SINGLE" | "JOURNEY_30D") {
    setBusy("grant");
    try {
      const res = await fetch("/api/admin/subscriptions/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, plan }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Grant failed.");
      setSubs((prev) => [json.subscription as SubRow, ...prev]);
      toast.push({ tone: "success", title: "Subscription granted." });
    } catch (e: any) {
      toast.push({ tone: "error", title: "Grant failed.", detail: String(e?.message ?? e) });
    } finally {
      setBusy(null);
    }
  }

  async function revoke(subId: string) {
    setBusy(subId);
    try {
      const res = await fetch(`/api/admin/subscriptions/${subId}/revoke`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Revoke failed.");
      setSubs((prev) => prev.map((s) => (s.id === subId ? { ...s, status: "CANCELED" } : s)));
      toast.push({ tone: "success", title: "Subscription revoked." });
    } catch (e: any) {
      toast.push({ tone: "error", title: "Revoke failed.", detail: String(e?.message ?? e) });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="font-headline tracking-tight text-base">Manual grant</p>
            <p className="text-xs text-on-surface/45 mt-1">
              Use for support or comped access (creates an ACTIVE subscription).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              placeholder="user@example.com"
              id="grantEmail"
              className="w-full sm:w-72 rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <AsyncButton
              type="button"
              isLoading={busy === "grant"}
              onClick={() => {
                const el = document.getElementById("grantEmail") as HTMLInputElement | null;
                const email = el?.value?.trim().toLowerCase();
                if (!email) {
                  toast.push({ tone: "error", title: "Enter an email." });
                  return;
                }
                grant(email, "JOURNEY_30D");
              }}
              className="btn-gradient text-on-primary px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-headline"
            >
              Grant 30D
            </AsyncButton>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="font-headline tracking-tight text-base">Subscriptions</p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email, plan, status…"
            className="w-full sm:w-72 rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              <tr className="border-b border-outline-variant/10">
                <th className="text-left py-3 px-5">User</th>
                <th className="text-left py-3 px-5">Plan</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-left py-3 px-5">Expires</th>
                <th className="text-right py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-outline-variant/10">
                  <td className="py-4 px-5">
                    <div className="text-on-surface">{s.user.name ?? s.user.email}</div>
                    <div className="text-xs text-on-surface/45">{s.user.email}</div>
                  </td>
                  <td className="py-4 px-5 text-on-surface">{s.plan}</td>
                  <td className="py-4 px-5">{s.status}</td>
                  <td className="py-4 px-5">{new Date(s.expiresAt).toLocaleString()}</td>
                  <td className="py-4 px-5 text-right">
                    <AsyncButton
                      type="button"
                      isLoading={busy === s.id}
                      onClick={() => revoke(s.id)}
                      className="rounded-full border border-outline-variant/25 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      Revoke
                    </AsyncButton>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td className="py-10 px-5 text-center text-on-surface/45" colSpan={5}>
                    No subscriptions.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-outline-variant/10">
          <p className="font-headline tracking-tight text-base">Payments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              <tr className="border-b border-outline-variant/10">
                <th className="text-left py-3 px-5">Order</th>
                <th className="text-left py-3 px-5">User</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-right py-3 px-5">Amount</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {payments.slice(0, 50).map((p) => (
                <tr key={p.id} className="border-b border-outline-variant/10">
                  <td className="py-4 px-5 text-on-surface">{p.orderId}</td>
                  <td className="py-4 px-5">
                    <div className="text-on-surface">{p.user.name ?? p.user.email}</div>
                    <div className="text-xs text-on-surface/45">{p.user.email}</div>
                  </td>
                  <td className="py-4 px-5">{p.status}</td>
                  <td className="py-4 px-5 text-right">Rp {p.amountIdr.toLocaleString("id-ID")}</td>
                </tr>
              ))}
              {!payments.length ? (
                <tr>
                  <td className="py-10 px-5 text-center text-on-surface/45" colSpan={4}>
                    No payments.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

