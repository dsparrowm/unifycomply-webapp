"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AppSearchModal, searchPlaceholder } from "@/components/layout/AppSearchModal";
import { EnvironmentToggle } from "@/components/layout/SandboxBanner";
import { UserMenu } from "@/components/layout/UserMenu";

export function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="flex h-[72px] items-center justify-between gap-4 border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-6">
        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex w-full max-w-md items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-3 py-2 text-left transition-colors hover:border-[color:var(--accent-primary-hover)]"
        >
          <Search className="h-4 w-4 text-[color:var(--text-light)]" />
          <span className="flex-1 truncate text-xs text-[color:var(--text-light)]">
            {searchPlaceholder}
          </span>
          <kbd className="rounded border border-[color:var(--border-subtle)] px-1.5 py-0.5 text-[10px] text-[color:var(--text-light)]">
            ⌘ K
          </kbd>
        </button>

        <div className="flex flex-1 items-center justify-end gap-4">
          <EnvironmentToggle />
          <UserMenu />
        </div>
      </header>

      <AppSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
