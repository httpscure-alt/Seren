"use client";

import { useCallback, useState } from "react";
import {
  RegimenCatalogPicker,
  type RegimenLineSubmit,
} from "@/components/demos/RegimenCatalogPicker";

export function IntakeRegimenProductsClient() {
  const [regimenLinesPayload, setRegimenLinesPayload] = useState<RegimenLineSubmit[]>([]);
  const onLinesChange = useCallback((lines: RegimenLineSubmit[]) => {
    setRegimenLinesPayload(lines);
  }, []);

  return (
    <div className="space-y-10">
      <div className="seren-card overflow-hidden">
        <div className="border-b border-outline-variant/10 bg-surface-container-low/40 px-6 py-7 sm:px-10 sm:py-9">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
            Step 3 · Proposed extension (mock)
          </p>
          <h2 className="mt-2 font-headline text-2xl tracking-[-0.02em] text-on-surface sm:text-3xl">
            What are you using today?
          </h2>
          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-on-surface-variant">
            Search the Seren catalog (live API when DB is seeded). Pick a row to attach a grounded
            <span className="text-on-surface/80"> activesSummary</span> for AI + dermatologist — or
            choose &quot;Can&apos;t find it&quot; and type freely.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <RegimenCatalogPicker variant="standalone" onLinesChange={onLinesChange} />
        </div>
      </div>

      <div className="seren-card p-6 sm:p-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
          regimenLines for POST /api/cases/submit
        </p>
        <p className="mt-2 text-xs text-on-surface-variant">
          Server validates <span className="font-mono">productId</span>, creates{" "}
          <span className="font-mono">CaseRegimenLine</span> rows, and merges enriched{" "}
          <span className="font-mono">intake.regimen</span> into the AI job payload.
        </p>
        <pre className="mt-5 max-h-[360px] overflow-auto rounded-2xl border border-outline-variant/12 bg-surface-container-low p-5 text-[11px] leading-relaxed text-on-surface">
          {JSON.stringify(regimenLinesPayload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
