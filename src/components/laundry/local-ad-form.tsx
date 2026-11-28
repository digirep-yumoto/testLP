"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

// GA4 / Meta イベント送信（読み込まれていれば送る）
function track(event: string, params: Record<string, unknown>) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
  if (typeof w.fbq === "function") w.fbq("track", "Lead", params);
}

const STORES = ["1店舗", "2〜3店舗", "4〜9店舗", "10店舗以上", "まだ決めていない"];
const BUDGETS = ["月5,000円まで", "月1万円まで", "月3万円まで", "月5万円まで", "月5万円より多くてもよい", "まだ分からない"];
const TYPES = ["学習塾・習いごと", "整骨院・整体・鍼灸", "美容室・エステ・ネイル", "クリニック・歯科", "不動産・リフォーム", "飲食・テイクアウト", "買取・リユース", "保険・家計の相談", "求人（スタッフ募集）", "その他"];

/**
 * 「1〜9店舗で出したい」方の相談フォーム。
 * いまの料金プランは10店舗からなので、ここでは申込みではなく相談を受け付け、
 * 希望の店舗数と予算の目安を聞く（少店舗向けの料金を決める材料にする）。
 */
export function LocalAdForm({ source }: { source: string }) {
  const [f, setF] = useState({ company: "", name: "", email: "", tel: "", type: "", area: "", stores: "", budget: "", note: "", hp: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErr("");
    const message = [
      `業種：${f.type || "未選択"}`,
      `出したい店舗・エリア：${f.area || "未記入"}`,
      `店舗数：${f.stores || "未選択"}`,
      `予算の目安：${f.budget || "未選択"}`,
      f.note && `ご質問：${f.note}`,
      `送信元ページ：${source}`,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "ランドリー広告：少ない店舗数での掲載の相談", media: "laundry", company: f.company, name: f.name, email: f.email, tel: f.tel, message, hp: f.hp }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "送信に失敗しました。");
      track("generate_lead", { source, media: "laundry", stores: f.stores, budget: f.budget });
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "送信に失敗しました。");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm" role="status">
        <CheckCircle2 className="size-12 text-brand" />
        <h3 className="mt-3 text-lg font-bold text-ink">送信ありがとうございます</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">ご希望の店舗と料金のご案内を、メールでお送りします。</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          お店・会社の名前
          <input value={f.company} onChange={set("company")} className={field} autoComplete="organization" />
        </label>
        <label className={label}>
          <span>
            お名前<span className={req}>必須</span>
          </span>
          <input value={f.name} onChange={set("name")} className={field} required autoComplete="name" />
        </label>
        <label className={label}>
          <span>
            メールアドレス<span className={req}>必須</span>
          </span>
          <input type="email" value={f.email} onChange={set("email")} className={field} required autoComplete="email" />
        </label>
        <label className={label}>
          電話番号
          <input type="tel" value={f.tel} onChange={set("tel")} className={field} autoComplete="tel" />
        </label>
        <label className={label}>
          業種
          <select value={f.type} onChange={set("type")} className={field}>
            <option value="">選択してください</option>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          出したい店舗・エリア
          <input value={f.area} onChange={set("area")} className={field} placeholder="例：いま見ていた店舗、◯◯市内" />
        </label>
        <label className={label}>
          出したい店舗の数
          <select value={f.stores} onChange={set("stores")} className={field}>
            <option value="">選択してください</option>
            {STORES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          広告に使える予算の目安（1か月）
          <select value={f.budget} onChange={set("budget")} className={field}>
            <option value="">選択してください</option>
            {BUDGETS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className={label}>
        ご質問・ご要望
        <textarea value={f.note} onChange={set("note")} rows={3} className={field} maxLength={1000} />
      </label>
      {/* 機械による送信を見分けるための欄。画面には出さない */}
      <div aria-hidden="true" className="hidden">
        <input tabIndex={-1} autoComplete="off" value={f.hp} onChange={set("hp")} />
      </div>

      {state === "error" && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {err}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {state === "loading" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        この内容で相談する（無料）
      </button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        いただいた情報は、ご案内とご連絡のためだけに使います。送信により
        <a href="/privacy" target="_blank" className="text-brand hover:underline">
          プライバシーポリシー
        </a>
        に同意したものとみなします。
      </p>
    </form>
  );
}

const label = "grid gap-1.5 text-sm font-bold text-ink";
const req = "ml-2 rounded bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white";
const field =
  "w-full rounded-xl border border-border bg-background px-3.5 py-3 text-[15px] font-normal text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";
