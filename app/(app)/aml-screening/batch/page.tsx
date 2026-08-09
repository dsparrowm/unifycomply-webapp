import { AmlScreeningBatchPanel } from "@/components/aml-screening/AmlScreeningBatchPanel";
import { amlBatchResult } from "@/lib/data/aml-screening";

export default function AmlScreeningBatchPage() {
  return <AmlScreeningBatchPanel result={amlBatchResult} />;
}
