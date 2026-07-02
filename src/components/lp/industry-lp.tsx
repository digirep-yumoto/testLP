import { Check, ArrowRight, Phone } from "lucide-react";
import { company } from "@/lib/site-data";
import type { LpConfig } from "@/lib/lp-data";
import { LpLeadForm } from "./lp-lead-form";

export function IndustryLp({ lp }: { lp: LpConfig }) {
  return (
    <main className="bg-paper text-ink">
      {/* slim header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="DigiRep" className="h-9 w-auto" />
          <a href={`tel:${company.tel.replace(/-/g, "")}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand">
            <Phone className="size-4" />
            {company.tel}
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="inline-block rounded-full bg-brand/20 px-3 py-1 text-xs font-bold text-sky-200">
              {lp.badge}
            </p>
            <h1 className="mt-4 text-2xl font-bold leading-[1.4] sm:text-4xl sm:leading-[1.35]">
              {lp.h1.pre}
              <span className="text-sky-300">{lp.h1.highlight}</span>
              {lp.h1.post}
            </h1>
            <p className="mt-4 text-[15px] leading-[1.9] text-white/75">{lp.heroSub}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {lp.chips.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white/90">
                  <Check className="size-4 text-sky-300" />
                  {t}
                </span>
              ))}
            </div>
            <a href="#form" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-brand-dark">
              無料で相談・資料を受け取る
              <ArrowRight className="size-5" />
            </a>
          </div>
          <div className="lg:pt-2">
            <p className="mb-3 text-sm font-bold text-white">まずは無料相談・資料請求（1営業日以内にご連絡）</p>
            <LpLeadForm purpose={lp.formPurpose} media={lp.formMedia} source={lp.source} />
          </div>
        </div>
      </section>

      {/* pains */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-xl font-bold sm:text-2xl">{lp.painsTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {lp.pains.map((p) => (
            <div key={p} className="rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-ink-soft shadow-sm">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* reasons */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-xl font-bold sm:text-2xl">{lp.reasonsTitle}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {lp.reasons.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-paper p-6 shadow-sm">
                <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand">
                  <r.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* steps */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-brand/20 bg-brand/5 p-8 sm:p-10">
          <h2 className="text-xl font-bold sm:text-2xl">スモールスタート＋効果レポートで、リスクを抑えて始められます</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {lp.steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 rounded-xl bg-white p-4 text-sm font-medium text-ink shadow-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* form */}
      <section id="form" className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold">無料相談・資料請求</h2>
          <p className="mt-2 text-center text-sm text-white/70">
            商圏・ターゲットに合わせた配信イメージと概算をご案内します。1営業日以内に担当よりご連絡します。
          </p>
          <div className="mt-8">
            <LpLeadForm purpose={lp.formPurpose} media={lp.formMedia} source={lp.source} />
          </div>
        </div>
      </section>

      <footer className="bg-ink pb-10 text-center text-xs text-white/50">
        <div className="mx-auto max-w-5xl px-4">
          <p>{company.name}｜{company.address}｜{company.tel}</p>
          <p className="mt-2">
            <a href="/" className="hover:text-white">公式サイト</a>
            <span className="mx-2">/</span>
            <a href="/privacy" className="hover:text-white">プライバシーポリシー</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
