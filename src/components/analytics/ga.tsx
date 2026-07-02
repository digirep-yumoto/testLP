import Script from "next/script";

// GA4 測定ID（公開しても安全な値）。Vercel の NEXT_PUBLIC_GA_ID で上書き可能。
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-YPVY7DHW6Q";

/**
 * Google Analytics 4（gtag.js）。
 * 本番ビルドのみ読み込む（ローカル開発の計測ノイズを防止）。
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
