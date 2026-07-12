import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[color:var(--border-subtle)]",
        className,
      )}
    />
  );
}

type PageLoadingSkeletonProps = {
  variant?: "dashboard" | "settings" | "generic";
};

export function PageLoadingSkeleton({ variant = "generic" }: PageLoadingSkeletonProps) {
  if (variant === "settings") {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
        <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
          <div className="flex flex-col lg:flex-row">
            <div className="border-b border-[color:var(--border-default)] p-4 lg:w-[260px] lg:border-b-0 lg:border-r">
              <div className="flex gap-2 lg:flex-col">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-10 w-32 shrink-0 lg:w-full" />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-4 p-6 lg:p-8">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-24 w-full" />
              <SkeletonBlock className="h-24 w-full" />
              <SkeletonBlock className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-7 w-32" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
          <SkeletonBlock className="h-10 w-56" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-24" />
          ))}
        </div>
        <div className="grid gap-8 xl:grid-cols-2">
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-64" />
        </div>
        <SkeletonBlock className="h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-7 w-40" />
      <SkeletonBlock className="h-4 w-64" />
      <SkeletonBlock className="h-48 w-full" />
    </div>
  );
}
