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

    // 見込み客への自動返信（ナーチャリング1通目・HTML）。非ブロッキング。
    try {
      const site = process.env.NEXT_PUBLIC_SITE_URL || "https://digirep.work";
      const timerex = process.env.NEXT_PUBLIC_TIMEREX_URL || "";
      const esc = (v: string) =>
        v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
      const isLaundry = media.includes("ランドリー");
      const isToilet = media.includes("トイレ");
      const mediaLine = isLaundry
        ? "コインランドリーサイネージは、視聴者の約67%が女性・30〜50代。待ち時間に高頻度で接触でき、新商品告知・ブランディングに強みがあります。"
        : isToilet
        ? "個室トイレサイネージは、1対1・音あり・視認率90%。人に相談しづらい商材ほど“じっくり検討される約60秒”が効きます。"
        : "「個室トイレ（質）」と「コインランドリー（量・頻度）」の2媒体で、御社の商材に最適な届け方をご提案します。";
      const ctaHref = timerex || `${site}/#request`;
      const ctaLabel = timerex ? "オンライン相談の日程を予約する" : "無料相談・お見積りを依頼する";
      const greet = `${company ? esc(company) + "　" : ""}${esc(name)} 様`;
      const html =
        `<div style="font-family:-apple-system,'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;max-width:600px;margin:0 auto;color:#16243d;line-height:1.75;">` +
        `<div style="background:#0f172a;padding:20px 24px;border-radius:12px 12px 0 0;"><span style="color:#fff;font-size:18px;font-weight:800;">DigiRep（デジレップ）</span><span style="color:#9fb0cc;font-size:12px;display:block;margin-top:3px;">確実に見られるサイネージ広告メディア</span></div>` +
        `<div style="border:1px solid #e5e9f0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">` +
        `<p style="margin:0 0 14px;">${greet}</p>` +
        `<p style="margin:0 0 16px;">この度は DigiRep にお問い合わせいただき、誠にありがとうございます。内容を確認のうえ、担当より<strong>1営業日以内</strong>にご連絡いたします。</p>` +
        `<p style="margin:0 0 20px;">${mediaLine}</p>` +
        `<div style="background:#f4f8fc;border-radius:10px;padding:16px 18px;margin:0 0 20px;"><p style="margin:0 0 10px;font-weight:700;color:#0478bd;">DigiRepが選ばれる3つの理由</p>` +
        `<p style="margin:0 0 6px;">① <strong>視認率90%</strong>｜1対1・強制視聴に近い環境で“ちゃんと見られる”</p>` +
        `<p style="margin:0 0 6px;">② <strong>QRで効果を可視化</strong>｜視聴→予約/DL/来店まで数値で追える</p>` +
        `<p style="margin:0;">③ <strong>始めやすい</strong>｜単店・短期＋動画制作込みでスモールスタート可</p></div>` +
        `<div style="border-left:4px solid #0478bd;padding:2px 0 2px 14px;margin:0 0 22px;"><p style="margin:0 0 8px;font-weight:700;">ミーティングでわかること</p>` +
        `<p style="margin:0 0 4px;">・御社の商圏・ターゲットに合わせた<strong>配信イメージ</strong></p>` +
        `<p style="margin:0 0 4px;">・<strong>概算お見積り</strong>と、最適な媒体（トイレ/ランドリー）診断</p>` +
        `<p style="margin:0;">・<strong>効果レポートの実例</strong>（視認数・QR反応）</p></div>` +
        `<div style="text-align:center;margin:0 0 24px;"><a href="${ctaHref}" style="display:inline-block;background:#0478bd;color:#fff;text-decoration:none;font-weight:700;padding:13px 28px;border-radius:10px;">${ctaLabel} →</a></div>` +
        `<p style="margin:0 0 10px;font-weight:700;">まずは知りたい方へ</p>` +
        `<p style="margin:0 0 5px;">📄 <a href="${site}/#docs" style="color:#0478bd;">媒体資料・料金を見る</a></p>` +
        `<p style="margin:0 0 5px;">📖 <a href="${site}/blog/signage-ad-basics" style="color:#0478bd;">サイネージ広告とは？費用・効果・種類を解説</a></p>` +
        `<p style="margin:0 0 5px;">📈 <a href="${site}/blog/signage-tips" style="color:#0478bd;">効果を最大化する5つのポイント</a></p>` +
        `<hr style="border:none;border-top:1px solid #e5e9f0;margin:22px 0 14px;">` +
        `<p style="margin:0;font-size:12px;color:#8a98ad;">DigiRep（デジレップ株式会社）｜埼玉県新座市畑中1-13-16<br>本メールにご返信いただければ担当が確認いたします。</p>` +
        `</div></div>`;
      const text =
        `${company ? company + "　" : ""}${name} 様\n\n` +
        `この度は DigiRep（デジレップ）にお問い合わせいただき、誠にありがとうございます。\n` +
        `内容を確認のうえ、担当より1営業日以内にご連絡いたします。\n\n` +
        `${mediaLine}\n\n` +
        `【DigiRepが選ばれる3つの理由】\n` +
        `① 視認率90%（1対1・強制視聴に近い環境）\n` +
        `② QRで効果を可視化（視聴→予約/DL/来店を数値化）\n` +
        `③ 単店・短期＋制作込みで始めやすい\n\n` +
        `【ミーティングでわかること】\n` +
        `・御社の商圏に合わせた配信イメージ\n・概算お見積りと最適媒体の診断\n・効果レポートの実例\n\n` +
        `▼ ${ctaLabel}\n${ctaHref}\n\n` +
        `▼ 媒体資料・料金\n${site}/#docs\n▼ お役立ち記事\n${site}/blog\n\n` +
        `── DigiRep（デジレップ株式会社）\n埼玉県新座市畑中1-13-16\n本メールにご返信いただければ担当が確認いたします。`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || "DigiRep <onboarding@resend.dev>",
          to: [email],
          reply_to: to,
          subject: "【DigiRep】お問い合わせありがとうございます｜資料と“次の一歩”のご案内",
          html,
          text,
        }),
      });
    } catch {
      /* 自動返信の失敗は無視（受付は完了） */
    }
  } else {
    // メール連携未設定：サーバーログに記録（後で Resend 等を接続可能）
    console.log("[lead]", JSON.stringify(payload));
  }

  // Brevo（ステップメール自動化）へリードを自動登録。BREVO_API_KEY と BREVO_LIST_ID 設定時のみ・非ブロッキング。
  const brevoKey = process.env.BREVO_API_KEY;
  const brevoList = process.env.BREVO_LIST_ID;
  if (brevoKey && brevoList) {
    try {
      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "api-key": brevoKey, "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          email,
          attributes: { FNAME: name, COMPANY: company, PURPOSE: purpose, MEDIA: media },
          listIds: [Number(brevoList)],
          updateEnabled: true,
        }),
      });
    } catch {
      /* Brevo登録の失敗は無視（受付は完了） */
    }
  }

  return NextResponse.json({ ok: true });
}
