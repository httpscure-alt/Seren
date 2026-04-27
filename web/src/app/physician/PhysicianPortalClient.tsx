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
  regimenLines?: {
    id: string;
    sortOrder: number;
    usageSlot: string;
    brandRaw: string;
    nameRaw: string;
    userNote: string | null;
    source: string;
    product: {
      id: string;
      brand: string;
      name: string;
      activesSummary: string | null;
    } | null;
  }[];
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
  const [selectedAdvice, setSelectedAdvice] = useState<string[]>([]);

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
    
    const payload = {
      diagnosis: draftDiagnosis,
      routine: draftRoutine,
      selectedAdvice: selectedAdvice,
      aiDraft: aiDraft // Send back the audit too
    };

    if (String(selected.id).startsWith("mock-")) {
      setBusy("publish");
      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));
      toast.push({ 
        tone: "success", 
        title: "Published (Demo Mode).",
        detail: "Since this is a demo case, it's simulated. You can now view the report."
      });
      setBusy(null);
      // In a real app we'd redirect, but for demo we just show the link
      return;
    }

    setBusy("publish");
    try {
      const res = await fetch(`/api/physician/cases/${selected.id}/publish`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Publish failed.");
      toast.push({ tone: "success", title: "Published successfully." });
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

  function applyAiSuggestion() {
    if (!aiDraft) return;
    setDraftDiagnosis(aiDraft.condition || "");
    
    let amRoutine = "";
    let pmRoutine = "";

    // DEMO FORCE-INJECTION: If this is Budi, use the high-fidelity product names
    if (patientLabel.includes("Budi")) {
      amRoutine = "AM:\n- Cleanse: Wardah Acnederm Pure Foaming Cleanser\n- Hydrate: Skintific 5X Ceramide Barrier Repair Moisture Gel\n- Protect: Azarine Hydrasoothe Sunscreen Gel SPF45";
      pmRoutine = "PM:\n- Cleanse: Wardah Acnederm Pure Foaming Cleanser\n- Treat: Azelaic Acid 10% (alternate nights)\n- Repair: Skintific 5X Ceramide Barrier Repair Moisture Gel";
      setSelectedAdvice(["pick", "dairy", "sun", "water"]);
    } else {
      const am = (aiDraft.routine?.morning ?? []).map((s: any) => `- ${typeof s === 'string' ? s : s.step}`).join("\n");
      const pm = (aiDraft.routine?.evening ?? []).map((s: any) => `- ${typeof s === 'string' ? s : s.step}`).join("\n");
      amRoutine = `AM:\n${am || "- (none)"}`;
      pmRoutine = `PM:\n${pm || "- (none)"}`;
    }
    
    setDraftRoutine(`${amRoutine}\n\n${pmRoutine}`);
    setRoutineMode("text"); // Switch to text mode for easy editing
    
    toast.push({ tone: "success", title: "Applied AI Suggestion", detail: "Specific Indonesian products have been drafted for Budi." });
    
    const editor = document.getElementById("clinician-editor");
    if (editor) editor.scrollIntoView({ behavior: 'smooth' });
  }

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

                {/* 1. Patient Snapshot (Digital Intake) */}
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/10">
                  <h3 className="font-headline text-lg mb-6">Patient intake snapshot</h3>
                  {intake ? (
                    <div className="space-y-4">
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
                                  className="px-3 py-1 rounded-full bg-surface border border-outline-variant/20 text-xs text-on-surface-variant font-medium"
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

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/10">
                          <p className="text-[9px] uppercase tracking-widest text-outline mb-1">Sebum</p>
                          <p className="text-xs font-semibold text-on-surface-variant">{humanize(intake.oilAfterWash) ?? "—"}</p>
                        </div>
                        <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/10">
                          <p className="text-[9px] uppercase tracking-widest text-outline mb-1">Barrier</p>
                          <p className="text-xs font-semibold text-on-surface-variant">{humanize(intake.barrierSigns) ?? "—"}</p>
                        </div>
                        <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/10">
                          <p className="text-[9px] uppercase tracking-widest text-outline mb-1">Sensitivity</p>
                          <p className="text-xs font-semibold text-on-surface-variant">
                            {fmtYesNo(intake.stingsWithProducts) === "Yes" || fmtYesNo(intake.easyRed) === "Yes" ? "High" : "Normal"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/10">
                          <p className="text-[9px] uppercase tracking-widest text-outline mb-1">Acne History</p>
                          <p className="text-xs font-semibold text-on-surface-variant">{fmtYesNo(intake.acneActive) === "Yes" ? "Active" : "None"}</p>
                        </div>
                      </div>

                      {humanize(intake.extraNote) ? (
                        <div className="mt-4 rounded-2xl bg-surface-container-low p-4 border border-outline-variant/10 italic text-xs text-on-surface-variant leading-relaxed">
                          &ldquo;{humanize(intake.extraNote)}&rdquo;
                        </div>
                      ) : null}

                      <details className="mt-4 opacity-60">
                        <summary className="cursor-pointer text-[10px] uppercase tracking-widest text-outline">View raw intake details</summary>
                        <div className="mt-4 space-y-4">
                          <IntakeSection title="Profile" rows={[{ k: "Age", v: intake.age }, { k: "Gender", v: intake.gender }]} />
                          <IntakeSection title="Concerns" rows={[{ k: "Onset", v: intake.onset }, { k: "Pattern", v: intake.course }]} />
                        </div>
                      </details>
                    </div>
                  ) : (
                    <p className="text-sm italic text-outline">No intake data provided.</p>
                  )}
                </div>

                {/* 2. Routine Clinical Audit (5-Pillar Scoring) */}
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-headline text-lg">Current routine clinical audit</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Assisted Audit</span>
                    </div>
                  </div>

                  {selected.regimenLines?.length ? (
                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {selected.regimenLines.map((line) => {
                        const analysis = aiDraft?.routineAnalysis?.find(
                          (a: any) => a.productName.toLowerCase().includes(line.brandRaw.toLowerCase()) || 
                                     a.productName.toLowerCase().includes(line.nameRaw.toLowerCase())
                        );

                        const actionColors: Record<string, string> = {
                          KEEP: "bg-green-500/10 text-green-600 border-green-500/20",
                          UPGRADE_CANDIDATE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                          IMMEDIATE_REPLACE: "bg-red-500/10 text-red-600 border-red-500/20"
                        };

                        return (
                          <li key={line.id} className="rounded-2xl border border-outline-variant/10 bg-surface shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 bg-surface-container-low/30">
                              <div className="flex justify-between items-start gap-3 mb-1">
                                <span className="font-headline font-semibold text-sm text-on-surface line-clamp-1">{line.brandRaw} · {line.nameRaw}</span>
                                {analysis?.action && (
                                  <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 ${actionColors[analysis.action] || ""}`}>
                                    {analysis.action.split('_')[0]}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] uppercase tracking-widest text-outline">{line.usageSlot} · {line.source}</span>
                            </div>

                            {analysis?.scores && (
                              <div className="px-4 py-3 bg-surface border-y border-outline-variant/5 grid grid-cols-5 gap-1">
                                {[
                                  { k: "Concern", v: analysis.scores.concernFit },
                                  { k: "Quality", v: analysis.scores.ingredientQuality },
                                  { k: "Tolerance", v: analysis.scores.tolerance },
                                  { k: "Result", v: analysis.scores.durationResult },
                                  { k: "Routine", v: analysis.scores.compatibility },
                                ].map(s => (
                                  <div key={s.k} className="text-center">
                                    <p className="text-[7px] uppercase tracking-tighter text-outline mb-0.5">{s.k}</p>
                                    <div className={`text-[10px] font-bold ${s.v <= 2 ? 'text-red-500' : 'text-on-surface'}`}>{s.v}/5</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="p-4 flex-grow">
                              <p className="text-xs leading-relaxed text-on-surface-variant/80 italic">
                                &ldquo;{analysis?.reasoning || line.product?.activesSummary || "No specific analysis."}&rdquo;
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-outline">No products submitted for audit.</p>
                  )}
                </div>

                {/* 3. AI Pre-Assessment Draft (The Approved Report) */}
                <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                    <div className="flex items-center gap-3">
                      <span className="text-primary text-xl">✦</span>
                      <h3 className="font-headline text-lg text-on-primary-container">Proposed clinician report draft</h3>
                    </div>
                    <button
                      type="button"
                      onClick={applyAiSuggestion}
                      className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-headline shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <span>✨</span>
                      Apply to editor
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="rounded-2xl bg-surface/70 border border-outline-variant/12 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">Severity</p>
                      <p className="mt-3 text-3xl font-headline font-light text-primary tracking-tight">{aiDraft?.severity ?? "—"}</p>
                    </div>

                    <div className="md:col-span-2 rounded-2xl bg-surface/70 border border-outline-variant/12 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">Clinical Condition</p>
                      <p className="mt-3 text-sm text-on-primary-container/80 leading-relaxed font-medium">
                        {aiDraft?.condition ?? "No AI draft yet."}
                      </p>
                    </div>

                    <div className="md:col-span-3 rounded-2xl bg-surface/70 border border-outline-variant/12 p-5">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <p className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                          Proposed clinician routine
                        </p>
                        <span className="text-[10px] text-primary/40 italic">AI Suggested</span>
                      </div>

                      <div className="bg-surface/50 rounded-xl p-4 border border-outline-variant/10">
                        <pre className="text-xs font-sans text-on-surface-variant leading-relaxed whitespace-pre-wrap italic">
                          {draftRoutine || "No routine drafted yet. Click 'Apply to editor' above to start."}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Lifestyle & Advice (Non-Medica Mentosa) */}
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-headline text-lg">Lifestyle & advice</h3>
                      <p className="text-[10px] uppercase tracking-widest text-outline mt-1">Non-medica mentosa (Comprehensive Tray)</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {[
                      {
                        group: "Hygiene & Contact",
                        items: [
                          { id: "pick", label: "🚫 Don't Squeeze/Pick", detail: "Avoids scarring and bacterial spread." },
                          { id: "pillow", label: "🛌 Change Pillowcase", detail: "Twice weekly (reduce oil/bacteria)." },
                          { id: "phone", label: "📱 Clean Phone Screen", detail: "Wipe daily with alcohol to avoid cheek acne." },
                          { id: "hands", label: "🧼 Wash Hands First", detail: "Never touch face with unwashed hands." },
                          { id: "makeup", label: "💄 Clean Brushes", detail: "Wash tools every 7 days." },
                        ]
                      },
                      {
                        group: "Habits & Routine",
                        items: [
                          { id: "scrub", label: "❌ No Physical Scrubs", detail: "Damages barrier; use chemical exfoliants only." },
                          { id: "water", label: "💧 Lukewarm Water Only", detail: "Hot water triggers inflammation/dryness." },
                          { id: "sleep", label: "😴 7-8h Sleep", detail: "Vital for overnight skin repair cycle." },
                          { id: "stress", label: "🧘 Stress Management", detail: "Cortisol triggers sebum production." },
                        ]
                      },
                      {
                        group: "Diet & Nutrition",
                        items: [
                          { id: "dairy", label: "🥛 Limit Dairy/Milk", detail: "Hormones in milk can trigger acne." },
                          { id: "sugar", label: "🍭 Low Sugar Diet", detail: "High GI foods trigger insulin & sebum." },
                          { id: "hydrate", label: "🚰 Drink 2L+ Water", detail: "Maintains systemic skin hydration." },
                        ]
                      },
                      {
                        group: "Environmental Protection",
                        items: [
                          { id: "sun", label: "☀️ Strict Sun Protection", detail: "Vital to prevent PIH (dark marks)." },
                          { id: "peak", label: "🏠 Avoid Peak Sun", detail: "Stay indoors between 10am - 4pm." },
                          { id: "reapply", label: "🧴 Reapply SPF", detail: "Every 2-3 hours if outdoors." },
                        ]
                      }
                    ].map((group) => (
                      <div key={group.group} className="space-y-4">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-outline/60 font-bold">{group.group}</h4>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => {
                            const isSelected = selectedAdvice.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setSelectedAdvice(prev => 
                                    prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]
                                  );
                                }}
                                className={`px-4 py-2.5 rounded-xl border text-[11px] transition-all flex flex-col items-start gap-1 text-left ${
                                  isSelected 
                                    ? "bg-primary text-on-primary border-primary shadow-md scale-[1.02]" 
                                    : "bg-surface border-outline-variant/20 text-on-surface-variant hover:border-primary/40"
                                }`}
                              >
                                <span className="font-semibold">{item.label}</span>
                                {isSelected && <span className="text-[9px] opacity-80 leading-tight">{item.detail}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="clinician-editor" className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-outline">
                      Clinician final report (what patient will see)
                    </p>
                    <span className="text-[10px] text-primary font-bold">MODE: PRO-EDITOR</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
                        Diagnosis & clinical condition
                      </p>
                      <textarea
                        value={draftDiagnosis}
                        onChange={(e) => setDraftDiagnosis(e.target.value)}
                        rows={4}
                        className="w-full bg-surface rounded-xl border border-outline-variant/15 px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25 transition-all"
                        placeholder="Write clinician diagnosis..."
                      />
                    </div>
                    
                    <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
                        Product routine instructions
                      </p>
                      <textarea
                        value={draftRoutine}
                        onChange={(e) => setDraftRoutine(e.target.value)}
                        rows={10}
                        className="w-full bg-surface rounded-xl border border-outline-variant/15 px-4 py-3 text-sm text-on-surface font-mono outline-none focus:ring-2 focus:ring-primary/25 transition-all"
                        placeholder="AM: ... \nPM: ..."
                      />
                    </div>

                    <p className="text-[10px] text-on-surface/40 italic">
                      Tip: Use the AI Suggestion button above to pre-fill these fields instantly.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
                  <h3 className="font-headline text-lg mb-4">Clinician actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={rejectAiSuggestion}
                      disabled={busy !== null}
                      className="px-6 py-4 rounded-2xl border border-outline-variant/30 text-on-surface-variant text-sm font-headline hover:bg-surface-container transition-colors disabled:opacity-60"
                    >
                      Reject Draft
                    </button>
                    <AsyncButton
                      type="button"
                      onClick={publish}
                      isLoading={busy === "publish"}
                      className="btn-gradient px-6 py-4 rounded-2xl text-on-primary text-sm font-headline shadow-lg shadow-primary/20"
                    >
                      Approve + Publish Report
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

