/**
 * API route: /api/goals
 *
 * GET  Returns all goals for the authenticated user.
 *      If a goal has a categoryId, currentAmount is computed from
 *      linked expense transactions within the goal date range.
 *      Response includes percent and remaining fields.
 *
 * POST  Create a new goal.
 *       Body: { title, targetAmount, currentAmount?, categoryId?, startDate, endDate, icon?, color? }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Compute derived fields (percent, remaining) for a goal. */
function enrichGoal(goal: {
  id: string;
  title: string;
  targetAmount: unknown;
  currentAmount: unknown;
  categoryId: string | null;
  startDate: Date;
  endDate: Date;
  status: string;
  icon: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string; icon: string | null; color: string | null } | null;
}, computedCurrent?: number) {
  const target = Number(goal.targetAmount);
  const current = computedCurrent ?? Number(goal.currentAmount);
  const remaining = Math.max(0, target - current);
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 10000) / 100) : 0;
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((goal.endDate.getTime() - now.getTime()) / 86400000));

  return {
    ...goal,
    targetAmount: target,
    currentAmount: current,
    remaining,
    percent,
    daysRemaining,
    category: goal.category ?? null,
  };
}

// ---------------------------------------------------------------------------
// GET /api/goals
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  void req;
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // For goals with a linked category, compute currentAmount from transactions
    const categoryGoals = goals.filter((g) => g.categoryId);

    const spentMap = new Map<string, number>();
    if (categoryGoals.length > 0) {
      // Aggregate per goal separately (each goal has its own date range)
      await Promise.all(
        categoryGoals.map(async (g) => {
          const agg = await prisma.transaction.aggregate({
            where: {
              userId,
              categoryId: g.categoryId!,
              type: "EXPENSE",
              date: { gte: g.startDate, lte: g.endDate },
            },
            _sum: { amount: true },
          });
          spentMap.set(g.id, Number(agg._sum.amount ?? 0));
        })
      );
    }

    const result = goals.map((g) => {
      const computed = g.categoryId ? spentMap.get(g.id) : undefined;
      return enrichGoal(g, computed);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/goals]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/goals
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: string;
    targetAmount?: number;
    currentAmount?: number;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    icon?: string;
    color?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, targetAmount, currentAmount, categoryId, startDate, endDate, icon, color } = body;

  if (!title || targetAmount == null || !startDate || !endDate) {
    return NextResponse.json(
      { error: "title, targetAmount, startDate, and endDate are required" },
      { status: 400 }
    );
  }

  if (targetAmount <= 0) {
    return NextResponse.json({ error: "targetAmount must be positive" }, { status: 400 });
  }

  try {
    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        targetAmount,
        currentAmount: currentAmount ?? 0,
        categoryId: categoryId ?? null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        icon: icon ?? null,
        color: color ?? null,
      },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    });

    return NextResponse.json(enrichGoal(goal), { status: 201 });
  } catch (error) {
    console.error("[POST /api/goals]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
