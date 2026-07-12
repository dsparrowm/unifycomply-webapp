"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { AuditLogsTable } from "@/components/settings/AuditLogsTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { KycPagination } from "@/components/kyc/KycPagination";
import { auditLogModuleOptions } from "@/lib/data/settings";
import type { SettingsAuditLogEntry } from "@/types/settings";

type AuditLogsPanelProps = {
  entries: SettingsAuditLogEntry[];
};

export function AuditLogsPanel({ entries }: AuditLogsPanelProps) {
  const [moduleFilter, setModuleFilter] = useState("all");

  const filteredEntries = useMemo(() => {
    if (moduleFilter === "all") {
      return entries;
    }

    return entries.filter(
      (entry) => entry.module.toLowerCase() === moduleFilter.toLowerCase(),
    );
  }, [entries, moduleFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Audit Logs
          </h2>
          <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
            View detailed audit trail of all actions performed in the system
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2.5 text-xs font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
          >
            <Filter className="h-4 w-4" />
            More filters
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-[color:var(--accent-primary-soft)] bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
          >
            Export logs
          </button>
        </div>
      </div>

      <SettingsSelect
        label="Module"
        options={auditLogModuleOptions}
        value={moduleFilter}
        onChange={(event) => setModuleFilter(event.target.value)}
        className="max-w-[726px]"
      />

      {filteredEntries.length > 0 ? (
        <AuditLogsTable entries={filteredEntries} />
      ) : (
        <EmptyState
          icon={Search}
          title="No audit logs found"
          description="Try changing the module filter to see more results."
        />
      )}

      {filteredEntries.length > 0 ? (
        <div className="border-t border-[color:var(--border-default)] pt-4">
          <KycPagination currentPage={1} totalPages={1} onPageChange={() => {}} />
        </div>
      ) : null}
    </div>
  );
}
