export default function PromotionsAdminPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • Promotions (legacy)
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Promotions console.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          This page is kept for backwards compatibility. Use{" "}
          <a href="/admin/promos" className="text-primary underline underline-offset-4">
            /admin/promos
          </a>{" "}
          for the in-app coupon CMS.
        </p>
      </header>
    </div>
  );
}

