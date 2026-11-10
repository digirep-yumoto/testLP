// Meta（Facebook/Instagram）ピクセルID。設定時のみ有効（リターゲティング広告用）。
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * Meta ピクセルの noscript フォールバック。
 * スクリプト本体は GoogleAnalytics（DeferredLoader）側でまとめて遅延読み込みする。
 */
export function MetaPixel() {
  if (process.env.NODE_ENV !== "production" || !PIXEL_ID) return null;
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img height="1" width="1" alt="" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
    </noscript>
  );
}
