import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Stripe Webhook 受信エンドポイント（決済完了の通知を受け取る）。
 *
 * 必要な環境変数:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET … whsec_...（Stripe ダッシュボードの Webhook 設定で発行）
 *
 * Stripe 側のエンドポイントURL: https://<本番ドメイン>/api/stripe/webhook
 * 購読イベント例: checkout.session.completed
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe の環境変数が未設定です。" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secret);
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "署名検証に失敗しました。";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: 申込番号(client_reference_id)と決済結果を突合し、入金済みとして記録・通知する
      console.log("[stripe] 決済完了:", session.client_reference_id, session.amount_total);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
