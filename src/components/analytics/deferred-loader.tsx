"use client";

import { useEffect } from "react";

/**
 * 計測タグ（GA4・Metaピクセル）の読み込みを「ページ表示が落ち着いてから」に遅らせる。
 * - 最初の操作（スクロール・タップ・クリック・キー入力）があれば即座に、なければ load 後 3 秒で読み込む。
 * - 初期表示のメインスレッドを計測タグ（合計1MB超）に奪われないようにするための仕組み。
 * - 読み込み後は従来どおり gtag / fbq がグローバルに定義される（PageView も送信される）。
 */
export function DeferredLoader({ gaId, adsId, pixelId }: { gaId: string; adsId?: string; pixelId?: string }) {
  useEffect(() => {
    let done = false;
    const w = window as unknown as Record<string, unknown>;
    const load = () => {
      if (done) return;
      done = true;
      cleanup();
      if (gaId) {
        const s = document.createElement("script");
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(s);
        const dl = ((w.dataLayer as unknown[]) ||= []);
        const gtag = (...args: unknown[]) => {
          dl.push(args);
        };
        w.gtag ||= gtag;
        gtag("js", new Date());
        gtag("config", gaId);
        if (adsId) gtag("config", adsId);
      }
      if (pixelId && !w.fbq) {
        type Fbq = ((...a: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; push: unknown; loaded: boolean; version: string };
        const n = function (...args: unknown[]) {
          if (n.callMethod) n.callMethod(...args);
          else n.queue.push(args);
        } as Fbq;
        n.queue = [];
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        w.fbq = n;
        w._fbq ||= n;
        const t = document.createElement("script");
        t.async = true;
        t.src = "https://connect.facebook.net/en_US/fbevents.js";
        document.head.appendChild(t);
        n("init", pixelId);
        n("track", "PageView");
      }
    };
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const opts = { passive: true, once: true } as const;
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    };
    events.forEach((e) => window.addEventListener(e, load, opts));
    const delay = () => window.setTimeout(load, 3000);
    const timer = document.readyState === "complete" ? delay() : (window.addEventListener("load", () => { window.setTimeout(load, 3000); }, { once: true }), 0);
    return cleanup;
  }, [gaId, adsId, pixelId]);
  return null;
}
