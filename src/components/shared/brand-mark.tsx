import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string;
  inverted?: boolean;
  compact?: boolean;
  className?: string;
};

export function BrandMark({
  href = "/",
  inverted = false,
  compact = false,
  className,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      aria-label="PPKPT — beranda"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-[0.7rem] border transition-transform duration-300 group-hover:-rotate-3",
          inverted
            ? "border-white/15 bg-white/10 text-white"
            : "border-primary/15 bg-primary text-primary-foreground",
        )}
      >
        <ShieldCheck size={19} weight="fill" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-sm font-semibold tracking-tight",
            inverted ? "text-white" : "text-foreground",
          )}
        >
          PPKPT
        </span>
        {compact ? null : (
          <span
            className={cn(
              "mt-1 font-mono text-[9px] uppercase tracking-[0.26em]",
              inverted ? "text-white/55" : "text-muted-foreground",
            )}
          >
            Satgas
          </span>
        )}
      </span>
    </Link>
  );
}
