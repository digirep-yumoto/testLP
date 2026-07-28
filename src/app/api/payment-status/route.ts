import { NextResponse } from "next/server";
import Stripe from "stripe";
import { authBlocked, bearerMatches, clientIp, rateLimited, recordAuthFailure } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cors: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

// トークン照合は定時間比較（api-guard）で行い、タイミング差から推測されないようにする
function authState(request: Request): boolean | null {
  const token = process.env.STUDIO_API_TOKEN;
  if (!token) return null;
  return bearerMatches(request, token);
}

/**
 * デジレップスタジオ専用：発行した決済リンク（payment link id）の入金状況を Stripe に問い合わせる。
 * DB を持たず Stripe を唯一の記録元とする。
 */
export async function POST(request: Request) {
  // レート制限＋認証失敗の連続遮断（決済系のため厳しめ）
  if (rateLimited("paystatus:" + clientIp(request), 20, 60_000)) {
    return NextResponse.json({ error: "リクエストが多すぎます。" }, { status: 429, headers: cors });
  }
  if (authBlocked(request, "paystatus")) {
    return NextResponse.json({ error: "認証の失敗が続いたため一時的に停止しました。" }, { status: 429, headers: cors });
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "決済機能は未設定です。" }, { status: 503, headers: cors });
  }
  const auth = authState(request);
  if (auth === null) return NextResponse.json({ error: "STUDIO_API_TOKEN が未設定です。" }, { status: 503, headers: cors });
  if (!auth) {
    recordAuthFailure(request, "paystatus");
    return NextResponse.json({ error: "認証に失敗しました。" }, { status: 401, headers: cors });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : "";
  if (!id.startsWith("plink_")) {
    return NextResponse.json({ error: "決済リンクIDが不正です。" }, { status: 400, headers: cors });
  }

  const stripe = new Stripe(secret);
  try {
    const sessions = await stripe.checkout.sessions.list({ payment_link: id, limit: 20 });
    const paidSession = sessions.data.find((s) => s.payment_status === "paid");
    return NextResponse.json(
      {
        paid: Boolean(paidSession),
        amount: paidSession?.amount_total ?? null,
        paidAt: paidSession ? paidSession.created * 1000 : null,
        email: paidSession?.customer_details?.email ?? null,
      },
      { headers: cors },
    );
  } catch {
    return NextResponse.json({ error: "入金状況の取得に失敗しました。" }, { status: 502, headers: cors });
  }
}
