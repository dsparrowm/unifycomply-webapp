import { KycLookupProfileAvatar } from "@/components/kyc/lookup/KycLookupProfileAvatar";
import type { KycBvnLookupResult } from "@/types/kyc";

type KycLookupBvnCardProps = {
  result: KycBvnLookupResult;
};

export function KycLookupBvnCard({ result }: KycLookupBvnCardProps) {
  const fields = [
    { label: "BVN", value: result.bvn },
    { label: "First Name", value: result.firstName },
    { label: "Last Name", value: result.lastName },
    { label: "Middle Name", value: result.middleName },
    { label: "Gender", value: result.gender },
    { label: "Phone Number", value: result.phoneNumber },
    { label: "Date of Birth", value: result.dateOfBirth },
  ];

  const fullName = `${result.firstName} ${result.lastName}`;

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border-subtle)] px-6 py-6">
        <h2 className="text-base font-semibold text-[color:var(--text-primary)]">
          Bank Verification Number
        </h2>
        <span className="inline-flex items-center gap-1 rounded-md bg-[color:var(--bg-muted)] px-2 py-1 text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
          {result.countryCode}
          <span aria-hidden>{result.countryFlag}</span>
        </span>
      </div>

      <div className="flex flex-col gap-8 p-6 lg:flex-row lg:items-start">
        <KycLookupProfileAvatar name={fullName} variant="square" />

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
