import type { KybOnboardingFormData, KybOnboardingStep } from "@/types/kyb-onboarding";
import { onboardingCountryOptions } from "@/lib/data/onboarding";

export const kybOnboardingSteps: KybOnboardingStep[] = [
  { id: "business", label: "Business info" },
  { id: "address", label: "Address" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
  { id: "consent", label: "Consent" },
];

export const kybOnboardingCountryOptions = onboardingCountryOptions;

export const kybOnboardingDefaultData: KybOnboardingFormData = {
  business: {
    businessName: "",
    registrationDate: "",
    contactEmail: "",
    contactPhone: "",
    country: "",
    industry: "",
    website: "",
  },
  address: {
    houseNo: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  },
  documents: {
    certificateOfIncorporation: null,
    proofOfAddress: null,
  },
  consent: {
    dataProcessing: false,
    termsOfService: false,
    accuracyDeclaration: false,
  },
};
