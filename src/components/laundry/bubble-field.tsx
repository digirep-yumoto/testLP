/**
 * 泡の背景装飾（純CSS・装飾のみ、aria-hidden）。
 * - 漂う大きな泡（dr-float-slow）と、下から立ちのぼる小さな泡（dr-rise）の2層。
 * - prefers-reduced-motion では globals.css 側でアニメーションが止まる。
 */
export function BubbleField({
  variant = "light",
  count = 7,
  rising = 10,
  className = "",
}: {
  variant?: "light" | "dark";
  count?: number;
  rising?: number;
  className?: string;
}) {
  const seeds = [
    ["6%", "22%", "7rem", "-1s"],
    ["86%", "10%", "5rem", "-5s"],
    ["70%", "72%", "10rem", "-3s"],
    ["94%", "48%", "3.5rem", "-7s"],
    ["18%", "80%", "4.5rem", "-2.5s"],
    ["42%", "8%", "3rem", "-6s"],
    ["55%", "88%", "6rem", "-4.5s"],
    ["30%", "45%", "2.5rem", "-8s"],
  ].slice(0, count);
  const risers = Array.from({ length: rising }, (_, i) => ({
    left: `${(i * 37 + 11) % 100}%`,
    size: `${0.5 + ((i * 7) % 5) * 0.35}rem`,
    dur: `${14 + (i % 5) * 3}s`,
    delay: `-${(i * 2.7) % 16}s`,
    dx: `${((i % 3) - 1) * 40}px`,
  }));
  const border = variant === "light" ? "border-brand/15 bg-white/40" : "border-white/15 bg-white/5";
  const glow = variant === "light" ? "rgba(10,127,160,0.08)" : "rgba(255,255,255,0.08)";
  const riseColor = variant === "light" ? "border-brand/25 bg-white/60" : "border-white/30 bg-white/10";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {seeds.map(([l, t, s, d], i) => (
        <span
          key={`f${i}`}
          className={`dr-float-slow absolute rounded-full border ${border}`}
          style={{ left: l, top: t, width: s, height: s, animationDelay: d, boxShadow: `inset 0 0 30px ${glow}` }}
        />
      ))}
      {risers.map((r, i) => (
        <span
          key={`r${i}`}
          className={`dr-rise absolute bottom-[-3rem] rounded-full border ${riseColor}`}
          style={{ left: r.left, width: r.size, height: r.size, ["--dur" as string]: r.dur, ["--delay" as string]: r.delay, ["--dx" as string]: r.dx } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
