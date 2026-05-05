import type { ReactNode } from "react";
import "../../pitch-deck.css";
import "./vc-print.css";

export default function PitchVcPrintLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased selection:bg-primary/15">
      {children}
    </div>
  );
}
