/**
 * API route: POST /api/recurring/run
 *
 * Manually trigger processing of all due recurring expenses.
 *
 * For each active recurring expense where nextDueDate <= now:
 *   1. Create a new EXPENSE transaction linked to the recurring expense.
 *   2. Deduct the amount from the account balance.
 *   3. Advance nextDueDate based on the frequency.
 *
 * Returns: { processed: number, transactions: ProcessedTransaction[] }
 */
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { isDue, calculateNextDueDate } from "@/lib/wallet/recurring";
import type { Frequency } from "@prisma/client";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

interface ProcessedTransaction {
  id: string;
  recurringExpenseId: string;
  description: string;
  amount: number;
  accountId: string;
  categoryId: string;
  date: string;
}

export async function POST() {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  try {
    // Fetch all active recurring expenses for the user
    const dueExpenses = await prisma.recurringExpense.findMany({
      where: { userId, isActive: true },
    });

    const toProcess = dueExpenses.filter((e) => isDue(e.nextDueDate, now));

    const createdTransactions: ProcessedTransaction[] = [];

    // Process each due expense in sequence to keep balance updates consistent
    for (const expense of toProcess) {
      await prisma.$transaction(async (tx) => {
        // Create a new expense transaction linked to this recurring schedule
        const transaction = await tx.transaction.create({
          data: {
            userId,
            accountId: expense.accountId,
            categoryId: expense.categoryId,
            type: "EXPENSE",
            amount: expense.amount,
            date: now,
            memo: expense.description,
            isRecurring: true,
            recurringExpenseId: expense.id,
          },
        });

        // Deduct from account balance
        await tx.account.update({
          where: { id: expense.accountId },
          data: { balance: { decrement: expense.amount } },
        });

        // Advance nextDueDate
        const nextDueDate = calculateNextDueDate(
          expense.nextDueDate,
          expense.frequency as Frequency,
          expense.dayOfMonth ?? undefined
        );

        await tx.recurringExpense.update({
          where: { id: expense.id },
          data: { nextDueDate },
        });

        createdTransactions.push({
          id: transaction.id,
          recurringExpenseId: expense.id,
          description: expense.description,
          amount: Number(expense.amount),
          accountId: expense.accountId,
          categoryId: expense.categoryId,
          date: transaction.date.toISOString(),
        });
      });
    }

    return NextResponse.json({
      processed: createdTransactions.length,
      transactions: createdTransactions,
    });
  } catch (error) {
    console.error("[POST /api/recurring/run]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
