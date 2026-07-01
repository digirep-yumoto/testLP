import {
  ShieldCheck,
  Clock,
  Repeat,
  Target,
  Volume2,
  Users,
  BarChart3,
  Hotel,
  Sparkles,
  TrendingUp,
  Eye,
  QrCode,
  DoorClosed,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";
import type { MediaKey } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const map: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  Repeat,
  Target,
  Volume2,
  Users,
  BarChart3,
  Hotel,
  Sparkles,
  TrendingUp,
  Eye,
  QrCode,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = map[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={1.75} aria-hidden />;
}

const mediaIcons: Record<MediaKey, LucideIcon> = {
  toilet: DoorClosed,
  laundry: WashingMachine,
  hotel: Hotel,
};

export function MediaIcon({
  kind,
  className,
}: {
  kind: MediaKey;
  className?: string;
}) {
  const Cmp = mediaIcons[kind];
  return <Cmp className={cn(className)} strokeWidth={1.6} aria-hidden />;
}
