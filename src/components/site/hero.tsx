import { ArrowRight, PlayCircle, Eye, Volume2, Repeat, Users, Check, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { MediaIcon } from "./icon";
import { Carousel } from "./carousel";
import { CountUp } from "./count-up";
import { PointerGlow } from "./pointer-glow";
import { heroStats, mediaList } from "@/lib/site-data";

function Chip({ icon, big, small }: { icon: ReactNode; big: string; small: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 shadow-lg">
      <span className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">{icon}</span>
      <span className="leading-tight">
        <span className="block font-display text-base font-extrabold text-ink">{big}</span>
        <span className="block text-[11px] text-ink-soft">{small}</span>
      </span>
    </span>
  );
}

export function Hero() {
  const chips = [
    <Chip key="0" icon={<Users className="size-4" />} big="約43万人/月" small="コインランドリー延べ利用者" />,
    <Chip key="1" icon={<Repeat className="size-4" />} big="女性 約7割" small="30〜50代中心・来店のたびに接触" />,
    <Chip key="2" icon={<Volume2 className="size-4" />} big="音声あり" small="55インチ・標準仕様" />,
    <Chip key="3" icon={<Eye className="size-4" />} big="2027年1月" small="配信開始・先行受付中" />,
  ];

  return (
    <section id="top" className="relative overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 85% 0%, rgba(4,120,189,0.34) 0%, transparent 60%), radial-gradient(50% 60% at 0% 100%, rgba(14,165,233,0.16) 0%, transparent 55%), linear-gradient(160deg, #0b1626 0%, #0f1e33 55%, #123257 100%)",
        }}
      />

      {/* ゆっくり漂うオーロラ状のグロー */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="dr-aurora absolute -right-24 -top-28 size-[38rem] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(4,120,189,0.5) 0%, transparent 65%)" }}
        />
        <div
          className="dr-aurora absolute -bottom-32 -left-24 size-[32rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.42) 0%, transparent 65%)", animationDelay: "-8s" }}
        />
      </div>

      {/* カーソル追従の光 */}
      <PointerGlow />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24 lg:pt-40">
        {/* 左：コピー */}
        <div>
          <p
            className="dr-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur"
            style={{ animationDelay: "0ms" }}
          >
            <ShieldCheck className="size-3.5 text-emerald-300" />
            ブルースカイランドリー全国約400店と提携・39都道府県
          </p>

          <h1
            className="dr-in mt-5 text-[2.15rem] font-black leading-[1.5] tracking-[0.02em] sm:text-[3rem] sm:leading-[1.45]"
            style={{ animationDelay: "90ms" }}
          >
            全国約400店の
            <br />
            コインランドリー店内TVで、
            <br />
            <span className="bg-gradient-to-r from-sky-300 to-brand bg-clip-text text-transparent">
              “確実に見られる”広告
            </span>
            を。
          </h1>

          <p
            className="dr-in mt-6 max-w-xl text-pretty text-base leading-[1.95] text-white/80 sm:text-lg"
            style={{ animationDelay: "170ms" }}
          >
            洗濯・乾燥の待ち時間に、55インチ・音声つきの動画広告を“同じ人に何度も”。
            <br className="hidden sm:block" />
            利用者の約7割が30〜50代の女性。1店舗 月8,800円から、エリアでも全国でも。飲食店の個室トイレ媒体もご用意しています。
          </p>

          <div
            className="dr-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "250ms" }}
          >
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/40 active:translate-y-0"
            >
              無料シミュレーション・お申込み
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              <PlayCircle className="size-5" />
              メディアを見る
            </a>
          </div>

          <p className="dr-in mt-4 text-sm text-white/65" style={{ animationDelay: "320ms" }}>
            ご相談・シミュレーションは無料。しつこい営業はいたしません。{" "}
            <a
              href="#request"
              className="font-bold text-sky-300 underline underline-offset-4 transition-colors hover:text-sky-200"
            >
              まずは相談する →
            </a>
          </p>

          {/* 安心の理由（信頼バッジ） */}
          <div
            className="dr-in mt-6 flex flex-wrap gap-2 text-xs font-medium text-white/85"
            style={{ animationDelay: "380ms" }}
          >
            {["10店・1ヶ月からOK", "動画がなくても始められる", "配信回数は実測レポート", "適格請求書対応"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
              >
                <Check className="size-3.5 shrink-0 text-sky-300" />
                {t}
              </span>
            ))}
          </div>

          <div
            className="dr-in mt-6 flex flex-wrap gap-2.5"
            style={{ animationDelay: "440ms" }}
          >
            {mediaList.map((m) => (
              <a
                key={m.key}
                href={`/media/${m.key}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                <MediaIcon kind={m.key} className="size-4" />
                {m.name}
                {m.badge && (
                  <span className="rounded bg-sky-400/90 px-1.5 py-0.5 text-[10px] font-bold text-ink">
                    {m.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* 右：大きな1枚スライドショー（サービス連動のコメント表示） */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="dr-float">
            <div className="relative overflow-hidden rounded-[1.4rem] border border-white/15 shadow-2xl">
              <Carousel
                images={[
                  "/images/laundry-media-new.webp",
                  "/images/laundry-front.webp",
                  "/images/laundry-media-new3.webp",
                  "/images/toilet-vanity.webp",
                ]}
                captions={[
                  "コインランドリーサイネージ｜55インチ・音声つきで待ち時間に届く",
                  "コインランドリーサイネージ｜商業施設併設・全国約400店",
                  "コインランドリーサイネージ｜同じ人に、来店のたびに",
                  "個室トイレサイネージ｜1対1で“濃く”届ける（設置店舗から順次）",
                ]}
                chips={chips}
                alt="DigiRep サイネージの設置イメージ"
                interval={3800}
                className="aspect-[4/3] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ヒーロー統計（UNVEIL風の指標） */}
      <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-20">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {heroStats.map((s) => (
            <div key={s.label} className="bg-ink/40 px-5 py-6 text-center backdrop-blur">
              <dt className="font-display text-4xl font-extrabold tracking-tight text-white">
                {/^\d+$/.test(s.value) ? <CountUp to={Number(s.value)} /> : s.value}
                {s.unit && <span className="ml-0.5 text-lg font-bold text-sky-300">{s.unit}</span>}
              </dt>
              <dd className="mt-1.5 text-sm font-bold text-white/90">{s.label}</dd>
              <dd className="text-xs text-white/55">{s.sub}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
