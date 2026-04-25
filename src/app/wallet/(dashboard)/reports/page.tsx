"use client";

/**
 * Reports page
 *
 * Quick-access export shortcuts and a summary preview for common
 * reporting scenarios (monthly, yearly, category breakdown).
 */
import React, { useState } from "react";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import ExportDialog from "@/components/wallet/export/export-dialog";
import { downloadBlob } from "@/lib/wallet/export";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  format: "csv" | "xlsx";
  dateFrom?: string;
  dateTo?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function currentMonthRange(): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { dateFrom: fmt(start), dateTo: fmt(end) };
}

function currentYearRange(): { dateFrom: string; dateTo: string } {
  const y = new Date().getFullYear();
  return { dateFrom: `${y}-01-01`, dateTo: `${y}-12-31` };
}

// ---------------------------------------------------------------------------
// Quick action definitions
// ---------------------------------------------------------------------------

const { dateFrom: mFrom, dateTo: mTo } = currentMonthRange();
const { dateFrom: yFrom, dateTo: yTo } = currentYearRange();

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "month-xlsx",
    label: "이번 달 거래 내역",
    description: "Excel 파일로 다운로드",
    icon: <FileSpreadsheet size={20} className="text-green-600" />,
    format: "xlsx",
    dateFrom: mFrom,
    dateTo: mTo,
  },
  {
    id: "year-csv",
    label: "올해 전체 거래",
    description: "CSV 파일로 다운로드",
    icon: <FileText size={20} className="text-blue-600" />,
    format: "csv",
    dateFrom: yFrom,
    dateTo: yTo,
  },
  {
    id: "year-xlsx",
    label: "올해 거래 내역",
    description: "Excel 파일로 다운로드",
    icon: <FileSpreadsheet size={20} className="text-green-600" />,
    format: "xlsx",
    dateFrom: yFrom,
    dateTo: yTo,
  },
  {
    id: "all-csv",
    label: "전체 거래 내역",
    description: "CSV 파일로 다운로드",
    icon: <FileText size={20} className="text-purple-600" />,
    format: "csv",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogFrom, setDialogFrom] = useState<string | undefined>();
  const [dialogTo, setDialogTo] = useState<string | undefined>();
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleQuickAction(action: QuickAction) {
    setDownloading(action.id);
    try {
      const params = new URLSearchParams({ format: action.format });
      if (action.dateFrom) params.set("dateFrom", action.dateFrom);
      if (action.dateTo) params.set("dateTo", action.dateTo);

      const res = await fetch(`/api/export/transactions?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const today = new Date().toISOString().slice(0, 10);
      const filename = `transactions_${today}.${action.format}`;
      const mimeType =
        action.format === "xlsx"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "text/csv;charset=utf-8;";

      if (action.format === "xlsx") {
        const buffer = await res.arrayBuffer();
        downloadBlob(buffer, filename, mimeType);
      } else {
        const text = await res.text();
        downloadBlob(text, filename, mimeType);
      }
    } catch (err) {
      console.error("[ReportsPage] quick action error:", err);
    } finally {
      setDownloading(null);
    }
  }

  function handleCustomExport() {
    setDialogFrom(undefined);
    setDialogTo(undefined);
    setShowDialog(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <h1 className="text-lg font-bold text-gray-900">리포트</h1>
          <Button size="sm" variant="outline" onClick={handleCustomExport} className="gap-1.5">
            <Download size={16} />
            사용자 지정 내보내기
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Quick export section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">빠른 내보내기</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleQuickAction(action)}
                disabled={downloading === action.id}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 text-left shadow-sm hover:shadow-md transition-shadow disabled:opacity-60"
              >
                <span className="mt-0.5">{action.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{action.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {downloading === action.id ? "다운로드 중..." : action.description}
                  </p>
                </div>
                <Download
                  size={16}
                  className={`mt-0.5 flex-shrink-0 ${
                    downloading === action.id
                      ? "text-gray-300 animate-bounce"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Info section */}
        <section className="bg-indigo-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-700 mb-1">💡 활용 팁</p>
          <ul className="text-xs text-indigo-600 space-y-1 list-disc list-inside">
            <li>CSV 파일은 모든 스프레드시트 앱에서 열 수 있습니다.</li>
            <li>Excel (.xlsx) 파일은 서식이 보존되어 바로 활용 가능합니다.</li>
            <li>한국어 문자는 UTF-8 BOM으로 인코딩되어 Excel에서 올바르게 표시됩니다.</li>
            <li>연말정산 자료 제출 시 올해 전체 거래 CSV를 활용하세요.</li>
          </ul>
        </section>
      </main>

      {/* Custom export dialog */}
      {showDialog && (
        <ExportDialog
          onClose={() => setShowDialog(false)}
          defaultDateFrom={dialogFrom}
          defaultDateTo={dialogTo}
        />
      )}
    </div>
  );
}
