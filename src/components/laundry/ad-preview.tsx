"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { LaundryScene, type AdSample } from "./laundry-scene";
import { cn } from "@/lib/utils";

type Industry = {
  key: string;
  label: string;
  ad: AdSample;
  goal: string;
  plan: string;
  stores: number;
  unit: number; // 15秒の1店単価
  note: string;
};

// 想定視認者＝1店の月間来店 約1,124人 × 視認率55% ≒ 618人
const VIEW_PER_STORE = 618;

const industries: Industry[] = [
  { key: "fmcg", label: "日用品・食品メーカー", ad: { brand: "御社の新商品", headline: "ふんわり香る、毎日の洗濯に。", sub: "併設スーパーで本日発売", color: "#0a7fa0", accent: "#38bdf8", cta: "店頭でチェック" }, goal: "新商品の認知を、買い物に来ている人に。", plan: "全国一括パック", stores: 406, unit: 6300, note: "全国39都道府県で一斉に。併設の商業施設で、その日のうちに購買につながる導線。" },
  { key: "local", label: "地域の店舗・飲食・美容", ad: { brand: "駅前の○○サロン", headline: "初回カット 20%OFF", sub: "このQRを見せるだけ", color: "#d9488b", accent: "#f9a8d4", cta: "QRで予約" }, goal: "店舗の近くの人だけに、来店クーポンを。", plan: "スポットパック", stores: 10, unit: 8800, note: "店舗の商圏にあるコインランドリー10店に絞って配信。QRの読み取り数で反応が見えます。" },
  { key: "clinic", label: "クリニック・学習塾・習い事", ad: { brand: "○○キッズ英会話", headline: "無料体験、受付中。", sub: "3〜12歳・送迎あり", color: "#1d6fb8", accent: "#93c5fd", cta: "体験を予約" }, goal: "子育て世帯の多い商圏で、体験申込を。", plan: "スポットパック", stores: 15, unit: 8800, note: "布団・毛布洗いで来るファミリー層へ。月2〜3回の来店で、検討中の人に繰り返し届きます。" },
  { key: "home", label: "住宅・リフォーム・保険", ad: { brand: "○○ホーム", headline: "水まわりリフォーム、見積り無料。", sub: "ご相談は週末もOK", color: "#0f766e", accent: "#5eead4", cta: "資料請求" }, goal: "検討に時間がかかる商材を、繰り返しの接触で。", plan: "エリアパック", stores: 50, unit: 7600, note: "エリア内の全店に配信。同じ人に来店のたびに届くので、名前と電話番号が記憶に残ります。" },
  { key: "recruit", label: "求人・採用", ad: { brand: "○○介護サービス", headline: "週3日〜・時給1,300円〜", sub: "家の近くで、無理なく働く", color: "#b45309", accent: "#fcd34d", cta: "応募はQRから" }, goal: "働き手の多い30〜50代の主婦層に求人を。", plan: "エリアパック", stores: 30, unit: 7600, note: "介護・物流・小売・コールセンターの求人と相性のよい層。QRから応募ページへ直行。" },
  { key: "public", label: "行政・公共・地域イベント", ad: { brand: "○○市", headline: "11月は子育て応援月間", sub: "手当の申請はお早めに", color: "#4b5bd6", accent: "#a5b4fc", cta: "詳しくはQRで" }, goal: "生活導線で確実に見られる場所で、告知を。", plan: "エリアパック", stores: 24, unit: 7600, note: "市内の店舗だけに配信。音声つきなので、聞き流しでも伝わります。" },
];

function yen(n: number) { return "¥" + n.toLocaleString("ja-JP"); }
function monthly(ind: Industry) { return Math.ceil((ind.unit * ind.stores) / 10000) * 10000; }

export function AdPreview() {
  const [key, setKey] = useState(industries[0].key);
  const ind = industries.find((i) => i.key === key)!;
  const m = monthly(ind);
  const views = ind.stores * VIEW_PER_STORE;

  return (
    <section id="preview" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Your Ad, Here"
          title="御社の広告が、ここに流れます"
          lead="業種を選ぶと、店内モニターに流れるイメージと、おすすめのプラン・店舗数・月額の目安が切り替わります。"
        />

        {/* 業種タブ */}
        <div role="tablist" aria-label="業種を選ぶ" className="mt-10 flex flex-wrap justify-center gap-2">
          {industries.map((i) => (
            <button
              key={i.key}
              role="tab"
              aria-selected={i.key === key}
              onClick={() => setKey(i.key)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-200",
                i.key === key ? "border-brand bg-brand text-white shadow-md shadow-brand/20" : "border-border bg-white text-ink-soft hover:border-brand/40 hover:text-brand",
              )}
            >
              {i.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* イラスト */}
          <div className="relative overflow-hidden rounded-[1.6rem] border border-border bg-paper shadow-xl">
            <LaundryScene ad={ind.ad} className="block w-full" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink shadow">
              <Sparkles className="size-3.5 text-brand" />
              {ind.label} の配信イメージ
            </div>
          </div>

          {/* 右：プラン提案 */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
            <p className="text-xs font-bold tracking-wide text-brand">おすすめの組み方</p>
            <h3 className="mt-1 text-xl font-bold text-ink">{ind.goal}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{ind.note}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-paper p-3.5">
                <dt className="text-[11px] font-bold text-ink-soft">プラン</dt>
                <dd className="mt-0.5 font-bold text-ink">{ind.plan}</dd>
              </div>
              <div className="rounded-xl bg-paper p-3.5">
                <dt className="text-[11px] font-bold text-ink-soft">配信店舗数（例）</dt>
                <dd className="mt-0.5 font-bold text-ink">{ind.stores}店</dd>
              </div>
              <div className="rounded-xl bg-paper p-3.5">
                <dt className="text-[11px] font-bold text-ink-soft">月額の目安（15秒・税別）</dt>
                <dd className="mt-0.5 font-display text-xl font-extrabold text-ink">{yen(m)}</dd>
              </div>
              <div className="rounded-xl bg-paper p-3.5">
                <dt className="text-[11px] font-bold text-ink-soft">想定視認者数／月</dt>
                <dd className="mt-0.5 font-display text-xl font-extrabold text-ink">約{Math.round(views / 1000).toLocaleString()}千人</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a href={`/simulator?media=laundry&pkg=${ind.plan.startsWith("全国") ? "national" : ind.plan.startsWith("エリア") ? "area" : "spot"}&stores=${ind.stores}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
                この条件で詳しく試算
                <ArrowRight className="size-4" />
              </a>
              <a href="#request" className="inline-flex flex-1 items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand">
                相談する
              </a>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-soft">
              ※ 月額は1店舗単価×店舗数を万円単位に切り上げた目安。想定視認者数は1店あたり月間来店約1,124人×視認率55%で算出した推計値で、効果を保証するものではありません。広告の表示内容はイメージです。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
