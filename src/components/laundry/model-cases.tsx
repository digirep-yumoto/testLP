import { ArrowRight, Umbrella, Coins, CreditCard, Sofa, Tv, QrCode, LineChart } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

/**
 * 業種別の活用イメージ（保険・ポイ活・クレジットカード／証券・インテリア）。
 * 掲載の実績ではなく「こう使える」という例。金額は pricing.ts の計算と同じ（15秒・税別・3ヶ月は継続割引10%）。
 *   スポット10店：8,800×10＝88,000→切り上げ90,000×3×0.9＝243,000／店頭QRセット 10×3,000×3＝90,000 → 計333,000
 *   スポット20店：176,000→180,000×3×0.9＝486,000／QR 180,000 → 計666,000
 *   エリア30店：228,000→230,000×3×0.9＝621,000／QR 270,000 → 計891,000
 *   エリア50店：380,000×3×0.9＝1,026,000／QR 450,000 → 計1,476,000
 */
const cases = [
  {
    icon: Umbrella,
    tag: "保険の見直し",
    who: "来店型の保険ショップ・保険代理店",
    aim: "窓口の近くの方に、相談の予約を入れてもらう",
    movie: "「保険の見直し、無料で相談。○○モール1階」",
    qr: "来店・オンライン相談の予約ページ",
    plan: "スポット10店・3ヶ月＋店頭QRセット",
    price: "333,000",
    sim: "/simulator?media=laundry&pkg=spot&stores=10&months=3&ind=insurance",
    check: "店舗ごとの読み取り数、予約の数",
  },
  {
    icon: Coins,
    tag: "ポイ活・家計アプリ",
    who: "ポイントアプリ・レシートアプリ・キャッシュレス決済",
    aim: "買い物の前後に、その場でダウンロードしてもらう",
    movie: "「レシートを撮るだけ、ポイントに。ダウンロード無料」",
    qr: "アプリのダウンロードページ",
    plan: "エリア50店・3ヶ月＋店頭QRセット",
    price: "1,476,000",
    sim: "/simulator?media=laundry&pkg=area&stores=50&months=3&ind=poikatsu",
    check: "読み取り数とダウンロードの数。数字が合えば全国へ",
  },
  {
    icon: CreditCard,
    tag: "クレジットカード・証券",
    who: "流通系のカード会社・ネット証券（NISA口座など）",
    aim: "スマホで終わる申込みを、洗濯の合間に進めてもらう",
    movie: "「いつもの買い物で、ポイント2倍。年会費無料」",
    qr: "入会・口座開設の申込みページ",
    plan: "エリア30店・3ヶ月＋店頭QRセット",
    price: "891,000",
    sim: "/simulator?media=laundry&pkg=area&stores=30&months=3&ind=card",
    check: "店舗ごとの読み取り数、申込みの数",
  },
  {
    icon: Sofa,
    tag: "インテリア・家具・寝具",
    who: "インテリアショップ・家具店・寝具店",
    aim: "布団やカーテンを洗いに来た方に、フェアへ来てもらう",
    movie: "「ふとん・カーテン、買い替えフェア。今週末まで」",
    qr: "来店クーポン・フェアのご案内",
    plan: "スポット20店・3ヶ月＋店頭QRセット",
    price: "666,000",
    sim: "/simulator?media=laundry&pkg=spot&stores=20&months=3&ind=interior",
    check: "クーポンの利用数、店舗ごとの読み取り数",
  },
];

export function ModelCases() {
  return (
    <section id="modelcases" className="border-b border-border bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Model Cases"
          title="業種別の活用イメージ"
          lead="家の買い物を決める人が、洗濯のたびに立ち寄る場所です。保険・ポイ活アプリ・クレジットカードや証券・インテリアを例に、流す内容と、QRの行き先、費用の目安をまとめました。"
        />
        <Reveal className="mt-12 grid gap-5 md:grid-cols-2">
          {cases.map((c) => (
            <article key={c.tag} className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><c.icon className="size-5" aria-hidden /></span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{c.tag}</h3>
                  <p className="text-xs text-ink-soft">{c.who}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold leading-relaxed text-ink">{c.aim}</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex gap-3">
                  <dt className="flex w-32 shrink-0 items-center gap-1.5 text-xs font-bold text-ink-soft"><Tv className="size-4 text-brand" aria-hidden />モニター（15秒）</dt>
                  <dd className="leading-relaxed text-ink">{c.movie}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="flex w-32 shrink-0 items-center gap-1.5 text-xs font-bold text-ink-soft"><QrCode className="size-4 text-brand" aria-hidden />QRの行き先</dt>
                  <dd className="leading-relaxed text-ink">{c.qr}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="flex w-32 shrink-0 items-center gap-1.5 text-xs font-bold text-ink-soft"><LineChart className="size-4 text-brand" aria-hidden />確かめる数字</dt>
                  <dd className="leading-relaxed text-ink">{c.check}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-1 flex-col justify-end">
                <div className="rounded-2xl bg-paper p-4">
                  <p className="text-xs font-bold text-ink-soft">{c.plan}</p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-ink">¥{c.price}<span className="ml-1.5 text-xs font-bold text-ink-soft">（3ヶ月の合計・税別）</span></p>
                </div>
                <a href={c.sim} className="mt-3 inline-flex cursor-pointer items-center gap-1.5 self-start text-sm font-bold text-brand transition-colors hover:text-brand-dark">
                  配信料をこの条件で試算する（店頭QRセットは別）
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </Reveal>
        <p className="mt-6 text-xs leading-relaxed text-ink-soft">
          ※ 活用の一例です。内容と店舗は、商材と地域に合わせてご提案します。金額は15秒の動画の場合で、3ヶ月の継続割引（10%）を適用しています。店頭QRセットは1店あたり月3,000円（10店から）で、割引の対象外です。実施できる店舗に限りがあり、対象の店舗はお見積りのときにご案内します。
          <br />
          ※ 保険・クレジットカード・証券などの広告は、法令や業界のルールで決められた表示（登録番号・手数料・リスクなど）を、広告の中に入れてください。使いみちを問わずお金を借りる商品（キャッシング・カードローンなど）のご案内や、「必ずもうかる」といった表現は掲載できません。
        </p>
      </div>
    </section>
  );
}
