"use client";

import { SidebarContent } from "@/components/layout/SidebarContent";

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[color:var(--border-default)] bg-[color:var(--bg-surface)] lg:flex">
      <SidebarContent />
    </aside>
  );
}
