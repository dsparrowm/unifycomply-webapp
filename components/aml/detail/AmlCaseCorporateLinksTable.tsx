import type { AmlCaseCorporateLink } from "@/types/aml";

type AmlCaseCorporateLinksTableProps = {
  rows: AmlCaseCorporateLink[];
};

export function AmlCaseCorporateLinksTable({ rows }: AmlCaseCorporateLinksTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-[color:var(--bg-muted)]">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-xs font-medium text-[color:var(--text-muted)]">
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Entity Name</th>
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody className="bg-[color:var(--bg-surface)]">
          {rows.map((row) => (
            <tr
              key={`${row.description}-${row.entityName}`}
              className="border-t border-[color:var(--border-subtle)]"
            >
              <td className="px-4 py-4 text-[color:var(--text-primary)]">{row.description}</td>
              <td className="px-4 py-4 text-[color:var(--text-primary)]">{row.entityName}</td>
              <td className="px-4 py-4 text-[color:var(--text-primary)]">{row.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
