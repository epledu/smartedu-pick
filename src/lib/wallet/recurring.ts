/**
 * Pure utility functions for recurring expense scheduling.
 *
 * No side effects — all functions are deterministic and testable.
 */

import type { Frequency } from "@prisma/client";

// ---------------------------------------------------------------------------
// calculateNextDueDate
// ---------------------------------------------------------------------------

/**
 * Calculate the next due date after a recurring expense fires.
 *
 * - DAILY: advance by 1 day
 * - WEEKLY: advance by 7 days
 * - MONTHLY: advance to the same dayOfMonth in the next month;
 *            clamps to the last valid day if the target month is shorter
 * - YEARLY: advance by 1 year
 *
 * @param current    The date the expense last fired (or was created).
 * @param frequency  Recurrence interval.
 * @param dayOfMonth Override day for MONTHLY recurrence (1-31). Falls back
 *                   to the day component of `current` when omitted.
 */
export function calculateNextDueDate(
  current: Date,
  frequency: Frequency,
  dayOfMonth?: number
): Date {
  const next = new Date(current);

  switch (frequency) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;

    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;

    case "MONTHLY": {
      // Determine the target day within the next month
      const targetDay = dayOfMonth ?? current.getDate();
      const nextMonth = current.getMonth() + 1;
      const nextYear = current.getFullYear() + (nextMonth > 11 ? 1 : 0);
      const normalizedMonth = nextMonth % 12;

      // Last day of the target month (day 0 of the following month)
      const lastDayOfMonth = new Date(
        nextYear,
        normalizedMonth + 1,
        0
      ).getDate();

      next.setFullYear(nextYear);
      next.setMonth(normalizedMonth);
      next.setDate(Math.min(targetDay, lastDayOfMonth));
      break;
    }

    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;

    default:
      // Exhaustive guard — TypeScript should prevent reaching here
      throw new Error(`Unknown frequency: ${frequency}`);
  }

  return next;
}

// ---------------------------------------------------------------------------
// isDue
// ---------------------------------------------------------------------------

/**
 * Return true when a recurring expense is due for processing.
 *
 * An expense is due when its nextDueDate is on or before `now`.
 *
 * @param nextDueDate  Scheduled fire date for the recurring expense.
 * @param now          Reference point in time (defaults to Date.now()).
 */
export function isDue(nextDueDate: Date, now: Date = new Date()): boolean {
  return nextDueDate <= now;
}
