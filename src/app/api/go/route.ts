import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 採用支援サイト：会社ごとの計測リンク（営業管理システム「関心リスト」の、自社で送る分）
 *   https://saiyo.digirep.work/l/k7f3q2m?to=check3&ref=mail   （/l/:code は next.config.ts で /api/go?c=:code に書き換え）
 *   c  … コード（営業管理システムが会社ごとに発行する7文字。会社名などの情報は含まない）
 *   to … 行き先（下の表にあるものだけ。任意のURLへは飛ばさない）
 *   ref … 流入の目印（英数字・_・- だけ。行き先のページへそのまま渡す）
 * 1) 開かれたことを Google スプレッドシート（Apps Script）に記録 … LINK_WEBHOOK_URL / LINK_WEBHOOK_TOKEN
 * 2) 行き先へ 302 リダイレクト
 * 同じ端末の連続した読み込み（10分以内・同じコード）は dup=1、機械による読み込み（リンクの安全確認・プレビュー）は bot=1 を付けて記録し、
 * 営業管理システム側で数えない。記録に失敗しても、行き先への移動は止めない。
 */
const CODE = /^[a-z0-9]{5,12}$/;
const REF = /^[A-Za-z0-9_-]{1,24}$/;
const DEST: Record<string, string> = {
  top: "/",
  check3: "/check3",
  dr: "/service/direct",
  drcheck: "/service/direct#drcheck",
  kao: "/service",
  compare: "/download/saiyo-no-kao_direct_compare.pdf",
  diag: "/diagnosis/check",
  works: "/works",
};
const BOT = /bot|crawl|spider|slurp|preview|scan|monitor|fetch|curl|wget|python|java\/|okhttp|headless|facebookexternalhit|slack|discord|whatsapp|line-poker|google-safety|proofpoint|barracuda|mimecast|urldefense/i;
const DUP_WINDOW_SEC = 10 * 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  // /l/コード で来たときは、書き換え前のURLがそのまま渡ることがあるので、パスからも読む
  const fromPath = (url.pathname.match(/^\/l\/([A-Za-z0-9]{5,12})\/?$/) || [])[1] || "";
  const code = (url.searchParams.get("c") || fromPath).trim().toLowerCase();
  const to = (url.searchParams.get("to") || "top").trim();
  const refRaw = (url.searchParams.get("ref") || "").trim();
  const ref = REF.test(refRaw) ? refRaw : "";
  const path = DEST[to] || DEST.top;

  // 行き先（同じサイトの中だけ）。流入の目印とコードを付けて、フォームの通知に残るようにする
  const [p, hash] = path.split("#");
  const qs = new URLSearchParams();
  if (!p.endsWith(".pdf")) {
    qs.set("ref", ref || "link");
    if (CODE.test(code)) qs.set("utm_campaign", code);
  }
  // 本番では、どのホストから呼ばれても採用支援サイトへ進める（ローカル確認のときだけ、呼ばれたホストのまま）
  const base = /(^|\.)localhost$/.test(url.hostname) ? url.origin : "https://saiyo.digirep.work";
  const dest = new URL(p + (qs.toString() ? `?${qs}` : "") + (hash ? `#${hash}` : ""), base).toString();

  if (!CODE.test(code)) return NextResponse.redirect(dest, 302);

  const ua = request.headers.get("user-agent") || "";
  const bot = !ua || BOT.test(ua) || request.method === "HEAD" ? 1 : 0;
  const cookie = request.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)sg_l=([^;]+)/);
  let dup = 0;
  if (m) {
    const [prevCode, prevTs] = decodeURIComponent(m[1]).split("|");
    if (prevCode === code && Date.now() / 1000 - Number(prevTs) < DUP_WINDOW_SEC) dup = 1;
  }

  const hook = process.env.LINK_WEBHOOK_URL;
  if (hook && /^https:\/\/script\.google\.com\//.test(hook)) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: process.env.LINK_WEBHOOK_TOKEN || "", at: new Date().toISOString(), code, to: DEST[to] ? to : "top", dup, bot, ref }),
        redirect: "follow",
        signal: ctrl.signal,
      });
    } catch (e) {
      console.error("[go] webhook error", e);
    } finally {
      clearTimeout(timer);
    }
  }

  const res = NextResponse.redirect(dest, 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.append("Set-Cookie", `sg_l=${encodeURIComponent(`${code}|${Math.floor(Date.now() / 1000)}`)}; Path=/; Max-Age=${DUP_WINDOW_SEC}; SameSite=Lax; Secure; HttpOnly`);
  return res;
}
