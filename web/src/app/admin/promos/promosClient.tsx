"use client";

import { useMemo, useState } from "react";
import { AsyncButton } from "@/components/AsyncButton";
import { useToast } from "@/components/ToastProvider";

type Row = {
  id: string;
  code: string;
  kind: "PERCENT" | "AMOUNT";
  percentOff: number | null;
  amountOffIdr: number | null;
  eligiblePlans: string[];
  expiresAt: string | null;
  maxRedemptions: number | null;
  createdAt: string;
  _count: { redemptions: number };
};

export function AdminPromosClient({ initialCoupons }: { initialCoupons: Row[] }) {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>(initialCoupons);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((r) => r.code.toLowerCase().includes(query));
  }, [q, rows]);

  async function createFromForm() {
    const code = (document.getElementById("c_code") as HTMLInputElement | null)?.value ?? "";
    const kind = (document.getElementById("c_kind") as HTMLSelectElement | null)?.value ?? "PERCENT";
    const percentOff = (document.getElementById("c_percent") as HTMLInputElement | null)?.value ?? "";
    const amountOffIdr = (document.getElementById("c_amount") as HTMLInputElement | null)?.value ?? "";
    const eligiblePlans = (document.getElementById("c_plans") as HTMLInputElement | null)?.value ?? "";
    const expiresAt = (document.getElementById("c_expires") as HTMLInputElement | null)?.value ?? "";
    const maxRedemptions = (document.getElementById("c_max") as HTMLInputElement | null)?.value ?? "";

    setBusy("create");
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          kind,
          percentOff: percentOff ? Number(percentOff) : undefined,
          amountOffIdr: amountOffIdr ? Number(amountOffIdr) : undefined,
          eligiblePlans: eligiblePlans
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
          maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Create failed.");
      setRows((prev) => [json.coupon as Row, ...prev]);
      toast.push({ tone: "success", title: "Coupon created." });
    } catch (e: any) {
      toast.push({ tone: "error", title: "Create failed.", detail: String(e?.message ?? e) });
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Delete failed.");
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.push({ tone: "success", title: "Coupon deleted." });
    } catch (e: any) {
      toast.push({ tone: "error", title: "Delete failed.", detail: String(e?.message ?? e) });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-5 sm:p-6">
        <p className="font-headline tracking-tight text-base">Create coupon</p>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="c_code"
            placeholder="CODE (e.g. SEREN10)"
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select
            id="c_kind"
            defaultValue="PERCENT"
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="PERCENT">Percent</option>
            <option value="AMOUNT">Amount (IDR)</option>
          </select>
          <input
            id="c_percent"
            placeholder="percentOff (0-100)"
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            id="c_amount"
            placeholder="amountOffIdr (e.g. 10000)"
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            id="c_plans"
            placeholder="eligiblePlans (comma: single, journey)"
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            id="c_expires"
            placeholder="expiresAt (YYYY-MM-DD)"
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            id="c_max"
            placeholder="maxRedemptions (optional)"
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="mt-5">
          <AsyncButton
            type="button"
            isLoading={busy === "create"}
            onClick={createFromForm}
            className="btn-gradient text-on-primary px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-headline"
          >
            Create
          </AsyncButton>
        </div>
      </div>

      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="font-headline tracking-tight text-base">Coupons</p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search code…"
            className="w-full sm:w-72 rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              <tr className="border-b border-outline-variant/10">
                <th className="text-left py-3 px-5">Code</th>
                <th className="text-left py-3 px-5">Discount</th>
                <th className="text-left py-3 px-5">Plans</th>
                <th className="text-left py-3 px-5">Expires</th>
                <th className="text-left py-3 px-5">Used</th>
                <th className="text-right py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-outline-variant/10">
                  <td className="py-4 px-5 text-on-surface font-medium">{r.code}</td>
                  <td className="py-4 px-5">
                    {r.kind === "PERCENT" ? `${r.percentOff ?? 0}%` : `Rp ${(r.amountOffIdr ?? 0).toLocaleString("id-ID")}`}
                  </td>
                  <td className="py-4 px-5">{(r.eligiblePlans ?? []).join(", ") || "—"}</td>
                  <td className="py-4 px-5">
                    {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-4 px-5">
                    {r._count.redemptions}
                    {r.maxRedemptions != null ? ` / ${r.maxRedemptions}` : ""}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <AsyncButton
                      type="button"
                      isLoading={busy === r.id}
                      onClick={() => remove(r.id)}
                      className="rounded-full border border-outline-variant/25 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      Delete
                    </AsyncButton>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td className="py-10 px-5 text-center text-on-surface/45" colSpan={6}>
                    No coupons.
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

