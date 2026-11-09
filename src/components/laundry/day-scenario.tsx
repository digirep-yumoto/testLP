import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { BubbleField } from "./bubble-field";

/**
 * 利用者の“ある日”を追うストーリー（イラスト＋時刻）。広告主に「どの瞬間に、どう届くか」を想像してもらう。
 */
const beats = [
  { time: "10:05", title: "来店・洗濯物を投入", body: "毛布と1週間分の洗濯物。洗濯機を回して、ベンチに座る。壁の55インチから御社の広告（1回目）。", icon: "basket" },
  { time: "10:12", title: "待ち時間", body: "スマホを見ながら、4分ロールが2周。音声があるので、画面を見ていなくても耳に入る。", icon: "wait" },
  { time: "10:40", title: "併設スーパーへ", body: "乾燥の間に買い物。さっき見た新商品が棚にある。手に取る。", icon: "shop" },
  { time: "11:05", title: "乾燥完了・引き取り", body: "取り出して畳む5分。御社の広告（2回目以降）。QRを読み取って、クーポンを保存。", icon: "qr" },
  { time: "翌週", title: "また来店", body: "月2〜3回の来店で、同じ広告に繰り返し出会う。名前を覚えている。", icon: "repeat" },
];

function BeatIcon({ k }: { k: string }) {
  const common = "size-7 text-brand";
  switch (k) {
    case "basket":
      return (<svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M4 10h16l-1.5 9h-13z" /><path d="M8 10l3-6M16 10l-3-6" /></svg>);
    case "wait":
      return (<svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
    case "shop":
      return (<svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M3 9l1-4h16l1 4" /><path d="M4 9v11h16V9" /><path d="M9 20v-6h6v6" /></svg>);
    case "qr":
      return (<svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h3v3M20 14v6h-6" /></svg>);
    default:
      return (<svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M4 12a8 8 0 0 1 14-5" /><path d="M18 3v4h-4" /><path d="M20 12a8 8 0 0 1-14 5" /><path d="M6 21v-4h4" /></svg>);
  }
}

export function DayScenario() {
  return (
    <section className="relative overflow-hidden bg-sky-soft/50 py-20 sm:py-28">
      <BubbleField count={6} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="A Day With Your Ad"
          title="利用者の“ある日”。御社の広告は、こう届きます"
          lead="30〜50代の主婦層が中心。毛布や大物を洗いに、月2〜3回。1回の利用で「入れるとき」と「取り出すとき」の2回以上、画面の前に立ちます。"
        />
        <Reveal className="mt-14">
          <ol className="relative grid gap-4 md:grid-cols-5">
            <div aria-hidden className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-brand/10 via-brand/50 to-brand/10 md:block" />
            {beats.map((b, i) => (
              <li key={b.time} className="relative rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-brand/10"><BeatIcon k={b.icon} /></span>
                  <span className="font-display text-sm font-extrabold text-brand">{b.time}</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-ink">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{b.body}</p>
                {(i === 0 || i === 3) && <span className="mt-3 inline-block rounded bg-sun px-2 py-0.5 text-[10px] font-black text-ink">広告に接触</span>}
              </li>
            ))}
          </ol>
        </Reveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          ※ 利用の流れは一例です。来店頻度・性別年代は運営会社の店舗データ、接触回数は利用の流れからの想定です。
        </p>
      </div>
    </section>
  );
}
