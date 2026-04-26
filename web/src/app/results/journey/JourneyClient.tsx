"use client";

import { useEffect, useMemo, useState } from "react";

type Slot = "AM" | "PM";

type ApiItem = {
  date: string; // YYYY-MM-DD
  slot: Slot;
  completedSteps: string[];
};

const AM_STEPS = [
  { id: "cleanser", label: "Cleanser" },
  { id: "moisturizer", label: "Moisturizer" },
  { id: "spf", label: "SPF (sunscreen)" },
] as const;

const PM_STEPS = [
  { id: "cleanser", label: "Cleanser" },
  { id: "treatment", label: "Treatment (if prescribed)" },
  { id: "moisturizer", label: "Moisturizer" },
] as const;

function ymd(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}

function daysBack(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export function JourneyClient() {
  const today = useMemo(() => ymd(new Date()), []);
  const start = useMemo(() => ymd(daysBack(29)), []);

  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [postedToast, setPostedToast] = useState<string | null>(null);

  const map = useMemo(() => {
    const m = new Map<string, ApiItem>();
    for (const it of items) m.set(`${it.date}:${it.slot}`, it);
    return m;
  }, [items]);

  const todayAm = map.get(`${today}:AM`)?.completedSteps ?? [];
  const todayPm = map.get(`${today}:PM`)?.completedSteps ?? [];

  const streak = useMemo(() => {
    // Simple streak: count consecutive days (from today backwards) where *any* slot has at least 1 step checked.
    const checkedByDate = new Map<string, boolean>();
    for (const it of items) {
      if (it.completedSteps.length) checkedByDate.set(it.date, true);
    }
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = ymd(daysBack(i));
      if (checkedByDate.get(d)) s += 1;
      else break;
    }
    return s;
  }, [items]);

  const completionPct = useMemo(() => {
    const total = AM_STEPS.length + PM_STEPS.length;
    const done = new Set([...todayAm, ...todayPm]).size;
    return Math.round((done / total) * 100);
  }, [todayAm, todayPm]);

  const amComplete = useMemo(() => AM_STEPS.every((s) => todayAm.includes(s.id)), [todayAm]);
  const pmComplete = useMemo(() => PM_STEPS.every((s) => todayPm.includes(s.id)), [todayPm]);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/journey/checkins?start=${start}&end=${today}`, {
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load journey.");
      setItems(Array.isArray(json?.items) ? json.items : []);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggle(slot: Slot, stepId: string) {
    const key = `${today}:${slot}:${stepId}`;
    setSavingKey(key);
    setError(null);
    try {
      const res = await fetch("/api/journey/checkins", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: today, slot, step: stepId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to save.");
      const item = json?.item as ApiItem | undefined;
      if (!item?.date || !item?.slot) return;
      setItems((prev) => {
        const next = prev.filter((p) => !(p.date === item.date && p.slot === item.slot));
        next.push(item);
        next.sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
        return next;
      });
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSavingKey(null);
    }
  }

  async function postUpdate(text: string) {
    setPosting(true);
    setError(null);
    setPostedToast(null);
    try {
      const res = await fetch("/api/messages/thread", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, kind: "checkin" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to send update.");
      setPostedToast("Update sent to Dr. Riris.");
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setPosting(false);
    }
  }

  function formatSlotUpdate(slot: Slot) {
    const steps = slot === "AM" ? todayAm : todayPm;
    const labels = (slot === "AM" ? AM_STEPS : PM_STEPS)
      .filter((s) => steps.includes(s.id))
      .map((s) => s.label);
    const line = labels.length ? labels.join(", ") : "No steps checked";
    return `${slot} done. Completed: ${line}. Feeling okay today.`;
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <section className="col-span-12 lg:col-span-8 space-y-8">
        <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                Day 1–30
              </p>
              <h2 className="mt-3 font-headline tracking-[-0.02em] text-2xl sm:text-3xl">
                Today’s check-in
              </h2>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                Small steps, daily. This is a lightweight v1 checklist (we’ll wire it to your clinician routine next).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.22em] px-3 py-1 rounded-full bg-surface-container-low text-on-surface/60 border border-outline-variant/12">
                {streak} day streak
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] px-3 py-1 rounded-full bg-surface-container-low text-on-surface/60 border border-outline-variant/12">
                {completionPct}% today
              </span>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-outline-variant/15 bg-surface px-5 py-4 text-sm text-on-surface-variant">
              {error}
            </div>
          ) : null}

          {postedToast ? (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4 text-sm text-on-surface">
              {postedToast}
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-surface-container-low p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                Morning (AM)
              </p>
              <div className="space-y-3">
                {AM_STEPS.map((s) => {
                  const checked = todayAm.includes(s.id);
                  const busy = savingKey === `${today}:AM:${s.id}`;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={loading || busy}
                      onClick={() => toggle("AM", s.id)}
                      className={[
                        "w-full flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-colors",
                        checked
                          ? "border-primary/35 bg-primary/10 text-on-surface"
                          : "border-outline-variant/12 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container",
                        loading ? "opacity-60 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      <span className="text-sm font-medium">{s.label}</span>
                      <span className="text-xs text-on-surface/60">
                        {busy ? "Saving…" : checked ? "Done" : "Tap"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-surface-container-low p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                Night (PM)
              </p>
              <div className="space-y-3">
                {PM_STEPS.map((s) => {
                  const checked = todayPm.includes(s.id);
                  const busy = savingKey === `${today}:PM:${s.id}`;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={loading || busy}
                      onClick={() => toggle("PM", s.id)}
                      className={[
                        "w-full flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-colors",
                        checked
                          ? "border-primary/35 bg-primary/10 text-on-surface"
                          : "border-outline-variant/12 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container",
                        loading ? "opacity-60 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      <span className="text-sm font-medium">{s.label}</span>
                      <span className="text-xs text-on-surface/60">
                        {busy ? "Saving…" : checked ? "Done" : "Tap"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-7 rounded-3xl bg-surface-container-low p-6 border border-outline-variant/12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              Next step
            </p>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              When you finish AM or PM, send a quick update to Dr. Riris. This keeps your care thread active and lets us adjust early if anything feels off.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={posting || loading || !amComplete}
                onClick={() => postUpdate(formatSlotUpdate("AM"))}
                className="btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? "Sending…" : "Send AM update"}
              </button>
              <button
                type="button"
                disabled={posting || loading || !pmComplete}
                onClick={() => postUpdate(formatSlotUpdate("PM"))}
                className="btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? "Sending…" : "Send PM update"}
              </button>
              <a
                href="/results"
                className="rounded-full border border-outline-variant/25 bg-surface px-6 py-3 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors text-center"
              >
                Back to inbox
              </a>
            </div>

            <p className="mt-3 text-xs text-on-surface/45">
              Tip: If you’re irritated, type it in the inbox with what product stung and when.
            </p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Calendar</p>
              <p className="mt-2 font-headline tracking-tight text-lg">30-day view</p>
            </div>
            <button
              type="button"
              onClick={() => refresh()}
              className="rounded-full border border-outline-variant/25 bg-surface px-5 py-2.5 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Refresh
            </button>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, idx) => {
              const d = ymd(daysBack(27 - idx));
              const any = (map.get(`${d}:AM`)?.completedSteps?.length ?? 0) + (map.get(`${d}:PM`)?.completedSteps?.length ?? 0) > 0;
              const isToday = d === today;
              return (
                <div
                  key={d}
                  className={[
                    "aspect-square rounded-2xl border flex items-center justify-center text-[10px] uppercase tracking-[0.18em]",
                    isToday
                      ? "border-primary/35 bg-primary/10 text-primary"
                      : any
                        ? "border-outline-variant/15 bg-surface-container-low text-on-surface"
                        : "border-outline-variant/12 bg-surface-container-lowest text-on-surface/40",
                  ].join(" ")}
                  title={d}
                >
                  {Number(d.slice(-2))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="col-span-12 lg:col-span-4 space-y-8">
        <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
            Photos
          </p>
          <p className="font-headline tracking-tight text-lg">Weekly check-ins</p>
          <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
            Coming next: baseline + week 1/2/3/4 photo timeline and comparisons.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {["Baseline", "Week 1", "Week 2", "Week 3"].map((t) => (
              <div
                key={t}
                className="rounded-2xl bg-surface-container-low border border-outline-variant/12 aspect-[4/5] flex items-center justify-center text-xs text-on-surface/45"
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-surface-container-low p-7 sm:p-9 border border-outline-variant/10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
            Navigation
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/results"
              className="rounded-full border border-outline-variant/25 px-6 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors text-center"
            >
              Back to My Journey
            </a>
            <a
              href="/consult/welcome"
              className="btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
            >
              Start consultation
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

