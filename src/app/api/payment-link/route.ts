import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// デジレップスタジオ（別オリジン）から呼ぶため CORS を許可（認証は共有トークン）
const cors: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

// STUDIO_API_TOKEN による認証（Bearer）。null=未設定、false=不一致、true=OK
function authState(request: Request): boolean | null {
  const token = process.env.STUDIO_API_TOKEN;
  if (!token) return null;
  const provided = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  return provided.length >= 16 && provided === token;
}

/**
 * デジレップスタジオ専用：Stripe 決済リンクを発行する（カード希望の取引先向け）。
 * スタジオの担当者が確定金額・説明・案件番号を送信 → 決済リンク URL を返す。
 * 必要な環境変数: STRIPE_SECRET_KEY, STUDIO_API_TOKEN
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "決済機能は未設定です（STRIPE_SECRET_KEY）。" }, { status: 503, headers: cors });
  }
  const auth = authState(request);
  if (auth === null) {
    return NextResponse.json({ error: "STUDIO_API_TOKEN が未設定です。" }, { status: 503, headers: cors });
  }
  if (!auth) {
    return NextResponse.json({ error: "認証に失敗しました。" }, { status: 401, headers: cors });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const amount = Math.round(Number(body.amountYen) || 0);
  const description =
    (typeof body.description === "string" && body.description.trim().slice(0, 250)) || "DigiRep 広告出稿費";
  const reference = typeof body.reference === "string" ? body.reference.slice(0, 200) : "";

  if (!Number.isFinite(amount) || amount < 50 || amount > 100_000_000) {
    return NextResponse.json({ error: "金額が不正です（50〜1億円）。" }, { status: 400, headers: cors });
  }

  const stripe = new Stripe(secret);
  try {
    const price = await stripe.prices.create({
      currency: "jpy",
      unit_amount: amount,
      product_data: { name: description },
    });
    const link = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: reference ? { reference } : {},
    });
    return NextResponse.json({ url: link.url, id: link.id }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "決済リンクの作成に失敗しました。" }, { status: 502, headers: cors });
  }
}
