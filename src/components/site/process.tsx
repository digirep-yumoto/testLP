import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { steps } from "@/lib/site-data";

export function Process() {
  return (
    <section id="flow" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How It Works"
          title="出稿までの流れ"
          lead="最短で、迷わず。商材のヒアリングから配信・レポートまで、ワンストップで伴走します。"
        />

        <Reveal as="ol" className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.no} className="relative">
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-md">
                <span className="grid size-10 place-items-center rounded-full bg-brand font-display text-base font-extrabold text-white">
                  {s.no}
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </div>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-border lg:block"
                >
                  ›
                </span>
              )}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
