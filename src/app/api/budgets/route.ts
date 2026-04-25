/**
 * API route: /api/budgets
 *
 * GET  ?year=&month=
 *      Returns all budgets for the authenticated user with computed
 *      spent/remaining/percent/status fields.
 *
 * POST  Create or update a budget (upsert by userId+categoryId+month+year).
 *       Body: { categoryId, amount, month, year }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { calculateBudgetStatus } from "@/lib/wallet/budget";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// GET /api/budgets
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()), 10);
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1), 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
  }

  try {
    // Fetch all budgets for this user/year/month
    const budgets = await prisma.budget.findMany({
      where: { userId, year, month },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
      orderBy: { category: { name: "asc" } },
    });

    if (!budgets.length) {
      return NextResponse.json([]);
    }

    // Aggregate expense transactions per category for the given month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const spentRows = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: startOfMonth, lte: endOfMonth },
        categoryId: { in: budgets.map((b) => b.categoryId) },
      },
      _sum: { amount: true },
    });

    // Build lookup map: categoryId → spent amount
    const spentMap = new Map<string, number>(
      spentRows.map((row) => [row.categoryId, Number(row._sum.amount ?? 0)])
    );

    const result = budgets.map((b) => {
      const amount = Number(b.amount);
      const spent = spentMap.get(b.categoryId) ?? 0;
      const remaining = amount - spent;
      const percent = amount > 0 ? Math.round((spent / amount) * 10000) / 100 : 0;
      const status = calculateBudgetStatus(spent / (amount || 1));

      return {
        id: b.id,
        categoryId: b.categoryId,
        category: b.category,
        amount,
        spent,
        remaining,
        percent,
        status,
        month: b.month,
        year: b.year,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/budgets]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/budgets
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    categoryId?: string;
    amount?: number;
    month?: number;
    year?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { categoryId, amount, month, year } = body;

  if (!categoryId || amount == null || !month || !year) {
    return NextResponse.json(
      { error: "categoryId, amount, month, and year are required" },
      { status: 400 }
    );
  }

  if (amount <= 0) {
    return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });
  }

  try {
    const budget = await prisma.budget.upsert({
      where: { userId_categoryId_month_year: { userId, categoryId, month, year } },
      create: { userId, categoryId, amount, month, year },
      update: { amount },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("[POST /api/budgets]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
