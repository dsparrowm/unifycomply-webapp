import { Check, Pencil, Trash2 } from "lucide-react";
import type { SettingsRole } from "@/types/settings";

type RolePermissionCardProps = {
  role: SettingsRole;
  onEdit?: (roleId: string) => void;
  onDelete?: (roleId: string) => void;
};

export function RolePermissionCard({ role, onEdit, onDelete }: RolePermissionCardProps) {
  const enabledPermissions = role.permissions.filter((permission) => permission.enabled);

  return (
    <article className="flex flex-col rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[color:var(--text-primary)]">{role.name}</h3>
          <p className="mt-1 text-xs text-[color:var(--text-light)]">{role.riskLevel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label={`Edit ${role.name}`}
            onClick={() => onEdit?.(role.id)}
            className="inline-flex h-5 w-5 items-center justify-center text-[color:var(--text-light)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            <Pencil className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${role.name}`}
            onClick={() => onDelete?.(role.id)}
            className="inline-flex h-5 w-5 items-center justify-center text-[color:var(--state-error)] transition-colors hover:opacity-80"
          >
            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {enabledPermissions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[color:var(--border-default)] px-3 py-4 text-sm text-[color:var(--text-light)]">
            No permissions assigned
          </p>
        ) : (
          enabledPermissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] px-3 py-3.5"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                {permission.label}
              </span>
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white"
                aria-hidden
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 border-t border-[color:var(--border-default)] pt-4">
        <span className="inline-flex max-w-full rounded-full border border-[color:var(--border-default)] bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--accent-primary-hover)]">
          <span className="truncate">{role.summary}</span>
        </span>
      </div>
    </article>
  );
}
