import { Quote } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { voices } from "@/lib/site-data";
import { accent } from "./accent";
import { cn } from "@/lib/utils";

export function Voices() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Use Cases"
          title="こんな効果が期待できます"
          lead="商材・業種ごとに、DigiRepの“質（トイレ）”と“頻度（ランドリー）”をどう活かせるか。想定される活用シナリオをご紹介します。"
        />

        <Reveal className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {voices.map((v) => {
            const a = accent[v.accent];
            return (
              <figure
                key={v.cat}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold text-white", a.bg)}>
                    {v.media}
                  </span>
                  <Quote className={cn("size-6", a.text)} />
                </div>
                <p className="mt-3 text-sm font-bold text-ink">{v.cat}</p>
                <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">
                  「{v.quote}」
                </blockquote>
                <div className={cn("mt-4 rounded-xl px-4 py-2.5 text-center font-display text-lg font-extrabold", a.softBg, a.text)}>
                  {v.metric}
                </div>
              </figure>
            );
          })}
        </Reveal>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          ※ 上記はサービス特性に基づく想定シナリオ（イメージ）であり、実際の導入事例・成果を示すものではありません。効果を保証するものではありません。
        </p>
      </div>
    </section>
  );
}
