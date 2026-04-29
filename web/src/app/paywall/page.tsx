import Link from "next/link";
import { cookies } from "next/headers";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { normalizeLang, LANG_COOKIE } from "@/i18n/getDictionary";
import {
  formatDiscountLineIdr,
  isCouponEligibleForPlan,
  validateCouponCode,
} from "@/lib/promotions";

type Props = { searchParams?: Promise<{ returnTo?: string; coupon?: string }> };

function safeReturnTo(maybePath: string | undefined) {
  if (!maybePath) return "/report/srn-8821";
  if (!maybePath.startsWith("/")) return "/report/srn-8821";
  return maybePath;
}

export default async function PaywallPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const returnTo = safeReturnTo(sp.returnTo);
  const couponInput = sp.coupon ?? "";
  const providerLabel = (process.env.PAYMENT_PROVIDER || "MIDTRANS").toUpperCase() === "XENDIT" ? "Xendit" : "Midtrans";

  const c = await cookies();
  const lang = normalizeLang(c.get(LANG_COOKIE)?.value);
  const isId = lang === "id";

  const couponResult = couponInput ? await validateCouponCode(couponInput) : null;
  const coupon = couponResult?.ok ? couponResult.coupon : null;

  const copy = {
    eyebrow: isId ? "Akses laporan" : "Unlock your report",
    titleA: isId ? "Buka laporan kulitmu." : "Unlock your skin report.",
    titleB: isId ? "Pilih cara perawatan yang sesuai." : "Choose the level of care.",
    body: isId
      ? "Pembayaran hanya dibutuhkan untuk membuka laporan lengkap. Kamu bisa mulai konsultasi tanpa bayar dulu."
      : "Payment is only required to unlock the full report. You can start the consultation without paying first.",
    methodsTitle: isId ? "Metode pembayaran (Indonesia)" : "Payment methods (Indonesia)",
    methods: ["QRIS", "GoPay", "OVO", "DANA", "Virtual account (BCA/BNI/BRI/Mandiri)"],
    promoLabel: isId ? "Kode promo" : "Promo code",
    promoHint: isId ? "Masukkan kode (opsional)" : "Enter code (optional)",
    applyPromo: isId ? "Terapkan" : "Apply",
    promoApplied: isId ? "Kode promo diterapkan." : "Promo code applied.",
    promoInvalid: isId ? "Kode tidak valid." : "Invalid code.",
    disclaimer: isId
      ? `Pembayaran diproses lewat ${providerLabel}. Setelah berhasil, akses aktif otomatis.`
      : `Payments are processed via ${providerLabel}. After success, access activates automatically.`,
    back: isId ? "Kembali" : "Back",
    continue: isId ? `Bayar dengan ${providerLabel}` : `Pay with ${providerLabel}`,
    recommended: isId ? "Direkomendasikan" : "Recommended",
    single: {
      title: isId ? "Laporan sekali" : "Single report",
      price: "Rp 49.000,-",
      desc: isId
        ? "Analisis dan rutinitas yang direview dokter kulit."
        : "Dermatologist-reviewed analysis and routine.",
      cta: isId ? "Buka laporan" : "Unlock report",
      plan: "single",
    },
    journey: {
      title: isId ? "Perjalanan kulit 30 hari" : "30-day skin journey",
      price: "Rp 99.000,-",
      desc: isId
        ? "Pendampingan berkelanjutan, evaluasi, dan penyesuaian rutinitas."
        : "Ongoing guidance, evaluation, and routine adjustments.",
      cta: isId ? "Mulai perjalanan" : "Start journey",
      plan: "journey",
    },
  } as const;

  const payHref = (plan: string) => {
    const params = new URLSearchParams();
    params.set("plan", plan);
    params.set("next", returnTo);
    if (couponResult?.ok) params.set("coupon", couponResult.normalizedCode);
    return `/paywall/checkout?${params.toString()}`;
  };

  const basePriceIdr = { single: 49000, journey: 99000 } as const;
  const discountFor = (plan: "single" | "journey") => {
    if (!coupon) return null;
    if (!isCouponEligibleForPlan(coupon, plan)) return null;
    return formatDiscountLineIdr(coupon, basePriceIdr[plan]);
  };
  const formatIdr = (n: number) =>
    `Rp ${Math.max(0, n).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-5">
            {copy.eyebrow}
          </p>
          <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.4rem] sm:text-[3.1rem]">
            {copy.titleA}
            <br />
            <span className="italic font-light">{copy.titleB}</span>
          </h1>
          <p className="mt-7 text-on-surface-variant leading-[1.75] max-w-[64ch]">
            {copy.body}
          </p>
        </header>

        <section className="grid grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="col-span-12 lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[2rem] bg-surface-container-lowest p-8 border border-outline-variant/12 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)] flex flex-col">
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                  {copy.single.title}
                </p>
                <p className="text-5xl font-headline tracking-tighter">{copy.single.price}</p>
                {discountFor("single") ? (
                  <p className="mt-3 text-sm text-on-surface-variant">
                    <span className="line-through text-on-surface/35 mr-2">
                      {formatIdr(basePriceIdr.single)}
                    </span>
                    <span className="text-on-surface">
                      {formatIdr(basePriceIdr.single - discountFor("single")!.discountIdr)}
                    </span>
                    <span className="ml-2 text-[10px] uppercase tracking-[0.22em] text-primary">
                      {discountFor("single")!.label}
                    </span>
                  </p>
                ) : null}
                <p className="mt-3 text-on-surface-variant leading-relaxed text-[0.95rem]">
                  {copy.single.desc}
                </p>
                <Link
                  href={payHref(copy.single.plan)}
                  className="mt-10 inline-flex rounded-full border border-outline-variant/25 bg-surface px-8 py-3.5 text-sm font-medium tracking-wide text-on-surface hover:bg-surface-container-low transition-colors justify-center"
                >
                  {copy.continue}
                </Link>
              </div>

              <div className="relative rounded-[2rem] p-8 border border-primary/25 bg-[radial-gradient(circle_at_25%_20%,rgba(61,99,116,0.16),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(246,217,166,0.14),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.85))] shadow-[0_22px_70px_-42px_rgba(61,99,116,0.22)] flex flex-col">
                <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-on-primary shadow-sm">
                  {copy.recommended}
                </span>
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                  {copy.journey.title}
                </p>
                <p className="text-5xl font-headline tracking-tighter">{copy.journey.price}</p>
                {discountFor("journey") ? (
                  <p className="mt-3 text-sm text-on-surface-variant">
                    <span className="line-through text-on-surface/35 mr-2">
                      {formatIdr(basePriceIdr.journey)}
                    </span>
                    <span className="text-on-surface">
                      {formatIdr(basePriceIdr.journey - discountFor("journey")!.discountIdr)}
                    </span>
                    <span className="ml-2 text-[10px] uppercase tracking-[0.22em] text-primary">
                      {discountFor("journey")!.label}
                    </span>
                  </p>
                ) : null}
                <p className="mt-3 text-on-surface-variant leading-relaxed text-[0.95rem]">
                  {copy.journey.desc}
                </p>
                <Link
                  href={payHref(copy.journey.plan)}
                  className="mt-10 inline-flex btn-gradient text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:brightness-[1.03] transition justify-center"
                >
                  {copy.continue}
                </Link>
              </div>
            </div>

            <p className="mt-6 text-xs text-on-surface/45">
              {copy.disclaimer}
            </p>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div className="rounded-[2.5rem] bg-surface-container-lowest p-8 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
              <p className="font-headline tracking-tight text-base">
                {copy.methodsTitle}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {copy.methods.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] uppercase tracking-[0.22em] text-on-surface/55 bg-surface-container-low px-3 py-1.5 rounded-full"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-3xl bg-surface-container-low p-6">
                <form action="/paywall" method="get" className="space-y-3">
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                    {copy.promoLabel}
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      name="coupon"
                      defaultValue={couponInput}
                      className="w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder={copy.promoHint}
                      autoComplete="off"
                      inputMode="text"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-full border border-outline-variant/25 px-5 py-3 text-sm font-medium hover:bg-surface-container transition-colors"
                    >
                      {copy.applyPromo}
                    </button>
                  </div>
                  {couponResult ? (
                    <p
                      className={[
                        "text-xs",
                        couponResult.ok ? "text-primary" : "text-error",
                      ].join(" ")}
                    >
                      {couponResult.ok ? copy.promoApplied : copy.promoInvalid}{" "}
                      <span className="text-on-surface/45">{couponResult.message}</span>
                    </p>
                  ) : null}
                </form>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <Link
                  href={returnTo}
                  className="rounded-full border border-outline-variant/25 px-6 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  {copy.back}
                </Link>
                <Link
                  href={payHref(copy.journey.plan)}
                  className="btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm"
                >
                  {copy.continue}
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

