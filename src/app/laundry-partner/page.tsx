import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MonitorPlay, Megaphone, Coins, ShieldCheck, Wrench, FileText, HelpCircle } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { LeadForm } from "@/components/site/lead-form";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { company, ogImage } from "@/lib/site-data";

const siteUrl = company.url.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "コインランドリー運営会社さまへ｜店内モニターを広告媒体に（配信提携）",
  description:
    "コインランドリーを運営する企業さま・多店舗オーナーさま向け。店内にすでにあるモニターに当社が配信端末を無償で取り付け、広告の販売・配信・保守・レポートを行い、広告掲載料の一部を毎月お支払いします。空き枠は自社告知に無料で使えます。全国約400店のブルースカイランドリーと提携し、2027年初めから配信開始。",
  alternates: { canonical: "/laundry-partner" },
  openGraph: {
    type: "website",
    title: "コインランドリー運営会社さまへ｜店内モニターを広告媒体に",
    description: "既設モニターに配信端末を無償で取り付け。広告の販売・配信・保守は当社。広告掲載料の一部を毎月お支払いします。",
    url: `${siteUrl}/laundry-partner`,
    siteName: company.brand,
    locale: "ja_JP",
    images: [ogImage],
  },
};

const merits = [
  { icon: Megaphone, title: "広告は当社が取ってきます", body: "広告の販売は当社と提携する広告代理店が行います。御社に営業の手間はありません。入った広告の掲載料をもとに、毎月お支払いします。" },
  { icon: Wrench, title: "端末・配信・保守は当社負担", body: "店内にすでにあるモニターに、配信用の小型端末を当社が無償で取り付けます。配信管理・保守・月次レポートも当社が行い、店舗さまに必要なのは電源とインターネット回線だけです。" },
  { icon: Coins, title: "掲載料の一部を毎月お支払い", body: "広告掲載料の10〜15%を、月末締め・翌月末に明細つきでお支払いします（直販15%／代理店経由10%・付帯メニューあり＋5%）。約束の金額ではなく、入った広告が基準です。" },
  { icon: MonitorPlay, title: "空き枠は自社告知に無料", body: "4分ロールのうち1枠を御社の告知に無料で開放。キャンペーン・会員（LINE）募集・求人・新店案内などに使えます。" },
  { icon: ShieldCheck, title: "掲載基準と判断権", body: "消費者金融・ギャンブル・出会い系・風俗・コンプレックス系は掲載しません。御社にも掲載可否の判断権があります。音量は店舗ごとに調整でき、時間帯でミュートもできます。" },
  { icon: FileText, title: "契約は分かりやすく", body: "業務提携契約（初回2年・以後1年更新・3か月前の通知で解約可）。終了時も配信中の広告は掲載期間の満了まで継続し、月次の売上明細（広告主名・期間・金額・入金状況・配分額）を共有します。" },
];

const steps = [
  { no: "01", title: "30分のオンライン説明", body: "仕組み・条件・実績の数字をお見せします。店内モニターのある店舗数、モニターの種類、回線の有無を伺います。" },
  { no: "02", title: "候補店舗の確認", body: "数店舗〜のテスト導入の候補をいただき、1週間で設置計画と見込み額をお戻しします。" },
  { no: "03", title: "契約・端末の取り付け", body: "業務提携契約を締結し、当社が配信端末を取り付けます（既設モニターに接続）。" },
  { no: "04", title: "配信開始・毎月のレポート", body: "広告と御社の告知の配信を開始。翌月15日までに売上明細を共有し、翌月末にお支払いします。" },
];

const faqs = [
  { q: "広告はどれくらい入りますか？", a: "広告主次第で、お約束はできません。当社と提携する広告代理店、当社の直販で販売し、入った月の掲載料から分配します。" },
  { q: "モニターがない店舗もありますが…", a: "現在は、店内にモニターがある店舗さまからご一緒しています。モニターのない店舗さま向けの形が整いましたら、改めてご案内します。" },
  { q: "既存のモニターで流している自社コンテンツはどうなりますか？", a: "4分ロールの中に御社の告知枠を無料で設けます。流したい内容をお預かりして当社が配信します。" },
  { q: "音が気になりませんか？", a: "音量は店舗ごとに調整でき、時間帯でミュートにもできます。広告は音声ありを標準としていますが、店舗の環境に合わせます。" },
  { q: "店舗が増えたり閉店したりしたら？", a: "毎月の店舗リストで反映します。閉店・休業は事前にお知らせください。" },
];

export default function LaundryPartnerPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-paper pt-24 sm:pt-28">
          <nav className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 text-xs text-muted-foreground sm:px-6">
            <Link href="/" className="hover:text-brand">ホーム</Link>
            <span>/</span>
            <span className="text-ink-soft">コインランドリー運営会社さまへ</span>
          </nav>
        </div>

        {/* ヒーロー */}
        <section className="bg-paper pb-16 pt-8 sm:pb-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-brand uppercase">For Laundry Operators</p>
              <h1 className="mt-3 text-[2rem] font-bold leading-[1.35] text-ink sm:text-[2.6rem] sm:leading-[1.25]">
                店内にあるモニターを、
                <br />
                <span className="text-brand">店舗網の広告媒体</span>に。
              </h1>
              <p className="mt-5 text-base leading-[1.95] text-ink-soft sm:text-lg">
                コインランドリーを運営する企業さま・多店舗オーナーさまへ。当社は、ブルースカイランドリー（全国約400店）と提携し、店内モニターでの広告配信を2027年初めから始めます。同じ仕組みを、御社の店舗網でもご一緒できないかと考えています。
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-ink">
                {["既設モニターを活用", "端末・配信・保守は当社負担", "掲載料の10〜15%を毎月", "自社告知枠は無料", "数店舗のテストからOK"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5">
                    <Check className="size-3.5 shrink-0 text-brand" />
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#request" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark">
                  30分のオンライン説明を申し込む
                  <ArrowRight className="size-5" />
                </a>
                <a href="/media/laundry" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-4 text-base font-semibold text-ink transition-colors hover:border-brand hover:text-brand">
                  広告主向けの媒体ページを見る
                </a>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                ※ 対象は、店内にモニター（テレビ・業務用ディスプレイ）がある店舗さまです。分配額は入った広告の掲載料が基準で、金額をお約束するものではありません。
              </p>
            </div>
            <Reveal className="relative">
              <div aria-hidden className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-brand/20 to-sky-200/40 opacity-70 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/laundry-media-new.jpg" alt="コインランドリー店内の大型モニターで広告を配信しているイメージ" className="aspect-[4/3] w-full object-cover" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 仕組み・メリット */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="How It Works" title="御社に営業の手間なく、店舗網がメディアになる" lead="当社が広告を集め、配信・保守・レポートまで行います。御社は既設のモニターと設置スペースを提供し、広告掲載料の一部を受け取る形です。" />
            <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {merits.map((m) => (
                <div key={m.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <span className="grid size-11 place-items-center rounded-lg bg-brand/10 text-brand">
                    <m.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 条件の目安 */}
        <section className="bg-paper py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeading eyebrow="Terms" title="条件の目安" lead="詳細は30分の説明でお話しします。ブルースカイランドリーと同じ考え方で設計しています。" />
            <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["設置", "店内の既設モニターを使用。配信端末は当社が無償で取り付け・保守"],
                    ["店舗側の負担", "電源とインターネット回線（店舗Wi-Fi）。工事が必要な場合は事前協議"],
                    ["分配", "広告掲載料の15%（当社直販）／10%（代理店経由）。付帯メニューがある案件は＋5%。月末締め・翌月末払い・明細つき"],
                    ["自社枠", "4分ロールのうち1枠を御社の告知に無料開放（キャンペーン・会員募集・求人・新店案内）"],
                    ["掲載基準", "消費者金融・ギャンブル・出会い系・風俗・コンプレックス系は掲載しない。御社にも掲載可否の判断権"],
                    ["契約", "業務提携契約（初回2年・以後1年更新・3か月前通知で解約可）。終了時も配信中の広告は掲載期間満了まで継続"],
                    ["報告", "月次の売上明細（広告主名・期間・金額・入金状況・配分額）を翌月15日までに共有"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-t border-border first:border-t-0">
                      <th className="w-32 bg-paper px-5 py-4 text-left align-top font-bold text-ink sm:w-40">{k}</th>
                      <td className="px-5 py-4 leading-relaxed text-ink-soft">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 流れ */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="Steps" title="始め方" lead="最初の30分で、御社の店舗網で成り立つかどうかが分かります。" />
            <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.no} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="font-display text-sm font-extrabold text-brand">STEP {s.no}</span>
                  <h3 className="mt-2 text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-paper py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeading eyebrow="FAQ" title="よくいただくご質問" />
            <div className="mt-10 grid gap-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="flex gap-2 text-base font-bold text-ink">
                    <HelpCircle className="mt-0.5 size-5 shrink-0 text-brand" />
                    {f.q}
                  </h3>
                  <p className="mt-2 pl-7 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LeadForm
          defaultPurpose="コインランドリー店舗での配信提携について（運営会社・多店舗オーナー様）"
          defaultMedia="コインランドリーの配信提携（運営会社）"
          title="30分のオンライン説明を申し込む"
          lead="店舗数と、店内モニターのある店舗のおおよその数をお書きいただけると、ご案内が早くなります。1営業日以内に担当（代表・湯本）よりご連絡します。"
        />
      </main>
      <Footer />
    </>
  );
}
