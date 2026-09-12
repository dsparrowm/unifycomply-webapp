import { notFound } from "next/navigation";
import { TransactionRuleEditorPanel } from "@/components/transaction-monitoring/TransactionRuleEditorPanel";
import { createEmptyTmRuleDetail, getTmRuleDetail } from "@/lib/data/tm-rules";

type RuleEditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RuleEditorPage({ params }: RuleEditorPageProps) {
  const { id } = await params;

  if (id === "new") {
    return (
      <TransactionRuleEditorPanel initial={createEmptyTmRuleDetail()} mode="create" />
    );
  }

  const detail = getTmRuleDetail(id);
  if (!detail) {
    notFound();
  }

  return <TransactionRuleEditorPanel initial={detail} mode="edit" />;
}
