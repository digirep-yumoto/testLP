import { ArrowRight, Calculator, Mail, FileText } from "lucide-react";
import { company } from "@/lib/site-data";

export function Cta() {
  return (
    <section id="contact" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-white shadow-xl sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 70% at 85% 0%, rgba(47,109,240,0.35) 0%, transparent 60%), radial-gradient(40% 60% at 0% 100%, rgba(14,165,233,0.2) 0%, transparent 55%)",
            }}
          />
          <div className="relative">
            <div className="max-w-2xl">
              <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
                まずは、貴社の商材に合わせた
                <br className="hidden sm:block" />
                無料シミュレーションから。
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/75">
                媒体・掲載期間・配信規模を選ぶだけで、想定リーチとお申込み金額がその場で分かります。お見積り・契約書もオンラインでご確認いただけます。
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/apply-form.html"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark active:translate-y-px"
              >
                <Calculator className="size-5" />
                広告主の方｜お申込み・シミュレーション
                <ArrowRight className="size-5" />
              </a>
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                <Mail className="size-5" />
                店舗オーナーの方・各種お問い合わせ
              </a>
            </div>

            <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              <FileText className="mt-0.5 size-4 shrink-0 text-sky-300" />
              <span>
                シミュレーションの金額はあくまで目安です。お申込み後、担当より内容確認のうえ、ご提案・お見積り・お支払い（請求書）のご案内をお送りします。表示金額はすべて税別です。
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
