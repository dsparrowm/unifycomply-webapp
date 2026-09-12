export type KybOnboardingStepId =
  | "business"
  | "address"
  | "documents"
  | "review"
  | "consent";

export type KybOnboardingStep = {
  id: KybOnboardingStepId;
  label: string;
};

export type KybOnboardingBusinessInfo = {
  businessName: string;
  registrationDate: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  industry: string;
  website: string;
};

export type KybOnboardingAddress = {
  houseNo: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type KybOnboardingDocuments = {
  certificateOfIncorporation: File | null;
  proofOfAddress: File | null;
};

export type KybOnboardingConsent = {
  dataProcessing: boolean;
  termsOfService: boolean;
  accuracyDeclaration: boolean;
};

export type KybOnboardingFormData = {
  business: KybOnboardingBusinessInfo;
  address: KybOnboardingAddress;
  documents: KybOnboardingDocuments;
  consent: KybOnboardingConsent;
};
