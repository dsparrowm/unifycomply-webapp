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
  /** Required by Core Platform CreateTenantKycDto — added to complete live intake. */
  gender: "male" | "female" | "";
  houseNo: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type OnboardingBusinessInfo = {
  companyName: string;
  registrationNumber: string;
  businessType: string;
  country: string;
};

export type OnboardingDocuments = {
  idNumber: string;
  issueDate: string;
  expiryDate: string;
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
