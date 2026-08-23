import { KybListPanel } from "@/components/kyb/KybListPanel";
import { kybListDataPopulated } from "@/lib/data/kyb";

export default function KybPage() {
  return <KybListPanel data={kybListDataPopulated} />;
}
