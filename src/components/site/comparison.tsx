import { ArrowRight, Check, Minus } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

/**
 * 向いている使い方・向いていない使い方（広告主向けご提案 v11 の10ページと同じ内容）。
 * 他の媒体を下げる比較表はやめ、自分の媒体の合う・合わないを先に伝える。
 */
const fit = [
  { h: "商圏を絞った、来店・予約・応募", b: "地域の店舗・飲食店・美容室・クリニック・学習塾。お店の近くの店舗だけに配信できます。" },
  { h: "家の買い物を決める人に届けたい商品", b: "食品・日用品、スーパー・ドラッグストアのクーポン。アンケートでは6割超が、家の買い物を「ほぼすべて自分で」決めています。" },
  { h: "繰り返しの接触が効く、検討型の商材", b: "住宅・リフォーム・保険・車・電気やガスの見直し。利用者の半数以上が、週1回以上来店します。" },
  { h: "主婦層・パート層に向けた求人", b: "アンケートでは約4割がパート・アルバイト。家の近くで働きたい層に届きます。" },
];

const notFit = [
  { h: "10代・20代だけに届けたい商材", b: "利用者の中心は30〜50代です。" },
  { h: "翌日すぐに、大量の反応がほしい施策", b: "来店のたびに少しずつ届く媒体です。1ヶ月単位で見てください。" },
  { h: "クリック数だけで成果を測りたい施策", b: "画面は押せません。反応は、店頭QRセットの読み取り数や、クーポンの利用数、来店時のお声で確かめます。" },
  { h: "掲載基準に合わない業種", b: "たばこ・ギャンブル・消費者金融などは掲載できません。" },
];

export function Comparison() {
  return (
    <section id="fit" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Good Fit / Not a Fit"
          title="向いている使い方と、向いていない使い方"
          lead="広告枠の販売を始めたばかりの媒体です。合わない使い方も、先にお伝えします。"
        />

        <Reveal className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-brand/30 bg-brand/[0.04] p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-brand-dark">向いている</h3>
            <ul className="mt-5 grid gap-5">
              {fit.map((x) => (
                <li key={x.h} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white"><Check className="size-4" aria-hidden /></span>
                  <div>
                    <p className="font-bold text-ink">{x.h}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{x.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-ink">向いていない</h3>
            <ul className="mt-5 grid gap-5">
              {notFit.map((x) => (
                <li key={x.h} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-paper text-ink-soft ring-1 ring-border"><Minus className="size-4" aria-hidden /></span>
                  <div>
                    <p className="font-bold text-ink">{x.h}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{x.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-sun bg-sun/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-black text-ink">迷ったら、まず10店・1ヶ月で試す。</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">店舗ごとの配信回数と読み取り数を見て、続けるか・広げるかを決められます。店頭QRセットつきで 120,000円（税別）。</p>
          </div>
          <a href="/simulator" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            費用を試算する
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          ※ 数値は当社の利用者アンケート（2026年10〜11月・中間集計・n=93）より。読み取りの件数や効果をお約束するものではありません。
        </p>
      </div>
    </section>
  );
}
