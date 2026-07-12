"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ChevronDown, LogOut, Settings } from "lucide-react";
import { useRbac } from "@/lib/hooks/use-rbac";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

function getOrganizationInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "O";
}

export function UserMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const tenant = useAuthStore((state) => state.tenant);
  const signOut = useAuthStore((state) => state.signOut);
  const { hasPermission, roleLabel } = useRbac();

  const initials = user?.initials ?? "AA";
  const name = user?.name ?? "Alimi Ayomikun";
  const email = user?.email ?? "Ayomikunalimi@hyperpels.com";
  const organizationName = tenant?.name ?? "Hyperpels Tech";
  const organizationInitial = getOrganizationInitial(organizationName);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    signOut();
    router.push("/sign-in");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] py-1 pl-1 pr-3"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-xs font-medium text-white">
          {initials}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[color:var(--text-muted)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[280px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-sm font-medium text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[color:var(--text-primary)]">
                {name}
              </p>
              <p className="truncate text-xs text-[color:var(--text-muted)]">{email}</p>
            </div>
          </div>

          <div className="my-4 border-t border-[color:var(--border-subtle)]" />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
              <Building2 className="h-4 w-4" />
              <span>Organization</span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-[color:var(--accent-primary-soft)] bg-[color:var(--bg-surface)] px-3 py-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[color:var(--accent-primary-soft)] text-xs font-semibold text-[color:var(--accent-primary)]">
                {organizationInitial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[color:var(--text-primary)]">
                  {organizationName}
                </p>
                {roleLabel ? (
                  <p className="truncate text-xs text-[color:var(--text-light)]">{roleLabel}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-[color:var(--border-subtle)]" />

          <div className="space-y-1">
            {hasPermission("nav.settings") ? (
              <Link
                href="/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
              >
                <Settings className="h-4 w-4 text-[color:var(--text-muted)]" />
                Settings
              </Link>
            ) : null}

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--state-error-soft)]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
