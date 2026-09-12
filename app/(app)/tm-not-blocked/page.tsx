import { TmQueueListPanel } from "@/components/transaction-monitoring/TmQueueListPanel";
import { tmNotBlockedQueuePopulated } from "@/lib/data/tm-queues";

export default function TmNotBlockedPage() {
  return <TmQueueListPanel data={tmNotBlockedQueuePopulated} />;
}
