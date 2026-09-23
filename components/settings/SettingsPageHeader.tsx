import type { ReactNode } from "react";

type SettingsPageHeaderProps = {
  actions?: ReactNode;
};

export function SettingsPageHeader({ actions }: SettingsPageHeaderProps) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">Settings</h1>
        {actions}
      </div>
      <p className="mt-1 text-sm text-[color:var(--text-muted)]">
        Manage your account, team, and platform configuration
      </p>
    </div>
  );
}
