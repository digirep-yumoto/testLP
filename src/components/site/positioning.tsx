import { SectionHeading } from "./section-heading";
import { MediaIcon } from "./icon";
import { Reveal } from "./reveal";
import { accent } from "./accent";
import { positioning } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function Panel({ data }: { data: typeof positioning.toilet | typeof positioning.laundry }) {
  const a = accent[data.key];
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className={cn("grid size-12 place-items-center rounded-xl", a.softBg, a.text)}>
          <MediaIcon kind={data.key} className="size-6" />
        </span>
        <span className={cn("rounded-full px-3 py-1 text-xs font-bold text-white", a.bg)}>
          {data.badge}
        </span>
      </div>

      <p className={cn("mt-5 text-3xl font-black tracking-tight", a.text)}>{data.head}</p>
      <p className="mt-1.5 text-sm font-medium text-ink-soft">{data.sub}</p>

      {/* バーグラフ */}
      <div className="mt-6 space-y-3">
        {positioning.metrics.map((m, i) => (
          <div key={m}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink-soft">{m}</span>
              <span className={cn("font-display font-bold", a.text)}>{data.bars[i]}</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", a.bg)}
                style={{ width: `${data.bars[i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* スペック表 */}
      <dl className="mt-6 divide-y divide-border border-t border-border">
        {data.rows.map((r) => (
          <div key={r.k} className="flex gap-4 py-2.5 text-sm">
            <dt className="w-20 shrink-0 font-medium text-muted-foreground">{r.k}</dt>
            <dd className="font-medium text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Positioning() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Positioning"
          title="2つの媒体、2つの強み"
          lead="「1対1で濃く刺す“質”のトイレ」と、「同一ターゲットに繰り返す“頻度・量”のランドリー」。目的に合わせて選べます。"
        />

        <Reveal className="relative mt-14 grid gap-6 lg:grid-cols-2">
          <Panel data={positioning.toilet} />
          <Panel data={positioning.laundry} />
          {/* 中央のVS */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <span className="grid size-14 place-items-center rounded-full border border-border bg-white font-display text-lg font-black text-ink shadow-md">
              VS
            </span>
          </div>
        </Reveal>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          ※ 指標は媒体特性を分かりやすく示すための相対イメージです。実数値は各媒体の詳細・資料をご覧ください。
        </p>
      </div>
    </section>
  );
}
