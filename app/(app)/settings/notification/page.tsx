"use client";

import { NotificationPanel } from "@/components/settings/NotificationPanel";
import { SettingsAppScopedGate } from "@/components/settings/SettingsAppScopedGate";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useSettingsNotifications,
  useUpdateSettingsNotifications,
} from "@/lib/hooks/use-settings";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import { runAction } from "@/lib/toast";

export default function NotificationPage() {
  const { selectedAppId } = useSettingsAppSelection();
  const notificationsQuery = useSettingsNotifications();
  const updateNotifications = useUpdateSettingsNotifications();

  return (
    <SettingsAppScopedGate>
      <SettingsQueryGate
        isLoading={notificationsQuery.isLoading}
        isError={notificationsQuery.isError}
        error={notificationsQuery.error}
        onRetry={() => void notificationsQuery.refetch()}
      >
        {notificationsQuery.data ? (
          <NotificationPanel
            key={selectedAppId}
            notifications={notificationsQuery.data}
            onSave={async (input) => {
              await runAction(() => updateNotifications.mutateAsync(input), {
                success: "Notification preferences saved",
                error: "Could not save notification preferences",
              });
            }}
          />
        ) : null}
      </SettingsQueryGate>
    </SettingsAppScopedGate>
  );
}
