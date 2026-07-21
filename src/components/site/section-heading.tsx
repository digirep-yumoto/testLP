import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-brand uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-[1.95rem] font-bold leading-[1.38] tracking-[-0.01em] text-ink sm:text-[2.6rem] sm:leading-[1.25]">
        {title}
      </h2>
      {lead && (
        <p className="mt-4 text-pretty text-base leading-[1.95] text-ink-soft sm:text-lg">
          {lead}
        </p>
      )}
    </Reveal>
  );
}
