import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 pb-16 pt-32 text-center">
        <p className="font-display text-7xl font-black text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">お探しのページが見つかりません</h1>
        <p className="mt-3 max-w-md text-ink-soft">
          サイトのリニューアルにより、ページの場所が変わった可能性があります。
          お手数ですが、下記より最新のページへお進みください。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark"
          >
            トップページへ
          </Link>
          <Link
            href="/#services"
            className="rounded-xl border border-border bg-white px-6 py-3 font-bold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            サービスを見る
          </Link>
          <Link
            href="/#request"
            className="rounded-xl border border-border bg-white px-6 py-3 font-bold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            資料請求・お問い合わせ
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
