import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: `${company.name}の特定商取引法に基づく表記。`,
};

const rows: { k: string; v: string }[] = [
  { k: "販売事業者", v: company.name },
  { k: "運営統括責任者", v: company.representative },
  { k: "所在地", v: company.address },
  { k: "電話番号", v: `${company.tel}（受付時間：平日10:00〜18:00）` },
  { k: "メールアドレス", v: company.email },
  { k: "販売価格", v: "各サービスページ・お見積り・申込フォームに表示する金額（すべて税別・別途消費税）。" },
  { k: "商品代金以外の必要料金", v: "動画・LP制作等の付帯メニューをご利用の場合は別途。振込手数料はお客様負担。" },
  { k: "お支払い方法", v: "銀行振込（請求書払い）。" },
  { k: "支払時期", v: "ご契約後に発行する請求書に記載の期日まで。" },
  { k: "サービス提供時期", v: "入稿・審査完了後、所定の配信開始日より提供します（媒体・プランにより異なります）。" },
  { k: "キャンセル・返品", v: "役務の性質上、受領確認後のキャンセル・返金は原則承っておりません。詳細は契約書・申込条件に従います。" },
];

export default function TokushohoPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-28 pb-24 sm:pt-32">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">特定商取引法に基づく表記</h1>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            <dl className="divide-y divide-border">
              {rows.map((r) => (
                <div key={r.k} className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                  <dt className="text-sm font-bold text-ink-soft">{r.k}</dt>
                  <dd className="text-[15px] leading-relaxed text-ink">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-6 rounded-xl bg-paper px-4 py-3 text-xs text-muted-foreground">
            ※ 本表記は雛形です。実際の受付時間・キャンセル規定・価格表示等を貴社の運用に合わせて確定し、公開前に専門家のご確認をおすすめします。
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
