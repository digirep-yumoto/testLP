"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCopy,
  Loader2,
  Send,
  Sparkles,
  Calculator,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { accent } from "@/components/site/accent";
import {
  defaultInput,
  industries,
  laundryPackages,
  objectives,
  resultToText,
  simulate,
  LAUNDRY_TOTAL_STORES,
  type SimInput,
  type SimMedia,
} from "@/lib/simulator";

// GA4 / Meta イベント送信（読み込まれていれば送る）
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

const mediaMeta: Record<SimMedia, { name: string; tag: string; sub: string }> = {
  toilet: {
    name: "個室トイレサイネージ",
    tag: "QUALITY ｜ 量より質",
    sub: "1対1・強制視聴・音ありで“濃く”刺す",
  },
  laundry: {
    name: "コインランドリーサイネージ",
    tag: "FREQUENCY ｜ 質より量と頻度",
    sub: "同一ターゲットに“超・高頻度”で刷り込む",
  },
};

export function Simulator() {
  const [industryId, setIndustryId] = useState(industries[0].id);
  const [objectiveId, setObjectiveId] = useState(objectives[0].id);
  const [touchedMedia, setTouchedMedia] = useState(false);
  const [input, setInput] = useState<SimInput>(defaultInput);

  const industry = industries.find((i) => i.id === industryId) ?? industries[0];
  const objective = objectives.find((o) => o.id === objectiveId) ?? objectives[0];
  // 媒体はユーザーが自分で切り替えるまで、業種診断の推奨に自動追従する
  const media: SimMedia = touchedMedia ? input.media : industry.rec;

  const outcome = useMemo(() => simulate({ ...input, media }), [input, media]);

  const set = <K extends keyof SimInput>(k: K, v: SimInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const a = accent[media];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      {/* ================= 入力 ================= */}
      <div className="grid gap-5">
        <Card step="01" title="業種を選ぶ" desc="商材に合う媒体を自動で診断します。">
          <div className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <Chip
                key={i.id}
                active={i.id === industryId}
                onClick={() => {
                  setIndustryId(i.id);
                  setTouchedMedia(false);
                }}
              >
                {i.label}
              </Chip>
            ))}
          </div>

          <div className={cn("mt-5 rounded-2xl border p-4", a.border, a.softBg)}>
            <p className={cn("flex items-center gap-1.5 text-sm font-bold", a.text)}>
              <BadgeCheck className="size-4 shrink-0" />
              診断：{mediaMeta[industry.rec].name} がおすすめ
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{industry.why}</p>
            {industry.note && (
              <p className="mt-2 flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                {industry.note}
              </p>
            )}
          </div>
        </Card>

        <Card step="02" title="広告の目的" desc="ご提案の方向性の参考にします（試算には影響しません）。">
          <div className="grid gap-2 sm:grid-cols-3">
            {objectives.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setObjectiveId(o.id)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  o.id === objectiveId
                    ? "border-brand bg-brand/5"
                    : "border-border bg-background hover:border-brand/40",
                )}
              >
                <span className="block text-[13px] font-bold leading-snug text-ink">{o.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{o.hint}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card step="03" title="媒体を選ぶ" desc="診断結果から変更もできます。両方を比べてみてください。">
          <div className="grid gap-3 sm:grid-cols-2">
            {(["toilet", "laundry"] as SimMedia[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setTouchedMedia(true);
                  set("media", k);
                }}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  k === media
                    ? cn(accent[k].border, accent[k].softBg, "shadow-sm")
                    : "border-border bg-background hover:border-brand/40",
                )}
              >
                <span className={cn("text-[11px] font-bold tracking-wide", accent[k].text)}>
                  {mediaMeta[k].tag}
                </span>
                <span className="mt-1 block text-[15px] font-bold text-ink">{mediaMeta[k].name}</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
                  {mediaMeta[k].sub}
                </span>
                {k === industry.rec && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand ring-1 ring-brand/20">
                    <Sparkles className="size-3" />
                    診断おすすめ
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        <Card step="04" title="配信規模" desc="実際の店舗データ・料金表に基づいて試算します。">
          {media === "toilet" ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="配信する店舗数"
                unit="店"
                value={input.stores}
                min={1}
                max={500}
                step={1}
                onChange={(v) => set("stores", v)}
                presets={[1, 5, 10, 30]}
              />
              <NumberField
                label="1店あたりの月間来客数"
                unit="人"
                value={input.visitors}
                min={100}
                max={20000}
                step={100}
                onChange={(v) => set("visitors", v)}
                presets={[1500, 2500, 3500, 6000]}
                help="来客数でプラン（S/M/L/XL）が決まります。"
              />
            </div>
          ) : (
            <div className="grid gap-5">
              <div>
                <p className="mb-2 text-sm font-bold text-ink-soft">配信プラン</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {laundryPackages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        set("pkg", p.id);
                        if (p.id === "spot" && input.laundryStores < 10) set("laundryStores", 10);
                      }}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        p.id === input.pkg
                          ? "border-laundry bg-laundry/10"
                          : "border-border bg-background hover:border-laundry/50",
                      )}
                    >
                      <span className="block text-[13px] font-bold text-ink">{p.label}</span>
                      <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                        {p.note}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-bold text-ink-soft">動画の尺</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["15", "30"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("sec", s)}
                        className={cn(
                          "rounded-xl border py-2.5 text-sm font-bold transition-colors",
                          s === input.sec
                            ? "border-laundry bg-laundry/10 text-ink"
                            : "border-border bg-background text-ink-soft hover:border-laundry/50",
                        )}
                      >
                        {s}秒
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">30秒は15秒の1.5倍。</p>
                </div>

                {input.pkg === "national" ? (
                  <div>
                    <p className="mb-2 text-sm font-bold text-ink-soft">配信店舗数</p>
                    <div className="rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-[15px] font-bold text-ink">
                      全 {LAUNDRY_TOTAL_STORES} 店（一括配信）
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      全国一括パックは全店配信が対象です。
                    </p>
                  </div>
                ) : (
                  <NumberField
                    label="配信する店舗数"
                    unit="店"
                    value={input.laundryStores}
                    min={input.pkg === "spot" ? 10 : 1}
                    max={LAUNDRY_TOTAL_STORES}
                    step={1}
                    onChange={(v) => set("laundryStores", v)}
                    presets={input.pkg === "spot" ? [10, 30, 50, 100] : [10, 50, 100, 200]}
                    help={input.pkg === "spot" ? "スポットパックは最小10店〜です。" : undefined}
                  />
                )}
              </div>
            </div>
          )}
        </Card>

        <Card step="05" title="掲載期間" desc="2ヶ月で▲5%、3ヶ月で▲10%の継続割引が入ります。">
          <div className="grid grid-cols-3 gap-2">
            {([1, 2, 3] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => set("months", m)}
                className={cn(
                  "rounded-xl border py-3 text-sm font-bold transition-colors",
                  m === input.months
                    ? "border-brand bg-brand/5 text-ink"
                    : "border-border bg-background text-ink-soft hover:border-brand/40",
                )}
              >
                {m}ヶ月
                {m > 1 && (
                  <span className="ml-1 text-[11px] font-bold text-brand">
                    ▲{m === 2 ? 5 : 10}%
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            4ヶ月以上の長期出稿・複数店舗のボリューム調整は個別にご相談ください。
          </p>
        </Card>
      </div>

      {/* ================= 結果 ================= */}
      <div className="lg:sticky lg:top-24">
        <Result
          outcome={outcome}
          input={{ ...input, media }}
          industryLabel={industry.label}
          objectiveLabel={objective.label}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------

function Result({
  outcome,
  input,
  industryLabel,
  objectiveLabel,
}: {
  outcome: ReturnType<typeof simulate>;
  input: SimInput;
  industryLabel: string;
  objectiveLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  if (!outcome.ok) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm font-bold text-destructive">{outcome.error}</p>
        <p className="mt-2 text-sm text-ink-soft">条件を変更して再度お試しください。</p>
      </div>
    );
  }

  const r = outcome;
  const a = accent[r.media];
  const text = resultToText(input, r, industryLabel, objectiveLabel);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      track("simulator_copy", { media: r.media });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* クリップボード非対応環境では何もしない */
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="bg-ink px-6 py-5 text-white">
        <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-white/60 uppercase">
          <Calculator className="size-3.5" />
          Simulation Result
        </p>
        <p className="mt-1.5 text-[15px] font-bold leading-snug">{r.description}</p>
      </div>

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

      <div className="border-t border-border bg-paper px-6 py-5">
        <dl className="grid gap-2 text-sm">
          <Row k="月額（税別）" v={yen(r.monthlyExclTax)} />
          <Row k={`掲載期間 合計（税別）`} v={yen(r.subtotalExclTax)} strong />
          <Row k="お支払い目安（税込）" v={yen(r.totalInclTax)} />
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          料金は公開料金表に基づく概算です。動画制作・LP制作などの付帯費用は含みません。実際のお見積りは配信エリア・店舗の空き状況により変動します。
        </p>
      </div>

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
          出典：自社調査（n=1,000）および各媒体の広告主向け資料。想定値であり、成果を保証するものではありません。
        </p>
      </details>

      <div className="grid gap-2.5 border-t border-border px-6 py-5">
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            if (!open) track("simulator_open_form", { media: r.media });
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          この条件で無料相談・見積り
          <ArrowRight className="size-4" />
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand"
        >
          {copied ? <Check className="size-4 text-brand" /> : <ClipboardCopy className="size-4" />}
          {copied ? "コピーしました" : "結果をコピー"}
        </button>
      </div>

      {open && <SimLeadForm summary={text} media={r.media} />}
    </div>
  );
}

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
    <form onSubmit={submit} className="grid gap-3 border-t border-border bg-paper px-6 py-5">
      <p className="text-sm font-bold text-ink">
        この試算内容を添えて相談する
        <span className="ml-1.5 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
          無料
        </span>
      </p>
      <p className="-mt-1 text-xs leading-relaxed text-ink-soft">
        上の条件をそのまま担当へ送ります。営業の電話は行いません。
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

// --- 部品 -------------------------------------------------------------

const field =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

function Card({
  step,
  title,
  desc,
  children,
}: {
  step: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 font-display text-sm font-extrabold text-brand">
          {step}
        </span>
        <div>
          <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-soft sm:text-[13px]">{desc}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-[13px] font-bold transition-colors",
        active
          ? "border-brand bg-brand text-white"
          : "border-border bg-background text-ink-soft hover:border-brand/50 hover:text-brand",
      )}
    >
      {children}
    </button>
  );
}

function NumberField({
  label,
  unit,
  value,
  min,
  max,
  step,
  presets,
  help,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  presets?: number[];
  help?: string;
  onChange: (v: number) => void;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-ink-soft">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
          className={cn(field, "tabular-nums")}
        />
        <span className="shrink-0 text-sm font-bold text-ink-soft">{unit}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="mt-3 w-full accent-[var(--brand)]"
        aria-label={`${label}（スライダー）`}
      />
      {presets && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(clamp(p))}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors",
                value === p
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-background text-ink-soft hover:border-brand/40",
              )}
            >
              {p.toLocaleString("ja-JP")}
            </button>
          ))}
        </div>
      )}
      {help && <p className="mt-1.5 text-xs text-muted-foreground">{help}</p>}
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

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn("text-ink-soft", strong && "font-bold text-ink")}>{k}</dt>
      <dd
        className={cn(
          "shrink-0 font-bold tabular-nums text-ink",
          strong && "font-display text-xl text-brand",
        )}
      >
        {v}
      </dd>
    </div>
  );
}
