import type { TmListMetric } from "@/types/transaction-monitoring";

export type AccountStatementTypeFilter = "all" | "credit" | "debit" | "wire" | "ach";

export type AccountStatementFilters = {
  date: "all" | "today" | "last-7-days" | "this-month" | "all-time";
  type: AccountStatementTypeFilter;
  more: "all" | "high-value";
};

export type AccountStatementLine = {
  id: string;
  serial: number;
  timestamp: string;
  description: string;
  channelLabel: string;
  reference: string;
  debitLabel: string | null;
  creditLabel: string | null;
  balanceLabel: string;
  status: "completed" | "pending" | "failed";
};

export type AccountStatementData = {
  customerName: string;
  metrics: TmListMetric[];
  lines: AccountStatementLine[];
};
