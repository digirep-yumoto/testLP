"use client";

import { useMemo, useState } from "react";
import { basics, questions, judge, type Answer } from "@/lib/package-check";
import { pkg, man } from "@/lib/package-data";

function track(event: string, params: Record<string, unknown>) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
}

const field = "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-brand";
const label = "mb-1 block text-sm font-bold text-ink";
type Basic = Record<keyof typeof basics, string>;

/**
 * 適用診断（セルフ版）。3画面：①基本情報 → ②10項目 → ③結果＋連絡先の送信。
 * 結果は画面に出し、送信するとデジレップに回答一式が届く（営業管理システムの適用診断と同じ並び）。
 */
export function PackageCheckForm() {
  const [step, setStep] = useState(0);
  const [b, setB] = useState<Basic>({ staff: "", sales: "", closing: "", stores: "1店舗", industry: "" });
  const [a, setA] = useState<Record<string, Answer>>({});
  const [c, setC] = useState({ company: "", name: "", email: "", tel: "", when: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [miss, setMiss] = useState("");

  const verdict = useMemo(() => judge(b.staff, a), [b.staff, a]);
  const answered = questions.filter((q) => a[q.id]).length;

  const go = (n: number) => { setStep(n); setMiss(""); requestAnimationFrame(() => window.scrollTo({ top: document.getElementById("check-top")?.offsetTop ?? 0, behavior: "smooth" })); };
  const next1 = () => { if (!b.staff || !b.industry) { setMiss("「従業員の人数」と「業種」をえらんでください。"); return; } go(1); };
  const next2 = () => { if (answered < questions.length) { setMiss(`まだ答えていない項目が${questions.length - answered}つあります。わからない場合は「わからない」をえらんでください。`); return; } track("package_check_result", { level: verdict.level, staff: b.staff }); go(2); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading"); setErr("");
    const lines = [
      `流入元: ${pkg.source}-check`,
      `【診断結果】${verdict.title}${verdict.plan ? `／おすすめ ${verdict.plan.n}名プラン` : ""}`,
      "",
      "【基本情報】",
      ...(Object.keys(basics) as (keyof typeof basics)[]).map((k) => `${basics[k].label}: ${b[k] || "（未記入）"}`),
      "",
      "【適用診断 10項目】（営業管理システムの並び）",
      `1. 雇用保険の適用事業所: ${jp(a.insured)}`,
      `2. 被保険者がプラン人数以上: ${b.staff}`,
      `3. 受講者を決められる: ${jp(a.pick)}`,
      `4. 滞納・不正受給なし: ${jp(a.clean)}`,
      `5. 半年以内の閉店・移転なし: ${jp(a.stay)}`,
      `6. 30h/名を1〜2ヶ月で確保: ${jp(a.time)}`,
      `7. トイレ個室に壁面と電源: ${jp(a.wall)}`,
      `8. 賃貸人の承諾: ${jp(a.owner)}`,
      `9. 研修費先払い可 or 貸付型: ${jp(a.pay)}`,
      `10. 内製化の意思: ${jp(a.will)}`,
      "",
      `ミーティング希望日時: ${c.when || "（未記入）"}`,
    ];
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "助成金パッケージ 適用診断（セルフ）", company: c.company, name: c.name, email: c.email, tel: c.tel, media: "助成金パッケージ（PR配信店）", message: lines.join("\n") }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "送信に失敗しました。");
      track("generate_lead", { source: pkg.source + "-check", level: verdict.level, staff: b.staff });
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "送信に失敗しました。"); setState("error");
    }
  }

  const pct = [10, 55, 100][step];

  return (
    <div id="check-top" className="scroll-mt-20">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-ink-soft"><span>{["1 / 3　基本情報", "2 / 3　10項目のチェック", "3 / 3　診断結果"][step]}</span><span>約3分</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} /></div>
      </div>

      {step === 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-sans text-xl font-black text-ink">御社について教えてください</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {(Object.keys(basics) as (keyof typeof basics)[]).map((k) => (
              <div key={k} className={k === "staff" ? "sm:col-span-2" : ""}>
                <label className={label}>{basics[k].label}{(k === "staff" || k === "industry") && <span className="ml-1 text-xs text-[#e8590c]">必須</span>}</label>
                {k === "staff" ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {basics.staff.options.map((o) => <button type="button" key={o} aria-pressed={b.staff === o} onClick={() => setB((p) => ({ ...p, staff: o }))} className={`rounded-xl border-2 px-3 py-3 text-sm font-bold ${b.staff === o ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-ink"}`}>{o}</button>)}
                  </div>
                ) : (
                  <select className={field} value={b[k]} onChange={(e) => setB((p) => ({ ...p, [k]: e.target.value }))}>
                    {k !== "stores" && <option value="">えらんでください</option>}
                    {basics[k].options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                )}
                {basics[k].help && <p className="mt-1 text-xs text-ink-soft">{basics[k].help}</p>}
              </div>
            ))}
          </div>
          {miss && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" role="alert">{miss}</p>}
          <button type="button" onClick={next1} className="mt-6 w-full rounded-full bg-brand py-4 text-lg font-black text-white shadow-lg sm:w-auto sm:px-10">つぎへ（10項目のチェック）</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="text-sm text-ink-soft">1回目のミーティングで確認する項目と同じです。わからない項目は「わからない」で大丈夫です。</p>
          <div className="mt-4 space-y-3">
            {questions.map((q, i) => (
              <div key={q.id} className={`rounded-2xl bg-white p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-5 ${miss && !a[q.id] ? "ring-2 ring-red-400" : ""}`}>
                <div className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-black text-white">{i + 1}</span><div><p className="font-bold leading-snug text-ink">{q.label}</p>{q.help && <p className="mt-0.5 text-xs text-ink-soft">{q.help}</p>}</div></div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-0 sm:w-72 sm:shrink-0">
                  {(["yes", "no", "unknown"] as Answer[]).map((v) => <button type="button" key={v} aria-pressed={a[q.id] === v} onClick={() => setA((p) => ({ ...p, [q.id]: v }))} className={`rounded-xl border-2 py-2.5 text-sm font-bold ${a[q.id] === v ? (v === "yes" ? "border-[#1f9d6b] bg-[#1f9d6b] text-white" : v === "no" ? "border-[#e8590c] bg-[#e8590c] text-white" : "border-ink bg-ink text-white") : "border-slate-200 bg-white text-ink"}`}>{jp(v)}</button>)}
                </div>
              </div>
            ))}
          </div>
          {miss && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" role="alert">{miss}</p>}
          <div className="mt-6 flex gap-3"><button type="button" onClick={() => go(0)} className="rounded-full border-2 border-slate-300 bg-white px-5 py-4 text-sm font-bold text-ink-soft">もどる</button><button type="button" onClick={next2} className="flex-1 rounded-full bg-brand py-4 text-lg font-black text-white shadow-lg">診断結果を見る</button></div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className={`rounded-3xl p-6 text-white sm:p-8 ${verdict.level === "high" ? "bg-[#1f9d6b]" : verdict.level === "mid" ? "bg-brand" : "bg-ink"}`} aria-live="polite">
            <p className="text-xs font-black tracking-widest text-white/80">診断結果</p>
            <h2 className="mt-1 font-sans text-xl font-black leading-snug sm:text-2xl">{verdict.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">{verdict.body}</p>
            {verdict.blockers.length > 0 && <div className="mt-4 rounded-2xl bg-white/15 p-4 text-sm"><p className="font-black">確認が必要な項目</p><ul className="mt-1 list-disc pl-5">{verdict.blockers.map((t) => <li key={t}>{t}</li>)}</ul></div>}
            {verdict.unknowns.length > 0 && <div className="mt-3 rounded-2xl bg-white/15 p-4 text-sm"><p className="font-black">ミーティングで一緒に確認する項目</p><ul className="mt-1 list-disc pl-5">{verdict.unknowns.map((t) => <li key={t}>{t}</li>)}</ul></div>}
          </div>

          {verdict.plan && (
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-black tracking-widest text-brand">御社の人数に合うプラン</p>
              <h3 className="mt-1 font-sans text-2xl font-black text-ink">{verdict.plan.n}名プラン（{verdict.plan.name}）</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[["PR動画", verdict.plan.video], ["インフルエンサー", verdict.plan.inf], ["サイネージ配信（3年）／LP", "○／ご成約特典"], ["SNS×AI研修", `${verdict.plan.n}名 × 3講座30時間`]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 rounded-xl bg-paper px-4 py-2.5 text-sm"><span className="font-bold text-ink-soft">{k}</span><span className="font-black text-ink">{v}</span></div>)}
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-[#e3ebf3]">
                <table className="w-full text-sm"><tbody className="[&_td]:px-4 [&_td]:py-2.5 [&_td:last-child]:text-right [&_td:last-child]:font-black">
                  <tr className="border-b border-[#e3ebf3]"><td>お支払い合計（研修費＋役務10万＋社労士26.4万）</td><td>{man(verdict.plan.pay)}万円</td></tr>
                  <tr className="border-b border-[#e3ebf3] text-brand"><td>国の助成金（経費75%＋賃金）</td><td>▲{man(verdict.plan.sub)}万円</td></tr>
                  <tr className="border-b border-[#e3ebf3] text-brand"><td>掲載協力金</td><td>▲{man(verdict.plan.coop)}万円</td></tr>
                  <tr className="border-b border-[#e3ebf3] text-brand"><td>ご紹介料 3社（1社 {man(verdict.plan.ref1)}万円）</td><td>▲{man(verdict.plan.ref3)}万円</td></tr>
                  <tr className="bg-[#fff4e8] text-[#e8590c]"><td className="font-black">最終お手出し（3社ご紹介時）</td><td className="text-lg">0円</td></tr>
                </tbody></table>
              </div>
              <p className="mt-2 text-xs text-ink-soft">税込。フル受講・先払い型。別途サイネージ設置費6万円（1台・税込{b.stores !== "1店舗" ? "・店舗数分" : ""}）。研修費の値引き・返金ではありません。</p>
            </div>
          )}

          {state === "done" ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <p className="text-4xl">✅</p>
              <h3 className="mt-3 font-sans text-xl font-black text-ink">診断結果を送信しました</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">担当の湯本より1営業日以内に、ミーティングの候補日をメールでご案内します。診断の内容をもとに、当日はプランと金額の確定から始められます。</p>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="font-sans text-xl font-black text-ink">{verdict.level === "low" ? "状況が変わったときのために、ご連絡先を残せます" : "この結果で、30分のミーティングを申し込む"}</h3>
              <p className="mt-1 text-sm text-ink-soft">診断の回答もいっしょに届くので、当日の確認が短くなります。</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><label className={label}>店名・会社名</label><input className={field} value={c.company} onChange={(e) => setC((p) => ({ ...p, company: e.target.value }))} required /></div>
                <div><label className={label}>お名前</label><input className={field} value={c.name} onChange={(e) => setC((p) => ({ ...p, name: e.target.value }))} required /></div>
                <div><label className={label}>メールアドレス</label><input type="email" className={field} value={c.email} onChange={(e) => setC((p) => ({ ...p, email: e.target.value }))} required /></div>
                <div><label className={label}>電話番号</label><input type="tel" className={field} value={c.tel} onChange={(e) => setC((p) => ({ ...p, tel: e.target.value }))} /></div>
                <div className="sm:col-span-2"><label className={label}>ミーティング希望日時<span className="ml-1 text-xs font-normal text-ink-soft">（任意）</span></label><input className={field} value={c.when} onChange={(e) => setC((p) => ({ ...p, when: e.target.value }))} placeholder="例：平日14時以降／10月15日（水）午前" /></div>
              </div>
              {state === "error" && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" role="alert">{err}</p>}
              <button type="submit" disabled={state === "loading"} className="mt-5 w-full rounded-full bg-[#e8590c] py-4 text-lg font-black text-white shadow-lg disabled:opacity-60">{state === "loading" ? "送信中…" : "診断結果を送って、ミーティングを申し込む"}</button>
              <p className="mt-3 text-center text-xs text-ink-soft">送信により<a href="/privacy" target="_blank" rel="noopener" className="font-bold text-brand underline">プライバシーポリシー</a>に同意したものとみなします。</p>
            </form>
          )}
          <button type="button" onClick={() => go(1)} className="text-sm font-bold text-ink-soft underline">回答を直す</button>
        </div>
      )}
    </div>
  );
}

function jp(v?: Answer) { return v === "yes" ? "はい" : v === "no" ? "いいえ" : v === "unknown" ? "わからない" : "（未回答）"; }
