import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { DokuMerchantHeader } from "@/components/DokuMerchantHeader";

export default function DokuLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <DokuMerchantHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

