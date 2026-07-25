"use client";

import { SecurityPanel } from "@/components/settings/SecurityPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useMfaActions,
  useSettingsMfa,
  useUpdatePassword,
} from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";
import type { SettingsSecurity } from "@/types/settings";

export default function SecurityPage() {
  const mfaQuery = useSettingsMfa();
  const updatePassword = useUpdatePassword();
  const mfaActions = useMfaActions();

  const security: SettingsSecurity | null = mfaQuery.data
    ? {
        twoFactorEnabled: mfaQuery.data.MFAEnabled,
        twoFactorStatus: mfaQuery.data.MFAEnabled ? "Enabled" : "Disabled",
        twoFactorMethod: "Authenticator app",
        sessions: [],
      }
    : null;

  return (
    <SettingsQueryGate
      isLoading={mfaQuery.isLoading}
      isError={mfaQuery.isError}
      error={mfaQuery.error}
      onRetry={() => void mfaQuery.refetch()}
    >
      {security ? (
        <SecurityPanel
          security={security}
          onChangePassword={async (password) => {
            await runAction(() => updatePassword.mutateAsync(password), {
              success: "Password updated",
              error: "Could not update password",
            });
          }}
          onSetupMfa={() => mfaActions.setup.mutateAsync()}
          onEnableMfa={async (token) => {
            await runAction(() => mfaActions.enable.mutateAsync(token), {
              success: "Two-factor authentication enabled",
              error: "Could not enable MFA",
            });
          }}
          onDisableMfa={async (token) => {
            await runAction(() => mfaActions.disable.mutateAsync(token), {
              success: "Two-factor authentication disabled",
              error: "Could not disable MFA",
            });
          }}
        />
      ) : null}
    </SettingsQueryGate>
  );
}
