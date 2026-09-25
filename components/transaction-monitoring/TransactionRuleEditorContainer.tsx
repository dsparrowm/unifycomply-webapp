"use client";

import { useRouter } from "next/navigation";
import { TransactionRuleEditorPanel } from "@/components/transaction-monitoring/TransactionRuleEditorPanel";
import { useTmRuleMutations } from "@/lib/hooks/use-tm-rules";
import type { TmRuleDetail } from "@/types/tm-rules";

export function TransactionRuleEditorContainer({ initial, mode }: { initial: TmRuleDetail; mode: "create" | "edit" }) {
  const router = useRouter();
  const mutations = useTmRuleMutations();

  return (
    <TransactionRuleEditorPanel
      initial={initial}
      mode={mode}
      onSave={async (detail) => {
        if (mode === "create") await mutations.create.mutateAsync(detail);
        else await mutations.update.mutateAsync({ id: detail.id, detail });
        router.push("/rules");
      }}
    />
  );
}