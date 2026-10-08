// ブルースカイランドリー ご利用者アンケート（ランドリー利用中の行動と、暮らしの関心ごと）
// 設問・選択肢・受付期間・景品の表示はすべてこのファイルで管理する。
// フォーム（/laundry-survey）と受付API（/api/survey）の両方がここを読むので、直すのは1か所でよい。

export const survey = {
  id: "bsl-2026-11",
  title: "ブルースカイランドリー ご利用者アンケート",
  // 告知チラシを貼り出す日（10/21）から答えられるようにしておく
  openAt: "2026-10-21T00:00:00+09:00",
  closeAt: "2026-11-30T23:59:59+09:00",
  closeLabel: "11月30日（月）",
  minutes: 2,
  prize: "Amazonギフトカード 500円分",
  winners: 100,
  organizer: "デジレップ株式会社", // アンケートの実施・事務局
  sponsor: "株式会社CMerTV", // 景品の提供
  partner: "ブルースカイランドリー",
  contact: "digirep.yumoto@gmail.com",
} as const;

export type Q = {
  id: string;
  label: string;
  help?: string;
  type: "single" | "multi" | "text" | "pref";
  options?: string[];
  required?: boolean;
  max?: number; // multi の上限
  exclusive?: string; // これを選ぶと他が外れる選択肢（「特にない」など）
  showIf?: { id: string; anyOf: string[] }; // 直前の回答で出し分け
};
export type Step = { key: string; title: string; lead: string; questions: Q[] };

export const steps: Step[] = [
  {
    key: "use",
    title: "ランドリーの使い方",
    lead: "ふだんのご利用について教えてください。",
    questions: [
      { id: "freq", label: "コインランドリーを使う頻度は？", type: "single", required: true,
        options: ["週に2回以上", "週に1回くらい", "月に2〜3回", "月に1回くらい", "数か月に1回", "今日がはじめて"] },
      { id: "time", label: "よく使う時間帯は？", help: "あてはまるものすべて", type: "multi", required: true,
        options: ["平日の朝", "平日の昼", "平日の夕方", "平日の夜", "土日祝の午前", "土日祝の午後", "土日祝の夜", "深夜・早朝"] },
      { id: "purpose", label: "どんなときに使いますか？", help: "あてはまるものすべて", type: "multi", required: true,
        options: ["毛布・布団など大きなものを洗う", "1週間分などまとめて洗う", "乾燥だけ使う", "雨の日・梅雨どき", "スニーカーを洗う", "家事の時間を短くしたい", "家の洗濯機が使えない・小さい", "その他"] },
      { id: "whose", label: "主にだれの洗濯物ですか？", type: "single", required: true,
        options: ["自分だけ", "夫婦・パートナーと2人分", "子どものいる家族の分", "親と同居の家族の分", "仕事で使うもの"] },
    ],
  },
  {
    key: "wait",
    title: "待ち時間の過ごし方",
    lead: "洗濯・乾燥が終わるまでのことを教えてください。",
    questions: [
      { id: "duration", label: "1回の利用で、終わるまでの時間は？", type: "single", required: true,
        options: ["30分くらいまで", "30分〜1時間", "1時間〜1時間半", "1時間半以上"] },
      { id: "where", label: "待っているあいだ、どこにいることが多いですか？", type: "single", required: true,
        options: ["店内で待つ", "車の中で待つ", "いったん家に帰る", "近くで用事をすませる", "その日によって違う"] },
      { id: "doing", label: "店内や車で待つとき、何をしていますか？", help: "あてはまるものすべて", type: "multi", required: true,
        showIf: { id: "where", anyOf: ["店内で待つ", "車の中で待つ", "その日によって違う"] },
        options: ["SNSを見る", "動画を見る", "ネットで買い物・調べもの", "ニュースを見る", "ゲーム", "本・雑誌を読む", "仕事・勉強", "店内のモニターを見る", "子どもの相手", "なにもせず休憩"] },
      { id: "goto", label: "待ち時間や前後に、よく行く場所は？", help: "あてはまるものすべて", type: "multi", required: true, exclusive: "特に寄らない",
        options: ["スーパー", "ドラッグストア", "ショッピングモール", "コンビニ", "ホームセンター", "100円ショップ", "飲食店・カフェ", "ガソリンスタンド", "銀行・郵便局・役所", "子どもの送り迎え", "自宅", "特に寄らない"] },
      { id: "transport", label: "お店までの交通手段は？", type: "single", required: true,
        options: ["車", "自転車", "徒歩", "バイク", "その他"] },
    ],
  },
  {
    key: "life",
    title: "暮らしと関心ごと",
    lead: "ふだんの暮らしで気になっていることを教えてください。",
    questions: [
      { id: "worry", label: "いま気になっていること・困っていることは？", help: "5つまで", type: "multi", required: true, max: 5, exclusive: "特にない",
        options: ["家事の時間を減らしたい", "食費・物価の上がり方", "電気・ガス代", "子どもの教育・習いごと", "子育て全般", "自分の健康・ダイエット", "美容（肌・髪）", "家族の健康・介護", "仕事（転職・パート探し）", "住まい（片づけ・リフォーム・引っ越し）", "保険・貯金・資産づくり", "車（買い替え・車検）", "スマホ・通信費", "旅行・おでかけ", "特にない"] },
      { id: "info", label: "ランドリーで手に入るとうれしい情報は？", help: "あてはまるものすべて", type: "multi", required: true, exclusive: "特にない",
        options: ["近くのお店のクーポン・セール", "新商品・試供品（食品・飲料・日用品）", "家事の裏ワザ・時短レシピ", "健康・美容の情報", "映画・ドラマ・エンタメ情報", "地域のニュース・天気予報", "求人情報", "地域のイベント", "習いごと・教室", "病院・クリニック", "住まい・リフォーム", "お金・保険の見直し", "ランドリーのお得情報", "特にない"] },
      { id: "monitor", label: "店内のモニター（映像が流れる画面）について", type: "single", required: true,
        options: ["流れている映像や音声を、よく見聞きしている", "スマホなどを触りながら、時々見ている（ながら見）", "あるのは知っているが、ほとんど見ない", "あることに気づかなかった", "お店にない・わからない"] },
      { id: "free", label: "暮らしの中で「こんな情報・サービスがあったら」と思うことがあれば教えてください", help: "任意・ひとことでも", type: "text" },
    ],
  },
  {
    key: "you",
    title: "あなたについて",
    lead: "最後に、集計のために教えてください。",
    questions: [
      { id: "gender", label: "性別", type: "single", required: true, options: ["女性", "男性", "回答しない"] },
      { id: "age", label: "年代", type: "single", required: true, options: ["10代", "20代", "30代", "40代", "50代", "60代", "70代以上"] },
      { id: "family", label: "いまの世帯構成にいちばん近いものは？", type: "single", required: true,
        options: ["ひとり暮らし", "夫婦・パートナーのみ", "家族（中学生以下の子どもと同居）", "家族（高校生以上の子ども、または親と同居）", "その他"] },
      { id: "buyer", label: "ご家庭の「日々の買い物」や「洗濯」は、主にどなたが担当していますか？", type: "single", required: true,
        options: ["ほぼすべて自分が担当", "自分と家族で半分ずつ", "主に家族。自分はたまに", "自分はほとんど行わない", "その他"] },
      { id: "job", label: "お仕事", type: "single", required: true,
        options: ["会社員・公務員（フルタイム）", "パート・アルバイト", "自営業・フリーランス", "専業主婦・主夫", "学生", "その他"] },
      { id: "pref", label: "よく使う店舗の都道府県", type: "pref", required: true },
      { id: "store", label: "よく使う店舗名", help: "任意・わかる範囲で（例：○○店）", type: "text" },
    ],
  },
];

export const PREFS = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];

export const allQuestions = steps.flatMap((s) => s.questions);
// どこで知ったか（QRやリンクに ?s= を付けて見分ける）
export const SOURCES: Record<string, string> = { pop: "店内のチラシ", line: "公式LINE", tv: "店内のモニター", "": "不明" };

export type Answers = Record<string, string | string[]>;

export function isVisible(q: Q, a: Answers) {
  if (!q.showIf) return true;
  const v = a[q.showIf.id];
  return typeof v === "string" && q.showIf.anyOf.includes(v);
}

/** 回答を設問定義に照らして確かめ、定義にある値だけを残す。問題があれば error を返す */
export function cleanAnswers(input: unknown): { answers: Answers; error?: string } {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out: Answers = {};
  for (const q of allQuestions) {
    const v = src[q.id];
    if (q.type === "single") {
      if (typeof v === "string" && q.options!.includes(v)) out[q.id] = v;
    } else if (q.type === "multi") {
      if (Array.isArray(v)) {
        const picked = q.options!.filter((o) => v.includes(o));
        if (picked.length) out[q.id] = q.max ? picked.slice(0, q.max) : picked;
      }
    } else if (q.type === "pref") {
      if (typeof v === "string" && PREFS.includes(v)) out[q.id] = v;
    } else if (typeof v === "string" && v.trim()) {
      out[q.id] = v.trim().slice(0, 400);
    }
  }
  for (const q of allQuestions) {
    if (q.required && isVisible(q, out) && (out[q.id] === undefined || out[q.id] === "")) return { answers: out, error: `「${q.label}」が未回答です。` };
    if (!isVisible(q, out)) delete out[q.id];
  }
  return { answers: out };
}

export function surveyState(now = new Date()): "before" | "open" | "closed" {
  if (now < new Date(survey.openAt)) return "before";
  if (now > new Date(survey.closeAt)) return "closed";
  return "open";
}
