"use client";

import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { AppSearchModal, searchPlaceholder } from "@/components/layout/AppSearchModal";
import { EnvironmentToggle } from "@/components/layout/SandboxBanner";
import { UserMenu } from "@/components/layout/UserMenu";
import { useUiStore } from "@/store/ui.store";

export function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

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
      <header className="flex h-[72px] items-center justify-between gap-3 border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden flex-1 lg:block" />

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-3 py-2 text-left transition-colors hover:border-[color:var(--accent-primary-hover)] lg:max-w-md"
        >
          <Search className="h-4 w-4 shrink-0 text-[color:var(--text-light)]" />
          <span className="flex-1 truncate text-xs text-[color:var(--text-light)]">
            {searchPlaceholder}
          </span>
          <kbd className="hidden rounded border border-[color:var(--border-subtle)] px-1.5 py-0.5 text-[10px] text-[color:var(--text-light)] sm:inline">
            ⌘ K
          </kbd>
        </button>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-4 lg:flex-1">
          <EnvironmentToggle />
          <UserMenu />
        </div>
      </header>

      <AppSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
