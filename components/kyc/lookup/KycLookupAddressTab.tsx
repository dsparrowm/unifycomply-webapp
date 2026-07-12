import type { KycBvnLookupResult } from "@/types/kyc";

type KycLookupAddressTabProps = {
  result: KycBvnLookupResult;
};

export function KycLookupAddressTab({ result }: KycLookupAddressTabProps) {
  const fields = [
    { label: "Residential Address", value: result.address.residentialAddress },
    { label: "City", value: result.address.city },
    { label: "State", value: result.address.state },
    { label: "LGA", value: result.address.lga },
    { label: "Country", value: result.country },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6">
        <h2 className="mb-6 text-base font-semibold text-[color:var(--text-primary)]">
          Address information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1.5">
              <p className="text-sm text-[color:var(--text-muted)]">{field.label}</p>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6">
        <label htmlFor="address-notes" className="text-sm font-medium text-[color:var(--text-primary)]">
          Notes
        </label>
        <textarea
          id="address-notes"
          readOnly
          value={result.notes}
          className="mt-2 min-h-48 w-full resize-none rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-3.5 py-2.5 text-sm text-[color:var(--text-primary)]"
        />
      </div>
    </div>
  );
}
