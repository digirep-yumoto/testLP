"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 自動切替のクロスフェード・スライドショー。ホバーで一時停止、ドットで手動切替。
 * 親から高さ（className: h-[...] や aspect-[...]）を渡すこと。
 */
export function Carousel({
  images,
  alt,
  className,
  interval = 4200,
  captions,
  chips,
}: {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
  captions?: string[];
  chips?: ReactNode[];
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [paused, images.length, interval]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={idx === i ? alt : ""}
          loading={idx === 0 ? undefined : "lazy"}
          aria-hidden={idx !== i}
          className={cn(
            "absolute inset-0 size-full object-cover object-center transition-opacity duration-[900ms] ease-out",
            idx === i ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {chips && chips[i] && (
        <div key={`chip-${i}`} className="absolute left-3 top-3 z-20 sm:left-4 sm:top-4">
          {chips[i]}
        </div>
      )}

      {captions && captions[i] && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent px-4 pb-8 pt-12">
          <span className="text-sm font-bold text-white sm:text-base">{captions[i]}</span>
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              aria-label={`写真 ${idx + 1} を表示`}
              onClick={() => setI(idx)}
              className={cn(
                "h-1.5 rounded-full bg-white/90 shadow transition-all",
                idx === i ? "w-5" : "w-1.5 bg-white/55 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
