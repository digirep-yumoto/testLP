import type { Metadata } from "next";
import { Noto_Sans_JP, Lexend } from "next/font/google";
import "./globals.css";
import { company } from "@/lib/site-data";

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

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.brand}（デジレップ）｜${company.tagline}`,
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
    title: `${company.brand}（デジレップ）｜${company.tagline}`,
    description: company.description,
    url: company.url,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${lexend.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper">{children}</body>
    </html>
  );
}
