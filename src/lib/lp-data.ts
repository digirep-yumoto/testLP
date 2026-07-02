import { ShieldCheck, Eye, QrCode, Users, Repeat, Target, type LucideIcon } from "lucide-react";
import type { MediaKey } from "./site-data";

export type LpConfig = {
  slug: string;
  media: MediaKey;
  badge: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  h1: { pre: string; highlight: string; post: string };
  heroSub: string;
  chips: string[];
  painsTitle: string;
  pains: string[];
  reasonsTitle: string;
  reasons: { icon: LucideIcon; title: string; body: string }[];
  steps: string[];
  formPurpose: string;
  formMedia: string;
  source: string;
};

export const lps: LpConfig[] = [
  {
    slug: "clinic",
    media: "toilet",
    badge: "美容クリニック・脱毛・AGA 向け",
    metaTitle: "美容クリニック・脱毛の集客に｜個室トイレサイネージ広告",
    metaDesc:
      "美容クリニック・脱毛・AGAの新規カウンセリング獲得に。完全個室・1対1・視認率90%の個室トイレサイネージ広告。QRで予約まで計測でき、単店・短期から始められます。",
    keywords: ["美容クリニック 集客", "脱毛 集客", "AGA 広告", "クリニック 広告"],
    h1: { pre: "人に相談しづらい商材ほど、", highlight: "“完全個室”", post: "で選ばれる。" },
    heroSub:
      "飲食店の個室トイレに設置したサイネージ広告。1対1・音あり・視認率90%で、新規カウンセリング獲得に効く新しい集客手法です。QRで予約まで計測でき、単店・短期から始められます。",
    chips: ["視認率90%", "QRで予約計測", "単店・短期からOK", "動画制作込み"],
    painsTitle: "こんな集客のお悩みはありませんか？",
    pains: [
      "リスティング広告のクリック単価が高騰し、新規獲得コストが合わない",
      "SNS広告は流し見されやすく、デリケートな商材は表示制限もある",
      "「人に相談しづらい」商材を、じっくり検討してもらえる接点が少ない",
    ],
    reasonsTitle: "個室トイレ広告が“クリニック集客”に効く理由",
    reasons: [
      { icon: ShieldCheck, title: "完全個室・1対1", body: "誰にも見られない空間だから、脱毛・AGA・美容医療などコンプレックス商材でも心理的ハードルが低い。" },
      { icon: Eye, title: "視認率90%・音あり", body: "平均約60秒の“逃げ場のない”視聴環境。ブランドと特徴をしっかり伝えられます（当社データ）。" },
      { icon: QrCode, title: "QRで予約まで計測", body: "視聴→アクセス→無料カウンセリング予約/LINE登録まで数値化。CPA（獲得単価）を検証できます。" },
    ],
    steps: [
      "商圏に合わせた配信プラン・概算のご提案",
      "広告動画の制作（素材がなくてもOK）",
      "単店・短期で配信スタート",
      "効果レポート（視認・QR反応）で判断・拡大",
    ],
    formPurpose: "資料請求・相談（美容クリニックLP）",
    formMedia: "個室トイレサイネージ",
    source: "lp-clinic",
  },
  {
    slug: "laundry-maker",
    media: "laundry",
    badge: "食品・日用品・化粧品メーカー 向け",
    metaTitle: "全国の主婦層に届く｜コインランドリー サイネージ広告（メーカー向け）",
    metaDesc:
      "30〜50代女性に全国で高頻度リーチ。コインランドリーのサイネージ広告で、新商品告知・ブランディング・サンプリング連動。視聴者の約67%が女性、全国383店の統一ネットワーク。",
    keywords: ["コインランドリー 広告", "主婦 広告", "新商品 広告", "サイネージ 女性"],
    h1: { pre: "30〜50代女性に、", highlight: "全国で“繰り返し”", post: "届く。" },
    heroSub:
      "全国のコインランドリーに設置したサイネージ広告。視聴者の約67%が女性・30〜50代。待ち時間に高頻度で接触し、新商品告知・ブランディング・サンプリング連動に効きます。",
    chips: ["女性67%・30-50代", "全国383店", "高頻度リーチ", "配信レポート"],
    painsTitle: "こんな課題はありませんか？",
    pains: [
      "テレビCMは高額で、ターゲット外にも配信され費用対効果が読みにくい",
      "SNS/Web広告は情報過多で埋もれ、主婦層に“繰り返し”届きにくい",
      "新商品の認知を、購買層に絞って面で広げたい",
    ],
    reasonsTitle: "コインランドリー広告が“メーカー”に効く理由",
    reasons: [
      { icon: Users, title: "視聴者の約67%が女性・30〜50代", body: "家庭の購買を決める層に、生活動線で自然に接触。食品・日用品・化粧品と好相性（当社データ）。" },
      { icon: Repeat, title: "待ち時間に“高頻度・反復”", body: "乾燥待ちの十数分、同じ利用者が毎週訪れ、繰り返し接触＝記憶に残る刷り込み。" },
      { icon: Target, title: "全国383店の統一ネットワーク", body: "エリアも全国も選んで配信。店頭サンプリングや購買喚起との連動も可能。" },
    ],
    steps: [
      "商品・ターゲットに合わせた全国/エリア配信プランのご提案",
      "動画（CM）制作（既存素材の活用も可）",
      "配信スタート",
      "配信レポートで効果を確認・拡大",
    ],
    formPurpose: "資料請求・相談（メーカー×ランドリーLP）",
    formMedia: "コインランドリーサイネージ",
    source: "lp-laundry-maker",
  },
  {
    slug: "matching",
    media: "toilet",
    badge: "マッチングアプリ・出会い系 向け",
    metaTitle: "アプリDLを“1人の時間”に｜個室トイレサイネージ広告（マッチング向け）",
    metaDesc:
      "完全個室・1対1・音あり・視認率90%。人前では登録しづらいマッチングアプリも、プライベートな空間ならQRから即インストール。CPIを数値で検証できます。",
    keywords: ["マッチングアプリ 広告", "アプリ ダウンロード 広告", "出会い系 広告", "CPI 広告"],
    h1: { pre: "アプリのDLは、", highlight: "“1人の時間”", post: "に届く。" },
    heroSub:
      "完全個室のトイレサイネージは、1対1・音あり・視認率90%。人前では登録しづらいアプリも、プライベートな空間ならQRから即インストールへ。反応も数値で見えます。",
    chips: ["完全個室で心理ハードル低", "QRで即DL計測", "視認率90%", "単店・短期からOK"],
    painsTitle: "こんな課題はありませんか？",
    pains: [
      "CPI（インストール単価）が高騰し、Web/SNS広告だけでは伸ばしづらい",
      "人前だと登録・DLの心理的ハードルが高い",
      "ダウンロードの“質”や実数を計測したい",
    ],
    reasonsTitle: "個室トイレ広告が“アプリDL”に効く理由",
    reasons: [
      { icon: ShieldCheck, title: "完全プライベート空間", body: "1人でスマホを見る瞬間だから、登録・DLの心理的ハードルが下がる。" },
      { icon: QrCode, title: "QRで即インストール＆計測", body: "視聴→DLをその場で。反応が数値で見えるのでCPIを検証できる。" },
      { icon: Eye, title: "視認率90%・音あり", body: "平均約60秒の逃げ場のない視聴で、アプリの魅力をしっかり訴求。" },
    ],
    steps: [
      "配信エリア・プランのご提案",
      "広告動画の制作（素材がなくてもOK）",
      "単店・短期で配信スタート",
      "QRレポート（DL反応）で判断・拡大",
    ],
    formPurpose: "資料請求・相談（マッチングLP）",
    formMedia: "個室トイレサイネージ",
    source: "lp-matching",
  },
  {
    slug: "recruit",
    media: "toilet",
    badge: "採用・求人（新卒・中途・アルバイト）向け",
    metaTitle: "応募を“1人でじっくり”見る場所に｜個室トイレサイネージ求人広告",
    metaDesc:
      "個室トイレは、求職者が1人でスマホを見る場所。求人情報の熟読と相性がよく、平均約60秒＋QRで応募ページへ誘導。求人媒体とは違う母集団形成が可能です。",
    keywords: ["採用 広告", "求人 応募 増やす", "中途採用 集客", "アルバイト 募集"],
    h1: { pre: "応募は、求職者が", highlight: "“1人でじっくり”", post: "見る場所に。" },
    heroSub:
      "個室トイレは、求職者が1人でスマホを見る場所。求人情報の熟読と相性がよく、平均約60秒＋QRで応募ページへ誘導できます。求人媒体とは違う母集団形成が可能です。",
    chips: ["熟読環境", "QR応募導線", "視認率90%", "エリア指定OK"],
    painsTitle: "こんな採用のお悩みはありませんか？",
    pains: [
      "求人媒体の掲載費が高く、応募単価が上がっている",
      "媒体依存で、同じ求職者の取り合いになっている",
      "認知の薄い自社を、地域でじっくり知ってもらいたい",
    ],
    reasonsTitle: "個室トイレ広告が“採用”に効く理由",
    reasons: [
      { icon: Eye, title: "“1人でじっくり”読む環境", body: "個室は熟読との相性が良く、求人情報がしっかり伝わる。" },
      { icon: QrCode, title: "QRで応募ページへ直結", body: "視聴→応募をその場で誘導。反応を数値で計測できる。" },
      { icon: Target, title: "エリアを絞って母集団形成", body: "出店・採用したい地域に集中配信。媒体とは別の入口に。" },
    ],
    steps: [
      "採用エリアに合わせた配信プランのご提案",
      "広告動画の制作（素材がなくてもOK）",
      "配信スタート",
      "応募QRレポートで判断・拡大",
    ],
    formPurpose: "資料請求・相談（採用LP）",
    formMedia: "個室トイレサイネージ",
    source: "lp-recruit",
  },
];

export function getLp(slug: string): LpConfig | undefined {
  return lps.find((l) => l.slug === slug);
}
