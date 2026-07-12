import { NotificationPanel } from "@/components/settings/NotificationPanel";
import { settingsNotificationsData } from "@/lib/data/settings";

export default function NotificationPage() {
  return <NotificationPanel notifications={settingsNotificationsData} />;
}
