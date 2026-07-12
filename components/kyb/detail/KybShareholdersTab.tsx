import { KybDetailSectionHeader } from "@/components/kyb/detail/KybDetailSectionHeader";
import type { KybShareCapitalData, KybShareholderType } from "@/types/kyb";

const columns = ["Shareholder", "Type", "Shares", "Percentage", "Share Class"] as const;

const shareholderTypeLabels: Record<KybShareholderType, string> = {
  individual: "Individual",
  corporate: "Corporate",
};

type KybShareholdersTabProps = {
  shareholders: KybShareCapitalData;
};

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
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-semibold text-[color:var(--text-primary)]">
        {percentage}%
      </span>
    </div>
  );
}

export function KybShareholdersTab({ shareholders }: KybShareholdersTabProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <KybDetailSectionHeader
        title="Share Capital Structure"
        status={shareholders.sectionStatus}
      />

      <div className="p-6">
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
                      {shareholder.shareClass}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
