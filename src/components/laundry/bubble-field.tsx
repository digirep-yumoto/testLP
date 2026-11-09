/**
 * 泡の背景装飾（純CSS・装飾のみ、aria-hidden）。
 * 透明な円＋内側の光で「水・清潔」を表現。prefers-reduced-motion では globals.css 側でアニメーションが止まる。
 */
export function BubbleField({
  variant = "light",
  count = 7,
  className = "",
}: {
  variant?: "light" | "dark";
  count?: number;
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
  const border = variant === "light" ? "border-brand/15 bg-white/40" : "border-white/15 bg-white/5";
  const glow = variant === "light" ? "rgba(10,127,160,0.08)" : "rgba(255,255,255,0.08)";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {seeds.map(([l, t, s, d], i) => (
        <span
          key={i}
          className={`dr-float-slow absolute rounded-full border ${border}`}
          style={{ left: l, top: t, width: s, height: s, animationDelay: d, boxShadow: `inset 0 0 30px ${glow}` }}
        />
      ))}
    </div>
  );
}
