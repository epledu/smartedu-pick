"use client";

/**
 * Calendar page
 *
 * Shows a monthly calendar view with daily income/expense summary cells.
 * Includes monthly totals at the top and a slide-up panel for day details.
 */
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useCalendar } from "@/hooks/wallet/use-calendar";
import CalendarHeader from "@/components/wallet/calendar/calendar-header";
import CalendarGrid from "@/components/wallet/calendar/calendar-grid";
import DayTransactions from "@/components/wallet/calendar/day-transactions";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n) + "원";
}

// ---------------------------------------------------------------------------
// Summary card
// ---------------------------------------------------------------------------

interface SummaryCardProps {
  label: string;
  amount: number;
  variant: "income" | "expense" | "net";
}

function SummaryCard({ label, amount, variant }: SummaryCardProps) {
  const colorMap = {
    income: "text-blue-600 bg-blue-50",
    expense: "text-red-500 bg-red-50",
    net: amount >= 0 ? "text-emerald-600 bg-emerald-50" : "text-orange-500 bg-orange-50",
  };
  const IconMap = {
    income: TrendingUp,
    expense: TrendingDown,
    net: Minus,
  };
  const Icon = IconMap[variant];

  return (
    <div className="flex-1 bg-white rounded-xl px-2 sm:px-4 py-2 sm:py-3 shadow-sm border border-gray-100 min-w-0">
      <div className={`inline-flex p-1 sm:p-1.5 rounded-lg mb-1 sm:mb-2 ${colorMap[variant]}`}>
        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </div>
      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 truncate">{label}</p>
      <p className={`text-xs sm:text-sm font-bold truncate ${colorMap[variant].split(" ")[0]}`}>
        {formatKRW(Math.abs(amount))}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CalendarPage() {
  const { data, loading, error, year, month, nextMonth, prevMonth, goToday } =
    useCalendar();

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const income = data?.monthTotal.income ?? 0;
  const expense = data?.monthTotal.expense ?? 0;
  const net = income - expense;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="px-4 py-3 sm:py-4 max-w-2xl mx-auto">
          <h1 className="text-base sm:text-lg font-bold text-gray-900">캘린더</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* Monthly summary — compact on mobile */}
        <div className="flex gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3">
          <SummaryCard label="총 수입" amount={income} variant="income" />
          <SummaryCard label="총 지출" amount={expense} variant="expense" />
          <SummaryCard label="순액" amount={net} variant="net" />
        </div>

        {/* Calendar card */}
        <div className="mx-4 mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <CalendarHeader
            year={year}
            month={month}
            onPrev={prevMonth}
            onNext={nextMonth}
            onToday={goToday}
          />

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-7 h-7 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="py-12 text-center text-sm text-red-400">{error}</div>
          )}

          {/* Calendar grid */}
          {!loading && !error && (
            <CalendarGrid
              year={year}
              month={month}
              data={data}
              onDayClick={setSelectedDay}
            />
          )}
        </div>
      </main>

      {/* Day detail panel */}
      <DayTransactions date={selectedDay} onClose={() => setSelectedDay(null)} />
    </div>
  );
}
