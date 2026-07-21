import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Company } from "@/components/site/company";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "会社概要",
  description: `${company.name}（${company.nameEn}）の会社概要。代表者・所在地・事業内容などをご案内します。`,
  alternates: { canonical: "/company" },
};

export default function CompanyPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-paper pt-24 sm:pt-28">
          <nav className="mx-auto flex max-w-4xl items-center gap-1.5 px-4 text-xs text-muted-foreground sm:px-6">
            <Link href="/" className="hover:text-brand">ホーム</Link>
            <span>/</span>
            <span className="text-ink-soft">会社概要</span>
          </nav>
        </div>
        <Company />
      </main>
      <Footer />
    </>
  );
}
