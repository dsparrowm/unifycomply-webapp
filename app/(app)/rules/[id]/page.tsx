import { notFound } from "next/navigation";
import { TransactionRuleEditorContainer } from "@/components/transaction-monitoring/TransactionRuleEditorContainer";
import { createEmptyTmRuleDetail, getTmRuleDetail } from "@/lib/data/tm-rules";

type RuleEditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RuleEditorPage({ params }: RuleEditorPageProps) {
  const { id } = await params;

  if (id === "new") {
    return <TransactionRuleEditorContainer initial={createEmptyTmRuleDetail()} mode="create" />;
  }

  const detail = getTmRuleDetail(id);
  if (!detail) {
    notFound();
  }

  return <TransactionRuleEditorContainer initial={detail} mode="edit" />;
}
