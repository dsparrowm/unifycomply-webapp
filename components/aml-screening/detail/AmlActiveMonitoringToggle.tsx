"use client";

import { SettingsToggle } from "@/components/settings/SettingsToggle";

type AmlActiveMonitoringToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function AmlActiveMonitoringToggle({
  checked,
  onChange,
}: AmlActiveMonitoringToggleProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-[color:var(--text-muted)]">Active Monitoring</span>
      <SettingsToggle checked={checked} onChange={onChange} label="Active Monitoring" />
      <span
        className={
          checked
            ? "text-sm font-medium text-[color:var(--accent-primary-hover)]"
            : "text-sm text-[color:var(--text-light)]"
        }
      >
        {checked ? "On" : "Off"}
      </span>
    </div>
  );
}
