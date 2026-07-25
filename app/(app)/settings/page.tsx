"use client";

import { ProfileManagementPanel } from "@/components/settings/ProfileManagementPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useSettingsProfile,
  useUpdateSettingsProfile,
} from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";

export default function SettingsPage() {
  const profileQuery = useSettingsProfile();
  const updateProfile = useUpdateSettingsProfile();

  return (
    <SettingsQueryGate
      isLoading={profileQuery.isLoading}
      isError={profileQuery.isError}
      error={profileQuery.error}
      onRetry={() => void profileQuery.refetch()}
    >
      {profileQuery.data ? (
        <ProfileManagementPanel
          profile={profileQuery.data}
          onSave={async (values) => {
            await runAction(() => updateProfile.mutateAsync(values), {
              success: "Profile updated",
              error: "Could not update profile",
            });
          }}
        />
      ) : null}
    </SettingsQueryGate>
  );
}
