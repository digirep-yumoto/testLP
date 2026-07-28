"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Calculator,
  Check,
  ClipboardCopy,
  Link2,
  Loader2,
  Printer,
  Quote,
  Send,
  ShieldCheck,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { accent } from "@/components/site/accent";
import { voices } from "@/lib/site-data";
import {
  defaultRates,
  estimateOutcome,
  resultToText,
  type SimInput,
  type SimMedia,
  type SimResult,
} from "@/lib/simulator";

function track(event: string, params: Record<string, unknown>) {
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
  };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
  if (event === "generate_lead" && typeof w.fbq === "function") w.fbq("track", "Lead", params);
}

const yen = (n: number) => `¥${Math.round(n).toLocaleString("ja-JP")}`;
const num = (n: number) => Math.round(n).toLocaleString("ja-JP");

export function ResultPanel({
  result,
  input,
  industryId,
  industryLabel,
  objectiveLabel,
  shareUrl,
}: {
  result: SimResult;
  input: SimInput;
  industryId: string;
  industryLabel: string;
  objectiveLabel: string;
  shareUrl: string;
}) {
  const r = result;
  const a = accent[r.media];

  const [rates, setRates] = useState(defaultRates[r.media]);
  const [copied, setCopied] = useState<"none" | "text" | "url">("none");
  const [open, setOpen] = useState(false);

  // 媒体が変わったら仮定値も既定に戻す
  const [lastMedia, setLastMedia] = useState<SimMedia>(r.media);
  if (lastMedia !== r.media) {
    setLastMedia(r.media);
    setRates(defaultRates[r.media]);
  }

  const est = useMemo(() => estimateOutcome(r, rates), [r, rates]);
  const text = resultToText(input, r, industryLabel, objectiveLabel, { est, rates });

  // 業種に近い活用イメージ（想定シナリオ）を1件だけ添える
  const voice = useMemo(() => {
    const pool = voices.filter((v) => v.accent === r.media);
    if (pool.length === 0) return null;
    const seed = industryId.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    return pool[seed % pool.length];
  }, [r.media, industryId]);

  async function copy(kind: "text" | "url") {
    try {
      await navigator.clipboard.writeText(kind === "text" ? text : shareUrl);
      setCopied(kind);
      track(kind === "text" ? "simulator_copy" : "simulator_share", { media: r.media });
      setTimeout(() => setCopied("none"), 2000);
    } catch {
      /* クリップボード非対応環境では何もしない */
    }
  }

  return (
    <div className="sim-result overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="bg-ink px-6 py-5 text-white">
        <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-white/60 uppercase">
          <Calculator className="size-3.5" />
          Simulation Result
        </p>
        <p className="mt-1.5 text-[15px] font-bold leading-snug">{r.description}</p>
        <p className="mt-1 text-xs text-white/55">{industryLabel}／{objectiveLabel}</p>
      </div>

      {/* --- 費用（最初に見せる） --- */}
      <div className="border-b border-border bg-paper px-6 py-5">
        <p className="text-[11px] font-bold text-muted-foreground">
          掲載期間 合計（{r.months}ヶ月・税別）
        </p>
        <p className="mt-1 font-display text-[2.1rem] font-extrabold leading-none tabular-nums text-brand">
          {yen(r.subtotalExclTax)}
        </p>
        <dl className="mt-3 grid gap-1.5 text-[13px]">
          <Row k="月額（税別）" v={yen(r.monthlyExclTax)} />
          <Row k="お支払い目安（税込）" v={yen(r.totalInclTax)} />
        </dl>
      </div>

      {/* --- 到達の内訳 --- */}
      <div className="grid gap-px bg-border sm:grid-cols-2">
        <Metric
          label={r.media === "toilet" ? "想定視聴機会 / 月" : "想定リーチ / 月"}
          value={num(r.reachPerMonth)}
          unit={r.media === "toilet" ? "回" : "人"}
          hint={r.media === "toilet" ? "個室に入った人の想定数" : "配信店舗の月間来店者"}
        />
        <Metric
          label={r.media === "toilet" ? "想定視認回数 / 月" : "想定接触回数 / 月"}
          value={num(r.contactsPerMonth)}
          unit="回"
          hint={r.media === "toilet" ? "視認率90%を適用" : "1来店あたり約7回の反復"}
          accentClass={a.text}
        />
        <Metric
          label={`期間合計の接触回数（${r.months}ヶ月）`}
          value={num(r.contactsTotal)}
          unit="回"
        />
        {r.media === "toilet" ? (
          <Metric
            label="1視聴あたりの単価"
            value={`¥${r.cpc.toFixed(1)}`}
            hint={`1対1・音ありのフル視聴1回あたり（CPM ${yen(r.cpm)}）`}
          />
        ) : (
          <Metric
            label="CPM（1,000接触あたり）"
            value={yen(r.cpm)}
            hint={`1接触あたり 約¥${r.cpc.toFixed(1)}`}
          />
        )}
      </div>

      {/* --- 成果の逆算（稟議で効く数字） --- */}
      <div className={cn("border-t border-border px-6 py-5", a.softBg)}>
        <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <Target className={cn("size-4", a.text)} />
          成果の試算（CPAを逆算）
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          反応率・CV率は<strong>仮置きの値</strong>です。御社の実績値に置き換えて計算できます。
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <RateField
            label="反応率（QR・指名検索など）"
            value={rates.response}
            min={0.1}
            max={5}
            step={0.1}
            onChange={(v) => setRates((p) => ({ ...p, response: v }))}
          />
          <RateField
            label="反応 → CV率（予約・購入など）"
            value={rates.cv}
            min={1}
            max={50}
            step={1}
            onChange={(v) => setRates((p) => ({ ...p, cv: v }))}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-border">
          <OutcomeCell label="想定アクション" value={num(est.actions)} unit="件" />
          <OutcomeCell label="想定CV" value={String(est.conversions)} unit="件" />
          <OutcomeCell label="想定CPA" value={yen(est.cpa)} strong accentClass={a.text} />
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          ※ 入力した仮定値による計算です。実際の成果は商材・クリエイティブ・導線により大きく変わり、成果を保証するものではありません。
        </p>
      </div>

      {/* --- 想定シナリオ（社会的証明） --- */}
      {voice && (
        <div className="border-t border-border px-6 py-5">
          <Quote className="size-4 text-brand/50" />
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{voice.quote}</p>
          <p className="mt-2 text-xs font-bold text-ink">
            {voice.cat}
            <span className="ml-2 font-normal text-muted-foreground">{voice.metric}</span>
          </p>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            ※ サービス特性に基づく想定シナリオであり、実際の導入事例ではありません。
          </p>
        </div>
      )}

      {/* --- 内訳 --- */}
      <details className="group border-t border-border px-6 py-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-ink-soft">
          計算の内訳を見る
          <span className="text-brand transition-transform group-open:rotate-90">›</span>
        </summary>
        <dl className="mt-3 grid gap-1.5 text-[13px]">
          {r.formula.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-ink-soft">{f.label}</dt>
              <dd className="shrink-0 font-bold text-ink tabular-nums">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          出典：自社調査（n=1,000）および各媒体の広告主向け資料。料金は公開料金表に基づく概算で、動画制作・LP制作等の付帯費用は含みません。
        </p>
      </details>

      {/* --- CTA --- */}
      <div className="sim-print-hide grid gap-2.5 border-t border-border px-6 py-5">
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            if (!open) track("simulator_open_form", { media: r.media });
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-[15px] font-bold text-white shadow-sm transition-all hover:bg-brand-dark active:translate-y-px"
        >
          この条件で無料相談・見積り
          <ArrowRight className="size-4" />
        </button>

        <div className="grid grid-cols-3 gap-2">
          <SubButton onClick={() => copy("text")} active={copied === "text"}>
            {copied === "text" ? <Check className="size-4" /> : <ClipboardCopy className="size-4" />}
            {copied === "text" ? "コピー済" : "結果をコピー"}
          </SubButton>
          <SubButton onClick={() => copy("url")} active={copied === "url"}>
            {copied === "url" ? <Check className="size-4" /> : <Link2 className="size-4" />}
            {copied === "url" ? "コピー済" : "URLで共有"}
          </SubButton>
          <SubButton
            onClick={() => {
              track("simulator_print", { media: r.media });
              window.print();
            }}
          >
            <Printer className="size-4" />
            印刷・PDF
          </SubButton>
        </div>

        <ul className="mt-1 grid gap-1 text-[11px] text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 shrink-0 text-brand/60" />
            しつこい営業電話はいたしません
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 shrink-0 text-brand/60" />
            1営業日以内に担当より返信・媒体資料も同送
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 shrink-0 text-brand/60" />
            適格請求書（インボイス）対応・請求書払い
          </li>
        </ul>
      </div>

      {open && <SimLeadForm summary={text} media={r.media} />}
    </div>
  );
}

// ---------------------------------------------------------------------

function SimLeadForm({ summary, media }: { summary: string; media: SimMedia }) {
  const [f, setF] = useState({ name: "", company: "", email: "", tel: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErr("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          purpose: "料金・見積りを知りたい",
          media: media === "toilet" ? "個室トイレサイネージ" : "コインランドリーサイネージ",
          message: `流入元: 無料シミュレーター\n\n${summary}`,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "送信に失敗しました。");
      track("generate_lead", { source: "simulator", media });
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "送信に失敗しました。");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="border-t border-border bg-brand/5 px-6 py-7 text-center">
        <Check className="mx-auto size-10 text-brand" />
        <p className="mt-2 text-base font-bold text-ink">送信ありがとうございます</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          この試算内容をもとに、担当より1営業日以内にご連絡します。媒体資料もあわせてお送りします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="sim-print-hide grid gap-3 border-t border-border bg-paper px-6 py-5">
      <p className="text-sm font-bold text-ink">
        この試算内容を添えて相談する
        <span className="ml-1.5 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
          無料
        </span>
      </p>
      <p className="-mt-1 text-xs leading-relaxed text-ink-soft">
        上の条件をそのまま担当へ送ります。届いた内容をもとに、空き枠と正式なお見積りをご案内します。
      </p>
      <input type="email" required value={f.email} onChange={set("email")} placeholder="メールアドレス（必須）" className={field} />
      <input required value={f.name} onChange={set("name")} placeholder="お名前（必須）" className={field} />
      <input value={f.company} onChange={set("company")} placeholder="会社名（任意）" className={field} />
      <input type="tel" value={f.tel} onChange={set("tel")} placeholder="電話番号（任意）" className={field} />
      {state === "error" && <p className="text-sm font-medium text-destructive">{err}</p>}
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        試算内容を送って相談する
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        送信により
        <a href="/privacy" target="_blank" className="text-brand hover:underline">プライバシーポリシー</a>
        に同意したものとみなします。
      </p>
    </form>
  );
}

const field =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

function SubButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-[11px] font-bold transition-colors",
        active
          ? "border-brand bg-brand/5 text-brand"
          : "border-border bg-background text-ink-soft hover:border-brand hover:text-brand",
      )}
    >
      {children}
    </button>
  );
}

function RateField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-xs font-bold text-ink-soft">{label}</label>
        <span className="font-display text-sm font-extrabold tabular-nums text-ink">{value}%</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--brand)]"
        aria-label={label}
      />
    </div>
  );
}

function OutcomeCell({
  label,
  value,
  unit,
  strong,
  accentClass,
}: {
  label: string;
  value: string;
  unit?: string;
  strong?: boolean;
  accentClass?: string;
}) {
  return (
    <div className="bg-card px-3 py-3 text-center">
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 font-display font-extrabold leading-none tabular-nums text-ink",
          strong ? "text-[1.15rem]" : "text-[1.15rem]",
          accentClass,
        )}
      >
        {value}
        {unit && <span className="ml-0.5 text-[11px]">{unit}</span>}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  hint,
  accentClass,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  accentClass?: string;
}) {
  return (
    <div className="bg-card px-5 py-4">
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-[1.6rem] font-extrabold leading-none tabular-nums text-ink", accentClass)}>
        {value}
        {unit && <span className="ml-0.5 text-sm font-bold">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-soft">{k}</dt>
      <dd className="shrink-0 font-bold tabular-nums text-ink">{v}</dd>
    </div>
  );
}
