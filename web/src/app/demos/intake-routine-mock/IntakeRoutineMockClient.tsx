"use client";

import { useCallback, useMemo, useState } from "react";
import {
  RegimenCatalogPicker,
  type RegimenLineSubmit,
} from "@/components/demos/RegimenCatalogPicker";

const GROUPS = [
  {
    title: "Basics",
    hint: "Things many people use every day or most days.",
    ids: ["cleanser", "moisturizer", "sunscreen"] as const,
  },
  {
    title: "Treatments & serums",
    hint: "Only tap what you actually use — it’s OK to skip this whole section.",
    ids: [
      "retinoid",
      "acid",
      "vitamin_c",
      "niacinamide",
      "acne_otc",
      "rx_topical",
    ] as const,
  },
  {
    title: "Other",
    hint: null as string | null,
    ids: ["makeup_remover"] as const,
  },
] as const;

const LABELS: Record<string, { title: string; hint?: string }> = {
  cleanser: { title: "Face wash / cleanser" },
  moisturizer: { title: "Moisturizer or cream" },
  sunscreen: { title: "Sunscreen in the daytime" },
  retinoid: { title: "Retinol or retinoid", hint: "Including adapalene from the pharmacy" },
  acid: { title: "Acid exfoliant", hint: "AHA, BHA, salicylic, glycolic…" },
  vitamin_c: { title: "Vitamin C serum" },
  niacinamide: { title: "Niacinamide serum" },
  acne_otc: { title: "Acne gel or spot treatment", hint: "Benzoyl peroxide, etc." },
  rx_topical: { title: "Prescription cream", hint: "From a doctor" },
  makeup_remover: { title: "Oil cleanse or heavy makeup remover" },
};

const NEEDS_DETAIL_IDS = new Set<string>([
  "retinoid",
  "acid",
  "vitamin_c",
  "niacinamide",
  "acne_otc",
  "rx_topical",
]);

type RecentChange = "yes" | "no" | "unsure" | null;

function ToggleTile({
  title,
  hint,
  active,
  onClick,
  disabled,
}: {
  title: string;
  hint?: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex w-full min-h-[4.5rem] items-start gap-4 rounded-[1.35rem] border px-4 py-4 text-left transition-all sm:min-h-0 sm:px-5 sm:py-4",
        disabled
          ? "cursor-not-allowed border-outline-variant/10 bg-surface-container-low/50 opacity-50"
          : active
            ? "border-primary/35 bg-primary/8 shadow-[0_12px_36px_-24px_rgba(61,99,116,0.45)]"
            : "border-outline-variant/15 bg-surface-container-lowest hover:border-outline-variant/25 hover:bg-surface-container-low/80",
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
          active ? "border-primary bg-primary text-on-primary" : "border-outline-variant/35 bg-surface",
        ].join(" ")}
        aria-hidden
      >
        {active ? (
          <svg className="size-3.5" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2 6l3 3 5-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-headline text-[0.95rem] leading-snug text-on-surface">{title}</span>
        {hint ? (
          <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">{hint}</span>
        ) : null}
      </span>
    </button>
  );
}

export function IntakeRoutineMockClient() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [regimenLines, setRegimenLines] = useState<RegimenLineSubmit[]>([]);
  const onCatalogLines = useCallback((lines: RegimenLineSubmit[]) => {
    setRegimenLines(lines);
  }, []);
  const [skippedDetail, setSkippedDetail] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailText, setDetailText] = useState("");
  const [recentChange, setRecentChange] = useState<RecentChange>(null);
  const [recentNote, setRecentNote] = useState("");

  const showDetailPrompt = useMemo(() => {
    if (skippedDetail) return false;
    for (const id of selected) {
      if (NEEDS_DETAIL_IDS.has(id)) return true;
    }
    return false;
  }, [skippedDetail, selected]);

  function toggle(id: string) {
    setSkippedDetail(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (id === "basic_only") {
        if (next.has("basic_only")) next.delete("basic_only");
        else {
          next.clear();
          next.add("basic_only");
        }
        return next;
      }
      next.delete("basic_only");
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function chooseSkipDetail() {
    setSkippedDetail(true);
    setDetailOpen(false);
    setDetailText("");
  }

  function chooseNotSureRoutine() {
    setSelected(new Set());
    setSkippedDetail(false);
    setDetailOpen(false);
    setDetailText("");
    setSelected(new Set(["routine_unsure"]));
  }

  const routineUnsure = selected.has("routine_unsure");

  function clearRoutineUnsure() {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete("routine_unsure");
      return next;
    });
  }

  const payloadPreview = useMemo(() => {
    const categories = routineUnsure
      ? []
      : [...selected].filter((id) => id !== "routine_unsure");
    return {
      routineProductCategories: categories,
      routineNotSure: routineUnsure,
      routineDetailText:
        !routineUnsure && showDetailPrompt && detailText.trim() ? detailText.trim() : null,
      routineSkippedActivesDetail: !routineUnsure && showDetailPrompt && skippedDetail,
      regimenLines: regimenLines.length ? regimenLines : [],
      recentRoutineChange: recentChange,
      recentRoutineChangeNote:
        recentChange === "yes" && recentNote.trim() ? recentNote.trim() : null,
    };
  }, [
    detailText,
    regimenLines,
    recentChange,
    recentNote,
    routineUnsure,
    selected,
    showDetailPrompt,
    skippedDetail,
  ]);

  const selectionCount = routineUnsure ? 0 : [...selected].filter((x) => x !== "basic_only").length;
  const hasBasicOnly = selected.has("basic_only");

  return (
    <div className="space-y-8">
      <div className="seren-card overflow-hidden">
        <div className="border-b border-outline-variant/10 bg-gradient-to-br from-surface-container-low/90 to-surface-container-lowest/80 px-5 py-8 sm:px-10 sm:py-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
            Step 3 · Your routine
          </p>
          <h2 className="mt-3 font-headline text-2xl tracking-[-0.02em] text-on-surface sm:text-[1.75rem]">
            What do you put on your face?
          </h2>
          <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-on-surface-variant">
            First, tap what kinds of products you use. Then, if you remember a brand or name, search
            our list — it’s optional but helps your dermatologist a lot.
          </p>
        </div>

        <div className="space-y-8 p-5 sm:p-10">
          {/* Escape hatches — friendly first */}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={chooseNotSureRoutine}
              className={[
                "rounded-[1.35rem] border px-5 py-4 text-left transition-colors",
                routineUnsure
                  ? "border-primary/35 bg-primary/10"
                  : "border-outline-variant/15 bg-surface-container-low/60 hover:bg-surface-container-low",
              ].join(" ")}
            >
              <span className="font-headline text-sm text-on-surface">I’m not sure</span>
              <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">
                Skip this list — my dermatologist can work from the rest of the intake.
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                clearRoutineUnsure();
                toggle("basic_only");
              }}
              disabled={routineUnsure}
              className={[
                "rounded-[1.35rem] border px-5 py-4 text-left transition-colors",
                routineUnsure
                  ? "cursor-not-allowed opacity-40"
                  : hasBasicOnly
                    ? "border-primary/35 bg-primary/10"
                    : "border-outline-variant/15 bg-surface-container-low/60 hover:bg-surface-container-low",
              ].join(" ")}
            >
              <span className="font-headline text-sm text-on-surface">Mostly just washing</span>
              <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">
                I don’t stick to a regular routine besides cleanser (or water).
              </span>
            </button>
          </div>

          {!routineUnsure ? (
            <>
              {GROUPS.map((group) => (
                <section key={group.title} className="space-y-4">
                  <div>
                    <h3 className="font-headline text-base text-on-surface">{group.title}</h3>
                    {group.hint ? (
                      <p className="mt-1 text-sm text-on-surface-variant">{group.hint}</p>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {group.ids.map((id) => {
                      const meta = LABELS[id];
                      if (!meta) return null;
                      return (
                        <ToggleTile
                          key={id}
                          title={meta.title}
                          hint={meta.hint}
                          active={selected.has(id)}
                          disabled={hasBasicOnly}
                          onClick={() => toggle(id)}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}

              {selectionCount > 0 && !hasBasicOnly ? (
                <p className="text-center text-xs text-on-surface/45">
                  {selectionCount} selected — you can change anytime.
                </p>
              ) : null}
            </>
          ) : (
            <div className="rounded-[1.35rem] border border-outline-variant/12 bg-surface-container-low/50 px-5 py-6 text-sm text-on-surface-variant">
              You chose <span className="font-medium text-on-surface">I’m not sure</span>. That’s
              fine — tap below if you want to fill the list anyway.
              <button
                type="button"
                onClick={() => {
                  setSelected(new Set());
                }}
                className="mt-4 block w-full rounded-full border border-outline-variant/20 py-3 text-sm font-medium text-on-surface hover:bg-surface"
              >
                Actually, let me pick from the list
              </button>
            </div>
          )}

          <section className="space-y-4 border-t border-outline-variant/10 pt-8">
            <div>
              <h3 className="font-headline text-base text-on-surface">Know the product name?</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {routineUnsure
                  ? "Even if you skipped the list above, you can still search for bottles you remember."
                  : "Search Seren’s catalog and tap the match. Not listed? Use “Can’t find it” and describe it — that’s OK."}
              </p>
            </div>
            <RegimenCatalogPicker variant="embedded" onLinesChange={onCatalogLines} />
          </section>

          {/* Optional actives detail */}
          {!routineUnsure && showDetailPrompt ? (
            <div className="rounded-[1.35rem] border border-primary/12 bg-primary/5 p-5 sm:p-6">
              <p className="font-headline text-sm text-on-surface">
                Want to add how strong or how often? (optional)
              </p>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                Example: “retinol 2 nights a week” or “BP only on spots”. Helps avoid doubling up on
                strong ingredients.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDetailOpen(!detailOpen)}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:brightness-[1.03]"
                >
                  {detailOpen ? "Hide text box" : "Add a short note"}
                </button>
                <button
                  type="button"
                  onClick={chooseSkipDetail}
                  className="rounded-full border border-outline-variant/25 px-5 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface"
                >
                  No thanks
                </button>
              </div>
              {detailOpen ? (
                <textarea
                  value={detailText}
                  onChange={(e) => setDetailText(e.target.value)}
                  rows={3}
                  className="mt-4 w-full resize-y rounded-2xl border border-outline-variant/15 bg-surface px-4 py-3 text-base text-on-surface focus:ring-2 focus:ring-primary/25"
                  placeholder="Type here — a few words is enough."
                />
              ) : null}
            </div>
          ) : null}

          <div className="border-t border-outline-variant/10 pt-8">
            <h3 className="font-headline text-base text-on-surface">Anything new in the last month?</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              New products are a common reason skin suddenly acts up.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {(
                [
                  ["yes", "Yes, I changed something"],
                  ["no", "No, same as usual"],
                  ["unsure", "I don’t remember"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRecentChange(val)}
                  className={[
                    "w-full rounded-[1.35rem] border px-5 py-4 text-left font-headline text-sm transition-colors",
                    recentChange === val
                      ? "border-primary/35 bg-primary/10 text-on-surface"
                      : "border-outline-variant/15 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
            {recentChange === "yes" ? (
              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-on-surface-variant">
                  What changed? (optional)
                </span>
                <input
                  value={recentNote}
                  onChange={(e) => setRecentNote(e.target.value)}
                  className="w-full rounded-2xl border border-outline-variant/15 bg-surface px-4 py-3.5 text-base focus:ring-2 focus:ring-primary/25"
                  placeholder="e.g. new sunscreen, ran out of moisturizer…"
                />
              </label>
            ) : null}
          </div>
        </div>
      </div>

      <details className="seren-card group overflow-hidden open:shadow-sm">
        <summary className="cursor-pointer list-none px-5 py-4 font-headline text-sm text-on-surface-variant marker:content-none sm:px-8 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-3">
            Technical preview (for the team)
            <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
          </span>
        </summary>
        <div className="border-t border-outline-variant/10 px-5 pb-6 pt-2 sm:px-8">
          <pre className="max-h-[280px] overflow-auto rounded-2xl border border-outline-variant/12 bg-surface-container-low p-4 text-[11px] leading-relaxed text-on-surface">
            {JSON.stringify(payloadPreview, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}
