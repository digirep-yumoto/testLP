"use client";

import { useState } from "react";
import { Download, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { MediaIcon } from "./icon";
import { accent } from "./accent";
import { docs } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Doc = (typeof docs)[number];

// GA4 イベント送信（読み込まれていれば送る）
function track(event: string, params: Record<string, unknown>) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
}

export function Docs() {
  const [active, setActive] = useState<Doc | null>(null);

  return (
    <section id="docs" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Download"
          title="資料ダウンロード"
          lead="各メディアの媒体価値・調査データ・料金プランをまとめた提案資料です。ご連絡先をご入力いただくと、その場でダウンロードいただけます。"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {docs.map((d) => {
            const a = accent[d.media];
            return (
              <button
                key={d.href}
                type="button"
                onClick={() => {
                  setActive(d);
                  track("select_document", { doc_title: d.title, media: d.media });
                }}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", a.softBg, a.text)}>
                  <MediaIcon kind={d.media} className="size-6" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <FileText className="size-3.5" />
                    PDF
                  </div>
                  <h3 className="mt-1 text-base font-bold text-ink">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d.desc}</p>
                  <span className={cn("mt-3 inline-flex items-center gap-1.5 text-sm font-bold", a.text)}>
                    <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
                    ダウンロード
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {active && <DocGate doc={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function DocGate({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const a = accent[doc.media];
  const [f, setF] = useState({ name: "", company: "", email: "" });
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
        body: JSON.stringify({
          purpose: `資料請求（${doc.title}）`,
          name: f.name,
          company: f.company,
          email: f.email,
          tel: "",
          media: doc.media,
          message: `資料ダウンロード：${doc.title}`,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "送信に失敗しました。");
      track("generate_lead", { doc_title: doc.title, media: doc.media, source: "docs" });
      track("file_download", { doc_title: doc.title, media: doc.media });
      setState("done");
      // ダウンロード開始（ポップアップブロック時は下のリンクから）
      window.open(doc.href, "_blank", "noopener,noreferrer");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "送信に失敗しました。");
      setState("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-auto bg-ink/55 p-4 pt-[10vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", a.softBg, a.text)}>
              <MediaIcon kind={doc.media} className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold text-muted-foreground">資料ダウンロード</p>
              <h3 className="text-[15px] font-bold leading-snug text-ink">{doc.title}</h3>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="閉じる" className="grid size-8 place-items-center rounded-lg text-ink-soft hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {state === "done" ? (
          <div className="mt-6 flex flex-col items-center py-4 text-center">
            <CheckCircle2 className="size-12 text-brand" />
            <h4 className="mt-3 text-lg font-bold text-ink">ダウンロードを開始しました</h4>
            <p className="mt-2 text-sm text-ink-soft">
              始まらない場合は、下のボタンから開いてください。
            </p>
            <a
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white", "bg-brand hover:bg-brand-dark")}
            >
              <Download className="size-4" />
              資料を開く
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <p className="text-xs leading-relaxed text-ink-soft">
              ご連絡先をご入力ください。担当より、活用のご提案や最新の配信空き状況などをご案内する場合があります。
            </p>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-ink-soft">メールアドレス <span className="text-destructive">*</span></span>
              <input
                type="email"
                required
                value={f.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-ink-soft">お名前</span>
                <input
                  value={f.name}
                  onChange={set("name")}
                  placeholder="山田 太郎"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-ink-soft">会社名</span>
                <input
                  value={f.company}
                  onChange={set("company")}
                  placeholder="株式会社◯◯"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>

            {state === "error" && <p className="text-sm font-medium text-destructive">{err}</p>}

            <button
              type="submit"
              disabled={state === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {state === "loading" ? <Loader2 className="size-5 animate-spin" /> : <Download className="size-5" />}
              資料をダウンロード
            </button>
            <p className="text-center text-xs text-muted-foreground">
              送信により
              <a href="/privacy" target="_blank" className="text-brand hover:underline">プライバシーポリシー</a>
              に同意したものとみなします。
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
