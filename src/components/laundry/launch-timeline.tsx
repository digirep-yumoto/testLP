import { ArrowRight, Layers, Clapperboard, BarChart3 } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

/**
 * お申込みから配信までの流れ（id="flow"）。
 * 社内スケジュール（テスト配信・配信開始時期）は出さない。配信開始日はお申込み時にご案内する運用。
 */
const assurances = [
  { icon: Layers, h: "掲載枠は店舗ごとに最大6社", b: "同業種の広告主を同じ店舗に重ねません。希望エリア・店舗の空き状況はその場でご案内します（先着順）。" },
  { icon: Clapperboard, h: "動画がなくても始められる", b: "静止画と文字だけの15秒素材を当社で制作（有料・任意）。既存のCMやSNS動画の流用も可能です。" },
  { icon: BarChart3, h: "配信回数は実測で報告", b: "端末の配信ログに基づく店舗別の配信回数を毎月お渡し。配信回数が予定の90%を下回った場合は掲載期間の延長で補填します。" },
];
const steps = [
  { no: "01", h: "商材・目的を伺う", b: "何を、誰に届けたいか。オンライン20分でOK。" },
  { no: "02", h: "店舗・プラン・お見積り", b: "商圏に合わせた配信店舗と想定視認者数、費用をその場で。" },
  { no: "03", h: "申込書1枚で確定", b: "配信開始日は枠の空き状況と入稿スケジュールに合わせてご案内。" },
  { no: "04", h: "素材入稿・掲載審査", b: "MP4・1920×1080。配信開始の7営業日前までにご入稿ください。" },
  { no: "05", h: "配信スタート → 月次レポート", b: "営業時間中、4分ロールで反復再生。店舗別の配信回数を毎月報告。" },
];

export function LaunchTimeline() {
  return (
    <section id="flow" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 60% at 100% 0%, rgba(10,127,160,0.45) 0%, transparent 55%), radial-gradient(40% 50% at 0% 100%, rgba(14,165,233,0.2) 0%, transparent 50%)" }} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-sky-300 uppercase">How it works</p>
            <h2 className="mt-3 text-[1.8rem] font-bold leading-[1.4] sm:text-4xl sm:leading-[1.3]">ご相談から配信、<br />レポートまで伴走します。</h2>
            <p className="mt-4 text-[15px] leading-[1.9] text-white/75">はじめての動画広告でも大丈夫。店舗選び・素材づくり・効果の確認まで、担当者が一緒に進めます。</p>
            <ul className="mt-8 space-y-4">
              {assurances.map((a) => (
                <li key={a.h} className="relative flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sun/15 text-sun"><a.icon className="size-5" /></span>
                  <div>
                    <h3 className="text-base font-bold">{a.h}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{a.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">お申込みから配信までの流れ</h3>
            <Reveal className="mt-5 grid gap-3 sm:grid-cols-2">
              {steps.map((s, i) => (
                <div key={s.no} className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur ${i === steps.length - 1 ? "sm:col-span-2 border-sun/40 bg-white/10" : ""}`}>
                  <span className="font-display text-sm font-extrabold text-sky-300">STEP {s.no}</span>
                  <h4 className="mt-2 text-base font-bold">{s.h}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{s.b}</p>
                </div>
              ))}
            </Reveal>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#request" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sun px-6 py-3.5 text-[15px] font-black text-ink shadow-lg transition-transform hover:-translate-y-0.5">
                無料で相談する
                <ArrowRight className="size-5" />
              </a>
              <a href="/apply-form.html" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10">
                申込フォームで見積りを出す
              </a>
            </div>
            <p className="mt-3 text-xs text-white/55">※ 配信開始日は枠の空き状況と入稿スケジュールにより、お申込み時にご案内します。お申込み確定後のキャンセルはできません。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
