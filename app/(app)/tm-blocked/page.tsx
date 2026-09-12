import { TmQueueListPanel } from "@/components/transaction-monitoring/TmQueueListPanel";
import { tmBlockedQueuePopulated } from "@/lib/data/tm-queues";

export default function TmBlockedPage() {
  return <TmQueueListPanel data={tmBlockedQueuePopulated} />;
}
