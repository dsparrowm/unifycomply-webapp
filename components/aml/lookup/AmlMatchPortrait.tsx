import { cn } from "@/lib/utils";

type AmlMatchPortraitProps = {
  className?: string;
};

export function AmlMatchPortrait({ className }: AmlMatchPortraitProps) {
  return (
    <div
      className={cn("overflow-hidden bg-[color:var(--bg-muted)]", className)}
      aria-hidden
    >
      <svg viewBox="0 0 640 640" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="640" className="fill-[color:var(--border-default)]" />
        <circle cx="320" cy="250" r="92" className="fill-[color:var(--text-light)]" />
        <path
          d="M140 640c24-148 112-220 180-220s156 72 180 220"
          className="fill-[color:var(--text-light)]"
        />
      </svg>
    </div>
  );
}
