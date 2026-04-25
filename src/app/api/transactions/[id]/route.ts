/**
 * /api/transactions/[id]
 *
 * GET    - Fetch a single transaction (ownership verified).
 * PUT    - Update a transaction and recalculate account balance diff.
 * DELETE - Remove a transaction and restore the account balance.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";

// Local enum mirror — avoids dependency on prisma generate output
const TX_TYPE = { INCOME: "INCOME", EXPENSE: "EXPENSE", TRANSFER: "TRANSFER" } as const;
type TxType = (typeof TX_TYPE)[keyof typeof TX_TYPE];

// Extend session user type to include id added by NextAuth callback
type SessionUser = { id: string; name?: string | null; email?: string | null };

// Shared relation include
const TX_INCLUDE = {
  category: { select: { id: true, name: true, icon: true, color: true } },
  account: { select: { id: true, name: true, type: true } },
} as const;

// ---------------------------------------------------------------------------
// GET /api/transactions/[id]
// ---------------------------------------------------------------------------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as SessionUser).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: (await params).id, userId },
      include: TX_INCLUDE,
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ transaction });
  } catch (err) {
    console.error("[GET /api/transactions/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PUT /api/transactions/[id]
// ---------------------------------------------------------------------------

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as SessionUser).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { type, amount, date, categoryId, memo, merchantName, receiptImageUrl } = body as {
    type?: string;
    amount?: number;
    date?: string;
    categoryId?: string;
    memo?: string;
    merchantName?: string;
    /** Optional receipt image URL — can be updated after creation */
    receiptImageUrl?: string;
  };

  // Validate optional fields
  if (amount !== undefined && (typeof amount !== "number" || amount <= 0)) {
    return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
  }
  if (type && !Object.values(TX_TYPE).includes(type as TxType)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    // Load existing transaction to compute balance diff
    const existing = await prisma.transaction.findFirst({
      where: { id: (await params).id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const oldAmount = Number(existing.amount);
    const oldType = existing.type as TxType;
    const newAmount = amount ?? oldAmount;
    const newType = (type as TxType | undefined) ?? oldType;

    // Compute signed delta to apply to account balance
    const oldSigned = oldType === TX_TYPE.INCOME ? oldAmount : -oldAmount;
    const newSigned = newType === TX_TYPE.INCOME ? newAmount : -newAmount;
    const balanceDiff = newSigned - oldSigned;

    const [transaction] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id: (await params).id },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(type && { type: type as any }),
          ...(amount !== undefined && { amount }),
          ...(date && { date: new Date(date) }),
          ...(categoryId && { categoryId }),
          ...(memo !== undefined && { memo }),
          ...(merchantName !== undefined && { merchantName }),
          // Allow updating the receipt image URL (e.g. when linking after creation)
          ...(receiptImageUrl !== undefined && { receiptImageUrl }),
        },
        include: TX_INCLUDE,
      }),
      prisma.account.update({
        where: { id: existing.accountId },
        data: { balance: { increment: balanceDiff } },
      }),
    ]);

    return NextResponse.json({ transaction });
  } catch (err) {
    console.error("[PUT /api/transactions/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/transactions/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as SessionUser).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: (await params).id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const amount = Number(existing.amount);
    // Reverse the original effect on balance
    const restoreDelta = (existing.type as TxType) === TX_TYPE.INCOME ? -amount : amount;

    await prisma.$transaction([
      prisma.transaction.delete({ where: { id: (await params).id } }),
      prisma.account.update({
        where: { id: existing.accountId },
        data: { balance: { increment: restoreDelta } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/transactions/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
