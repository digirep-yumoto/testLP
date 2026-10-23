// =====================================================================
// サーバー権威の料金計算（価格改ざん防止の要）
// クライアントから送られた「合計金額」は一切信用せず、
// 構造化された注文内容（媒体・プラン・尺・店舗数・期間）から
// このモジュールが金額を再計算する。出典: 各広告主資料 / 申込フォームv6。
// =====================================================================

export const TAX_RATE = 0.1; // 消費税10%

const TERM_DISCOUNT: Record<number, number> = { 1: 0, 2: 0.05, 3: 0.1 };

// --- 個室トイレ：2026-11改定・成果報酬型（1面・税別） --------------------
// 基本料金（月額）は店舗の月間来客数で決まる4段。これに成果報酬（視聴×10円／QR読み取り500円／
// 予約・問い合わせ2,000〜10,000円）が配信実績で加算される（月末締め・翌月実績請求。月額上限は広告主が設定）。
// ここで計算するのは基本料金のみ。成果報酬は実績確定後に別途請求する。
export const TOILET_MIN_VISITORS = 500; // 月間来客500人未満の店舗は媒体に載せない
export const TOILET_TIERS = [
  { key: "S", label: "Sプラン", min: 500, max: 2000, price: 5000 },
  { key: "M", label: "Mプラン", min: 2001, max: 4000, price: 7000 },
  { key: "L", label: "Lプラン", min: 4001, max: 6000, price: 9000 },
  { key: "XL", label: "XLプラン", min: 6001, max: Infinity, price: 12000 },
] as const;
export const TOILET_PERF = {
  view: 10, // 視聴1回（赤外線センサーが個室の利用を検知して再生した回数）
  qr: 500, // QR読み取り1件（店舗別・広告主別の専用QR）
  booking: [2000, 5000, 10000] as const, // 予約・問い合わせ1件（顧客単価〜1万／1万〜10万／10万〜・採用）
  maxAdvertisers: 6, // 1面あたりの最大広告主数
} as const;

export function toiletTier(visitors: number) {
  const v = Math.max(0, Math.floor(visitors) || 0);
  return TOILET_TIERS.find((t) => v <= t.max) ?? TOILET_TIERS[TOILET_TIERS.length - 1];
}

// --- コインランドリー：月額固定パッケージ（1店・税別） -----------------
const LAUNDRY_PACKAGES = {
  spot: { label: "スポットパック", unit15: 8800, unit30: 13200, minStores: 10 },
  area: { label: "エリアパック", unit15: 7600, unit30: 11300, minStores: 1 },
  national: { label: "全国一括パック", unit15: 6300, unit30: 9500, minStores: 1 },
} as const;

export type ToiletOrder = {
  media: "toilet";
  stores: number;
  visitors: number;
  months: number;
};
export type LaundryOrder = {
  media: "laundry";
  pkg: keyof typeof LAUNDRY_PACKAGES;
  sec: "15" | "30";
  stores: number;
  months: number;
};
export type Order = ToiletOrder | LaundryOrder;

export type PriceResult = {
  subtotalExclTax: number; // 掲載期間合計（税別）
  monthlyExclTax: number; // 割引後の月額（税別）
  tax: number;
  totalInclTax: number; // 請求額（税込）
  months: number;
  description: string;
};

export type PriceOutcome =
  | { ok: true; price: PriceResult }
  | { ok: false; error: string };

function roundYen(n: number) {
  return Math.round(n);
}

/**
 * 注文内容を検証し、サーバー側で金額を算出する。
 * ホテル媒体はオンライン即時決済の対象外（個別見積）。
 */
export function computePrice(input: unknown): PriceOutcome {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "注文内容が不正です。" };
  }
  const o = input as Record<string, unknown>;
  const media = o.media;
  const months = Math.floor(Number(o.months));
  if (![1, 2, 3].includes(months)) {
    return { ok: false, error: "掲載期間（months）は1〜3で指定してください。" };
  }
  const discount = TERM_DISCOUNT[months];

  if (media === "toilet") {
    const stores = Math.floor(Number(o.stores));
    const visitors = Math.floor(Number(o.visitors));
    if (!Number.isFinite(stores) || stores < 1 || stores > 100000) {
      return { ok: false, error: "配信店舗数が不正です。" };
    }
    if (!Number.isFinite(visitors) || visitors < 0 || visitors > 1000000) {
      return { ok: false, error: "月間来客数が不正です。" };
    }
    if (visitors < TOILET_MIN_VISITORS) {
      return { ok: false, error: `個室トイレ媒体は月間来客${TOILET_MIN_VISITORS}人以上の店舗が対象です。` };
    }
    const tier = toiletTier(visitors);
    const monthly0 = tier.price * stores;
    const monthly = roundYen(monthly0 * (1 - discount));
    const subtotal = monthly * months;
    const tax = roundYen(subtotal * TAX_RATE);
    return {
      ok: true,
      price: {
        subtotalExclTax: subtotal,
        monthlyExclTax: monthly,
        tax,
        totalInclTax: subtotal + tax,
        months,
        description: `個室トイレサイネージ 基本料金 ${tier.key}プラン × ${stores}面 × ${months}ヶ月（成果報酬は実績に応じて別途・翌月請求）`,
      },
    };
  }

  if (media === "laundry") {
    const pkgKey = String(o.pkg);
    if (!(pkgKey in LAUNDRY_PACKAGES)) {
      return { ok: false, error: "配信プランが不正です。" };
    }
    const pkg = LAUNDRY_PACKAGES[pkgKey as keyof typeof LAUNDRY_PACKAGES];
    const sec = String(o.sec) === "30" ? "30" : "15";
    const stores = Math.floor(Number(o.stores));
    if (!Number.isFinite(stores) || stores < pkg.minStores || stores > 100000) {
      return {
        ok: false,
        error: `配信店舗数が不正です（${pkg.label}は最小${pkg.minStores}店〜）。`,
      };
    }
    const perStore = sec === "30" ? pkg.unit30 : pkg.unit15;
    // 全店合計は万円単位に切り上げ（広告主請求ベース）。
    // ★切上げは「割引前の月額」に対して1回だけ。割引後・期間合計では切り上げない。
    //   site-data の laundry.pricingNote に載せる例は必ずこの式で検算すること。
    //   例) 全国一括15秒 383店：6,300×383＝2,412,900 →切上げ 2,420,000（1ヶ月）
    //       3ヶ月：2,420,000×0.9×3 ＝ 6,534,000
    const monthly0 = Math.ceil((perStore * stores) / 10000) * 10000;
    const monthly = roundYen(monthly0 * (1 - discount));
    const subtotal = monthly * months;
    const tax = roundYen(subtotal * TAX_RATE);
    return {
      ok: true,
      price: {
        subtotalExclTax: subtotal,
        monthlyExclTax: monthly,
        tax,
        totalInclTax: subtotal + tax,
        months,
        description: `コインランドリーサイネージ ${pkg.label} ${sec}秒 × ${stores}店 × ${months}ヶ月`,
      },
    };
  }

  return {
    ok: false,
    error:
      "この媒体はオンライン決済の対象外です（ホテル等は個別お見積り）。担当までお問い合わせください。",
  };
}
