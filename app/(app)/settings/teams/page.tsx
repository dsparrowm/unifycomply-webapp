"use client";

import { TeamManagementPanel } from "@/components/settings/TeamManagementPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useCreateTeamInvite,
  useResendTeamInvite,
  useRevokeTeamInvite,
  useSettingsTeams,
  useTeamRoleOptions,
} from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";

export default function TeamsPage() {
  const teamsQuery = useSettingsTeams();
  const rolesQuery = useTeamRoleOptions();
  const createInvite = useCreateTeamInvite();
  const resendInvite = useResendTeamInvite();
  const revokeInvite = useRevokeTeamInvite();

  const isLoading = teamsQuery.isLoading || rolesQuery.isLoading;
  const isError = teamsQuery.isError || rolesQuery.isError;
  const error = teamsQuery.error ?? rolesQuery.error;

  return (
    <SettingsQueryGate
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => {
        void teamsQuery.refetch();
        void rolesQuery.refetch();
      }}
    >
      <TeamManagementPanel
        members={teamsQuery.data ?? []}
        roleOptions={rolesQuery.data ?? []}
        onInvite={async (values) => {
          await runAction(() => createInvite.mutateAsync(values), {
            success: "Invite sent",
            error: "Could not send invite",
          });
        }}
        onResendInvite={async (memberId) => {
          await runAction(() => resendInvite.mutateAsync(memberId), {
            success: "Invite resent",
            error: "Could not resend invite",
          });
        }}
        onRevokeInvite={async (memberId) => {
          await runAction(() => revokeInvite.mutateAsync(memberId), {
            success: "Invite revoked",
            error: "Could not revoke invite",
          });
        }}
      />
    </SettingsQueryGate>
  );
}
