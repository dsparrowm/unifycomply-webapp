import type {
  ApiAddressDto,
  ApiGender,
  ApiKycDocumentType,
  CreateTenantKybDocumentDto,
  CreateTenantKybDto,
  CreateTenantKycDocumentDto,
  CreateTenantKycDto,
} from "@/lib/api/types";
import type {
  OnboardingBusinessInfo,
  OnboardingDocuments,
  OnboardingPersonalInfo,
} from "@/types/onboarding";
import type { KybOnboardingFormData } from "@/types/kyb-onboarding";

const COUNTRY_CODE_BY_NAME: Record<string, string> = {
  Nigeria: "NG",
  Ghana: "GH",
  Kenya: "KE",
  "South Africa": "ZA",
};

const COUNTRY_LABEL_BY_CODE: Record<string, string> = {
  NG: "Nigeria",
  GH: "Ghana",
  KE: "Kenya",
  ZA: "South Africa",
};

export function countryLabelFromCode(code: string): string {
  const normalized = code.trim().toUpperCase();
  if (COUNTRY_LABEL_BY_CODE[normalized]) {
    return COUNTRY_LABEL_BY_CODE[normalized];
  }
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(normalized) ?? normalized;
  } catch {
    return normalized;
  }
}

const STATE_CODE_BY_COUNTRY: Record<string, string> = {
  NG: "LA",
  GH: "AA",
  KE: "30",
  ZA: "GP",
};

export function countryCodeFromLabel(label: string): string {
  return COUNTRY_CODE_BY_NAME[label] ?? "NG";
}

export function buildAddressDto(input: {
  houseNo: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  countryLabel: string;
}): ApiAddressDto {
  const countryCode = countryCodeFromLabel(input.countryLabel);
  const stateCode = STATE_CODE_BY_COUNTRY[countryCode] ?? "NA";
  const houseNo = input.houseNo.trim() || "—";
  const street = input.street.trim() || "—";
  const city = input.city.trim() || "—";
  const state = input.state.trim() || "—";
  const zipCode = input.zipCode.trim() || "00000";
  const country = input.countryLabel.trim() || "Nigeria";
  const formatted = `${houseNo} ${street}, ${city}, ${state}, ${country}`;

  return {
    houseNo,
    street,
    city,
    state,
    stateCode,
    country,
    countryCode,
    zipCode,
    formatted,
    coordinates: { lat: 0, lng: 0 },
  };
}

export function mapPersonalToCreateKycDto(
  personal: OnboardingPersonalInfo,
): CreateTenantKycDto {
  if (!isApiGender(personal.gender)) {
    throw new Error("Gender is required");
  }

  return {
    firstName: personal.firstName.trim(),
    lastName: personal.lastName.trim(),
    email: personal.email.trim(),
    phone: personal.phone.trim(),
    dob: personal.dateOfBirth,
    gender: personal.gender,
    countryCode: countryCodeFromLabel(personal.nationality),
    address: buildAddressDto({
      houseNo: personal.houseNo,
      street: personal.street,
      city: personal.city,
      state: personal.state,
      zipCode: personal.zipCode,
      countryLabel: personal.nationality,
    }),
  };
}

export async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function mapKycDocumentsToDtos(
  documents: OnboardingDocuments,
): Promise<CreateTenantKycDocumentDto[]> {
  const uploads: { type: ApiKycDocumentType; file: File | null }[] = [
    { type: "national-identity", file: documents.idFront },
    { type: "national-identity", file: documents.idBack },
    { type: "selfie-photo", file: documents.selfie },
  ];

  const result: CreateTenantKycDocumentDto[] = [];
  for (const item of uploads) {
    if (!item.file) {
      continue;
    }
    result.push({
      type: item.type,
      file: await fileToDataUri(item.file),
    });
  }
  return result;
}

/**
 * Business step is retained in the KYC wizard UI (Figma/roadmap) but is not part of
 * CreateTenantKycDto. Logged as product open question — not sent on KYC create.
 */
export function noteUnusedKycBusinessInfo(_business: OnboardingBusinessInfo): void {
  // Intentionally unused until product decides dual-create vs relocate to KYB.
}

export function mapKybFormToCreateDto(data: KybOnboardingFormData): CreateTenantKybDto {
  return {
    businessName: data.business.businessName.trim(),
    registrationDate: data.business.registrationDate,
    contactEmail: data.business.contactEmail.trim(),
    contactPhone: data.business.contactPhone.trim(),
    countryCode: countryCodeFromLabel(data.business.country),
    industry: data.business.industry.trim() || undefined,
    website: data.business.website.trim() || undefined,
    address: buildAddressDto({
      houseNo: data.address.houseNo,
      street: data.address.street,
      city: data.address.city,
      state: data.address.state,
      zipCode: data.address.zipCode,
      countryLabel: data.business.country,
    }),
  };
}

export async function mapKybDocumentsToDtos(
  documents: KybOnboardingFormData["documents"],
): Promise<CreateTenantKybDocumentDto[]> {
  const uploads: { type: CreateTenantKybDocumentDto["type"]; file: File | null }[] = [
    { type: "certificate-of-incorporation", file: documents.certificateOfIncorporation },
    { type: "proof-of-business-address", file: documents.proofOfAddress },
  ];

  const result: CreateTenantKybDocumentDto[] = [];
  for (const item of uploads) {
    if (!item.file) {
      continue;
    }
    result.push({
      type: item.type,
      file: await fileToDataUri(item.file),
    });
  }
  return result;
}

export function isApiGender(value: string): value is ApiGender {
  return value === "male" || value === "female";
}
