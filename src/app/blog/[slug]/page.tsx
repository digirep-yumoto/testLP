import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { posts, getPost, type Block } from "@/lib/blog-data";
import { company } from "@/lib/site-data";

const siteUrl = company.url.replace(/\/$/, "");

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "記事が見つかりません" };
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: company.brand,
      locale: "ja_JP",
    },
  };
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "h2":
      return <h2 className="mt-10 text-xl font-bold text-ink sm:text-2xl">{b.s}</h2>;
    case "h3":
      return <h3 className="mt-7 text-lg font-bold text-ink">{b.s}</h3>;
    case "p":
      return <p className="mt-4 text-[15px] leading-[1.95] text-ink-soft">{b.s}</p>;
    case "ul":
      return (
        <ul className="mt-4 space-y-2.5">
          {b.items.map((it) => (
            <li key={it} className="flex gap-2.5 text-[15px] leading-[1.8] text-ink-soft">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <p className="mt-5 rounded-xl border-l-4 border-brand bg-brand/5 px-4 py-3 text-sm leading-relaxed text-ink">
          {b.s}
        </p>
      );
    case "cta":
      return (
        <a
          href={b.href}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
        >
          {b.label}
          <ArrowRight className="size-4" />
        </a>
      );
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${siteUrl}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        inLanguage: "ja-JP",
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: company.name },
        publisher: {
          "@type": "Organization",
          name: company.name,
          logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.png` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "お役立ち記事", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="bg-white pt-28 pb-24 sm:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-brand">ホーム</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand">お役立ち記事</Link>
          </nav>

          <div className="mt-4 flex items-center gap-3 text-xs font-bold text-muted-foreground">
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-brand">{post.category}</span>
            <span>{post.readMins}分で読めます</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold leading-snug text-ink sm:text-3xl">{post.title}</h1>
          <p className="mt-4 text-[15px] leading-[1.9] text-ink-soft">{post.description}</p>

          <div className="mt-4 border-t border-border pt-2">
            {post.body.map((b, i) => (
              <BlockView key={i} b={b} />
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-paper p-6 text-center sm:p-8">
            <h2 className="text-lg font-bold text-ink">まずは相談・資料請求から</h2>
            <p className="mt-2 text-sm text-ink-soft">
              「自社の商材に合うか」「概算費用は」といったご相談だけでも歓迎です。1営業日以内に担当よりご連絡します。
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href="/#request" className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
                無料で相談する
                <ArrowRight className="size-4" />
              </a>
              <a href="/#docs" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand">
                資料をダウンロード
              </a>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand">
              <ArrowLeft className="size-4" />
              記事一覧へ戻る
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
