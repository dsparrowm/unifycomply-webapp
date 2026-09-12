import Link from "next/link";
import { Eye } from "lucide-react";
import type { KybRecord } from "@/types/kyb";
import { KycAssignedToCell } from "@/components/kyc/KycAssignedToCell";
import { KycPriorityBadge, KycStatusBadge } from "@/components/kyc/KycStatusBadge";

const columns = [
  "KYB ID",
  "Business Name",
  "Verification Type",
  "Status",
  "Country",
  "Priority",
  "Risk Score",
  "Assigned To",
  "Time in Queue",
] as const;

type KybTableProps = {
  records: KybRecord[];
  emptyMessage?: string;
  showViewAction?: boolean;
};

export function KybTable({
  records,
  emptyMessage = "No User Activity",
  showViewAction = false,
}: KybTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  className="rounded border-[color:var(--border-default)]"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]"
                >
                  {column}
                </th>
              ))}
              {showViewAction ? (
                <th className="px-4 py-3">
                  <span className="sr-only">View</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showViewAction ? 2 : 1)}
                  className="px-4 py-24 text-center"
                >
                  <p className="text-2xl font-medium text-[color:var(--text-light)]">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${record.businessName}`}
                      className="rounded border-[color:var(--border-default)]"
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    <Link
                      href={`/kyb/${record.id}`}
                      className="hover:text-[color:var(--accent-primary-hover)]"
                    >
                      {record.kybId}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    <Link
                      href={`/kyb/${record.id}`}
                      className="block hover:text-[color:var(--accent-primary-hover)]"
                    >
                      {record.businessName}
                    </Link>
                    <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">
                      {record.businessType}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    {record.verificationType}
                  </td>
                  <td className="px-4 py-4">
                    <KycStatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{record.country}</td>
                  <td className="px-4 py-4">
                    <KycPriorityBadge priority={record.priority} />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.riskScore}
                  </td>
                  <td className="px-4 py-4">
                    <KycAssignedToCell
                      assignedTo={record.assignedTo}
                      customerName={record.businessName}
                    />
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-muted)]">
                    {record.timeInQueue}
                  </td>
                  {showViewAction ? (
                    <td className="px-4 py-4">
                      <Link
                        href={`/kyb/${record.id}`}
                        aria-label={`View ${record.businessName}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
