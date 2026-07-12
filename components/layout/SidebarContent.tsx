"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UnifycomplyLogo } from "@/components/brand/UnifycomplyLogo";
import { SidebarNavIcon } from "@/components/layout/SidebarNavIcon";
import { isRouteEnabledForCurrentMilestone } from "@/lib/constants/milestones";
import { appNavigation } from "@/lib/constants/navigation";
import { useRbac } from "@/lib/hooks/use-rbac";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

function getSectionKey(title: string) {
  return title;
}

function getInitialExpandedSections() {
  return Object.fromEntries(
    appNavigation
      .filter((section) => section.title)
      .map((section) => [getSectionKey(section.title!), true]),
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
  disabled,
  milestone,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: (typeof appNavigation)[number]["items"][number]["icon"];
  active: boolean;
  disabled: boolean;
  milestone: number;
  onNavigate?: () => void;
}) {
  if (disabled) {
    return (
      <span
        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-[color:var(--text-light)] opacity-60"
        title={`Available in Milestone ${milestone}`}
      >
        <SidebarNavIcon icon={icon} />
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm shadow-[0_1px_1px_rgba(0,0,0,0.04)] transition-colors",
        active
          ? "bg-[color:var(--accent-primary-soft)] font-medium text-[color:var(--accent-primary)]"
          : "text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]",
      )}
    >
      <SidebarNavIcon icon={icon} />
      {label}
    </Link>
  );
}

type SidebarContentProps = {
  onNavigate?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
};

export function SidebarContent({ onNavigate, showCloseButton, onClose }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const { hasPermission } = useRbac();
  const [expandedSections, setExpandedSections] = useState(getInitialExpandedSections);

  useEffect(() => {
    const activeSection = appNavigation.find((section) =>
      section.items.some(
        (item) =>
          item.href &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`)),
      ),
    );

    if (!activeSection?.title) {
      return;
    }

    const sectionKey = getSectionKey(activeSection.title);
    setExpandedSections((current) => ({ ...current, [sectionKey]: true }));
  }, [pathname]);

  const toggleSection = (title: string) => {
    const sectionKey = getSectionKey(title);
    setExpandedSections((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey],
    }));
  };

  const handleLogout = () => {
    onNavigate?.();
    signOut();
    router.push("/sign-in");
  };

  const handleNavigate = () => {
    onNavigate?.();
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-8 lg:px-8 lg:pt-10">
        <UnifycomplyLogo variant="dark" size="sidebar" />
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] lg:hidden"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        ) : null}
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-4 lg:mt-11 lg:px-8">
        {appNavigation.map((section) => {
          const visibleItems = section.items.filter(
            (item) => item.href && hasPermission(item.permission),
          );

          if (visibleItems.length === 0) {
            return null;
          }

          const sectionKey = section.title ? getSectionKey(section.title) : null;
          const isExpanded = sectionKey ? expandedSections[sectionKey] !== false : true;
          const panelId = sectionKey
            ? `sidebar-section-${sectionKey.toLowerCase().replace(/\s+/g, "-")}`
            : undefined;

          return (
            <div key={section.title ?? section.items[0]?.label} className="space-y-3">
              {section.title ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.title!)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-1 text-left transition-colors hover:bg-[color:var(--bg-muted)]"
                >
                  <span className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                    {section.title}
                  </span>
                  <SidebarNavIcon
                    icon="chevron"
                    size={16}
                    className={cn(
                      "opacity-80 transition-transform duration-200",
                      isExpanded ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </button>
              ) : null}

              {isExpanded ? (
                <div id={panelId} className="space-y-2">
                  {visibleItems.map((item) =>
                    item.href ? (
                      <NavLink
                        key={`${section.title ?? "root"}-${item.label}`}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                        disabled={!isRouteEnabledForCurrentMilestone(item.milestone)}
                        milestone={item.milestone}
                        onNavigate={handleNavigate}
                      />
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="px-6 pb-6 lg:px-8 lg:pb-8">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--state-error-soft)]"
        >
          <SidebarNavIcon icon="logout" size={16} />
          Logout
        </button>
      </div>
    </>
  );
}
