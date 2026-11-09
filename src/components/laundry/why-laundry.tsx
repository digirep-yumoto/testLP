import { Clock, Repeat, Store } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const reasons = [
  {
    icon: Clock,
    img: "/images/laundry-inuse.jpg",
    title: "“見るしかない時間”に流れる",
    body: "洗濯・乾燥の待ち時間、利用者は店内にとどまり、スマホと店内のモニター以外に目をやる先がありません。55インチ・音声つきなので、視界にも耳にも届きます。",
    tag: "待ち時間",
  },
  {
    icon: Repeat,
    img: "/images/laundry-media-new3.jpg",
    title: "同じ人に、来店のたびに",
    body: "利用者は月2〜3回来店し、1回の利用で洗濯物を入れるとき・取り出すときの2回以上、画面の前に立ちます。固定客が多く、同じ広告が繰り返し届くので記憶に残ります。",
    tag: "反復接触",
  },
  {
    icon: Store,
    img: "/images/laundry-storefront.jpg",
    title: "商業施設併設・全国統一の配信網",
    body: "カインズ・イオンタウン・マックスバリュ等に併設する全国約400店を、1つのメディアとして一括配信・一括レポート。商圏を絞っても、全国一斉でも配信できます。",
    tag: "全国約400店",
  },
];

export function WhyLaundry() {
  return (
    <section id="why" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Laundry"
          title="なぜ、コインランドリーの店内TVなのか"
          lead="数で勝負する媒体ではありません。「どの層に、何度、しっかり見られるか」で選ばれる媒体です。"
        />
        <Reveal className="mt-14 grid gap-6 md:grid-cols-3">
          {reasons.map((r) => (
            <article key={r.title} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow">{r.tag}</span>
              </div>
              <div className="p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand">
                  <r.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{r.title}</h3>
                <p className="mt-2 text-sm leading-[1.9] text-ink-soft">{r.body}</p>
              </div>
            </article>
          ))}
        </Reveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          ※ 来店者数・性別年代は運営会社の店舗データ（2026年6月時点）。接触回数は利用の流れからの想定値です。
        </p>
      </div>
    </section>
  );
}
