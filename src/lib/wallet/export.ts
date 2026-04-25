/**
 * Export utilities for transaction data.
 *
 * Provides pure functions for converting transactions to CSV and XLSX formats,
 * plus a browser download helper. Korean characters are supported via UTF-8 BOM.
 */

import * as XLSX from "xlsx";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal transaction shape required for export. Matches the API response. */
export interface ExportTransaction {
  date: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  category: { name: string } | null;
  account: { name: string };
  merchantName: string | null;
  memo: string | null;
}

/** Column visibility options for export. */
export interface ExportColumns {
  date: boolean;
  type: boolean;
  category: boolean;
  amount: boolean;
  account: boolean;
  merchantName: boolean;
  memo: boolean;
}

/** Default: all columns visible. */
export const DEFAULT_COLUMNS: ExportColumns = {
  date: true,
  type: true,
  category: true,
  amount: true,
  account: true,
  merchantName: true,
  memo: true,
};

// ---------------------------------------------------------------------------
// Column header labels (Korean)
// ---------------------------------------------------------------------------

const COLUMN_LABELS: Record<keyof ExportColumns, string> = {
  date: "날짜",
  type: "종류",
  category: "카테고리",
  amount: "금액",
  account: "계좌",
  merchantName: "가맹점",
  memo: "메모",
};

// ---------------------------------------------------------------------------
// Row builder
// ---------------------------------------------------------------------------

/** Converts a transaction into a display row (string values for export). */
function buildRow(
  tx: ExportTransaction,
  columns: ExportColumns
): string[] {
  const typeLabel =
    tx.type === "INCOME" ? "수입" : tx.type === "EXPENSE" ? "지출" : "이체";

  const row: string[] = [];
  if (columns.date) row.push(tx.date.slice(0, 10));
  if (columns.type) row.push(typeLabel);
  if (columns.category) row.push(tx.category?.name ?? "");
  if (columns.amount) row.push(String(tx.amount));
  if (columns.account) row.push(tx.account.name);
  if (columns.merchantName) row.push(tx.merchantName ?? "");
  if (columns.memo) row.push(tx.memo ?? "");
  return row;
}

/** Returns only the enabled column header labels. */
function buildHeaders(columns: ExportColumns): string[] {
  return (Object.keys(columns) as Array<keyof ExportColumns>)
    .filter((key) => columns[key])
    .map((key) => COLUMN_LABELS[key]);
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

/**
 * Converts transactions to a CSV string with UTF-8 BOM.
 * The BOM (\uFEFF) ensures Excel on Windows renders Korean correctly.
 */
export function transactionsToCSV(
  transactions: ExportTransaction[],
  columns: ExportColumns = DEFAULT_COLUMNS
): string {
  const headers = buildHeaders(columns);
  const rows = transactions.map((tx) => buildRow(tx, columns));

  const escape = (cell: string) => {
    // Wrap in quotes if cell contains comma, quote, or newline
    if (/[",\n\r]/.test(cell)) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };

  const lines = [headers, ...rows].map((row) =>
    row.map(escape).join(",")
  );

  // Prepend UTF-8 BOM for Korean character support in Excel
  return "\uFEFF" + lines.join("\r\n");
}

// ---------------------------------------------------------------------------
// XLSX export
// ---------------------------------------------------------------------------

/**
 * Converts transactions to an XLSX ArrayBuffer using the SheetJS (xlsx) library.
 * Returns a binary buffer suitable for download or API response.
 */
export function transactionsToXLSX(
  transactions: ExportTransaction[],
  columns: ExportColumns = DEFAULT_COLUMNS
): ArrayBuffer {
  const headers = buildHeaders(columns);
  const rows = transactions.map((tx) => buildRow(tx, columns));

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto-width for readability
  const colWidths = headers.map((h, i) => {
    const maxLen = Math.max(
      h.length,
      ...rows.map((r) => (r[i] ?? "").length)
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "거래내역");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return buffer as ArrayBuffer;
}

// ---------------------------------------------------------------------------
// Browser download helper
// ---------------------------------------------------------------------------

/**
 * Triggers a browser file download with the given content.
 * Works for both string (CSV) and ArrayBuffer (XLSX) payloads.
 */
export function downloadBlob(
  content: string | ArrayBuffer,
  filename: string,
  mimeType: string
): void {
  const blob =
    typeof content === "string"
      ? new Blob([content], { type: mimeType })
      : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
