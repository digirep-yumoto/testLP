// =====================================================================
// サーバー権威の料金計算（価格改ざん防止の要）
// クライアントから送られた「合計金額」は一切信用せず、
// 構造化された注文内容（媒体・プラン・尺・店舗数・期間）から
// このモジュールが金額を再計算する。出典: 各広告主資料 / 申込フォームv6。
// =====================================================================

export const TAX_RATE = 0.1; // 消費税10%

const TERM_DISCOUNT: Record<number, number> = { 1: 0, 2: 0.05, 3: 0.1 };

// --- 個室トイレ：来店規模に応じた固定月額ティア（1店・税別） -----------
const TOILET_TIERS = [
  { key: "S", max: 1500, price: 30000 },
  { key: "M", max: 2500, price: 30000 },
  { key: "L", max: 3500, price: 41000 },
  { key: "XL", max: Infinity, price: 54600 },
] as const;

function toiletTier(visitors: number) {
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
        description: `個室トイレサイネージ ${tier.key}プラン × ${stores}店 × ${months}ヶ月`,
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
    // 全店合計は万円単位に切り上げ（広告主請求ベース）
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
