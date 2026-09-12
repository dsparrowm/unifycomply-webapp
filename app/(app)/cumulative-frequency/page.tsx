import { TmQueueListPanel } from "@/components/transaction-monitoring/TmQueueListPanel";
import { tmCumulativeFrequencyQueueEmpty } from "@/lib/data/tm-queues";

export default function CumulativeFrequencyPage() {
  return <TmQueueListPanel data={tmCumulativeFrequencyQueueEmpty} />;
}
