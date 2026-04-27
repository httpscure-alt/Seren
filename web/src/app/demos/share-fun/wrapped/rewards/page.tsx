import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { ReferralRewardsCatalog } from "../ReferralRewardsCatalog";

export default function ReferralRewardsMockPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pb-24 pt-28 sm:pt-32">
        <header className="max-w-3xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Demos · Referral · Points catalog
          </p>
          <h1 className="font-headline text-3xl tracking-[-0.02em] sm:text-4xl">
            Seren Points — what you can redeem
          </h1>
          <p className="mt-4 leading-[1.65] text-on-surface-variant">
            Each section explains the <span className="font-medium text-on-surface">type of reward</span>
            . Rows spell out <span className="font-medium text-on-surface">what you get</span>,{" "}
            <span className="font-medium text-on-surface">how many points</span>, a rough{" "}
            <span className="font-medium text-on-surface">IDR anchor</span>, and caveats.
          </p>
          <p className="mt-6 text-sm">
            <Link href="/demos/share-fun/wrapped" className="text-primary underline underline-offset-4">
              ← Share card with referral link
            </Link>
          </p>
        </header>

        <section className="mt-12">
          <ReferralRewardsCatalog />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
