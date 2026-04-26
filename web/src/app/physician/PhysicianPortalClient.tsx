"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AsyncButton } from "@/components/AsyncButton";
import { useToast } from "@/components/ToastProvider";

type CaseRow = {
  id: string;
  publicId: string;
  status: string;
  createdAt: string;
  symptoms: string[];
  note: string | null;
  uploads: { id: string; kind: string; url: string; createdAt: string }[];
  aiJobs?: { id: string; status: string; inputJson: any; createdAt: string }[];
  report: {
    id: string;
    publishedAt: string | null;
    clinicianId: string | null;
    contentJson: any;
    updatedAt: string;
  } | null;
  user: { email: string; name: string | null };
};

function TitleCase(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function PhysicianPortalClient({ initialCases }: { initialCases: CaseRow[] }) {
  const [cases, setCases] = useState<CaseRow[]>(initialCases);
  const [selectedId, setSelectedId] = useState<string | null>(initialCases[0]?.id ?? null);
  const [photoTab, setPhotoTab] = useState<"frontal" | "left" | "right">("frontal");
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast();

  const selected = useMemo(
    () => cases.find((c) => c.id === selectedId) ?? null,
    [cases, selectedId],
  );

  const pendingCount = useMemo(
    () => cases.filter((c) => c.status !== "PUBLISHED").length,
    [cases],
  );

  const aiDraft = (selected?.report?.contentJson as any)?.aiDraft as any | undefined;
  const edits = (selected?.report?.contentJson as any)?.clinicianEdits as
    | { diagnosis?: string; routine?: string }
    | undefined;

  const latestAiInput = (selected?.aiJobs?.[0]?.inputJson ?? null) as any;
  const intake = (latestAiInput?.intake ?? null) as Record<string, any> | null;

  const [draftDiagnosis, setDraftDiagnosis] = useState("");
  const [draftRoutine, setDraftRoutine] = useState("");
  const [routineMode, setRoutineMode] = useState<"builder" | "text">("builder");

  type RoutineCategory =
    | "Cleanser"
    | "Toner"
    | "Serum"
    | "Moisturizer"
    | "Sunscreen"
    | "Treatment"
    | "Exfoliant"
    | "Spot"
    | "Mask"
    | "Other";

  type RoutineSlot = "AM" | "PM";

  type BuiltRoutine = {
    AM: Partial<Record<RoutineCategory, string>>;
    PM: Partial<Record<RoutineCategory, string>>;
    notes?: string;
  };

  const routineCategories: RoutineCategory[] = [
    "Cleanser",
    "Toner",
    "Serum",
    "Moisturizer",
    "Sunscreen",
    "Treatment",
    "Exfoliant",
    "Spot",
    "Mask",
    "Other",
  ];

  const productOptionsByCategory: Record<RoutineCategory, string[]> = {
    Cleanser: ["CeraVe Hydrating Cleanser", "Cetaphil Gentle Skin Cleanser", "Hada Labo Gokujyun Face Wash"],
    Toner: ["Hada Labo Gokujyun Lotion", "Somethinc Supple Power Hyaluronic Toner", "Skip (no toner)"],
    Serum: ["Niacinamide 5–10%", "Vitamin C (AM only)", "Hyaluronic Acid", "Skip (no serum)"],
    Moisturizer: ["Skintific 5X Ceramide Barrier Moisture Gel", "CeraVe Moisturizing Cream", "Skip (no moisturizer)"],
    Sunscreen: ["Azarine Hydrasoothe Sunscreen Gel SPF50", "Biore UV Aqua Rich SPF50", "Any SPF50+ you tolerate"],
    Treatment: ["Azelaic Acid 10%", "Adapalene 0.1% (PM)", "Benzoyl Peroxide 2.5%", "Skip (no treatment)"],
    Exfoliant: ["BHA 2% (1–2x/week)", "PHA/LHA gentle exfoliant", "Skip (no exfoliant)"],
    Spot: ["Hydrocolloid patch", "BPO spot", "Skip (no spot)"],
    Mask: ["Soothing mask (1–2x/week)", "Clay mask (T-zone only)", "Skip (no mask)"],
    Other: ["(Other…)"],
  };

  function emptyBuiltRoutine(): BuiltRoutine {
    return { AM: {}, PM: {}, notes: "" };
  }

  function serializeBuiltRoutine(b: BuiltRoutine) {
    const slotLines = (slot: RoutineSlot) => {
      const entries: Array<[RoutineCategory, string]> = routineCategories
        .filter((c) => c !== "Other")
        .map((c): [RoutineCategory, string] => [c, (b[slot][c] ?? "").trim()])
        .filter(([, v]) => v.length > 0);

      const other = (b[slot].Other ?? "").trim();
      const all: Array<[string, string]> = [
        ...entries,
        ...(other ? [["Other", other] as [string, string]] : []),
      ];

      const rendered = all.length
        ? all.map(([k, v]) => `- ${k}: ${v}`).join("\n")
        : "- (no routine set)";
      return `${slot}:\n${rendered}`;
    };

    const notes = (b.notes ?? "").trim();
    return [slotLines("AM"), "", slotLines("PM"), notes ? `\nNotes:\n${notes}` : ""]
      .join("\n")
      .trim();
  }

  function tryParseBuiltRoutine(text: string): BuiltRoutine | null {
    const t = text.replace(/\r/g, "");
    const amIdx = t.indexOf("\nAM:\n") >= 0 ? t.indexOf("\nAM:\n") + 1 : t.startsWith("AM:\n") ? 0 : -1;
    const pmIdx = t.indexOf("\nPM:\n") >= 0 ? t.indexOf("\nPM:\n") + 1 : t.includes("\nPM:\n") ? t.indexOf("\nPM:\n") + 1 : -1;
    if (amIdx === -1 || pmIdx === -1) return null;

    const amBlock = t.slice(amIdx).split("\nPM:\n")[0]?.replace(/^AM:\n/, "") ?? "";
    const afterPm = t.slice(pmIdx).replace(/^PM:\n/, "");
    const [pmBlock, notesBlockRaw] = afterPm.split("\nNotes:\n");

    const parseBlock = (block: string) => {
      const out: Partial<Record<RoutineCategory, string>> = {};
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .filter((l) => l.startsWith("- "));
      for (const l of lines) {
        const body = l.slice(2);
        const i = body.indexOf(":");
        if (i === -1) continue;
        const k = body.slice(0, i).trim() as RoutineCategory;
        const v = body.slice(i + 1).trim();
        if (!v) continue;
        if (!routineCategories.includes(k)) continue;
        out[k] = v;
      }
      return out;
    };

    const built: BuiltRoutine = {
      AM: parseBlock(amBlock),
      PM: parseBlock(pmBlock ?? ""),
      notes: (notesBlockRaw ?? "").trim(),
    };

    const hasAny =
      Object.values(built.AM).some((v) => String(v).trim().length > 0) ||
      Object.values(built.PM).some((v) => String(v).trim().length > 0) ||
      (built.notes ?? "").trim().length > 0;
    return hasAny ? built : null;
  }

  const [builtRoutine, setBuiltRoutine] = useState<BuiltRoutine>(emptyBuiltRoutine());

  useEffect(() => {
    setDraftDiagnosis(edits?.diagnosis ?? "");
    const r = edits?.routine ?? "";
    setDraftRoutine(r);
    const parsed = r ? tryParseBuiltRoutine(r) : null;
    if (parsed) {
      setBuiltRoutine(parsed);
      setRoutineMode("builder");
    } else {
      setBuiltRoutine(emptyBuiltRoutine());
      // If the existing routine is free-form text, default to text mode to avoid overwriting.
      setRoutineMode(r.trim().length ? "text" : "builder");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (routineMode !== "builder") return;
    setDraftRoutine(serializeBuiltRoutine(builtRoutine));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builtRoutine, routineMode]);

  function productize(step: string) {
    const s = step.toLowerCase();
    if (s.includes("cleanser") || s.includes("cleanse")) return `${step} — CeraVe Hydrating Cleanser`;
    if (s.includes("moistur")) return `${step} — Skintific 5X Ceramide Barrier Moisture Gel`;
    if (s.includes("spf") || s.includes("sunscreen")) return `${step} — Azarine Hydrasoothe Sunscreen Gel SPF50`;
    if (s.includes("azelaic")) return `${step} — Azelaic Acid 10% (pea-size, alternate nights)`;
    if (s.includes("treatment")) return `${step} — (as directed)`;
    return step;
  }

  function fmtYesNo(v: any) {
    if (v === true) return "Yes";
    if (v === false) return "No";
    return "—";
  }

  function humanize(v: any) {
    if (v === undefined || v === null || v === "") return null;
    if (Array.isArray(v)) {
      const list = v.map(humanize).filter(Boolean) as string[];
      return list.length ? list.join(", ") : null;
    }
    const s = String(v);
    const map: Record<string, string> = {
      FEMALE: "Female",
      MALE: "Male",
      PREFER_NOT: "Prefer not to say",
      MILD: "Mild",
      MODERATE: "Moderate",
      SEVERE: "Severe",
      STABLE: "Stable",
      WORSENING: "Worsening",
      FLARES: "Comes and goes",
      "<2H": "< 2 hours",
      "2-4H": "2–4 hours",
      "4H+": "≥ 4 hours",
      NOT_OILY: "Not oily",
      T_ZONE: "T-zone",
      ALL_FACE: "Whole face",
      NONE: "None",
      TIGHT: "Tight",
      NORMAL: "Normal",
      OILY: "Oily",
      PEELING: "Peeling",
      ITCHY: "Itchy",
      DRY_FEEL: "Dry feeling",
      ACNE_MARKS: "Post-acne marks",
      MELASMA: "Melasma",
      FRECKLES: "Freckles",
    };
    return map[s] ?? s;
  }

  function formatIntake(i: Record<string, any>) {
    const lines: Array<{ k: string; v: string }> = [];
    const add = (k: string, v: any) => {
      if (v === undefined || v === null || v === "") return;
      if (Array.isArray(v) && v.length === 0) return;
      lines.push({ k, v: Array.isArray(v) ? v.join(", ") : String(v) });
    };

    add("Age", i.age);
    add("Gender", i.gender);
    add("Chief concern", i.chiefComplaint);
    add("Duration", i.duration);
    add("Severity", i.severity);
    add("Onset", i.onset);
    add("Pattern", i.course);
    add("Oily after wash", i.oilAfterWash);
    add("Oily areas", i.oilyAreas);
    add("After wash feel", i.afterWashFeel);
    add("Barrier signs", i.barrierSigns);
    add("Easy red", fmtYesNo(i.easyRed));
    add("Stings with products", fmtYesNo(i.stingsWithProducts));
    add("Allergy history", fmtYesNo(i.historyAllergy));
    add("Sensitivity note", i.sensitivityNote);
    add("Active acne", fmtYesNo(i.acneActive));
    add("Dark spots", fmtYesNo(i.darkSpots));
    add("Pigmentation types", i.pigmentationTypes);
    add("Extra note", i.extraNote);

    return lines;
  }

  function IntakeSection({
    title,
    rows,
  }: {
    title: string;
    rows: Array<{ k: string; v: any }>;
  }) {
    const visible = rows
      .map((r) => ({ k: r.k, v: humanize(r.v) }))
      .filter((r) => r.v !== null);

    if (!visible.length) return null;

    return (
      <section className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/10">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
          {title}
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
          {visible.map((row) => (
            <div key={row.k} className="flex items-start justify-between gap-3">
              <dt className="text-xs text-on-surface/55">{row.k}</dt>
              <dd className="text-xs text-on-surface-variant leading-relaxed text-right">
                {row.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  async function refreshList() {
    const res = await fetch("/api/physician/cases", { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to refresh.");
    setCases(json.cases as CaseRow[]);
    if (!selectedId && (json.cases as CaseRow[])[0]?.id) setSelectedId((json.cases as CaseRow[])[0].id);
  }

  async function patchCase(payload: { diagnosis?: string; routine?: string; setUnderReview?: boolean }) {
    if (!selected) return;
    if (String(selected.id).startsWith("mock-")) {
      toast.push({
        tone: "info",
        title: "Demo case (no DB row).",
        detail: "Submit a real intake as a USER to generate real cases, then refresh the queue.",
      });
      return;
    }
    setBusy("patch");
    try {
      const res = await fetch(`/api/physician/cases/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Update failed.");
      toast.push({ tone: "success", title: "Saved." });
      await refreshList();
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      toast.push({ tone: "error", title: "Save failed.", detail: msg });
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    if (!selected) return;
    if (String(selected.id).startsWith("mock-")) {
      toast.push({
        tone: "info",
        title: "Demo case (no DB row).",
        detail: "Submit a real intake as a USER to generate real cases, then refresh the queue.",
      });
      return;
    }
    setBusy("publish");
    try {
      const res = await fetch(`/api/physician/cases/${selected.id}/publish`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Publish failed.");
      toast.push({ tone: "success", title: "Published." });
      await refreshList();
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      toast.push({ tone: "error", title: "Publish failed.", detail: msg });
    } finally {
      setBusy(null);
    }
  }

  async function rejectAiSuggestion() {
    const current = edits?.diagnosis ?? "";
    await patchCase({
      diagnosis:
        current ||
        "AI draft rejected. Dermatologist will provide a clinician-led diagnosis.",
      setUnderReview: true,
    });
    toast.push({ tone: "info", title: "AI suggestion rejected." });
  }

  async function saveClinicianEdits() {
    await patchCase({
      diagnosis: draftDiagnosis.trim() || undefined,
      routine: draftRoutine.trim() || undefined,
      setUnderReview: true,
    });
  }

  const patientLabel = selected?.user?.name
    ? TitleCase(selected.user.name)
    : selected?.user?.email
      ? selected.user.email
      : "Patient";

  const photoUrl = (() => {
    if (!selected) return null;
    const pref = photoTab === "frontal" ? "primary" : photoTab;
    return (
      selected.uploads.find((u) => u.kind.toLowerCase() === pref)?.url ??
      selected.uploads[0]?.url ??
      null
    );
  })();

  return (
    <main className="seren-container pt-28 sm:pt-32 pb-16 flex flex-col md:flex-row gap-12 lg:gap-16">
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl font-headline tracking-tight text-on-surface">Case queue</h2>
          <span className="text-xs font-label uppercase tracking-widest text-outline">
            {pendingCount} pending
          </span>
        </div>

        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {cases.map((c) => {
            const active = c.id === selectedId;
            const label = c.user.name ? TitleCase(c.user.name) : c.user.email;
            const subtitle = c.symptoms?.slice(0, 2).join(" • ") || c.status;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={[
                  "w-full text-left p-6 rounded-xl transition-all duration-200 shadow-sm border",
                  active
                    ? "bg-surface-container-lowest border-primary/20 border-l-4 border-l-primary"
                    : "bg-surface-container-low border-outline-variant/10 hover:bg-surface-container",
                ].join(" ")}
              >
                <div className="flex justify-between items-start mb-2 gap-3">
                  <p className="font-headline font-semibold text-on-surface truncate">{label}</p>
                  <span className="text-[10px] uppercase tracking-widest text-outline shrink-0">
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-outline mb-4 line-clamp-2">{subtitle}</p>
                <span className="text-[11px] text-outline italic">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex-grow space-y-12">
        {!selected ? (
          <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-10">
            <p className="text-on-surface-variant">No cases yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-8 items-end">
              <div className="col-span-12 lg:col-span-7">
                <span className="text-primary font-label text-sm tracking-wider mb-2 block">
                  Case {selected.publicId}
                </span>
                <h1 className="text-4xl sm:text-5xl font-headline font-light tracking-tighter text-on-surface mb-4">
                  {patientLabel}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-lg bg-surface-container-high text-sm font-label">
                    {selected.user.email}
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-surface-container-high text-sm font-label">
                    {selected.status}
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 flex flex-wrap justify-end gap-3 pb-2">
                <AsyncButton
                  type="button"
                  onClick={saveClinicianEdits}
                  isLoading={busy === "patch"}
                  className="px-6 py-2.5 rounded-full border border-outline-variant/30 text-on-surface-variant text-sm font-headline hover:bg-surface-container transition-colors disabled:opacity-60"
                >
                  Save edits
                </AsyncButton>
                <AsyncButton
                  type="button"
                  onClick={publish}
                  isLoading={busy === "publish"}
                  className="btn-gradient px-8 py-2.5 rounded-full text-on-primary text-sm font-headline shadow-lg shadow-primary/20"
                >
                  Approve + publish
                </AsyncButton>
                {selected.report?.id ? (
                  <Link
                    href={`/report/${selected.report.id}`}
                    className="px-6 py-2.5 rounded-full border border-outline-variant/20 text-on-surface-variant text-sm font-headline hover:bg-surface-container transition-colors"
                  >
                    View report
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 space-y-6">
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 overflow-hidden border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-headline text-lg">Clinical photography</h3>
                    <div className="flex gap-4 text-xs uppercase tracking-widest font-semibold">
                      <button
                        type="button"
                        onClick={() => setPhotoTab("frontal")}
                        className={photoTab === "frontal" ? "text-primary" : "text-outline/50"}
                      >
                        Frontal
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoTab("left")}
                        className={photoTab === "left" ? "text-primary" : "text-outline/50"}
                      >
                        Left
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoTab("right")}
                        className={photoTab === "right" ? "text-primary" : "text-outline/50"}
                      >
                        Right
                      </button>
                    </div>
                  </div>

                  {photoUrl ? (
                    <div className="aspect-[16/9] rounded-2xl bg-surface-container overflow-hidden border border-outline-variant/10">
                      {/* Using <img> here intentionally: uploads are user-provided URLs (often localhost) */}
                      <img src={photoUrl} alt="Clinical photo" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] rounded-2xl bg-surface-container grid place-items-center text-sm text-on-surface-variant">
                      No photos uploaded
                    </div>
                  )}
                </div>

                <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/10">
                  <h3 className="font-headline text-lg mb-6">Intake insights</h3>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-outline mb-3">
                      Patient snapshot
                    </p>
                    {intake ? (
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/10">
                          <div className="flex flex-wrap gap-2">
                            {humanize(intake.chiefComplaint)
                              ? String(humanize(intake.chiefComplaint))
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                                  .slice(0, 4)
                                  .map((c) => (
                                    <span
                                      key={c}
                                      className="px-3 py-1 rounded-full bg-surface border border-outline-variant/20 text-xs text-on-surface-variant"
                                    >
                                      {c}
                                    </span>
                                  ))
                              : null}
                            {humanize(intake.duration) ? (
                              <span className="px-3 py-1 rounded-full bg-surface border border-outline-variant/20 text-xs text-on-surface-variant">
                                {humanize(intake.duration)}
                              </span>
                            ) : null}
                            {humanize(intake.severity) ? (
                              <span className="px-3 py-1 rounded-full bg-surface border border-outline-variant/20 text-xs text-on-surface-variant">
                                {humanize(intake.severity)}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="rounded-2xl bg-surface p-3 border border-outline-variant/15">
                              <div className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                                Sebum
                              </div>
                              <div className="mt-1 text-xs text-on-surface-variant">
                                {humanize(intake.oilAfterWash) ?? "—"}
                              </div>
                            </div>
                            <div className="rounded-2xl bg-surface p-3 border border-outline-variant/15">
                              <div className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                                Barrier
                              </div>
                              <div className="mt-1 text-xs text-on-surface-variant">
                                {humanize(intake.barrierSigns) ?? "—"}
                              </div>
                            </div>
                            <div className="rounded-2xl bg-surface p-3 border border-outline-variant/15">
                              <div className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                                Sensitivity
                              </div>
                              <div className="mt-1 text-xs text-on-surface-variant">
                                {fmtYesNo(intake.stingsWithProducts) === "Yes" || fmtYesNo(intake.easyRed) === "Yes"
                                  ? "Higher"
                                  : "—"}
                              </div>
                            </div>
                          </div>

                          {humanize(intake.extraNote) ? (
                            <div className="mt-4 rounded-2xl bg-surface p-3 border border-outline-variant/15">
                              <div className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                                Notes
                              </div>
                              <div className="mt-1 text-xs text-on-surface-variant leading-relaxed">
                                {humanize(intake.extraNote)}
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <details className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/10">
                          <summary className="cursor-pointer text-xs text-on-surface-variant">
                            View full intake (grouped)
                          </summary>
                          <div className="mt-4 space-y-3">
                            <IntakeSection
                              title="Profile"
                              rows={[
                                { k: "Age", v: intake.age },
                                { k: "Gender", v: intake.gender },
                              ]}
                            />
                            <IntakeSection
                              title="Chief concern"
                              rows={[
                                { k: "Concern(s)", v: intake.chiefComplaint },
                                { k: "Duration", v: intake.duration },
                                { k: "Severity", v: intake.severity },
                                { k: "Onset", v: intake.onset },
                                { k: "Pattern", v: intake.course },
                              ]}
                            />
                            <IntakeSection
                              title="Skin type (sebum + barrier)"
                              rows={[
                                { k: "Oily after wash", v: intake.oilAfterWash },
                                { k: "Oily areas", v: intake.oilyAreas },
                                { k: "After wash feel", v: intake.afterWashFeel },
                                { k: "Barrier signs", v: intake.barrierSigns },
                              ]}
                            />
                            <IntakeSection
                              title="Sensitivity"
                              rows={[
                                { k: "Easy red", v: fmtYesNo(intake.easyRed) },
                                { k: "Stings with products", v: fmtYesNo(intake.stingsWithProducts) },
                                { k: "Allergy history", v: fmtYesNo(intake.historyAllergy) },
                                { k: "Note", v: intake.sensitivityNote },
                              ]}
                            />
                            <IntakeSection
                              title="Lesions"
                              rows={[
                                { k: "Active acne", v: fmtYesNo(intake.acneActive) },
                                { k: "Dark spots", v: fmtYesNo(intake.darkSpots) },
                                { k: "Pigmentation types", v: intake.pigmentationTypes },
                              ]}
                            />
                            <IntakeSection title="Additional notes" rows={[{ k: "Extra", v: intake.extraNote }]} />
                          </div>
                        </details>
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed bg-surface-container-low p-4 rounded-xl">
                        No intake object found yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-primary">✦</span>
                      <h3 className="font-headline text-lg text-on-primary-container">
                        AI pre-assessment draft
                      </h3>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-on-primary-container/55">
                      Wide view
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="rounded-2xl bg-surface/70 border border-outline-variant/12 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-on-primary-container/60 font-semibold">
                        Severity
                      </p>
                      <p className="mt-3 text-3xl font-headline font-light text-primary tracking-tight">
                        {aiDraft?.severity ?? "—"}
                      </p>
                    </div>

                    <div className="md:col-span-2 rounded-2xl bg-surface/70 border border-outline-variant/12 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-on-primary-container/60 font-semibold">
                        Condition
                      </p>
                      <p className="mt-3 text-sm text-on-primary-container/80 leading-relaxed">
                        {aiDraft?.condition ?? "No AI draft yet. Run the worker to draft reports."}
                      </p>
                    </div>

                    <div className="md:col-span-3 rounded-2xl bg-surface/70 border border-outline-variant/12 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-on-primary-container/60 font-semibold">
                        Routine (AI) — with product examples
                      </p>
                      <p className="mt-3 text-sm text-on-primary-container/80 leading-relaxed">
                        {(aiDraft?.routine?.morning?.length || aiDraft?.routine?.evening?.length) ? (
                          <>
                            <span className="text-on-primary-container/60">AM:</span>{" "}
                            {(aiDraft?.routine?.morning ?? []).slice(0, 5).map((s: string) => productize(s)).join(" • ") || "—"}
                            <br />
                            <span className="text-on-primary-container/60">PM:</span>{" "}
                            {(aiDraft?.routine?.evening ?? []).slice(0, 5).map((s: string) => productize(s)).join(" • ") || "—"}
                          </>
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>

                    <div className="md:col-span-3 rounded-2xl bg-surface/70 border border-outline-variant/12 p-5">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className="text-[10px] uppercase tracking-widest text-on-primary-container/60 font-semibold">
                          Routine picker (physician)
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setRoutineMode("builder")}
                            className={[
                              "px-3 py-1.5 rounded-full text-xs border transition-colors",
                              routineMode === "builder"
                                ? "bg-primary/15 border-primary/30 text-primary"
                                : "bg-surface border-outline-variant/20 text-on-surface-variant hover:bg-surface-container",
                            ].join(" ")}
                          >
                            Structured builder
                          </button>
                          <button
                            type="button"
                            onClick={() => setRoutineMode("text")}
                            className={[
                              "px-3 py-1.5 rounded-full text-xs border transition-colors",
                              routineMode === "text"
                                ? "bg-primary/15 border-primary/30 text-primary"
                                : "bg-surface border-outline-variant/20 text-on-surface-variant hover:bg-surface-container",
                            ].join(" ")}
                          >
                            Free text
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        {routineMode === "builder" ? (
                          <div className="space-y-5">
                            {(["AM", "PM"] as const).map((slot) => (
                              <div key={slot} className="rounded-2xl bg-surface p-4 border border-outline-variant/15">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-xs font-label text-on-surface-variant">{slot} routine</p>
                                  {slot === "AM" ? (
                                    <span className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                                      Morning
                                    </span>
                                  ) : (
                                    <span className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                                      Evening
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {routineCategories.map((cat) => {
                                    const value = (builtRoutine[slot][cat] ?? "").trim();
                                    const options = productOptionsByCategory[cat] ?? ["(Other…)"];
                                    return (
                                      <div
                                        key={`${slot}-${cat}`}
                                        className="rounded-xl bg-surface-container-low p-3 border border-outline-variant/10"
                                      >
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
                                          {cat}
                                        </p>

                                        {cat === "Other" ? (
                                          <input
                                            value={value}
                                            onChange={(e) =>
                                              setBuiltRoutine((prev) => ({
                                                ...prev,
                                                [slot]: { ...prev[slot], Other: e.target.value },
                                              }))
                                            }
                                            className="w-full bg-surface rounded-xl border border-outline-variant/15 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                                            placeholder="Type other product / instruction…"
                                          />
                                        ) : (
                                          <div className="space-y-2">
                                            <select
                                              value={value}
                                              onChange={(e) =>
                                                setBuiltRoutine((prev) => ({
                                                  ...prev,
                                                  [slot]: { ...prev[slot], [cat]: e.target.value },
                                                }))
                                              }
                                              className="w-full bg-surface rounded-xl border border-outline-variant/15 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                                            >
                                              <option value="">— Select —</option>
                                              {options
                                                .filter((o) => o !== "(Other…)")
                                                .map((o) => (
                                                  <option key={o} value={o}>
                                                    {o}
                                                  </option>
                                                ))}
                                              <option value="(Other…)">(Other…)</option>
                                            </select>

                                            {value === "(Other…)" ? (
                                              <input
                                                value={(builtRoutine[slot][cat] ?? "").trim() === "(Other…)" ? "" : value}
                                                onChange={(e) =>
                                                  setBuiltRoutine((prev) => ({
                                                    ...prev,
                                                    [slot]: { ...prev[slot], [cat]: e.target.value },
                                                  }))
                                                }
                                                className="w-full bg-surface rounded-xl border border-outline-variant/15 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                                                placeholder="Type product name / instruction…"
                                              />
                                            ) : null}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}

                            <div className="rounded-2xl bg-surface p-4 border border-outline-variant/15">
                              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
                                Notes (patient)
                              </p>
                              <textarea
                                value={builtRoutine.notes ?? ""}
                                onChange={(e) => setBuiltRoutine((prev) => ({ ...prev, notes: e.target.value }))}
                                rows={3}
                                className="w-full bg-surface rounded-xl border border-outline-variant/15 px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                                placeholder="Optional: frequency, warnings, how to layer, patch test advice…"
                              />
                            </div>
                          </div>
                        ) : (
                          <textarea
                            value={draftRoutine}
                            onChange={(e) => setDraftRoutine(e.target.value)}
                            rows={8}
                            className="w-full bg-surface rounded-xl border border-outline-variant/15 px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                            placeholder="AM: …\nPM: …\nNotes: …"
                          />
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-3 rounded-2xl bg-surface/70 border border-outline-variant/12 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-on-primary-container/60 font-semibold">
                        Patient note
                      </p>
                      <p className="mt-3 text-sm text-on-primary-container/80 leading-relaxed">
                        {selected.note ? selected.note : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/10">
                  <p className="text-[10px] uppercase tracking-widest text-outline mb-3">
                    Symptoms (quick)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(selected.symptoms?.length ? selected.symptoms : ["—"]).map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/10">
                  <p className="text-[10px] uppercase tracking-widest text-outline mb-3">
                    Clinician edits (what patient will see)
                  </p>
                  <div className="space-y-3">
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
                        Diagnosis
                      </p>
                      <textarea
                        value={draftDiagnosis}
                        onChange={(e) => setDraftDiagnosis(e.target.value)}
                        rows={4}
                        className="w-full bg-surface rounded-xl border border-outline-variant/15 px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                        placeholder="Write clinician diagnosis in patient-friendly language…"
                      />
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
                        Routine (patient-ready)
                      </p>
                      <textarea
                        value={draftRoutine}
                        onChange={(e) => setDraftRoutine(e.target.value)}
                        rows={8}
                        className="w-full bg-surface rounded-xl border border-outline-variant/15 px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                        placeholder="AM: …\nPM: …\nNotes: …"
                      />
                    </div>
                    <p className="text-xs text-on-surface/45">
                      Tip: click “Save edits” at the top right after changing diagnosis/routine.
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
                  <h3 className="font-headline text-lg mb-4">Clinician actions</h3>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={rejectAiSuggestion}
                      disabled={busy !== null}
                      className="w-full px-6 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant text-sm font-headline hover:bg-surface-container transition-colors disabled:opacity-60"
                    >
                      Reject AI suggestion
                    </button>
                    <AsyncButton
                      type="button"
                      onClick={publish}
                      isLoading={busy === "publish"}
                      className="w-full btn-gradient px-6 py-3 rounded-full text-on-primary text-sm font-headline shadow-lg shadow-primary/20"
                    >
                      Approve + publish
                    </AsyncButton>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

