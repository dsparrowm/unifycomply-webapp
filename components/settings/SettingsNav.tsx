"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNavGroups } from "@/lib/constants/settings-nav";
import { useRbac } from "@/lib/hooks/use-rbac";
import { cn } from "@/lib/utils";

function isNavItemActive(href: string, pathname: string) {
  if (href === "/settings") {
    return pathname === "/settings";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SettingsNav() {
  const pathname = usePathname();
  const { hasPermission } = useRbac();

  return (
    <nav className="w-full shrink-0 border-b border-[color:var(--border-default)] lg:w-[260px] lg:border-b-0">
      <div className="overflow-x-auto p-4 lg:overflow-visible">
        <div className="flex min-w-max flex-col gap-6 lg:min-w-0">
          {settingsNavGroups.map((group) => {
            const visibleItems = group.items.filter((item) => hasPermission(item.permission));

            if (visibleItems.length === 0) {
              return null;
            }

            return (
              <div key={group.title} className="flex flex-col gap-1">
                <p className="px-3 pb-1 text-xs font-medium text-[color:var(--text-light)]">
                  {group.title}
                </p>
                <ul className="flex flex-row gap-1 lg:flex-col lg:gap-0.5">
                  {visibleItems.map((item) => {
                    const active = isNavItemActive(item.href, pathname);
                    const Icon = item.icon;

                    return (
                      <li key={item.id} className="shrink-0">
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm transition-colors",
                            active
                              ? "bg-[color:var(--accent-primary-soft)] font-medium text-[color:var(--accent-primary)]"
                              : "text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]",
                          )}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
