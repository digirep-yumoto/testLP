import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { storeLogos } from "@/lib/site-data";

function Row({ logos, reverse = false }: { logos: string[]; reverse?: boolean }) {
  const items = [...logos, ...logos];
  return (
    <div className="dr-marquee dr-mask-x overflow-hidden py-2">
      <div className={`dr-marquee-track gap-4${reverse ? " [animation-direction:reverse]" : ""}`}>
        {items.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-4 shadow-sm sm:h-28 sm:w-48"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="導入店舗ロゴ"
              loading="lazy"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StoreLogos() {
  const half = Math.ceil(storeLogos.length / 2);
  return (
    <section className="overflow-hidden bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Store Network"
          title={
            <>
              全国 <span className="text-brand">400店舗以上</span> の
              <br className="hidden sm:block" />
              個室トイレに配信できます
            </>
          }
          lead="飲食チェーンを中心に、導入店舗は随時拡大中。これだけ多くの“1対1の個室”へ、まとめて広告を届けられます。"
        />
      </div>

      <Reveal className="mt-12 flex flex-col gap-4">
        <Row logos={storeLogos.slice(0, half)} />
        <Row logos={storeLogos.slice(half)} reverse />
      </Reveal>

      <p className="mt-8 px-4 text-center text-xs leading-relaxed text-muted-foreground">
        ※ 導入・導入予定店舗の一部です。最新の配信可能店舗は担当までお問い合わせください。
      </p>
    </section>
  );
}
