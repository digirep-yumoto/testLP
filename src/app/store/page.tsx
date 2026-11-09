import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { StoreOwner } from "@/components/site/store-owner";
import { PackageBanner } from "@/components/package/package-banner";
import { StoreLogos } from "@/components/site/store-logos";
import { company, ogImage } from "@/lib/site-data";

const siteUrl = company.url.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "店舗オーナーの方へ｜個室トイレサイネージの設置と、助成金で集客パッケージ",
  description:
    "飲食店・サロンのオーナーさま向け。個室トイレサイネージは端末無償貸与・運用保守は当社負担・広告の成果報酬は全額店舗へ。国の助成金を使った集客パッケージ（SNS×AI研修・PR動画・インフルエンサー・サイネージ）もご案内します。",
  alternates: { canonical: "/store" },
  openGraph: { type: "website", title: "店舗オーナーの方へ｜DigiRep", description: "個室トイレサイネージの設置（端末無償貸与・成果報酬は全額店舗へ）と、助成金で集客パッケージ。", url: `${siteUrl}/store`, siteName: company.brand, locale: "ja_JP", images: [ogImage] },
};

export default function StorePage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-paper pt-24 sm:pt-28">
          <nav className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 text-xs text-muted-foreground sm:px-6">
            <Link href="/" className="hover:text-brand">ホーム</Link>
            <span>/</span>
            <span className="text-ink-soft">店舗オーナーの方へ</span>
          </nav>
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
            <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-brand uppercase">For Store Owners</p>
            <h1 className="mt-3 text-[2rem] font-bold leading-[1.35] text-ink sm:text-[2.6rem] sm:leading-[1.25]">飲食店・サロンのオーナーさまへ</h1>
            <p className="mt-4 max-w-3xl text-base leading-[1.95] text-ink-soft">
              個室トイレにサイネージを設置して広告の成果報酬を受け取る「加盟店」と、国の助成金を使ってスタッフ研修・PR動画・インフルエンサー投稿・サイネージをまとめて導入する「集客パッケージ」をご案内します。どちらも端末は無償貸与で、設置費はかかりません。
            </p>
          </div>
        </div>
        <StoreOwner />
        <PackageBanner />
        <StoreLogos />
      </main>
      <Footer />
    </>
  );
}
