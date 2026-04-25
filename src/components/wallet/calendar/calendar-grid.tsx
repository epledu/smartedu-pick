"use client";

/**
 * CalendarGrid
 *
 * Renders a 6-row × 7-column month view.
 * Each cell shows: day number, income/expense bars, amount totals.
 * Today is highlighted; days outside the current month are dimmed.
 */
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import { ko } from "date-fns/locale";
import type { CalendarData } from "@/hooks/wallet/use-calendar";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 10_000)}만`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}천`;
  return String(n);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CalendarGridProps {
  year: number;
  month: number;
  data: CalendarData | null;
  onDayClick: (date: Date) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CalendarGrid({
  year,
  month,
  data,
  onDayClick,
}: CalendarGridProps) {
  const refDate = new Date(year, month - 1, 1);
  const monthStart = startOfMonth(refDate);
  const monthEnd = endOfMonth(refDate);
  // Expand to full weeks (Sunday–Saturday)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="bg-white select-none">
      {/* Day-of-week header row */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DOW_LABELS.map((d, i) => (
          <div
            key={d}
            className={`py-2 text-center text-xs font-semibold ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayData = data?.days[key];
          const inMonth = isSameMonth(day, refDate);
          const today = isToday(day);
          const dow = day.getDay();

          return (
            <button
              key={key}
              type="button"
              onClick={() => onDayClick(day)}
              className={`
                relative flex flex-col min-h-[60px] sm:min-h-[72px] md:min-h-[88px]
                p-0.5 sm:p-1 border-b border-r border-gray-100
                text-left transition-colors
                ${inMonth ? "bg-white active:bg-indigo-50/40 hover:bg-indigo-50/40" : "bg-gray-50/60"}
                ${today ? "ring-2 ring-inset ring-indigo-400" : ""}
              `}
              aria-label={format(day, "yyyy년 M월 d일", { locale: ko })}
            >
              {/* Day number */}
              <span
                className={`
                  text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-0.5
                  ${today ? "bg-indigo-500 text-white" : ""}
                  ${!inMonth ? "text-gray-300" : dow === 0 ? "text-red-400" : dow === 6 ? "text-blue-400" : "text-gray-700"}
                `}
              >
                {format(day, "d")}
              </span>

              {/* Amount bars */}
              {dayData && inMonth && (
                <div className="flex flex-col gap-0.5 w-full mt-auto">
                  {dayData.income > 0 && (
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                      <span className="text-[10px] text-blue-500 font-medium truncate leading-tight">
                        +{formatAmount(dayData.income)}
                      </span>
                    </div>
                  )}
                  {dayData.expense > 0 && (
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      <span className="text-[10px] text-red-500 font-medium truncate leading-tight">
                        -{formatAmount(dayData.expense)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
