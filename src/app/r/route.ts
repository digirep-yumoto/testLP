import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 個室トイレサイネージ：店舗別×広告主別の計測用QR（2026-11改定・成果報酬の「QR読み取り」）
 *   https://www.digirep.work/r?c=S001-A001&u=https%3A%2F%2Fexample.com%2Flp
 *   c … コード（店舗ID-広告主ID）。QRコード台帳（10_月次運用）で発行する
 *   u … 遷移先URL（広告主のLP・予約ページ）
 * 1) 読み取りを Google スプレッドシート（Apps Script）に記録 … QR_WEBHOOK_URL / QR_WEBHOOK_TOKEN
 * 2) 遷移先へ 302 リダイレクト（utm を付ける）
 * 同じ端末からの連続読み取り（10分以内・同じコード）は dup=1 を付けて記録し、月次集計で1件に数える。
 * 記録に失敗しても遷移は止めない（広告主の導線を優先）。
 */
const CODE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;
const DUP_WINDOW_SEC = 10 * 60;

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
  if (!dest.searchParams.has("utm_source")) {
    dest.searchParams.set("utm_source", "digirep");
    dest.searchParams.set("utm_medium", "toilet_signage");
    dest.searchParams.set("utm_campaign", code);
  }

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
          dest: dest.origin + dest.pathname,
          ua: (request.headers.get("user-agent") || "").slice(0, 200),
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
  res.headers.append(
    "Set-Cookie",
    `dr_q=${encodeURIComponent(`${code}|${Math.floor(Date.now() / 1000)}`)}; Path=/r; Max-Age=${DUP_WINDOW_SEC}; SameSite=Lax; Secure; HttpOnly`,
  );
  return res;
}
