import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PkgIcon } from "@/components/package/pkg-icons";

/**
 * トップページ用：助成金パッケージ（PR配信店）への入口。
 * 「店舗オーナー様へ」（広告配信店・副収入の話）とは別商品なので、ブロックを分けて置く。
 */
export function PackageBanner() {
  return (
    <section id="package" className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0b3d6b_0%,#0478bd_100%)] text-white shadow-xl">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
            <div>
              <p className="text-[12px] font-bold tracking-[0.18em] text-white/80">FOR STORE OWNERS ／ 研修・制作・サイネージのパッケージ</p>
              <span className="mt-3 inline-block rounded-full bg-[#ffd23f] px-3.5 py-1 text-xs font-black text-ink">飲食店・サロン・中小企業のオーナー様へ</span>
              <h2 className="mt-4 font-sans text-[1.7rem] font-black leading-[1.25] sm:text-[2.4rem]">
                集客に必要なもの、<br />
                <span className="bg-[linear-gradient(transparent_60%,#ff7a2f_60%)] px-1">まるっと全部のせ。</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-[15px]">
                PR動画・インフルエンサー来店投稿・LP・トイレサイネージ配信・SNS×AI研修をひとつのパッケージに。
                研修費の<b className="text-[#ffd23f]">75%は国の助成金</b>、残り25%相当も協力金・紹介料で、手出しが残りません。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[["video", "PR動画"], ["influencer", "インフルエンサー"], ["signage", "サイネージ配信"], ["lp", "LP制作"], ["training", "SNS×AI研修"]].map(([k, t]) => (
                  <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold ring-1 ring-white/30">
                    <PkgIcon k={k} className="size-5 [&>svg]:h-full [&>svg]:w-full" />
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="/package" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#e8590c] px-7 py-3.5 text-[15px] font-black text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  パッケージの内容を見る
                  <ArrowRight className="size-5" />
                </a>
                <a href="/package/check" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-white/60 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                  3分で適用診断（無料）
                </a>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-white/70">※助成金は支給要件を満たし期限内に申請した場合に支給されるもので、支給を保証するものではありません。研修費は全額お支払いいただきます。制度は2027年3月31日まで。</p>
            </div>
            <div className="relative mx-auto w-full max-w-[280px] lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border-4 border-white/80 shadow-2xl">
                <Image src="/images/toilet-vanity.jpg" alt="個室トイレの洗面台に設置されたサイネージ" width={700} height={1100} className="aspect-[4/5] w-full object-cover object-[50%_40%]" />
              </div>
              <div className="absolute -bottom-3 -left-3 flex size-24 -rotate-[8deg] flex-col items-center justify-center rounded-full border-4 border-white bg-[#e8590c] text-center shadow-lg outline outline-2 outline-[#e8590c] sm:size-28">
                <span className="text-[9px] font-bold">最終お手出し</span>
                <span className="text-4xl font-black leading-none">0<span className="text-sm">円</span></span>
                <span className="mt-0.5 text-[7px] font-bold">3社ご紹介時・設置費別</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
