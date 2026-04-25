/**
 * API route: /api/budgets/[id]
 *
 * PUT    Update the amount of an existing budget.
 *        Body: { amount }
 *
 * DELETE Remove a budget by id.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// PUT /api/budgets/[id]
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
  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }
  if (budget.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { amount } = body;

  if (amount == null || amount <= 0) {
    return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
  }

  try {
    const updated = await prisma.budget.update({
      where: { id },
      data: { amount },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/budgets/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/budgets/[id]
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

  const { id } = await params;

  // Verify ownership
  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }
  if (budget.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.budget.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/budgets/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
