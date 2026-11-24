import { ShoppingBasket, MapPin, Umbrella, Coins, CreditCard, Sofa, ShieldCheck, Briefcase, Building2 } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const cases = [
  { icon: ShoppingBasket, h: "日用品・食品・飲料メーカー", b: "家庭の買い物を担う層に、新商品の15秒CMを音声つきで。全国一斉でも、エリアを絞っても。隣接する商業施設での店頭購買につなげます。", plan: "全国一括／エリア" },
  { icon: MapPin, h: "地域の店舗・クリニック・学習塾", b: "店舗の近くのコインランドリーだけに絞って配信。精算機ヨコのチラシのQR（店頭QRセット）から、来店クーポンや予約ページへ。商圏内の同じ層に繰り返し届きます。", plan: "スポット（10店〜）" },
  { icon: Umbrella, h: "保険の見直し・相談窓口", b: "見直しは「いつかやろう」と先送りされがちです。来店のたびに目に入ることで、相談のきっかけをつくります。精算機ヨコのQRから、来店やオンライン相談の予約へ。", plan: "スポット（窓口の近くの10店〜）／エリア" },
  { icon: Coins, h: "ポイ活・家計アプリ・キャッシュレス決済", b: "買い物の前後に立ち寄る場所だから、「今日の買い物から使える」が伝わります。精算機ヨコのQRから、その場でダウンロード。店頭QRセットをつけると、店舗ごとの読み取り数でエリアの反応を確かめられます。", plan: "エリア（まず1エリアで確かめる）→ 全国一括" },
  { icon: CreditCard, h: "クレジットカード・証券（NISAなど）", b: "申込みがスマホで終わる商材を、洗濯の合間に。検討に時間がかかるので、繰り返し届くことが効きます。併設の商業施設で使えるカードは、とくに合う組み合わせです。", plan: "エリア／全国一括" },
  { icon: Sofa, h: "インテリア・家具・寝具・住宅リフォーム", b: "布団・毛布・カーテン・ラグなどの大物を洗う場所だから、寝具やインテリア、住まいの話題がなじみます。お店の商圏に絞って、フェアや来店クーポン、リフォーム相談会の告知を。", plan: "スポット／エリア" },
  { icon: Briefcase, h: "求人・採用（主婦層・地域の働き手）", b: "介護・物流・小売・コールセンターなど、働き手の多い30〜50代の主婦層に求人動画を。QRから応募ページへ。", plan: "エリア／スポット" },
  { icon: ShieldCheck, h: "行政・公共サービス・地域イベント", b: "同じ人が何度も立ち寄る場所だから、地域の告知や啓発にも。音声つきで聞き流しでも伝わります。", plan: "エリア" },
  { icon: Building2, h: "商業施設・テナント", b: "併設の商業施設のテナントや催事の告知を、買い物ついでの来店客へ。店頭サンプリング（置き型）と組み合わせられます。", plan: "スポット" },
];

export function UseCases() {
  return (
    <section id="usecases" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Use Cases"
          title="こんな商材・目的に向いています"
          lead="毎日の買い物に近い商材、家計やお金まわりの商材、検討に時間をかける商材。地域を絞りたい店舗から、全国の認知を取りたいメーカーまで。"
        />
        <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <div key={c.h} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><c.icon className="size-5" /></span>
              <h3 className="mt-4 text-base font-bold text-ink">{c.h}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{c.b}</p>
              <p className="mt-4 text-xs font-bold text-brand">おすすめ：{c.plan}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
