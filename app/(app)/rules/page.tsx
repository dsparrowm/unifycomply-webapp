import { TransactionRulesListPanel } from "@/components/transaction-monitoring/TransactionRulesListPanel";
import { tmRulesListData } from "@/lib/data/tm-rules";

export default function RulesPage() {
  return <TransactionRulesListPanel rules={tmRulesListData} />;
}
