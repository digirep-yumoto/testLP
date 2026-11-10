import { ArrowRight, DoorClosed, Building2, Users } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const items = [
  { icon: DoorClosed, eyebrow: "MEDIA 02", h: "個室トイレサイネージ広告", b: "飲食店の個室トイレで、1対1・音あり・視認率90%。人に相談しづらい商材を“濃く”届けます。設置店舗から順次ご案内。", href: "/media/toilet", cta: "媒体を見る" },
  { icon: Building2, eyebrow: "FOR OPERATORS", h: "コインランドリー運営会社さまへ", b: "店内の既設モニターを広告媒体に。配信端末・運用・広告販売は当社、掲載料の一部を毎月お支払い。数店舗のテストから。", href: "/laundry-partner", cta: "配信提携のご案内" },
  { icon: Users, eyebrow: "RECRUITMENT", h: "採用支援（採用の顔・新卒ダイレクト）", b: "応募が集まる“採用の顔”をつくる制作物と、入社人数の保証つき新卒採用。3分の採用スター診断から始められます。", href: "https://saiyo.digirep.work/", cta: "採用支援サイトへ" },
];

export function OtherServices() {
  return (
    <section id="services" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Also from DigiRep" title="そのほかのサービス" lead="コインランドリー広告のほかに、個室トイレ媒体、運営会社さま向けの配信提携、中小企業の採用支援を提供しています。" />
        <Reveal className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((x) => (
            <a key={x.h} href={x.href} className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"><x.icon className="size-5" /></span>
                <span className="font-display text-[11px] font-bold tracking-wide text-muted-foreground">{x.eyebrow}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{x.h}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{x.b}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand">{x.cta}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </a>
          ))}
        </Reveal>
        <p className="mt-6 text-center text-sm text-ink-soft">
          飲食店・サロンのオーナーさま向け（個室トイレの設置・助成金で集客パッケージ）は <a href="/store" className="font-bold text-brand-dark underline underline-offset-4">店舗オーナーの方へ</a> をご覧ください。
        </p>
      </div>
    </section>
  );
}
