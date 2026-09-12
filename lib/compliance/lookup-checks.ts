import type { ApiAvailableCheck } from "@/lib/api/types";
import { countryCodeFromSlug } from "@/lib/compliance/format";
import type { KycFilterOption, KycLookupType } from "@/types/kyc";
import type { KybLookupType } from "@/types/kyb";

const KYC_LOOKUP_TYPES: KycLookupType[] = [
  "bvn-basic",
  "nin-basic",
  "drivers-license-basic",
  "voters-card-basic",
  "passport-basic",
];

export function isKycLookupType(value: string): value is KycLookupType {
  return KYC_LOOKUP_TYPES.includes(value as KycLookupType);
}

export function mapCheckToKycLookupType(type: string): KycLookupType {
  if (type.includes("passport")) return "passport-basic";
  if (type.includes("driver")) return "drivers-license-basic";
  if (type.includes("voter")) return "voters-card-basic";
  if (type.includes("bank") || type === "bvn") return "bvn-basic";
  return "nin-basic";
}

const KYB_LOOKUP_TYPES: KybLookupType[] = ["cac-basic", "tin-basic", "rc-basic"];

export function isKybLookupType(value: string): value is KybLookupType {
  return KYB_LOOKUP_TYPES.includes(value as KybLookupType);
}

export function mapCheckToKybLookupType(type: string): KybLookupType {
  if (type.includes("tax") || type === "tin") return "tin-basic";
  if (type.includes("registration-number") || type === "rc") return "rc-basic";
  return "cac-basic";
}

const KYC_LOOKUP_CHECK_TYPES = ["bank-account", "national-id", "passport", "driver-license"];

export function filterKycLookupChecks(checks: ApiAvailableCheck[]): ApiAvailableCheck[] {
  return checks.filter((check) => KYC_LOOKUP_CHECK_TYPES.includes(check.type));
}

export function checksToOptions(checks: ApiAvailableCheck[]): KycFilterOption<string>[] {
  return checks.map((check) => ({ value: check.type, label: check.label }));
}

export function lookupCountryCode(countrySlug: string) {
  return countryCodeFromSlug(countrySlug);
}
