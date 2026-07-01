import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Audiences } from "@/components/site/audiences";
import { Services } from "@/components/site/services";
import { Positioning } from "@/components/site/positioning";
import { MediaSection } from "@/components/site/media-section";
import { Comparison } from "@/components/site/comparison";
import { Voices } from "@/components/site/voices";
import { Proof } from "@/components/site/proof";
import { StoreLogos } from "@/components/site/store-logos";
import { ChainNetwork } from "@/components/site/chain-network";
import { VideoMerits } from "@/components/site/video-merits";
import { Why } from "@/components/site/why";
import { Process } from "@/components/site/process";
import { StoreOwner } from "@/components/site/store-owner";
import { Docs } from "@/components/site/docs";
import { LeadForm } from "@/components/site/lead-form";
import { Faq } from "@/components/site/faq";
import { Cta } from "@/components/site/cta";
import { Company } from "@/components/site/company";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { mediaList } from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Audiences />
        <Services />
        <Positioning />
        {mediaList.map((m, i) => (
          <MediaSection key={m.key} media={m} index={i} />
        ))}
        <Comparison />
        <Voices />
        <Proof />
        <StoreLogos />
        <ChainNetwork />
        <VideoMerits />
        <Why />
        <Process />
        <StoreOwner />
        <Docs />
        <LeadForm />
        <Faq />
        <Cta />
        <Company />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
