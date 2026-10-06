import type { Metadata } from "next";
import { PackageCheckForm } from "@/components/package/package-check-form";
import { pkg, NOTICE } from "@/lib/package-data";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: { absolute: "3分で適用診断（無料）｜SNS×AI研修・PR動画・トイレサイネージのパッケージ" },
  description: "雇用保険の加入人数と10項目のチェックで、助成金パッケージの対象になりそうか・合うプランがその場でわかります。",
  robots: { index: false, follow: false },
};

export default function PackageCheckPage() {
  return (
    <main className="flex-1 bg-paper font-sans">
      <section className="bg-[linear-gradient(135deg,#0b3d6b_0%,#0478bd_100%)] text-white">
        <div className="mx-auto max-w-3xl px-5 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14">
          <a href="/package" className="text-xs font-bold text-white/80 hover:underline">← パッケージの内容にもどる</a>
          <span className="mt-4 block w-fit rounded-full bg-[#ffd23f] px-3.5 py-1 text-xs font-black text-ink">無料・約3分・名前の入力は最後だけ</span>
          <h1 className="mt-4 font-sans text-[1.8rem] font-black leading-[1.25] sm:text-[2.5rem]">御社は対象になる？<br />3分で適用診断</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">雇用保険の加入人数と10項目のチェックで、「対象になりそうか」と「御社に合うプランと金額」がその場でわかります。1回目のミーティングで確認する内容と同じなので、答えておくと当日が短くなります。</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <PackageCheckForm />
      </section>
      <footer className="bg-ink px-5 py-8 text-white/80 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] leading-relaxed">{NOTICE}</p>
          <p className="mt-4 border-t border-white/15 pt-4 text-xs">{pkg.partners}　／　© {company.name}</p>
        </div>
      </footer>
    </main>
  );
}
