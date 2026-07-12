import type { Milestone } from "@/lib/constants/milestones";
import { isRouteEnabledForCurrentMilestone } from "@/lib/constants/milestones";
import type { SidebarIconKey } from "@/lib/constants/sidebar-icons";
import type { NavPermission } from "@/types/rbac";

export type NavItem = {
  label: string;
  href?: string;
  milestone: Milestone;
  icon: SidebarIconKey;
  permission: NavPermission;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

export const appNavigation: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/overview", milestone: 1, icon: "overview", permission: "nav.overview" },
    ],
  },
  {
    title: "CUSTOMER",
    items: [
      { label: "KYC", href: "/kyc", milestone: 2, icon: "kyc", permission: "nav.kyc" },
      { label: "KYB", href: "/kyb", milestone: 2, icon: "kyb", permission: "nav.kyb" },
    ],
  },
  {
    title: "BACKGROUND CHECK",
    items: [
      {
        label: "Bank Analysis",
        href: "/bank-analysis",
        milestone: 2,
        icon: "bank-analysis",
        permission: "nav.bank-analysis",
      },
      { label: "Packages", href: "/packages", milestone: 2, icon: "packages", permission: "nav.packages" },
      { label: "Request", href: "/request", milestone: 2, icon: "request", permission: "nav.request" },
    ],
  },
  {
    title: "FRAUD MONITORING",
    items: [
      {
        label: "AML Screening",
        href: "/aml-screening",
        milestone: 2,
        icon: "aml-screening",
        permission: "nav.aml-screening",
      },
    ],
  },
  {
    title: "TRANSACTION MONITORING",
    items: [
      {
        label: "Overview",
        href: "/transaction-monitoring",
        milestone: 3,
        icon: "tm-overview",
        permission: "nav.transaction-monitoring",
      },
      {
        label: "Transactions",
        href: "/transactions",
        milestone: 3,
        icon: "transactions",
        permission: "nav.transactions",
      },
      {
        label: "TM Not-Blocked",
        href: "/tm-not-blocked",
        milestone: 3,
        icon: "tm-not-blocked",
        permission: "nav.tm-not-blocked",
      },
      {
        label: "Stop Payment",
        href: "/stop-payment",
        milestone: 3,
        icon: "stop-payment",
        permission: "nav.stop-payment",
      },
      {
        label: "Cumulative Frequency",
        href: "/cumulative-frequency",
        milestone: 3,
        icon: "cumulative-frequency",
        permission: "nav.cumulative-frequency",
      },
      {
        label: "TM Blocked",
        href: "/tm-blocked",
        milestone: 3,
        icon: "tm-blocked",
        permission: "nav.tm-blocked",
      },
    ],
  },
  {
    title: "COMPLIANCE",
    items: [
      { label: "SAR Report", href: "/sar", milestone: 4, icon: "sar-report", permission: "nav.sar" },
      {
        label: "PND Watchlist",
        href: "/pnd-watchlist",
        milestone: 4,
        icon: "pnd-watchlist",
        permission: "nav.pnd-watchlist",
      },
      { label: "Rules", href: "/rules", milestone: 4, icon: "rules", permission: "nav.rules" },
      {
        label: "Risk Score",
        href: "/risk-score",
        milestone: 4,
        icon: "risk-score",
        permission: "nav.risk-score",
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        label: "Settings",
        href: "/settings",
        milestone: 1,
        icon: "organization",
        permission: "nav.settings",
      },
    ],
  },
  {
    title: "CHECKER WIDGET",
    items: [],
  },
  {
    title: "BILLING",
    items: [
      {
        label: "Billing",
        href: "/billing",
        milestone: 1,
        icon: "billing",
        permission: "nav.billing",
      },
    ],
  },
];

export const m1Routes = appNavigation
  .flatMap((section) => section.items)
  .filter((item) => item.milestone === 1 && item.href)
  .map((item) => item.href as string);

export function getRouteMilestone(pathname: string): Milestone | null {
  const items = appNavigation
    .flatMap((section) => section.items)
    .filter((item): item is NavItem & { href: string } => Boolean(item.href));

  const match = items
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return match?.milestone ?? null;
}

export function isPathEnabledForCurrentMilestone(pathname: string): boolean {
  const milestone = getRouteMilestone(pathname);

  if (milestone === null) {
    return true;
  }

  return isRouteEnabledForCurrentMilestone(milestone);
}
