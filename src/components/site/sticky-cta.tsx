"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calculator, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * スクロールで下部に常駐する追従CTA。ヒーローを過ぎると出現、×で非表示。
 */
export function StickyCta() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (closed) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto max-w-6xl px-3 pb-3 sm:px-6 sm:pb-4">
        <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-white/95 p-2.5 shadow-2xl backdrop-blur sm:gap-3 sm:p-3">
          <p className="ml-2 hidden text-sm font-bold text-ink sm:block">
            まずは無料でシミュレーション
            <span className="block text-xs font-normal text-ink-soft">
              媒体・規模を選ぶだけで金額が分かります
            </span>
          </p>
          <a
            href="/apply-form.html"
            className="ml-auto inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark sm:flex-none"
          >
            <Calculator className="size-4" />
            お申込み・試算
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#docs"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">資料DL</span>
          </a>
          <button
            type="button"
            onClick={() => setClosed(true)}
            aria-label="閉じる"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
