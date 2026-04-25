/**
 * /api/transactions
 *
 * GET  - List transactions with optional filters and pagination.
 * POST - Create a new transaction and update the linked account balance.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";

// Local enum mirror — avoids dependency on prisma generate output
const TX_TYPE = { INCOME: "INCOME", EXPENSE: "EXPENSE", TRANSFER: "TRANSFER" } as const;
type TxType = (typeof TX_TYPE)[keyof typeof TX_TYPE];

// Extend session user type to include id (added by NextAuth callback)
type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// Shared relation include shape
// ---------------------------------------------------------------------------

const TX_INCLUDE = {
  category: { select: { id: true, name: true, icon: true, color: true } },
  account: { select: { id: true, name: true, type: true } },
} as const;

// ---------------------------------------------------------------------------
// GET /api/transactions
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as SessionUser).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;

  // --- pagination ---
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
  const skip = (page - 1) * limit;

  // --- filters ---
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const accountId = searchParams.get("accountId") ?? undefined;
  const typeParam = searchParams.get("type") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  // When true, return only transactions with a receipt image attached
  const hasReceipt = searchParams.get("hasReceipt") === "true";

  // Validate type value
  const typeFilter =
    typeParam && Object.values(TX_TYPE).includes(typeParam as TxType)
      ? (typeParam as TxType)
      : undefined;

  try {
    const where = {
      userId,
      ...(categoryId && { categoryId }),
      ...(accountId && { accountId }),
      ...(typeFilter && { type: typeFilter }),
      ...(dateFrom || dateTo
        ? {
            date: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { memo: { contains: search, mode: "insensitive" as const } },
          { merchantName: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      // Filter to only rows that have a receipt image URL stored
      ...(hasReceipt && { receiptImageUrl: { not: null } }),
    };

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: TX_INCLUDE,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/transactions]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/transactions
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
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

  const { type, amount, date, accountId, categoryId, memo, merchantName, receiptImageUrl } = body as {
    type?: string;
    amount?: number;
    date?: string;
    accountId?: string;
    categoryId?: string;
    memo?: string;
    merchantName?: string;
    /** Optional URL of the uploaded receipt image from OCR flow */
    receiptImageUrl?: string;
  };

  // --- validation ---
  if (!type || !Object.values(TX_TYPE).includes(type as TxType)) {
    return NextResponse.json({ error: "Invalid or missing type" }, { status: 400 });
  }
  if (!amount || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (!accountId) {
    return NextResponse.json({ error: "accountId is required" }, { status: 400 });
  }
  if (!categoryId) {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  try {
    // Verify the account belongs to this user
    const account = await prisma.account.findFirst({ where: { id: accountId, userId } });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 400 });
    }

    // Calculate balance delta: income adds, expense subtracts
    const delta = (type as TxType) === TX_TYPE.INCOME ? amount : -amount;

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          accountId,
          categoryId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type: type as any,
          amount,
          date: new Date(date),
          memo: memo ?? null,
          merchantName: merchantName ?? null,
          // Persist the receipt image URL so the receipt list can filter by it
          receiptImageUrl: receiptImageUrl ?? null,
        },
        include: TX_INCLUDE,
      }),
      prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: delta } },
      }),
    ]);

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/transactions]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
