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
  category: string | null;
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
  selectedCategory: string | null;
  isCustomSaved: boolean;
};

const CATEGORIES = [
  { id: "CLEANSER", label: "Cleanser", icon: "🧴" },
  { id: "TONER", label: "Toner", icon: "💦" },
  { id: "SERUM", label: "Serum", icon: "🧪" },
  { id: "MOISTURIZER", label: "Moisturizer", icon: "☁️" },
  { id: "SUNSCREEN", label: "Sunscreen", icon: "☀️" },
  { id: "TREATMENT", label: "Treatment", icon: "🩹" },
];

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
        "rounded-full border px-3 py-1.5 text-xs font-headline tracking-tight transition-all duration-300",
        "hover:scale-[1.05] active:scale-[0.95]",
        active
          ? "border-primary/40 bg-primary/10 text-primary shadow-sm shadow-primary/5"
          : "border-outline-variant/20 bg-surface text-on-surface-variant hover:bg-surface-container-low hover:border-outline-variant/40",
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
    selectedCategory: null,
    isCustomSaved: false,
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
  
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const fetchProducts = useCallback(async (q: string, category: string | null, lineKey: string) => {
    setLines((prev) => prev.map((l) => (l.key === lineKey ? { ...l, loading: true } : l)));
    try {
      const url = new URL("/api/skincare-products", window.location.origin);
      if (q) url.searchParams.set("q", q);
      if (category) url.searchParams.set("category", category);
      
      const res = await fetch(url.toString());
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
    () => lines.map((l) => `${l.key}:${l.mode}:${l.search}:${l.selectedCategory}`).join("|"),
    [lines],
  );

  useEffect(() => {
    const timers: number[] = [];
    for (const line of linesRef.current) {
      if (line.mode !== "catalog") continue;
      timers.push(
        window.setTimeout(() => {
          void fetchProducts(line.search, line.selectedCategory, line.key);
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

  const onLinesChangeRef = useRef(onLinesChange);
  useEffect(() => {
    onLinesChangeRef.current = onLinesChange;
  }, [onLinesChange]);

  useEffect(() => {
    onLinesChangeRef.current(regimenLinesPayload);
  }, [regimenLinesPayload]);

  const cardClass =
    variant === "embedded"
      ? "rounded-[1.35rem] border border-outline-variant/12 bg-surface-container-lowest/80 p-4 sm:p-5"
      : "rounded-[1.75rem] border border-outline-variant/12 bg-surface-container-lowest p-5 sm:p-6";

  return (
    <div className="space-y-4">
      {lines.map((line, idx) => (
        <div 
          key={line.key} 
          className={[cardClass, "animate-fade-scale"].join(" ")}
        >
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
                            isCustomSaved: false,
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
            <div className="mt-4 space-y-4">
              {line.productId ? (
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between animate-fade-scale">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary/60 mb-1 block">Selected Product</span>
                    <p className="font-headline font-semibold text-primary">{line.brandRaw}</p>
                    <p className="text-sm text-on-surface-variant">{line.nameRaw}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setLines((prev) =>
                        prev.map((l) => (l.key === line.key ? { ...l, productId: null, brandRaw: "", nameRaw: "" } : l)),
                      )
                    }
                    className="text-xs uppercase tracking-widest text-primary/70 hover:text-primary transition-colors px-3 py-2 bg-surface/50 rounded-lg hover:bg-surface"
                  >
                    Change
                  </button>
                </div>
              ) : !line.selectedCategory ? (
                <div className="animate-fade-scale">
                  <p className="text-[10px] font-headline uppercase tracking-wider text-on-surface/40 mb-3">
                    Select a category to start
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setLines((prev) =>
                            prev.map((l) => (l.key === line.key ? { ...l, selectedCategory: cat.id } : l)),
                          )
                        }
                        className="flex flex-col items-center justify-center p-4 rounded-2xl border border-outline-variant/10 bg-surface hover:bg-primary/5 hover:border-primary/20 transition-all group hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                          {cat.icon}
                        </span>
                        <span className="text-[10px] font-headline uppercase tracking-wider text-on-surface/60">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setLines((prev) =>
                          prev.map((l) => (l.key === line.key ? { ...l, selectedCategory: "ALL" } : l)),
                        )
                      }
                      className="flex flex-col items-center justify-center p-4 rounded-2xl border border-outline-variant/10 bg-surface hover:bg-primary/5 hover:border-primary/20 transition-all group hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔍</span>
                      <span className="text-[10px] font-headline uppercase tracking-wider text-on-surface/60">
                        Other / All
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-scale space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {line.selectedCategory === "ALL"
                          ? "🔍"
                          : CATEGORIES.find((c) => c.id === line.selectedCategory)?.icon}
                      </span>
                      <p className="text-xs font-headline uppercase tracking-widest text-primary">
                        {line.selectedCategory === "ALL"
                          ? "All Products"
                          : CATEGORIES.find((c) => c.id === line.selectedCategory)?.label}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setLines((prev) =>
                          prev.map((l) => (l.key === line.key ? { ...l, selectedCategory: null, search: "", results: [] } : l)),
                        )
                      }
                      className="text-[10px] uppercase tracking-widest text-on-surface/40 hover:text-primary transition-colors"
                    >
                      Change Category
                    </button>
                  </div>

                  <label className="block">
                    <input
                      value={line.search}
                      onChange={(e) =>
                        setLines((prev) =>
                          prev.map((l) => (l.key === line.key ? { ...l, search: e.target.value } : l)),
                        )
                      }
                      className="w-full rounded-2xl border border-outline-variant/15 bg-surface px-4 py-3 text-base focus:ring-2 focus:ring-primary/25 placeholder:text-on-surface/30"
                      placeholder={
                        line.selectedCategory === "ALL"
                          ? "Search anything..."
                          : `Search for a ${CATEGORIES.find((c) => c.id === line.selectedCategory)?.label.toLowerCase()}...`
                      }
                      autoComplete="off"
                    />
                  </label>

                  {line.loading ? (
                    <div className="flex items-center gap-2 py-4">
                      <div className="size-3 rounded-full bg-primary/20 animate-pulse" />
                      <p className="text-xs text-on-surface/45 font-label">
                        Looking through our catalog…
                      </p>
                    </div>
                  ) : line.results.length ? (
                    <ul className="max-h-52 space-y-1 overflow-auto rounded-2xl border border-outline-variant/10 bg-surface-container-low/50 p-2 glass-effect shadow-inner">
                      {line.results.map((p, pIdx) => (
                        <li
                          key={p.id}
                          className="animate-fade-scale"
                          style={{
                            animationDelay: `${Math.min(pIdx * 0.05, 0.3)}s`,
                            animationFillMode: "both",
                          }}
                        >
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
                              "w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-300 sm:py-3",
                              line.productId === p.id
                                ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[0.99]"
                                : "hover:bg-surface text-on-surface hover:shadow-sm",
                            ].join(" ")}
                          >
                            <span className="font-headline font-semibold block">{p.brand}</span>
                            <span
                              className={
                                line.productId === p.id
                                  ? "text-on-primary/80"
                                  : "text-on-surface-variant font-light"
                              }
                            >
                              {p.name}
                            </span>
                            {p.activesSummary ? (
                              <span
                                className={[
                                  "mt-2 block text-[11px] line-clamp-1 italic",
                                  line.productId === p.id ? "text-on-primary/70" : "text-on-surface/45",
                                ].join(" ")}
                              >
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
                  ) : (
                    <p className="text-[10px] text-center text-on-surface/30 py-4 italic">
                      Start typing to filter results
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : line.isCustomSaved ? (
            <div className="mt-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-scale">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-on-surface/40 mb-1 block">Custom Product</span>
                <p className="font-headline text-on-surface line-clamp-2">{line.freeText}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLines((prev) => prev.map((l) => (l.key === line.key ? { ...l, isCustomSaved: false } : l)))
                }
                className="text-xs uppercase tracking-widest text-primary/70 hover:text-primary transition-colors px-3 py-2 bg-surface rounded-lg border border-outline-variant/10 hover:border-primary/20 shrink-0"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4 animate-fade-scale">
              <label className="block">
                <span className="text-xs text-on-surface-variant">
                  Describe it in your own words (brand, color, what the bottle looks like...)
                </span>
                <textarea
                  value={line.freeText}
                  onChange={(e) =>
                    setLines((prev) =>
                      prev.map((l) => (l.key === line.key ? { ...l, freeText: e.target.value } : l)),
                    )
                  }
                  rows={2}
                  className="mt-2 w-full resize-none rounded-2xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary/25"
                  placeholder="e.g. pink sunscreen from the pharmacy near work"
                />
              </label>
              <button
                type="button"
                disabled={!line.freeText.trim()}
                onClick={() =>
                  setLines((prev) => prev.map((l) => (l.key === line.key ? { ...l, isCustomSaved: true } : l)))
                }
                className="w-full btn-gradient py-2.5 rounded-xl text-on-primary text-sm font-headline shadow-md disabled:opacity-50 disabled:grayscale transition-all"
              >
                Save Custom Product
              </button>
            </div>
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
        className="w-full rounded-2xl border border-dashed border-outline-variant/30 py-4 text-sm font-headline tracking-tight text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.99]"
      >
        <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span>
        Add another product
      </button>
    </div>
  );
}
