import type { TmRuleSeverity } from "@/types/tm-rules";

export type TmTemplateRuleAction =
  | "autoblock"
  | "stop-payment"
  | "cumulative-frequency";

export type TmTemplateRule = {
  id: string;
  name: string;
  description: string;
  severity: TmRuleSeverity;
  action: TmTemplateRuleAction;
  priorityLabel: string;
  conditionsLabel: string;
};

export type TmRuleTemplate = {
  id: string;
  name: string;
  description: string;
  industryLabel: string;
  rulesCount: number;
  screeningLabel: string;
  popular: boolean;
  features: string[];
  rulesBlurb: string;
  rules: TmTemplateRule[];
};

export type TmRuleTemplateCatalog = {
  totalPackages: number;
  industries: number;
  totalRules: number;
  packages: TmRuleTemplate[];
};
