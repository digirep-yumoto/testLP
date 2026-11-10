import { Crown, Volume2, Repeat, BarChart3, Coins, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { BubbleField } from "./bubble-field";

const items = [
  { icon: Crown, no: "01", h: "国内最大級の統一配信網", b: "全国39都道府県・約400店のコインランドリーを、1つのメディアとして一括配信・一括レポート。個店がバラバラに運営する媒体とは違い、全国一斉もエリア指定も、ひとつの申込みで完結します。", foot: "※ 単一チェーンに統一設置された店内サイネージ網として（2026年11月・当社調べ）" },
  { icon: Volume2, no: "02", h: "55インチ・音声ありが標準", b: "小型の無音サイネージではなく、店内の壁面に55インチ。音声つきで流れるので、スマホを見ている人の耳にも届きます。", foot: "" },
  { icon: Repeat, no: "03", h: "同一属性に、繰り返し", b: "女性約7割・30〜50代中心という“ブレない層”に、月2〜3回の来店ごと・1回の利用で2回以上。認知が積み上がる媒体です。", foot: "" },
  { icon: BarChart3, no: "04", h: "配信は実測、効果は数字で", b: "配信店舗数・配信回数は配信ログで実測。来店者数は曜日・時間帯別に。QRの読み取り数も店舗別に追えます。推定値だけの屋外広告とは違います。", foot: "" },
  { icon: Coins, no: "05", h: "入口が低く、従量課金なし", b: "1店舗 月8,800円から、10店・1ヶ月で試せます。料金は1店単価×店舗数の固定制。視聴数で請求が増えることはありません。", foot: "" },
  { icon: ShieldCheck, no: "06", h: "“良い隣人”に囲まれる掲載環境", b: "女性・ファミリー層が接する空間のため、消費者金融・ギャンブル・出会い系・コンプレックス系は掲載しません。御社のブランドが安心して置ける環境です。", foot: "" },
];

export function Strengths() {
  return (
    <section id="strengths" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 60% at 100% 0%, rgba(10,127,160,0.5) 0%, transparent 55%), radial-gradient(40% 50% at 0% 100%, rgba(56,189,248,0.22) 0%, transparent 50%)" }} />
      <BubbleField variant="dark" count={5} rising={6} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-sky-300 uppercase">Why BlueSky LAUNDRY TV</p>
          <h2 className="text-balance text-[1.95rem] font-bold leading-[1.38] sm:text-[2.6rem] sm:leading-[1.25]">
            コインランドリー店内サイネージで、<br className="hidden sm:block" />選ばれる6つの理由
          </h2>
          <p className="mt-4 text-pretty text-base leading-[1.95] text-white/75 sm:text-lg">
            「確実に見られる場所」で、「ブレない層」に、「繰り返し」届く。それを全国規模で、数字つきで提供できる媒体は多くありません。
          </p>
        </div>
        <Reveal className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => (
            <div key={x.no} className="group relative rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-colors hover:bg-white/10">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-brand/30 text-sky-200"><x.icon className="size-5" /></span>
                <span className="font-display text-sm font-extrabold text-sky-300">{x.no}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{x.h}</h3>
              <p className="mt-2 text-sm leading-[1.9] text-white/75">{x.b}</p>
              {x.foot && <p className="mt-3 text-[11px] leading-relaxed text-white/45">{x.foot}</p>}
            </div>
          ))}
        </Reveal>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-sun/40 bg-white/5 px-6 py-5 sm:flex-row">
          <p className="flex items-center gap-2 text-sm font-bold text-white"><Sparkles className="size-4 text-sun" />掲載枠は店舗ごとに最大6社・先着順。希望エリア・店舗の空き状況をすぐにご案内します。</p>
          <a href="#request" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sun px-5 py-3 text-sm font-black text-ink transition-transform hover:-translate-y-0.5">枠の空きを相談する</a>
        </div>
      </div>
    </section>
  );
}
