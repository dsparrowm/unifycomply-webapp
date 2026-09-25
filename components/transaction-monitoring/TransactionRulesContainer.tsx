"use client";

import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { TransactionRulesListPanel } from "@/components/transaction-monitoring/TransactionRulesListPanel";
import { getErrorMessage } from "@/lib/api/errors";
import { useTmRuleMutations, useTmRuleTemplates, useTmRules } from "@/lib/hooks/use-tm-rules";

export function TransactionRulesContainer() {
  const rules = useTmRules();
  const templates = useTmRuleTemplates();
  const mutations = useTmRuleMutations();

  if (rules.isLoading || templates.isLoading) return <PageLoadingSkeleton variant="dashboard" />;
  if (rules.isError || templates.isError) {
    return (
      <PageErrorState
        title="Could not load transaction rules"
        description={getErrorMessage(rules.error ?? templates.error, "The transaction rules could not be loaded.")}
        onRetry={() => {
          void rules.refetch();
          void templates.refetch();
        }}
      />
    );
  }

  return (
    <TransactionRulesListPanel
      rules={rules.data ?? []}
      templates={templates.data ?? []}
      onTemplateAdopt={(template) => void mutations.adopt.mutateAsync(template.id)}
    />
  );
}