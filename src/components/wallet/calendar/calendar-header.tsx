"use client";

/**
 * CalendarHeader
 *
 * Displays the current month label and navigation buttons
 * (previous month, next month, today).
 */
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CalendarHeader({
  year,
  month,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const label = `${year}년 ${month}월`;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      {/* Previous month */}
      <button
        type="button"
        onClick={onPrev}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        aria-label="이전 달"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Month label */}
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-gray-900">{label}</span>
      </div>

      {/* Right actions: Today + Next month */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToday}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
          aria-label="오늘로 이동"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          오늘
        </button>

        <button
          type="button"
          onClick={onNext}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="다음 달"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
