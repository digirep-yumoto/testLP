// =====================================================================
// 無料サイネージ広告シミュレーター ロジック（サーバー／クライアント共用）
//
// 金額は既存の computePrice（src/lib/pricing.ts）をそのまま利用する。
// ＝ 料金ロジックの真実源は pricing.ts のまま。ここでは触らない。
//
// リーチ・接触回数の係数はすべて site-data.ts / 広告主資料の公開数値に準拠。
// 数値を変更する際は必ず原資料と突き合わせること。
// =====================================================================

import { computePrice, type Order } from "./pricing";

// --- 出典つき係数 -----------------------------------------------------
/** トイレ利用率（自社調査 n=1,000）— site-data toilet.pricingNote */
export const TOILET_USE_RATE = 0.7;
/** 個室利用率 78.3%（自社調査 n=1,000）— site-data toilet.stats */
export const TOILET_BOOTH_RATE = 0.78;
/** 視認率 90%（個室・強制視聴）— site-data toilet.stats / proof */
export const TOILET_VIEW_RATE = 0.9;

/** ランドリー全店（383店）の想定リーチ 約34万人/月 — site-data laundry.stats */
export const LAUNDRY_TOTAL_STORES = 383;
export const LAUNDRY_TOTAL_REACH = 340_000;
/** 1店あたりの月間来店者（＝想定リーチ）約888人 */
export const LAUNDRY_REACH_PER_STORE = Math.round(LAUNDRY_TOTAL_REACH / LAUNDRY_TOTAL_STORES);
/** 1回の来店での想定接触 約7回（4分ロールの反復再生）— site-data laundry.stats */
export const LAUNDRY_CONTACTS_PER_VISIT = 7;

export type SimMedia = "toilet" | "laundry";
export type Objective = "awareness" | "acquisition" | "recruit";

export const objectives: { id: Objective; label: string; hint: string }[] = [
  { id: "acquisition", label: "見込み客の獲得（問い合わせ・予約）", hint: "QRからの行動導線を重視" },
  { id: "awareness", label: "認知拡大・ブランディング", hint: "反復接触の量を重視" },
  { id: "recruit", label: "採用・求人の応募獲得", hint: "働き手と重なる導線を重視" },
];

// --- 業種 → 推奨媒体の診断 --------------------------------------------
// 推奨根拠は site-data の targets / diff / ng に準拠。
export type Industry = {
  id: string;
  label: string;
  rec: SimMedia;
  why: string;
  /** 媒体側の掲載基準で、もう一方が対象外になる場合の注記 */
  note?: string;
};

export const industries: Industry[] = [
  {
    id: "aga",
    label: "AGA・育毛・メンズ美容",
    rec: "toilet",
    why: "人前で検索・相談しづらい商材。1対1の個室で、じっくり検討される数分間に届きます。",
    note: "コインランドリーは女性・ファミリー層が接する公共空間のため、コンプレックス系商材は掲載対象外です。",
  },
  {
    id: "beauty",
    label: "美容医療・クリニック・脱毛",
    rec: "toilet",
    why: "デリケートな悩みほど、周囲の目がない個室が効きます。QRでそのまま無料カウンセリング予約へ。",
    note: "コインランドリーは美容整形・エステ等のコンプレックス系が掲載対象外です。",
  },
  {
    id: "matching",
    label: "マッチング・婚活",
    rec: "toilet",
    why: "1対1・音ありの閉鎖空間。人には見せづらいアプリDLも、その場で完結できます。",
    note: "コインランドリーは出会い系が掲載対象外です。",
  },
  {
    id: "recruit",
    label: "採用・人材・求人",
    rec: "toilet",
    why: "飲食店の来店者はそのまま採用候補層。求人動画＋QRで応募導線をつくれます。",
  },
  {
    id: "law",
    label: "法律・債務整理・士業",
    rec: "toilet",
    why: "誰にも相談しづらい悩みの商材。周囲に人がいない環境でこそ、相談窓口が届きます。",
  },
  {
    id: "school",
    label: "スクール・資格・自己投資",
    rec: "toilet",
    why: "比較検討に時間がかかる高単価商材。長時間の集中接触で、検討のきっかけをつくれます。",
  },
  {
    id: "cosme",
    label: "化粧品・コスメ・サプリ",
    rec: "laundry",
    why: "女性約70%・30〜50代中心の同一属性へ、来店のたびに高頻度で接触。指名買いにつながります。",
  },
  {
    id: "fmcg",
    label: "日用品・消費財・食品飲料",
    rec: "laundry",
    why: "商業施設併設で「買い物ついで」の導線。購買直前に大画面＋音声で刷り込めます。",
  },
  {
    id: "drug",
    label: "ドラッグストア・スーパー・小売",
    rec: "laundry",
    why: "同じ商圏の同じ人へ何度も。エリアを絞った来店促進と好相性です。",
  },
  {
    id: "house",
    label: "住宅・リフォーム・不動産",
    rec: "laundry",
    why: "検討期間の長い商材。生活導線で繰り返し会うことで、想起されるブランドになります。",
  },
  {
    id: "insurance",
    label: "保険・金融サービス",
    rec: "laundry",
    why: "30〜50代ファミリー層が中心。ライフイベントに近い層へ、待ち時間にじっくり届きます。",
  },
  {
    id: "education",
    label: "学習塾・習い事・教育",
    rec: "laundry",
    why: "エリアを絞って、子育て世帯へ高頻度で。地域密着の集客に向きます。",
  },
  {
    id: "local",
    label: "地域サービス・店舗集客",
    rec: "laundry",
    why: "商圏の生活者に、来店のたびに反復接触。小さく始めて効果を確かめられます。",
  },
  {
    id: "other",
    label: "その他・まだ決まっていない",
    rec: "toilet",
    why: "「質（個室トイレ）」と「量・頻度（ランドリー）」の両方を試算して比べてみてください。",
  },
];

// --- 入力・結果の型 ---------------------------------------------------
export type SimInput = {
  media: SimMedia;
  months: 1 | 2 | 3;
  /** 個室トイレ */
  stores: number;
  visitors: number;
  /** コインランドリー */
  pkg: "spot" | "area" | "national";
  sec: "15" | "30";
  laundryStores: number;
};

export type SimResult = {
  ok: true;
  media: SimMedia;
  months: number;
  /** 月あたりの想定リーチ（ユニークに近い到達人数） */
  reachPerMonth: number;
  /** 月あたりの想定接触回数（延べ） */
  contactsPerMonth: number;
  /** 掲載期間合計の想定接触回数（延べ） */
  contactsTotal: number;
  monthlyExclTax: number;
  subtotalExclTax: number;
  totalInclTax: number;
  /** 1,000接触あたりの単価（税別） */
  cpm: number;
  /** 1接触あたりの単価（税別） */
  cpc: number;
  /** 計算式の内訳（透明性のため画面に出す） */
  formula: { label: string; value: string }[];
  description: string;
};

export type SimOutcome = SimResult | { ok: false; error: string };

export const defaultInput: SimInput = {
  media: "toilet",
  months: 1,
  stores: 10,
  visitors: 2500,
  pkg: "area",
  sec: "15",
  laundryStores: 50,
};

export const laundryPackages = [
  { id: "spot" as const, label: "スポットパック", note: "店舗指定・最小10店〜（お試し）", min: 10 },
  { id: "area" as const, label: "エリアパック", note: "エリア内の全店をまとめ買い（人気）", min: 1 },
  { id: "national" as const, label: "全国一括パック", note: `全${LAUNDRY_TOTAL_STORES}店を一括配信（基準）`, min: 1 },
];

const yen = (n: number) => `¥${Math.round(n).toLocaleString("ja-JP")}`;
const num = (n: number) => Math.round(n).toLocaleString("ja-JP");

/**
 * 入力から「想定リーチ・接触回数・概算費用・CPM」を算出する。
 * 金額は computePrice（サーバー権威ロジック）と同一。
 */
export function simulate(input: SimInput): SimOutcome {
  const months = input.months;

  if (input.media === "toilet") {
    const stores = Math.max(1, Math.floor(input.stores || 0));
    const visitors = Math.max(0, Math.floor(input.visitors || 0));
    const order: Order = { media: "toilet", stores, visitors, months };
    const priced = computePrice(order);
    if (!priced.ok) return { ok: false, error: priced.error };

    // 視聴機会＝来客数 × トイレ利用率70% × 個室利用率78%
    const viewsPerStore = visitors * TOILET_USE_RATE * TOILET_BOOTH_RATE;
    const reachPerMonth = Math.round(viewsPerStore * stores);
    // 視認率90%を掛けた「実際に見られた回数」を接触回数とする
    const contactsPerMonth = Math.round(reachPerMonth * TOILET_VIEW_RATE);
    const contactsTotal = contactsPerMonth * months;
    const p = priced.price;

    return {
      ok: true,
      media: "toilet",
      months,
      reachPerMonth,
      contactsPerMonth,
      contactsTotal,
      monthlyExclTax: p.monthlyExclTax,
      subtotalExclTax: p.subtotalExclTax,
      totalInclTax: p.totalInclTax,
      cpm: contactsTotal > 0 ? Math.round((p.subtotalExclTax / contactsTotal) * 1000) : 0,
      cpc: contactsTotal > 0 ? Math.round((p.subtotalExclTax / contactsTotal) * 10) / 10 : 0,
      formula: [
        { label: "月間来客数（1店）", value: `${num(visitors)} 人` },
        { label: "× トイレ利用率", value: `${TOILET_USE_RATE * 100}%` },
        { label: "× 個室利用率（n=1,000）", value: `${TOILET_BOOTH_RATE * 100}%` },
        { label: "× 配信店舗数", value: `${num(stores)} 店` },
        { label: "＝ 月間の想定視聴機会", value: `${num(reachPerMonth)} 回` },
        { label: "× 視認率（個室・強制視聴）", value: `${TOILET_VIEW_RATE * 100}%` },
        { label: "＝ 月間の想定視認回数", value: `${num(contactsPerMonth)} 回` },
      ],
      description: p.description,
    };
  }

  // --- コインランドリー ---
  const stores =
    input.pkg === "national"
      ? LAUNDRY_TOTAL_STORES
      : Math.max(1, Math.floor(input.laundryStores || 0));
  const order: Order = { media: "laundry", pkg: input.pkg, sec: input.sec, stores, months };
  const priced = computePrice(order);
  if (!priced.ok) return { ok: false, error: priced.error };

  const reachPerMonth = Math.round(LAUNDRY_REACH_PER_STORE * stores);
  const contactsPerMonth = reachPerMonth * LAUNDRY_CONTACTS_PER_VISIT;
  const contactsTotal = contactsPerMonth * months;
  const p = priced.price;

  return {
    ok: true,
    media: "laundry",
    months,
    reachPerMonth,
    contactsPerMonth,
    contactsTotal,
    monthlyExclTax: p.monthlyExclTax,
    subtotalExclTax: p.subtotalExclTax,
    totalInclTax: p.totalInclTax,
    cpm: contactsTotal > 0 ? Math.round((p.subtotalExclTax / contactsTotal) * 1000) : 0,
    cpc: contactsTotal > 0 ? Math.round((p.subtotalExclTax / contactsTotal) * 10) / 10 : 0,
    formula: [
      { label: "1店あたりの月間来店者", value: `約 ${num(LAUNDRY_REACH_PER_STORE)} 人` },
      { label: "× 配信店舗数", value: `${num(stores)} 店` },
      { label: "＝ 月間の想定リーチ", value: `${num(reachPerMonth)} 人` },
      { label: "× 1来店あたりの想定接触", value: `約 ${LAUNDRY_CONTACTS_PER_VISIT} 回` },
      { label: "＝ 月間の想定接触回数", value: `${num(contactsPerMonth)} 回` },
    ],
    description: p.description,
  };
}

/** 結果を問い合わせメール／クリップボード用のプレーンテキストにする */
export function resultToText(input: SimInput, r: SimResult, industryLabel: string, objectiveLabel: string) {
  const mediaName = r.media === "toilet" ? "個室トイレサイネージ" : "コインランドリーサイネージ";
  const scale =
    r.media === "toilet"
      ? `${num(input.stores)}店 / 月間来客 ${num(input.visitors)}人・店`
      : `${laundryPackages.find((p) => p.id === input.pkg)?.label} ${input.sec}秒 / ${num(
          input.pkg === "national" ? LAUNDRY_TOTAL_STORES : input.laundryStores,
        )}店`;
  return [
    "【無料シミュレーション結果】",
    `業種: ${industryLabel}`,
    `目的: ${objectiveLabel}`,
    `媒体: ${mediaName}`,
    `規模: ${scale}`,
    `掲載期間: ${r.months}ヶ月`,
    r.media === "toilet"
      ? `想定視聴機会: ${num(r.reachPerMonth)}回/月`
      : `想定リーチ: ${num(r.reachPerMonth)}人/月`,
    `想定接触回数: ${num(r.contactsPerMonth)}回/月（期間合計 ${num(r.contactsTotal)}回）`,
    `月額: ${yen(r.monthlyExclTax)}（税別）`,
    `期間合計: ${yen(r.subtotalExclTax)}（税別）／ ${yen(r.totalInclTax)}（税込）`,
    r.media === "toilet"
      ? `1視聴あたり単価: 約¥${r.cpc.toFixed(1)}（CPM ${yen(r.cpm)}）`
      : `CPM（1,000接触あたり）: ${yen(r.cpm)}`,
  ].join("\n");
}
