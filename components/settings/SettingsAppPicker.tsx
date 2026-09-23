"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CreateAppModal } from "@/components/settings/CreateAppModal";
import { useCreateTenantApp, useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import { runAction } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function SettingsAppPicker() {
  const [createOpen, setCreateOpen] = useState(false);
  const { apps, selectedAppId, isLoading, setSelectedAppId } = useSettingsAppSelection();
  const createApp = useCreateTenantApp();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="settings-app" className="text-sm font-medium text-[color:var(--text-primary)]">
        App
      </label>
      <div className="relative w-[220px]">
        <select
          id="settings-app"
          aria-describedby="settings-app-hint"
          value={selectedAppId ?? ""}
          disabled={isLoading || apps.length === 0}
          onChange={(event) => setSelectedAppId(event.target.value)}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 pr-10 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]",
            "disabled:cursor-not-allowed disabled:bg-[color:var(--bg-muted)] disabled:text-[color:var(--text-light)]",
          )}
        >
          {apps.length === 0 ? (
            <option value="">{isLoading ? "Loading apps…" : "No apps yet"}</option>
          ) : (
            apps.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-light)]" />
      </div>
      <p id="settings-app-hint" className="sr-only">
        API keys and compliance configuration apply to this app.
      </p>
      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-[color:var(--border-default)] px-4 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
      >
        Create App
      </button>
      <CreateAppModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (values) => {
          await runAction(() => createApp.mutateAsync(values), {
            success: "App created",
            error: "Could not create app",
          });
        }}
      />
    </div>
  );
}
