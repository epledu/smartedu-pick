/**
 * API route: /api/accounts/[id]
 *
 * GET    - Fetch a single account with its 10 most recent transactions.
 *
 * PUT    - Update account fields: name, type, color, icon, isActive.
 *          Does not allow changing balance directly (use transactions).
 *
 * DELETE - Soft delete (isActive=false) when the account has transactions.
 *          Hard delete when the account has no transactions.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

const VALID_ACCOUNT_TYPES = ["BANK", "CARD", "CASH", "EPAY"] as const;
type AccountTypeValue = (typeof VALID_ACCOUNT_TYPES)[number];

// ---------------------------------------------------------------------------
// GET /api/accounts/[id]
// ---------------------------------------------------------------------------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.account.findUnique({
    where: { id: (await params).id },
    include: {
      transactions: {
        orderBy: { date: "desc" },
        take: 10,
        include: {
          category: { select: { id: true, name: true, icon: true, color: true } },
        },
      },
      _count: { select: { transactions: true } },
    },
  });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  if (account.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(account);
}

// ---------------------------------------------------------------------------
// PUT /api/accounts/[id]
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

  const account = await prisma.account.findUnique({ where: { id: (await params).id } });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  if (account.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    name?: string;
    type?: string;
    color?: string;
    icon?: string;
    isActive?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Build update payload with only provided fields
  const updateData: {
    name?: string;
    type?: AccountTypeValue;
    color?: string | null;
    icon?: string | null;
    isActive?: boolean;
  } = {};

  if (body.name !== undefined) {
    const trimmed = body.name.trim();
    if (!trimmed) {
      return NextResponse.json(
        { error: "Account name cannot be empty" },
        { status: 400 }
      );
    }
    updateData.name = trimmed;
  }

  if (body.type !== undefined) {
    if (!VALID_ACCOUNT_TYPES.includes(body.type as AccountTypeValue)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }
    updateData.type = body.type as AccountTypeValue;
  }

  if (body.color !== undefined) updateData.color = body.color;
  if (body.icon !== undefined) updateData.icon = body.icon;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  try {
    const updated = await prisma.account.update({
      where: { id: (await params).id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/accounts/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/accounts/[id]
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

  const account = await prisma.account.findUnique({
    where: { id: (await params).id },
    include: { _count: { select: { transactions: true } } },
  });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  if (account.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const hasTransactions = account._count.transactions > 0;

    if (hasTransactions) {
      // Soft delete: keep the record but mark inactive
      await prisma.account.update({
        where: { id: (await params).id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true });
    } else {
      // Hard delete: no transactions, safe to remove
      await prisma.account.delete({ where: { id: (await params).id } });
      return NextResponse.json({ success: true, softDeleted: false });
    }
  } catch (error) {
    console.error("[DELETE /api/accounts/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
