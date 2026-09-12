import { TransactionsListPanel } from "@/components/transaction-monitoring/TransactionsListPanel";
import { tmTransactionsListPopulated } from "@/lib/data/transactions";

export default function TransactionsPage() {
  return <TransactionsListPanel data={tmTransactionsListPopulated} />;
}
