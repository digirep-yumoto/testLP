import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 計測用QR（店舗別×広告主別）。読み取りを記録してから、広告主のページへ進める。
 *   https://www.digirep.work/r?c=S001-A001&u=https%3A%2F%2Fexample.com%2Flp
 *   c … コード（店舗ID-広告主ID）
 *        個室トイレサイネージ：S001-A001（QRコード台帳・10_月次運用）
 *        コインランドリーの店頭QRセット：L041-KAO01（店舗番号の前に L。精算機ヨコのチラシに入れるQR）
 *   u … 遷移先URL（広告主のLP・クーポン・予約ページ）
 * 1) 読み取りを Google スプレッドシート（Apps Script）に記録 … QR_WEBHOOK_URL / QR_WEBHOOK_TOKEN
 * 2) 遷移先へ 302 リダイレクト（utm を付ける）
 * 同じ端末からの連続読み取り（10分以内・同じコード）は dup=1、機械による読み込み（リンクの安全確認・プレビュー）は bot=1 を付けて記録し、
 * 月次集計では数えない。記録に失敗しても遷移は止めない（広告主の導線を優先）。
 * コインランドリー（L で始まるコード）は、広告主との契約で「個人を特定しない情報のみ」と約束しているため、
 * 端末の情報は種類（iOS／Android／その他）だけを記録し、IPアドレスや詳しい端末情報は記録しない。
 */
const CODE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;
const DUP_WINDOW_SEC = 10 * 60;
const BOT = /bot|crawl|spider|slurp|preview|scan|monitor|fetch|curl|wget|python|java\/|okhttp|headless|facebookexternalhit|slack|discord|whatsapp|line-poker|google-safety|proofpoint|barracuda|mimecast|urldefense/i;

function deviceClass(ua: string): string {
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  return "その他";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = (url.searchParams.get("c") || "").trim();
  const raw = (url.searchParams.get("u") || "").trim();
  if (!CODE.test(code)) return NextResponse.json({ error: "コードが正しくありません。" }, { status: 400 });

  let dest: URL;
  try {
    dest = new URL(raw);
  } catch {
    return NextResponse.json({ error: "遷移先URLが正しくありません。" }, { status: 400 });
  }
  if (!/^https?:$/.test(dest.protocol) || raw.length > 2000 || /^(localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(dest.hostname)) {
    return NextResponse.json({ error: "遷移先URLが正しくありません。" }, { status: 400 });
  }
  const laundry = /^L\d/.test(code);
  if (!dest.searchParams.has("utm_source")) {
    dest.searchParams.set("utm_source", "digirep");
    dest.searchParams.set("utm_medium", laundry ? "laundry_store_qr" : "toilet_signage");
    dest.searchParams.set("utm_campaign", code);
  }

  const ua = request.headers.get("user-agent") || "";
  const bot = !ua || BOT.test(ua) || request.method === "HEAD" ? 1 : 0;

  // 連続読み取りの判定（同じ端末・同じコード・10分以内）
  const cookie = request.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)dr_q=([^;]+)/);
  let dup = 0;
  if (m) {
    const [prevCode, prevTs] = decodeURIComponent(m[1]).split("|");
    if (prevCode === code && Date.now() / 1000 - Number(prevTs) < DUP_WINDOW_SEC) dup = 1;
  }

  const hook = process.env.QR_WEBHOOK_URL;
  if (hook && /^https:\/\/script\.google\.com\//.test(hook)) {
    const [storeId, advId] = code.split("-");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: process.env.QR_WEBHOOK_TOKEN || "",
          at: new Date().toISOString(),
          code,
          storeId: storeId || "",
          advId: advId || "",
          dup,
          bot,
          media: laundry ? "laundry" : "toilet",
          dest: dest.origin + dest.pathname,
          ua: laundry ? deviceClass(ua) : ua.slice(0, 200),
        }),
        redirect: "follow",
        signal: ctrl.signal,
      });
    } catch (e) {
      console.error("[qr] webhook error", e);
    } finally {
      clearTimeout(timer);
    }
  }

  const res = NextResponse.redirect(dest.toString(), 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.append(
    "Set-Cookie",
    `dr_q=${encodeURIComponent(`${code}|${Math.floor(Date.now() / 1000)}`)}; Path=/r; Max-Age=${DUP_WINDOW_SEC}; SameSite=Lax; Secure; HttpOnly`,
  );
  return res;
}
