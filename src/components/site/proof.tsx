import { TrendingUp } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { CountUp } from "./count-up";
import { Reveal } from "./reveal";
import { proof } from "@/lib/site-data";

// 値文字列からバーの割合を推定（"90"→90, "10-20"→20 など）
function pctOf(value: string): number {
  const nums = value.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return 0;
  return Math.min(100, Math.max(...nums));
}

export function Proof() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Proven Results"
          title="トライアルで実証された、広告効果"
          lead={proof.lead}
        />

        <div className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-border bg-paper px-4 py-2 text-sm font-bold text-ink-soft">
          <TrendingUp className="size-4 text-brand" />
          {proof.trial}
        </div>

        <Reveal as="dl" className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {proof.stats.map((s) => {
            const pct = pctOf(s.value);
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <dt className="font-display text-4xl font-extrabold tracking-tight text-brand sm:text-5xl">
                  {/^\d+$/.test(s.value) ? <CountUp to={Number(s.value)} /> : s.value}
                  {s.unit && <span className="text-2xl">{s.unit}</span>}
                </dt>
                {/* バーグラフ */}
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
                <dd className="mt-3 text-sm font-medium text-ink-soft">{s.label}</dd>
              </div>
            );
          })}
        </Reveal>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          ※ 池袋周辺10店舗・3ヶ月間の設置調査に基づく参考値です。効果を保証するものではありません。
        </p>
      </div>
    </section>
  );
}
