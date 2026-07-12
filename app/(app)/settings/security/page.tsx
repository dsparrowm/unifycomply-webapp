import { SecurityPanel } from "@/components/settings/SecurityPanel";
import { settingsSecurityData } from "@/lib/data/settings";

export default function SecurityPage() {
  return <SecurityPanel security={settingsSecurityData} />;
}
