export type TmRuleSeverity = "critical" | "high" | "medium" | "low";

export type TmRuleStatus = "active" | "inactive";

export type TmRuleRecord = {
  id: string;
  name: string;
  description: string;
  conditionsLabel: string;
  severity: TmRuleSeverity;
  triggers: number;
  status: TmRuleStatus;
};

export type TmRuleCondition = {
  id: string;
  type: string;
  field: string;
  operator: string;
  value: string;
};

export type TmRuleDetail = {
  id: string;
  name: string;
  description: string;
  severity: TmRuleSeverity;
  sourceLabel: "Manual" | "Template";
  tmCondition: string;
  blockOnTrigger: boolean;
  sendAlerts: boolean;
  conditions: TmRuleCondition[];
  logicLabel: string;
  actionLabel: string;
  categoryLabel: string;
};
