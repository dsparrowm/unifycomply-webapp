"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import type { SettingsSecurity } from "@/types/settings";
import { cn } from "@/lib/utils";

type SecurityPanelProps = {
  security: SettingsSecurity;
};

type SecuritySectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

function SecuritySection({ title, action, children }: SecuritySectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[color:var(--border-default)]">
      <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-4 py-4">
        <h3 className="text-base font-medium text-[color:var(--text-primary)]">{title}</h3>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function SecurityPanel({ security }: SecurityPanelProps) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(security.twoFactorEnabled);

  return (
    <>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Security Settings
          </h2>
          <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
            Configure password policies, two-factor authentication, and security preferences
          </p>
        </div>

        <SecuritySection title="Password Management">
          <div className="rounded-lg border border-[color:var(--border-default)] px-6 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--text-primary)]">
                  Change Password
                </p>
                <p className="mt-1 text-xs text-[color:var(--text-light)]">
                  Manage password settings
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChangePasswordOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2 text-xs font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
              >
                Change Password
              </button>
            </div>
          </div>
        </SecuritySection>

        <SecuritySection
          title="Two-Factor Authentication (2FA)"
          action={
            <SettingsToggle
              checked={twoFactorEnabled}
              onChange={setTwoFactorEnabled}
              label="Two-factor authentication"
            />
          }
        >
          {twoFactorEnabled ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-[color:var(--border-default)] px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[color:var(--text-primary)]">
                      {security.twoFactorStatus}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--text-light)]">
                      {security.twoFactorMethod}
                    </p>
                  </div>
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
                    aria-hidden
                  >
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
                >
                  View backup codes
                </button>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(false)}
                  className="flex-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
                >
                  Disable 2FA
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[color:var(--text-muted)]">
              Two-factor authentication is turned off for this account.
            </p>
          )}
        </SecuritySection>

        <SecuritySection title="Active Sessions">
          <div className="space-y-6">
            {security.sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-lg border border-[color:var(--border-default)] px-6 py-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[color:var(--text-primary)]">
                      {session.device}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--text-light)]">
                      {session.location} • {session.ipAddress}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--text-light)]">
                      Last active: {session.lastActive}
                    </p>
                  </div>
                  {session.isCurrent ? (
                    <span className="inline-flex items-center rounded-full bg-[color:var(--state-success-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
                      This device
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)] sm:w-auto"
            >
              Sign out all other sessions
            </button>
          </div>
        </SecuritySection>
      </div>

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
}
