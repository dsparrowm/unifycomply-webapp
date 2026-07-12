import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type KybLookupBusinessAvatarProps = {
  name: string;
  variant?: "square" | "circle";
  showVerifiedBadge?: boolean;
  className?: string;
};

export function KybLookupBusinessAvatar({
  name,
  variant = "square",
  showVerifiedBadge = false,
  className,
}: KybLookupBusinessAvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center bg-[color:var(--bg-muted)] text-[color:var(--accent-primary)]",
          variant === "circle" ? "h-[130px] w-[130px] rounded-full" : "h-[143px] w-[116px] rounded-lg",
        )}
        aria-hidden
      >
        <span className="sr-only">{name}</span>
        <Building2 className={cn(variant === "circle" ? "h-12 w-12" : "h-10 w-10")} />
      </div>

      {showVerifiedBadge ? (
        <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white ring-2 ring-white">
          <Building2 className="h-3.5 w-3.5" aria-hidden />
        </span>
      ) : null}
    </div>
  );
}
