import Link from "next/link";
import {
  AmlMonitoringBadge,
  AmlScreeningTypeBadge,
  AmlStatusBadge,
} from "@/components/aml-screening/AmlStatusBadge";
import type { AmlScreeningRecord } from "@/types/aml-screening";

const columns = [
  "AML ID",
  "Full Name",
  "Date & Time",
  "Type",
  "Initiated By",
  "Risk Score",
  "Assigned To",
  "Status",
  "Active Monitoring",
] as const;

type AmlScreeningTableProps = {
  records: AmlScreeningRecord[];
  emptyMessage: string;
};

export function AmlScreeningTable({ records, emptyMessage }: AmlScreeningTableProps) {
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
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-24 text-center">
                  <p className="text-2xl font-medium text-[color:var(--text-light)]">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[color:var(--border-default)] transition-colors last:border-b-0 hover:bg-[color:var(--bg-muted)]"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${record.entityName}`}
                      className="rounded border-[color:var(--border-default)]"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium">
                    <Link
                      href={`/aml-screening/${record.id}`}
                      className="text-[color:var(--accent-primary-hover)] hover:underline"
                    >
                      {record.amlId}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    <Link href={`/aml-screening/${record.id}`} className="hover:underline">
                      {record.entityName}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text-muted)]">
                    {record.dateTime}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <AmlScreeningTypeBadge type={record.screeningType} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text-primary)]">
                    {record.initiatedBy}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-[color:var(--text-primary)]">
                    {record.riskScore}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text-muted)]">
                    {record.assignedTo ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <AmlStatusBadge status={record.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <AmlMonitoringBadge active={record.activeMonitoring} />
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
