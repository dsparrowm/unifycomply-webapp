import { MoreVertical } from "lucide-react";
import { TeamMemberStatusBadge } from "@/components/settings/TeamMemberStatusBadge";
import type { SettingsTeamMember } from "@/types/settings";

type TeamMemberCardProps = {
  member: SettingsTeamMember;
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-lg border border-[color:var(--border-default)] px-4 py-6">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-lg font-medium text-white"
          aria-hidden
        >
          {member.initials}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            <p className="text-sm font-medium text-[color:var(--text-primary)]">{member.name}</p>
            <TeamMemberStatusBadge status={member.status} />
          </div>
          <p className="mt-1 truncate text-xs text-[color:var(--text-light)]">{member.email}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-[color:var(--text-primary)]">{member.role}</p>
          <p className="mt-1 text-xs text-[color:var(--text-light)]">
            Last active: {member.lastActive}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Actions for ${member.name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-light)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
