import type { ApiAvailableCheck, ApiAvailableChecks } from "@/lib/api/types";
import type { VerificationCheckOption } from "@/types/verification";

function humanizeProvider(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function preferredProvider(providers: string[]): string {
  return providers.find((provider) => provider.startsWith("sandbox")) ?? providers[0] ?? "";
}

export function mapAvailableChecks(data: ApiAvailableChecks | null | undefined): VerificationCheckOption[] {
  const checks = data?.checks ?? [];
  return checks.map((check: ApiAvailableCheck) => ({
    type: check.type,
    label: check.label,
    authority: check.authority,
    providers: check.eligibleProviders.map((provider) => ({
      value: provider,
      label: humanizeProvider(provider),
    })),
  }));
}

export function defaultProviderForCheck(check: VerificationCheckOption): string {
  return preferredProvider(check.providers.map((provider) => provider.value));
}
