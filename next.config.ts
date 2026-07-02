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
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://www.facebook.com" +
    (isProd ? "" : " ws: http://localhost:*"),
  "frame-src https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

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
    return [
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
      { source: "/company", destination: "/#company", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/faq", destination: "/#faq", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
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
