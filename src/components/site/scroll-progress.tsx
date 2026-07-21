"use client";

import { useEffect, useState } from "react";

/**
 * ページ上部に表示するスクロール進捗バー（ブランドカラー）。
 * 読み進み具合が一目で分かり、上質な操作感を与える。
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-brand to-sky-400"
        style={{ width: `${pct}%`, transition: "width 120ms linear" }}
      />
    </div>
  );
}
