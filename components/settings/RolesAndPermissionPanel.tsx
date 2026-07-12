import { RolePermissionCard } from "@/components/settings/RolePermissionCard";
import type { SettingsRole } from "@/types/settings";

type RolesAndPermissionPanelProps = {
  roles: SettingsRole[];
};

export function RolesAndPermissionPanel({ roles }: RolesAndPermissionPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Role and permission
          </h2>
          <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
            Add, remove, and manage team members and their access levels
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[color:var(--accent-primary-soft)] bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          Create Role
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {roles.map((role) => (
          <RolePermissionCard key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
}
