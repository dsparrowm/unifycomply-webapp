import { KybLookupBusinessAvatar } from "@/components/kyb/lookup/KybLookupBusinessAvatar";
import { getKybRegistryCardTitle } from "@/lib/data/kyb-lookup";
import type { KybRegistryLookupResult } from "@/types/kyb";

type KybLookupRegistryCardProps = {
  result: KybRegistryLookupResult;
};

export function KybLookupRegistryCard({ result }: KybLookupRegistryCardProps) {
  const fields = [
    { label: "Legal Business Name", value: result.legalBusinessName },
    { label: "Registration Number", value: result.registrationNumber },
    { label: "Date Registered", value: result.dateRegistered },
    { label: "Tax Identification Number (TIN)", value: result.tin },
    { label: "Business Type", value: result.businessType },
    { label: "Country", value: result.country },
    { label: "Industry", value: result.industry },
    { label: "Status", value: result.status },
    { label: "Registered Address", value: result.registeredAddress },
    { label: "Phone Number", value: result.phoneNumber },
    { label: "Email Address", value: result.email },
  ];

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border-subtle)] px-6 py-6">
        <h2 className="text-base font-semibold text-[color:var(--text-primary)]">
          {getKybRegistryCardTitle(result.lookupType)}
        </h2>
        <span className="inline-flex items-center gap-1 rounded-md bg-[color:var(--bg-muted)] px-2 py-1 text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
          {result.countryCode}
          <span aria-hidden>{result.countryFlag}</span>
        </span>
      </div>

      <div className="flex flex-col gap-8 p-6 lg:flex-row lg:items-start">
        <KybLookupBusinessAvatar name={result.legalBusinessName} variant="square" />

        <div className="grid flex-1 gap-x-20 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <div key={field.label} className="space-y-3">
              <p className="text-sm text-[color:var(--text-muted)]">{field.label}</p>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
