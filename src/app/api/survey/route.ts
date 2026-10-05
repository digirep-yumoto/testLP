import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/api-guard";
import { survey, cleanAnswers, allQuestions, surveyState, SOURCES } from "@/lib/survey-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v) && v.length <= 200;

/**
 * ご利用者アンケートの受付。
 * 保存先は Google スプレッドシート（Apps Script のウェブアプリ）。
 *   SURVEY_WEBHOOK_URL   … ウェブアプリのURL
 *   SURVEY_WEBHOOK_TOKEN … 合言葉（Apps Script 側と同じ値）
 * 未設定・失敗のときは、回答を失わないよう Resend でメール送信に切り替える。
 * どちらにも保存できなかったときはエラーを返し、回答者がもう一度送れるようにする。
 */
export async function POST(request: Request) {
  if (rateLimited(`survey:${clientIp(request)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "送信が続いています。少し時間をおいてお試しください。" }, { status: 429 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "送信形式が正しくありません。" }, { status: 415 });
  }
  const raw = await request.text();
  if (raw.length > 12000) return NextResponse.json({ error: "入力が大きすぎます。" }, { status: 413 });
  let body: Record<string, unknown>;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "送信内容を読み取れませんでした。" }, { status: 400 }); }

  // 機械的な投稿よけ（人には見えない欄に入力がある／開いてすぐの送信）
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });
  const elapsed = Number(body.elapsedSec) || 0;
  if (elapsed < 15) return NextResponse.json({ error: "もう一度、内容を確認して送信してください。" }, { status: 400 });

  // 受付開始前の送信は確認用として受け、印を付けて本番の回答と分ける
  const state = surveyState();
  if (state === "closed") return NextResponse.json({ error: "このアンケートは受付を終了しました。" }, { status: 403 });
  const preview = state === "before";

  const { answers, error } = cleanAnswers(body.answers);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const wantsPrize = body.wantsPrize === true;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (wantsPrize && !isEmail(email)) return NextResponse.json({ error: "抽選に応募する場合は、正しいメールアドレスを入力してください。" }, { status: 400 });
  if (body.agree !== true) return NextResponse.json({ error: "個人情報の取扱いへの同意が必要です。" }, { status: 400 });

  const src = typeof body.source === "string" && body.source in SOURCES ? body.source : "";
  const row = {
    surveyId: survey.id,
    at: new Date().toISOString(),
    source: SOURCES[src],
    elapsedSec: Math.min(3600, Math.round(elapsed)),
    preview,
    email: wantsPrize ? email : "",
    answers: Object.fromEntries(allQuestions.map((q) => [q.id, Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).join("、") : answers[q.id] || ""])),
    labels: Object.fromEntries(allQuestions.map((q) => [q.id, q.label])),
  };

  let saved = false;
  const hook = process.env.SURVEY_WEBHOOK_URL;
  if (hook && /^https:\/\/script\.google\.com\//.test(hook)) {
    try {
      const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: process.env.SURVEY_WEBHOOK_TOKEN || "", ...row }), redirect: "follow" });
      const t = await res.text();
      saved = res.ok && t.includes('"ok":true');
      if (!saved) console.error("[survey] webhook rejected", res.status, t.slice(0, 200));
    } catch (e) { console.error("[survey] webhook error", e); }
  }
  if (!saved) {
    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_TO_EMAIL || "digirep.yumoto@gmail.com";
    if (resendKey) {
      try {
        const lines = allQuestions.map((q) => `${q.label}\n → ${row.answers[q.id] || "（未回答）"}`).join("\n\n");
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: process.env.LEAD_FROM_EMAIL || "DigiRep <onboarding@resend.dev>", to: [to], subject: `【ランドリーアンケート】回答（${row.source}）`, text: `受付: ${row.at}\n経路: ${row.source}\n抽選用メール: ${row.email || "（応募なし）"}\n所要: ${row.elapsedSec}秒\n\n${lines}\n\n--- 取り込み用 ---\n${JSON.stringify(row)}` }),
        });
        saved = res.ok;
      } catch (e) { console.error("[survey] mail error", e); }
    }
  }
  if (!saved) {
    console.error("[survey] not saved", JSON.stringify(row));
    return NextResponse.json({ error: "ただいま送信を受け付けられません。お手数ですが、少し時間をおいてもう一度お試しください。" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, prize: wantsPrize });
}
