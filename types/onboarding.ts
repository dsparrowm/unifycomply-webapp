export type OnboardingStepId =
  | "personal"
  | "business"
  | "documents"
  | "review"
  | "consent";

export type OnboardingStep = {
  id: OnboardingStepId;
  label: string;
};

export type OnboardingPersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
};

export type OnboardingBusinessInfo = {
  companyName: string;
  registrationNumber: string;
  businessType: string;
  country: string;
};

export type OnboardingDocuments = {
  idFront: File | null;
  idBack: File | null;
  selfie: File | null;
};

export type OnboardingConsent = {
  dataProcessing: boolean;
  termsOfService: boolean;
  accuracyDeclaration: boolean;
};

export type OnboardingWizardData = {
  personal: OnboardingPersonalInfo;
  business: OnboardingBusinessInfo;
  documents: OnboardingDocuments;
  consent: OnboardingConsent;
};
