import { BusinessInformationPanel } from "@/components/settings/BusinessInformationPanel";
import { settingsBusinessInformationData } from "@/lib/data/settings";

export default function BusinessInformationPage() {
  return <BusinessInformationPanel business={settingsBusinessInformationData} />;
}
