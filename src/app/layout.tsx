import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { company, ogImage } from "@/lib/site-data";
import { GoogleAnalytics } from "@/components/analytics/ga";
import { MetaPixel } from "@/components/analytics/retargeting";
import { ScrollProgress } from "@/components/site/scroll-progress";

// 日本語フォントはWebフォントを読み込まず、端末のシステムフォント（ヒラギノ／游ゴシック／Noto Sans JP）を使う。
// Noto Sans JP/Noto Serif JP を Webフォントで配信すると、文字範囲ごとの分割ファイルが約70本・1.5MBになり、
// スマホの初期表示（LCP）が10秒超になるため。欧文の見出し・数字だけ Lexend を使う（3ファイル・約100KB）。
const lexend = Lexend({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "DigiRep（デジレップ）｜コインランドリー＆個室トイレ×サイネージ広告",
    template: `%s｜${company.brand}`,
  },
  description: company.description,
  keywords: [
    "サイネージ広告",
    "コインランドリーサイネージ",
    "コインランドリー 広告",
    "個室トイレサイネージ",
    "採用支援",
    "デジタルサイネージ",
    "BlueSky LAUNDRY TV",
    "DigiRep",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: company.brand,
    title: "DigiRep（デジレップ）｜コインランドリー＆個室トイレ×サイネージ広告",
    description: company.description,
    url: company.url,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "DigiRep（デジレップ）｜コインランドリー＆個室トイレ×サイネージ広告",
    description: company.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

const siteUrl = company.url.replace(/\/$/, "");

// 構造化データ（JSON-LD）＝検索エンジンに会社・サービスを正しく伝える（リッチ表示・上位表示に寄与）
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: company.name,
      alternateName: company.brand,
      url: siteUrl,
      logo: `${siteUrl}/images/logo.png`,
      email: company.email,
      telephone: company.tel,
      foundingDate: "2024-06-13",
      founder: { "@type": "Person", name: company.representative },
      address: {
        "@type": "PostalAddress",
        addressCountry: "JP",
        addressRegion: "埼玉県",
        streetAddress: "新座市畑中1-13-16",
      },
      description: company.description,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: company.brand,
      inLanguage: "ja-JP",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Service",
      name: "コインランドリーサイネージ広告（BlueSky LAUNDRY TV）",
      serviceType: "デジタルサイネージ広告",
      areaServed: "JP",
      provider: { "@id": `${siteUrl}/#organization` },
      description:
        "全国約400店のコインランドリー店内に設置した55インチ・音声つきデジタルサイネージによる広告配信。利用者の約7割が女性・30〜50代。同一属性へ高頻度で反復リーチ。",
    },
    {
      "@type": "Service",
      name: "個室トイレサイネージ広告",
      serviceType: "デジタルサイネージ広告",
      areaServed: "JP",
      provider: { "@id": `${siteUrl}/#organization` },
      description:
        "飲食店の個室トイレに設置したデジタルサイネージによる広告配信。1対1・強制視聴・音ありで、視認率90%。QRで行動計測が可能。設置店舗から順次配信。",
    },
    {
      "@type": "Service",
      name: "採用支援（採用の顔・新卒ダイレクト）",
      serviceType: "採用支援",
      areaServed: "JP",
      url: "https://saiyo.digirep.work/",
      provider: { "@id": `${siteUrl}/#organization` },
      description:
        "中小企業向けの採用ブランディング制作物「採用の顔」と、入社人数の保証つき新卒採用「新卒ダイレクト」。",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${lexend.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollProgress />
        {children}
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}
