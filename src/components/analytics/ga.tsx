import { DeferredLoader } from "./deferred-loader";

// GA4 測定ID（公開しても安全な値）。Vercel の NEXT_PUBLIC_GA_ID で上書き可能。
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-YPVY7DHW6Q";
// Google広告（リマーケティング/コンバージョン）タグID。設定時のみ有効（例: AW-XXXXXXXXX）。
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
// Meta（Facebook/Instagram）ピクセルID。設定時のみ有効。
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * Google Analytics 4（gtag.js）＋ Google広告タグ（任意）＋ Metaピクセル（任意）。
 * 本番ビルドのみ。読み込みは最初の操作か load 後3秒まで遅らせる（表示速度優先）。
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;
  return <DeferredLoader gaId={GA_ID} adsId={ADS_ID || undefined} pixelId={PIXEL_ID || undefined} />;
}
