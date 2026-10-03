/** Values `PUT …/compliance-rules` accepts for required documents. */
export const KYC_DOCUMENT_REQUIREMENTS = [
  { value: "id-document", label: "ID Document" },
  { value: "proof-of-address", label: "Proof of Address" },
  { value: "liveness-check", label: "Liveness Check" },
] as const;

export const KYB_DOCUMENT_REQUIREMENTS = [
  { value: "certificate-of-incorporation", label: "Certificate of Incorporation" },
  { value: "tax-identity", label: "Tax Identity" },
  { value: "proof-of-business-address", label: "Proof of Business Address" },
  { value: "directors-id", label: "Directors ID" },
] as const;

export type ComplianceRuleOption = {
  label: string;
  value: string;
};
