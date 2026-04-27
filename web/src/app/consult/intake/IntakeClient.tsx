"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AsyncButton } from "@/components/AsyncButton";
import { useToast } from "@/components/ToastProvider";
import type { Dictionary, Lang } from "@/i18n/types";
import { RegimenCatalogPicker, type RegimenLineSubmit } from "@/components/RegimenCatalogPicker";

type Gender = "FEMALE" | "MALE" | "PREFER_NOT";
type Severity = "MILD" | "MODERATE" | "SEVERE";
type Course = "STABLE" | "WORSENING" | "FLARES";

type IntakeDraft = {
  v: 1;
  age?: number;
  gender?: Gender;

  chiefComplaint: string[];
  chiefComplaintOther?: string;
  duration?: string;
  severity?: Severity;

  onset?: string;
  course?: Course;

  oilAfterWash?: "<2H" | "2-4H" | "4H+" | "NOT_OILY";
  oilyAreas: Array<"T_ZONE" | "ALL_FACE" | "NONE">;

  afterWashFeel?: "TIGHT" | "NORMAL" | "OILY";
  barrierSigns: Array<"PEELING" | "ITCHY" | "DRY_FEEL">;

  easyRed?: boolean;
  stingsWithProducts?: boolean;
  historyAllergy?: boolean;
  sensitivityNote?: string;

  acneActive?: boolean;
  darkSpots?: boolean;
  pigmentationTypes: Array<"ACNE_MARKS" | "MELASMA" | "FRECKLES">;

  extraNote?: string;
  regimenLines: RegimenLineSubmit[];
};

const STORAGE_KEY = "seren.intakeDraft.v1";
/** ~4MB binary → base64 stays under typical serverless body limits */
const MAX_PRIMARY_DATA_URL_CHARS = 15_000_000;

type IntakeCopy = Dictionary["intake"];

type PrimaryPhoto = { dataUrl: string; name: string };

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-full border text-sm font-headline tracking-tight transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        active
          ? "bg-primary/10 border-primary/40 text-primary shadow-sm shadow-primary/5"
          : "bg-surface border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low hover:border-outline-variant/40",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function RadioPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300",
        "min-h-[56px] hover:scale-[1.01] active:scale-[0.99]",
        active
          ? "bg-primary/10 border-primary/35 shadow-sm shadow-primary/5"
          : "bg-surface border-outline-variant/15 hover:bg-surface-container-low hover:border-outline-variant/30",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-headline text-sm text-on-surface">{label}</span>
        <span
          className={[
            "size-5 rounded-full border grid place-items-center transition-colors duration-300",
            active ? "border-primary/40 bg-primary/10" : "border-outline-variant/25 bg-surface",
          ].join(" ")}
          aria-hidden="true"
        >
          {active && (
            <span className="size-2.5 rounded-full bg-primary animate-fade-scale" />
          )}
        </span>
      </div>
    </button>
  );
}

function SummaryCard({ draft }: { draft: IntakeDraft }) {
  const products = draft.regimenLines;
  if (products.length === 0)
    return (
      <div className="p-10 text-center border border-dashed border-outline-variant/30 rounded-2xl bg-surface-container-lowest/50">
        <p className="text-on-surface-variant/45 italic">No products added yet.</p>
      </div>
    );

  return (
    <div className="space-y-4 animate-fade-scale">
      {products.map((line, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {idx + 1}
            </div>
            <div>
              <p className="text-sm font-headline font-bold text-on-surface">
                {line.brandRaw}
              </p>
              <p className="text-xs text-on-surface-variant font-light">
                {line.nameRaw}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md bg-secondary-container/30 text-[10px] font-bold uppercase tracking-wider text-secondary">
              {line.usageSlot === "BOTH"
                ? "AM + PM"
                : line.usageSlot === "UNKNOWN"
                  ? "Slot?"
                  : line.usageSlot}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  step,
  title,
  subtitle,
  children,
}: {
  step: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8 animate-fade-scale">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
          <span className="relative w-12 h-12 rounded-2xl bg-primary-container text-primary flex items-center justify-center font-headline text-lg shadow-sm border border-primary/10">
            {step}
          </span>
        </div>
        <div>
          <h2 className="font-headline text-2xl tracking-tight text-on-surface sm:text-3xl font-light italic">{title}</h2>
          {subtitle ? <p className="text-sm text-on-surface-variant mt-1.5 font-light tracking-wide">{subtitle}</p> : null}
        </div>
      </div>
      <div className="pl-0 sm:pl-[68px]">
        {children}
      </div>
    </div>
  );
}

function formatNote(d: IntakeDraft, c: IntakeCopy) {
  const lines: string[] = [];

  if (d.age || d.gender) {
    const g =
      d.gender === "FEMALE"
        ? c.identity.genderFemale
        : d.gender === "MALE"
          ? c.identity.genderMale
          : d.gender === "PREFER_NOT"
            ? c.identity.genderPreferNot
            : undefined;
    lines.push(
      [
        c.note.identity,
        d.age ? `${c.note.age} ${d.age}` : null,
        g ? `${c.note.gender} ${g}` : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  if (d.chiefComplaint.length) {
    const otherLabel = c.chief.options[c.chief.options.length - 1] ?? "Other";
    const other =
      d.chiefComplaint.includes(otherLabel) && d.chiefComplaintOther ? ` (${d.chiefComplaintOther})` : "";
    lines.push(`${c.note.chiefComplaint}: ${d.chiefComplaint.join(", ")}${other}`);
  }
  if (d.duration) lines.push(`${c.note.duration}: ${d.duration}`);
  if (d.severity) {
    const sev =
      d.severity === "MILD"
        ? c.chief.severityMild
        : d.severity === "MODERATE"
          ? c.chief.severityModerate
          : c.chief.severitySevere;
    lines.push(`${c.note.severity}: ${sev}`);
  }

  if (d.course)
    lines.push(
      `${c.note.course}: ${
        d.course === "STABLE"
          ? c.chief.courseStable
          : d.course === "WORSENING"
            ? c.chief.courseWorsening
            : c.chief.courseFlares
      }`,
    );

  if (d.oilAfterWash || d.oilyAreas.length) {
    const oil =
      d.oilAfterWash === "<2H"
        ? c.skin.oilLt2h
        : d.oilAfterWash === "2-4H"
          ? c.skin.oil2to4h
          : d.oilAfterWash === "4H+"
            ? c.skin.oilGte4h
            : d.oilAfterWash === "NOT_OILY"
              ? c.skin.oilNotOily
              : undefined;
    const areas = d.oilyAreas.length
      ? d.oilyAreas
          .map((a) =>
            a === "T_ZONE" ? c.skin.areaTzone : a === "ALL_FACE" ? c.skin.areaAllFace : c.skin.areaNone,
          )
          .join(", ")
      : undefined;
    lines.push(
      [
        c.note.sebum,
        oil ? `${c.note.oilyAfterWash} ${oil}` : null,
        areas ? `${c.note.areas}: ${areas}` : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  if (d.afterWashFeel || d.barrierSigns.length) {
    const feel =
      d.afterWashFeel === "TIGHT"
        ? c.skin.feelTight
        : d.afterWashFeel === "NORMAL"
          ? c.skin.feelNormal
          : d.afterWashFeel === "OILY"
            ? c.skin.feelOily
            : undefined;
    const signs = d.barrierSigns.length
      ? d.barrierSigns
          .map((s) =>
            s === "PEELING" ? c.skin.signPeeling : s === "ITCHY" ? c.skin.signItchy : c.skin.signDryFeel,
          )
          .join(", ")
      : undefined;
    lines.push(
      [
        c.note.barrier,
        feel ? `${c.note.afterWashFeel} ${feel}` : null,
        signs ? `${c.note.signs}: ${signs}` : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  if (d.easyRed !== undefined || d.stingsWithProducts !== undefined || d.historyAllergy !== undefined) {
    const bits = [
      d.easyRed !== undefined ? `${c.note.easyRed}: ${d.easyRed ? c.note.yes : c.note.no}` : null,
      d.stingsWithProducts !== undefined
        ? `${c.note.stings}: ${d.stingsWithProducts ? c.note.yes : c.note.no}`
        : null,
      d.historyAllergy !== undefined
        ? `${c.note.allergy}: ${d.historyAllergy ? c.note.yes : c.note.no}`
        : null,
    ].filter(Boolean);
    if (bits.length) lines.push(`${c.note.sensitivity} ${bits.join(" • ")}`);
    if (d.sensitivityNote) lines.push(`${c.note.sensitivityNote}: ${d.sensitivityNote}`);
  }

  if (d.acneActive !== undefined)
    lines.push(`${c.note.acneActive}: ${d.acneActive ? c.note.yes : c.note.no}`);
  if (d.darkSpots !== undefined) {
    lines.push(`${c.note.darkSpots}: ${d.darkSpots ? c.note.yes : c.note.no}`);
    if (d.darkSpots && d.pigmentationTypes.length) {
      const types = d.pigmentationTypes
        .map((t) =>
          t === "ACNE_MARKS"
            ? c.skin.pigmentAcneMarks
            : t === "MELASMA"
              ? c.skin.pigmentMelasma
              : c.skin.pigmentFreckles,
        )
        .join(", ");
      lines.push(`${c.note.pigmentationTypes}: ${types}`);
    }
  }

  if (d.extraNote) lines.push(`${c.note.extraNote}: ${d.extraNote}`);

  return lines.join("\n");
}

export function IntakeClient({ lang, copy }: { lang: Lang; copy: IntakeCopy }) {
  const router = useRouter();
  const toast = useToast();
  const { data: session, status } = useSession();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState(0);
  const [draft, setDraft] = useState<IntakeDraft>({
    v: 1,
    chiefComplaint: [],
    oilyAreas: [],
    barrierSigns: [],
    pigmentationTypes: [],
    regimenLines: [],
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [primaryPhoto, setPrimaryPhoto] = useState<PrimaryPhoto | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as IntakeDraft;
      if (parsed?.v !== 1) return;
      setDraft((prev) => ({
        ...prev,
        ...parsed,
        chiefComplaint: Array.isArray(parsed.chiefComplaint) ? parsed.chiefComplaint : prev.chiefComplaint,
        oilyAreas: Array.isArray(parsed.oilyAreas) ? parsed.oilyAreas : prev.oilyAreas,
        barrierSigns: Array.isArray(parsed.barrierSigns) ? parsed.barrierSigns : prev.barrierSigns,
        pigmentationTypes: Array.isArray(parsed.pigmentationTypes) ? parsed.pigmentationTypes : prev.pigmentationTypes,
        regimenLines: Array.isArray(parsed.regimenLines) ? parsed.regimenLines : prev.regimenLines,
      }));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [draft]);

  const completionPct = useMemo(() => (activeStep === 1 ? 25 : activeStep === 2 ? 50 : activeStep === 3 ? 75 : 100), [activeStep]);

  const hasPrimaryPhoto = primaryPhoto !== null;

  const canSubmit = useMemo(() => {
    return (
      hasPrimaryPhoto &&
      draft.chiefComplaint.length > 0 &&
      (draft.duration?.trim()?.length ?? 0) > 0 &&
      draft.severity !== undefined
    );
  }, [hasPrimaryPhoto, draft.chiefComplaint.length, draft.duration, draft.severity]);

  function readPrimaryFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      setPrimaryPhoto({ dataUrl, name: file.name });
    };
    reader.onerror = () => {
      toast.push({ tone: "error", title: copy.toast.submitFailed });
    };
    reader.readAsDataURL(file);
  }

  function goToStep(next: 1 | 2 | 3 | 4) {
    if (next > 1 && !hasPrimaryPhoto) {
      toast.push({ tone: "info", title: copy.validation.primaryPhotoRequired });
      return;
    }
    setDirection(next > activeStep ? 1 : -1);
    setActiveStep(next);
  }

  function advanceStep() {
    if (activeStep === 1 && !hasPrimaryPhoto) {
      toast.push({ tone: "info", title: copy.validation.primaryPhotoRequired });
      return;
    }
    setDirection(1);
    setActiveStep((s) => (s === 1 ? 2 : s === 2 ? 3 : 4));
  }

  async function saveDraft() {
    toast.push({ tone: "success", title: copy.toast.draftSaved });
  }

  async function submit() {
    if (!canSubmit) {
      toast.push({ tone: "info", title: copy.toast.completeRequired });
      return;
    }

    if (status !== "authenticated") {
      toast.push({ tone: "info", title: copy.auth.signInToSubmit });
      router.push("/auth?returnTo=%2Fconsult%2Fintake");
      return;
    }

    const otherLabel = copy.chief.options[copy.chief.options.length - 1] ?? "Other";
    const symptoms = draft.chiefComplaint
      .filter((c) => c !== otherLabel)
      .concat(
        draft.chiefComplaint.includes(otherLabel) && draft.chiefComplaintOther ? [draft.chiefComplaintOther] : [],
      )
      .filter(Boolean)
      .slice(0, 30);

    const payload = {
      symptoms,
      note: formatNote(draft, copy),
      intake: draft,
      regimenLines: draft.regimenLines,
      uploads: primaryPhoto ? [{ kind: "primary", url: primaryPhoto.dataUrl }] : [],
    };

    setBusy("submit");
    try {
      const res = await fetch("/api/cases/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to submit.");
      window.localStorage.removeItem(STORAGE_KEY);
      toast.push({ tone: "success", title: copy.toast.submitted });
      router.push("/consult/analyzing");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.push({ tone: "error", title: msg || copy.toast.submitFailed });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-4">
          <div>
            <h1 className="font-headline text-3xl font-light tracking-tight text-on-surface">
              {copy.title}
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              {activeStep === 1
                ? copy.progress.step1
                : activeStep === 2
                  ? copy.progress.step2
                  : copy.progress.step3}
            </p>
          </div>
          <div className="text-primary font-headline text-sm tracking-widest">
            {interpolate(copy.progress.complete, { pct: String(completionPct) })}
          </div>
        </div>
        <div className="h-0.5 w-full bg-surface-container rounded-full overflow-hidden relative">
          <div
            className="h-full bg-primary relative transition-all duration-1000 ease-out"
            style={{ width: `${completionPct}%` }}
          >
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white/20 to-transparent blur-[2px]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        <aside className="col-span-12 lg:col-span-3 order-2 lg:order-1">
          <div className="lg:sticky lg:top-40 space-y-4">
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low">
              <h3 className="font-headline text-lg mb-4 text-primary font-semibold">
                {copy.tips.title}
              </h3>
              <ul className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
                {copy.tips.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {copy.tips.privacy}
              </p>
            </div>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-9 order-1 lg:order-2 space-y-10">
          {/* Step switcher */}
          <div className="flex flex-wrap gap-2">
            {[
              { k: 1 as const, label: copy.stepper.photos },
              { k: 2 as const, label: copy.stepper.profile },
              { k: 3 as const, label: copy.stepper.skin },
              { k: 4 as const, label: "Review" },
            ].map((s) => (
              <button
                key={s.k}
                type="button"
                onClick={() => goToStep(s.k)}
                className={[
                  "px-4 py-2 rounded-full border text-xs uppercase tracking-[0.22em] transition-colors",
                  activeStep === s.k
                    ? "bg-primary/10 border-primary/25 text-primary"
                    : "bg-surface border-outline-variant/20 text-on-surface/60 hover:bg-surface-container-low",
                ].join(" ")}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div key={activeStep} className={direction > 0 ? "animate-slide-right" : direction < 0 ? "animate-slide-left" : "animate-fade-scale"}>
            {activeStep === 1 ? (
              <div className="space-y-10">
                <Section step="01" title={copy.photos.title} subtitle={copy.photos.subtitle}>
              <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 space-y-6 border border-outline-variant/10">
                <p className="text-sm text-on-surface-variant">
                  {copy.photos.helper}
                </p>
                {!hasPrimaryPhoto ? (
                  <p className="text-xs text-primary font-medium">{copy.validation.primaryPhotoRequired}</p>
                ) : null}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {copy.photos.slots.map((label, idx) =>
                    idx === 0 ? (
                      <label
                        key={label}
                        className="relative group aspect-[3/4] overflow-hidden rounded-2xl border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest p-0 transition-colors hover:border-primary/40"
                      >
                        {primaryPhoto ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={primaryPhoto.dataUrl}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-2 z-10 rounded-full bg-on-surface/80 px-3 py-1.5 text-[10px] font-headline uppercase tracking-widest text-surface backdrop-blur-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPrimaryPhoto(null);
                              }}
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center p-6">
                            <span className="mb-3 text-3xl text-outline-variant transition-colors group-hover:text-primary">
                              +
                            </span>
                            <p className="text-center text-xs font-label text-on-surface-variant">{label}</p>
                          </div>
                        )}
                        <input
                          className="absolute inset-0 cursor-pointer opacity-0"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) readPrimaryFile(f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    ) : (
                      <div
                        key={label}
                        className="relative flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant/20 bg-surface-container-low/60 p-6 opacity-80"
                      >
                        <span className="mb-3 text-2xl text-outline-variant/60">+</span>
                        <p className="text-center text-xs font-label text-on-surface-variant/80">{label}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </Section>
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className="space-y-10">
              <Section step="02" title={copy.identity.title} subtitle={copy.identity.subtitle}>
                <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 border border-outline-variant/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <label className="block">
                      <span className="block text-sm font-headline mb-2">{copy.identity.ageLabel}</span>
                      <input
                        inputMode="numeric"
                        value={draft.age ?? ""}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          setDraft((d) => ({ ...d, age: Number.isFinite(n) && n > 0 ? Math.min(120, n) : undefined }));
                        }}
                        className="w-full bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary"
                        placeholder={copy.identity.agePlaceholder}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-headline mb-2">{copy.identity.genderLabel}</span>
                      <select
                        value={draft.gender ?? ""}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, gender: (e.target.value as Gender) || undefined }))
                        }
                        className="w-full bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary"
                      >
                        <option value="">{copy.identity.genderPlaceholder}</option>
                        <option value="FEMALE">{copy.identity.genderFemale}</option>
                        <option value="MALE">{copy.identity.genderMale}</option>
                        <option value="PREFER_NOT">{copy.identity.genderPreferNot}</option>
                      </select>
                    </label>
                  </div>
                </div>
              </Section>

              <Section step="03" title={copy.chief.title} subtitle={copy.chief.subtitle}>
                <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 space-y-8 border border-outline-variant/10">
                  <div className="flex flex-wrap gap-2.5">
                    {copy.chief.options.map((c) => (
                      <Chip
                        key={c}
                        label={c}
                        active={draft.chiefComplaint.includes(c)}
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            chiefComplaint: d.chiefComplaint.includes(c)
                              ? d.chiefComplaint.filter((x) => x !== c)
                              : [...d.chiefComplaint, c],
                          }))
                        }
                      />
                    ))}
                  </div>

                  {draft.chiefComplaint.includes(copy.chief.otherLabel) ? (
                    <label className="block">
                      <span className="block text-sm font-headline mb-2">{copy.chief.otherLabel}</span>
                      <input
                        value={draft.chiefComplaintOther ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, chiefComplaintOther: e.target.value }))}
                        className="w-full bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary"
                        placeholder={copy.chief.otherPlaceholder}
                      />
                    </label>
                  ) : null}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="block text-sm font-headline mb-2">
                        {copy.chief.durationLabel}
                      </span>
                      <input
                        value={draft.duration ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))}
                        className="w-full bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary"
                        placeholder={copy.chief.durationPlaceholder}
                      />
                      <p className="mt-2 text-xs text-on-surface-variant">{copy.chief.durationHint}</p>
                    </label>

                    <div>
                      <span className="block text-sm font-headline mb-2">
                        {copy.chief.severityLabel}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <RadioPill
                          label={copy.chief.severityMild}
                          active={draft.severity === "MILD"}
                          onClick={() => setDraft((d) => ({ ...d, severity: "MILD" }))}
                        />
                        <RadioPill
                          label={copy.chief.severityModerate}
                          active={draft.severity === "MODERATE"}
                          onClick={() => setDraft((d) => ({ ...d, severity: "MODERATE" }))}
                        />
                        <RadioPill
                          label={copy.chief.severitySevere}
                          active={draft.severity === "SEVERE"}
                          onClick={() => setDraft((d) => ({ ...d, severity: "SEVERE" }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/10">
                    <div className="grid grid-cols-1 gap-5">
                      <div>
                        <span className="block text-sm font-headline mb-2">{copy.chief.courseLabel}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <RadioPill
                            label={copy.chief.courseStable}
                            active={draft.course === "STABLE"}
                            onClick={() => setDraft((d) => ({ ...d, course: "STABLE" }))}
                          />
                          <RadioPill
                            label={copy.chief.courseWorsening}
                            active={draft.course === "WORSENING"}
                            onClick={() => setDraft((d) => ({ ...d, course: "WORSENING" }))}
                          />
                          <RadioPill
                            label={copy.chief.courseFlares}
                            active={draft.course === "FLARES"}
                            onClick={() => setDraft((d) => ({ ...d, course: "FLARES" }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className="space-y-10">
              <Section step="04" title={copy.skin.title} subtitle={copy.skin.subtitle}>
                <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 space-y-10 border border-outline-variant/10">
                  <div>
                    <p className="text-sm font-headline mb-3">{copy.skin.sebumTitle}</p>
                    <p className="text-xs text-on-surface-variant mb-4">
                      {copy.skin.sebumHelper}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { k: "<2H" as const, label: copy.skin.oilLt2h },
                        { k: "2-4H" as const, label: copy.skin.oil2to4h },
                        { k: "4H+" as const, label: copy.skin.oilGte4h },
                        { k: "NOT_OILY" as const, label: copy.skin.oilNotOily },
                      ].map((o) => (
                        <RadioPill
                          key={o.k}
                          label={o.label}
                          active={draft.oilAfterWash === o.k}
                          onClick={() => setDraft((d) => ({ ...d, oilAfterWash: o.k }))}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-on-surface-variant mt-6 mb-3">{copy.skin.oilyAreasLabel}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { k: "T_ZONE" as const, label: copy.skin.areaTzone },
                        { k: "ALL_FACE" as const, label: copy.skin.areaAllFace },
                        { k: "NONE" as const, label: copy.skin.areaNone },
                      ].map((a) => (
                        <Chip
                          key={a.k}
                          label={a.label}
                          active={draft.oilyAreas.includes(a.k)}
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              oilyAreas: d.oilyAreas.includes(a.k)
                                ? d.oilyAreas.filter((x) => x !== a.k)
                                : [...d.oilyAreas, a.k],
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-outline-variant/10">
                    <p className="text-sm font-headline mb-3">{copy.skin.barrierTitle}</p>
                    <p className="text-xs text-on-surface-variant mb-4">{copy.skin.barrierHelper}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { k: "TIGHT" as const, label: copy.skin.feelTight },
                        { k: "NORMAL" as const, label: copy.skin.feelNormal },
                        { k: "OILY" as const, label: copy.skin.feelOily },
                      ].map((o) => (
                        <RadioPill
                          key={o.k}
                          label={o.label}
                          active={draft.afterWashFeel === o.k}
                          onClick={() => setDraft((d) => ({ ...d, afterWashFeel: o.k }))}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-on-surface-variant mt-6 mb-3">{copy.skin.barrierSignsLabel}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { k: "PEELING" as const, label: copy.skin.signPeeling },
                        { k: "ITCHY" as const, label: copy.skin.signItchy },
                        { k: "DRY_FEEL" as const, label: copy.skin.signDryFeel },
                      ].map((s) => (
                        <Chip
                          key={s.k}
                          label={s.label}
                          active={draft.barrierSigns.includes(s.k)}
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              barrierSigns: d.barrierSigns.includes(s.k)
                                ? d.barrierSigns.filter((x) => x !== s.k)
                                : [...d.barrierSigns, s.k],
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-outline-variant/10">
                    <p className="text-sm font-headline mb-3">{copy.skin.sensitivityTitle}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <RadioPill
                        label={`${copy.skin.easyRed} ${
                          draft.easyRed === true ? `• ${copy.note.yes}` : draft.easyRed === false ? `• ${copy.note.no}` : ""
                        }`}
                        active={draft.easyRed === true}
                        onClick={() => setDraft((d) => ({ ...d, easyRed: d.easyRed === true ? undefined : true }))}
                      />
                      <RadioPill
                        label={`${copy.skin.stings} ${
                          draft.stingsWithProducts === true
                            ? `• ${copy.note.yes}`
                            : draft.stingsWithProducts === false
                              ? `• ${copy.note.no}`
                              : ""
                        }`}
                        active={draft.stingsWithProducts === true}
                        onClick={() =>
                          setDraft((d) => ({ ...d, stingsWithProducts: d.stingsWithProducts === true ? undefined : true }))
                        }
                      />
                      <RadioPill
                        label={`${copy.skin.allergyHistory} ${
                          draft.historyAllergy === true
                            ? `• ${copy.note.yes}`
                            : draft.historyAllergy === false
                              ? `• ${copy.note.no}`
                              : ""
                        }`}
                        active={draft.historyAllergy === true}
                        onClick={() =>
                          setDraft((d) => ({ ...d, historyAllergy: d.historyAllergy === true ? undefined : true }))
                        }
                      />
                    </div>
                    <label className="block mt-5">
                      <span className="block text-xs text-on-surface-variant mb-2">{copy.skin.sensitivityNoteLabel}</span>
                      <input
                        value={draft.sensitivityNote ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, sensitivityNote: e.target.value }))}
                        className="w-full bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary"
                        placeholder={copy.skin.sensitivityNotePlaceholder}
                      />
                    </label>
                  </div>

                  <div className="pt-8 border-t border-outline-variant/10">
                    <p className="text-sm font-headline mb-3">{copy.skin.lesionsTitle}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div className="bg-surface rounded-2xl border border-outline-variant/12 p-6">
                        <p className="text-xs uppercase tracking-[0.22em] text-on-surface/55 mb-3">{copy.skin.acneTitle}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <RadioPill
                            label={copy.skin.acneYes}
                            active={draft.acneActive === true}
                            onClick={() => setDraft((d) => ({ ...d, acneActive: true }))}
                          />
                          <RadioPill
                            label={copy.skin.acneNo}
                            active={draft.acneActive === false}
                            onClick={() => setDraft((d) => ({ ...d, acneActive: false }))}
                          />
                        </div>
                      </div>

                      <div className="bg-surface rounded-2xl border border-outline-variant/12 p-6">
                        <p className="text-xs uppercase tracking-[0.22em] text-on-surface/55 mb-3">
                          {copy.skin.pigmentationTitle}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <RadioPill
                            label={copy.skin.darkSpotsYes}
                            active={draft.darkSpots === true}
                            onClick={() => setDraft((d) => ({ ...d, darkSpots: true }))}
                          />
                          <RadioPill
                            label={copy.skin.darkSpotsNo}
                            active={draft.darkSpots === false}
                            onClick={() => setDraft((d) => ({ ...d, darkSpots: false, pigmentationTypes: [] }))}
                          />
                        </div>
                        {draft.darkSpots ? (
                          <div className="mt-5">
                            <p className="text-xs text-on-surface-variant mb-3">{copy.skin.pigmentationTypesLabel}</p>
                            <div className="flex flex-wrap gap-2.5">
                              {[
                                { k: "ACNE_MARKS" as const, label: copy.skin.pigmentAcneMarks },
                                { k: "MELASMA" as const, label: copy.skin.pigmentMelasma },
                                { k: "FRECKLES" as const, label: copy.skin.pigmentFreckles },
                              ].map((t) => (
                                <Chip
                                  key={t.k}
                                  label={t.label}
                                  active={draft.pigmentationTypes.includes(t.k)}
                                  onClick={() =>
                                    setDraft((d) => ({
                                      ...d,
                                      pigmentationTypes: d.pigmentationTypes.includes(t.k)
                                        ? d.pigmentationTypes.filter((x) => x !== t.k)
                                        : [...d.pigmentationTypes, t.k],
                                    }))
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
              
              <Section step="05" title={copy.routine.title} subtitle={copy.routine.subtitle}>
                <RegimenCatalogPicker 
                  variant="embedded" 
                  onLinesChange={(lines) => {
                    setDraft(d => {
                      // Prevent update if the JSON stringified value is the same
                      if (JSON.stringify(d.regimenLines) === JSON.stringify(lines)) return d;
                      return { ...d, regimenLines: lines };
                    });
                  }} 
                />
              </Section>

              <Section step="06" title={copy.extra.title} subtitle={copy.extra.subtitle}>
                <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 border border-outline-variant/10">
                  <textarea
                    value={draft.extraNote ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, extraNote: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant/15 rounded-2xl p-5 text-sm focus:ring-1 focus:ring-primary h-32 placeholder:text-on-surface-variant/40 placeholder:italic"
                    placeholder={copy.extra.placeholder}
                  />
                </div>
              </Section>
            </div>
          ) : null}
          {activeStep === 4 ? (
            <div className="space-y-10 animate-fade-scale">
               <Section step="07" title="Routine Review" subtitle="Verify your products before submitting to the dermatologist.">
                 <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 border border-outline-variant/10">
                   <SummaryCard draft={draft} />
                   <div className="mt-8 pt-8 border-t border-outline-variant/10">
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        By submitting this consultation, you agree that the information provided is accurate and will be reviewed by our clinical board to formulate your personalized plan.
                      </p>
                   </div>
                 </div>
               </Section>
            </div>
          ) : null}
        </div>

          {/* Mobile actions (non-sticky) */}
          <div className="lg:hidden pt-6 border-t border-outline-variant/10">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={saveDraft}
                className="px-5 py-3 rounded-full border border-outline-variant/25 text-on-surface-variant text-sm font-headline hover:bg-surface-container-low transition-colors"
              >
                {copy.actions.save}
              </button>
              <AsyncButton
                type="button"
                onClick={submit}
                isLoading={busy === "submit"}
                disabled={busy !== null || !canSubmit || status === "loading" || activeStep < 4}
                className="px-6 py-3 rounded-full border border-outline-variant/25 text-on-surface-variant text-sm font-headline hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                {copy.actions.submit}
              </AsyncButton>
            </div>

            <button
              type="button"
              onClick={advanceStep}
              disabled={activeStep >= 4}
              className={[
                "mt-3 w-full btn-gradient px-6 py-3 rounded-full text-on-primary text-sm font-headline shadow-lg shadow-primary/15 transition-opacity",
                activeStep >= 4 ? "opacity-50" : "opacity-100",
              ].join(" ")}
            >
              {copy.actions.next}
            </button>
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex justify-between items-center pt-4">
            <Link
              href="/consult/welcome"
              className="px-2 sm:px-8 py-3 text-on-surface-variant hover:text-primary transition-colors font-headline"
            >
              {copy.actions.previous}
            </Link>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={saveDraft}
                className="px-10 py-3.5 rounded-full border border-outline-variant/30 text-on-surface hover:bg-surface-container-low transition-colors font-headline tracking-tight"
              >
                {copy.actions.save}
              </button>
              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={advanceStep}
                  className="btn-gradient px-12 py-3.5 rounded-full text-on-primary font-headline tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  {copy.actions.next}
                </button>
              ) : (
                <AsyncButton
                  type="button"
                  onClick={submit}
                  isLoading={busy === "submit"}
                  disabled={busy !== null || !canSubmit || status === "loading"}
                  className="btn-gradient px-12 py-3.5 rounded-full text-on-primary font-headline tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-center disabled:opacity-60"
                >
                  {copy.actions.submit}
                </AsyncButton>
              )}
            </div>
          </div>

          {!canSubmit && activeStep >= 2 ? (
            <p className="text-xs text-on-surface-variant">
              {copy.validation.requiredToSubmit}
            </p>
          ) : null}
          {session?.user?.email ? (
            <p className="text-xs text-on-surface/45">
              {interpolate(copy.auth.signedInAs, { email: session.user.email })}
            </p>
          ) : (
            <p className="text-xs text-on-surface/45">{copy.auth.notSignedIn}</p>
          )}
        </section>
      </div>
    </div>
  );
}

