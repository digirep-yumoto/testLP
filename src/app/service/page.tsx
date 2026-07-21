import type { Metadata } from "next";
import { ArrowRight, MonitorPlay, Clapperboard, Share2, Check } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "事業一覧｜サイネージ広告・コンテンツ制作・SNS運用",
  description:
    "DigiRep（デジレップ）の事業一覧。個室トイレ・コインランドリーのサイネージ広告事業、動画・LP・パンフレットのコンテンツ制作事業、Instagram・TikTok・XのSNS運用事業をワンストップで提供します。",
  alternates: { canonical: "/service" },
};

const services = [
  {
    icon: MonitorPlay,
    eyebrow: "Signage Advertising",
    title: "サイネージ広告事業",
    lead: "生活導線の“逃げ場のない場所”に出す、確実に見られるサイネージ広告メディア。",
    items: [
      { h: "個室トイレサイネージ", b: "飲食店の個室トイレに設置。1対1・音あり・視認率90%で、比較検討・デリケート商材を“濃く”届けます。" },
      { h: "コインランドリーサイネージ", b: "全国のコインランドリーに設置。視聴者の約67%が女性・30〜50代。待ち時間に高頻度で反復接触します。" },
    ],
    points: ["視認率90%・QRで効果を可視化", "単店・短期から、動画制作込みで開始可能", "全国ネットワークでエリア/全国を選んで配信"],
    ctaLabel: "媒体資料・料金を見る",
    ctaHref: "/#docs",
  },
  {
    icon: Clapperboard,
    eyebrow: "Content Production",
    title: "コンテンツ制作事業",
    lead: "「素材がない」を解決。広告効果を最大化するクリエイティブをワンストップで制作します。",
    items: [
      { h: "動画・CM制作", b: "サイネージ配信用のCM動画を制作。静止画スライドから、ナレーション・ロケ撮影を伴う本格制作まで対応。" },
      { h: "LP（ランディングページ）制作", b: "広告からの受け皿となる、成果につながるLPを設計・制作します。" },
      { h: "パンフレット制作", b: "営業・提案に使う紙・PDFの販促物を制作します。" },
    ],
    points: ["広告・配信と一貫した設計", "素材が無くても“伝わる”表現に", "業種・ターゲットに合わせて最適化"],
    ctaLabel: "制作について相談する",
    ctaHref: "/#request",
  },
  {
    icon: Share2,
    eyebrow: "SNS Management",
    title: "SNS運用事業",
    lead: "認知拡大からファン化・リード獲得まで。継続運用で“集客の資産”を育てます。",
    items: [
      { h: "Instagram 運用", b: "ビジュアル・リールで信頼とファンを構築。プロフィール設計から投稿まで。" },
      { h: "TikTok 運用", b: "ショート動画で新規リーチを最大化。実機映像を活かした拡散設計。" },
      { h: "X（旧Twitter）運用", b: "拡散性と即時性を活かし、BtoB・キャンペーン告知に。" },
    ],
    points: ["投稿制作・カレンダー設計を代行", "自動DM等で反応をリード化", "GA連携で流入・問い合わせを可視化"],
    ctaLabel: "SNS運用を相談する",
    ctaHref: "/#request",
  },
];

export default function ServicePage() {
  return (
    <>
      <Header />
      <main className="bg-paper">
        {/* ヒーロー */}
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Our Business
            </p>
            <h1 className="mt-3 text-[2rem] font-bold leading-[1.4] sm:text-4xl sm:leading-[1.3]">
              事業一覧
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.9] text-white/75">
              DigiRep（デジレップ）は、「確実に見られる広告メディア」を軸に、
              集客に必要な<strong className="text-white">「媒体・制作・運用」</strong>をワンストップで提供します。
            </p>
          </div>
        </section>

        {/* 事業カード */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-6">
            {services.map((s) => (
              <div key={s.title} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[1fr_1.3fr]">
                  <div>
                    <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
                      <s.icon className="size-6" />
                    </span>
                    <p className="mt-4 font-display text-xs font-bold tracking-[0.14em] text-brand uppercase">
                      {s.eyebrow}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-ink sm:text-2xl">{s.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.lead}</p>
                    <ul className="mt-5 space-y-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-2 text-sm text-ink-soft">
                          <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={s.ctaHref}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
                    >
                      {s.ctaLabel}
                      <ArrowRight className="size-4" />
                    </a>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-1">
                    {s.items.map((it) => (
                      <div key={it.h} className="rounded-2xl border border-border bg-paper p-5">
                        <h3 className="text-[15px] font-bold text-ink">{it.h}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{it.b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* まとめCTA */}
          <div className="mt-12 rounded-3xl border border-border bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-bold text-ink sm:text-2xl">まずは無料でご相談ください</h2>
            <p className="mt-2 text-sm text-ink-soft">
              「どの事業が自社に合うか分からない」段階でも大歓迎です。1営業日以内に担当よりご連絡します。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/#request" className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
                無料で相談する
                <ArrowRight className="size-4" />
              </a>
              <a href="/#docs" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand">
                媒体資料をダウンロード
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{company.name}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
