export type SarWizardStepId =
  | "basic"
  | "red-flags"
  | "rationale"
  | "export-review";

export type SarBasicInfo = {
  caseId: string;
  transactionId: string;
  entityType: "Individual" | "Organization";
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  fullAddress: string;
  transactionDate: string;
  amount: string;
  transferType: string;
  detectionDate: string;
  priority: "Low" | "Medium" | "High";
  riskLevel: "Low" | "Medium" | "High";
  narration: string;
  accountNumber: string;
  accountType: string;
  openedDate: string;
  accountStatus: string;
};

export type SarRedFlagId =
  | "below-threshold"
  | "high-velocity"
  | "rapid-movement"
  | "consistent-timing"
  | "split-transactions";

export type SarJurisdictionId =
  | "us"
  | "uk"
  | "uae"
  | "sg"
  | "hk"
  | "eu";

export type SarRationaleFields = {
  opening: string;
  activity: string;
  whySuspicious: string;
  investigation: string;
  summary: string;
};

export type SarWizardState = {
  basic: SarBasicInfo;
  redFlagIds: SarRedFlagId[];
  jurisdictionIds: SarJurisdictionId[];
  additionalObservations: string;
  rationale: SarRationaleFields;
};

export type SarRedFlagOption = {
  id: SarRedFlagId;
  title: string;
  description: string;
};

export type SarJurisdictionOption = {
  id: SarJurisdictionId;
  country: string;
  fiu: string;
};

export type SarAssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
