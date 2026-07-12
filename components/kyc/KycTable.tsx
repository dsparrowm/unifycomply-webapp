import Link from "next/link";
import type { KycRecord } from "@/types/kyc";
import { KycPriorityBadge, KycStatusBadge } from "@/components/kyc/KycStatusBadge";

const columns = [
  "KYC ID",
  "Customer Name",
  "Document Type",
  "Country",
  "Status",
  "Priority",
  "Risk Score",
  "Time in Queue",
] as const;

type KycTableProps = {
  records: KycRecord[];
  emptyMessage?: string;
};

export function KycTable({
  records,
  emptyMessage = "No User Activity",
}: KycTableProps) {
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
                    <Link
                      href={`/kyc/${record.id}`}
                      className="hover:text-[color:var(--accent-primary-hover)]"
                    >
                      {record.kycId}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    <Link
                      href={`/kyc/${record.id}`}
                      className="hover:text-[color:var(--accent-primary-hover)]"
                    >
                      {record.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    {record.documentType}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{record.country}</td>
                  <td className="px-4 py-4">
                    <KycStatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-4">
                    <KycPriorityBadge priority={record.priority} />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.riskScore}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-muted)]">
                    {record.timeInQueue}
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
