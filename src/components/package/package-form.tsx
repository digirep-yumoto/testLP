"use client";

import { useState } from "react";
import { pkg } from "@/lib/package-data";

function track(event: string, params: Record<string, unknown>) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
}

const field = "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-brand";
const label = "mb-1 block text-sm font-bold text-ink";

/** ミーティング希望フォーム。/api/lead に送り、追加項目は本文にまとめる */
export function PackageForm() {
  const [f, setF] = useState({ company: "", name: "", tel: "", email: "", industry: "", staff: "", stores: "1店舗", when: "", memo: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErr("");
    const message = [
      `流入元: ${pkg.source}`,
      `業種: ${f.industry || "（未記入）"}`,
      `雇用保険に入っている従業員数: ${f.staff || "（未記入）"}`,
      `店舗数: ${f.stores}`,
      `ミーティング希望日時: ${f.when || "（未記入）"}`,
      f.memo ? `ご相談内容:\n${f.memo}` : "",
    ].filter(Boolean).join("\n");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: pkg.formPurpose, company: f.company, name: f.name, email: f.email, tel: f.tel, media: "助成金パッケージ（PR配信店）", message }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "送信に失敗しました。");
      track("generate_lead", { source: pkg.source, stores: f.stores, staff: f.staff });
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "送信に失敗しました。");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">✅</p>
        <h3 className="mt-3 text-xl font-black text-ink">ミーティングのご希望を受け付けました</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">担当の湯本より1営業日以内に、候補日をメールでご案内します。自動返信メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
        <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm font-bold text-ink">当日までに「年商のおおよそ」「雇用保険に入っている従業員の人数」「決算月」がわかると、その場で判定できます。</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label}>店名・会社名</label><input className={field} value={f.company} onChange={set("company")} placeholder="例：焼肉○○ 新座店" required /></div>
        <div><label className={label}>お名前</label><input className={field} value={f.name} onChange={set("name")} placeholder="例：山田 太郎" required /></div>
        <div><label className={label}>メールアドレス</label><input type="email" className={field} value={f.email} onChange={set("email")} placeholder="example@mail.com" required /></div>
        <div><label className={label}>電話番号</label><input type="tel" className={field} value={f.tel} onChange={set("tel")} placeholder="090-0000-0000" /></div>
        <div><label className={label}>業種</label>
          <select className={field} value={f.industry} onChange={set("industry")}>
            <option value="">えらんでください</option>
            {["飲食店", "美容室・サロン", "整体・接骨院・クリニック", "小売店", "その他"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><label className={label}>雇用保険に入っている従業員数<span className="ml-1 text-xs font-normal text-ink-soft">（役員・ご家族を除く）</span></label>
          <select className={field} value={f.staff} onChange={set("staff")}>
            <option value="">えらんでください</option>
            {["1〜2名", "3〜4名", "5〜6名", "7〜9名", "10名以上"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><label className={label}>店舗数</label>
          <select className={field} value={f.stores} onChange={set("stores")}>
            {["1店舗", "2店舗", "3〜5店舗", "6店舗以上"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><label className={label}>ミーティング希望日時<span className="ml-1 text-xs font-normal text-ink-soft">（任意）</span></label><input className={field} value={f.when} onChange={set("when")} placeholder="例：平日14時以降／10月15日（水）午前" /></div>
      </div>
      <div><label className={label}>ご相談内容<span className="ml-1 text-xs font-normal text-ink-soft">（任意）</span></label><textarea className={field} rows={3} value={f.memo} onChange={set("memo")} placeholder="気になる点、現在のSNS・集客の状況など" /></div>
      {state === "error" && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" role="alert">{err}</p>}
      <button type="submit" disabled={state === "loading"} className="w-full rounded-full bg-[#e8590c] py-4 text-lg font-black text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60">
        {state === "loading" ? "送信中…" : "30分の適用診断（無料）を申し込む"}
      </button>
      <p className="text-center text-xs text-ink-soft">送信により<a href="/privacy" target="_blank" rel="noopener" className="font-bold text-brand underline">プライバシーポリシー</a>に同意したものとみなします。営業のお電話を一方的にかけることはありません。</p>
    </form>
  );
}
