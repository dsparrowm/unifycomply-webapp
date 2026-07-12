import { AuditLogStatusBadge } from "@/components/settings/AuditLogStatusBadge";
import type { SettingsAuditLogEntry } from "@/types/settings";

const columns = ["Timestamp", "User", "Action", "Module", "IP Address", "Status"] as const;

type AuditLogsTableProps = {
  entries: SettingsAuditLogEntry[];
};

export function AuditLogsTable({ entries }: AuditLogsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[color:var(--border-default)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border-default)]">
            {entries.map((entry) => (
              <tr key={entry.id} className="bg-[color:var(--bg-surface)]">
                <td className="px-4 py-4 align-top">
                  <p className="font-medium text-[color:var(--text-primary)]">{entry.timestamp}</p>
                  <p className="mt-1 text-xs text-[color:var(--text-light)]">{entry.time}</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <p className="font-medium text-[color:var(--text-primary)]">{entry.userName}</p>
                  <p className="mt-1 text-xs text-[color:var(--text-light)]">{entry.userRole}</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <p className="font-medium text-[color:var(--text-primary)]">{entry.action}</p>
                  <p className="mt-1 text-xs text-[color:var(--text-light)]">{entry.actionDetail}</p>
                </td>
                <td className="px-4 py-4 align-top text-[color:var(--text-primary)]">
                  {entry.module}
                </td>
                <td className="px-4 py-4 align-top text-[color:var(--text-primary)]">
                  {entry.ipAddress}
                </td>
                <td className="px-4 py-4 align-top">
                  <AuditLogStatusBadge status={entry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
