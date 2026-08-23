import { KycListPanel } from "@/components/kyc/KycListPanel";
import { kycListDataPopulated } from "@/lib/data/kyc";

export default function KycPage() {
  return <KycListPanel data={kycListDataPopulated} />;
}
