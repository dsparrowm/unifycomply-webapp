import type { TmRuleDetail, TmRuleRecord } from "@/types/tm-rules";

/** Populated list — Figma `TM rules setting-4`. */
export const tmRulesListPopulated: TmRuleRecord[] = [
  {
    id: "rule-geo",
    name: "Suspicious Geo-Location Pattern",
    description: "Detects transactions with significant geo-location mismatch (>5000km)",
    conditionsLabel: "2 conditions (AND)",
    severity: "critical",
    triggers: 0,
    status: "active",
  },
  {
    id: "rule-ml-fraud",
    name: "High ML Fraud Probability",
    description: "Flags transactions with elevated machine-learning fraud scores",
    conditionsLabel: "1 condition",
    severity: "medium",
    triggers: 0,
    status: "active",
  },
  {
    id: "rule-withdrawal",
    name: "Large Withdrawal Pattern",
    description: "Detects unusually large cash or ATM withdrawals vs customer baseline",
    conditionsLabel: "2 conditions (AND)",
    severity: "high",
    triggers: 0,
    status: "active",
  },
  {
    id: "rule-new-device",
    name: "New Device High Amount",
    description: "Blocks high-value payments originating from newly seen devices",
    conditionsLabel: "2 conditions (AND)",
    severity: "high",
    triggers: 0,
    status: "active",
  },
  {
    id: "rule-high-value",
    name: "High Value Transaction",
    description: "Monitors transfers exceeding configured high-value thresholds",
    conditionsLabel: "1 condition",
    severity: "high",
    triggers: 0,
    status: "active",
  },
  {
    id: "rule-velocity",
    name: "Velocity Spike Detection",
    description: "Identifies abnormal transaction frequency within a short window",
    conditionsLabel: "3 conditions (AND)",
    severity: "medium",
    triggers: 0,
    status: "active",
  },
];

export const tmRulesListEmpty: TmRuleRecord[] = [];

export const tmRulesListData = tmRulesListPopulated;

const detailById: Record<string, TmRuleDetail> = {
  "rule-geo": {
    id: "rule-geo",
    name: "Suspicious Geo-Location Pattern",
    description: "Detects transactions with significant geo-location mismatch (>5000km)",
    severity: "critical",
    sourceLabel: "Manual",
    tmCondition: "TM Blocked",
    blockOnTrigger: true,
    sendAlerts: true,
    conditions: [
      {
        id: "c1",
        type: "Data Match",
        field: "Device Location",
        operator: "Equals (=)",
        value: "true",
      },
      {
        id: "c2",
        type: "Compare Fields",
        field: "Transaction Amount",
        operator: "Greater Than (>)",
        value: "5000",
      },
    ],
    logicLabel: 'geo_mismatch Equals (=) "true" AND geo_mismatch_distance Greater Than (>) "5000"',
    actionLabel: "Block Transaction",
    categoryLabel: "TM Blocked",
  },
};

export function getTmRuleDetail(id: string): TmRuleDetail | null {
  if (detailById[id]) {
    return detailById[id];
  }

  const listRecord = tmRulesListPopulated.find((rule) => rule.id === id);
  if (!listRecord) {
    return null;
  }

  return {
    id: listRecord.id,
    name: listRecord.name,
    description: listRecord.description,
    severity: listRecord.severity,
    sourceLabel: "Manual",
    tmCondition: "TM Blocked",
    blockOnTrigger: true,
    sendAlerts: true,
    conditions: [
      {
        id: "c1",
        type: "Data Match",
        field: "Transaction Amount",
        operator: "Greater Than (>)",
        value: "10000",
      },
    ],
    logicLabel: `${listRecord.name} condition logic`,
    actionLabel: "Block Transaction",
    categoryLabel: "TM Blocked",
  };
}

export function createEmptyTmRuleDetail(): TmRuleDetail {
  return {
    id: "new",
    name: "",
    description: "",
    severity: "medium",
    sourceLabel: "Manual",
    tmCondition: "TM Blocked",
    blockOnTrigger: true,
    sendAlerts: true,
    conditions: [],
    logicLabel: "No conditions configured",
    actionLabel: "Block Transaction",
    categoryLabel: "TM Blocked",
  };
}
