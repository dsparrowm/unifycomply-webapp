"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UnifycomplyLogo } from "@/components/brand/UnifycomplyLogo";
import { SidebarNavIcon } from "@/components/layout/SidebarNavIcon";
import { isRouteEnabledForCurrentMilestone } from "@/lib/constants/milestones";
import { appNavigation } from "@/lib/constants/navigation";
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
}: {
  href: string;
  label: string;
  icon: (typeof appNavigation)[number]["items"][number]["icon"];
  active: boolean;
  disabled: boolean;
  milestone: number;
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

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
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
    signOut();
    router.push("/sign-in");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="px-8 pt-10">
        <UnifycomplyLogo variant="dark" size="sidebar" />
      </div>

      <nav className="mt-11 flex flex-1 flex-col gap-6 overflow-y-auto px-8 pb-4">
        {appNavigation.map((section) => {
          const sectionKey = section.title ? getSectionKey(section.title) : null;
          const isExpanded = sectionKey ? expandedSections[sectionKey] !== false : true;
          const panelId = sectionKey ? `sidebar-section-${sectionKey.toLowerCase().replace(/\s+/g, "-")}` : undefined;

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
                  {section.items.map((item) =>
                    item.href ? (
                      <NavLink
                        key={`${section.title ?? "root"}-${item.label}`}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                        disabled={!isRouteEnabledForCurrentMilestone(item.milestone)}
                        milestone={item.milestone}
                      />
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="px-8 pb-8">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--state-error-soft)]"
        >
          <SidebarNavIcon icon="logout" size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
