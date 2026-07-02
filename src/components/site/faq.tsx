"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { faqs } from "@/lib/site-data";
import { cn } from "@/lib/utils";

// FAQ構造化データ（Googleの「よくある質問」リッチリザルト対象）
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <SectionHeading eyebrow="FAQ" title="よくあるご質問" />

        <div className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="font-display text-sm font-bold text-brand">Q</span>
                  <span className="flex-1 text-[15px] font-bold text-ink">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-ink-soft transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-200",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-ink-soft">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
