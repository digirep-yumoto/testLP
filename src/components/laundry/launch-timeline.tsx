import { ArrowRight, CalendarClock } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const phases = [
  { when: "2026年10〜12月", h: "利用者アンケート（全店）", b: "年代・来店頻度・待ち時間の過ごし方・関心のある情報を実数で収集。媒体資料に反映します。", now: true },
  { when: "2027年1〜2月", h: "テスト配信", b: "実際の広告主さまで配信し、配信ログと来店データでレポート。先行申込の方からご案内します。", now: false },
  { when: "2027年2月〜", h: "本格配信スタート", b: "全国約400店で通常配信。枠は先着順です。", now: false },
];
const steps = [
  { no: "01", h: "商材・目的を伺う", b: "何を、誰に届けたいか。オンライン20分。" },
  { no: "02", h: "店舗・プラン・お見積り", b: "商圏に合わせた配信店舗と想定視認者数、費用をその場で。" },
  { no: "03", h: "先行申込・枠の仮押さえ", b: "申込書1枚。配信開始日は協議のうえ確定。" },
  { no: "04", h: "素材入稿 → 配信 → レポート", b: "動画がなくても制作対応。配信後は月次で実績をお渡し。" },
];

export function LaunchTimeline() {
  return (
    <section id="flow" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 60% at 100% 0%, rgba(10,127,160,0.45) 0%, transparent 55%), radial-gradient(40% 50% at 0% 100%, rgba(14,165,233,0.2) 0%, transparent 50%)" }} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-sky-300 uppercase">Launch Schedule</p>
            <h2 className="mt-3 text-[1.8rem] font-bold leading-[1.4] sm:text-4xl sm:leading-[1.3]">2027年1月、配信開始。<br />いまは先行受付の期間です。</h2>
            <p className="mt-4 text-[15px] leading-[1.9] text-white/75">配信枠は店舗ごとに限りがあります。先行でお申込みいただいた広告主さまから、テスト配信とエリアの枠をご案内します。</p>
            <ol className="mt-8 space-y-4">
              {phases.map((p) => (
                <li key={p.h} className={`relative rounded-2xl border p-5 ${p.now ? "border-sun/60 bg-white/10" : "border-white/10 bg-white/5"}`}>
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-200">
                    <CalendarClock className="size-3.5" />{p.when}
                    {p.now && <span className="rounded bg-sun px-1.5 py-0.5 text-[10px] font-black text-ink">いまここ</span>}
                  </div>
                  <h3 className="mt-1.5 text-base font-bold">{p.h}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{p.b}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-bold">お申込みまでの流れ</h3>
            <Reveal className="mt-5 grid gap-3 sm:grid-cols-2">
              {steps.map((s) => (
                <div key={s.no} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <span className="font-display text-sm font-extrabold text-sky-300">STEP {s.no}</span>
                  <h4 className="mt-2 text-base font-bold">{s.h}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{s.b}</p>
                </div>
              ))}
            </Reveal>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#request" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sun px-6 py-3.5 text-[15px] font-black text-ink shadow-lg transition-transform hover:-translate-y-0.5">
                先行申込・相談する
                <ArrowRight className="size-5" />
              </a>
              <a href="/apply-form.html" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10">
                申込フォームで見積りを出す
              </a>
            </div>
            <p className="mt-3 text-xs text-white/55">※ 2027年1月までのお申込みは先行申込として承り、配信開始日は協議のうえ確定します。お申込み確定後のキャンセルはできません。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
