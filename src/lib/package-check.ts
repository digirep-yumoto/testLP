// 適用診断（セルフ版）の設問と判定ロジック。1回目のミーティングで確認する10項目と同じ内容を、店舗側が先に答えられるようにしたもの
import { plans } from "./package-data";

export type Answer = "yes" | "no" | "unknown";
export type Q = { id: string; label: string; help: string; critical?: boolean };

export const basics = {
  staff: { label: "雇用保険に入っている従業員の人数", help: "週20時間以上勤務の方。役員・役員のご家族は数えません", options: ["0〜2名", "3〜4名", "5〜6名", "7〜9名", "10名以上"] },
  sales: { label: "直近の年商（おおよそ）", help: "判定には使いません。プランのご提案の参考にします", options: ["〜3,000万円", "3,000万〜1億円", "1億〜3億円", "3億円以上", "わからない"] },
  closing: { label: "決算月", help: "計画届の提出時期を逆算するために使います", options: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "わからない"] },
  stores: { label: "店舗数", help: "", options: ["1店舗", "2店舗", "3〜5店舗", "6店舗以上"] },
  industry: { label: "業種", help: "", options: ["飲食店", "美容室・サロン", "整体・接骨院・クリニック", "小売店", "その他"] },
} as const;

export const questions: Q[] = [
  { id: "insured", label: "従業員を雇用保険に入れている（適用事業所である）", help: "労働保険番号がわかれば確認できます", critical: true },
  { id: "pick", label: "受講する従業員を決められる", help: "退職予定のない、雇用保険に入っている方" },
  { id: "clean", label: "労働保険料の滞納・助成金の不正受給がない（直近2年）", help: "", critical: true },
  { id: "stay", label: "半年以内に閉店・移転の予定がない", help: "サイネージは3年設置、研修は1〜2ヶ月" },
  { id: "time", label: "研修時間（1名30時間）を1〜2ヶ月で確保できる", help: "ライブ講座は出席80%以上が必要" },
  { id: "wall", label: "トイレ個室に壁面と電源がある", help: "なければ配線工事をご相談" },
  { id: "owner", label: "物件オーナーの承諾が取れる（賃貸の場合）", help: "自己所有の物件なら「はい」" },
  { id: "pay", label: "研修費を先払いできる、または貸付型を使える", help: "貸付型は社労士の申請代行が必須・審査あり" },
  { id: "will", label: "SNS集客を社内で回したいという意思がある", help: "これがいちばん大事です" },
];

export type Verdict = {
  level: "high" | "mid" | "low";
  title: string;
  body: string;
  plan: (typeof plans)[number] | null;
  blockers: string[];
  unknowns: string[];
};

/** 回答から「対象になりそうか」と、人数に合うプランを出す */
export function judge(staff: string, answers: Record<string, Answer>): Verdict {
  const no = questions.filter((q) => answers[q.id] === "no");
  const unknown = questions.filter((q) => answers[q.id] !== "yes" && answers[q.id] !== "no");
  const criticalNo = no.filter((q) => q.critical);
  const tooFew = staff === "0〜2名";
  const plan = staff === "3〜4名" ? plans[0] : staff === "5〜6名" ? plans[1] : staff === "7〜9名" ? plans[2] : staff === "10名以上" ? plans[3] : null;

  if (criticalNo.length || tooFew) {
    return {
      level: "low",
      title: "現時点では、このパッケージの対象になりにくい状態です",
      body: tooFew
        ? "受講者は雇用保険に入っている従業員3名以上が必要です。今後、加入者が3名以上になる見込みがあれば、その時点でご相談ください。"
        : "雇用保険の適用事業所であること、滞納・不正受給がないことは、助成金の前提条件です。状況が変わりましたらご相談ください。",
      plan: null,
      blockers: [...(tooFew ? [basics.staff.label] : []), ...criticalNo.map((q) => q.label)],
      unknowns: unknown.map((q) => q.label),
    };
  }
  if (no.length === 0 && unknown.length === 0) {
    return {
      level: "high",
      title: "対象になる可能性がとても高い状態です",
      body: "すべての項目にあてはまります。30分のミーティングで、プランと金額をその場で確定できます。",
      plan,
      blockers: [],
      unknowns: [],
    };
  }
  return {
    level: "mid",
    title: "対象になる可能性があります。いくつか確認が必要です",
    body: "「いいえ」「わからない」の項目は、ミーティングで一緒に確認します。多くの場合は解決策があります（例：壁面・電源は配線工事、支払いは貸付型）。",
    plan,
    blockers: no.map((q) => q.label),
    unknowns: unknown.map((q) => q.label),
  };
}
