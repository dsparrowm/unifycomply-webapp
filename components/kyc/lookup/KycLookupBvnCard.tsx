import { KycLookupProfileAvatar } from "@/components/kyc/lookup/KycLookupProfileAvatar";
import type { KycBvnLookupResult, KycLookupType } from "@/types/kyc";

type KycLookupBvnCardProps = {
  result: KycBvnLookupResult;
  identityTitle?: string;
  identityNumberLabel?: string;
};

const titles: Record<KycLookupType, string> = {
  "bvn-basic": "Bank Verification Number",
  "nin-basic": "National Identification Number",
  "drivers-license-basic": "Driver's License",
  "voters-card-basic": "Voter's Card",
  "passport-basic": "International Passport",
};

const numberLabels: Record<KycLookupType, string> = {
  "bvn-basic": "BVN",
  "nin-basic": "NIN",
  "drivers-license-basic": "License Number",
  "voters-card-basic": "Voter's Card Number",
  "passport-basic": "Passport Number",
};

export function KycLookupBvnCard({ result, identityTitle, identityNumberLabel }: KycLookupBvnCardProps) {
  const title = identityTitle ?? titles[result.lookupType];
  const numberLabel = identityNumberLabel ?? numberLabels[result.lookupType];
  const fields = [
    { label: numberLabel, value: result.bvn || "—" },
    { label: "First Name", value: result.firstName || "—" },
    { label: "Last Name", value: result.lastName || "—" },
    { label: "Middle Name", value: result.middleName || "—" },
    { label: "Gender", value: result.gender || "—" },
    { label: "Phone Number", value: result.phoneNumber || "—" },
    { label: "Date of Birth", value: result.dateOfBirth || "—" },
  ];

  const fullName = [result.firstName, result.lastName].filter(Boolean).join(" ") || "Pending";

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border-subtle)] px-6 py-6">
        <h2 className="text-base font-semibold text-[color:var(--text-primary)]">{title}</h2>
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
