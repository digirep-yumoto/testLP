"use client";

import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { accent } from "@/components/site/accent";
import { LAUNDRY_TOTAL_STORES, type PlanOption, type SimInput } from "@/lib/simulator";

const yen = (n: number) => `¥${Math.round(n).toLocaleString("ja-JP")}`;
const num = (n: number) => Math.round(n).toLocaleString("ja-JP");

const storesOf = (i: SimInput) =>
  i.media === "toilet"
    ? i.stores
    : i.pkg === "national"
      ? LAUNDRY_TOTAL_STORES
      : i.laundryStores;

/**
 * 3プラン（まず試す／推奨／しっかり）の横並び比較。
 * 「3ヶ月継続で▲10%」が一目で分かるため、単発より継続の意思決定を後押しする。
 */
export function PlanOptions({
  plans,
  current,
  onSelect,
}: {
  plans: PlanOption[];
  current: SimInput;
  onSelect: (input: SimInput) => void;
}) {
  if (plans.length === 0) return null;
  const media = plans[0].result.media;
  const a = accent[media];

  const isCurrent = (p: PlanOption) =>
    p.input.months === current.months && storesOf(p.input) === storesOf(current);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 font-display text-sm font-extrabold text-brand">
          06
        </span>
        <div>
          <h2 className="text-base font-bold text-ink sm:text-lg">3つの始め方から選ぶ</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-soft sm:text-[13px]">
            いまの条件をもとに、規模と期間の組み合わせを3案ご提案します。カードを選ぶと上の試算に反映されます。
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {plans.map((p) => {
          const rec = p.key === "recommended";
          const active = isCurrent(p);
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onSelect(p.input)}
              className={cn(
                "relative flex flex-col rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                active
                  ? cn(a.border, a.softBg, "shadow-sm")
                  : rec
                    ? "border-brand/40 bg-brand/[0.03]"
                    : "border-border bg-background",
              )}
            >
              {p.badge && (
                <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Sparkles className="size-3" />
                  {p.badge}
                </span>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-ink">{p.label}</span>
                {active && (
                  <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-bold", a.text)}>
                    <Check className="size-3" />
                    選択中
                  </span>
                )}
              </div>

              <p className="mt-2 font-display text-[1.5rem] font-extrabold leading-none tabular-nums text-ink">
                {yen(p.result.subtotalExclTax)}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                合計・税別（月額 {yen(p.result.monthlyExclTax)}）
              </p>

              <dl className="mt-3 grid gap-1 border-t border-border/70 pt-3 text-[11px]">
                <Line k="配信規模" v={`${num(storesOf(p.input))} 店`} />
                <Line
                  k="掲載期間"
                  v={
                    <>
                      {p.input.months}ヶ月
                      {p.input.months > 1 && (
                        <span className="ml-1 font-bold text-brand">
                          ▲{p.input.months === 2 ? 5 : 10}%
                        </span>
                      )}
                    </>
                  }
                />
                <Line k="想定接触" v={`${num(p.result.contactsTotal)} 回`} />
                <Line
                  k={p.result.media === "toilet" ? "1視聴単価" : "CPM"}
                  v={p.result.media === "toilet" ? `¥${p.result.cpc.toFixed(1)}` : yen(p.result.cpm)}
                />
              </dl>

              <p className="mt-3 text-[11px] leading-relaxed text-ink-soft">{p.reason}</p>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        ※ 継続割引は2ヶ月▲5%・3ヶ月▲10%。4ヶ月以上の長期出稿や、複数媒体の組み合わせは個別にご相談ください。
      </p>
    </section>
  );
}

function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="shrink-0 font-bold tabular-nums text-ink">{v}</dd>
    </div>
  );
}
