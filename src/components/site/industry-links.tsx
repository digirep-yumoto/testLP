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
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
              >
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", a.softBg, a.text)}>
                  <MediaIcon kind={lp.media} className="size-6" />
                </span>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-ink transition-colors group-hover:text-brand">
                    {lp.badge}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lp.media === "toilet" ? "個室トイレサイネージ" : "コインランドリーサイネージ"}
                  </p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
