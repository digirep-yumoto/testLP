import type { MediaKey } from "@/lib/site-data";

export const ACCENT_HEX: Record<MediaKey, string> = {
  toilet: "#2f6df0",
  laundry: "#0ea5e9",
  hotel: "#b08433",
};

// QRコード風グリッド（装飾）
function QrGrid({ x, y, size, color = "#0f172a" }: { x: number; y: number; size: number; color?: string }) {
  const n = 7;
  const cell = size / n;
  // 固定パターン（位置検出パターン＋ランダム見え）
  const pat = [
    [1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1],
    [1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1],
  ];
  return (
    <g>
      <rect x={x - 3} y={y - 3} width={size + 6} height={size + 6} rx={3} fill="#fff" />
      {pat.flatMap((row, r) =>
        row.map((v, c) =>
          v ? (
            <rect
              key={`${r}-${c}`}
              x={x + c * cell}
              y={y + r * cell}
              width={cell}
              height={cell}
              fill={color}
            />
          ) : null,
        ),
      )}
    </g>
  );
}

// 画面内の広告クリエイティブ（ヘッドライン＋CTA＋QR）
function AdContent({
  x,
  y,
  w,
  h,
  accent,
  gid,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
  gid: string;
}) {
  return (
    <g>
      {/* ビジュアル帯 */}
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.9" />
          <stop offset="1" stopColor={accent} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h * 0.46} rx={6} fill={`url(#${gid})`} />
      {/* ビジュアル内の簡易モチーフ */}
      <circle cx={x + w * 0.28} cy={y + h * 0.23} r={h * 0.1} fill="#fff" opacity="0.85" />
      <rect x={x + w * 0.45} y={y + h * 0.14} width={w * 0.4} height={h * 0.05} rx={3} fill="#fff" opacity="0.85" />
      <rect x={x + w * 0.45} y={y + h * 0.24} width={w * 0.3} height={h * 0.045} rx={3} fill="#fff" opacity="0.6" />
      {/* ヘッドライン */}
      <rect x={x} y={y + h * 0.54} width={w * 0.82} height={h * 0.06} rx={3} fill="#0f172a" />
      <rect x={x} y={y + h * 0.64} width={w * 0.62} height={h * 0.05} rx={3} fill="#94a3b8" />
      {/* CTA＋QR */}
      <rect x={x} y={y + h * 0.8} width={w * 0.5} height={h * 0.13} rx={6} fill={accent} />
      <rect x={x + w * 0.1} y={y + h * 0.855} width={w * 0.3} height={h * 0.025} rx={2} fill="#fff" />
      <QrGrid x={x + w * 0.62} y={y + h * 0.78} size={h * 0.17} color="#0f172a" />
    </g>
  );
}

// ヒーロー用：縦型サイネージ端末＋ステータスチップ
export function HeroSignage({ className }: { className?: string }) {
  const accent = ACCENT_HEX.toilet;
  return (
    <svg viewBox="0 0 360 460" className={className} role="img" aria-label="サイネージ広告のイメージ">
      {/* 後光 */}
      <ellipse cx="180" cy="230" rx="170" ry="200" fill={accent} opacity="0.12" />
      {/* 端末フレーム */}
      <g transform="rotate(-4 180 230)">
        <rect x="84" y="40" width="192" height="360" rx="22" fill="#0b1220" stroke="#1e293b" strokeWidth="2" />
        <rect x="96" y="58" width="168" height="324" rx="10" fill="#f8fafc" />
        {/* ステータスバー */}
        <circle cx="112" cy="74" r="4" fill="#ef4444" />
        <rect x="122" y="70" width="40" height="8" rx="4" fill="#cbd5e1" />
        <rect x="232" y="70" width="22" height="8" rx="4" fill="#cbd5e1" />
        {/* 広告 */}
        <AdContent x={108} y={92} w={144} h={272} accent={accent} gid="ad-hero" />
      </g>
      {/* チップ */}
      <g fontFamily="var(--font-display), sans-serif">
        <g transform="translate(8 96)">
          <rect width="116" height="40" rx="20" fill="#fff" stroke="#e2e8f0" />
          <circle cx="22" cy="20" r="9" fill={accent} />
          <text x="40" y="18" fontSize="13" fontWeight="700" fill="#0f172a">視認率</text>
          <text x="40" y="32" fontSize="11" fill="#64748b">90%</text>
        </g>
        <g transform="translate(244 150)">
          <rect width="112" height="40" rx="20" fill="#fff" stroke="#e2e8f0" />
          <path d="M18 20 a6 6 0 0 1 6 -6 v12 a6 6 0 0 1 -6 -6z M26 14 l8 -5 v22 l-8 -5z" fill={accent} />
          <text x="42" y="18" fontSize="12" fontWeight="700" fill="#0f172a">音声あり</text>
          <text x="42" y="32" fontSize="10" fill="#64748b">標準仕様</text>
        </g>
        <g transform="translate(232 330)">
          <rect width="120" height="40" rx="20" fill="#fff" stroke="#e2e8f0" />
          <rect x="14" y="12" width="16" height="16" rx="3" fill={accent} />
          <text x="38" y="18" fontSize="12" fontWeight="700" fill="#0f172a">QR動線</text>
          <text x="38" y="32" fontSize="10" fill="#64748b">即アクション</text>
        </g>
      </g>
    </svg>
  );
}

// 個室トイレ：壁掛け縦型サイネージの設置シーン
export function RestroomVisual({ className }: { className?: string }) {
  const accent = ACCENT_HEX.toilet;
  return (
    <svg viewBox="0 0 480 360" className={className} role="img" aria-label="個室トイレへのサイネージ設置イメージ">
      <rect width="480" height="360" rx="16" fill="#eef2f7" />
      {/* タイル壁 */}
      <g stroke="#dbe3ee" strokeWidth="2">
        {[60, 120, 180, 240, 300].map((y) => (
          <line key={y} x1="24" y1={y} x2="456" y2={y} />
        ))}
        {[120, 240, 360].map((x) => (
          <line key={x} x1={x} y1="24" x2={x} y2="336" />
        ))}
      </g>
      {/* 床 */}
      <rect x="0" y="312" width="480" height="48" fill="#e2e8f0" />
      {/* 個室ドア枠（右） */}
      <rect x="372" y="40" width="84" height="272" rx="6" fill="#cbd5e1" opacity="0.5" />
      {/* 縦型サイネージ */}
      <g transform="translate(150 78)">
        <rect x="-10" y="-10" width="150" height="230" rx="16" fill="#0b1220" />
        <rect x="0" y="0" width="130" height="210" rx="8" fill="#f8fafc" />
        <AdContent x={10} y={12} w={110} h={186} accent={accent} gid="ad-restroom" />
        {/* 取り付けビス */}
        <circle cx="65" cy="-4" r="2.5" fill="#334155" />
      </g>
      {/* 人感センサー吹き出し */}
      <g transform="translate(300 96)">
        <rect width="150" height="44" rx="10" fill="#fff" stroke="#e2e8f0" />
        <circle cx="22" cy="22" r="9" fill={accent} opacity="0.15" />
        <circle cx="22" cy="22" r="4" fill={accent} />
        <text x="38" y="19" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="var(--font-display),sans-serif">人感センサー</text>
        <text x="38" y="33" fontSize="10" fill="#64748b" fontFamily="var(--font-sans),sans-serif">入室で自動再生</text>
      </g>
    </svg>
  );
}

// コインランドリー：大画面サイネージ＋洗濯機の設置シーン
export function LaundromatVisual({ className }: { className?: string }) {
  const accent = ACCENT_HEX.laundry;
  return (
    <svg viewBox="0 0 480 360" className={className} role="img" aria-label="コインランドリーへの大画面サイネージ設置イメージ">
      <rect width="480" height="360" rx="16" fill="#eaf4fb" />
      <rect x="0" y="250" width="480" height="110" fill="#dfeaf3" />
      {/* 55インチ大画面（横長・壁掛け） */}
      <g transform="translate(96 36)">
        <rect x="-10" y="-10" width="298" height="186" rx="14" fill="#0b1220" />
        <rect x="0" y="0" width="278" height="166" rx="8" fill="#f8fafc" />
        {/* 横長広告 */}
        <rect x="14" y="14" width="160" height="138" rx="6" fill={accent} opacity="0.85" />
        <circle cx="56" cy="62" r="20" fill="#fff" opacity="0.85" />
        <rect x="86" y="44" width="74" height="12" rx="4" fill="#fff" opacity="0.85" />
        <rect x="86" y="64" width="56" height="10" rx="4" fill="#fff" opacity="0.6" />
        <rect x="14" y="120" width="120" height="20" rx="5" fill="#fff" />
        <rect x="190" y="20" width="74" height="14" rx="4" fill="#0f172a" />
        <rect x="190" y="42" width="60" height="10" rx="3" fill="#94a3b8" />
        <rect x="190" y="64" width="64" height="22" rx="6" fill={accent} />
        <QrGrid x={206} y={102} size={42} color="#0f172a" />
        {/* 55inch ラベル */}
        <text x="139" y="200" fontSize="12" fontWeight="700" fill="#475569" textAnchor="middle" fontFamily="var(--font-display),sans-serif">55インチ 大画面サイネージ</text>
      </g>
      {/* 音声ありバッジ */}
      <g transform="translate(360 60)">
        <rect width="104" height="40" rx="20" fill="#fff" stroke="#e2e8f0" />
        <path d="M20 20 a6 6 0 0 1 6 -6 v12 a6 6 0 0 1 -6 -6z M28 14 l8 -5 v22 l-8 -5z" fill={accent} />
        <path d="M40 14 q5 6 0 12 M44 11 q9 9 0 18" stroke={accent} strokeWidth="2" fill="none" />
        <text x="58" y="24" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="var(--font-display),sans-serif">音声</text>
      </g>
      {/* 洗濯機の列 */}
      <g transform="translate(40 258)">
        {[0, 110, 220, 330].map((dx) => (
          <g key={dx} transform={`translate(${dx} 0)`}>
            <rect x="0" y="0" width="94" height="86" rx="8" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="47" cy="48" r="26" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="47" cy="48" r="14" fill="#dbe7f1" />
            <rect x="12" y="10" width="40" height="8" rx="4" fill="#e2e8f0" />
            <circle cx="76" cy="14" r="4" fill={accent} opacity="0.6" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function MediaVisual({ media, className }: { media: MediaKey; className?: string }) {
  if (media === "laundry") return <LaundromatVisual className={className} />;
  return <RestroomVisual className={className} />;
}
