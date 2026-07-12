import type { LucideIcon } from "lucide-react";
import { Trash2 } from "lucide-react";
import type { SettingsComplianceListItem } from "@/types/settings";

type ComplianceListRowProps = {
  item: SettingsComplianceListItem;
  icon: LucideIcon;
  onRemove: () => void;
};

export function ComplianceListRow({ item, icon: Icon, onRemove }: ComplianceListRowProps) {
  return (
    <div className="rounded-lg border border-[color:var(--border-default)] px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[color:var(--bg-muted)]">
            <Icon className="h-[18px] w-[18px] text-[color:var(--text-light)]" />
          </div>
          <p className="truncate text-sm font-medium text-[color:var(--text-primary)]">
            {item.label}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.label}`}
          className="shrink-0 rounded-md p-1 text-[color:var(--text-light)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--state-error)]"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
