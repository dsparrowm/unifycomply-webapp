"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

const searchPlaceholder = "Search for customers, documents, reports, settings";

type AppSearchModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AppSearchModal({ open, onClose }: AppSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const hasQuery = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/20 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative z-10 w-full max-w-[720px] overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center gap-3 border-b border-[color:var(--border-default)] px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-[color:var(--text-light)]" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)]"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline"
          >
            Cancel
          </button>
        </div>

        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-16 text-center">
          {!hasQuery ? (
            <>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)]">
                <Search className="h-9 w-9 text-[color:var(--accent-primary)]" />
              </div>
              <h2 className="mt-6 text-lg font-semibold text-[color:var(--text-primary)]">
                Start Searching
              </h2>
              <p className="mt-2 max-w-sm text-sm text-[color:var(--text-muted)]">
                {searchPlaceholder}
              </p>
            </>
          ) : (
            <p className="text-sm text-[color:var(--text-muted)]">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { searchPlaceholder };
