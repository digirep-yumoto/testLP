"use client";

import { useEffect, useRef, useState } from "react";
import { survey, steps, PREFS, isVisible, type Answers, type Q } from "@/lib/survey-data";

const DRAFT_KEY = `survey_draft_${survey.id}`;
const DONE_KEY = `survey_done_${survey.id}`;
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* 保存できなくても回答は続けられる */ } },
  del(k: string) { try { localStorage.removeItem(k); } catch { /* noop */ } },
};

// GA4 への記録（本番のみ読み込まれる）。経路（チラシ／LINE／モニター）ごとに、開いた→始めた→各ページ→送信 の進み具合を見る
function track(event: string, source: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, { survey_id: survey.id, survey_source: source || "direct", ...params });
}

// 画面の並び： -1=はじめに / 0..3=設問 / 4=抽選の応募と送信 / 5=完了
const ENTRY = steps.length;
const DONE = steps.length + 1;

export function LaundrySurveyForm({ source, preview }: { source: string; preview: boolean }) {
  const [screen, setScreen] = useState(-1);
  const [answers, setAnswers] = useState<Answers>({});
  const [wantsPrize, setWantsPrize] = useState(true);
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState("");
  const [missing, setMissing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [already, setAlready] = useState(false);
  const [resumed, setResumed] = useState(false);
  const startedAt = useRef(0);
  const top = useRef<HTMLDivElement>(null);

  // 回答済みの印と下書きは端末の保存領域にあるので、表示のあとで読み込む
  useEffect(() => {
    const t = setTimeout(() => {
      track("survey_view", source);
      if (store.get(DONE_KEY) && !preview) { setAlready(true); return; }
      const d = store.get(DRAFT_KEY);
      if (!d) return;
      try {
        const j = JSON.parse(d);
        if (j.answers && Object.keys(j.answers).length) { setAnswers(j.answers); setResumed(true); }
      } catch { /* 壊れた下書きは無視 */ }
    }, 0);
    return () => clearTimeout(t);
  }, [preview, source]);

  useEffect(() => {
    if (screen >= 0 && screen < DONE) store.set(DRAFT_KEY, JSON.stringify({ answers }));
  }, [answers, screen]);

  const go = (n: number) => {
    setScreen(n); setMissing(null); setError("");
    requestAnimationFrame(() => top.current?.scrollIntoView({ block: "start" }));
  };
  const start = () => { if (!startedAt.current) startedAt.current = Date.now(); track("survey_start", source, { resumed }); go(0); };

  const pick = (q: Q, opt: string) => {
    setMissing(null);
    setAnswers((a) => {
      if (q.type !== "multi") return { ...a, [q.id]: opt };
      const cur = Array.isArray(a[q.id]) ? (a[q.id] as string[]) : [];
      let next: string[];
      if (cur.includes(opt)) next = cur.filter((o) => o !== opt);
      else if (q.exclusive === opt) next = [opt];
      else {
        next = [...cur.filter((o) => o !== q.exclusive), opt];
        if (q.max && next.length > q.max) return a;
      }
      return { ...a, [q.id]: next };
    });
  };

  const next = () => {
    const miss = steps[screen].questions.find((q) => {
      if (!q.required || !isVisible(q, answers)) return false;
      const v = answers[q.id];
      return v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
    });
    if (miss) {
      setMissing(miss.id);
      document.getElementById(`q-${miss.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    track("survey_step_done", source, { step: screen + 1, step_name: steps[screen].key });
    go(screen + 1);
  };

  const submit = async () => {
    setError("");
    if (wantsPrize && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.trim())) { setError("メールアドレスをご確認ください。"); return; }
    if (!agree) { setError("個人情報の取扱いへの同意にチェックを入れてください。"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, wantsPrize, email: wantsPrize ? email.trim() : "", agree, source, website, elapsedSec: Math.round((Date.now() - startedAt.current) / 1000) }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { track("survey_submit_error", source, { status: res.status }); setError(j.error || "送信できませんでした。もう一度お試しください。"); return; }
      track("survey_submit", source, { prize_entry: wantsPrize, seconds: Math.round((Date.now() - startedAt.current) / 1000) });
      store.del(DRAFT_KEY);
      if (!preview) store.set(DONE_KEY, "1");
      go(DONE);
    } catch {
      setError("通信できませんでした。電波のよい場所で、もう一度「送信する」を押してください。");
    } finally {
      setSending(false);
    }
  };

  if (already) {
    return (
      <Card>
        <p className="text-4xl">🙏</p>
        <h2 className="font-sans mt-3 text-xl font-bold text-ink">ご回答ありがとうございました</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">この端末からは、すでにご回答をいただいています。抽選の結果は、当選された方へメールでお知らせします。</p>
      </Card>
    );
  }

  const pct = screen < 0 ? 0 : Math.round((Math.min(screen, ENTRY) / (ENTRY + 1)) * 100);

  return (
    <div ref={top} className="scroll-mt-4">
      {preview && <p className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900">公開前の確認表示です（受付開始前）。送信した回答には「確認用」の印が付きます。</p>}

      {screen === -1 && (
        <div>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-[#35b4e8] p-6 text-white shadow-lg">
            <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">ご利用のみなさまへ</p>
            <h1 className="font-sans mt-3 text-[26px] font-black leading-tight">約{survey.minutes}分のアンケートに<br />ご協力ください</h1>
            <div className="mt-5 rounded-2xl bg-white p-4 text-ink">
              <p className="text-xs font-bold text-brand">お答えいただいた方の中から抽選で</p>
              <p className="mt-1 text-xl font-black leading-snug">{survey.prize}を<br /><span className="text-3xl text-[#e8590c]">{survey.winners}名さま</span>にプレゼント</p>
            </div>
          </div>
          <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold text-ink">
            <li className="rounded-2xl bg-white p-3 shadow-sm"><span className="block text-xl">⏱</span>約{survey.minutes}分</li>
            <li className="rounded-2xl bg-white p-3 shadow-sm"><span className="block text-xl">👆</span>えらぶだけ</li>
            <li className="rounded-2xl bg-white p-3 shadow-sm"><span className="block text-xl">🔒</span>名前は不要</li>
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-ink-soft">{survey.partner}を、もっと便利で役に立つ場所にするためのアンケートです。洗濯の待ち時間に、気軽にお答えください。</p>
          {resumed && <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-bold text-brand">前回の途中までの回答が残っています。続きから答えられます。</p>}
          <button type="button" onClick={start} className="mt-5 w-full rounded-full bg-[#e8590c] py-4 text-lg font-black text-white shadow-lg active:scale-[0.98]">
            {resumed ? "続きから答える" : "アンケートをはじめる"}
          </button>
          <p className="mt-3 text-center text-xs text-ink-soft">しめきり：{survey.closeLabel} まで</p>
        </div>
      )}

      {screen >= 0 && screen < DONE && (
        <div>
          <div className="sticky top-0 z-10 -mx-4 bg-paper/95 px-4 pb-3 pt-3 backdrop-blur">
            <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
              <span>{screen < ENTRY ? `${screen + 1} / ${ENTRY}　${steps[screen].title}` : "さいごに"}</span>
              <span>{screen < ENTRY ? `あと${ENTRY - screen}ページ` : "あと少し"}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${Math.max(pct, 6)}%` }} />
            </div>
          </div>

          {screen < ENTRY && (
            <div>
              <p className="mt-2 text-sm text-ink-soft">{steps[screen].lead}</p>
              {steps[screen].questions.filter((q) => isVisible(q, answers)).map((q) => (
                <Question key={q.id} q={q} value={answers[q.id]} missing={missing === q.id} onPick={(o) => pick(q, o)}
                  onText={(v) => { setMissing(null); setAnswers((a) => ({ ...a, [q.id]: v })); }} />
              ))}
              {missing && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" role="alert">まだ答えていない質問があります。</p>}
            </div>
          )}

          {screen === ENTRY && (
            <div className="mt-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="font-sans text-lg font-black text-ink">🎁 プレゼントの抽選に応募しますか？</h2>
                <p className="mt-1 text-sm text-ink-soft">{survey.prize}（{survey.winners}名さま）</p>
                <div className="mt-4 grid gap-2">
                  <Chip on={wantsPrize} onClick={() => setWantsPrize(true)} label="応募する（メールアドレスを入力）" />
                  <Chip on={!wantsPrize} onClick={() => setWantsPrize(false)} label="応募しない（アンケートだけ送る）" />
                </div>
                {wantsPrize && (
                  <label className="mt-4 block">
                    <span className="text-sm font-bold text-ink">メールアドレス</span>
                    <input type="email" inputMode="email" autoComplete="email" autoCapitalize="off" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com"
                      className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none focus:border-brand" />
                    <span className="mt-1 block text-xs text-ink-soft">当選のご連絡とギフトカードの送付だけに使います。広告メールは送りません。</span>
                  </label>
                )}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-5 text-xs leading-relaxed text-ink-soft shadow-sm">
                <p className="font-bold text-ink">個人情報の取扱いについて</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>このアンケートは {survey.organizer} が実施します。</li>
                  <li>回答は、個人がわからない形にまとめた集計結果として、{survey.partner}の運営会社および店内モニターの運営会社と共有し、サービスの改善と店内でお届けする情報の検討に使います。</li>
                  <li>メールアドレスは抽選と当選のご連絡だけに使い、ほかの会社には渡しません。抽選とプレゼントの送付が終わりしだい削除します。</li>
                  <li>プレゼントは {survey.sponsor} の提供です。</li>
                  <li>くわしくは <a href="/privacy" target="_blank" rel="noopener" className="font-bold text-brand underline">プライバシーポリシー</a> をご覧ください。</li>
                </ul>
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-slate-200 p-3 text-sm font-bold text-ink">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#0478bd]" />
                  <span>上記に同意して回答を送信します</span>
                </label>
              </div>
              {/* 人には見えない欄（自動投稿よけ） */}
              <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
              {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" role="alert">{error}</p>}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => go(screen - 1)} className="rounded-full border-2 border-slate-300 bg-white px-5 py-4 text-sm font-bold text-ink-soft">もどる</button>
            {screen < ENTRY ? (
              <button type="button" onClick={next} className="flex-1 rounded-full bg-brand py-4 text-lg font-black text-white shadow-lg active:scale-[0.98]">つぎへ</button>
            ) : (
              <button type="button" onClick={submit} disabled={sending} className="flex-1 rounded-full bg-[#e8590c] py-4 text-lg font-black text-white shadow-lg active:scale-[0.98] disabled:opacity-60">{sending ? "送信中…" : "送信する"}</button>
            )}
          </div>
        </div>
      )}

      {screen === DONE && (
        <Card>
          <p className="text-5xl">🎉</p>
          <h2 className="font-sans mt-3 text-2xl font-black text-ink">ありがとうございました！</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            ご回答を受け付けました。{wantsPrize ? `抽選の結果は、当選された方へメールでお知らせします（${survey.closeLabel}のしめきり後に抽選します）。` : "いただいた声は、サービスの改善に役立てます。"}
          </p>
          <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm font-bold text-ink">洗濯が終わるまで、ごゆっくりお過ごしください。</p>
        </Card>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl bg-white p-8 text-center shadow-sm">{children}</div>;
}

function Chip({ on, onClick, label, multi, disabled }: { on: boolean; onClick: () => void; label: string; multi?: boolean; disabled?: boolean }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} disabled={disabled}
      className={`flex min-h-12 items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-[15px] font-bold leading-snug transition-colors ${on ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-ink"} ${disabled ? "opacity-40" : "active:scale-[0.98]"}`}>
      <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 text-xs ${multi ? "rounded-md" : "rounded-full"} ${on ? "border-white bg-white text-brand" : "border-slate-300"}`}>{on ? "✓" : ""}</span>
      <span>{label}</span>
    </button>
  );
}

function Question({ q, value, missing, onPick, onText }: { q: Q; value: string | string[] | undefined; missing: boolean; onPick: (o: string) => void; onText: (v: string) => void }) {
  const arr = Array.isArray(value) ? value : [];
  const full = !!q.max && arr.length >= q.max;
  return (
    <fieldset id={`q-${q.id}`} className={`mt-4 rounded-2xl bg-white p-4 shadow-sm ${missing ? "ring-2 ring-red-500" : ""}`}>
      <legend className="float-left mb-3 w-full text-base font-black leading-snug text-ink">
        {q.label}
        {!q.required && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 align-middle text-[11px] font-bold text-ink-soft">任意</span>}
        {q.help && q.required && <span className="mt-0.5 block text-xs font-bold text-brand">{q.help}{q.max ? `（いま${arr.length}つ）` : ""}</span>}
        {q.help && !q.required && <span className="mt-0.5 block text-xs font-medium text-ink-soft">{q.help}</span>}
      </legend>
      <div className="clear-both">
        {(q.type === "single" || q.type === "multi") && (
          <div className={`grid gap-2 ${q.options!.every((o) => o.length <= 9) ? "grid-cols-2" : "grid-cols-1"}`}>
            {q.options!.map((o) => {
              const on = q.type === "multi" ? arr.includes(o) : value === o;
              return <Chip key={o} label={o} multi={q.type === "multi"} on={on} disabled={full && !on && o !== q.exclusive} onClick={() => onPick(o)} />;
            })}
          </div>
        )}
        {q.type === "pref" && (
          <select value={typeof value === "string" ? value : ""} onChange={(e) => onText(e.target.value)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-bold text-ink outline-none focus:border-brand">
            <option value="">えらんでください</option>
            {PREFS.map((p) => <option key={p}>{p}</option>)}
          </select>
        )}
        {q.type === "text" && (q.id === "free" ? (
          <textarea value={typeof value === "string" ? value : ""} onChange={(e) => onText(e.target.value)} maxLength={400} rows={3} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none focus:border-brand" />
        ) : (
          <input type="text" value={typeof value === "string" ? value : ""} onChange={(e) => onText(e.target.value)} maxLength={60} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none focus:border-brand" />
        ))}
      </div>
    </fieldset>
  );
}
