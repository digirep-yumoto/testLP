import { SectionHeading } from "./section-heading";
import { company } from "@/lib/site-data";

const rows: { k: string; v: string }[] = [
  { k: "会社名", v: `${company.name}（${company.nameEn}）` },
  { k: "代表者", v: company.representative },
  { k: "設立", v: company.founded },
  { k: "所在地", v: company.address },
  { k: "電話番号", v: company.tel },
  { k: "お問い合わせ", v: company.email },
  { k: "事業内容", v: "デジタルサイネージ広告メディアの運営（個室トイレ／コインランドリー）、広告枠の企画・販売、クリエイティブ制作" },
  { k: "導入実績", v: `個人店を含む${company.stores}に導入（順次拡大中）` },
];

export function Company() {
  return (
    <section id="company" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading eyebrow="Company" title="会社概要" />

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <dl className="divide-y divide-border">
            {rows.map((r) => (
              <div key={r.k} className="grid grid-cols-1 gap-1 px-6 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
                <dt className="text-sm font-bold text-ink-soft">{r.k}</dt>
                <dd className="text-sm leading-relaxed text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
