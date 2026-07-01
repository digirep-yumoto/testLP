import { ArrowRight, Check } from "lucide-react";
import { Icon } from "./icon";
import { storeOwner, company, storeSignageNote } from "@/lib/site-data";

export function StoreOwner() {
  return (
    <section id="store" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 100% 0%, rgba(4,120,189,0.28) 0%, transparent 55%), radial-gradient(45% 55% at 0% 100%, rgba(14,165,233,0.16) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="mb-3 font-display text-[13px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
            For Store Owners
          </p>
          <h2 className="text-balance text-[1.8rem] font-bold leading-[1.4] tracking-[-0.01em] sm:text-4xl sm:leading-[1.3]">
            個室トイレが、店舗の“収益”になる。
          </h2>
          <p className="mt-4 text-[15px] leading-[1.9] text-white/75">{storeOwner.lead}</p>
          <p className="mt-4 inline-flex items-start gap-2 rounded-xl border border-sky-300/25 bg-sky-300/10 px-4 py-2.5 text-xs leading-relaxed text-sky-100">
            <span className="mt-0.5 shrink-0 rounded bg-sky-300/20 px-1.5 py-0.5 font-bold">注意</span>
            {storeSignageNote}
          </p>
        </div>

        {/* 4つのメリット */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {storeOwner.merits.map((m) => (
            <div
              key={m.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:bg-white/10"
            >
              <span className="grid size-11 place-items-center rounded-lg bg-brand/20 text-sky-300">
                <Icon name={m.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{m.body}</p>
            </div>
          ))}
        </div>

        {/* ポイント＋シミュレーション */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ul className="flex flex-col justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-7">
            {storeOwner.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed text-white/85">
                <Check className="mt-0.5 size-5 shrink-0 text-sky-300" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-6 py-4">
              <h3 className="text-base font-bold text-white">店舗の副収入シミュレーション</h3>
              <p className="mt-0.5 text-xs text-white/55">負担ゼロのまま、来客・個室面数が多いほど還元額UP</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-white/55">
                  <th className="px-6 py-2.5 font-medium">店舗タイプ</th>
                  <th className="px-2 py-2.5 font-medium">面数</th>
                  <th className="px-2 py-2.5 font-medium">来客</th>
                  <th className="px-6 py-2.5 text-right font-medium">月の還元</th>
                </tr>
              </thead>
              <tbody>
                {storeOwner.sim.map((s) => (
                  <tr key={s.type} className="border-t border-white/10">
                    <td className="px-6 py-3 font-medium text-white/90">{s.type}</td>
                    <td className="px-2 py-3 text-white/70">{s.booth}</td>
                    <td className="px-2 py-3 text-white/70">{s.visitors}</td>
                    <td className="px-6 py-3 text-right font-display text-base font-extrabold text-sky-300">
                      {s.income}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-6 py-3 text-[11px] leading-relaxed text-white/45">{storeOwner.simNote}</p>
          </div>
        </div>

        {/* 導入の流れ */}
        <div className="mt-12">
          <h3 className="mb-5 text-center text-lg font-bold text-white">加盟店になるまでの流れ</h3>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {storeOwner.steps.map((s) => (
              <li key={s.no} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <span className="font-display text-sm font-extrabold text-sky-300">STEP {s.no}</span>
                <h4 className="mt-2 text-sm font-bold text-white">{s.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-white/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 text-center">
          <a
            href={`mailto:${company.email}?subject=${encodeURIComponent("店舗へのサイネージ設置について")}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark active:translate-y-px"
          >
            店舗導入を無料で相談する
            <ArrowRight className="size-5" />
          </a>
          <p className="mt-3 text-xs text-white/55">
            初期費用・運用負担ゼロ／設置・配信・保守・動画制作はすべて当社が負担します。
          </p>
        </div>
      </div>
    </section>
  );
}
