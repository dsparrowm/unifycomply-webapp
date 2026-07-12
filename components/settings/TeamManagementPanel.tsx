import { TeamMemberCard } from "@/components/settings/TeamMemberCard";
import type { SettingsTeamMember } from "@/types/settings";

type TeamManagementPanelProps = {
  members: SettingsTeamMember[];
};

export function TeamManagementPanel({ members }: TeamManagementPanelProps) {
  return (
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
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[color:var(--accent-primary-soft)] bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          Invite Team Member
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
