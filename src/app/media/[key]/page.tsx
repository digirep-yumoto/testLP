import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MediaSection } from "@/components/site/media-section";
import { mediaList, company } from "@/lib/site-data";

const siteUrl = company.url.replace(/\/$/, "");

export function generateStaticParams() {
  return mediaList.map((m) => ({ key: m.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const m = mediaList.find((x) => x.key === key);
  if (!m) return { title: "媒体が見つかりません" };
  return {
    title: `${m.name}｜${m.axis.head}`,
    description: m.lead,
    keywords: [m.name, m.nameEn, "サイネージ広告", ...m.targets.slice(0, 4)],
    alternates: { canonical: `/media/${m.key}` },
    openGraph: {
      type: "website",
      title: `${m.name}｜DigiRep`,
      description: m.lead,
      url: `${siteUrl}/media/${m.key}`,
      siteName: company.brand,
      locale: "ja_JP",
    },
  };
}

export default async function MediaPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const m = mediaList.find((x) => x.key === key);
  if (!m) notFound();

  return (
    <>
      <Header />
      <main>
        <div className="bg-paper pt-24 sm:pt-28">
          <nav className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 text-xs text-muted-foreground sm:px-6">
            <Link href="/" className="hover:text-brand">ホーム</Link>
            <span>/</span>
            <Link href="/#services" className="hover:text-brand">媒体</Link>
            <span>/</span>
            <span className="text-ink-soft">{m.name}</span>
          </nav>
        </div>

        <MediaSection media={m} index={0} />

        <section className="bg-white pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-3xl border border-border bg-paper p-8 text-center shadow-sm sm:p-10">
              <h2 className="text-xl font-bold text-ink sm:text-2xl">{m.name}のご相談・お見積り</h2>
              <p className="mt-2 text-sm text-ink-soft">
                配信イメージ・概算・効果レポート例を、商圏に合わせてご案内します。
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="/#contact" className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
                  無料シミュレーション・相談
                  <ArrowRight className="size-4" />
                </a>
                <a href="/#docs" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand">
                  媒体資料をダウンロード
                </a>
              </div>
              <div className="mt-6">
                <Link href="/#services" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                  <ArrowLeft className="size-4" />
                  媒体一覧へ戻る
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
