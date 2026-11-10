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

/** 採用支援のリード1件を、営業管理システム（顧客リスト）に取り込めるCSV（UTF-8 BOM・1行）にする。診断結果があれば点数も列にする。 */
function leadCsv(p: Record<string, string>, diag: string): string {
  const pick = (re: RegExp) => (diag.match(re)?.[1] || "").trim();
  const lay = diag.match(/中身 (\d+)／見え方 (\d+)／動かし方 (\d+)/);
  // 列は営業管理システム（MCC_営業管理システム）の「CSV取込」テンプレートと同じ並び
  const cols = ["会社名", "電話", "業種", "従業員数", "所在地", "担当者", "メール", "URL", "掲載媒体", "募集職種", "メモ"];
  const target = pick(/ターゲット：([^\n]+)/), type = pick(/タイプ：([^\n]+)/), leak = pick(/離脱ポイント：([^\n]+)/);
  const from = (p.message.match(/送信元ページ：([^\n]+)/)?.[1] || "").trim();
  const rest = p.message.replace(/送信元ページ：[^\n]*\n?/, "").replace(/\n/g, " ／ ").replace(/\s*／\s*$/, "").trim();
  const memo = [`受付 ${p.at.slice(0, 16).replace("T", " ")}`, p.purpose, target && `採用したい人：${target}`, type && `診断タイプ：${type}`, lay && `中身${lay[1]}／見え方${lay[2]}／動かし方${lay[3]}`, leak && `離脱：${leak}`, from && `送信元 ${from}`, rest].filter(Boolean).join("　");
  const row = [p.company, p.tel, pick(/業種：([^／\n]+)/).replace(/の平均$/, ""), "", "", p.name, p.email, "", "HP問い合わせ", "", memo];
  const q = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return "\uFEFF" + [cols, row].map((r) => r.map(q).join(",")).join("\r\n") + "\r\n";
}

/**
 * 資料請求・お問い合わせの受付。
 * RESEND_API_KEY と LEAD_TO_EMAIL が設定されていれば Resend でメール送信、
 * 未設定ならサーバーログに記録して受付完了を返す（後で通知連携可能）。
 */
export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "送信が多すぎます。時間をおいて再度お試しください。" }, { status: 429 });
  }
  // 自社サイト以外からの投稿（スパムボット・他サイトからのCSRF）を拒否する
  const origin = request.headers.get("origin") || "";
  const okOrigin = !origin || /^https:\/\/(www\.)?digirep\.work$|^https:\/\/saiyo\.digirep\.work$|^https:\/\/[a-z0-9-]+\.vercel\.app$|^http:\/\/([a-z0-9-]+\.)?localhost(:\d+)?$/.test(origin);
  if (!okOrigin) {
    return NextResponse.json({ error: "不正な送信元です。" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type が不正です。" }, { status: 415 });
  }

  const raw = await request.text();
  if (raw.length > 16000) {
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
  const diag = s(body.diag, 4000); // かんたん採用スター診断の結果（採用支援サイトの診断ページから）

  if (!name || !isEmail(email)) {
    return NextResponse.json({ error: "お名前と正しいメールアドレスをご入力ください。" }, { status: 400 });
  }
  // スパム対策：ハニーポット（人間には見えない欄）に値がある／本文にURLが4つ以上／明らかに機械的な送信は、受付したふりをして捨てる
  const honey = s(body.hp, 200) || s(body._honey, 200) || s(body.website, 200);
  const urlCount = (message.match(/https?:\/\//g) || []).length;
  if (honey || urlCount >= 4) {
    return NextResponse.json({ ok: true });
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
          subject: `${purpose.startsWith("採用支援") ? "【採用の顔】" : "【お問い合わせ】"}${purpose || "お問い合わせ"}／${company || name} 様`,
          text: `ご用件: ${purpose}\n会社名: ${company}\n氏名: ${name}\nメール: ${email}\n電話: ${tel}\n興味のある媒体: ${media}\n\n${message}` + (diag ? `\n\n【かんたん採用スター診断の結果】\n${diag}` : "") + (purpose.startsWith("採用支援") ? "\n\n※添付のCSVは、営業管理システムの「CSV取込」にそのまま読み込める形式です（顧客リストに追加されます）。" : ""),
          ...(purpose.startsWith("採用支援") ? { attachments: [{ filename: `lead_${payload.at.slice(0, 10)}_${(company || name).replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 30)}.csv`, content: Buffer.from(leadCsv(payload, diag)).toString("base64") }] } : {}),
        }),
      });
      if (!res.ok) throw new Error("resend failed");
    } catch {
      return NextResponse.json({ error: "送信に失敗しました。時間をおいて再度お試しください。" }, { status: 502 });
    }

    // 見込み客への自動返信（ナーチャリング1通目・HTML）。非ブロッキング。
    try {
      const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.digirep.work";
      const timerex = process.env.NEXT_PUBLIC_TIMEREX_URL || "";
      const esc = (v: string) =>
        v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
      const isPackage = purpose.startsWith("助成金パッケージ");
      const isSaiyo = purpose.startsWith("採用支援");
      const isLaundry = media.includes("ランドリー");
      const isToilet = media.includes("トイレ");
      const mediaLine = isLaundry
        ? "コインランドリーサイネージ（BlueSky LAUNDRY TV）は、全国約400店・55インチ・音声つき。利用者の約7割が女性・30〜50代で、待ち時間に繰り返し接触できます。掲載枠は店舗ごとに最大6社・先着順で、配信開始日は枠の空き状況に合わせてご案内します。"
        : isToilet
        ? "個室トイレサイネージは、1対1・音あり・視認率90%。人に相談しづらい商材ほど“じっくり検討される約60秒”が効きます。設置店舗から順次ご案内します。"
        : "「コインランドリー（量・頻度）」と「個室トイレ（質）」の2媒体で、御社の商材に最適な届け方をご提案します。";
      const ctaHref = timerex || `${site}/#request`;
      const ctaLabel = timerex ? "オンライン相談の日程を予約する" : "無料相談・お見積りを依頼する";
      const greet = `${company ? esc(company) + "　" : ""}${esc(name)} 様`;
      const pkgHtml =
        `<div style="font-family:-apple-system,'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;max-width:600px;margin:0 auto;color:#16243d;line-height:1.75;">` +
        `<div style="background:#0f1e33;padding:20px 24px;border-radius:12px 12px 0 0;"><span style="color:#fff;font-size:18px;font-weight:800;">デジレップ株式会社</span><span style="color:#9fb0cc;font-size:12px;display:block;margin-top:3px;">SNS×AI研修・PR動画・トイレサイネージのパッケージ</span></div>` +
        `<div style="border:1px solid #e5e9f0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">` +
        `<p style="margin:0 0 14px;">${greet}</p>` +
        `<p style="margin:0 0 16px;">ミーティングのご希望をありがとうございます。担当の湯本より<strong>1営業日以内</strong>に、候補日のご案内をお送りします。</p>` +
        `<div style="background:#f4f8fc;border-radius:10px;padding:16px 18px;margin:0 0 20px;"><p style="margin:0 0 10px;font-weight:700;color:#0478bd;">1回目のミーティング（約30分）でわかること</p>` +
        `<p style="margin:0 0 6px;">① 御社が<strong>助成金の対象になるか</strong>（その場で判定）</p>` +
        `<p style="margin:0 0 6px;">② 御社に合う<strong>プランと金額</strong>（人数別の試算）</p>` +
        `<p style="margin:0;">③ サイネージの<strong>設置場所</strong>とスケジュール</p></div>` +
        `<div style="border-left:4px solid #0478bd;padding:2px 0 2px 14px;margin:0 0 22px;"><p style="margin:0 0 8px;font-weight:700;">当日までにお手元にあると早いもの</p>` +
        `<p style="margin:0 0 4px;">・直近の年商（おおよそで結構です）</p><p style="margin:0 0 4px;">・雇用保険に入っている従業員の人数</p><p style="margin:0;">・決算月</p></div>` +
        `<p style="margin:0 0 10px;font-size:13px;color:#5b6b80;">助成金は支給要件を満たし期限内に申請した場合に支給されるもので、支給を保証するものではありません。研修費は全額お支払いいただき、協力金（掲載・交流会開催）は、記事掲載・交流会・サイネージ設置へのご協力の対価として別契約に基づきお支払いします。サイネージ端末は無償貸与です。</p>` +
        `<hr style="border:none;border-top:1px solid #e5e9f0;margin:22px 0 14px;">` +
        `<p style="margin:0;font-size:12px;color:#8a98ad;">デジレップ株式会社｜埼玉県新座市畑中1-13-16<br>本メールにご返信いただければ担当が確認いたします。</p>` +
        `</div></div>`;
      const pkgText =
        `${company ? company + "　" : ""}${name} 様

` +
        `ミーティングのご希望をありがとうございます。
担当の湯本より1営業日以内に、候補日のご案内をお送りします。

` +
        `【1回目のミーティング（約30分）でわかること】
① 御社が助成金の対象になるか（その場で判定）
② 御社に合うプランと金額（人数別の試算）
③ サイネージの設置場所とスケジュール

` +
        `【当日までにお手元にあると早いもの】
・直近の年商（おおよそ）
・雇用保険に入っている従業員の人数
・決算月

` +
        `※助成金は支給要件を満たし期限内に申請した場合に支給されるもので、支給を保証するものではありません。研修費は全額お支払いいただき、協力金（掲載・交流会開催）は、記事掲載・交流会・サイネージ設置へのご協力の対価として別契約に基づきお支払いします。サイネージ端末は無償貸与です。

` +
        `── デジレップ株式会社｜埼玉県新座市畑中1-13-16
本メールにご返信いただければ担当が確認いたします。`;
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
      const saiyoSite = "https://saiyo.digirep.work";
      const saiyoHtml =
        `<div style="font-family:-apple-system,'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;max-width:600px;margin:0 auto;color:#1c2333;line-height:1.75;">` +
        `<div style="background:#0f1f3d;padding:20px 24px;border-radius:12px 12px 0 0;"><span style="color:#fff;font-size:18px;font-weight:800;">採用の顔・新卒ダイレクト</span><span style="color:#ffb48f;font-size:12px;margin-left:10px;">デジレップ株式会社 採用支援事業</span></div>` +
        `<div style="border:1px solid #e5e9f0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">` +
        `<p style="margin:0 0 14px;">${greet}</p>` +
        `<p style="margin:0 0 16px;">お申込み・お問い合わせをありがとうございます。担当の湯本より<strong>1営業日以内</strong>に、ご希望の日時の確認のご連絡を差し上げます。</p>` +
        `<div style="background:#fff5ee;border-radius:10px;padding:16px 18px;margin:0 0 20px;"><p style="margin:0 0 10px;font-weight:700;color:#e8622c;">無料の採用診断（Web30分）でお渡しするもの</p>` +
        `<p style="margin:0 0 6px;">① 御社の求人票・採用ページを見て、<strong>改善点を3つ</strong></p>` +
        `<p style="margin:0 0 6px;">② 御社の<strong>採用キャッチコピー案を1つ</strong></p>` +
        `<p style="margin:0;">③ 採用の顔・新卒ダイレクトが<strong>向いているかどうか</strong>（向いていなければ、そうお伝えします）</p></div>` +
        `<div style="border-left:4px solid #e8622c;padding:2px 0 2px 14px;margin:0 0 22px;"><p style="margin:0 0 8px;font-weight:700;">当日までにあると早いもの</p>` +
        `<p style="margin:0 0 4px;">・いまの求人票（URLまたは原稿）</p><p style="margin:0 0 4px;">・採用ページ・会社ホームページのURL</p><p style="margin:0;">・直近1年の応募数・採用数（分かる範囲で）</p></div>` +
        `<p style="margin:0 0 10px;font-weight:700;">先に見ておきたい方へ</p>` +
        `<p style="margin:0 0 5px;">📄 <a href="${saiyoSite}/service" style="color:#e8622c;">採用の顔（採用コンテンツ一式・88万円〜）</a></p>` +
        `<p style="margin:0 0 5px;">🎓 <a href="${saiyoSite}/service/direct" style="color:#e8622c;">新卒ダイレクト（内定承諾を人数で保証）</a></p>` +
        `<p style="margin:0 0 5px;">⭐ <a href="${saiyoSite}/diagnosis/check" style="color:#e8622c;">かんたん採用スター診断（無料・約5分）</a></p>` +
        `<hr style="border:none;border-top:1px solid #e5e9f0;margin:22px 0 14px;">` +
        `<p style="margin:0;font-size:12px;color:#8a98ad;">デジレップ株式会社 採用支援事業｜〒352-0003 埼玉県新座市畑中1-13-16｜TEL 080-5527-1689（平日9:00〜19:00）<br>本メールにご返信いただければ担当が確認いたします。</p>` +
        `</div></div>`;
      const saiyoText =
        `${company ? company + "　" : ""}${name} 様\n\n` +
        `お申込み・お問い合わせをありがとうございます。\n担当の湯本より1営業日以内に、ご希望の日時の確認のご連絡を差し上げます。\n\n` +
        `【無料の採用診断（Web30分）でお渡しするもの】\n① 求人票・採用ページの改善点3つ\n② 採用キャッチコピー案1つ\n③ 採用の顔・新卒ダイレクトが向いているかどうか\n\n` +
        `【当日までにあると早いもの】\n・いまの求人票（URLまたは原稿）\n・採用ページ・会社ホームページのURL\n・直近1年の応募数・採用数（分かる範囲で）\n\n` +
        `▼ 採用の顔\n${saiyoSite}/service\n▼ 新卒ダイレクト\n${saiyoSite}/service/direct\n▼ かんたん採用スター診断（無料）\n${saiyoSite}/diagnosis/check\n\n` +
        `── デジレップ株式会社 採用支援事業\n〒352-0003 埼玉県新座市畑中1-13-16｜TEL 080-5527-1689\n本メールにご返信いただければ担当が確認いたします。`;
      // かんたん採用スター診断の結果の控え（回答の生データは除く）を、自動返信に差し込む
      const diagCopy = diag.replace(/\n回答：[\s\S]*$/, "").trim();
      const diagHtml = diagCopy
        ? `<div style="background:#f6f4ee;border-radius:10px;padding:16px 18px;margin:0 0 20px;"><p style="margin:0 0 8px;font-weight:700;color:#0f1f3d;">⭐ かんたん採用スター診断の結果（控え）</p><p style="margin:0;font-size:13.5px;line-height:1.8;">${esc(diagCopy).replace(/\n/g, "<br>")}</p><p style="margin:10px 0 0;font-size:12px;color:#5d667a;">詳しい診断（37問・Web30分）では、課題の優先順位・社風カラー・勝ち筋と、御社の採用キャッチコピー案までお渡しします。</p></div>`
        : "";
      const diagText = diagCopy ? `【かんたん採用スター診断の結果（控え）】\n${diagCopy}\n\n` : "";
      const saiyoHtml2 = diagHtml ? saiyoHtml.replace('<hr style', diagHtml + '<hr style') : saiyoHtml;
      const saiyoText2 = diagText ? saiyoText.replace('── デジレップ', diagText + '── デジレップ') : saiyoText;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || "DigiRep <onboarding@resend.dev>",
          to: [email],
          reply_to: to,
          subject: isSaiyo ? (diagCopy ? "【採用の顔】かんたん診断の結果（控え）と、詳しい診断のご案内" : "【採用の顔】お申込みありがとうございます｜無料採用診断のご案内") : isPackage ? "【デジレップ】ミーティングのご希望ありがとうございます" : "【DigiRep】お問い合わせありがとうございます｜資料と“次の一歩”のご案内",
          html: isSaiyo ? saiyoHtml2 : isPackage ? pkgHtml : html,
          text: isSaiyo ? saiyoText2 : isPackage ? pkgText : text,
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
  if (brevoKey && brevoList && !purpose.startsWith("採用支援")) {
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
