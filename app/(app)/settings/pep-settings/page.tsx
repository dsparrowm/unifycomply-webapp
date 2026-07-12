import { PepSettingsPanel } from "@/components/settings/PepSettingsPanel";
import { settingsPepData } from "@/lib/data/settings";

export default function PepSettingsPage() {
  return <PepSettingsPanel pepSettings={settingsPepData} />;
}
