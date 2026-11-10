import type { Metadata } from "next";
import { ArrowRight, MonitorPlay, Users, Sparkles, Clapperboard, Share2, Check, Building2 } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "事業一覧｜コインランドリー・個室トイレのサイネージ広告、採用支援、集客パッケージ",
  description:
    "DigiRep（デジレップ）の事業一覧。全国約400店のコインランドリーと飲食店の個室トイレのサイネージ広告事業、中小企業向けの採用支援（採用の顔・新卒ダイレクト）、コインランドリー運営会社との配信提携、助成金を使った店舗向け集客パッケージ、動画・LP制作をご案内します。",
  alternates: { canonical: "/service" },
};

const services = [
  {
    icon: MonitorPlay,
    eyebrow: "Signage Advertising ｜ 主力事業",
    title: "サイネージ広告事業",
    lead: "生活導線の“待ち時間”に出す、確実に見られるサイネージ広告メディア。主力は全国約400店のコインランドリー店内TV「BlueSky LAUNDRY TV」です。",
    items: [
      { h: "コインランドリーサイネージ（BlueSky LAUNDRY TV）", b: "商業施設併設のコインランドリー全国約400店・55インチ・音声つき。利用者の約7割が女性・30〜50代。洗濯・乾燥の待ち時間に、同じ人へ来店のたびに届きます。1店舗 月8,800円〜（10店から）。掲載枠は店舗ごとに最大6社・先着順。" },
      { h: "個室トイレサイネージ", b: "飲食店の個室トイレに設置。1対1・音あり・視認率90%で、比較検討・デリケート商材を“濃く”届けます。基本料金 月5,000円〜＋成果報酬。設置店舗から順次ご案内します。" },
    ],
    points: ["配信店舗数・配信回数は配信ログで実測し、月次レポート", "動画がなくても、静止画＋音声からスタートできる", "エリア指定も全国一斉も。2ヶ月・3ヶ月の継続割引あり"],
    ctaLabel: "媒体資料・料金を見る",
    ctaHref: "/media/laundry",
    tone: "primary",
  },
  {
    icon: Users,
    eyebrow: "Recruitment Support ｜ 採用支援事業",
    title: "採用支援事業（採用の顔・新卒ダイレクト）",
    lead: "「求人を出しても応募が来ない」中小企業のために。応募したくなる“採用の顔”をつくる制作物と、入社人数の保証つきの新卒採用をご用意しています。",
    items: [
      { h: "採用の顔", b: "採用サイト・会社紹介・求人票・社員インタビュー・動画など、応募者が最初に見る6つの制作物を、業種と会社の強みに合わせて設計・制作します。" },
      { h: "新卒ダイレクト", b: "学生プールから御社に合う学生へ直接アプローチ。入社人数の保証つきで、届かなければ達成まで無料で延長します。" },
      { h: "かんたん採用スター診断", b: "3分の質問で、御社の採用の“中身”と“見え方”を7領域で診断。打ち手とおすすめをその場で表示します。" },
    ],
    points: ["専用サイト saiyo.digirep.work で料金・制作イメージを公開", "診断→30分の相談→制作、の順で進みます", "サイネージ広告（求人動画）との組み合わせも可能"],
    ctaLabel: "採用支援サイトを見る",
    ctaHref: "https://saiyo.digirep.work/",
    tone: "primary",
  },
  {
    icon: Building2,
    eyebrow: "Partnership ｜ コインランドリー運営会社さまへ",
    title: "店内モニターの広告媒体化（配信提携）",
    lead: "コインランドリーを運営する企業さま・多店舗オーナーさまの店内モニターを、広告媒体として一緒に運営します。",
    items: [
      { h: "既設モニターを活用", b: "店内にすでにあるモニターに、当社が配信用の小型端末を無償で取り付けます。配信・保守・月次レポートも当社が行います。" },
      { h: "広告の販売は当社", b: "広告は当社と提携する広告代理店が販売。御社に営業の手間はなく、広告掲載料の一部を毎月お支払いします。空き枠は御社の告知に無料でお使いいただけます。" },
      { h: "掲載基準と判断権", b: "消費者金融・ギャンブル・出会い系などは掲載しません。御社にも掲載可否の判断権があります。" },
    ],
    points: ["店内モニターのある店舗が対象", "数店舗でのテストから始められる", "初回2年・以後1年更新・3か月前通知で解約可"],
    ctaLabel: "配信提携のご案内を見る",
    ctaHref: "/laundry-partner",
    tone: "default",
  },
  {
    icon: Sparkles,
    eyebrow: "Training × Promotion Package ｜ 飲食店・サロン向け",
    title: "助成金で集客パッケージ（店舗様向け・PR配信店）",
    lead: "SNS×AI内製化研修・PR動画・インフルエンサー・LP・トイレサイネージ配信をひとつに。研修費の75%は国の助成金。さらに記事掲載・交流会へのご協力の対価として2つの協力金をお支払いし、交流会を1回開催いただいた場合は結果として手出しが残らない形になります。",
    items: [
      { h: "SNS×AI 内製化研修（Per-Fact）", b: "3講座30時間・オンライン。動画・SNS・生成AIを自分たちで回せる社員が育ちます。人材開発支援助成金の対象。" },
      { h: "PR動画・インフルエンサー来店投稿（HolyTech）", b: "御社の魅力を動画に。グルメ・美容系インフルエンサーが来店して投稿します。" },
      { h: "トイレサイネージ配信・LP（デジレップ）", b: "御社のトイレに1面設置し、御社のPR動画を自店と加盟店ネットワークの他店で配信。LPはご成約特典。" },
    ],
    points: ["研修費の75%は国の助成金（要件を満たした場合）", "ご成約までお会いするのは2回・申請は社労士が代行", "制度は2027年3月31日までの時限措置"],
    ctaLabel: "パッケージの内容を見る",
    ctaHref: "/package",
    tone: "default",
  },
  {
    icon: Clapperboard,
    eyebrow: "Content Production",
    title: "コンテンツ制作事業",
    lead: "「素材がない」を解決。広告効果を最大化するクリエイティブをワンストップで制作します。",
    items: [
      { h: "動画・CM制作", b: "サイネージ配信用のCM動画を制作。静止画スライドから、ナレーション・ロケ撮影を伴う本格制作まで対応。" },
      { h: "LP（ランディングページ）制作", b: "広告からの受け皿となる、成果につながるLPを設計・制作します。" },
      { h: "パンフレット制作", b: "営業・提案に使う紙・PDFの販促物を制作します。" },
    ],
    points: ["広告・配信と一貫した設計", "素材が無くても“伝わる”表現に", "業種・ターゲットに合わせて最適化"],
    ctaLabel: "制作について相談する",
    ctaHref: "/#request",
    tone: "default",
  },
  {
    icon: Share2,
    eyebrow: "SNS Management",
    title: "SNS運用事業",
    lead: "認知拡大からファン化・リード獲得まで。継続運用で“集客の資産”を育てます。",
    items: [
      { h: "Instagram 運用", b: "ビジュアル・リールで信頼とファンを構築。プロフィール設計から投稿まで。" },
      { h: "TikTok 運用", b: "ショート動画で新規リーチを最大化。実機映像を活かした拡散設計。" },
      { h: "X（旧Twitter）運用", b: "拡散性と即時性を活かし、BtoB・キャンペーン告知に。" },
    ],
    points: ["投稿制作・カレンダー設計を代行", "自動DM等で反応をリード化", "GA連携で流入・問い合わせを可視化"],
    ctaLabel: "SNS運用を相談する",
    ctaHref: "/#request",
    tone: "default",
  },
];

export default function ServicePage() {
  return (
    <>
      <Header />
      <main className="bg-paper">
        {/* ヒーロー */}
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-sky-300 uppercase">
              Our Business
            </p>
            <h1 className="mt-3 text-[2rem] font-bold leading-[1.4] sm:text-4xl sm:leading-[1.3]">
              事業一覧
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.9] text-white/75">
              DigiRep（デジレップ）は、全国約400店のコインランドリーを中心とした
              <strong className="text-white">「確実に見られる広告メディア」</strong>と、
              中小企業の<strong className="text-white">「採用支援」</strong>を軸に、集客と採用に必要な媒体・制作・運用をワンストップで提供します。
            </p>
          </div>
        </section>

        {/* 事業カード */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className={
                  s.tone === "primary"
                    ? "overflow-hidden rounded-3xl border-2 border-brand/40 bg-card shadow-md"
                    : "overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
                }
              >
                <div className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[1fr_1.3fr]">
                  <div>
                    <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
                      <s.icon className="size-6" />
                    </span>
                    <p className="mt-4 font-display text-xs font-bold tracking-[0.14em] text-brand uppercase">
                      {s.eyebrow}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-ink sm:text-2xl">{s.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.lead}</p>
                    <ul className="mt-5 space-y-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-2 text-sm text-ink-soft">
                          <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={s.ctaHref}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
                    >
                      {s.ctaLabel}
                      <ArrowRight className="size-4" />
                    </a>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-1">
                    {s.items.map((it) => (
                      <div key={it.h} className="rounded-2xl border border-border bg-paper p-5">
                        <h3 className="text-[15px] font-bold text-ink">{it.h}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{it.b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* まとめCTA */}
          <div className="mt-12 rounded-3xl border border-border bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-bold text-ink sm:text-2xl">まずは無料でご相談ください</h2>
            <p className="mt-2 text-sm text-ink-soft">
              「どの事業が自社に合うか分からない」段階でも大歓迎です。1営業日以内に担当よりご連絡します。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/#request" className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
                無料で相談する
                <ArrowRight className="size-4" />
              </a>
              <a href="/#docs" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand">
                媒体資料をダウンロード
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{company.name}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
