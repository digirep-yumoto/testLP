import type { MediaKey } from "@/lib/site-data";

// Tailwind が静的に解決できるよう、媒体別のクラスを明示的に列挙する
export const accent: Record<
  MediaKey,
  {
    text: string;
    bg: string;
    softBg: string;
    border: string;
    ring: string;
    gradient: string;
  }
> = {
  toilet: {
    text: "text-toilet",
    bg: "bg-toilet",
    softBg: "bg-toilet/10",
    border: "border-toilet/30",
    ring: "ring-toilet/20",
    gradient: "from-toilet/15 to-transparent",
  },
  laundry: {
    text: "text-laundry",
    bg: "bg-laundry",
    softBg: "bg-laundry/10",
    border: "border-laundry/30",
    ring: "ring-laundry/20",
    gradient: "from-laundry/15 to-transparent",
  },
  hotel: {
    text: "text-hotel",
    bg: "bg-hotel",
    softBg: "bg-hotel/10",
    border: "border-hotel/30",
    ring: "ring-hotel/20",
    gradient: "from-hotel/15 to-transparent",
  },
};
