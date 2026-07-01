import { SectionHeading } from "./section-heading";
import { comparison } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function Mark({ v }: { v: string }) {
  // 先頭が評価記号なら色付け
  const sym = v.charAt(0);
  const rest = v.slice(1).trim();
  const color =
    sym === "◎"
      ? "text-brand"
      : sym === "○"
        ? "text-emerald-600"
        : sym === "△"
          ? "text-amber-500"
          : sym === "×"
            ? "text-muted-foreground"
            : "text-ink";
  if (["◎", "○", "△", "×"].includes(sym)) {
    return (
      <span className="inline-flex flex-col items-center gap-0.5">
        <span className={cn("text-xl font-black leading-none", color)}>{sym}</span>
        {rest && <span className="text-[11px] leading-tight text-ink-soft">{rest}</span>}
      </span>
    );
  }
  return <span className="text-sm font-medium text-ink">{v}</span>;
}

export function Comparison() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Comparison"
          title="他の広告媒体との違い"
          lead="「広く浅く」の一般的な広告と、「狭く・深く・繰り返す」DigiRep。1対1の質（トイレ）と、超高頻度の量（ランドリー）で、他媒体にはない届き方を実現します。"
        />

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border shadow-sm">
          <table className="w-full min-w-[720px] border-collapse bg-card text-center">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-card px-4 py-4 text-left text-xs font-bold text-muted-foreground" />
                {comparison.cols.map((c) => (
                  <th
                    key={c.label}
                    className={cn(
                      "px-4 py-4 text-sm font-bold",
                      c.highlight ? "bg-brand/5 text-brand" : "text-ink-soft",
                    )}
                  >
                    {c.highlight && (
                      <span className="mb-1 block font-display text-[10px] tracking-wide text-brand/70">
                        DigiRep
                      </span>
                    )}
                    {c.label.replace("DigiRep ", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.k} className="border-t border-border">
                  <th className="sticky left-0 z-10 whitespace-nowrap bg-card px-4 py-4 text-left text-sm font-bold text-ink">
                    {r.k}
                  </th>
                  {r.v.map((cell, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-4 py-4 align-middle",
                        comparison.cols[i]?.highlight && "bg-brand/5",
                      )}
                    >
                      <Mark v={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          ※ 各媒体の一般的な特性に基づく比較イメージです。効果・単価は出稿条件により異なります。
        </p>
      </div>
    </section>
  );
}
