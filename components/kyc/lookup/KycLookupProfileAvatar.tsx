import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type KycLookupProfileAvatarProps = {
  name: string;
  variant?: "square" | "circle";
  showVerifiedBadge?: boolean;
  className?: string;
};

export function KycLookupProfileAvatar({
  name,
  variant = "square",
  showVerifiedBadge = false,
  className,
}: KycLookupProfileAvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center bg-[color:var(--bg-muted)] text-[color:var(--text-light)]",
          variant === "circle" ? "h-[130px] w-[130px] rounded-full" : "h-[143px] w-[116px] rounded-lg",
        )}
        aria-hidden
      >
        <span className="sr-only">{name}</span>
        <span className={cn("font-semibold", variant === "circle" ? "text-3xl" : "text-2xl")}>
          {initials}
        </span>
      </div>

      {showVerifiedBadge ? (
        <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white ring-2 ring-white">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
        </span>
      ) : null}
    </div>
  );
}
