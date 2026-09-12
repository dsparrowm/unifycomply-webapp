import type { KycFilterOption } from "@/types/kyc";

export const KYC_UNASSIGNED_LABEL = "Unassigned";

/** Reviewers shown on populated KYC list frames (86–89, 95, 116, 124–126). */
export const kycAssigneeOptions: KycFilterOption[] = [
  { value: "", label: KYC_UNASSIGNED_LABEL },
  { value: "Alimi Ayomikun", label: "Alimi Ayomikun" },
  { value: "Tejumade Olomola", label: "Tejumade Olomola" },
  { value: "Favour Soma", label: "Favour Soma" },
];
