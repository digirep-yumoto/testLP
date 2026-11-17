import { ArrowRight, Check, Info, MonitorPlay, QrCode, Smartphone } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

/**
 * 店頭QR（2026-11-17 追加）。
 * 標準＝おトク情報QR（精算機ヨコの常設QRスタンド→店舗別「おトク情報」ページ・追加料金なし）
 * オプション＝店頭QRセット（精算機ヨコに広告主だけの紙・1店あたり月3,000円 税別・1店2社まで）
 * 件数・効果は約束しない。スタンドは設置が済んだ店舗から順次。
 */
const steps = [
  { icon: MonitorPlay, n: "1", h: "モニターで知らせる", b: "店内の55インチモニターで、15秒・30秒の映像を音声つきで配信します。" },
  { icon: QrCode, n: "2", h: "精算機ヨコで読み取る", b: "お会計は、必ず精算機の前で。すぐヨコのQRを、スマホのカメラで読み取ります。" },
  { icon: Smartphone, n: "3", h: "スマホに届く", b: "クーポン・ご予約・お申込みのページへ。読み取りの数は、店舗ごとに月ごとにご報告します。" },
];

const standard = [
  "精算機ヨコに、常設のQRスタンドを1つ設置",
  "QRの先は、その店の「おトク情報」ページ",
  "広告主さまごとに1枠（画像・見出し・リンク先。クーポンも可）",
  "内容の入れ替えは月1回まで。表示数とタップ数をご報告",
];

const option = [
  "精算機ヨコに、御社だけの紙を設置",
  "A4の掲示1枚＋持ち帰り用の紙（1店あたり月100枚まで）",
  "御社専用のQRを発行。店舗ごとの読み取り数をご報告",
  "10店以上・2ヶ月以上から。お申込みは掲示開始月の前月10日まで",
];

export function StoreQr() {
  return (
    <section id="store-qr" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Store QR"
          title="モニターで知らせて、精算機ヨコのQRで受け取る"
          lead="映像で気づいてもらい、お会計のときにスマホで読み取ってもらう。コインランドリーへの来店を、御社への来店・お申込みにつなげます。"
        />

        <Reveal className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className={`grid size-10 place-items-center rounded-full text-base font-black ${i === 1 ? "bg-sun text-ink" : "bg-brand text-white"}`}>{s.n}</span>
                <s.icon className="size-6 text-brand" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{s.h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.b}</p>
              {i < 2 && <ArrowRight className="absolute -right-3.5 top-1/2 z-10 hidden size-6 -translate-y-1/2 rounded-full bg-paper p-1 text-sun md:block" aria-hidden />}
            </div>
          ))}
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-brand/30 bg-card p-6 shadow-sm sm:p-8">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-black text-brand-dark">標準｜全広告主さま</span>
            <h3 className="mt-3 text-2xl font-extrabold text-ink">おトク情報QR</h3>
            <p className="mt-2 flex items-end gap-2">
              <span className="font-display text-3xl font-extrabold tracking-tight text-brand">追加料金なし</span>
              <span className="pb-1 text-xs font-bold text-ink-soft">配信料に含みます</span>
            </p>
            <ul className="mt-5 grid gap-2.5 text-sm text-ink-soft">
              {standard.map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-sun bg-card p-6 shadow-lg shadow-sun/10 ring-2 ring-sun/20 sm:p-8">
            <span className="rounded-full bg-sun px-3 py-1 text-[11px] font-black text-ink">オプション｜1店2社まで・先着順</span>
            <h3 className="mt-3 text-2xl font-extrabold text-ink">店頭QRセット</h3>
            <p className="mt-2 flex items-end gap-2">
              <span className="font-display text-3xl font-extrabold tracking-tight text-ink">¥3,000</span>
              <span className="pb-1 text-xs font-bold text-ink-soft">/店・月（税別）</span>
            </p>
            <ul className="mt-5 grid gap-2.5 text-sm text-ink-soft">
              {option.map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-sun" />{t}</li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-paper px-3.5 py-2.5 text-xs font-bold text-ink-soft ring-1 ring-border">
              例：スポット10店・15秒・1ヶ月 → 配信料 90,000円 ＋ 店頭QRセット 30,000円 ＝ 120,000円
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-border">
            <span className="shrink-0 whitespace-nowrap font-display text-4xl font-extrabold tracking-tight text-brand">66<span className="text-xl">%</span></span>
            <p className="text-sm leading-relaxed text-ink-soft">ランドリーでほしい情報の第1位は「近くのお店のクーポン・セール」でした。</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-border">
            <span className="shrink-0 whitespace-nowrap font-display text-4xl font-extrabold tracking-tight text-brand"><span className="text-xl">約</span>6<span className="text-xl">割</span></span>
            <p className="text-sm leading-relaxed text-ink-soft">洗濯のあいだに店を離れる人の割合。全員が立ち寄るのが、精算機です。</p>
          </div>
        </div>

        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ink-soft">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <span>
            精算機ヨコのQRスタンドは、設置が済んだ店舗から順次ご利用いただけます。対象の店舗はお見積り時にご案内します。店頭QRセットの印刷物は広告主さまにご用意いただきます（当社で手配する場合は実費。デザイン制作は別途お見積り）。店頭QRセットは継続割引の対象外です。読み取りの件数や効果をお約束するものではありません。数値は当社のご利用者アンケート（2026年10〜11月・中間集計・n=93）より。
          </span>
        </p>
      </div>
    </section>
  );
}
