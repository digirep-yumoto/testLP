import { mediaList, company } from "@/lib/site-data";

const navGroups = [
  {
    title: "メディア",
    links: mediaList.map((m) => ({ href: `#${m.key}`, label: m.name })),
  },
  {
    title: "サービス",
    links: [
      { href: "#why", label: "選ばれる理由" },
      { href: "#flow", label: "ご利用の流れ" },
      { href: "/blog", label: "お役立ち記事" },
      { href: "#faq", label: "よくあるご質問" },
    ],
  },
  {
    title: "お申込み",
    links: [
      { href: "/apply-form.html", label: "広告主お申込みフォーム" },
      { href: `mailto:${company.email}`, label: "お問い合わせ" },
      { href: "#company", label: "会社概要" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-brand font-display text-lg font-extrabold text-white">
                D
              </span>
              <span className="font-display text-lg font-bold tracking-wide">DigiRep</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              {company.tagline}。生活導線の閉鎖空間で、確実な接触と可視化された効果を提供します。
            </p>
            <dl className="mt-5 space-y-1.5 text-xs text-white/60">
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 text-white/40">所在地</dt>
                <dd>{company.address}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 text-white/40">TEL</dt>
                <dd>
                  <a href={`tel:${company.tel.replace(/-/g, "")}`} className="hover:text-white">
                    {company.tel}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 text-white/40">Mail</dt>
                <dd>
                  <a href={`mailto:${company.email}`} className="hover:text-white">
                    {company.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {navGroups.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-bold text-white">{g.title}</p>
                <ul className="mt-3 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-white/65 transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/55">
            <a href="/privacy" className="transition-colors hover:text-white">プライバシーポリシー</a>
            <a href="/tokushoho" className="transition-colors hover:text-white">特定商取引法に基づく表記</a>
            <span className="text-white/40">{company.name}（媒体運営）</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
