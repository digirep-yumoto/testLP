import { ArrowRight } from "lucide-react";
import { MediaIcon } from "./icon";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { mediaList } from "@/lib/site-data";
import { accent } from "./accent";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our Media"
          title="2つの生活導線メディア"
          lead="「1対1で濃く届ける個室トイレ」と、「同一ターゲットに繰り返す商業施設併設のコインランドリー」。商材に合わせて、最適な“視聴環境”を選べます。"
        />

        <Reveal className="mt-14 grid gap-6 md:grid-cols-2">
          {mediaList.map((m) => {
            const a = accent[m.key];
            return (
              <a
                key={m.key}
                href={`#${m.key}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div
                  className={cn(
                    "relative h-52 w-full overflow-hidden sm:h-60",
                    m.thumbFit === "contain" && "bg-slate-100",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.thumb}
                    alt={m.imageAlt}
                    loading="lazy"
                    className={cn(
                      "size-full transition-transform duration-500",
                      m.thumbFit === "contain"
                        ? "object-contain p-2 group-hover:scale-[1.03]"
                        : "object-cover group-hover:scale-[1.07]",
                    )}
                  />
                  <span aria-hidden className={`absolute inset-x-0 bottom-0 h-1 ${a.bg}`} />
                  <span
                    className={`absolute left-4 top-4 rounded-full ${a.bg} px-3 py-1 text-[11px] font-bold text-white shadow`}
                  >
                    {m.axis.tag}
                  </span>
                  {m.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                      {m.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-11 place-items-center rounded-xl ${a.softBg} ${a.text} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <MediaIcon kind={m.key} className="size-6" />
                    </span>
                    <div>
                      <p className={`font-display text-xs font-bold tracking-wide ${a.text}`}>
                        MEDIA {m.no}
                      </p>
                      <p className="font-display text-[11px] font-semibold text-muted-foreground">
                        {m.nameEn}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-ink">{m.name}</h3>
                  <p className={`mt-1 text-lg font-black ${a.text}`}>{m.axis.head}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.catch}</p>

                  {/* ホバーで“ボワン”と出る詳細 */}
                  <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap gap-1.5">
                        {m.targets.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className={`rounded-full border ${a.border} ${a.text} px-2.5 py-1 text-xs font-medium`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold ${a.text}`}
                  >
                    詳しく見る
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
