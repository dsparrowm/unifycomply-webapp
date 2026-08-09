import Link from "next/link";
import { ChevronDown, Eye } from "lucide-react";
import {
  KybListPriorityBadge,
  KybListStatusBadge,
  kybRiskScoreClassName,
} from "@/components/kyb/KybListBadges";
import type { KybRecord } from "@/types/kyb";
import { cn } from "@/lib/utils";

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
};

export function KybTable({
  records,
  emptyMessage = "No User Activity",
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
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]"
                >
                  {column}
                </th>
              ))}
              <th className="px-4 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-24 text-center">
                  <p className="text-2xl font-medium text-[color:var(--text-light)]">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] transition-colors last:border-b-0 hover:bg-[color:var(--bg-muted)]"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${record.businessName}`}
                      className="rounded border-[color:var(--border-default)]"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.kybId}
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/kyb/${record.id}`} className="block hover:opacity-80">
                      <p className="font-medium text-[color:var(--text-primary)]">
                        {record.businessName}
                      </p>
                      <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">
                        {record.businessType}
                      </p>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text-primary)]">
                    {record.verificationType}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <KybListStatusBadge status={record.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.countryCode}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <KybListPriorityBadge priority={record.priority} />
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-4 py-4 text-center font-semibold",
                      kybRiskScoreClassName(record.riskScore),
                    )}
                  >
                    {record.riskScore}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-medium",
                        record.assignedTo
                          ? "text-[color:var(--accent-primary-hover)]"
                          : "text-[color:var(--state-warning)]",
                      )}
                    >
                      {record.assignedTo ?? "Unassigned"}
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text-muted)]">
                    {record.timeInQueue}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/kyb/${record.id}`}
                      aria-label={`View ${record.businessName}`}
                      className="inline-flex rounded-md p-1.5 text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
