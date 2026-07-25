"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { TeamMemberStatusBadge } from "@/components/settings/TeamMemberStatusBadge";
import { getErrorMessage } from "@/lib/api/errors";
import type { SettingsTeamMember } from "@/types/settings";
import { cn } from "@/lib/utils";

type TeamMemberCardProps = {
  member: SettingsTeamMember;
  onResend?: (memberId: string) => Promise<void>;
  onRevoke?: (memberId: string) => Promise<void>;
};

export function TeamMemberCard({ member, onResend, onRevoke }: TeamMemberCardProps) {
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [busyAction, setBusyAction] = useState<"resend" | "revoke" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const canManageInvite = member.status === "pending" && Boolean(onResend || onRevoke);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const runAction = async (action: "resend" | "revoke") => {
    setActionError(null);
    setBusyAction(action);
    try {
      if (action === "resend") {
        await onResend?.(member.id);
      } else {
        await onRevoke?.(member.id);
      }
      setOpen(false);
    } catch (error) {
      setActionError(getErrorMessage(error, `Could not ${action} invite`));
    } finally {
      setBusyAction(null);
    }
  };

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
          {actionError ? (
            <p className="mt-1 text-xs text-[color:var(--state-error)]" role="alert">
              {actionError}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-[color:var(--text-primary)]">{member.role}</p>
          <p className="mt-1 text-xs text-[color:var(--text-light)]">
            Last active: {member.lastActive}
          </p>
        </div>

        {canManageInvite ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="menu"
              aria-controls={menuId}
              aria-label={`Actions for ${member.name}`}
              disabled={busyAction !== null}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-light)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)] disabled:opacity-60"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {open ? (
              <div
                id={menuId}
                role="menu"
                className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] py-1 shadow-lg"
              >
                {onResend ? (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={busyAction !== null}
                    onClick={() => void runAction("resend")}
                    className={cn(
                      "block w-full px-3 py-2 text-left text-sm text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)] disabled:opacity-60",
                    )}
                  >
                    {busyAction === "resend" ? "Resending…" : "Resend invite"}
                  </button>
                ) : null}
                {onRevoke ? (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={busyAction !== null}
                    onClick={() => void runAction("revoke")}
                    className="block w-full px-3 py-2 text-left text-sm text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--bg-muted)] disabled:opacity-60"
                  >
                    {busyAction === "revoke" ? "Revoking…" : "Revoke invite"}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
