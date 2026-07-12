"use client";

import { useEffect } from "react";
import { SidebarContent } from "@/components/layout/SidebarContent";
import { useUiStore } from "@/store/ui.store";

export function MobileSidebar() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const closeSidebar = useUiStore((state) => state.closeSidebar);

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSidebar, sidebarOpen]);

  if (!sidebarOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={closeSidebar}
        className="absolute inset-0 bg-[color:var(--text-primary)]/20 backdrop-blur-[2px]"
      />
      <aside className="relative flex h-full w-[min(100%,var(--sidebar-width))] flex-col border-r border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl">
        <SidebarContent showCloseButton onClose={closeSidebar} onNavigate={closeSidebar} />
      </aside>
    </div>
  );
}
