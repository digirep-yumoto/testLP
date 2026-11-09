import { Header } from "@/components/site/header";
import { HeroLaundry } from "@/components/laundry/hero-laundry";
import { StatsBar } from "@/components/laundry/stats-bar";
import { WhyLaundry } from "@/components/laundry/why-laundry";
import { AdPreview } from "@/components/laundry/ad-preview";
import { DayScenario } from "@/components/laundry/day-scenario";
import { LoopVisual } from "@/components/laundry/loop-visual";
import { UseCases } from "@/components/laundry/use-cases";
import { PricingLaundry } from "@/components/laundry/pricing-laundry";
import { Comparison } from "@/components/site/comparison";
import { TrustReport } from "@/components/laundry/trust-report";
import { LaunchTimeline } from "@/components/laundry/launch-timeline";
import { SimulatorTeaser } from "@/components/site/simulator-teaser";
import { OtherServices } from "@/components/laundry/other-services";
import { Docs } from "@/components/site/docs";
import { LeadForm } from "@/components/site/lead-form";
import { Faq } from "@/components/site/faq";
import { Cta } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";

/**
 * トップページ＝コインランドリーサイネージ広告（主力）の広告主向けページ。
 * 構成：ヒーロー → 数字 → なぜランドリーか → 配信イメージ → 向いている商材 → 料金 → 他媒体との違い
 *       → 実測・信頼 → 配信開始スケジュールと申込の流れ → シミュレーター → その他のサービス → 資料 → 問い合わせ → FAQ
 * 店舗オーナー向け（個室トイレ設置・パッケージ）は /store へ分離。
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroLaundry />
        <StatsBar />
        <WhyLaundry />
        <AdPreview />
        <LoopVisual />
        <DayScenario />
        <UseCases />
        <PricingLaundry />
        <Comparison />
        <TrustReport />
        <LaunchTimeline />
        <SimulatorTeaser />
        <OtherServices />
        <Docs />
        <LeadForm />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
