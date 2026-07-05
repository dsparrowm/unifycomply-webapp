import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const pages = [1, 2, 3, "...", 8, 9, 10];

export function KycPagination() {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-muted)]"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={String(page)}
          type="button"
          className={cn(
            "min-w-9 rounded-lg px-3 py-2 text-sm",
            page === 1
              ? "bg-[color:var(--accent-primary-soft)] font-medium text-[color:var(--accent-primary)]"
              : "text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-muted)]"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
