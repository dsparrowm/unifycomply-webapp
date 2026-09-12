import type { TmTransactionDetail } from "@/types/transaction-monitoring";
import type {
  SarAssistantMessage,
  SarJurisdictionOption,
  SarRedFlagOption,
  SarWizardState,
} from "@/types/sar-rationale";

export const sarWizardSteps = [
  { id: "basic", label: "Basic Information" },
  { id: "red-flags", label: "Red Flags" },
  { id: "rationale", label: "Rationale" },
  { id: "export-review", label: "Export and Review" },
] as const;

export const sarRedFlagOptions: SarRedFlagOption[] = [
  {
    id: "below-threshold",
    title: "Transactions just below $10,000 reporting threshold",
    description: "Multiple deposits/withdrawals of $9,000–$9,999",
  },
  {
    id: "high-velocity",
    title: "High transaction velocity",
    description: "Abnormal frequency or volume of transactions",
  },
  {
    id: "rapid-movement",
    title: "Rapid movement of funds",
    description: "Funds moved quickly across accounts or jurisdictions",
  },
  {
    id: "consistent-timing",
    title: "Consistent timing pattern",
    description: "Repeated transfers at similar times or intervals",
  },
  {
    id: "split-transactions",
    title: "Split transactions",
    description: "Large amounts broken into smaller related transfers",
  },
];

export const sarJurisdictionOptions: SarJurisdictionOption[] = [
  { id: "us", country: "United States", fiu: "FinCEN" },
  { id: "uk", country: "United Kingdom", fiu: "NCA" },
  { id: "uae", country: "UAE", fiu: "Financial Intelligent Unit" },
  { id: "sg", country: "Singapore", fiu: "CAD" },
  { id: "hk", country: "Hong Kong", fiu: "JFIU" },
  { id: "eu", country: "European Union", fiu: "Europol" },
];

export const sarAssistantSuggestions = [
  "Provide the opening statement for the rationale narrative",
  "Draft why this activity is suspicious",
] as const;

export const sarAssistantSeedReply: SarAssistantMessage = {
  id: "assistant-seed",
  role: "assistant",
  content:
    "This SAR concerns suspected structuring activity designed to evade Currency Transaction Reporting requirements (31 USC 5324).\n\nSubject: Unknown Individual\nAccount: ****9643\nTransaction ID: TXN-2026-175260\nPeriod: Oct 2024\nTotal Amount: $9,500\nDetection Date: 2026-03-07\n\nMultiple related transfers just below the $10,000 reporting threshold were observed, consistent with structuring.",
};

export function createSarWizardState(detail: TmTransactionDetail): SarWizardState {
  const amountDigits = detail.amountLabel.replace(/[^0-9.,]/g, "") || "2,000";

  return {
    basic: {
      caseId: "SAR - 20245",
      transactionId: detail.transactionId.replace("TXN-", "Trxn-"),
      entityType: "Individual",
      fullName: detail.customer.name || detail.customerName,
      dateOfBirth: detail.customer.dateOfBirth === "-" ? "" : (detail.customer.dateOfBirth ?? ""),
      nationality: "United States",
      fullAddress: "",
      transactionDate: "",
      amount: `$${amountDigits}`,
      transferType: "Wire",
      detectionDate: "",
      priority: detail.riskScore >= 70 ? "High" : detail.riskScore >= 40 ? "Medium" : "Low",
      riskLevel: detail.riskScore >= 70 ? "High" : detail.riskScore >= 40 ? "Medium" : "Low",
      narration: "",
      accountNumber: "1234567890",
      accountType: "Checking",
      openedDate: "",
      accountStatus: detail.category === "tm-blocked" || detail.category === "stop-payment"
        ? "Blocked"
        : "Active",
    },
    redFlagIds: ["below-threshold", "high-velocity"],
    jurisdictionIds: ["us"],
    additionalObservations: "",
    rationale: {
      opening: "",
      activity: "",
      whySuspicious: "",
      investigation: "",
      summary: "",
    },
  };
}

export function toggleIdInList<T extends string>(list: T[], id: T): T[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}
