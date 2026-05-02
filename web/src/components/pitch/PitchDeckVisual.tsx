import type { ReactNode } from "react";
import Image from "next/image";
import { PitchBrandUiShowcase } from "@/components/pitch/PitchBrandUiShowcase";
import { PitchClinicUiShowcase } from "@/components/pitch/PitchClinicUiShowcase";
import { PitchVcUiShowcase } from "@/components/pitch/PitchVcUiShowcase";

/** Same editorial image as the visual deck (consult room + tablet). Fallback when not using UI showcase. */
export const PITCH_DECK_EDITORIAL_IMAGE =
  "https://lh3.googleusercontent.com/aida/ADBb0uhJMOlmelS41Qee9uiOmtS5aVqwPhJvsU312oFNz_eZIZKPboOPSLw1DmrwWA_Prcyt-QkN2lpozdG-8DxYgDy8nYoOComDlwd-DPXOq0Ys6_qLJUVpoKP9wdIuwbtIhooPEaogqy9IgujHiqVOiMYQJRPaqT4Unia8eaoY2ZRlkkuXma5Tx_oPhe2Ripyip4DZWWXd6a-yLVpMfhb4Q0QlGvPeAQBAW9zVw-zVgsx595gpuxo9xUwuJTdDoUyDX3OvQAZYTO-0";

/** Deck long-term vision texture — for brand / mood sections. */
export const PITCH_DECK_VISION_IMAGE =
  "https://lh3.googleusercontent.com/aida/ADBb0ugMkZv3Cnu8ua4WTZc7RMkqbFgkuF-ormHWrgk7ztVe12IM_vh_VnYIRg9G5vSGVE2IAgixgmGbZq2yV6Z7mR_Q_LgewiFKxEHR9Up6Mg3rg-jxqPAyTEiIrR_PSBSvsoCCrwaplhNqtnlVIshyu61sGZ5j8v1uSrs7CDBLlADf9J_7La7B32aDlvkoJBMC6v92ndD6FaKbm5QyOZJHYhVMgq9lS3u2S0JyWXyoy9nFGT4uJL9rNx8K3xtrDvA_0KSS3wV72m3i";

function Ms({ name, className = "text-primary" }: { name: string; className?: string }) {
  return <span className={`pitch-material-symbols ${className}`}>{name}</span>;
}

/** Deck §2 — image + editorial column, or interactive UI mocks (same routes/styles as prod). */
export function PitchDeckSplit({
  imageSrc = PITCH_DECK_EDITORIAL_IMAGE,
  imageAlt = "Seren visual philosophy — clinical atelier",
  variant = "editorial",
  children,
}: {
  imageSrc?: string;
  imageAlt?: string;
  /** `vc|clinic|brand` use live-style showcases; `editorial` uses photo; `product` = legacy alias for `vc`. */
  variant?: "editorial" | "vc" | "clinic" | "brand" | "product";
  children: ReactNode;
}) {
  const v = variant === "product" ? "vc" : variant;
  const showUi =
    v === "vc" ? (
      <PitchVcUiShowcase />
    ) : v === "clinic" ? (
      <PitchClinicUiShowcase />
    ) : v === "brand" ? (
      <PitchBrandUiShowcase />
    ) : null;

  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
      <div className="relative md:col-span-5">
        <div className="pitch-editorial-shadow relative aspect-[4/5] max-h-[min(72vh,700px)] overflow-hidden rounded-xl md:aspect-auto md:h-[min(600px,74vh)]">
          {showUi ? (
            <div className="absolute inset-0 p-1 sm:p-0">
              {showUi}
            </div>
          ) : (
            <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 40vw" />
          )}
        </div>
      </div>
      <div className="md:col-span-7 md:pl-4 lg:pl-10">{children}</div>
    </div>
  );
}

export function PitchDeckFeatureStrip({
  items,
}: {
  items: { icon: string; title: string; body: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
      {items.map((it) => (
        <div
          key={it.title}
          className="pitch-editorial-shadow rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-10 text-left sm:p-12"
        >
          <Ms name={it.icon} className="mb-6 text-4xl text-primary" />
          <h3 className="mb-4 font-headline text-xl font-medium lowercase tracking-tight text-on-surface">{it.title}</h3>
          <p className="font-body text-sm leading-relaxed text-on-surface-variant">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

/** Centered section title like deck “funding objective”. */
export function PitchDeckCenterTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-12 text-center md:mb-16">
      <h2 className="mb-4 font-headline text-3xl font-light lowercase tracking-tight text-on-surface md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto max-w-2xl font-headline text-sm uppercase tracking-[0.2em] text-on-surface-variant">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** Deck “signals of success” KPI row. */
export function PitchDeckKpiStrip({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="pitch-editorial-shadow rounded-xl bg-surface-container-lowest p-8 text-center sm:p-10"
        >
          <div className="mb-2 font-headline text-2xl font-bold text-primary sm:text-3xl">{it.value}</div>
          <div className="font-headline text-[10px] uppercase tracking-[0.15em] text-on-surface-variant sm:text-xs sm:tracking-widest">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export type PitchRoadmapColumn = { label: string; text: string };

export type PitchRoadmapPhase = {
  phase: string;
  title: string;
  strength: "strong" | "mid" | "soft";
  columns: PitchRoadmapColumn[];
};

/** Deck execution roadmap — sticky rail + border-l timeline. */
export function PitchDeckRoadmapDeck({
  sidebarTitle,
  sidebarLead,
  bullets,
  phases,
}: {
  sidebarTitle: string;
  sidebarLead: string;
  bullets: { label: string; dim?: boolean }[];
  phases: PitchRoadmapPhase[];
}) {
  const line = {
    strong: "border-primary/20",
    mid: "border-primary/10",
    soft: "border-primary/5",
  } as const;
  const dot = {
    strong: "bg-primary",
    mid: "bg-outline-variant",
    soft: "bg-outline-variant/50",
  } as const;
  const phaseStyle = {
    strong: "text-primary",
    mid: "text-on-surface-variant/50",
    soft: "text-on-surface-variant/30",
  } as const;

  return (
    <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-12 lg:gap-16">
      <div className="md:sticky md:top-36 md:w-1/3">
        <h2 className="mb-6 font-headline text-3xl font-light lowercase tracking-tight text-on-surface md:text-4xl">
          {sidebarTitle}
        </h2>
        <p className="font-body leading-relaxed text-on-surface-variant">{sidebarLead}</p>
        <div className="mt-8 space-y-4">
          {bullets.map((b) => (
            <div
              key={b.label}
              className={`flex items-center gap-4 font-headline text-sm font-medium uppercase tracking-tighter ${
                b.dim ? "text-on-surface-variant opacity-40" : "text-primary"
              }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${b.dim ? "bg-outline-variant" : "bg-primary"}`} />
              {b.label}
            </div>
          ))}
        </div>
      </div>
      <div className="md:w-2/3 md:space-y-24">
        {phases.map((ph) => (
          <div key={ph.phase} className={`relative border-l pl-10 md:pl-12 ${line[ph.strength]}`}>
            <div
              className={`absolute top-0 -left-[6px] h-3 w-3 rounded-full ${dot[ph.strength]} ring-4 ring-white`}
            />
            <span
              className={`mb-4 block font-headline text-xs font-bold uppercase tracking-widest ${phaseStyle[ph.strength]}`}
            >
              {ph.phase}
            </span>
            <h3 className="mb-6 font-headline text-2xl font-light lowercase tracking-tight text-on-surface md:text-3xl">
              {ph.title}
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {ph.columns.map((c) => (
                <div key={c.label} className="text-sm">
                  <h4 className="mb-2 font-semibold text-on-surface">{c.label}</h4>
                  <p className="font-body leading-relaxed text-on-surface-variant">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Deck “strategic allocation” bento — same grid language. */
export function PitchDeckBentoAllocation() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      <div className="pitch-editorial-shadow flex flex-col justify-between rounded-xl bg-primary p-10 text-on-primary md:col-span-2 md:p-12">
        <div>
          <div className="mb-8 flex items-start justify-between">
            <span className="text-xs uppercase tracking-widest opacity-70">30–40%</span>
            <Ms name="memory" className="text-on-primary opacity-90" />
          </div>
          <h3 className="mb-4 font-headline text-2xl font-light lowercase">ai &amp; infrastructure</h3>
          <ul className="space-y-2 text-sm opacity-85">
            <li>• Multimodal image analysis pipeline</li>
            <li>• High-concurrency secure backend</li>
            <li>• Proprietary dataset labeling</li>
          </ul>
        </div>
        <div className="mt-10 h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-2/5 bg-white" />
        </div>
      </div>

      <div className="pitch-editorial-shadow flex flex-col justify-between rounded-xl bg-surface-container-highest p-10 text-on-surface md:col-span-2 md:p-12">
        <div>
          <div className="mb-8 flex items-start justify-between text-on-surface">
            <span className="text-xs uppercase tracking-widest opacity-70">20–30%</span>
            <Ms name="groups" className="text-on-surface" />
          </div>
          <h3 className="mb-4 font-headline text-2xl font-light lowercase">dermatologist operations</h3>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>• Clinical advisory board sustainment</li>
            <li>• Human-in-the-loop review workflow</li>
            <li>• Professional liability coverage</li>
          </ul>
        </div>
        <div className="mt-10 h-1 w-full overflow-hidden rounded-full bg-outline-variant/30">
          <div className="h-full w-1/4 bg-primary" />
        </div>
      </div>

      <div className="rounded-xl bg-surface-container p-8">
        <span className="mb-4 block text-xs uppercase tracking-widest opacity-50">20–30%</span>
        <h3 className="mb-2 font-headline text-lg font-medium lowercase">user acquisition</h3>
        <p className="text-xs text-on-surface-variant">TikTok / IG micro-influencer strategy and paid experimentation.</p>
      </div>

      <div className="rounded-xl bg-surface-container p-8">
        <span className="mb-4 block text-xs uppercase tracking-widest opacity-50">10–20%</span>
        <h3 className="mb-2 font-headline text-lg font-medium lowercase">product development</h3>
        <p className="text-xs text-on-surface-variant">Bahasa localization and clinical-grade retention loops.</p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-tertiary-container p-8 text-on-tertiary-container md:col-span-2">
        <div>
          <span className="mb-2 block text-xs uppercase tracking-widest opacity-50">5–10%</span>
          <h3 className="mb-1 font-headline text-lg font-medium lowercase">legal &amp; compliance</h3>
          <p className="text-xs opacity-95">Global HIPAA / GDPR standards &amp; payment security.</p>
        </div>
        <Ms name="gavel" className="text-3xl text-on-tertiary-container" />
      </div>
    </div>
  );
}

export function PitchDeckQuote({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-4 border-primary/20 py-2 pl-8 font-headline text-lg font-light italic leading-relaxed text-on-surface-variant">
      {children}
    </p>
  );
}
