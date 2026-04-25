/**
 * Common utility functions shared across the application.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * Merges Tailwind CSS class names, resolving conflicts with tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string.
 *
 * @param amount   - The numeric amount to format.
 * @param currency - ISO 4217 currency code (default "KRW").
 * @returns Formatted string, e.g. "₩1,234" for KRW or "$12.34" for USD.
 */
export function formatCurrency(amount: number, currency = "KRW"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "KRW" ? 0 : 2,
  }).format(amount);
}

/**
 * Formats a date value using the Korean locale.
 *
 * @param date        - Date object or ISO date string.
 * @param dateFormat  - date-fns format pattern (default "yyyy.MM.dd").
 * @returns Formatted date string.
 */
export function formatDate(
  date: Date | string,
  dateFormat = "yyyy.MM.dd"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, dateFormat, { locale: ko });
}

/**
 * Returns the inclusive start and exclusive end Date for a given month.
 *
 * @param year  - Full four-digit year.
 * @param month - Month number (1–12).
 * @returns Object with `start` (first moment of the month) and
 *          `end` (first moment of the following month).
 */
export function getMonthRange(
  year: number,
  month: number
): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0); // exclusive upper bound
  return { start, end };
}

/**
 * Generates a simple time-based unique ID suitable for optimistic UI updates.
 * Not cryptographically secure — use a server-side ID for persisted records.
 *
 * @returns A string ID, e.g. "cuid_1716000000000_4f2a".
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 6);
  return `cuid_${timestamp}_${random}`;
}
