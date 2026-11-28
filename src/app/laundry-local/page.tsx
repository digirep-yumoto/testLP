import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MapPin, MonitorPlay, QrCode, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { LocalAdForm } from "@/components/laundry/local-ad-form";

// 店内モニターの告知（QR）から来た方に向けた相談受付のページ。
// 少ない店舗数での料金がまだ決まっていないので、検索エンジンには載せず、料金も書かない。
export const metadata: Metadata = {
  title: "コインランドリーの店内モニターに、お店の広告を出しませんか",
  description: "コインランドリーの店内モニターに、ご近所のお店・教室・クリニックの広告を出すご相談を受け付けています。出したい店舗と予算の目安をお聞かせください。",
  alternates: { canonical: "/laundry-local" },
  robots: { index: false, follow: false },
};

const points = [
  { icon: MapPin, title: "近所の人に届きます", body: "コインランドリーに来るのは、その店の近くに住んでいる人です。洗濯物を入れるとき、取り出すときに、店内のモニターが目に入ります。" },
  { icon: MonitorPlay, title: "動画がなくても始められます", body: "写真と文章からでも、モニター用の画面にできます（制作はご相談ください）。動画をお持ちの場合は、そのままお預かりします。" },
  { icon: QrCode, title: "反応を数字で確かめられます", body: "店舗ごとに専用のQRコードを用意できます。何回読み取られたかを、月ごとにお知らせします。" },
];

const steps = [
  { no: "01", title: "フォームから相談", body: "出したい店舗と、予算の目安をお聞かせください。" },
  { no: "02", title: "店舗と料金のご案内", body: "ご希望に合う店舗と料金を、メールでお送りします。" },
  { no: "03", title: "広告の内容の確認", body: "掲載の基準に合うかを確認し、画面を用意します。" },
  { no: "04", title: "配信と毎月の報告", body: "配信した店舗と回数を、毎月お知らせします。" },
];

export default function LaundryLocalPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-paper pt-24 sm:pt-28">
          <nav className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 text-xs text-muted-foreground sm:px-6">
            <Link href="/" className="hover:text-brand">
              ホーム
            </Link>
            <span>/</span>
            <span className="text-ink-soft">店内モニターへの広告のご相談</span>
          </nav>
        </div>

        <section className="bg-paper pb-14 pt-8 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-brand uppercase">For Local Business</p>
            <h1 className="mt-3 text-[1.9rem] font-bold leading-[1.4] text-ink sm:text-[2.5rem] sm:leading-[1.3]">
              このコインランドリーのモニターに、
              <br className="hidden sm:inline" />
              <span className="text-brand">お店の広告</span>を出しませんか。
            </h1>
            <p className="mt-5 text-base leading-[1.95] text-ink-soft sm:text-lg">
              ご近所のお店・教室・クリニックなどの広告を募集しています。出したい店舗と予算の目安をお聞かせいただければ、合う店舗と料金をご案内します。
            </p>
            <div className="mt-7">
              <a href="#consult" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark">
                相談する（無料）
                <ArrowRight className="size-5" />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="Why" title="近所のお店に向いている理由" />
            <Reveal className="mt-10 grid gap-5 md:grid-cols-3">
              {points.map((p) => (
                <div key={p.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <p.icon className="size-7 text-brand" />
                  <h3 className="mt-4 text-lg font-bold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-[1.9] text-ink-soft">{p.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="bg-paper py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="Flow" title="掲載までの流れ" />
            <Reveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.no} className="rounded-2xl border border-border bg-white p-5">
                  <p className="font-display text-2xl font-extrabold text-brand">{s.no}</p>
                  <h3 className="mt-2 font-bold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-[1.85] text-ink-soft">{s.body}</p>
                </div>
              ))}
            </Reveal>
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-white p-5 text-sm leading-[1.9] text-ink-soft">
              <p className="flex items-center gap-2 font-bold text-ink">
                <ShieldCheck className="size-4 text-brand" />
                掲載できない広告
              </p>
              <p className="mt-2">
                たばこ・ギャンブル・消費者金融・アダルト／風俗・出会い系・宗教／政治・連鎖販売／情報商材・コインランドリーと競合する事業の広告は掲載できません。外見や体の悩みをあおる表現も使えません。
              </p>
            </div>
          </div>
        </section>

        <section id="consult" className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeading eyebrow="Contact" title="相談する（無料）" lead="分かる範囲でかまいません。出したい店舗の数と、広告に使える予算の目安をお聞かせください。" />
            <ul className="mx-auto mt-6 grid max-w-xl gap-2 text-sm text-ink-soft">
              {["ご相談と、店舗・料金のご案内は無料です", "ご案内を見てから、出すかどうかを決められます", "複数の店舗、まとまったエリアでの掲載もご相談ください"].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <LocalAdForm source="laundry-local" />
            </div>
            <p className="mt-6 text-center text-sm text-ink-soft">
              10店舗以上での掲載をお考えの方は、
              <Link href="/media/laundry" className="font-bold text-brand hover:underline">
                媒体資料と料金のページ
              </Link>
              をご覧ください。
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
