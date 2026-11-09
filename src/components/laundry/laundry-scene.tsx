/**
 * コインランドリー店内のイラスト（インラインSVG）。壁の55インチモニターに「御社の広告」を差し込んで見せる。
 * ad: モニターに表示する内容（見出し・サブ・色）。装飾のみの要素は aria-hidden。
 */
export type AdSample = {
  brand: string;
  headline: string;
  sub: string;
  color: string; // 画面の背景色
  accent: string; // 文字・アクセント
  cta: string;
};

export function LaundryScene({ ad, className = "" }: { ad: AdSample; className?: string }) {
  return (
    <svg viewBox="0 0 640 400" role="img" aria-label={`コインランドリー店内のモニターに${ad.brand}の広告が流れているイメージ`} className={className}>
      <defs>
        <linearGradient id="ls-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6fbfd" />
          <stop offset="1" stopColor="#e6f3f8" />
        </linearGradient>
        <linearGradient id="ls-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9e8ee" />
          <stop offset="1" stopColor="#c4d8e1" />
        </linearGradient>
        <linearGradient id="ls-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ad.color} />
          <stop offset="1" stopColor={ad.accent} stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="ls-light" cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ls-clip"><rect x="222" y="48" width="196" height="110" rx="6" /></clipPath>
      </defs>

      {/* 壁・床 */}
      <rect x="0" y="0" width="640" height="300" fill="url(#ls-wall)" />
      <rect x="0" y="300" width="640" height="100" fill="url(#ls-floor)" />
      <rect x="0" y="296" width="640" height="6" fill="#b9cdd6" />
      {/* 窓からの光 */}
      <ellipse cx="320" cy="0" rx="320" ry="150" fill="url(#ls-light)" />

      {/* 洗濯機の列（左右） */}
      {[40, 130, 480, 570].map((x, i) => (
        <g key={i} aria-hidden>
          <rect x={x} y="150" width="80" height="150" rx="8" fill="#ffffff" stroke="#cfdde4" strokeWidth="2" />
          <rect x={x + 8} y="160" width="64" height="18" rx="4" fill="#e9f2f6" />
          <circle cx={x + 40} cy="235" r="34" fill="#dbe9ef" stroke="#b9cdd6" strokeWidth="3" />
          <circle cx={x + 40} cy="235" r="24" fill="#a7d3e3" opacity="0.9" />
          <circle cx={x + 32} cy="226" r="7" fill="#ffffff" opacity="0.7" />
          <rect x={x + 14} y="286" width="52" height="4" rx="2" fill="#cfdde4" />
        </g>
      ))}

      {/* 壁掛けモニター（55インチ） */}
      <rect x="214" y="40" width="212" height="126" rx="10" fill="#0f1e33" />
      <rect x="222" y="48" width="196" height="110" rx="6" fill="url(#ls-screen)" />
      <g clipPath="url(#ls-clip)">
        <circle cx="400" cy="60" r="46" fill="#ffffff" opacity="0.12" />
        <circle cx="240" cy="150" r="60" fill="#ffffff" opacity="0.1" />
        <text x="236" y="76" fontSize="11" fontWeight="700" fill="#ffffff" opacity="0.9">{ad.brand}</text>
        <text x="236" y="102" fontSize="17" fontWeight="800" fill="#ffffff">{ad.headline}</text>
        <text x="236" y="122" fontSize="10.5" fill="#ffffff" opacity="0.92">{ad.sub}</text>
        <rect x="236" y="131" width="92" height="18" rx="9" fill="#ffffff" />
        <text x="282" y="143.5" fontSize="9.5" fontWeight="800" fill={ad.color} textAnchor="middle">{ad.cta}</text>
        {/* QRコード風 */}
        <rect x="382" y="118" width="30" height="30" rx="3" fill="#ffffff" />
        <g fill={ad.color}>
          <rect x="386" y="122" width="8" height="8" /><rect x="398" y="122" width="8" height="8" /><rect x="386" y="134" width="8" height="8" />
          <rect x="398" y="134" width="3" height="3" /><rect x="403" y="137" width="3" height="3" /><rect x="400" y="141" width="4" height="4" />
        </g>
      </g>
      {/* 音声の波 */}
      <g aria-hidden stroke="#0a7fa0" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8">
        <path d="M438 90 q6 13 0 26" /><path d="M448 82 q12 21 0 42" /><path d="M458 74 q18 29 0 58" />
      </g>
      <text x="320" y="186" fontSize="10" fontWeight="700" fill="#45576f" textAnchor="middle">55インチ・音声あり</text>

      {/* 待っている人（ベンチ） */}
      <g aria-hidden>
        <rect x="250" y="262" width="140" height="10" rx="4" fill="#9fb8c4" />
        <rect x="258" y="272" width="8" height="28" fill="#9fb8c4" /><rect x="374" y="272" width="8" height="28" fill="#9fb8c4" />
        {/* 人物1 */}
        <circle cx="290" cy="224" r="12" fill="#f4d7c3" />
        <path d="M278 222 q12 -18 24 0 q-12 -8 -24 0z" fill="#5b3a2e" />
        <rect x="276" y="236" width="28" height="28" rx="8" fill="#0a7fa0" />
        <rect x="282" y="248" width="16" height="10" rx="2" fill="#0f1e33" opacity="0.85" />
        {/* 人物2 */}
        <circle cx="346" cy="226" r="12" fill="#f1cdb4" />
        <path d="M333 226 q13 -22 26 0 q-13 -6 -26 0z" fill="#2b2b2b" />
        <rect x="332" y="238" width="28" height="26" rx="8" fill="#e8590c" />
        <rect x="338" y="246" width="16" height="10" rx="2" fill="#0f1e33" opacity="0.85" />
        {/* 洗濯かご */}
        <rect x="226" y="276" width="22" height="18" rx="3" fill="#ffd23f" />
        <rect x="229" y="270" width="16" height="6" rx="2" fill="#f5c400" />
      </g>
    </svg>
  );
}
