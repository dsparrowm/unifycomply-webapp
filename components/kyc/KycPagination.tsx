import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type KycPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function KycPagination({ currentPage, totalPages, onPageChange }: KycPaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="min-w-9 px-3 py-2 text-sm text-[color:var(--text-light)]"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => {
              if (typeof page === "number") {
                onPageChange(page);
              }
            }}
            className={cn(
              "min-w-9 rounded-lg px-3 py-2 text-sm",
              page === currentPage
                ? "bg-[color:var(--accent-primary-soft)] font-medium text-[color:var(--accent-primary)]"
                : "text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]",
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
