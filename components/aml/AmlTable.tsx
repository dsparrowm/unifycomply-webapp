import Link from "next/link";
import { Eye } from "lucide-react";
import type { AmlRecord } from "@/types/aml";
import { AmlMonitoringBadge, AmlStatusBadge, AmlTypeBadge } from "@/components/aml/AmlBadges";
import { KycAssignedToCell } from "@/components/kyc/KycAssignedToCell";
import { getAmlCaseHref } from "@/lib/data/aml-detail";

const columns = [
  "AML ID",
  "Customer Name",
  "Date",
  "Type",
  "Initiated By",
  "Risk Score",
  "Assigned To",
  "Status",
  "Monitoring",
] as const;

type AmlTableProps = {
  records: AmlRecord[];
  emptyMessage?: string;
};

export function AmlTable({ records, emptyMessage = "No User Activity" }: AmlTableProps) {
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
                  className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${record.customerName}`}
                      className="rounded border-[color:var(--border-default)]"
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.amlId}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    <p>{record.customerName}</p>
                    {record.customerSubtitle ? (
                      <p className="text-xs text-[color:var(--text-muted)]">
                        {record.customerSubtitle}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{record.date}</td>
                  <td className="px-4 py-4">
                    <AmlTypeBadge type={record.type} />
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    {record.initiatedBy}
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.riskScore}
                  </td>
                  <td className="px-4 py-4">
                    <KycAssignedToCell
                      assignedTo={record.assignedTo}
                      customerName={record.customerName}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <AmlStatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-4">
                    <AmlMonitoringBadge active={record.monitoringActive} />
                  </td>
                  <td className="px-4 py-4">
                    {record.type === "batch" ? (
                      <Link
                        href="/aml-screening/batch/techventures"
                        aria-label={`View ${record.customerName}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        href={getAmlCaseHref(record.customerName, "person")}
                        aria-label={`View ${record.customerName}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
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
