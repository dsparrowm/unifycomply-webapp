import type { ReactNode } from "react";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { SettingsPageHeader } from "@/components/settings/SettingsPageHeader";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <SettingsPageHeader />

      <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
        <div className="flex flex-col lg:flex-row">
          <SettingsNav />
          <div className="min-w-0 flex-1 border-t border-[color:var(--border-default)] p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
