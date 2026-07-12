import type { KybFilterOption, KybLookupType, KybRegistryLookupResult } from "@/types/kyb";

export const kybLookupTypeOptions: KybFilterOption<KybLookupType>[] = [
  { value: "cac-basic", label: "Corporate Affairs Commission Registration (Basic)" },
  { value: "tin-basic", label: "Tax Identification Number (Basic)" },
  { value: "rc-basic", label: "Registration Number (Basic)" },
];

export const kybLookupCountryOptions: KybFilterOption<string>[] = [
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "kenya", label: "Kenya" },
  { value: "south-africa", label: "South Africa" },
];

export const kybLookupAppOptions: KybFilterOption<string>[] = [
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
];

const lookupTypeLabels: Record<KybLookupType, string> = {
  "cac-basic": "Corporate Affairs Commission Registration (Basic)",
  "tin-basic": "Tax Identification Number (Basic)",
  "rc-basic": "Registration Number (Basic)",
};

const registryCardTitles: Record<KybLookupType, string> = {
  "cac-basic": "CAC Registration Verification",
  "tin-basic": "Tax Identification Number",
  "rc-basic": "Registration Number",
};

const bulkUploadSubjectLabels: Record<KybLookupType, string> = {
  "cac-basic": "Corporate Affairs Commission Registration Number",
  "tin-basic": "Tax Identification Number (TIN)",
  "rc-basic": "Registration Number (RC)",
};

export function getKybLookupTypeLabel(type: KybLookupType): string {
  return lookupTypeLabels[type];
}

export function getKybRegistryCardTitle(type: KybLookupType): string {
  return registryCardTitles[type];
}

export function getKybBulkUploadHint(type: KybLookupType | ""): string {
  if (!type) {
    return "Upload an excel sheet with the selected identifier type";
  }

  return `Upload an excel sheet consist of ${bulkUploadSubjectLabels[type]}`;
}

export function getKybLookupIdentifierLabel(type: KybLookupType): string {
  if (type === "cac-basic") {
    return "CAC Registration Number";
  }

  if (type === "tin-basic") {
    return "TIN";
  }

  return "RC Number";
}

const mockRegistryResult: KybRegistryLookupResult = {
  lookupType: "cac-basic",
  country: "Nigeria",
  countryCode: "NIGERIA",
  countryFlag: "🇳🇬",
  identifier: "RC-23456789",
  legalBusinessName: "TechVentures Nigeria Limited",
  registrationNumber: "RC-23456789",
  dateRegistered: "2018-03-15",
  tin: "12345678-0001",
  businessType: "Private Limited Company",
  industry: "Technology and Software Development",
  status: "Active",
  phoneNumber: "+234 809 123 4567",
  email: "contact@techventures.ng",
  registeredAddress: "45 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  riskScore: 1,
  priority: "Standard",
  initializedAt: "12/02/2026 | 12:09AM",
  updatedAt: "12/02/2026 | 12:09AM",
  notes:
    "Business registration confirmed with the Corporate Affairs Commission. Registry details match the submitted identifier. No adverse flags detected during automated screening.",
  verificationStatus: "successful",
};

export function performKybLookup(
  type: KybLookupType,
  identifier: string,
): KybRegistryLookupResult | null {
  const normalizedIdentifier = identifier.trim();

  if (!normalizedIdentifier) {
    return null;
  }

  return {
    ...mockRegistryResult,
    lookupType: type,
    identifier: normalizedIdentifier,
    registrationNumber: type === "tin-basic" ? mockRegistryResult.registrationNumber : normalizedIdentifier,
    tin: type === "tin-basic" ? normalizedIdentifier : mockRegistryResult.tin,
  };
}
