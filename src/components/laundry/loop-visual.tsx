import { Volume2, Clapperboard, Repeat, FileVideo } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const loop = [
  { t: "自社コンテンツ", s: "30秒", d: "暮らしの豆知識・ハウツー（音声あり）", ad: false },
  { t: "企業広告", s: "15〜30秒", d: "スポンサー枠", ad: true },
  { t: "自社コンテンツ", s: "30秒", d: "健康・美容・季節情報", ad: false },
  { t: "企業広告", s: "15〜30秒", d: "スポンサー枠", ad: true },
  { t: "LINE登録誘導", s: "30秒", d: "会員特典・クーポン＋QR", ad: false },
  { t: "企業広告", s: "15〜30秒", d: "スポンサー枠", ad: true },
];

export function LoopVisual() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How It Plays"
          title="営業時間中、約4分のロールで繰り返し再生"
          lead="店内の55インチモニターで、情報コンテンツと広告を組み合わせた約4分のロールを営業時間中ずっと流します。「入れに来たとき」と「取りに来たとき」に、同じ広告が目に入ります。"
        />
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ロールのタイムライン */}
          <Reveal className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold text-ink">4分ロールの構成イメージ（例）</p>
            <ol className="mt-4 space-y-2">
              {loop.map((x, i) => (
                <li key={i} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${x.ad ? "border-brand/30 bg-brand/5" : "border-border bg-paper"}`}>
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-black ${x.ad ? "bg-brand text-white" : "bg-white text-ink-soft"}`}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink">{x.t}{x.ad && <span className="ml-2 rounded bg-sun px-1.5 py-0.5 text-[10px] font-black text-ink">御社の枠</span>}</p>
                    <p className="truncate text-xs text-ink-soft">{x.d}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-ink-soft">{x.s}</span>
                </li>
              ))}
              <li className="px-4 pt-1 text-xs font-bold text-brand">→ 以降くり返し（営業時間中ずっと）</li>
            </ol>
          </Reveal>

          {/* 仕様 */}
          <div className="grid gap-4">
            {[
              { icon: Volume2, h: "音声あり が標準", b: "視界と耳の両方に届くので、見過ごされにくい。音量は店舗ごとに調整し、時間帯でミュートもできます。" },
              { icon: Clapperboard, h: "15秒／30秒を選ぶだけ", b: "伝えたい情報量で尺を選択。30秒は15秒の1.5倍の料金です。" },
              { icon: Repeat, h: "1店あたり月 約7,650回の配信", b: "営業時間17時間・1時間15回・30日の代表値。配信店舗数と配信回数は配信ログで実測し、月次でレポートします。" },
              { icon: FileVideo, h: "動画がなくても始められる", b: "静止画＋音声（ナレーション）から制作できます。入稿はMP4・1920×1080、配信開始の7営業日前まで。" },
            ].map((x) => (
              <div key={x.h} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><x.icon className="size-5" /></span>
                <div>
                  <h3 className="text-base font-bold text-ink">{x.h}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{x.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
