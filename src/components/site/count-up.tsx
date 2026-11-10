"use client";

import { useEffect, useRef } from "react";

/**
 * ビューポートに入ると 0 → to までカウントアップする数値アニメ。
 * prefers-reduced-motion 時は即最終値。小数は decimals で指定。
 */
export function CountUp({
  to,
  decimals = 0,
  duration = 1400,
  className,
}: {
  to: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  const fmt = (v: number) =>
    v.toLocaleString("ja-JP", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 再描画ではなく textContent を直接更新する（1フレームごとの React 再レンダーを避ける）
    const setVal = (v: number) => {
      el.textContent = fmt(v);
    };
    if (reduce) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              // ease-out
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(to * eased);
              if (p < 1) requestAnimationFrame(tick);
              else setVal(to);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {fmt(0)}
    </span>
  );
}
