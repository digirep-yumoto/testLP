import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 簡易レート制限（IPごと・固定ウィンドウ）
const WINDOW_MS = 60_000;
const MAX_REQ = 6;
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_REQ;
}
function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
}
const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

/**
 * 資料請求・お問い合わせの受付。
 * RESEND_API_KEY と LEAD_TO_EMAIL が設定されていれば Resend でメール送信、
 * 未設定ならサーバーログに記録して受付完了を返す（後で通知連携可能）。
 */
export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "送信が多すぎます。時間をおいて再度お試しください。" }, { status: 429 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type が不正です。" }, { status: 415 });
  }

  const raw = await request.text();
  if (raw.length > 8000) {
    return NextResponse.json({ error: "入力が大きすぎます。" }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON の解析に失敗しました。" }, { status: 400 });
  }

  const s = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const purpose = s(body.purpose, 60);
  const company = s(body.company);
  const name = s(body.name);
  const email = s(body.email);
  const tel = s(body.tel);
  const media = s(body.media, 40);
  const message = s(body.message, 2000);

  if (!name || !isEmail(email)) {
    return NextResponse.json({ error: "お名前と正しいメールアドレスをご入力ください。" }, { status: 400 });
  }

  const payload = { purpose, company, name, email, tel, media, message, at: new Date().toISOString() };

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL || "digirep.yumoto@gmail.com";
  if (resendKey && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || "DigiRep <onboarding@resend.dev>",
          to: [to],
          reply_to: email,
          subject: `【お問い合わせ】${purpose || "お問い合わせ"}／${company || name} 様`,
          text: `ご用件: ${purpose}\n会社名: ${company}\n氏名: ${name}\nメール: ${email}\n電話: ${tel}\n興味のある媒体: ${media}\n\n${message}`,
        }),
      });
      if (!res.ok) throw new Error("resend failed");
    } catch {
      return NextResponse.json({ error: "送信に失敗しました。時間をおいて再度お試しください。" }, { status: 502 });
    }

    // 見込み客への自動返信（ナーチャリング1通目）。失敗しても受付は成立させる（非ブロッキング）。
    // ※ 実際に届くには Resend で送信ドメイン(digirep.work)の認証が必要。
    try {
      const site = process.env.NEXT_PUBLIC_SITE_URL || "https://digirep.work";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || "DigiRep <onboarding@resend.dev>",
          to: [email],
          reply_to: to,
          subject: "【DigiRep】お問い合わせありがとうございます",
          text:
            `${company ? company + "　" : ""}${name} 様\n\n` +
            `この度は DigiRep（デジレップ）にお問い合わせいただき、誠にありがとうございます。\n` +
            `内容を確認のうえ、担当より1営業日以内にご連絡いたします。\n\n` +
            `▼ 媒体資料・料金はこちらからもご覧いただけます\n${site}/#docs\n\n` +
            `▼ お役立ち記事（サイネージ広告の基礎・業種別ノウハウ）\n${site}/blog\n\n` +
            `── DigiRep（デジレップ株式会社）\n${site}\n` +
            `本メールは送信専用です。ご返信いただいてもお受けできます（担当が確認します）。`,
        }),
      });
    } catch {
      /* 自動返信の失敗は無視（受付は完了） */
    }
  } else {
    // メール連携未設定：サーバーログに記録（後で Resend 等を接続可能）
    console.log("[lead]", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true });
}
