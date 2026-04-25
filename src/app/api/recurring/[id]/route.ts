/**
 * API route: /api/recurring/[id]
 *
 * PUT    - Update a recurring expense.
 *          Allowed fields: amount, description, isActive, nextDueDate, categoryId, accountId.
 *
 * DELETE - Delete a recurring expense by id.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// PUT /api/recurring/[id]
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

  const expense = await prisma.recurringExpense.findUnique({
    where: { id: (await params).id },
  });

  if (!expense) {
    return NextResponse.json(
      { error: "Recurring expense not found" },
      { status: 404 }
    );
  }

  if (expense.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    amount?: number;
    description?: string;
    isActive?: boolean;
    nextDueDate?: string;
    categoryId?: string;
    accountId?: string;
    dayOfMonth?: number | null;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate amount when provided
  if (body.amount !== undefined && body.amount <= 0) {
    return NextResponse.json(
      { error: "amount must be a positive number" },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};
  if (body.amount !== undefined) updateData.amount = body.amount;
  if (body.description !== undefined) updateData.description = body.description.trim();
  if (body.isActive !== undefined) updateData.isActive = body.isActive;
  if (body.nextDueDate !== undefined) updateData.nextDueDate = new Date(body.nextDueDate);
  if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
  if (body.accountId !== undefined) updateData.accountId = body.accountId;
  if (body.dayOfMonth !== undefined) updateData.dayOfMonth = body.dayOfMonth;

  try {
    const updated = await prisma.recurringExpense.update({
      where: { id: (await params).id },
      data: updateData,
      include: { account: true },
    });

    // Attach category
    const category = await prisma.category.findUnique({
      where: { id: updated.categoryId },
    });

    return NextResponse.json({ ...updated, category });
  } catch (error) {
    console.error("[PUT /api/recurring/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/recurring/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expense = await prisma.recurringExpense.findUnique({
    where: { id: (await params).id },
  });

  if (!expense) {
    return NextResponse.json(
      { error: "Recurring expense not found" },
      { status: 404 }
    );
  }

  if (expense.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.recurringExpense.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/recurring/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
