import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Content Security Policy。Stripe Checkout（外部遷移）と自己ホストに限定。
// 開発時は Turbopack の HMR/eval を許可するため緩める。
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  isProd
    ? "script-src 'self' 'unsafe-inline' https://js.stripe.com"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com" + (isProd ? "" : " ws: http://localhost:*"),
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
      { source: "/advertising-chain", destination: "/#chains", permanent: true },
      { source: "/advertising-chain/:path*", destination: "/#chains", permanent: true },
      { source: "/advertiser", destination: "/#toilet", permanent: true },
      { source: "/advertisers", destination: "/#toilet", permanent: true },
      { source: "/store", destination: "/#store", permanent: true },
      { source: "/shop", destination: "/#store", permanent: true },
      { source: "/download", destination: "/#docs", permanent: true },
      { source: "/documents", destination: "/#docs", permanent: true },
      { source: "/document", destination: "/#docs", permanent: true },
      { source: "/apply", destination: "/apply-form.html", permanent: true },
      { source: "/contact", destination: "/#request", permanent: true },
      { source: "/company", destination: "/#company", permanent: true },
      { source: "/about", destination: "/#company", permanent: true },
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
