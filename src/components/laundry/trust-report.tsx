import { BarChart3, ShieldCheck, FileCheck, Handshake } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const items = [
  { icon: BarChart3, h: "配信は実測でレポート", b: "配信店舗数・配信回数は配信ログの実測値。来店者数は曜日別・時間帯別にお渡しします。視聴者数は来店者数に基づく推計として区別して示します。" },
  { icon: ShieldCheck, h: "足りなければ、延長などで補います", b: "配信店舗数・配信回数が予定の90%を下回った月は、掲載期間の延長などで補います（天災・停電などの不可抗力による場合を除きます）。契約書に定めています。" },
  { icon: FileCheck, h: "掲載基準で、媒体の環境を守る", b: "女性・ファミリー層が接する空間のため、たばこ・ギャンブル・消費者金融・アダルト／風俗・出会い系などの広告は掲載しません。外見や体の悩みをあおる表現も使えません。だから御社の広告が“良い隣人”に囲まれます。" },
  { icon: Handshake, h: "運営会社と提携して運営", b: "店舗網の運営会社と提携し、当社が媒体運営・配信・レポートを一元管理。広告の販売は当社と提携代理店が行います。" },
];

export function TrustReport() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Measurement & Trust"
              title="「見られたはず」で終わらせない"
              lead="配信の実測と来店データで、届いた量を確かめられます。数字は、実測と推計を分けてお渡しします。"
            />
            <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-ink text-left text-white">
                  <tr><th className="px-4 py-3 font-bold">レポート項目</th><th className="px-4 py-3 font-bold">粒度</th><th className="px-4 py-3 font-bold">種別</th></tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  <tr><td className="px-4 py-3 font-medium text-ink">配信店舗数・配信回数</td><td className="px-4 py-3 text-ink-soft">月・店舗別</td><td className="px-4 py-3"><span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand-dark">実測</span></td></tr>
                  <tr><td className="px-4 py-3 font-medium text-ink">来店者数（曜日・時間帯）</td><td className="px-4 py-3 text-ink-soft">月・店舗別</td><td className="px-4 py-3"><span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand-dark">運営会社データ</span></td></tr>
                  <tr><td className="px-4 py-3 font-medium text-ink">想定視認者数（延べ）</td><td className="px-4 py-3 text-ink-soft">月</td><td className="px-4 py-3"><span className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-ink-soft">推計（来店×55%）</span></td></tr>
                  <tr><td className="px-4 py-3 font-medium text-ink">店頭QRセット（精算機ヨコのチラシ）のQR読み取り数</td><td className="px-4 py-3 text-ink-soft">月・店舗別</td><td className="px-4 py-3"><span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand-dark">実測</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <Reveal className="grid gap-4 sm:grid-cols-2">
            {items.map((x) => (
              <div key={x.h} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><x.icon className="size-5" /></span>
                <h3 className="mt-4 text-base font-bold text-ink">{x.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{x.b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
