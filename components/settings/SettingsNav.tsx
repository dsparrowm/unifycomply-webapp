"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNavGroups } from "@/lib/constants/settings-nav";
import { cn } from "@/lib/utils";

function isNavItemActive(href: string, pathname: string) {
  if (href === "/settings") {
    return pathname === "/settings";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="w-[260px] shrink-0 p-4">
      <div className="flex flex-col gap-6">
        {settingsNavGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-xs font-medium text-[color:var(--text-light)]">
              {group.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isNavItemActive(item.href, pathname);
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
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
        ))}
      </div>
    </nav>
  );
}
