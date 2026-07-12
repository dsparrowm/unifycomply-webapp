import { RolesAndPermissionPanel } from "@/components/settings/RolesAndPermissionPanel";
import { settingsRolesData } from "@/lib/data/settings";

export default function RolesAndPermissionPage() {
  return <RolesAndPermissionPanel roles={settingsRolesData} />;
}
