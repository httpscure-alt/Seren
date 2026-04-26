import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { normalizeLang, LANG_COOKIE } from "@/i18n/getDictionary";

type Props = { searchParams?: Promise<{ code?: string }> };

function normalizeReferralCode(input: string | undefined | null) {
  return (input ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export default async function ReferralPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const entered = normalizeReferralCode(sp.code);

  const c = await cookies();
  const lang = normalizeLang(c.get(LANG_COOKIE)?.value);
  const isId = lang === "id";

  const existing = c.get("seren_referral")?.value;
  if (!existing) {
    redirect("/api/referral/init?next=%2Freferral");
  }
  const myCode = existing;

  const copy = {
    eyebrow: isId ? "Referral" : "Referral",
    titleA: isId ? "Undang teman." : "Invite a friend.",
    titleB: isId ? "Dapatkan 30 hari." : "Get 30 days.",
    body: isId
      ? "Bagikan kode kamu. Temanmu dapat akses perjalanan kulit 30 hari, dan kamu dapat kredit setelah mereka aktif."
      : "Share your code. Your friend gets a 30‑day skin journey, and you earn credit after they activate.",
    yourCode: isId ? "Kode kamu" : "Your code",
    shareHint: isId ? "Salin dan kirim via WhatsApp/DM." : "Copy and share via WhatsApp/DM.",
    enterTitle: isId ? "Punya kode referral?" : "Have a referral code?",
    enterHint: isId ? "Masukkan kode temanmu" : "Enter your friend’s code",
    apply: isId ? "Gunakan kode" : "Apply code",
    applied: isId ? "Kode referral tersimpan untuk checkout." : "Referral code saved for checkout.",
    back: isId ? "Kembali ke beranda" : "Back to home",
    goPaywall: isId ? "Lihat paywall" : "View paywall",
  } as const;

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-5">{copy.eyebrow}</p>
          <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.4rem] sm:text-[3.1rem]">
            {copy.titleA}
            <br />
            <span className="italic font-light">{copy.titleB}</span>
          </h1>
          <p className="mt-7 text-on-surface-variant leading-[1.75] max-w-[64ch]">{copy.body}</p>
        </header>

        <section className="grid grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-[2.5rem] bg-surface-container-lowest p-8 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{copy.yourCode}</p>
              <p className="mt-4 font-headline tracking-tight text-3xl sm:text-4xl">{myCode}</p>
              <p className="mt-4 text-sm text-on-surface-variant">{copy.shareHint}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/paywall?returnTo=%2Freport%2Fsrn-8821&coupon=SERENFRIENDS`}
                  className="btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm"
                >
                  {copy.goPaywall}
                </Link>
                <Link
                  href="/"
                  className="rounded-full border border-outline-variant/25 px-6 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  {copy.back}
                </Link>
              </div>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div className="rounded-[2.5rem] bg-surface-container-lowest p-8 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
              <p className="font-headline tracking-tight text-base">{copy.enterTitle}</p>
              <form action="/referral" method="get" className="mt-6 space-y-3">
                <input
                  name="code"
                  defaultValue={entered}
                  className="w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={copy.enterHint}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="w-full rounded-full border border-outline-variant/25 px-6 py-3 text-sm font-medium hover:bg-surface-container transition-colors"
                >
                  {copy.apply}
                </button>
              </form>
              {entered ? (
                <p className="mt-4 text-xs text-primary">
                  {copy.applied} <span className="text-on-surface/45">({entered})</span>
                </p>
              ) : null}
              <p className="mt-8 text-xs text-on-surface/45 leading-relaxed">
                {isId
                  ? "Catatan: Ini masih demo. Nanti status referral + reward akan berasal dari backend (di-manage via Retool)."
                  : "Note: This is still a demo. Referral status + rewards will come from the backend (managed via Retool)."}
              </p>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

