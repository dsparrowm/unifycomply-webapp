"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { KybAddShareholderModal } from "@/components/kyb/detail/KybAddShareholderModal";
import type { CreateTenantKybShareholderDto } from "@/lib/api/types";
import type { KybShareCapitalData, KybShareholderType } from "@/types/kyb";
import { cn } from "@/lib/utils";

const columns = ["Shareholder", "Type", "Shares", "Percentage", "Share Class"] as const;

const shareholderTypeLabels: Record<KybShareholderType, string> = {
  individual: "Individual",
  corporate: "Corporate",
};

type KybShareholdersTabProps = {
  shareholders: KybShareCapitalData;
  canAdd?: boolean;
  onAddShareholder?: (body: CreateTenantKybShareholderDto) => Promise<void>;
  onEditShareholder?: (shareholderId: string, body: CreateTenantKybShareholderDto) => Promise<void>;
};

function statusBadgeClass(status: string): string {
  const normalized = status.toLowerCase();
  if (["active", "cleared", "verified", "submitted"].includes(normalized)) {
    return "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]";
  }
  if (["flagged", "failed"].includes(normalized)) {
    return "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]";
  }
  return "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]";
}

function ShareholderTypeBadge({ type }: { type: KybShareholderType }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[color:var(--state-info-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-info)]">
      {shareholderTypeLabels[type]}
    </span>
  );
}

function SharePercentageBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 min-w-[88px] flex-1 overflow-hidden rounded-full bg-[color:var(--border-subtle)]">
        <div
          className="h-full rounded-full bg-[color:var(--accent-primary-hover)]"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-semibold text-[color:var(--text-primary)]">
        {percentage}%
      </span>
    </div>
  );
}

export function KybShareholdersTab({
  shareholders,
  canAdd = false,
  onAddShareholder,
  onEditShareholder,
}: KybShareholdersTabProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [editingShareholder, setEditingShareholder] = useState<KybShareholder | null>(null);

  const canEdit = Boolean(canAdd && onEditShareholder);

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-6 py-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Share Capital Structure
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              statusBadgeClass(shareholders.sectionStatus),
            )}
          >
            {shareholders.sectionStatus}
          </span>
          {canAdd && onAddShareholder ? (
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="rounded-lg bg-[color:var(--accent-primary)] px-3 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
            >
              Add shareholder
            </button>
          ) : null}
        </div>
      </div>

      <div className="p-6">
        {shareholders.shareholders.length === 0 ? (
          <p className="py-10 text-center text-sm text-[color:var(--text-muted)]">
            No shareholders on file yet.
            {canAdd ? " Add a shareholder to build the share capital structure." : null}
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column}
                        className="px-6 py-4 text-xs font-medium text-[color:var(--text-muted)]"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                    {shareholders.shareholders.map((shareholder) => (
                    <tr
                      key={shareholder.id}
                      className="border-b border-[color:var(--border-default)] last:border-b-0"
                    >
                      <td className="px-6 py-5 font-medium text-[color:var(--text-primary)]">
                        {shareholder.name}
                      </td>
                      <td className="px-6 py-5">
                        <ShareholderTypeBadge type={shareholder.type} />
                      </td>
                      <td className="px-6 py-5 font-medium text-[color:var(--text-primary)]">
                        {shareholder.shares.toLocaleString("en-US")}
                      </td>
                      <td className="px-6 py-5">
                        <SharePercentageBar percentage={shareholder.percentage} />
                      </td>
                      <td className="px-6 py-5 text-[color:var(--text-primary)]">
                        <div className="flex items-center justify-between gap-3">
                          <span>{shareholder.shareClass}</span>
                          {canEdit ? (
                            <button
                              type="button"
                              aria-label={`Edit ${shareholder.name}`}
                              onClick={() => setEditingShareholder(shareholder)}
                              className="rounded-md p-1.5 text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--accent-primary-hover)]"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {canAdd && onAddShareholder ? (
        <KybAddShareholderModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmitShareholder={onAddShareholder}
        />
      ) : null}
        {canEdit && editingShareholder ? (
          <KybAddShareholderModal
            open
            onClose={() => setEditingShareholder(null)}
            onSubmitShareholder={(body) => onEditShareholder!(editingShareholder.id, body)}
            shareholder={editingShareholder}
          />
        ) : null}
    </div>
  );
}
