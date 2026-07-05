const columns = [
  "KYC ID",
  "Customer Name",
  "Document Type",
  "Country",
  "Status",
  "Priority",
  "Risk Score",
  "Time in Queue",
];

export function KycTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" className="rounded border-[color:var(--border-default)]" />
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 font-medium text-[color:var(--text-muted)]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-24 text-center">
                <p className="text-2xl font-medium text-[color:var(--text-light)]">
                  No User Activity
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
