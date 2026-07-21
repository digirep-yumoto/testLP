import type { Metadata } from "next";
import { Noto_Sans_JP, Lexend, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { company } from "@/lib/site-data";
import { GoogleAnalytics } from "@/components/analytics/ga";
import { MetaPixel } from "@/components/analytics/retargeting";
import { ScrollProgress } from "@/components/site/scroll-progress";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const lexend = Lexend({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// 見出し用（上品でエディトリアルな明朝＝ブランディング・信頼感）
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-mincho",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "DigiRep（デジレップ）｜トイレ＆ランドリー×サイネージ広告",
    template: `%s｜${company.brand}`,
  },
  description: company.description,
  keywords: [
    "サイネージ広告",
    "個室トイレサイネージ",
    "コインランドリーサイネージ",
    "デジタルサイネージ",
    "BlueSky LAUNDRY TV",
    "DigiRep",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: company.brand,
    title: "DigiRep（デジレップ）｜トイレ＆ランドリー×サイネージ広告",
    description: company.description,
    url: company.url,
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
      name: "個室トイレサイネージ広告",
      serviceType: "デジタルサイネージ広告",
      areaServed: "JP",
      provider: { "@id": `${siteUrl}/#organization` },
      description:
        "飲食店の個室トイレに設置したデジタルサイネージによる広告配信。1対1・強制視聴・音ありで、視認率90%。QRで行動計測が可能。",
    },
    {
      "@type": "Service",
      name: "コインランドリーサイネージ広告",
      serviceType: "デジタルサイネージ広告",
      areaServed: "JP",
      provider: { "@id": `${siteUrl}/#organization` },
      description:
        "全国のコインランドリーに設置したデジタルサイネージによる広告配信。視聴者の約67%が女性・30〜50代。同一属性へ高頻度で反復リーチ。",
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
      className={`${notoSansJP.variable} ${lexend.variable} ${notoSerifJP.variable} h-full antialiased`}
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
