"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

// GA4 / Meta イベント送信（読み込まれていれば送る）
function track(event: string, params: Record<string, unknown>) {
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
  };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
  if (typeof w.fbq === "function") w.fbq("track", "Lead", params);
}

/**
 * 業種別LP用の問い合わせ/資料請求フォーム。
 * purpose・media・source を固定して /api/lead に送信し、リードを計測する。
 */
export function LpLeadForm({
  purpose,
  media,
  source,
  cta = "無料で相談・資料を受け取る",
}: {
  purpose: string;
  media: string;
  source: string;
  cta?: string;
}) {
  const [f, setF] = useState({ name: "", company: "", email: "", tel: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErr("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, purpose, media, message: `流入元: ${source}` }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "送信に失敗しました。");
      track("generate_lead", { source, media });
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "送信に失敗しました。");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="size-12 text-brand" />
        <h3 className="mt-3 text-lg font-bold text-ink">送信ありがとうございます</h3>
        <p className="mt-2 text-sm text-ink-soft">
          担当より1営業日以内にご連絡します。資料もあわせてお送りします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
      <input
        type="email"
        required
        value={f.email}
        onChange={set("email")}
        placeholder="メールアドレス（必須）"
        className={field}
      />
      <input value={f.name} onChange={set("name")} placeholder="お名前" className={field} required />
      <input value={f.company} onChange={set("company")} placeholder="医院・会社名" className={field} />
      <input type="tel" value={f.tel} onChange={set("tel")} placeholder="電話番号（任意）" className={field} />

      {state === "error" && <p className="text-sm font-medium text-destructive">{err}</p>}

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {state === "loading" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        {cta}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        送信により<a href="/privacy" target="_blank" className="text-brand hover:underline">プライバシーポリシー</a>に同意したものとみなします。
      </p>
    </form>
  );
}

const field =
  "w-full rounded-xl border border-border bg-background px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";
