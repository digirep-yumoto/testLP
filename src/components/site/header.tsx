"use client";

import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/service", label: "事業一覧" },
  { href: "/media/toilet", label: "個室トイレ" },
  { href: "/media/laundry", label: "ランドリー" },
  { href: "/#store", label: "店舗オーナー" },
  { href: "/#docs", label: "資料" },
  { href: "/blog", label: "記事" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full border-b bg-white/95 backdrop-blur transition-shadow duration-300",
        scrolled ? "border-border shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="/" className="flex items-center" aria-label="DigiRep ホーム">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="DigiRep（デジレップ）" className="h-11 w-auto sm:h-12" />
        </a>

        <nav className="ml-auto hidden items-center gap-5 lg:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="whitespace-nowrap text-sm font-medium text-ink-soft transition-colors hover:text-brand"
            >
              {n.label}
            </a>
          ))}
          <a
            href="/#request"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand/40 px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand/5"
          >
            お問い合わせ・無料相談
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-dark active:translate-y-px"
          >
            お申込み・試算
            <ArrowRight className="size-4" />
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="メニュー"
          aria-expanded={open}
          className="ml-auto grid size-10 place-items-center rounded-lg text-ink lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-ink hover:bg-muted"
              >
                {n.label}
              </a>
            ))}
            <a
              href="/#request"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand/40 px-4 py-3 text-sm font-bold text-brand"
            >
              お問い合わせ・無料相談
            </a>
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white"
            >
              お申込み・試算
              <ArrowRight className="size-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
