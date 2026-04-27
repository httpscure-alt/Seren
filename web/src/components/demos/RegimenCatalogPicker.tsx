"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type RegimenLineSubmit = {
  productId: string | null;
  brandRaw: string;
  nameRaw: string;
  usageSlot: "UNKNOWN" | "AM" | "PM" | "BOTH";
  userNote: string | null;
  source: "PICKED" | "FREE_TEXT";
};

type ProductHit = {
  id: string;
  brand: string;
  name: string;
  slug: string;
  market: string | null;
  activesSummary: string | null;
};

type LineModel = {
  key: string;
  mode: "catalog" | "free";
  productId: string | null;
  brandRaw: string;
  nameRaw: string;
  usageSlot: "UNKNOWN" | "AM" | "PM" | "BOTH";
  freeText: string;
  search: string;
  results: ProductHit[];
  loading: boolean;
};

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
        "rounded-full border px-3 py-1.5 text-xs font-headline tracking-tight transition-colors",
        active
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-outline-variant/20 bg-surface text-on-surface-variant hover:bg-surface-container-low",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function emptyLine(): LineModel {
  return {
    key: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    mode: "catalog",
    productId: null,
    brandRaw: "",
    nameRaw: "",
    usageSlot: "UNKNOWN",
    freeText: "",
    search: "",
    results: [],
    loading: false,
  };
}

type RegimenCatalogPickerProps = {
  onLinesChange: (lines: RegimenLineSubmit[]) => void;
  /** Lighter chrome when nested inside another intake step */
  variant?: "standalone" | "embedded";
};

export function RegimenCatalogPicker({
  onLinesChange,
  variant = "standalone",
}: RegimenCatalogPickerProps) {
  const [lines, setLines] = useState<LineModel[]>(() => [emptyLine()]);
  const linesRef = useRef(lines);
  linesRef.current = lines;

  const fetchProducts = useCallback(async (q: string, lineKey: string) => {
    setLines((prev) => prev.map((l) => (l.key === lineKey ? { ...l, loading: true } : l)));
    try {
      const res = await fetch(`/api/skincare-products?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      const products = json?.ok && Array.isArray(json.products) ? json.products : [];
      setLines((prev) =>
        prev.map((l) => (l.key === lineKey ? { ...l, results: products, loading: false } : l)),
      );
    } catch {
      setLines((prev) =>
        prev.map((l) => (l.key === lineKey ? { ...l, results: [], loading: false } : l)),
      );
    }
  }, []);

  const lineSig = useMemo(
    () => lines.map((l) => `${l.key}:${l.mode}:${l.search}`).join("|"),
    [lines],
  );

  useEffect(() => {
    const timers: number[] = [];
    for (const line of linesRef.current) {
      if (line.mode !== "catalog") continue;
      timers.push(
        window.setTimeout(() => {
          void fetchProducts(line.search, line.key);
        }, 300),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [lineSig, fetchProducts]);

  const regimenLinesPayload = useMemo((): RegimenLineSubmit[] => {
    const out: RegimenLineSubmit[] = [];
    for (const line of lines) {
      if (line.mode === "free") {
        const text = line.freeText.trim();
        if (!text) continue;
        out.push({
          productId: null,
          brandRaw: text.slice(0, 120),
          nameRaw: "—",
          usageSlot: line.usageSlot,
          userNote: "User could not match catalog; free text only.",
          source: "FREE_TEXT",
        });
        continue;
      }
      if (!line.brandRaw.trim() && !line.nameRaw.trim()) continue;
      out.push({
        productId: line.productId,
        brandRaw: line.brandRaw.slice(0, 120),
        nameRaw: line.nameRaw.slice(0, 200),
        usageSlot: line.usageSlot,
        userNote: null,
        source: "PICKED",
      });
    }
    return out;
  }, [lines]);

  useEffect(() => {
    onLinesChange(regimenLinesPayload);
  }, [regimenLinesPayload, onLinesChange]);

  const cardClass =
    variant === "embedded"
      ? "rounded-[1.35rem] border border-outline-variant/12 bg-surface-container-lowest/80 p-4 sm:p-5"
      : "rounded-[1.75rem] border border-outline-variant/12 bg-surface-container-lowest p-5 sm:p-6";

  return (
    <div className="space-y-4">
      {lines.map((line, idx) => (
        <div key={line.key} className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
              Product {idx + 1}
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip
                label="Search list"
                active={line.mode === "catalog"}
                onClick={() =>
                  setLines((prev) =>
                    prev.map((l) =>
                      l.key === line.key
                        ? {
                            ...l,
                            mode: "catalog",
                            freeText: "",
                          }
                        : l,
                    ),
                  )
                }
              />
              <Chip
                label="Can't find it"
                active={line.mode === "free"}
                onClick={() =>
                  setLines((prev) =>
                    prev.map((l) =>
                      l.key === line.key
                        ? {
                            ...l,
                            mode: "free",
                            productId: null,
                            brandRaw: "",
                            nameRaw: "",
                            search: "",
                            results: [],
                          }
                        : l,
                    ),
                  )
                }
              />
              {lines.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setLines((prev) => prev.filter((l) => l.key !== line.key))}
                  className="rounded-full border border-outline-variant/20 px-3 py-1.5 text-xs text-on-surface-variant hover:bg-surface"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>

          {line.mode === "catalog" ? (
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs text-on-surface-variant">Type a brand or product name</span>
                <input
                  value={line.search}
                  onChange={(e) =>
                    setLines((prev) =>
                      prev.map((l) => (l.key === line.key ? { ...l, search: e.target.value } : l)),
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-outline-variant/15 bg-surface px-4 py-3 text-base focus:ring-2 focus:ring-primary/25"
                  placeholder="e.g. Azarine, CeraVe, sunscreen…"
                  autoComplete="off"
                />
              </label>
              {line.loading ? (
                <p className="text-xs text-on-surface/45">Searching…</p>
              ) : line.results.length ? (
                <ul className="max-h-52 space-y-1 overflow-auto rounded-xl border border-outline-variant/10 bg-surface p-2">
                  {line.results.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setLines((prev) =>
                            prev.map((l) =>
                              l.key === line.key
                                ? {
                                    ...l,
                                    productId: p.id,
                                    brandRaw: p.brand,
                                    nameRaw: p.name,
                                  }
                                : l,
                            ),
                          )
                        }
                        className={[
                          "w-full rounded-lg px-3 py-3 text-left text-sm transition-colors sm:py-2.5",
                          line.productId === p.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-surface-container-low text-on-surface",
                        ].join(" ")}
                      >
                        <span className="font-medium">{p.brand}</span>
                        <span className="text-on-surface-variant"> · {p.name}</span>
                        {p.activesSummary ? (
                          <span className="mt-1 block text-xs text-on-surface/55 line-clamp-2">
                            {p.activesSummary}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : line.search.trim() ? (
                <p className="text-xs text-on-surface/45">
                  No match — try other words or use &quot;Can&apos;t find it&quot;.
                </p>
              ) : null}
            </div>
          ) : (
            <label className="mt-4 block">
              <span className="text-xs text-on-surface-variant">
                Describe it in your own words (color, shop, what the bottle looks like…)
              </span>
              <textarea
                value={line.freeText}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l) => (l.key === line.key ? { ...l, freeText: e.target.value } : l)),
                  )
                }
                rows={3}
                className="mt-2 w-full resize-y rounded-2xl border border-outline-variant/15 bg-surface px-4 py-3 text-base focus:ring-2 focus:ring-primary/25"
                placeholder="e.g. pink sunscreen from the pharmacy near work"
              />
            </label>
          )}

          <div className="mt-4">
            <p className="text-xs text-on-surface-variant mb-2">When do you use it?</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["UNKNOWN", "Not sure"],
                  ["AM", "Morning"],
                  ["PM", "Evening"],
                  ["BOTH", "Morning & night"],
                ] as const
              ).map(([k, label]) => (
                <Chip
                  key={k}
                  label={label}
                  active={line.usageSlot === k}
                  onClick={() =>
                    setLines((prev) =>
                      prev.map((l) => (l.key === line.key ? { ...l, usageSlot: k } : l)),
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setLines((prev) => [...prev, emptyLine()])}
        className="w-full rounded-2xl border border-dashed border-outline-variant/25 py-3.5 text-sm font-medium text-on-surface-variant transition hover:border-primary/25 hover:bg-primary/5"
      >
        + Add another product
      </button>
    </div>
  );
}
