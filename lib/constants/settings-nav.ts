import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Building2,
  ClipboardCheck,
  FileText,
  Lock,
  Shield,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import type { NavPermission } from "@/types/rbac";

export type SettingsNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission: NavPermission;
};

export type SettingsNavGroup = {
  title: string;
  items: SettingsNavItem[];
};

export const settingsNavGroups: SettingsNavGroup[] = [
  {
    title: "Profile Management",
    items: [
      {
        id: "profile",
        label: "Profile Management",
        href: "/settings",
        icon: User,
        permission: "settings.profile",
      },
      {
        id: "business-information",
        label: "Business Information",
        href: "/settings/business-information",
        icon: Building2,
        permission: "settings.business-information",
      },
      {
        id: "teams",
        label: "Teams",
        href: "/settings/teams",
        icon: Users,
        permission: "settings.teams",
      },
      {
        id: "roles-and-permission",
        label: "Roles and Permission",
        href: "/settings/roles-and-permission",
        icon: Shield,
        permission: "settings.roles-and-permission",
      },
      {
        id: "security",
        label: "Security",
        href: "/settings/security",
        icon: Lock,
        permission: "settings.security",
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        href: "/settings/audit-logs",
        icon: FileText,
        permission: "settings.audit-logs",
      },
    ],
  },
  {
    title: "Compliance Configuration",
    items: [
      {
        id: "approvals",
        label: "Approvals",
        href: "/settings/approvals",
        icon: ClipboardCheck,
        permission: "settings.approvals",
      },
      {
        id: "pep-settings",
        label: "PEP Settings",
        href: "/settings/pep-settings",
        icon: UserCheck,
        permission: "settings.pep-settings",
      },
      {
        id: "notification",
        label: "Notification",
        href: "/settings/notification",
        icon: Bell,
        permission: "settings.notification",
      },
      {
        id: "compliance-rules",
        label: "Compliance Rules",
        href: "/settings/compliance-rules",
        icon: Shield,
        permission: "settings.compliance-rules",
      },
    ],
  },
];

export const settingsSectionIds = settingsNavGroups.flatMap((group) =>
  group.items.map((item) => item.id),
);

export function getSettingsSectionTitle(sectionId: string): string {
  for (const group of settingsNavGroups) {
    const item = group.items.find((entry) => entry.id === sectionId);
    if (item) {
      return item.label;
    }
  }

  return "Settings";
}
