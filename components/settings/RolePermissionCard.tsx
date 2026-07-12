import { Pencil, Trash2 } from "lucide-react";
import type { SettingsRole } from "@/types/settings";

type RolePermissionCardProps = {
  role: SettingsRole;
};

export function RolePermissionCard({ role }: RolePermissionCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-[color:var(--border-default)]">
      <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-4 py-4">
        <div>
          <h3 className="text-base font-medium text-[color:var(--text-primary)]">{role.name}</h3>
          <p className="mt-0.5 text-xs text-[color:var(--text-light)]">{role.riskLevel}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label={`Edit ${role.name}`}
            className="inline-flex h-[18px] w-[18px] items-center justify-center text-[color:var(--text-light)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            <Pencil className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${role.name}`}
            className="inline-flex h-[18px] w-[18px] items-center justify-center text-[color:var(--text-light)] transition-colors hover:text-[color:var(--state-error)]"
          >
            <Trash2 className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-[18px]">
          {role.permissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between rounded-lg border border-[color:var(--border-default)] px-3 py-4"
            >
              <span className="text-sm text-[color:var(--text-primary)]">{permission.label}</span>
              <input
                type="checkbox"
                checked={permission.enabled}
                readOnly
                aria-label={permission.label}
                className="h-5 w-5 rounded border-[color:var(--border-default)] text-[color:var(--accent-primary-hover)]"
              />
            </div>
          ))}
        </div>

        <div className="border-t border-[color:var(--border-default)] pt-4">
          <p className="inline-flex rounded-lg bg-[color:var(--bg-muted)] px-3 py-2 text-sm text-[color:var(--text-primary)]">
            {role.summary}
          </p>
        </div>
      </div>
    </article>
  );
}
