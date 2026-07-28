import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift, Printer, ShieldCheck, Target, Wallet, Zap } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Simulator } from "@/components/tools/simulator";
import { company } from "@/lib/site-data";

const siteUrl = company.url.replace(/\/$/, "");

const title = "サイネージ広告 無料シミュレーター｜費用・想定リーチを60秒で試算";
const description =
  "業種と配信規模を選ぶだけで、サイネージ広告の想定リーチ・接触回数・広告費・CPM・想定CPAを無料で自動試算。月の予算からの逆算にも対応し、結果はPDF保存・URL共有できます。会員登録もメールアドレスも不要。個室トイレ／コインランドリーの2媒体対応。";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "サイネージ広告 費用",
    "サイネージ広告 シミュレーション",
    "デジタルサイネージ 広告費 計算",
    "広告費 CPM 計算",
    "トイレ広告 費用",
    "コインランドリー 広告",
  ],
  alternates: { canonical: "/simulator" },
  openGraph: {
    type: "website",
    title,
    description,
    url: `${siteUrl}/simulator`,
    siteName: company.brand,
    locale: "ja_JP",
  },
};

const merits = [
  {
    icon: Gift,
    title: "完全無料・登録不要",
    body: "会員登録もメールアドレスの入力も不要。その場ですぐに結果が表示されます。",
  },
  {
    icon: Wallet,
    title: "予算からの逆算もできる",
    body: "「月30万円ならどこまで？」も、規模からの試算も両方対応。3つの始め方も自動でご提案します。",
  },
  {
    icon: Target,
    title: "CPAまで逆算できる",
    body: "反応率・CV率を御社の実績値に置き換えて、想定獲得単価まで試算。稟議の資料にそのまま使えます。",
  },
  {
    icon: Printer,
    title: "PDF保存・URLで社内共有",
    body: "結果をそのまま印刷・PDF化。URLで条件ごと共有できるので、決裁者への説明もワンクリックです。",
  },
  {
    icon: Zap,
    title: "60秒で概算がわかる",
    body: "業種・規模・期間を選ぶだけ。営業に問い合わせる前に、社内検討用の数字が手に入ります。",
  },
  {
    icon: ShieldCheck,
    title: "公開料金と実データで試算",
    body: "料金は公開料金表、リーチは自社調査（n=1,000）と媒体資料の実数値をもとに計算します。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "サイネージ広告 無料シミュレーター",
      url: `${siteUrl}/simulator`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description,
      inLanguage: "ja",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      publisher: { "@type": "Organization", name: company.name, url: siteUrl },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "無料シミュレーター", item: `${siteUrl}/simulator` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "シミュレーターの利用に費用はかかりますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "無料です。会員登録もメールアドレスの入力も不要で、その場で結果をご覧いただけます。ご相談いただく場合のみ、任意で連絡先をご入力ください。",
          },
        },
        {
          "@type": "Question",
          name: "試算した金額のまま契約になりますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "いいえ。表示される金額は公開料金表に基づく概算です。動画制作などの付帯費用は含まず、配信エリアや店舗の空き状況によって変動します。正式なお見積りは担当よりご案内します。",
          },
        },
        {
          "@type": "Question",
          name: "想定CPA（獲得単価）はどう計算していますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "「想定接触回数 × 反応率 × CV率」で想定獲得数を出し、広告費を割って算出しています。反応率・CV率は画面上で変更できる仮置きの値で、当社の実績値ではありません。御社の実績値に置き換えてご利用ください。表示される数値は成果を保証するものではありません。",
          },
        },
        {
          "@type": "Question",
          name: "予算から逆算することもできますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "できます。「予算から逆算」に切り替えて月あたりのご予算を入力すると、その予算内で配信できる最大の店舗数と、その場合の想定リーチ・接触回数を自動で計算します。",
          },
        },
        {
          "@type": "Question",
          name: "想定リーチや接触回数はどう計算していますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "個室トイレは「来客数×トイレ利用率70%×個室利用率78%×視認率90%」、コインランドリーは「1店あたりの月間来店者数×店舗数×1来店あたりの想定接触回数（約7回）」で算出しています。いずれも自社調査（n=1,000）および媒体資料の数値に基づく想定値です。",
          },
        },
      ],
    },
  ],
};

export default function SimulatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <section className="bg-paper pt-24 pb-10 sm:pt-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-brand">ホーム</Link>
              <span>/</span>
              <span className="text-ink-soft">無料シミュレーター</span>
            </nav>

            <div className="mt-6 max-w-3xl">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                <Gift className="size-3.5" />
                無料ツール・登録不要
              </p>
              <h1 className="mt-4 text-balance text-[2rem] font-bold leading-[1.35] tracking-[-0.01em] text-ink sm:text-[2.75rem] sm:leading-[1.25]">
                サイネージ広告、
                <br className="hidden sm:block" />
                いくらで、何人に届く？
              </h1>
              <p className="mt-4 text-pretty text-base leading-[1.95] text-ink-soft sm:text-lg">
                業種と配信規模を選ぶだけ。想定リーチ・接触回数・広告費・CPMを、その場で自動試算します。
                問い合わせの前に、社内検討に使える数字をどうぞ。
              </p>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {merits.map((m) => (
                <li key={m.title} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <m.icon className="size-5 text-brand" />
                  <p className="mt-2 text-sm font-bold text-ink">{m.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{m.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-paper pb-20 sm:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Simulator />
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-xl font-bold text-ink sm:text-2xl">このツールについて</h2>
            <dl className="mt-6 grid gap-5">
              <div>
                <dt className="text-sm font-bold text-ink">数字の根拠</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                  料金は当社の公開料金表（継続割引を含む）、リーチ・接触回数は自社調査（n=1,000）および各媒体の広告主向け資料の実数値をもとに算出しています。表示されるのはいずれも想定値であり、成果を保証するものではありません。
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-ink">含まれない費用</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                  動画（CM素材）制作・LP制作・サンプリング等の付帯費用は含みません。これらもワンストップで承っていますので、必要な場合はご相談ください。
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-ink">掲載できない広告について</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                  媒体の公共性に応じた審査基準があります。消費者金融・ギャンブル・出会い系・風俗等はお断りしており、コンプレックス系商材は媒体ごとに可否が異なります。詳しくは
                  <Link href="/#faq" className="text-brand hover:underline">よくあるご質問</Link>
                  をご覧ください。
                </dd>
              </div>
            </dl>

            <div className="mt-10 rounded-3xl border border-border bg-paper p-7 text-center">
              <p className="text-lg font-bold text-ink">もっと具体的に検討したい方へ</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                商圏・ターゲットに合わせた配信イメージ、効果レポートの実例もあわせてご案内します。
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link
                  href="/#request"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
                >
                  無料相談・お問い合わせ
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/#docs"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  媒体資料をダウンロード
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
