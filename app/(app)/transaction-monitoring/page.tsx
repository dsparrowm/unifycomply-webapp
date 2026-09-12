import { TmOverviewPanel } from "@/components/transaction-monitoring/TmOverviewPanel";
import { tmOverviewDataEmpty } from "@/lib/data/transaction-monitoring";

/** Default empty state matches Figma `1532:157044`. */
export default function TransactionMonitoringPage() {
  return <TmOverviewPanel data={tmOverviewDataEmpty} />;
}
