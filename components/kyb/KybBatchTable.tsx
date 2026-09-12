import Link from "next/link";
import { Eye } from "lucide-react";
import type { KybBatchRecord } from "@/types/kyb";
import { KycAssignedToCell } from "@/components/kyc/KycAssignedToCell";
import { KycStatusBadge } from "@/components/kyc/KycStatusBadge";

const columns = [
  "Batch ID",
  "File Name",
  "Created Date",
  "Created By",
  "Assigned To",
  "Country",
  "Status",
  "Total",
] as const;

type KybBatchTableProps = {
  batches: KybBatchRecord[];
  emptyMessage?: string;
};

function formatCreatedDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }
  return `${day}-${month}-${year}`;
}

export function KybBatchTable({
  batches,
  emptyMessage = "No User Activity",
}: KybBatchTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all batches"
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
            {batches.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-24 text-center">
                  <p className="text-2xl font-medium text-[color:var(--text-light)]">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${batch.fileName}`}
                      className="rounded border-[color:var(--border-default)]"
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {batch.batchId}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    <Link
                      href={`/kyb/batch/${batch.id}`}
                      className="hover:text-[color:var(--accent-primary-hover)]"
                    >
                      {batch.fileName}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    {formatCreatedDate(batch.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    {batch.createdBy}
                  </td>
                  <td className="px-4 py-4">
                    <KycAssignedToCell
                      assignedTo={batch.assignedTo}
                      customerName={batch.fileName}
                    />
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    {batch.country}
                  </td>
                  <td className="px-4 py-4">
                    <KycStatusBadge status={batch.status} />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {batch.total}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/kyb/batch/${batch.id}`}
                      aria-label={`View ${batch.fileName}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
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
