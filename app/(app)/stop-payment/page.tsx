import { TmQueueListPanel } from "@/components/transaction-monitoring/TmQueueListPanel";
import { tmStopPaymentQueuePopulated } from "@/lib/data/tm-queues";

export default function StopPaymentPage() {
  return <TmQueueListPanel data={tmStopPaymentQueuePopulated} />;
}
