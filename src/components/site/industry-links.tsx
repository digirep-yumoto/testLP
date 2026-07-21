import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { MediaIcon } from "./icon";
import { accent } from "./accent";
import { lps } from "@/lib/lp-data";
import { cn } from "@/lib/utils";

export function IndustryLinks() {
  return (
    <section id="industries" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="For Your Industry"
          title="業種から探す"
          lead="あなたの業種に合わせた活用イメージ・効果・料金を、専用ページでご案内します。気になる業種を選んでください。"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {lps.map((lp) => {
            const a = accent[lp.media];
            return (
              <a
                key={lp.slug}
                href={`/lp/${lp.slug}`}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
              >
                {/* 上部アクセントバー（ホバーで出現） */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand to-sky-400 transition-transform duration-300 group-hover:scale-x-100"
                />
                {/* うっすらグラデーション（ホバーで出現） */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-brand/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  className={cn(
                    "relative grid size-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    a.softBg,
                    a.text,
                  )}
                >
                  <MediaIcon kind={lp.media} className="size-6" />
                </span>
                <div className="relative flex-1">
                  <h3 className="text-base font-bold text-ink transition-colors group-hover:text-brand">
                    {lp.badge}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lp.media === "toilet" ? "個室トイレサイネージ" : "コインランドリーサイネージ"}
                  </p>
                </div>
                <ArrowRight className="relative size-5 shrink-0 text-ink-soft transition-all group-hover:translate-x-1 group-hover:text-brand" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
