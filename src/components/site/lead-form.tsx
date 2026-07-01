"use client";

import { useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

const mediaOptions = ["個室トイレサイネージ", "コインランドリーサイネージ", "両方・未定", "店舗設置（加盟店）"];

export function LeadForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [f, setF] = useState({ company: "", name: "", email: "", tel: "", media: mediaOptions[0], message: "" });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErr("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "送信に失敗しました。");
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "送信に失敗しました。");
      setState("error");
    }
  }

  return (
    <section id="request" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Download / Contact"
          title="資料請求・お問い合わせ"
          lead="媒体資料の送付・ご相談を承ります。1営業日以内に担当よりご連絡します。まずはお気軽にどうぞ。"
        />

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
          {state === "done" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="size-14 text-brand" />
              <h3 className="mt-4 text-xl font-bold text-ink">送信ありがとうございます</h3>
              <p className="mt-2 text-sm text-ink-soft">
                担当より1営業日以内にご連絡します。資料もあわせてお送りします。
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="会社名" htmlFor="lf-company">
                  <input id="lf-company" value={f.company} onChange={set("company")} className={input} placeholder="株式会社◯◯" />
                </Field>
                <Field label="お名前" required htmlFor="lf-name">
                  <input id="lf-name" required value={f.name} onChange={set("name")} className={input} placeholder="山田 太郎" />
                </Field>
                <Field label="メールアドレス" required htmlFor="lf-email">
                  <input id="lf-email" type="email" required value={f.email} onChange={set("email")} className={input} placeholder="you@example.com" />
                </Field>
                <Field label="電話番号" htmlFor="lf-tel">
                  <input id="lf-tel" type="tel" value={f.tel} onChange={set("tel")} className={input} placeholder="03-1234-5678" />
                </Field>
              </div>
              <Field label="興味のある媒体" htmlFor="lf-media">
                <select id="lf-media" value={f.media} onChange={set("media")} className={input}>
                  {mediaOptions.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="ご相談・ご質問（任意）" htmlFor="lf-msg">
                <textarea id="lf-msg" value={f.message} onChange={set("message")} rows={4} className={cn(input, "resize-y")} placeholder="配信したい商材・エリア・ご予算など" />
              </Field>

              {state === "error" && <p className="text-sm font-medium text-destructive">{err}</p>}

              <button
                type="submit"
                disabled={state === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
              >
                {state === "loading" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                資料請求・問い合わせを送信
              </button>
              <p className="text-center text-xs text-muted-foreground">
                送信により
                <a href="/privacy" className="text-brand hover:underline">プライバシーポリシー</a>
                に同意したものとみなします。
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const input =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  required,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-ink-soft">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
