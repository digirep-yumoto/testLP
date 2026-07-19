"use client";

import { useEffect, useState } from "react";
import { X, MapPin, ChevronRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { chains as fallbackChains, PREF_POS, PREF_LIST, type Chain } from "@/lib/chains-data";
import { cn } from "@/lib/utils";

const COLS = 13;
const ROWS = 10;

function JapanMap({
  chain,
  selected,
  onSelect,
}: {
  chain: Chain;
  selected: string | null;
  onSelect: (p: string) => void;
}) {
  const avail = new Set(chain.prefs);
  return (
    <div className="overflow-x-auto">
      <div
        className="mx-auto grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(30px, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, 30px)`,
          maxWidth: 560,
        }}
      >
        {PREF_LIST.map((p) => {
          const [c, r] = PREF_POS[p];
          const isAvail = avail.has(p);
          const isSel = selected === p;
          return (
            <button
              key={p}
              type="button"
              disabled={!isAvail}
              onClick={() => isAvail && onSelect(p)}
              style={{ gridColumn: c, gridRow: r }}
              className={cn(
                "flex items-center justify-center rounded-[5px] text-[10px] font-bold leading-none transition-all",
                isAvail
                  ? isSel
                    ? "bg-brand-dark text-white ring-2 ring-brand/40"
                    : "cursor-pointer bg-brand text-white hover:scale-105 hover:bg-brand-dark"
                  : "bg-slate-100 text-slate-400",
              )}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChainModal({ chain, onClose }: { chain: Chain; onClose: () => void }) {
  const [pref, setPref] = useState<string | null>(null);
  const stores = pref ? chain.stores[pref] : undefined;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          {chain.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={chain.logo} alt={chain.name} className="h-9 w-auto max-w-[120px] object-contain" />
          )}
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-ink">{chain.name}</h3>
            <p className="text-xs text-ink-soft">配信可能エリアをタップすると店舗一覧が表示されます</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="ml-auto grid size-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {(chain.views || chain.audience || chain.storeCount || chain.type) && (
          <div className="border-b border-border bg-paper px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {typeof chain.storeCount === "number" && chain.storeCount > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground">登録店舗数</p>
                  <p className="font-display text-lg font-extrabold text-ink">
                    {chain.storeCount}
                    <span className="ml-0.5 text-xs font-bold text-ink-soft">店</span>
                  </p>
                </div>
              )}
              {typeof chain.views === "number" && chain.views > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground">全店配信時の想定月間視聴数</p>
                  <p className="font-display text-lg font-extrabold text-brand">
                    約{chain.views.toLocaleString()}
                    <span className="ml-0.5 text-xs font-bold text-ink-soft">回/月</span>
                  </p>
                </div>
              )}
              {chain.type && (
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground">業態</p>
                  <p className="text-sm font-bold text-ink">{chain.type}</p>
                </div>
              )}
            </div>
            {(chain.audience || chain.goods) && (
              <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs leading-relaxed">
                {chain.audience && (
                  <p>
                    <span className="font-bold text-ink">客層：</span>
                    <span className="text-ink-soft">{chain.audience}</span>
                  </p>
                )}
                {chain.goods && (
                  <p>
                    <span className="font-bold text-ink">相性の良い商材：</span>
                    <span className="text-ink-soft">{chain.goods}</span>
                  </p>
                )}
              </div>
            )}
            <p className="mt-2 text-[10px] text-muted-foreground">
              ※ 想定月間視聴数は「月間来客数 × 視認率」による試算値です。
            </p>
          </div>
        )}

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-ink">
              <MapPin className="size-4 text-brand" />
              配信可能エリア（{chain.prefs.length}都道府県）
            </p>
            <JapanMap chain={chain} selected={pref} onSelect={setPref} />
            <p className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-soft">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block size-3 rounded-[3px] bg-brand" />配信可能
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block size-3 rounded-[3px] bg-slate-100" />対象外
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-paper p-4">
            {!pref ? (
              <p className="flex h-full min-h-32 items-center justify-center text-center text-sm text-ink-soft">
                地図から配信可能エリア（青）を
                <br />
                タップしてください。
              </p>
            ) : (
              <div>
                <p className="border-b border-border pb-2 text-sm font-bold text-brand">{pref}</p>
                {stores && stores.length > 0 ? (
                  <ul className="mt-3 space-y-3">
                    {stores.map((s) => (
                      <li key={s.name} className="text-sm">
                        <p className="font-bold text-ink">{s.name}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">{s.addr}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {pref}で配信可能です。店舗一覧は準備中のため、担当までお問い合わせください。
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChainNetwork() {
  const [active, setActive] = useState<Chain | null>(null);
  const [chains, setChains] = useState<Chain[]>(fallbackChains);

  // デジレップスタジオからエクスポートした /data/chains.json があれば使用（無ければ現状データ）
  useEffect(() => {
    let alive = true;
    fetch("/data/chains.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && Array.isArray(d) && d.length > 0) setChains(d as Chain[]);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="chains" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Chain Network"
          title="デジレップ加盟店一覧"
          lead="ロゴをタップすると、そのチェーンの配信可能エリア（日本地図）と店舗一覧をご覧いただけます。加盟店は順次拡大中です。"
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {chains.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c)}
              className="group flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-xl"
            >
              {c.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-20 w-auto max-w-full object-contain transition-transform group-hover:scale-110"
                />
              ) : (
                <span className="text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                  {c.name}
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1 text-center text-sm font-medium text-brand">
          ロゴをタップして配信エリアを見る
          <ChevronRight className="size-4" />
        </p>
        <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
          ※ 店舗一覧は一部サンプル表示です。最新の配信可能店舗は担当までお問い合わせください。
        </p>
      </div>

      {active && <ChainModal chain={active} onClose={() => setActive(null)} />}
    </section>
  );
}
