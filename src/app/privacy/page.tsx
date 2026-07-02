import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${company.name}のプライバシーポリシー（個人情報の取扱いについて）。`,
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-28 pb-24 sm:pt-32">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">プライバシーポリシー</h1>
          <p className="mt-3 text-sm text-ink-soft">
            {company.name}（以下「当社」）は、個人情報の重要性を認識し、以下の方針に基づき適切に取り扱います。
          </p>

          <div className="mt-10 space-y-8 text-[15px] leading-[1.9] text-ink-soft">
            <section>
              <h2 className="text-lg font-bold text-ink">1. 取得する情報</h2>
              <p className="mt-2">
                お問い合わせ・お申込み・資料請求の際に、会社名・氏名・電話番号・メールアドレス・住所等をお預かりします。あわせて、サイト利用状況（Cookie・アクセスログ等）を取得する場合があります。
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-ink">2. 利用目的</h2>
              <p className="mt-2">
                お問い合わせ・お申込みへの対応、サービス・広告配信の提供と運用、ご請求・お支払い手続き、各種ご連絡、サービス改善・統計分析のために利用します。
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-ink">3. 第三者提供</h2>
              <p className="mt-2">
                法令に基づく場合等を除き、ご本人の同意なく第三者に個人情報を提供しません。広告配信・決済等の業務委託先に対しては、必要な範囲で適切に管理のうえ提供する場合があります。
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-ink">4. お支払いについて</h2>
              <p className="mt-2">
                お支払いは原則として、ご契約後の請求書によるお振込みです。将来クレジットカード等の電子決済を導入する場合、カード番号等の決済情報は決済代行事業者が安全に処理し、当社がカード情報を保持することはありません。
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-ink">5. 安全管理</h2>
              <p className="mt-2">
                個人情報の漏えい・滅失・毀損の防止のため、必要かつ適切な安全管理措置を講じます。
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-ink">6. 開示・訂正・削除</h2>
              <p className="mt-2">
                ご本人からの保有個人データの開示・訂正・利用停止・削除のご請求には、法令に基づき適切に対応します。
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-ink">7. アクセス解析ツールについて</h2>
              <p className="mt-2">
                当社サイトでは、サービス改善のためにGoogle社のアクセス解析ツール「Googleアナリティクス（GA4）」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用します。これらのデータは匿名で収集され、個人を特定するものではありません。Cookieの利用を望まない場合は、ブラウザの設定で無効化できます。データの取扱いについては、Googleの
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">プライバシーポリシー</a>
                をご確認ください。
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-ink">8. お問い合わせ窓口</h2>
              <p className="mt-2">
                {company.name}
                <br />
                所在地：{company.address}
                <br />
                メール：{company.email}
                <br />
                電話：{company.tel}
              </p>
            </section>
            <p className="rounded-xl bg-paper px-4 py-3 text-xs text-muted-foreground">
              ※ 本ポリシーは雛形です。公開前に内容を貴社の実運用に合わせ、必要に応じて専門家（弁護士等）のご確認をおすすめします。制定日・改定日を明記してください。
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
