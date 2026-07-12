import type { KycBvnLookupResult, KycFilterOption, KycLookupType } from "@/types/kyc";

export const kycLookupTypeOptions: KycFilterOption<KycLookupType>[] = [
  { value: "bvn-basic", label: "Bank Verification Number (Basic)" },
  { value: "nin-basic", label: "National Identification Number (Basic)" },
  { value: "drivers-license-basic", label: "Driver's License (Basic)" },
  { value: "voters-card-basic", label: "Voter's Card (Basic)" },
  { value: "passport-basic", label: "International Passport (Basic)" },
];

export const kycLookupCountryOptions: KycFilterOption<string>[] = [
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "kenya", label: "Kenya" },
  { value: "south-africa", label: "South Africa" },
];

export const kycLookupAppOptions: KycFilterOption<string>[] = [
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
];

const lookupTypeLabels: Record<KycLookupType, string> = {
  "bvn-basic": "Bank Verification Number (Basic)",
  "nin-basic": "National Identification Number (Basic)",
  "drivers-license-basic": "Driver's License (Basic)",
  "voters-card-basic": "Voter's Card (Basic)",
  "passport-basic": "International Passport (Basic)",
};

export function getKycLookupTypeLabel(type: KycLookupType): string {
  return lookupTypeLabels[type];
}

const bulkUploadSubjectLabels: Record<KycLookupType, string> = {
  "bvn-basic": "Bank Verification Number (BVN)",
  "nin-basic": "National Identification Number (NIN)",
  "drivers-license-basic": "Driver's License",
  "voters-card-basic": "Voter's Card",
  "passport-basic": "International Passport",
};

export function getKycBulkUploadHint(type: KycLookupType | ""): string {
  if (!type) {
    return "Upload an excel sheet with the selected identifier type";
  }

  return `Upload an excel sheet consist of ${bulkUploadSubjectLabels[type]}`;
}

export function getKycLookupIdentifierLabel(type: KycLookupType): string {
  if (type === "bvn-basic") {
    return "BVN";
  }

  if (type === "nin-basic") {
    return "NIN Number";
  }

  if (type === "drivers-license-basic") {
    return "License Number";
  }

  if (type === "voters-card-basic") {
    return "Voter's Card Number";
  }

  return "Passport Number";
}

const mockBvnResult: KycBvnLookupResult = {
  lookupType: "bvn-basic",
  country: "Nigeria",
  countryCode: "NIGERIA",
  countryFlag: "🇳🇬",
  identifier: "12345678901",
  bvn: "12345678901",
  firstName: "Favour",
  lastName: "Peter",
  middleName: "Soma",
  gender: "Female",
  phoneNumber: "0811234567890",
  dateOfBirth: "12/02/2003",
  riskScore: 1,
  priority: "Standard",
  initializedAt: "12/02/2026 | 12:09AM",
  updatedAt: "12/02/2026 | 12:09AM",
  address: {
    residentialAddress: "12 Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    state: "Lagos",
    lga: "Eti-Osa",
  },
  notes:
    "BVN lookup completed successfully. Identity details match the national registry. No adverse flags detected during automated screening.",
  status: "successful",
};

export function performKycLookup(
  type: KycLookupType,
  identifier: string,
): KycBvnLookupResult | null {
  const normalizedIdentifier = identifier.trim();

  if (!normalizedIdentifier) {
    return null;
  }

  if (type === "bvn-basic") {
    return {
      ...mockBvnResult,
      identifier: normalizedIdentifier,
      bvn: normalizedIdentifier,
    };
  }

  return {
    ...mockBvnResult,
    lookupType: type,
    identifier: normalizedIdentifier,
    bvn: normalizedIdentifier,
  };
}
