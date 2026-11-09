import { CountUp } from "@/components/site/count-up";

const stats = [
  { value: "400", unit: "店", label: "国内最大級の統一配信網", sub: "ブルースカイランドリー406店・39都道府県" },
  { value: "43", unit: "万人/月", label: "月間延べ利用者", sub: "全店合計（運営会社データ・推計）" },
  { value: "7", unit: "割", label: "女性比率", sub: "30〜50代が中心" },
  { value: "8,800", unit: "円〜", label: "1店舗・月額（15秒）", sub: "店舗を選んで10店から" },
] as const;

export function StatsBar() {
  return (
    <section className="relative border-y border-brand/10 bg-sky-soft/60">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-brand/10 px-4 sm:px-6 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`px-4 py-7 text-center ${i >= 2 ? "border-t border-brand/10 lg:border-t-0" : ""}`}>
            <dt className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {s.value.includes(",") ? s.value : <>約<CountUp to={Number(s.value)} /></>}
              <span className="ml-0.5 text-base font-bold text-brand">{s.unit}</span>
            </dt>
            <dd className="mt-1 text-sm font-bold text-ink">{s.label}</dd>
            <dd className="text-xs text-ink-soft">{s.sub}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
