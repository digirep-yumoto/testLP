import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 簡易レート制限（IPごと・固定ウィンドウ）
const WINDOW_MS = 60_000;
const MAX_REQ = 5;
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
const esc = (v: string) =>
  v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

/**
 * お申込みフォーム（public/apply-form.html・public/store-form.html）の受付。
 * 入力内容を当社へメールで通知し（申込データのJSONを添付）、お客さまへ受付の確認メールを送る。
 * メール連携（RESEND_API_KEY）が未設定のときは 503 を返す：フォーム側は「受け付けました」を出さず、
 * 電話・お問い合わせフォームへ案内する（届いていないのに受付完了と表示しないため）。
 */
export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "送信が多すぎます。時間をおいて再度お試しください。" }, { status: 429 });
  }
  // 自社サイト以外からの投稿を拒否する
  const origin = request.headers.get("origin") || "";
  const okOrigin =
    !origin ||
    /^https:\/\/(www\.)?digirep\.work$|^https:\/\/[a-z0-9-]+\.vercel\.app$|^http:\/\/([a-z0-9-]+\.)?localhost(:\d+)?$/.test(origin);
  if (!okOrigin) {
    return NextResponse.json({ error: "不正な送信元です。" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type が不正です。" }, { status: 415 });
  }

  const raw = await request.text();
  if (raw.length > 60000) {
    return NextResponse.json({ error: "入力が大きすぎます。" }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON の解析に失敗しました。" }, { status: 400 });
  }

  const s = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const kind = s(body.kind, 20);
  const company = s(body.company);
  const name = s(body.name);
  const email = s(body.email);
  const tel = s(body.tel, 40);
  const summary = s(body.summary, 6000);
  const isTest = body.test === true;

  if (kind !== "advertiser" && kind !== "store") {
    return NextResponse.json({ error: "フォームの種類が不正です。" }, { status: 400 });
  }
  if (!company || !name || !isEmail(email)) {
    return NextResponse.json({ error: "会社名・ご担当者名・正しいメールアドレスをご入力ください。" }, { status: 400 });
  }
  // スパム対策：本文にURLが6つ以上ある送信は、受付したふりをして捨てる
  if ((summary.match(/https?:\/\//g) || []).length >= 6) {
    return NextResponse.json({ ok: true });
  }

  let dataJson = "{}";
  try {
    dataJson = JSON.stringify(body.data && typeof body.data === "object" ? body.data : {}, null, 2).slice(0, 50000);
  } catch {
    dataJson = "{}";
  }

  const at = new Date().toISOString();
  const kindLabel = kind === "advertiser" ? "広告主" : "加盟店";
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL || "digirep.yumoto@gmail.com";
  const from = process.env.LEAD_FROM_EMAIL || "DigiRep <onboarding@resend.dev>";

  if (!resendKey) {
    console.log("[apply] mail not configured", JSON.stringify({ kind, company, name, at }));
    return NextResponse.json(
      { error: "ただいま送信を受け付けられません。" },
      { status: 503 },
    );
  }

  // 1) 当社への通知（申込データのJSONを添付）
  try {
    const safeName = company.replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 30);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `${isTest ? "【テスト送信】" : ""}【お申込み】${kindLabel}／${company} 様`,
        text:
          `${isTest ? "※ これは動作確認のテスト送信です。\n\n" : ""}` +
          `ホームページの「${kindLabel}お申込みフォーム」から申込がありました。\n\n` +
          `会社名・店舗名: ${company}\nご担当者: ${name}\nメール: ${email}\n電話: ${tel}\n受付日時: ${at}\n\n` +
          `${summary}\n\n` +
          `申込データ（JSON）を添付しています。このメールに返信すると、お客さまに届きます。`,
        attachments: [
          {
            filename: `application_${kind}_${at.slice(0, 10)}_${safeName}.json`,
            content: Buffer.from(dataJson, "utf8").toString("base64"),
          },
        ],
      }),
    });
    if (!res.ok) throw new Error("resend failed");
  } catch {
    return NextResponse.json({ error: "送信に失敗しました。時間をおいて再度お試しください。" }, { status: 502 });
  }

  // 2) お客さまへの受付確認（非ブロッキング。テスト送信では送らない。入力された自由記述は載せない）
  if (!isTest) {
    try {
      const greet = `${company}　${name} 様`;
      const next =
        kind === "advertiser"
          ? "ご連絡の際に、正式なお見積り・配信開始日・ご契約のお手続きをご案内します。"
          : "ご連絡の際に、設置までの流れとご契約のお手続きをご案内します。";
      const foot = "デジレップ株式会社｜〒352-0003 埼玉県新座市畑中1-13-16｜TEL 080-5527-1689（平日9:00〜19:00）";
      const text =
        `${greet}\n\n` +
        `この度はお申込みいただき、誠にありがとうございます。\n` +
        `内容を確認のうえ、担当より1営業日以内にご連絡いたします。\n${next}\n\n` +
        `お申込み内容の控えは、送信後の画面の「見積書」「契約書」ボタンから保存・印刷できます。\n` +
        `お心当たりのない場合や、内容の変更・取り消しをご希望の場合は、本メールにご返信ください。\n\n` +
        `── ${foot}\n本メールにご返信いただければ担当が確認いたします。`;
      const html =
        `<div style="font-family:-apple-system,'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;max-width:600px;margin:0 auto;color:#16243d;line-height:1.75;">` +
        `<div style="background:#075f78;padding:20px 24px;border-radius:12px 12px 0 0;"><span style="color:#fff;font-size:18px;font-weight:800;">デジレップ株式会社</span></div>` +
        `<div style="border:1px solid #e5e9f0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">` +
        `<p style="margin:0 0 14px;">${esc(greet)}</p>` +
        `<p style="margin:0 0 14px;">この度はお申込みいただき、誠にありがとうございます。<br>内容を確認のうえ、担当より<strong>1営業日以内</strong>にご連絡いたします。</p>` +
        `<p style="margin:0 0 14px;">${next}</p>` +
        `<p style="margin:0 0 14px;font-size:13.5px;color:#475569;">お申込み内容の控えは、送信後の画面の「見積書」「契約書」ボタンから保存・印刷できます。<br>お心当たりのない場合や、内容の変更・取り消しをご希望の場合は、本メールにご返信ください。</p>` +
        `<hr style="border:none;border-top:1px solid #e5e9f0;margin:22px 0 14px;">` +
        `<p style="margin:0;font-size:12px;color:#64748b;">${foot}<br>本メールにご返信いただければ担当が確認いたします。</p>` +
        `</div></div>`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [email],
          reply_to: to,
          subject: "【デジレップ】お申込みを受け付けました",
          html,
          text,
        }),
      });
    } catch {
      /* 受付確認メールの失敗は無視（当社への通知は完了している） */
    }
  }

  return NextResponse.json({ ok: true });
}
