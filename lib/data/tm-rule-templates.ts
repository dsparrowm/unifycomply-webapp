import type { TmRuleTemplate, TmRuleTemplateCatalog } from "@/types/tm-rule-templates";

/** Detection rules shown on Figma `TM rules setting-13`. */
const fintechDetectionRules: TmRuleTemplate["rules"] = [
  {
    id: "tpl-geo",
    name: "Suspicious Geo-Location Pattern",
    description: "Detects transactions with significant geo-location mismatch (>5000km)",
    severity: "critical",
    action: "autoblock",
    priorityLabel: "Priority: High",
    conditionsLabel: "2 conditions",
  },
  {
    id: "tpl-ml-fraud",
    name: "High ML Fraud Probability",
    description: "Detects transactions with significant geo-location mismatch (>5000km)",
    severity: "critical",
    action: "autoblock",
    priorityLabel: "Priority: High",
    conditionsLabel: "2 conditions",
  },
  {
    id: "tpl-withdrawal",
    name: "Large Withdrawal Pattern",
    description: "Detects transactions with significant geo-location mismatch (>5000km)",
    severity: "high",
    action: "cumulative-frequency",
    priorityLabel: "Priority: High",
    conditionsLabel: "2 conditions",
  },
  {
    id: "tpl-new-device",
    name: "New Device High Amount",
    description: "Detects transactions with significant geo-location mismatch (>5000km)",
    severity: "high",
    action: "stop-payment",
    priorityLabel: "Priority: High",
    conditionsLabel: "2 conditions",
  },
  {
    id: "tpl-high-value",
    name: "High Value Transaction",
    description: "Detects transactions with significant geo-location mismatch (>5000km)",
    severity: "medium",
    action: "stop-payment",
    priorityLabel: "Priority: High",
    conditionsLabel: "2 conditions",
  },
  {
    id: "tpl-velocity",
    name: "Velocity Spike Detection",
    description: "Detects transactions with significant geo-location mismatch (>5000km)",
    severity: "high",
    action: "cumulative-frequency",
    priorityLabel: "Priority: High",
    conditionsLabel: "2 conditions",
  },
];

const packageCopy = {
  description:
    "Comprehensive fraud detection rules specifically designed for fintech companies and payment processors. Includes high-value transaction",
    industryLabel: "Fintech and Payment Processing Industry",
    rulesBlurb: "Predefined rules and regulation guiding fintech and payment process",
  features: ["Withdrawal Monitoring", "Cross border Monitoring", "AML Compliance"],
};

const packages: TmRuleTemplate[] = [
  {
    id: "tpl-fintech",
    name: "Fintech TM Detection Suite",
    popular: true,
    rulesCount: 6,
    screeningLabel: "Real time screening",
    ...packageCopy,
    rules: fintechDetectionRules,
  },
  {
    id: "tpl-banking",
    name: "Banking & Financial Services Suite",
    popular: true,
    rulesCount: 6,
    screeningLabel: "Real time screening",
    ...packageCopy,
    rules: fintechDetectionRules,
  },
  {
    id: "tpl-ecommerce",
    name: "E-Commerce Protection Package",
    popular: false,
    rulesCount: 6,
    screeningLabel: "Real time screening",
    ...packageCopy,
    rules: fintechDetectionRules,
  },
  {
    id: "tpl-crypto",
    name: "Cryptocurrency & Blockchain Security",
    popular: false,
    rulesCount: 6,
    screeningLabel: "Real time screening",
    ...packageCopy,
    rules: fintechDetectionRules,
  },
  {
    id: "tpl-remittance",
    name: "Money Transfer & Remittance Suite",
    popular: false,
    rulesCount: 6,
    screeningLabel: "Real time screening",
    ...packageCopy,
    rules: fintechDetectionRules,
  },
  {
    id: "tpl-insurance",
    name: "Insurance Fraud Detection",
    popular: false,
    rulesCount: 6,
    screeningLabel: "Real time screening",
    ...packageCopy,
    rules: fintechDetectionRules,
  },
];

/** Catalog aligned to Figma `TM rules setting-11` / `-12`. */
export const tmRuleTemplateCatalog: TmRuleTemplateCatalog = {
  totalPackages: 12,
  industries: 12,
  totalRules: 40,
  packages,
};

export function getTmRuleTemplate(id: string): TmRuleTemplate | null {
  return packages.find((item) => item.id === id) ?? null;
}
