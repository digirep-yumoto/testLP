import { Icon } from "./icon";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { videoMerits } from "@/lib/site-data";

export function VideoMerits() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Video"
          title="なぜ、動画サイネージか"
          lead="静止画やポスターでは伝わらない情報量と感情を、音声つきの動画で。縦型・大画面いずれもスペースに最適化します。"
        />

        <Reveal className="mt-14 grid gap-6 md:grid-cols-3">
          {videoMerits.map((m, i) => (
            <div
              key={m.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-muted/60 transition-transform group-hover:scale-110">
                0{i + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110">
                <Icon name={m.icon} className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
