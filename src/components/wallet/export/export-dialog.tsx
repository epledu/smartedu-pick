"use client";

/**
 * ExportDialog
 *
 * Modal that lets users configure and trigger a transaction export.
 * Options: period, format (CSV/Excel), visible columns, and basic filters.
 */
import React, { useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import { downloadBlob, DEFAULT_COLUMNS } from "@/lib/wallet/export";
import type { ExportColumns } from "@/lib/wallet/export";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Period = "month" | "quarter" | "year" | "all" | "custom";
type Format = "csv" | "xlsx";

export interface ExportDialogProps {
  onClose: () => void;
  /** Pre-selected filters (e.g. from the transactions page). */
  defaultDateFrom?: string;
  defaultDateTo?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPeriodDates(period: Period): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { dateFrom: fmt(start), dateTo: fmt(end) };
  }
  if (period === "quarter") {
    const q = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), q * 3, 1);
    const end = new Date(now.getFullYear(), q * 3 + 3, 0);
    return { dateFrom: fmt(start), dateTo: fmt(end) };
  }
  if (period === "year") {
    return {
      dateFrom: `${now.getFullYear()}-01-01`,
      dateTo: `${now.getFullYear()}-12-31`,
    };
  }
  return { dateFrom: "", dateTo: "" };
}

const PERIOD_LABELS: Record<Period, string> = {
  month: "이번 달",
  quarter: "이번 분기",
  year: "올해",
  all: "전체",
  custom: "사용자 지정",
};

const COLUMN_LABELS: Array<{ key: keyof ExportColumns; label: string }> = [
  { key: "date", label: "날짜" },
  { key: "type", label: "종류" },
  { key: "category", label: "카테고리" },
  { key: "amount", label: "금액" },
  { key: "account", label: "계좌" },
  { key: "merchantName", label: "가맹점" },
  { key: "memo", label: "메모" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExportDialog({
  onClose,
  defaultDateFrom,
  defaultDateTo,
}: ExportDialogProps) {
  const [period, setPeriod] = useState<Period>(
    defaultDateFrom || defaultDateTo ? "custom" : "month"
  );
  const [format, setFormat] = useState<Format>("csv");
  const [columns, setColumns] = useState<ExportColumns>({ ...DEFAULT_COLUMNS });
  const [customFrom, setCustomFrom] = useState(defaultDateFrom ?? "");
  const [customTo, setCustomTo] = useState(defaultDateTo ?? "");
  const [loading, setLoading] = useState(false);

  function toggleColumn(key: keyof ExportColumns) {
    setColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleExport() {
    setLoading(true);
    try {
      const dates = period === "custom"
        ? { dateFrom: customFrom, dateTo: customTo }
        : period === "all"
        ? { dateFrom: "", dateTo: "" }
        : getPeriodDates(period);

      const params = new URLSearchParams({ format });
      if (dates.dateFrom) params.set("dateFrom", dates.dateFrom);
      if (dates.dateTo) params.set("dateTo", dates.dateTo);

      const res = await fetch(`/api/export/transactions?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const today = new Date().toISOString().slice(0, 10);
      const filename = `transactions_${today}.${format}`;

      if (format === "xlsx") {
        const buffer = await res.arrayBuffer();
        downloadBlob(
          buffer,
          filename,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      } else {
        const text = await res.text();
        downloadBlob(text, filename, "text/csv;charset=utf-8;");
      }

      onClose();
    } catch (err) {
      console.error("[ExportDialog] export error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">거래내역 내보내기</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Period */}
        <section className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">기간</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  period === p
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
          {period === "custom" && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <span className="text-gray-400 text-xs">~</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          )}
        </section>

        {/* Format */}
        <section className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">형식</p>
          <div className="flex gap-2">
            {(["csv", "xlsx"] as Format[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  format === f
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f === "csv" ? "CSV" : "Excel (.xlsx)"}
              </button>
            ))}
          </div>
        </section>

        {/* Columns */}
        <section className="mb-6">
          <p className="text-xs font-semibold text-gray-500 mb-2">포함 항목</p>
          <div className="grid grid-cols-2 gap-2">
            {COLUMN_LABELS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={columns[key]}
                  onChange={() => toggleColumn(key)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Export button */}
        <Button
          className="w-full gap-2"
          onClick={handleExport}
          disabled={loading}
        >
          <Download size={16} />
          {loading ? "내보내는 중..." : "내보내기"}
        </Button>
      </div>
    </div>
  );
}
