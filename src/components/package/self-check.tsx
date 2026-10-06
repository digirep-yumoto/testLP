"use client";

import { useState } from "react";

/** 10項目のセルフチェック。チェック数に応じて、次の一歩を変えて見せる */
export function SelfCheck({ items, cta }: { items: { t: string; d: string }[]; cta: string }) {
  const [on, setOn] = useState<boolean[]>(() => items.map(() => false));
  const n = on.filter(Boolean).length;
  const toggle = (i: number) => setOn((p) => p.map((v, j) => (j === i ? !v : v)));

  const verdict = n === items.length
    ? { t: "すべてあてはまります", d: "対象になる可能性がとても高い状態です。30分の診断で、プランと金額をその場でお出しします。", c: "bg-[#1f9d6b]" }
    : n >= 7
    ? { t: `${n}／${items.length} あてはまります`, d: "残りの項目は、診断の場で一緒に確認できます。多くの場合は解決策があります。", c: "bg-brand" }
    : n > 0
    ? { t: `${n}／${items.length} あてはまります`, d: "まだ分からない項目があっても大丈夫です。診断で一つずつ確認します。", c: "bg-brand" }
    : { t: "チェックを入れてみてください", d: "分からない項目はそのままで構いません。診断で一緒に確認します。", c: "bg-ink-soft" };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it, i) => (
          <button key={it.t} type="button" aria-pressed={on[i]} onClick={() => toggle(i)} className={`flex items-start gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-colors ${on[i] ? "border-[#1f9d6b]" : "border-transparent shadow-sm"}`}>
            <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${on[i] ? "bg-[#1f9d6b]" : "bg-slate-300"}`}>{on[i] ? "✓" : i + 1}</span>
            <span><span className="block text-[15px] font-bold leading-snug text-ink">{it.t}</span><span className="mt-0.5 block text-xs text-ink-soft">{it.d}</span></span>
          </button>
        ))}
      </div>
      <div className={`mt-6 flex flex-col items-start gap-4 rounded-3xl p-6 text-white sm:flex-row sm:items-center sm:justify-between ${verdict.c}`} aria-live="polite">
        <div><p className="text-xl font-black">{verdict.t}</p><p className="mt-1 text-sm leading-relaxed text-white/90">{verdict.d}</p></div>
        <a href={cta} className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-black text-ink shadow-md">30分の診断を申し込む</a>
      </div>
    </div>
  );
}
