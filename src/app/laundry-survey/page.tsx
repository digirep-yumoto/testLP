import type { Metadata } from "next";
import { survey, surveyState, SOURCES } from "@/lib/survey-data";
import { LaundrySurveyForm } from "@/components/survey/laundry-survey-form";

// 店内のQR・公式LINEから来た方だけが使うページ。検索結果には出さない。
export const metadata: Metadata = {
  title: survey.title,
  description: `約${survey.minutes}分のアンケートにお答えいただいた方の中から、抽選で${survey.winners}名さまに${survey.prize}をプレゼント。`,
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ s?: string; preview?: string }> }) {
  const sp = await searchParams;
  const source = sp.s && sp.s in SOURCES ? sp.s : "";
  const state = surveyState();
  const preview = state === "before" && sp.preview === "1";

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pb-10 pt-5">
      <p className="mb-4 text-center text-sm font-black tracking-wide text-brand">{survey.partner}</p>
      {state === "open" || preview ? (
        <LaundrySurveyForm source={source} preview={preview} />
      ) : (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="font-sans text-xl font-black text-ink">{state === "before" ? "アンケートは準備中です" : "アンケートは終了しました"}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {state === "before" ? "まもなく受付をはじめます。もうしばらくお待ちください。" : `たくさんのご回答をありがとうございました。抽選の結果は、当選された方へメールでお知らせします。`}
          </p>
        </div>
      )}
      <footer className="mt-8 space-y-2 text-[11px] leading-relaxed text-ink-soft">
        <p>・応募はおひとり1回まで。当選の発表は、当選された方へのメール（Amazonギフトカード Eメールタイプの送付）をもってかえさせていただきます。</p>
        <p>・本キャンペーンは{survey.organizer}による提供です。本キャンペーンについてのお問い合わせはAmazonではお受けしておりません。{survey.organizer}（{survey.contact}）までお願いいたします。</p>
        <p>・Amazon、Amazon.co.jpおよびそれらのロゴはAmazon.com, Inc.またはその関連会社の商標です。</p>
        <p className="pt-2 text-center">実施：{survey.organizer}　／　<a href="/privacy" className="underline">プライバシーポリシー</a></p>
      </footer>
    </main>
  );
}
