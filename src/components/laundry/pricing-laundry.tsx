import { ArrowRight, Calculator, Check, Info } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const plans = [
  {
    name: "スポットパック",
    badge: "お試し・商圏検証",
    p15: "8,800",
    p30: "13,200",
    who: "店舗を指定して配信（10店から）",
    example: "10店・15秒・1ヶ月 → 月90,000円（8,800円×10店＝88,000円 → 全店の合計を万円単位に切り上げて 90,000円）",
    highlight: false,
  },
  {
    name: "エリアパック",
    badge: "エリアでまとめて",
    p15: "7,600",
    p30: "11,300",
    who: "エリア内の全店をまとめて配信",
    example: "50店・15秒・1ヶ月 → 月380,000円",
    highlight: true,
  },
  {
    name: "全国一括パック",
    badge: "全国で一斉に",
    p15: "6,300",
    p30: "9,500",
    who: "全店（406店・2026年11月）を一括配信",
    example: "406店・15秒・1ヶ月 → 月2,560,000円",
    highlight: false,
  },
];

export function PricingLaundry() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="1店舗・月額の単価だけ。従量課金はありません"
          lead="料金は「1店舗あたりの月額 × 配信店舗数」。視聴数による追加請求はなく、2ヶ月・3ヶ月の継続で割引になります（税別）。"
        />
        <Reveal className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-3xl border p-6 transition-transform hover:-translate-y-1 sm:p-7 ${p.highlight ? "border-brand bg-brand/5 shadow-lg shadow-brand/10 ring-2 ring-brand/20" : "border-border bg-card shadow-sm"}`}>
              <span className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-black ${p.highlight ? "bg-sun text-ink" : "bg-ink text-white"}`}>{p.badge}</span>
              <h3 className="mt-2 text-lg font-bold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-ink-soft">{p.who}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-sm font-bold text-ink-soft">15秒</span>
                <span className="font-display text-4xl font-extrabold tracking-tight text-ink">¥{p.p15}</span>
                <span className="pb-1 text-xs text-ink-soft">/店・月</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">30秒 ¥{p.p30}／店・月</p>
              <p className="mt-4 rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft ring-1 ring-border">例：{p.example}</p>
              <a href="/simulator" className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${p.highlight ? "bg-brand text-white hover:bg-brand-dark" : "border border-border bg-white text-ink hover:border-brand hover:text-brand"}`}>
                このプランで試算する
                <ArrowRight className="size-4" />
              </a>
            </div>
          ))}
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <ul className="grid gap-2 rounded-2xl bg-paper p-6 text-sm text-ink-soft sm:grid-cols-2">
            {[
              "継続割引：2ヶ月 ▲5%／3ヶ月以上 ▲10%",
              "全店合計（割引前）は万円単位に切り上げ",
              "配信店舗数・配信回数が予定の90%未満の月は、掲載期間の延長などで補います",
              "オプション「店頭QRセット」（精算機ヨコのチラシ掲示）：1店あたり月3,000円・1店2社まで",
              "オプション「店頭サンプリング」（置き型）：1店あたり月5,000円〜＋配布物の実費",
              "付帯メニュー（LINE登録促進・X連携投稿・動画/LP制作）は任意",
            ].map((t) => (
              <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{t}</li>
            ))}
          </ul>
          <a href="/simulator" className="group flex items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white transition-colors hover:bg-brand-dark">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-sky-200"><Calculator className="size-4" />無料シミュレーター</p>
              <p className="mt-1 text-lg font-bold">店舗数と期間を入れるだけで、費用と想定視認者数がその場で出ます</p>
            </div>
            <ArrowRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ink-soft">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          配信店舗数は、お申込み時の店舗リストで確定します（料金は確定した店舗数で計算します）。想定視認者数は来店者数に基づく推計値で、効果を保証するものではありません。掲載基準により、たばこ・ギャンブル・消費者金融・アダルト／風俗・出会い系・宗教／政治・連鎖販売／情報商材・コインランドリーと競合する事業の広告は掲載できません。外見や体の悩みをあおる表現も使えません。
        </p>
      </div>
    </section>
  );
}
