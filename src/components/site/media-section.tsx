import { ArrowRight, Check, AlertCircle, Sparkles } from "lucide-react";
import { Icon, MediaIcon } from "./icon";
import { Reveal } from "./reveal";
import { Carousel } from "./carousel";
import { accent } from "./accent";
import type { Media } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function MediaSection({ media, index }: { media: Media; index: number }) {
  const a = accent[media.key];
  const alt = index % 2 === 1;

  return (
    <section id={media.key} className={cn("py-20 sm:py-28", alt ? "bg-paper" : "bg-white")}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ヘッダー：左コピー / 右カルーセル */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className={cn(alt && "lg:order-2")}>
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn("grid size-12 place-items-center rounded-xl", a.softBg, a.text)}>
                <MediaIcon kind={media.key} className="size-6" />
              </span>
              <div>
                <p className={cn("font-display text-xs font-bold tracking-widest", a.text)}>
                  MEDIA {media.no}
                </p>
                <p className="font-display text-xs font-semibold text-muted-foreground">
                  {media.nameEn}
                </p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold text-white", a.bg)}>
                {media.axis.tag}
              </span>
              {media.badge && (
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white">
                  {media.badge}
                </span>
              )}
            </div>

            <h2 className="mt-5 text-[1.8rem] font-bold leading-[1.35] tracking-[-0.01em] text-ink sm:text-4xl">
              {media.name}
            </h2>
            {/* 軸コピー（質/頻度） */}
            <p className={cn("mt-3 text-2xl font-black tracking-tight sm:text-3xl", a.text)}>
              {media.axis.head}
            </p>
            <p className="mt-1 text-[15px] font-bold text-ink-soft">{media.axis.sub}</p>
            <p className="mt-4 text-lg font-bold leading-relaxed text-ink">{media.catch}</p>
            <p className="mt-3 text-base leading-[1.95] text-ink-soft">{media.lead}</p>

            <a
              href="#contact"
              className={cn(
                "mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:translate-y-px",
                a.bg,
              )}
            >
              この媒体で相談する
              <ArrowRight className="size-4" />
            </a>
          </div>

          {/* 設置イメージ（スライドショー） */}
          <Reveal className={cn("relative", alt && "lg:order-1")}>
            <div
              aria-hidden
              className={cn("absolute -inset-5 rounded-[2rem] bg-gradient-to-br opacity-70 blur-2xl", a.gradient)}
            />
            <div className="relative rounded-2xl border border-border bg-card shadow-xl">
              <Carousel
                images={media.images}
                alt={media.imageAlt}
                className="h-[320px] w-full rounded-2xl sm:h-[460px]"
              />
              <div className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                <MediaIcon kind={media.key} className="size-3.5" />
                実際の設置イメージ
              </div>
            </div>
          </Reveal>
        </div>

        {/* スタッツ */}
        <dl
          className={cn(
            "mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border shadow-sm sm:grid-cols-4",
            a.border,
          )}
        >
          {media.stats.map((s) => (
            <div key={s.label} className="bg-card px-5 py-6">
              <dt className="font-display text-3xl font-extrabold tracking-tight text-ink">
                {s.value}
                {s.unit && <span className={cn("ml-0.5 text-sm font-bold", a.text)}>{s.unit}</span>}
              </dt>
              <dd className="mt-1.5 text-xs leading-snug text-ink-soft">{s.label}</dd>
            </div>
          ))}
        </dl>

        {/* ハイライト */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {media.highlights.map((h) => (
            <div
              key={h.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-lg transition-transform group-hover:scale-110",
                  a.softBg,
                  a.text,
                )}
              >
                <Icon name={h.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{h.body}</p>
            </div>
          ))}
        </div>

        {/* 他媒体との違い（ランドリーのみ） */}
        {media.diff && (
          <Reveal
            className={cn(
              "mt-6 overflow-hidden rounded-3xl border p-6 shadow-sm sm:p-9",
              a.border,
              a.softBg,
            )}
          >
            <h3 className="text-xl font-bold text-ink sm:text-2xl">{media.diff.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{media.diff.lead}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {media.diff.points.map((p, i) => (
                <div key={p.h} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className={cn("font-display text-sm font-extrabold", a.text)}>
                    0{i + 1}
                  </div>
                  <h4 className="mt-1 text-base font-bold text-ink">{p.h}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.b}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* 推奨広告主ターゲット */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-2">
            <Sparkles className={cn("size-5", a.text)} />
            <h3 className="text-base font-bold text-ink">推奨する広告主ターゲット</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {media.targets.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                  a.border,
                  a.text,
                )}
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{media.targetsNote}</p>
        </div>

        {/* 料金 */}
        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold text-ink">料金プラン</h3>
            <span className={cn("font-display text-xs font-bold tracking-wide", a.text)}>
              {media.name}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{media.pricingLead}</p>

          <div
            className={cn(
              "mt-7 grid gap-4",
              media.plans.length >= 4
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : media.plans.length === 3
                  ? "sm:grid-cols-3"
                  : "sm:grid-cols-1",
            )}
          >
            {media.plans.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-5 transition-transform hover:-translate-y-1",
                  p.highlight
                    ? cn("ring-2", a.border, a.ring, a.softBg)
                    : "border-border bg-background",
                )}
              >
                {p.badge && (
                  <span
                    className={cn(
                      "absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white",
                      a.bg,
                    )}
                  >
                    {p.badge}
                  </span>
                )}
                <p className="text-sm font-bold text-ink">{p.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
                    {p.price}
                  </span>
                  {p.price2 && <span className="text-sm font-bold text-ink-soft">／ {p.price2}</span>}
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{p.unit}</p>
                <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-ink-soft">
                  {p.note}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 flex gap-2 rounded-xl bg-muted px-4 py-3 text-xs leading-relaxed text-ink-soft">
            <Check className={cn("mt-0.5 size-4 shrink-0", a.text)} />
            <span>{media.pricingNote}</span>
          </p>
          <p className="mt-2 flex gap-2 px-1 text-[11px] leading-relaxed text-muted-foreground">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>掲載審査について：{media.ng}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
