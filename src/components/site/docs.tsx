import { Download, FileText } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { MediaIcon } from "./icon";
import { accent } from "./accent";
import { docs } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Docs() {
  return (
    <section id="docs" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Download"
          title="資料ダウンロード"
          lead="各メディアの媒体価値・調査データ・料金プランをまとめた提案資料です。社内検討にご活用ください。"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {docs.map((d) => {
            const a = accent[d.media];
            return (
              <a
                key={d.href}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", a.softBg, a.text)}>
                  <MediaIcon kind={d.media} className="size-6" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <FileText className="size-3.5" />
                    PDF
                  </div>
                  <h3 className="mt-1 text-base font-bold text-ink">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d.desc}</p>
                  <span className={cn("mt-3 inline-flex items-center gap-1.5 text-sm font-bold", a.text)}>
                    <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
                    ダウンロード
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
