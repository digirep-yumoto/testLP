import { NextResponse } from "next/server";
import Stripe from "stripe";
import { computePrice } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- 簡易レート制限（IPごと・固定ウィンドウ） -------------------------
// ※ 本番でスケールする場合は Upstash 等の分散ストアへ置き換えること。
const WINDOW_MS = 60_000;
const MAX_REQ = 10;
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

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
}

function allowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // 同一オリジンの一部ブラウザは origin を送らない
  const allow = new Set<string>([
    process.env.NEXT_PUBLIC_SITE_URL ?? "",
    "http://localhost:3000",
    "https://localhost:3000",
  ]);
  try {
    return [...allow].some((a) => a && new URL(a).origin === new URL(origin).origin);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // 1) Origin 検証（CSRF/不正呼び出し対策）
  if (!allowedOrigin(request)) {
    return NextResponse.json({ error: "不正なリクエスト元です。" }, { status: 403 });
  }

  // 2) レート制限
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。しばらくしてから再度お試しください。" },
      { status: 429 },
    );
  }

  // 3) Content-Type 検証
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type が不正です。" }, { status: 415 });
  }

  // 4) Stripe 設定確認
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "決済機能は現在準備中です（STRIPE_SECRET_KEY 未設定）。" },
      { status: 503 },
    );
  }

  // 5) 本文の取得と上限チェック
  const raw = await request.text();
  if (raw.length > 10_000) {
    return NextResponse.json({ error: "リクエストが大きすぎます。" }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON の解析に失敗しました。" }, { status: 400 });
  }

  // 6) 金額はサーバーで再計算（クライアント送信額は信用しない）
  const outcome = computePrice(body.order);
  if (!outcome.ok) {
    return NextResponse.json({ error: outcome.error }, { status: 400 });
  }
  const { totalInclTax, subtotalExclTax, tax, description } = outcome.price;

  const email = typeof body.email === "string" ? body.email.slice(0, 200) : undefined;
  const reference =
    typeof body.reference === "string" ? body.reference.slice(0, 200) : undefined;
  const idempotencyKey =
    typeof body.idempotencyKey === "string"
      ? body.idempotencyKey.slice(0, 255)
      : crypto.randomUUID();

  const stripe = new Stripe(secret);
  const origin =
    request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        locale: "ja",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "jpy",
              unit_amount: totalInclTax, // 税込で請求（JPYはゼロ十進）
              product_data: {
                name: description,
                description: `小計(税別) ¥${subtotalExclTax.toLocaleString()} ＋ 消費税 ¥${tax.toLocaleString()}`,
              },
            },
          },
        ],
        customer_email: email,
        client_reference_id: reference,
        metadata: {
          subtotalExclTax: String(subtotalExclTax),
          tax: String(tax),
          description,
        },
        success_url: `${origin}/apply-form.html?paid=1`,
        cancel_url: `${origin}/apply-form.html?canceled=1`,
      },
      { idempotencyKey },
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // 内部エラーの詳細はクライアントへ返さない
    console.error("[checkout] Stripe error");
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました。時間をおいて再度お試しください。" },
      { status: 502 },
    );
  }
}
