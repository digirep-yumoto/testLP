import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Content Security Policy。Stripe Checkout（外部遷移）と自己ホストに限定。
// 開発時は Turbopack の HMR/eval を許可するため緩める。
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  isProd
    ? "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://connect.facebook.net"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  // 画像は自己ホスト＋base64(data:)が基本。計測用ピクセルの送信先だけを個別に許可する。
  // （`https:` を全許可すると、万一のXSS時に任意の外部URLへデータを持ち出す経路になる）
  "img-src 'self' data: https://www.facebook.com https://www.google-analytics.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.co.jp",
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://www.facebook.com" +
    (isProd ? "" : " ws: http://localhost:*"),
  "frame-src https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// 採用支援事業（採用の顔）のHP（STUDIO）に iframe で埋め込む「採用スター診断」だけは、
// 埋め込み元を限定したうえで frame 表示を許可する（それ以外のページは従来どおり frame-ancestors 'none'）。
const diagnosisFrameAncestors =
  "https://mycareerconsultant.jp https://*.mycareerconsultant.jp https://*.digirep.work https://*.studio.site https://app.studio.design";
const diagnosisCsp = csp.replace("frame-ancestors 'none'", `frame-ancestors ${diagnosisFrameAncestors}`);

// 採用支援事業サイト（saiyo.digirep.work / ローカルは saiyo.localhost）用の CSP
const SAIYO_HOST = "saiyo\\.(digirep\\.work|localhost)";
const saiyoCsp = csp
  .replace("style-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com")
  .replace("font-src 'self' data:", "font-src 'self' data: https://fonts.gstatic.com")
  .replace("frame-src https://js.stripe.com", "frame-src https://www.google.com https://js.stripe.com");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // X-Powered-By を隠す
  // 旧WordPressサイトのURL → 新サイトへの301リダイレクト（検索結果の旧リンク対策）
  async redirects() {
    // 旧WordPressのURL転送は digirep.work だけに適用する（採用支援サイトの /contact /faq などは転送しない）
    const notSaiyo = { missing: [{ type: "host" as const, value: SAIYO_HOST }] };
    return [
      // ランドリーご利用者アンケートの短いURL（チラシ・モニター・LINEのQR用。?s= はそのまま引き継がれる）
      { source: "/bsl", destination: "/laundry-survey", permanent: false },
      // 旧サイトの実URL（確認済み）
      { source: "/advertising", destination: "/", permanent: true },
      { source: "/advertising/:path*", destination: "/", permanent: true },
      { source: "/signage", destination: "/#store", permanent: true },
      { source: "/signage/:path*", destination: "/#store", permanent: true },
      { source: "/download", destination: "/#docs", permanent: true },
      { source: "/download/:path*", destination: "/#docs", permanent: true },
      { source: "/application", destination: "/apply-form.html", permanent: true },
      { source: "/application/:path*", destination: "/apply-form.html", permanent: true },
      { source: "/advertising-chain", destination: "/#chains", permanent: true },
      { source: "/advertising-chain/:path*", destination: "/#chains", permanent: true },
      // 予備（推測）
      { source: "/contact", destination: "/#request", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/faq", destination: "/#faq", permanent: true },
    ].map((r) => ({ ...r, ...notSaiyo }));
  },
  // 採用支援事業サイト（saiyo.digirep.work）: public/saiyo の静的HTMLを、拡張子なしのURLで配信する。
  // ローカル確認は http://saiyo.localhost:3000/
  async rewrites() {
    const saiyoHost = [{ type: "host" as const, value: SAIYO_HOST }];
    return {
      beforeFiles: [
        { source: "/", has: saiyoHost, destination: "/saiyo/index.html" },
        { source: "/:file(robots\\.txt|sitemap\\.xml|404\\.html)", has: saiyoHost, destination: "/saiyo/:file" },
        { source: "/:dir(assets|img|download)/:rest*", has: saiyoHost, destination: "/saiyo/:dir/:rest*" },
        { source: "/:path((?!api/|saiyo-diagnosis|saiyo/|_next/|favicon).+)", has: saiyoHost, destination: "/saiyo/:path.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // 採用支援事業サイト: Google Fonts と地図の埋め込みを許可した CSP
        source: "/:path*",
        has: [{ type: "host", value: SAIYO_HOST }],
        headers: [{ key: "Content-Security-Policy", value: saiyoCsp }],
      },
      {
        // 採用スター診断（STUDIOのHPに埋め込む）: frame-ancestors で埋め込み元を限定して許可。
        // 同じキーは後のルールが優先される（X-Frame-Options は CSP の frame-ancestors がある場合は無視される）。
        source: "/saiyo-diagnosis/:path*",
        headers: [
          { key: "Content-Security-Policy", value: diagnosisCsp },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        // API はキャッシュ・インデックス禁止
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
