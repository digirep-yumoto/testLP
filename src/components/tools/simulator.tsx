"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Info, Sparkles, Wallet, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { accent } from "@/components/site/accent";
import { ResultPanel } from "./simulator-result";
import { PlanOptions } from "./simulator-plans";
import {
  buildPlanOptions,
  decodeInput,
  defaultInput,
  encodeInput,
  industries,
  laundryPackages,
  maxStoresForBudget,
  objectives,
  simulate,
  LAUNDRY_TOTAL_STORES,
  type Objective,
  type SimInput,
  type SimMedia,
} from "@/lib/simulator";

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
  const [industryId, setIndustryId] = useState<string>(industries[0].id);
  const [objectiveId, setObjectiveId] = useState<Objective>(objectives[0].id);
  const [touchedMedia, setTouchedMedia] = useState(false);
  const [input, setInput] = useState<SimInput>(defaultInput);
  const [mode, setMode] = useState<"scale" | "budget">("scale");
  const [budget, setBudget] = useState(300000);

  // URLで共有された条件を復元（?m=...&s=... 形式）
  useEffect(() => {
    const restored = decodeInput(window.location.search);
    if (!restored) return;
    setInput(restored.input);
    setIndustryId(restored.industryId);
    setObjectiveId(restored.objectiveId);
    setTouchedMedia(true);
  }, []);

  const industry = industries.find((i) => i.id === industryId) ?? industries[0];
  const objective = objectives.find((o) => o.id === objectiveId) ?? objectives[0];
  // 媒体はユーザーが自分で切り替えるまで、業種診断の推奨に自動追従する
  const media: SimMedia = touchedMedia ? input.media : industry.rec;

  // 予算モードのときは、月予算に収まる最大の店舗数へ置き換える
  const effective: SimInput = useMemo(() => {
    const base = { ...input, media };
    if (mode !== "budget") return base;
    const s = maxStoresForBudget(base, budget);
    if (s <= 0) return base;
    return media === "toilet" ? { ...base, stores: s } : { ...base, laundryStores: s };
  }, [input, media, mode, budget]);

  const outcome = useMemo(() => simulate(effective), [effective]);
  const plans = useMemo(() => buildPlanOptions(effective), [effective]);
  const budgetFits = mode !== "budget" || (outcome.ok && outcome.monthlyExclTax <= budget);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${window.location.pathname}?${encodeInput(
      effective,
      industryId,
      objectiveId,
    )}`;
  }, [effective, industryId, objectiveId]);

  const set = <K extends keyof SimInput>(k: K, v: SimInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const a = accent[media];

  return (
    <div className="grid gap-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
        {/* ================= 入力 ================= */}
        <div className="sim-print-hide grid gap-5">
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
                    "rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5",
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

          <Card
            step="04"
            title="配信規模"
            desc="規模から試算するか、月の予算から逆算するかを選べます。"
          >
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              <ModeTab active={mode === "scale"} onClick={() => setMode("scale")} icon={SlidersHorizontal}>
                規模から試算
              </ModeTab>
              <ModeTab active={mode === "budget"} onClick={() => setMode("budget")} icon={Wallet}>
                予算から逆算
              </ModeTab>
            </div>

            {mode === "budget" && (
              <div className="mb-5 rounded-2xl border border-brand/30 bg-brand/5 p-4">
                <NumberField
                  label="月あたりのご予算（税別）"
                  unit="円"
                  value={budget}
                  min={30000}
                  max={5000000}
                  step={10000}
                  onChange={setBudget}
                  presets={[100000, 300000, 500000, 1000000]}
                />
                <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                  {budgetFits && outcome.ok ? (
                    <>
                      ご予算内なら
                      <strong className="mx-1 text-ink">
                        {(media === "toilet"
                          ? effective.stores
                          : effective.pkg === "national"
                            ? LAUNDRY_TOTAL_STORES
                            : effective.laundryStores
                        ).toLocaleString("ja-JP")}
                        店
                      </strong>
                      に配信できます。
                    </>
                  ) : (
                    <span className="font-bold text-destructive">
                      この予算では最小構成に届きません。予算を上げるか、条件を変更してください。
                    </span>
                  )}
                </p>
              </div>
            )}

            {media === "toilet" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {mode === "scale" && (
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
                )}
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
                  ) : mode === "scale" ? (
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
                  ) : null}
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
                    m === effective.months
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
          {outcome.ok ? (
            <ResultPanel
              // 媒体を切り替えたら結果パネルを作り直す（成果試算の仮定値を既定へ戻す）
              key={media}
              result={outcome}
              input={effective}
              industryId={industryId}
              industryLabel={industry.label}
              objectiveLabel={objective.label}
              shareUrl={shareUrl}
            />
          ) : (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
              <p className="text-sm font-bold text-destructive">{outcome.error}</p>
              <p className="mt-2 text-sm text-ink-soft">条件を変更して再度お試しください。</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= 3プラン提案 ================= */}
      <div className="sim-print-hide">
        <PlanOptions
          plans={plans}
          current={effective}
          onSelect={(next) => {
            setMode("scale");
            setTouchedMedia(true);
            setInput(next);
          }}
        />
      </div>
    </div>
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

function ModeTab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-bold transition-colors",
        active ? "bg-card text-brand shadow-sm" : "text-ink-soft hover:text-ink",
      )}
    >
      <Icon className="size-4" />
      {children}
    </button>
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
