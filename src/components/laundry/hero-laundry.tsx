import { ArrowRight, Calculator, Volume2, Users, MonitorPlay, Check, Crown } from "lucide-react";
import { PointerGlow } from "@/components/site/pointer-glow";
import { BubbleField } from "./bubble-field";

/**
 * トップページのヒーロー（コインランドリーサイネージ広告＝主力）。
 * 清潔・水・光：白〜淡い水色のグラデーション、漂う泡と立ちのぼる泡、店内モニター風の写真に光沢。
 * 数字は確定値（約400店／延べ約43万人／女性約7割）。
 */
export function HeroLaundry() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 100% 0%, rgba(10,127,160,0.16) 0%, transparent 60%), radial-gradient(45% 50% at 0% 100%, rgba(223,243,248,0.95) 0%, transparent 55%), radial-gradient(30% 30% at 50% 40%, rgba(245,158,11,0.06) 0%, transparent 60%), linear-gradient(180deg, #f4fbfd 0%, #ffffff 72%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="dr-aurora absolute -right-32 -top-40 size-[44rem] rounded-full opacity-50 blur-3xl" style={{ background: "radial-gradient(circle, rgba(10,127,160,0.22) 0%, transparent 65%)" }} />
        <div className="dr-aurora absolute -bottom-40 -left-24 size-[36rem] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 65%)", animationDelay: "-8s" }} />
      </div>
      <BubbleField count={6} rising={12} />
      <PointerGlow />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:pb-20 lg:pt-36">
        {/* 左：コピー */}
        <div>
          <p className="dr-in inline-flex flex-wrap items-center gap-2 rounded-full border border-brand/20 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-brand-dark shadow-sm backdrop-blur" style={{ animationDelay: "0ms" }}>
            <span className="rounded-full bg-sun px-2 py-0.5 text-[10px] font-black text-ink">先行受付中</span>
            BlueSky LAUNDRY TV ｜ コインランドリー店内サイネージ広告
          </p>

          <h1 className="dr-in mt-5 text-[2.1rem] font-black leading-[1.4] tracking-[0.01em] text-ink sm:text-[3rem] sm:leading-[1.35]" style={{ animationDelay: "90ms" }}>
            洗濯の待ち時間に、
            <br />
            音声つきで、
            <span className="bg-gradient-to-r from-brand via-sky-500 to-brand bg-clip-text text-transparent">同じ人へ何度も。</span>
          </h1>

          <p className="dr-in mt-6 max-w-xl text-pretty text-base leading-[1.95] text-ink-soft sm:text-lg" style={{ animationDelay: "170ms" }}>
            全国約400店のコインランドリー店内TVで流れる、55インチ・音声つきの動画広告。
            利用者の約7割が30〜50代の女性。スマホを見ながら待つ時間に、1店舗 月8,800円から届けられます。
          </p>

          <div className="dr-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "250ms" }}>
            <a
              href="/simulator"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl active:translate-y-0"
            >
              <Calculator className="size-5" />
              60秒で費用を試算する
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#request"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/30 bg-white px-6 py-4 text-base font-semibold text-brand-dark transition-colors hover:bg-brand/5"
            >
              先行申込・相談する
            </a>
          </div>

          <div className="dr-in mt-6 flex flex-wrap gap-2 text-xs font-medium text-ink" style={{ animationDelay: "330ms" }}>
            {["10店・1ヶ月からOK", "動画がなくても始められる", "配信回数は実測レポート", "適格請求書対応"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/90 px-3 py-1.5">
                <Check className="size-3.5 shrink-0 text-brand" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 右：店内モニターの画面として見せる */}
        <div className="relative mx-auto w-full max-w-xl pt-6 lg:max-w-none">
          <div className="dr-float relative">
            <div className="dr-sheen relative overflow-hidden rounded-[1.6rem] border-[6px] border-ink bg-ink shadow-2xl shadow-brand/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/laundry-media-new.webp" alt="コインランドリー店内の55インチモニターで広告が流れているイメージ" width={1368} height={768} className="aspect-[16/10] w-full object-cover" loading="eager" fetchPriority="high" />
              {/* 画面下部のラベルと進行バー */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-3 pt-10">
                <div className="flex items-center justify-between gap-3 text-[11px] font-bold text-white/90">
                  <span className="inline-flex items-center gap-1.5"><MonitorPlay className="size-3.5" />55インチ ｜ 15秒・30秒 ｜ 音声あり</span>
                  <span className="rounded bg-sun px-1.5 py-0.5 text-[10px] font-black text-ink">御社の枠</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/25"><div className="h-full w-2/3 rounded-full bg-sun" /></div>
              </div>
            </div>
            <div className="mx-auto mt-[-2px] h-5 w-24 rounded-b-xl bg-ink/90" aria-hidden />
          </div>

          {/* 浮かぶ数字カード（ガラス調） */}
          <div className="dr-pulse-soft absolute -left-3 top-2 hidden rounded-2xl border border-white/70 bg-white/85 px-4 py-3 backdrop-blur sm:block">
            <p className="flex items-center gap-2 text-[11px] font-bold text-ink-soft"><Users className="size-3.5 text-brand" />月間延べ利用者</p>
            <p className="font-display text-2xl font-extrabold text-ink">約43万人</p>
          </div>
          <div className="dr-pulse-soft absolute -right-3 bottom-10 hidden rounded-2xl border border-white/70 bg-white/85 px-4 py-3 backdrop-blur sm:block" style={{ animationDelay: "-2s" }}>
            <p className="flex items-center gap-2 text-[11px] font-bold text-ink-soft"><Volume2 className="size-3.5 text-brand" />女性 約7割・30〜50代</p>
            <p className="font-display text-2xl font-extrabold text-ink">来店のたびに接触</p>
          </div>
          <div className="absolute -top-2 right-6 hidden items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-white shadow-md sm:inline-flex">
            <Crown className="size-3.5 text-sun" />
            国内最大級の統一配信網・約400店
          </div>
        </div>
      </div>
    </section>
  );
}
