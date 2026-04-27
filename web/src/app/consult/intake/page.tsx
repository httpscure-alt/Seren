import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { DevDemoLinksBanner } from "@/components/DevDemoLinksBanner";
import { IntakeClient } from "@/app/consult/intake/IntakeClient";
import { getDictionary } from "@/i18n/getDictionary";

export default async function IntakePage() {
  const { lang, dict } = await getDictionary();
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <IntakeClient lang={lang} copy={dict.intake} />
      </main>

      <SiteFooter />
    </div>
  );
}
