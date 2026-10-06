import type { Metadata } from "next";
import Image from "next/image";
import { pkg, menu, plans, worries, courses, checks, timeline, faqs, NOTICE, man } from "@/lib/package-data";
import { PkgIcon } from "@/components/package/pkg-icons";
import { PackageForm } from "@/components/package/package-form";
import { SelfCheck } from "@/components/package/self-check";
import { company } from "@/lib/site-data";

// DMや紹介で直接リンクを渡すページ。広告主向けの媒体ページとは導線を分けるため、検索結果には出さない
export const metadata: Metadata = {
  title: { absolute: pkg.title },
  description: pkg.description,
  robots: { index: false, follow: false },
  openGraph: { type: "website", title: pkg.title, description: pkg.description, locale: "ja_JP", images: [{ url: "/images/toilet-vanity.jpg", width: 700, height: 1100 }] },
};

const CTA = "#meeting";
const P = plans[0];

function H2({ eyebrow, title, lead }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <p className="mb-2 text-xs font-black tracking-[0.2em] text-brand">{eyebrow}</p>}
      <h2 className="font-sans text-[1.65rem] font-black leading-[1.3] text-ink sm:text-[2.3rem]">{title}</h2>
      {lead && <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">{lead}</p>}
    </div>
  );
}

function Plate({ k, size = "md" }: { k: string; size?: "md" | "lg" }) {
  const s = size === "lg" ? "size-32 sm:size-36" : "size-24 sm:size-28";
  return (
    <div className={`relative ${s} rounded-full shadow-[0_12px_28px_rgba(15,30,51,.14),inset_0_-4px_0_rgba(15,30,51,.06)]`} style={{ background: "radial-gradient(circle at 50% 40%,#fff 0,#f6f9fc 62%,#e3ebf3 100%)" }}>
      <div className="absolute inset-[7%] rounded-full border-2 border-[#d9e4ee]" />
      <PkgIcon k={k} className="absolute inset-[20%] [&>svg]:h-full [&>svg]:w-full" />
    </div>
  );
}

export default function PackagePage() {
  return (
    <main className="flex-1 font-sans">
      {/* ---------- ヒーロー ---------- */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0b3d6b_0%,#0478bd_100%)] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:pb-24 lg:pt-20">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-white/80">DIGI REP × Per-Fact × HolyTech</p>
            <span className="mt-4 inline-block rounded-full bg-[#ffd23f] px-4 py-1.5 text-xs font-black text-ink sm:text-sm">飲食店・サロン・中小企業のオーナー様へ</span>
            <h1 className="mt-5 font-sans text-[2.1rem] font-black leading-[1.2] sm:text-[3.2rem] lg:text-[3.6rem]">
              集客に必要なもの、<br />
              <span className="bg-[linear-gradient(transparent_60%,#ff7a2f_60%)] px-1">まるっと全部のせ。</span>
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-white/95 sm:text-lg">
              PR動画・インフルエンサー・LP・トイレサイネージ配信・SNS×AI研修。<br className="hidden sm:block" />
              バラバラに頼んでいたものを、<b className="text-[#ffd23f]">ひとつのパッケージ</b>に。
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {[["75", "%", "研修費は国の助成金"], ["25", "%", "残りは協力金・紹介料で戻る"], ["2", "回", "ご成約までお会いするのは"]].map(([n, u, t]) => (
                <div key={t} className="rounded-2xl border border-white/35 bg-white/10 p-3 sm:p-4">
                  <p className="text-3xl font-black leading-none text-[#ffd23f] sm:text-4xl">{n}<span className="text-base sm:text-lg">{u}</span></p>
                  <p className="mt-2 text-[11px] font-bold leading-snug sm:text-sm">{t}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={CTA} className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#e8590c] px-8 py-4 text-base font-black text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-lg">30分の適用診断（無料）を申し込む</a>
              <a href="/package/check" className="inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 border-white/60 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10">まず3分でセルフ診断</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative overflow-hidden rounded-[28px] border-4 border-white/85 shadow-2xl">
              <Image src="/images/toilet-vanity.jpg" alt="個室トイレの洗面台に設置されたサイネージ" width={700} height={1100} priority className="aspect-[3/4] w-full object-cover object-[50%_40%]" />
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-5 pb-5 pt-16 text-right text-sm font-bold">御社のトイレに1面。<br />御社のPR動画が流れます</p>
            </div>
            <div className="absolute -left-3 bottom-6 flex size-32 -rotate-[8deg] flex-col items-center justify-center rounded-full border-[5px] border-white bg-[#e8590c] text-center shadow-[0_12px_30px_rgba(232,89,12,.45)] outline outline-[3px] outline-[#e8590c] sm:size-36 lg:-left-10 lg:bottom-10">
              <span className="text-[11px] font-bold">最終お手出し</span>
              <span className="text-5xl font-black leading-none sm:text-6xl">0<span className="text-lg">円</span></span>
              <span className="mt-1 text-[9px] font-bold">3社ご紹介時・設置費別</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- お悩み ---------- */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <H2 eyebrow="PROBLEM" title="こんなお悩み、まとめて解決します" lead="バラバラだった「人・制作・露出・お金」を、ひとつにまとめたのがこのパッケージです。" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {worries.map((w) => (
              <div key={w.t} className="flex flex-col rounded-3xl bg-white p-6 shadow-sm">
                <PkgIcon k={w.k} className="size-16 [&>svg]:h-full [&>svg]:w-full" />
                <h3 className="mt-4 text-lg font-black leading-snug text-ink">{w.t}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{w.b}</p>
                <p className="mt-4 text-xs font-black text-[#e8590c]">▼ このパッケージなら</p>
                <p className="mt-2 rounded-2xl bg-[#e6f2fa] p-4 text-sm font-bold leading-relaxed text-ink">{w.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ひと皿 ---------- */}
      <section className="overflow-hidden bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <H2 eyebrow="ALL-IN-ONE" title={<>この<span className="text-[#e8590c]">ひと皿</span>に、ぜんぶ入っています</>} lead="3社が役割分担して、御社に「人」「集客の実物」「配信」を残します。研修費だけが助成金の対象です。" />
          <div className="relative mt-12 pb-4">
            <div className="absolute inset-x-0 bottom-0 top-16 hidden rounded-[40px] shadow-[0_20px_50px_rgba(15,30,51,.12),inset_0_-16px_0_#e4c89a] lg:block" style={{ background: "linear-gradient(180deg,#fff3dc,#f6dfb8)" }} />
            <div className="relative grid grid-cols-2 gap-x-4 gap-y-10 px-2 pb-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0">
              {menu.map((m) => (
                <a key={m.k} href={`#menu-${m.k}`} className="group flex flex-col items-center text-center">
                  <Plate k={m.k} />
                  <p className="mt-4 text-[15px] font-black leading-tight text-ink group-hover:text-brand">{m.t}</p>
                  <p className="mt-1 text-xs font-bold text-brand">{m.s}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[["SNS・AIを回せる社員", "3〜10名が3講座30時間を修了。投稿・動画・AI活用を社内で回せるようになります。"], ["集客の実物", "PR動画・インフルエンサーの投稿・LP。外注せずに使い続けられます。"], ["流れ続ける配信", "御社のトイレと、加盟店ネットワークの他店で御社の動画が3年間流れます。"]].map(([t, d]) => (
              <div key={t} className="rounded-3xl bg-ink p-6 text-white">
                <p className="text-xs font-black tracking-widest text-[#ffd23f]">御社に残るもの</p>
                <h3 className="mt-2 text-xl font-black">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- メニュー詳細 ---------- */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <H2 eyebrow="MENU" title="それぞれのメニューの中身" lead="人数プランで本数・人数が変わります。どれも「御社の手元に残る集客の実物」です。" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {menu.map((m) => (
              <div key={m.k} id={`menu-${m.k}`} className="scroll-mt-24 flex gap-5 rounded-3xl bg-white p-6 shadow-sm sm:p-7">
                <PkgIcon k={m.k} className="size-16 shrink-0 sm:size-20 [&>svg]:h-full [&>svg]:w-full" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-ink sm:text-xl">{m.t}</h3>
                    <span className="rounded-full bg-[#e6f2fa] px-2.5 py-0.5 text-xs font-bold text-brand">{m.s}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.d}</p>
                  <p className="mt-3 text-xs font-bold text-ink-soft">提供：{m.by}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            <div className="relative overflow-hidden rounded-3xl shadow-lg">
              <Image src="/images/toilet-signage.jpg" alt="個室トイレに設置されたサイネージ" width={1000} height={851} className="h-full min-h-64 w-full object-cover" />
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-5 pb-4 pt-14 text-sm font-bold text-white">個室トイレの壁面に縦型モニターを1面。設置は営業時間外、運用はデジレップ</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-black text-ink">トイレサイネージ配信は、こう流れます</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink">
                {[["自店で", "御社のPR動画がトイレで流れ、お客様に次の来店理由を伝えます"], ["他店で", "加盟店ネットワークの他店のトイレでも御社の動画が流れます。加盟店が増えるほど流れる場所も増えます"], ["流れないもの", "同業他社の広告は流しません"], ["実績報告", "流れた回数・店舗数を月1回ご報告します"]].map(([t, d]) => (
                  <li key={t} className="flex gap-3"><span className="mt-0.5 shrink-0 rounded-md bg-brand px-2 py-0.5 text-xs font-black text-white">{t}</span><span>{d}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- お金 ---------- */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <H2 eyebrow="MONEY" title="研修費は全額お支払い。それでも、手出しが残らない理由" lead="国の助成金と、別契約の協力金・紹介料。3つの入金で戻ります。" />
          <div className="mt-10 grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <div className="flex items-center gap-4 rounded-3xl bg-paper p-6"><PkgIcon k="gov" className="size-16 shrink-0 [&>svg]:h-full [&>svg]:w-full" /><div><p className="text-xl font-black text-ink">研修費の <span className="text-3xl text-[#e8590c]">75%</span></p><p className="mt-1 text-sm font-bold text-ink-soft">国の助成金（人材開発支援助成金・事業展開等リスキリング支援コース）</p></div></div>
            <p className="hidden items-center text-3xl font-black text-brand lg:flex">＋</p>
            <div className="flex items-center gap-4 rounded-3xl bg-paper p-6"><PkgIcon k="hands" className="size-16 shrink-0 [&>svg]:h-full [&>svg]:w-full" /><div><p className="text-xl font-black text-ink">残り <span className="text-3xl text-[#e8590c]">25%</span> 相当</p><p className="mt-1 text-sm font-bold text-ink-soft">設置協力契約の掲載協力金（10%）＋ご紹介料（5%×3社）</p></div></div>
            <p className="hidden items-center text-3xl font-black text-brand lg:flex">＝</p>
            <div className="flex items-center rounded-3xl bg-ink p-6 text-white"><div><p className="text-2xl font-black text-[#ffd23f]">手出しが残らない</p><p className="mt-1 text-sm font-bold text-white/85">3社ご紹介（ミーティング実施）時。設置費6万円は別</p></div></div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-3xl bg-paper p-6 sm:p-8">
              <p className="text-sm font-black text-ink-soft">例：{P.n}名プラン・フル受講・先払い型（税込・万円）</p>
              <div className="mt-4 space-y-3">
                {[["お支払い合計", P.pay, "#0f1e33", `研修費${P.n * 100}＋役務10＋社労士26.4`], ["国の助成金", -P.sub, "#0478bd", "経費75%＋賃金助成（支給申請から6〜10ヶ月）"], ["掲載協力金", -P.coop, "#1f9d6b", "インタビュー・記事掲載後10営業日以内"], ["ご紹介料 3社", -P.ref3, "#e8590c", `1社 ${man(P.ref1)}万円 × 3（ミーティング実施ごと）`]].map(([t, v, c, d]) => (
                  <div key={t as string} className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[150px_1fr_110px]">
                    <div><p className="text-sm font-black text-ink">{t}</p><p className="text-[11px] text-ink-soft">{d}</p></div>
                    <div className="hidden h-6 overflow-hidden rounded-md bg-white sm:block"><div className="h-full rounded-md" style={{ width: `${Math.round((Math.abs(v as number) / P.pay) * 100)}%`, background: c as string }} /></div>
                    <p className="text-right text-2xl font-black" style={{ color: c as string }}>{(v as number) < 0 ? "▲" : ""}{man(Math.abs(v as number))}<span className="ml-0.5 text-xs">万円</span></p>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-[#fff4e8] p-4"><p className="text-base font-black text-ink">最終お手出し<span className="ml-2 text-xs font-bold text-ink-soft">3社ご紹介時</span></p><p className="text-4xl font-black text-[#e8590c]">0<span className="text-base">円</span></p></div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">ご参考：ご紹介前の時点でのお手出しは {man(P.ref3)}万円。別途、サイネージ設置費6万円（1台・税込）。研修費の「値引き」「返金」ではありません。</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border-2 border-[#e3ebf3] bg-white p-6">
                <h3 className="font-black text-brand">3つの入金は、別々の契約から</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
                  <li><b>国の助成金</b>：研修契約（Per-Fact）に基づく研修費が対象</li>
                  <li><b>掲載協力金</b>：設置協力契約（デジレップ）。インタビュー30分と導入事例の掲載にご協力いただいた対価</li>
                  <li><b>ご紹介料</b>：同じく設置協力契約。ご紹介先と私たちのミーティングが実施された時点で1社分。ご成約は問いません（契約から12ヶ月・上限3社）</li>
                </ul>
              </div>
              <div className="rounded-3xl border-2 border-[#e3ebf3] bg-white p-6">
                <h3 className="font-black text-brand">お支払い方法は2つ</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink"><b>A 先にお支払い</b>：研修費を全額お振込み。助成金は申請から6〜10ヶ月で御社の口座へ。<br /><b>B 貸付で立替え</b>：貸付パートナーが立替え、助成金で返済。御社は25%相当をお支払い（社労士の申請代行が必須・審査あり）。</p>
              </div>
            </div>
          </div>

          {/* プラン表 */}
          <div className="mt-12 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-[#e3ebf3]">
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr className="bg-brand text-white"><th className="bg-ink px-4 py-3 text-left">プラン（受講人数）</th>{plans.map((p) => <th key={p.n} className="px-4 py-3 text-right"><span className="text-lg font-black">{p.n}名</span><br /><span className="text-xs font-bold opacity-90">{p.name}</span></th>)}</tr></thead>
              <tbody className="[&_td]:border-b [&_td]:border-[#e3ebf3] [&_td]:px-4 [&_td]:py-2.5 [&_td:first-child]:text-left [&_td:first-child]:font-bold [&_td]:text-right">
                <tr><td>PR動画</td>{plans.map((p) => <td key={p.n}>{p.video}</td>)}</tr>
                <tr><td>インフルエンサー</td>{plans.map((p) => <td key={p.n}>{p.inf}</td>)}</tr>
                <tr><td>商品開発＋MEO</td>{plans.map((p) => <td key={p.n}>{p.dev ? "○" : "—"}</td>)}</tr>
                <tr><td>サイネージ配信（3年）／LP</td>{plans.map((p) => <td key={p.n}>○／特典</td>)}</tr>
                <tr className="[&_td]:border-t-2 [&_td]:border-t-ink"><td>お支払い合計</td>{plans.map((p) => <td key={p.n} className="font-black">{man(p.pay)}</td>)}</tr>
                <tr className="text-brand"><td>国の助成金</td>{plans.map((p) => <td key={p.n}>▲{man(p.sub)}</td>)}</tr>
                <tr className="text-brand"><td>掲載協力金</td>{plans.map((p) => <td key={p.n}>▲{man(p.coop)}</td>)}</tr>
                <tr className="text-brand"><td>ご紹介料 3社（1社あたり）</td>{plans.map((p) => <td key={p.n}>▲{man(p.ref3)}<span className="text-xs text-ink-soft">（{man(p.ref1)}）</span></td>)}</tr>
                <tr className="bg-[#fff4e8] text-[#e8590c]"><td>最終お手出し（3社ご紹介時）</td>{plans.map((p) => <td key={p.n} className="text-lg font-black">0</td>)}</tr>
                <tr className="text-ink-soft"><td>別途：設置費（1台6万円）</td>{plans.map((p) => <td key={p.n}>{p.inst}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-soft">税込・万円。フル受講・先払い型。ミニマム受講（①＋②・1名60万円）の金額は、適用診断でその場で試算します。</p>
        </div>
      </section>

      {/* ---------- 研修 ---------- */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <H2 eyebrow="TRAINING" title="人が育つ SNS×AI 内製化研修" lead="3講座30時間・オンライン。店舗から出ずに1〜2ヶ月で修了。この研修費に国の助成金が出ます。" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {courses.map((c) => (
              <div key={c.t} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-3xl font-black text-brand">{c.no}</p>
                <h3 className="mt-1 text-lg font-black text-ink">{c.t}</h3>
                <p className="mt-1 text-xs font-bold text-ink-soft">{c.form}・{c.h}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink">{c.learn}</p>
                <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-paper p-3 text-center text-xs"><div><dt className="text-ink-soft">受講料</dt><dd className="font-black text-ink">{c.fee}</dd></div><div><dt className="text-ink-soft">経費助成</dt><dd className="font-black text-brand">{c.sub}</dd></div><div><dt className="text-ink-soft">賃金助成</dt><dd className="font-black text-brand">{c.wage}</dd></div></dl>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[["制度", "人材開発支援助成金（厚生労働省）事業展開等リスキリング支援コース。要件を満たせば支給（採択審査なし）。上限30万円／講座・名の内側で設計。"], ["受講のルール", "受講者は雇用保険の被保険者（役員・ご家族は不可）。ライブ講座は出席80%以上。研修契約は中途解約できません。"], ["申請はおまかせ", "計画届・支給申請は社労士が作成（3講座26.4万円・人数によらず一律）。御社は書類5点のコピーと押印のみ。"]].map(([t, d]) => (
              <div key={t} className="rounded-2xl border-2 border-[#e3ebf3] bg-white p-5"><p className="font-black text-brand">{t}</p><p className="mt-2 text-sm leading-relaxed text-ink">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 流れ ---------- */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <H2 eyebrow="FLOW" title="ご成約までは2回。ご契約後の工数は約10時間" lead="お会いするのは成約まで2回だけ。申請の実務は社労士が代行し、御社は押印のみです。" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[["1", "適用診断 30分", "担当：デジレップ／店頭・オンライン", "年商・雇用保険の加入人数・決算月をお伺いし、その場で受給の可否とプランを判定。サイネージの設置場所も確認します。"], ["2", "ご提案の合意・ご契約 45分", "担当：Per-Fact（＋社労士）／オンライン可", "プラン・人数・お支払い方法・スケジュールを合意し、契約書にご捺印。受講者を確定します。"]].map(([n, t, who, d]) => (
              <div key={n} className="rounded-3xl bg-paper p-6 sm:p-8"><span className="inline-flex size-12 items-center justify-center rounded-full bg-brand text-2xl font-black text-white">{n}</span><h3 className="mt-3 text-xl font-black text-ink">{t}</h3><p className="mt-1 text-sm font-bold text-ink-soft">{who}</p><p className="mt-3 text-sm leading-relaxed text-ink">{d}</p></div>
            ))}
          </div>
          <div className="mt-10 overflow-x-auto">
            <ol className="relative grid min-w-[880px] grid-cols-8 gap-2 before:absolute before:inset-x-[4%] before:top-4 before:h-1 before:bg-[#cfe6f6]">
              {timeline.map(([m, t, d]) => (
                <li key={m} className="relative text-center"><span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-black text-white">{m}</span><p className="mt-2 text-sm font-black text-ink">{t}</p><p className="mt-1 text-[11px] leading-snug text-ink-soft">{d}</p></li>
              ))}
            </ol>
          </div>
          <div className="mt-8 rounded-3xl bg-paper p-6">
            <p className="font-black text-ink">ご契約後に御社が動く場面（研修を除く）　<span className="text-[#e8590c]">合計 約10時間／10ヶ月</span></p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
              {[["書類5点のコピー・押印2点", "約2時間"], ["インタビュー（記事用）", "30分"], ["PR動画の撮影", "半日・営業時間外"], ["サイネージ設置の立会い", "30分・営業時間外"], ["3社へのお声がけ", "お声がけのみ"]].map(([t, h]) => <div key={t} className="rounded-xl bg-white px-4 py-3"><p className="font-bold text-ink">{t}</p><p className="text-xs text-ink-soft">{h}</p></div>)}
            </div>
            <p className="mt-3 text-xs text-ink-soft">受講者は別途30時間／名（オンライン・1〜2ヶ月）。</p>
          </div>
        </div>
      </section>

      {/* ---------- セルフチェック ---------- */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <H2 eyebrow="CHECK" title="御社は対象になる？ 10項目セルフチェック" lead="1回目の診断で一緒に確認する項目です。あてはまるものにチェックを入れてみてください。" />
          <div className="mt-10"><SelfCheck items={checks.map(([t, d]) => ({ t, d }))} cta={CTA} /></div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <H2 eyebrow="FAQ" title="よくいただくご質問" />
          <div className="mt-10 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="group rounded-2xl bg-paper p-5 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-ink"><span>Q. {q}</span><span className="text-brand transition-transform group-open:rotate-45">＋</span></summary>
                <p className="mt-3 text-sm leading-relaxed text-ink">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- フォーム ---------- */}
      <section id="meeting" className="scroll-mt-16 bg-[linear-gradient(135deg,#0b3d6b_0%,#0478bd_100%)] py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#ffd23f]">MEETING</p>
            <h2 className="mt-2 font-sans text-[1.8rem] font-black leading-[1.25] sm:text-[2.4rem]">まずは30分の適用診断。<br />その場で「対象かどうか」と金額が分かります。</h2>
            <p className="mt-3 text-sm text-white/85">先に <a href="/package/check" className="font-bold text-[#ffd23f] underline">3分のセルフ診断</a> をしておくと、当日はプランと金額の確定から始められます。</p>
            <ul className="mt-6 space-y-3 text-sm sm:text-base">
              {["御社が助成金の対象になるか、その場で判定", "御社に合うプランと金額を人数別に試算", "サイネージの設置場所とスケジュールの確認", "店頭でもオンラインでも。無理な勧誘はしません"].map((t) => <li key={t} className="flex gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1f9d6b] text-xs font-black">✓</span>{t}</li>)}
            </ul>
            <div className="mt-8 rounded-2xl border border-white/30 bg-white/10 p-5 text-sm leading-relaxed">
              <p className="font-black text-[#ffd23f]">制度は{pkg.deadline}までの時限措置です</p>
              <p className="mt-1 text-white/90">計画届は研修開始の1ヶ月前まで。研修は1〜2ヶ月、支給申請は修了後2ヶ月以内。逆算すると、ご検討はお早めがおすすめです。</p>
            </div>
            <p className="mt-6 text-xs text-white/80">お電話でも承ります：{company.tel}（デジレップ 湯本）</p>
          </div>
          <div className="text-ink"><PackageForm /></div>
        </div>
      </section>

      {/* ---------- 注意・フッター ---------- */}
      <footer className="bg-ink px-5 py-10 text-white/80 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] leading-relaxed">{NOTICE}</p>
          <div className="mt-6 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>{pkg.partners}</p>
            <p>© {company.name}　<a href="/privacy" className="underline">プライバシーポリシー</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
