import type { OnboardingStep, OnboardingWizardData } from "@/types/onboarding";

export const onboardingSteps: OnboardingStep[] = [
  { id: "personal", label: "Personal info" },
  { id: "business", label: "Business info" },
  { id: "documents", label: "Document upload" },
  { id: "review", label: "Identity review" },
  { id: "consent", label: "Consent" },
];

export const onboardingNationalityOptions = [
  { label: "Select nationality", value: "" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "Ghana", value: "Ghana" },
  { label: "Kenya", value: "Kenya" },
  { label: "South Africa", value: "South Africa" },
];

export const onboardingGenderOptions = [
  { label: "Select gender", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export const onboardingBusinessTypeOptions = [
  { label: "Select business type", value: "" },
  { label: "Private Limited Company", value: "Private Limited Company" },
  { label: "Public Limited Company", value: "Public Limited Company" },
  { label: "Sole Proprietorship", value: "Sole Proprietorship" },
  { label: "Partnership", value: "Partnership" },
];

export const onboardingCountryOptions = [
  { label: "Select country", value: "" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "Ghana", value: "Ghana" },
  { label: "Kenya", value: "Kenya" },
  { label: "South Africa", value: "South Africa" },
];

export const onboardingCountryCodeOptions = [
  { label: "Select country", value: "" },
  { label: "Nigeria", value: "NG" },
  { label: "Ghana", value: "GH" },
  { label: "Kenya", value: "KE" },
  { label: "South Africa", value: "ZA" },
];

export const onboardingDefaultData: OnboardingWizardData = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    gender: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  },
  business: {
    companyName: "",
    registrationNumber: "",
    businessType: "",
    country: "",
  },
  documents: {
    idNumber: "",
    issueDate: "",
    expiryDate: "",
    idFront: null,
    idBack: null,
    selfie: null,
  },
  consent: {
    dataProcessing: false,
    termsOfService: false,
    accuracyDeclaration: false,
  },
};
