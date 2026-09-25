import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import { unwrapCollection } from "@/lib/api/mappers/customers";
import type { TmRuleDetail, TmRuleRecord } from "@/types/tm-rules";
import type { TmRuleTemplate } from "@/types/tm-rule-templates";
import type { TmRuleDetail } from "@/types/tm-rules";

type ApiTmRule = {
  id?: string;
  name?: string;
  description?: string | Record<string, unknown> | null;
  severityLevel?: string | null;
  tmCondition?: string | null;
  conditions?: Array<{ field?: string; operator?: string; value?: string }> | null;
  autoBlock?: boolean | null;
  sendAlerts?: boolean | null;
  status?: string | null;
  triggerCount?: number | null;
  triggers?: number | null;
};

type ApiTmTemplate = {
  id?: string;
  name?: string;
  industryLabel?: string;
  description?: string;
  popular?: boolean;
  keyFeatures?: string[];
  ruleCount?: number;
};

type TmRulePayload = {
  name: string;
  description: string;
  severityLevel: "critical" | "high" | "medium" | "low";
  tmCondition: "tm-not-blocked" | "stop-payment" | "cumulative-frequency" | "tm-blocked";
  conditions: Array<{ field: string; operator: string; value: string }>;
  autoBlock: boolean;
  sendAlerts: boolean;
  status?: "active" | "inactive";
};

function appPath(appId: string, suffix: string): string {
  return `/api/v1/tenants/apps/${encodeURIComponent(appId)}/transaction-monitoring/${suffix}`;
}

function descriptionOf(description: ApiTmRule["description"]): string {
  if (typeof description === "string") return description;
  if (description && typeof description === "object") {
    return Object.values(description).filter((value): value is string => typeof value === "string").join(" ");
  }
  return "";
}

function severityOf(value: string | null | undefined): TmRuleRecord["severity"] {
  return value === "critical" || value === "high" || value === "medium" || value === "low" ? value : "medium";
}

function conditionLabel(rule: ApiTmRule): string {
  const count = rule.conditions?.length ?? 0;
  return `${count} condition${count === 1 ? "" : "s"}${count > 1 ? " (AND)" : ""}`;
}

export function mapApiTmRuleToRecord(rule: ApiTmRule): TmRuleRecord | null {
  if (!rule.id || !rule.name) return null;
  return {
    id: rule.id,
    name: rule.name,
    description: descriptionOf(rule.description),
    conditionsLabel: conditionLabel(rule),
    severity: severityOf(rule.severityLevel),
    triggers: rule.triggerCount ?? rule.triggers ?? 0,
    status: rule.status === "inactive" ? "inactive" : "active",
  };
}

export function mapApiTmRuleToDetail(rule: ApiTmRule): TmRuleDetail | null {
  const record = mapApiTmRuleToRecord(rule);
  if (!record) return null;
  const conditions = (rule.conditions ?? []).map((condition, index) => ({
    id: `condition-${index + 1}`,
    type: "Data Match",
    field: condition.field ?? "Transaction Amount",
    operator: condition.operator ?? "equals",
    value: condition.value ?? "",
  }));
  return {
    ...record,
    sourceLabel: "Manual",
    tmCondition: rule.tmCondition ?? "tm-blocked",
    blockOnTrigger: rule.autoBlock ?? false,
    sendAlerts: rule.sendAlerts ?? false,
    conditions,
    logicLabel: conditions.map((condition) => `${condition.field} ${condition.operator} \"${condition.value}\"`).join(" AND ") || "No conditions configured",
    actionLabel: rule.autoBlock ? "Block Transaction" : "Send Alert",
    categoryLabel: rule.tmCondition ?? "tm-blocked",
  };
}

export function mapApiTmTemplate(template: ApiTmTemplate): TmRuleTemplate | null {
  if (!template.id || !template.name) return null;
  return {
    id: template.id,
    name: template.name,
    description: template.description ?? "",
    industryLabel: template.industryLabel ?? "General",
    rulesCount: template.ruleCount ?? 0,
    screeningLabel: (template.keyFeatures ?? []).join(" • "),
    popular: template.popular ?? false,
    features: template.keyFeatures ?? [],
    rulesBlurb: template.description ?? "",
    rules: [],
  };
}

export async function listTmRules(appId: string) {
  const envelope = await apiFetchEnvelope<ApiTmRule[]>(appPath(appId, "rules"), {
    query: { page: "1", limit: "100" },
  });
  return unwrapCollection(envelope.data)
    .map((rule) => mapApiTmRuleToRecord(rule as ApiTmRule))
    .filter((rule): rule is TmRuleRecord => rule !== null);
}

export async function listTmRuleTemplates(appId: string) {
  const data = await apiFetch<ApiTmTemplate[]>(appPath(appId, "rule-templates"));
  return (Array.isArray(data) ? data : []).map(mapApiTmTemplate).filter((item): item is TmRuleTemplate => item !== null);
}

function tmConditionValue(value: string): TmRulePayload["tmCondition"] {
  const normalized = value.toLowerCase().replaceAll(" ", "-");
  if (normalized === "stop-payment" || normalized === "cumulative-frequency" || normalized === "tm-not-blocked") return normalized;
  return "tm-blocked";
}

function fieldValue(value: string): string {
  const fields: Record<string, string> = {
    "Transaction Amount": "transaction_amount",
    Currency: "currency",
    Category: "transaction_type",
    "Transaction Type": "transaction_type",
    "Device Location": "device_location",
    "Ip Address": "ip_address",
    "Merchant Type": "merchant_type",
  };
  return fields[value] ?? value;
}

function operatorValue(value: string): string {
  const operators: Record<string, string> = {
    "Equals (=)": "equals",
    "Greater Than (>)": "greater-than",
    "Less Than (<)": "less-than",
    "Not Equals (!=)": "not-equals",
  };
  return operators[value] ?? value;
}

export function mapTmRuleDetailToPayload(detail: TmRuleDetail): TmRulePayload {
  return {
    name: detail.name.trim(),
    description: detail.description.trim(),
    severityLevel: detail.severity,
    tmCondition: tmConditionValue(detail.tmCondition),
    conditions: detail.conditions.map((condition) => ({
      field: fieldValue(condition.field),
      operator: operatorValue(condition.operator),
      value: condition.value,
    })),
    autoBlock: detail.blockOnTrigger,
    sendAlerts: detail.sendAlerts,
    status: "active",
  };
}

export function createTmRule(appId: string, detail: TmRuleDetail) {
  return apiFetch<unknown>(appPath(appId, "rules"), {
    method: "POST",
    body: mapTmRuleDetailToPayload(detail),
  });
}

export function updateTmRule(appId: string, ruleId: string, detail: TmRuleDetail) {
  return apiFetch<unknown>(appPath(appId, `rules/${encodeURIComponent(ruleId)}`), {
    method: "PATCH",
    body: mapTmRuleDetailToPayload(detail),
  });
}

export function adoptTmRuleTemplate(appId: string, templateId: string) {
  return apiFetch<unknown>(appPath(appId, `rule-templates/${encodeURIComponent(templateId)}/adopt`), {
    method: "POST",
  });
}