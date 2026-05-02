import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import { siteOgForPath } from "@/lib/marketingOg";
import { TERMS_SLUGS, sectionIdForSlug, termsPath, type TermsSlug } from "@/lib/termsSlugPaths";
import { TermsDocument } from "../TermsDocument";

export async function generateStaticParams() {
  return TERMS_SLUGS.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!TERMS_SLUGS.includes(slug as TermsSlug)) {
    return { title: "Terms" };
  }
  const path = termsPath(slug as TermsSlug);
  const label = slug.replace(/-/g, " ");
  return {
    title: `${label} · Terms — Seren`,
    description: "Terms of service section for Seren.",
    alternates: { canonical: path },
    ...siteOgForPath(path),
  };
}

export default async function TermsSectionPage({ params }: Props) {
  const { slug } = await params;
  if (!TERMS_SLUGS.includes(slug as TermsSlug)) notFound();

  const { lang } = await getDictionary();
  const domId = sectionIdForSlug(slug, lang === "id" ? "id" : "en");
  if (!domId) notFound();

  return <TermsDocument scrollDomId={domId} />;
}
