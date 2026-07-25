"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { InviteTeamMemberModal } from "@/components/settings/InviteTeamMemberModal";
import { TeamMemberCard } from "@/components/settings/TeamMemberCard";
import type { SettingsSelectOption, SettingsTeamMember } from "@/types/settings";

type TeamManagementPanelProps = {
  members: SettingsTeamMember[];
  roleOptions: SettingsSelectOption[];
  onInvite: (values: {
    fullName: string;
    email: string;
    roleId: string;
  }) => Promise<void>;
  onResendInvite: (memberId: string) => Promise<void>;
  onRevokeInvite: (memberId: string) => Promise<void>;
};

export function TeamManagementPanel({
  members,
  roleOptions,
  onInvite,
  onResendInvite,
  onRevokeInvite,
}: TeamManagementPanelProps) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
              Team Management
            </h2>
            <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
              Add, remove, and manage team members and their access levels
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[color:var(--accent-primary-soft)] bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
          >
            Invite Team Member
          </button>
        </div>

        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members yet"
            description="Invite colleagues to collaborate on compliance workflows for this workspace."
            action={
              <button
                type="button"
                onClick={() => setInviteOpen(true)}
                className="rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)]"
              >
                Invite Team Member
              </button>
            }
          />
        ) : (
          <div className="flex flex-col gap-6">
            {members.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onResend={onResendInvite}
                onRevoke={onRevokeInvite}
              />
            ))}
          </div>
        )}
      </div>

      <InviteTeamMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        roleOptions={roleOptions}
        onInvite={onInvite}
      />
    </>
  );
}
