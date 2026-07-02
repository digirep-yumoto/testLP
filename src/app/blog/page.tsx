import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { posts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "お役立ち記事｜サイネージ広告の基礎・業種別ノウハウ",
  description:
    "サイネージ広告の費用・効果・種類の基礎知識から、美容クリニック・コインランドリーなど業種別の集客ノウハウまで。DigiRepが実務目線で解説します。",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <>
      <Header />
      <main className="bg-white pt-28 pb-24 sm:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-brand uppercase">
            Blog
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">お役立ち記事</h1>
          <p className="mt-3 text-[15px] leading-[1.9] text-ink-soft">
            サイネージ広告の基礎から、業種別の集客ノウハウまで。広告主・店舗オーナーの検討に役立つ情報をお届けします。
          </p>

          <div className="mt-10 grid gap-5">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-7"
              >
                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-brand">{p.category}</span>
                  <span>{p.readMins}分で読めます</span>
                </div>
                <h2 className="mt-3 text-lg font-bold text-ink transition-colors group-hover:text-brand sm:text-xl">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                  続きを読む
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
