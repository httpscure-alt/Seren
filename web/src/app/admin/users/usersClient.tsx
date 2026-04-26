"use client";

import { useMemo, useState } from "react";
import { AsyncButton } from "@/components/AsyncButton";
import { useToast } from "@/components/ToastProvider";

type Row = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "PHYSICIAN" | "ADMIN";
  createdAt: string;
  _count: { cases: number; subscriptions: number; payments: number };
};

export function AdminUsersClient({ initialUsers }: { initialUsers: Row[] }) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [users, setUsers] = useState<Row[]>(initialUsers);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(query) ||
        (u.name ?? "").toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query),
    );
  }, [q, users]);

  async function setRole(userId: string, role: Row["role"]) {
    setBusyId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update role.");
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      toast.push({ tone: "success", title: "Role updated." });
    } catch (e: any) {
      toast.push({ tone: "error", title: "Role update failed.", detail: String(e?.message ?? e) });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-headline tracking-tight text-base">User directory</p>
          <p className="text-xs text-on-surface/45 mt-1">Role changes take effect immediately.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, role…"
          className="w-full sm:w-72 rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
            <tr className="border-b border-outline-variant/10">
              <th className="text-left py-3 px-5">User</th>
              <th className="text-left py-3 px-5">Role</th>
              <th className="text-left py-3 px-5">Cases</th>
              <th className="text-left py-3 px-5">Subscriptions</th>
              <th className="text-left py-3 px-5">Payments</th>
              <th className="text-right py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="text-on-surface-variant">
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-outline-variant/10">
                <td className="py-4 px-5">
                  <div className="text-on-surface font-medium">{u.name ?? u.email}</div>
                  <div className="text-xs text-on-surface/45">{u.email}</div>
                </td>
                <td className="py-4 px-5 text-on-surface">{u.role}</td>
                <td className="py-4 px-5">{u._count.cases}</td>
                <td className="py-4 px-5">{u._count.subscriptions}</td>
                <td className="py-4 px-5">{u._count.payments}</td>
                <td className="py-4 px-5">
                  <div className="flex justify-end gap-2">
                    <AsyncButton
                      type="button"
                      isLoading={busyId === u.id}
                      onClick={() => setRole(u.id, "USER")}
                      className="rounded-full border border-outline-variant/25 px-3 py-1.5 text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      USER
                    </AsyncButton>
                    <AsyncButton
                      type="button"
                      isLoading={busyId === u.id}
                      onClick={() => setRole(u.id, "PHYSICIAN")}
                      className="rounded-full border border-outline-variant/25 px-3 py-1.5 text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      PHYSICIAN
                    </AsyncButton>
                    <AsyncButton
                      type="button"
                      isLoading={busyId === u.id}
                      onClick={() => setRole(u.id, "ADMIN")}
                      className="rounded-full border border-outline-variant/25 px-3 py-1.5 text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      ADMIN
                    </AsyncButton>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length ? (
              <tr>
                <td className="py-10 px-5 text-center text-on-surface/45" colSpan={6}>
                  No matches.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

