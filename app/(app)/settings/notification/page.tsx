"use client";

import { NotificationPanel } from "@/components/settings/NotificationPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useSettingsNotifications,
  useUpdateSettingsNotifications,
} from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";

export default function NotificationPage() {
  const notificationsQuery = useSettingsNotifications();
  const updateNotifications = useUpdateSettingsNotifications();

  return (
    <SettingsQueryGate
      isLoading={notificationsQuery.isLoading}
      isError={notificationsQuery.isError}
      error={notificationsQuery.error}
      onRetry={() => void notificationsQuery.refetch()}
    >
      {notificationsQuery.data ? (
        <NotificationPanel
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
  );
}
