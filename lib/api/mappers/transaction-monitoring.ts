import { mapApiTransactionToRecord } from "@/lib/api/mappers/transactions";
import type {
  ApiCustomerStatement,
  ApiTmOverview,
  ApiTmQueue,
} from "@/lib/api/transaction-monitoring";
import type { AccountStatementData } from "@/types/account-statement";
import type {
  TmActivityPoint,
  TmCategoryItem,
  TmOverviewData,
  TmQueueId,
  TmQueueListData,
  TmVolumePoint,
} from "@/types/transaction-monitoring";

const quickActions = [
  { id: "tm-not-blocked" as const, title: "TM Not-Blocked", description: "Transactions cleared for processing", href: "/tm-not-blocked" },
  { id: "cumulative-frequency" as const, title: "Cumulative Frequency", description: "High-frequency transaction monitoring", href: "/cumulative-frequency" },
  { id: "stop-payment" as const, title: "Stop Payment", description: "Payments halted for review", href: "/stop-payment" },
  { id: "tm-blocked" as const, title: "TM Blocked", description: "Transactions halted", href: "/tm-blocked" },
];

function numberValue(value: number | undefined, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function mapActivityChart(chart: Record<string, number> | undefined): TmActivityPoint[] {
  return Object.entries(chart ?? {}).map(([hour, count]) => ({ hour, count: numberValue(count) }));
}

function mapVolumeSeries(series: Record<string, number> | undefined): TmVolumePoint[] {
  return Object.entries(series ?? {}).map(([label, volume]) => ({ label, volume: numberValue(volume) }));
}

export function mapApiTmOverview(data: ApiTmOverview): TmOverviewData {
  const categories: TmCategoryItem[] = quickActions.map((action) => ({
    id: action.id,
    label: action.title,
    count: numberValue(data.tmConditions?.[action.id]),
    progress: 0,
  }));
  const maxCategory = Math.max(1, ...categories.map((category) => category.count));

  return {
    metrics: [
      { id: "total-volume", label: "TOTAL VOLUME", value: formatNumber(numberValue(data.totalVolume)) },
      { id: "high-risk", label: "HIGH RISK ALERTS", value: formatNumber(numberValue(data.highRiskAlerts)) },
      { id: "active-users", label: "ACTIVE USERS", value: formatNumber(numberValue(data.activeUsers)) },
      { id: "avg-risk", label: "AVG RISK SCORE", value: formatNumber(numberValue(data.avgRiskScore)) },
    ],
    quickActions,
    categories: categories.map((category) => ({
      ...category,
      progress: Math.round((category.count / maxCategory) * 100),
    })),
    activity24h: mapActivityChart(data.activityChart),
    volumeSeries: mapVolumeSeries(data.monthlyVolume),
    volumeRange: "30d",
    riskDistribution: {
      low: numberValue(data.riskDistribution?.low),
      medium: numberValue(data.riskDistribution?.medium),
      high: numberValue(data.riskDistribution?.high),
    },
  };
}

const queueMeta: Record<TmQueueId, { title: string; subtitle: string; columns: TmQueueListData["columns"]; showStatusFilter: boolean }> = {
  "tm-not-blocked": { title: "TM Not-Blocked", subtitle: "Transactions cleared for processing", columns: ["timestamp", "customer", "amount", "entity"], showStatusFilter: false },
  "stop-payment": { title: "Stop Payment", subtitle: "Payments halted for review", columns: ["timestamp", "customer", "amount", "riskScore", "severity", "rules", "status"], showStatusFilter: true },
  "cumulative-frequency": { title: "Cumulative Frequency", subtitle: "High-frequency transaction monitoring", columns: ["timestamp", "entity", "amount", "riskScore", "status", "rules", "severity"], showStatusFilter: true },
  "tm-blocked": { title: "TM Blocked", subtitle: "Transactions halted", columns: ["timestamp", "customer", "amount", "riskScore", "rules"], showStatusFilter: false },
};

function compactAmount(value: number | undefined): string {
  const amount = numberValue(value);
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}k`;
  return `$${formatNumber(amount)}`;
}

export function mapApiTmQueue(queueId: TmQueueId, queue: ApiTmQueue): TmQueueListData {
  const summary = queue.summary;
  const meta = queueMeta[queueId];
  const records = queue.data
    .map((transaction) => mapApiTransactionToRecord(transaction))
    .filter((record): record is NonNullable<typeof record> => record !== null)
    .map((record) => ({ ...record, category: queueId }));

  return {
    queueId,
    title: meta.title,
    subtitle: meta.subtitle,
    metrics: [
      { id: "total", label: "Total Transaction", value: formatNumber(numberValue(summary?.totalTransactions, records.length)), tone: "neutral" },
      { id: "amount", label: "Total Amount", value: compactAmount(summary?.totalAmount), tone: "neutral" },
      { id: "pending", label: "Pending Review", value: formatNumber(numberValue(summary?.pendingReview)), tone: "warning" },
      { id: "resolved", label: "Resolved", value: formatNumber(numberValue(summary?.resolved)), tone: "success" },
    ].slice(0, queueId === "tm-blocked" ? 2 : 4),
    records,
    columns: meta.columns,
    showStatusFilter: meta.showStatusFilter,
  };
}

function money(value: number | undefined, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numberValue(value));
}

function readableDate(value: string | undefined): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function mapApiCustomerStatement(statement: ApiCustomerStatement): AccountStatementData {
  const summary = statement.summary;
  const lines = statement.data.map((transaction, index) => {
    const amount = money(transaction.amount, transaction.currency);
    const isDebit = transaction.direction === "outbound";
    return {
      id: transaction.id ?? `statement-${index + 1}`,
      serial: index + 1,
      timestamp: transaction.occurredAt ?? transaction.createdAt ?? "",
      description: transaction.paymentPurpose ?? transaction.reference ?? "Transaction",
      channelLabel: transaction.channel ?? transaction.transactionType ?? "Transaction",
      reference: transaction.reference ?? transaction.id ?? "",
      debitLabel: isDebit ? amount : null,
      creditLabel: isDebit ? null : amount,
      balanceLabel: money(transaction.balance as number | undefined, transaction.currency),
      status: "completed" as const,
    };
  });

  return {
    customerName: "Customer account",
    metrics: [
      { id: "balance", label: "Current Balance", value: money(summary?.currentBalance), tone: "neutral" },
      { id: "credit", label: "Total Credit", value: money(summary?.totalCredit), tone: "success" },
      { id: "debit", label: "Total Debits", value: money(summary?.totalDebit), tone: "error" },
      { id: "count", label: "Total Transactions", value: formatNumber(numberValue(summary?.totalTransactions, lines.length)), tone: "info" },
      { id: "opened", label: "Account Opening Date", value: readableDate(summary?.accountOpeningDate), tone: "info" },
      { id: "opening", label: "Opening Balance", value: money(summary?.openingBalance), tone: "neutral" },
    ],
    lines,
  };
}