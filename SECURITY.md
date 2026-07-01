# セキュリティ対策（DigiRep サイト）

本サイトおよび Stripe 決済連携に施しているセキュリティ対策の一覧です。

## 決済（最重要）

- **サーバー権威の金額計算**：決済額はクライアントから送られた金額を一切信用せず、`src/lib/pricing.ts` がサーバー側で再計算する。フロントは「媒体・プラン・尺・店舗数・期間」などの構造化された注文のみを送信し、合計金額は送らない。→ **価格改ざん（¥1 で出稿等）を防止**。
- **冪等キー（Idempotency Key）**：Checkout セッション作成に idempotencyKey を付与し、二重決済を防止。
- **税込請求**：表示は税別、決済は税込（×1.1）で算出。内訳を Stripe メタデータに保存。
- **Webhook 署名検証**：`/api/stripe/webhook` は `STRIPE_WEBHOOK_SECRET` で署名を検証し、改ざん／なりすまし通知を拒否。
- **シークレットキー秘匿**：`STRIPE_SECRET_KEY` はサーバー専用。クライアントには公開可能キー（`pk_…`）のみ。

## API（`/api/checkout`）の堅牢化

- **Origin 検証**：許可オリジン以外からのリクエストを 403 で拒否（CSRF/不正呼び出し対策）。
- **レート制限**：IP あたり 60 秒 10 回まで（超過は 429）。※スケール時は分散ストア（Upstash 等）へ。
- **入力検証**：Content-Type / 本文サイズ（10KB 上限）/ 値域（店舗数・来客数・期間）を厳格に検証。
- **エラー秘匿**：内部エラーの詳細はクライアントへ返さない（情報漏えい防止）。

## HTTP セキュリティヘッダ（`next.config.ts`）

- **Content-Security-Policy**：自己ホスト＋ Stripe のみ許可。`frame-ancestors 'none'`、`object-src 'none'`、`upgrade-insecure-requests`。
- **Strict-Transport-Security (HSTS)**：`max-age=2y; includeSubDomains; preload`。
- **X-Content-Type-Options: nosniff** / **X-Frame-Options: DENY**（クリックジャッキング防止）。
- **Referrer-Policy: strict-origin-when-cross-origin** / **Permissions-Policy**（カメラ・マイク・位置情報を無効）。
- **Cross-Origin-Opener-Policy: same-origin** / `X-Powered-By` 非表示。

## シークレット管理

- `.env.local`（実値・**Git 管理外**）と `.env.example`（テンプレートのみコミット）を分離。
- `.gitignore` で `.env*` を除外、`!.env.example` のみ例外。
- 公開可能キー（`pk_…`）はフロント露出前提のため安全。シークレットキー（`sk_…`）・`whsec_…` は**絶対にコミット／共有しない**。

## 運用上の推奨（次のステップ）

1. **テスト環境で先に検証** → `STRIPE_SECRET_KEY` に `sk_test_…` を設定し、決済フローを E2E 確認。問題なければ `sk_live_…` へ。
2. **本番ドメイン確定後**：Stripe で Webhook（`https://<ドメイン>/api/stripe/webhook`）を登録し `whsec_…` を `.env.local` に設定。
3. **依存パッケージの定期更新**：`npm audit` を CI に組み込み、既知脆弱性を継続監視。
4. （任意・さらに強化）CSP を nonce 方式に、レート制限を分散ストアに、WAF / Cloudflare 等のエッジ防御を併用。
