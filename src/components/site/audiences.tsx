import { ArrowRight } from "lucide-react";
import { Icon } from "./icon";
import { audiences } from "@/lib/site-data";

export function Audiences() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {audiences.map((a) => (
            <div
              key={a.key}
              className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-lg bg-brand/10 text-brand">
                  <Icon name={a.icon} className="size-5" />
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-ink-soft">
                  {a.label}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink">{a.title}</h3>
              <div className="flex-1">
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.body}</p>
                {a.note && (
                  <p className="mt-2.5 rounded-lg bg-brand/5 px-3 py-2 text-xs font-medium text-brand-dark">
                    ※ {a.note}
                  </p>
                )}
              </div>
              <a
                href={a.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand transition-colors hover:text-brand-dark"
              >
                {a.cta}
                <ArrowRight className="size-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
