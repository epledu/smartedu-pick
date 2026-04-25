/**
 * API route: /api/goals/[id]
 *
 * PUT     Update a goal's mutable fields (title, targetAmount, currentAmount,
 *         status, endDate, icon, color, categoryId).
 * DELETE  Permanently remove a goal.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// PUT /api/goals/[id]
// ---------------------------------------------------------------------------

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.goal.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  let body: {
    title?: string;
    targetAmount?: number;
    currentAmount?: number;
    status?: "ACTIVE" | "COMPLETED" | "FAILED" | "PAUSED";
    endDate?: string;
    icon?: string;
    color?: string;
    categoryId?: string | null;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, targetAmount, currentAmount, status, endDate, icon, color, categoryId } = body;

  // Build partial update — only include provided fields
  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (targetAmount !== undefined) data.targetAmount = targetAmount;
  if (currentAmount !== undefined) data.currentAmount = currentAmount;
  if (status !== undefined) data.status = status;
  if (endDate !== undefined) data.endDate = new Date(endDate);
  if (icon !== undefined) data.icon = icon;
  if (color !== undefined) data.color = color;
  if (categoryId !== undefined) data.categoryId = categoryId;

  try {
    const goal = await prisma.goal.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    });

    const target = Number(goal.targetAmount);
    const current = Number(goal.currentAmount);
    const remaining = Math.max(0, target - current);
    const percent = target > 0 ? Math.min(100, Math.round((current / target) * 10000) / 100) : 0;
    const now = new Date();
    const daysRemaining = Math.max(
      0,
      Math.ceil((goal.endDate.getTime() - now.getTime()) / 86400000)
    );

    return NextResponse.json({
      ...goal,
      targetAmount: target,
      currentAmount: current,
      remaining,
      percent,
      daysRemaining,
    });
  } catch (error) {
    console.error("[PUT /api/goals/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/goals/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  void req;
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.goal.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  try {
    await prisma.goal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/goals/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
