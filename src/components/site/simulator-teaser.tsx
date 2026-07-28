import Link from "next/link";
import { ArrowRight, Calculator, Gift } from "lucide-react";
import { Reveal } from "./reveal";

const points = [
  { k: "想定リーチ", v: "何人に届くか" },
  { k: "接触回数", v: "何回見られるか" },
  { k: "広告費", v: "月額と期間合計" },
  { k: "CPM", v: "1,000接触の単価" },
];

/**
 * 無料シミュレーター（/simulator）への導線。
 * 「まず数字だけ知りたい」層を、問い合わせ前に拾うための無料ツール。
 */
export function SimulatorTeaser() {
  return (
    <section id="simulator" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="overflow-hidden rounded-3xl bg-ink text-white shadow-sm">
          <div className="grid gap-8 p-8 sm:p-11 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                <Gift className="size-3.5" />
                無料ツール・登録不要
              </p>
              <h2 className="mt-4 text-balance text-[1.7rem] font-bold leading-[1.4] sm:text-[2.2rem] sm:leading-[1.3]">
                いくらで、何人に届く？
                <br />
                60秒で無料試算。
              </h2>
              <p className="mt-4 text-pretty text-sm leading-[1.95] text-white/70 sm:text-base">
                業種と配信規模を選ぶだけで、想定リーチ・接触回数・広告費・CPMをその場で自動計算。
                問い合わせの前に、社内検討に使える数字が手に入ります。
              </p>
              <Link
                href="/simulator"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-brand hover:text-white"
              >
                <Calculator className="size-4" />
                無料シミュレーターを使う
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
              {points.map((p) => (
                <li key={p.k} className="bg-ink px-5 py-5">
                  <p className="font-display text-base font-extrabold text-brand sm:text-lg">{p.k}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">{p.v}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
