"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { adoptTmRuleTemplate, createTmRule, listTmRuleTemplates, listTmRules, updateTmRule } from "@/lib/api/tm-rules";
import type { TmRuleDetail } from "@/types/tm-rules";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";

export const tmRulesKeys = {
  list: (appId: string | null) => ["transaction-monitoring", "rules", appId ?? "default"] as const,
  templates: (appId: string | null) => ["transaction-monitoring", "rule-templates", appId ?? "default"] as const,
};

export function useTmRules() {
  const { selectedAppId } = useSettingsAppSelection();
  return useQuery({
    queryKey: tmRulesKeys.list(selectedAppId),
    enabled: Boolean(selectedAppId),
    queryFn: () => listTmRules(selectedAppId as string),
  });
}

export function useTmRuleTemplates() {
  const { selectedAppId } = useSettingsAppSelection();
  return useQuery({
    queryKey: tmRulesKeys.templates(selectedAppId),
    enabled: Boolean(selectedAppId),
    queryFn: () => listTmRuleTemplates(selectedAppId as string),
  });
}

export function useTmRuleMutations() {
  const { selectedAppId } = useSettingsAppSelection();
  const requireAppId = () => {
    if (!selectedAppId) throw new Error("Select an app before changing transaction rules");
    return selectedAppId;
  };
  return {
    create: useMutation({ mutationFn: (detail: TmRuleDetail) => createTmRule(requireAppId(), detail) }),
    update: useMutation({ mutationFn: ({ id, detail }: { id: string; detail: TmRuleDetail }) => updateTmRule(requireAppId(), id, detail) }),
    adopt: useMutation({ mutationFn: (templateId: string) => adoptTmRuleTemplate(requireAppId(), templateId) }),
  };
}