import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lps, getLp } from "@/lib/lp-data";
import { company } from "@/lib/site-data";
import { IndustryLp } from "@/components/lp/industry-lp";

const siteUrl = company.url.replace(/\/$/, "");

export function generateStaticParams() {
  return lps.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lp = getLp(slug);
  if (!lp) return { title: "ページが見つかりません" };
  return {
    title: lp.metaTitle,
    description: lp.metaDesc,
    keywords: lp.keywords,
    alternates: { canonical: `/lp/${lp.slug}` },
    openGraph: {
      type: "website",
      title: lp.metaTitle,
      description: lp.metaDesc,
      url: `${siteUrl}/lp/${lp.slug}`,
      siteName: company.brand,
      locale: "ja_JP",
    },
  };
}

export default async function LpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lp = getLp(slug);
  if (!lp) notFound();
  return <IndustryLp lp={lp} />;
}
