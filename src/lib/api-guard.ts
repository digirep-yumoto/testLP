// =====================================================================
// API 共通のガード（レート制限・定時間トークン照合・本文サイズ制限）
//
// 対象＝デジレップスタジオ専用の共有トークン認証エンドポイント
// （/api/publish-chains, /api/payment-link, /api/payment-status）。
// これらは GitHub への書き込みや Stripe の決済リンク発行を行うため、
// トークンの総当たりを許さないことが最優先。
// =====================================================================

import { createHash, timingSafeEqual } from "crypto";

export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
}

// --- レート制限（IP＋用途ごとの固定ウィンドウ） -----------------------
// ※ Vercel のインスタンスごとのメモリ上で動く best-effort。完全な分散制限が
//   必要になったら Upstash 等の外部ストアへ置き換えること。
type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

// メモリが無制限に増えないよう、期限切れを間引く
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
}

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const rec = buckets.get(key);
  if (!rec || now > rec.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  rec.count += 1;
  return rec.count > max;
}

// --- 認証失敗の連続遮断（総当たり対策） ------------------------------
// ★「確認」と「失敗の記録」を必ず分ける。確認側でカウントを増やすと、
//   正常な連続リクエストでも上限に達してしまう。
const AUTH_FAIL_MAX = 8;
const AUTH_FAIL_WINDOW = 10 * 60_000;

function authKey(request: Request, scope: string) {
  return `authfail:${scope}:${clientIp(request)}`;
}

/** 直近の認証失敗が多すぎるか（カウントは増やさない） */
export function authBlocked(request: Request, scope: string): boolean {
  const rec = buckets.get(authKey(request, scope));
  return !!rec && Date.now() <= rec.reset && rec.count > AUTH_FAIL_MAX;
}

/** 認証に失敗したときだけ呼ぶ（カウントを増やす） */
export function recordAuthFailure(request: Request, scope: string): void {
  rateLimited(authKey(request, scope), AUTH_FAIL_MAX, AUTH_FAIL_WINDOW);
}

// --- 定時間のトークン照合 ---------------------------------------------
/**
 * 文字列を定時間で比較する。長さの違いで早期returnしないよう、
 * 双方を SHA-256 で固定長にしてから timingSafeEqual にかける。
 */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

/** Authorization: Bearer <token> を定時間で検証する */
export function bearerMatches(request: Request, expected: string): boolean {
  const provided = (request.headers.get("authorization") || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
  // 短すぎるトークンは運用ミスとして拒否（照合自体は定時間で行う）
  if (expected.length < 16) return false;
  return safeEqual(provided, expected);
}

// --- 本文サイズ制限 ----------------------------------------------------
export type BodyResult =
  | { ok: true; text: string }
  | { ok: false; status: number; error: string };

/**
 * Content-Length と実データの両方で上限を確認しつつ本文を読む。
 * （Content-Length は詐称されうるため、読み出し後にも必ず検査する）
 */
export async function readBodyLimited(request: Request, maxBytes: number): Promise<BodyResult> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, status: 413, error: "送信データが大きすぎます。" };
  }
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    return { ok: false, status: 413, error: "送信データが大きすぎます。" };
  }
  return { ok: true, text };
}
