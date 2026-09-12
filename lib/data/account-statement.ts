import type {
  AccountStatementData,
  AccountStatementFilters,
  AccountStatementLine,
} from "@/types/account-statement";
import type { TmListMetric } from "@/types/transaction-monitoring";
import { getTmTransactionDetail } from "@/lib/data/transactions";

const populatedMetrics: TmListMetric[] = [
  { id: "balance", label: "Current Balance", value: "$284,750", tone: "neutral" },
  { id: "credit", label: "Total Credit", value: "$1,847,500", tone: "success" },
  { id: "debit", label: "Total Debits", value: "$1,612,750", tone: "error" },
  { id: "count", label: "Total Transactions", value: "1,247", tone: "info" },
  { id: "opened", label: "Account Opening Date", value: "Jan 15, 2019", tone: "info" },
  { id: "opening", label: "Opening Balance", value: "$50,000", tone: "neutral" },
];

const emptyMetrics: TmListMetric[] = populatedMetrics.map((metric) => ({
  ...metric,
  value: "0",
}));

/**
 * Statement lines aligned to Figma `stop-payment/account-statement-populated.png`
 * (repeated wire sample rows with alternating credit/debit).
 */
/** 100 rows → 10 pages (PAGE_SIZE 10) to match Figma pagination chrome. */
const sophieWilliamsLines: AccountStatementLine[] = Array.from({ length: 100 }, (_, index) => {
  const serial = index + 1;
  const isDebit = serial % 2 === 0;

  return {
    id: `as-${serial}`,
    serial,
    timestamp: "2024-03-09 08:11:15",
    description: "Wire Transfer from Global Tech Corp",
    channelLabel: "Wire Transfer • SWIFT",
    reference: "REF-2024-089432",
    debitLabel: isDebit ? "$125,000" : null,
    creditLabel: isDebit ? null : "$125,000",
    balanceLabel: "$284,750",
    status: "completed" as const,
  };
});

export const accountStatementDefaultFilters: AccountStatementFilters = {
  date: "all-time",
  type: "all",
  more: "all",
};

export function getAccountStatementForTransaction(
  transactionId: string,
): AccountStatementData | null {
  const detail = getTmTransactionDetail(transactionId);
  if (!detail) {
    return null;
  }

  const customerName = detail.customer.name || detail.customerName;

  // Populated Figma uses Sophie Williams; other customers keep empty ledger for QA of empty state.
  if (customerName === "Sophie Williams") {
    return {
      customerName,
      metrics: populatedMetrics,
      lines: sophieWilliamsLines,
    };
  }

  return {
    customerName,
    metrics: emptyMetrics,
    lines: [],
  };
}

export function filterAccountStatementLines(
  lines: AccountStatementLine[],
  filters: AccountStatementFilters,
  searchQuery: string,
): AccountStatementLine[] {
  const query = searchQuery.trim().toLowerCase();

  return lines.filter((line) => {
    if (filters.type === "credit" && !line.creditLabel) return false;
    if (filters.type === "debit" && !line.debitLabel) return false;
    if (filters.type === "wire" && !line.channelLabel.toLowerCase().includes("wire")) {
      return false;
    }
    if (filters.type === "ach" && !line.channelLabel.toLowerCase().includes("ach")) {
      return false;
    }
    if (filters.more === "high-value") {
      const amount = Number(
        (line.creditLabel ?? line.debitLabel ?? "0").replace(/[^0-9.]/g, ""),
      );
      if (amount < 50_000) return false;
    }
    if (!query) return true;
    return [line.description, line.reference, line.channelLabel, line.timestamp].some((value) =>
      value.toLowerCase().includes(query),
    );
  });
}
