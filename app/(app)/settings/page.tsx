import { ProfileManagementPanel } from "@/components/settings/ProfileManagementPanel";
import { settingsProfileData } from "@/lib/data/settings";

export default function SettingsPage() {
  return <ProfileManagementPanel profile={settingsProfileData} />;
}
