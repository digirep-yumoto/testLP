import { Icon } from "./icon";
import { Reveal } from "./reveal";
import { whyPoints } from "@/lib/site-data";

export function Why() {
  return (
    <section id="why" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 100% 0%, rgba(4,120,189,0.25) 0%, transparent 55%), radial-gradient(45% 55% at 0% 100%, rgba(14,165,233,0.16) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-sky-300 uppercase">
            Why DigiRep
          </p>
          <h2 className="text-balance text-[1.95rem] font-bold leading-[1.35] sm:text-[2.6rem] sm:leading-[1.25]">
            DigiRep が選ばれる理由
          </h2>
          <p className="mt-4 text-base leading-[1.95] text-white/75 sm:text-lg">
            独自の“閉鎖空間×生活導線”だからこそ実現できる、他にはない広告効果を提供します。
          </p>
        </div>

        <Reveal className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((p) => (
            <div
              key={p.title}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-brand/20 text-sky-300 transition-transform group-hover:scale-110">
                <Icon name={p.icon} className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">{p.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-white/70">{p.body}</p>
              <span className="mt-4 inline-flex w-fit items-center rounded-full bg-sky-300/15 px-3 py-1 font-display text-sm font-bold text-sky-200">
                {p.stat}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
