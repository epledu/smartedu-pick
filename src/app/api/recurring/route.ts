/**
 * API route: /api/recurring
 *
 * GET  - List all recurring expenses for the authenticated user.
 *        Joins account and fetches category separately (generated client limitation).
 *
 * POST - Create a new recurring expense.
 *        Validates: amount > 0, valid frequency, dayOfMonth range for MONTHLY.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import type { Frequency } from "@prisma/client";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

const VALID_FREQUENCIES: Frequency[] = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

// ---------------------------------------------------------------------------
// GET /api/recurring
// ---------------------------------------------------------------------------

export async function GET() {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recurring = await prisma.recurringExpense.findMany({
      where: { userId },
      include: { account: true },
      orderBy: { nextDueDate: "asc" },
    });

    // Collect unique category ids and batch-fetch to avoid N+1
    const categoryIdSet: Record<string, true> = {};
    recurring.forEach((e) => { categoryIdSet[e.categoryId] = true; });
    const categoryIds = Object.keys(categoryIdSet);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

    const result = recurring.map((e) => ({
      ...e,
      category: categoryMap[e.categoryId] ?? null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/recurring]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/recurring
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    accountId?: string;
    categoryId?: string;
    amount?: number;
    description?: string;
    frequency?: Frequency;
    dayOfMonth?: number;
    nextDueDate?: string;
    isActive?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Required field validation
  if (!body.accountId || !body.categoryId || !body.description?.trim()) {
    return NextResponse.json(
      { error: "accountId, categoryId, and description are required" },
      { status: 400 }
    );
  }

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json(
      { error: "amount must be a positive number" },
      { status: 400 }
    );
  }

  if (!body.frequency || !VALID_FREQUENCIES.includes(body.frequency)) {
    return NextResponse.json(
      { error: `frequency must be one of: ${VALID_FREQUENCIES.join(", ")}` },
      { status: 400 }
    );
  }

  if (!body.nextDueDate) {
    return NextResponse.json(
      { error: "nextDueDate is required" },
      { status: 400 }
    );
  }

  // MONTHLY dayOfMonth: must be 1–31 when provided
  if (
    body.frequency === "MONTHLY" &&
    body.dayOfMonth !== undefined &&
    (body.dayOfMonth < 1 || body.dayOfMonth > 31)
  ) {
    return NextResponse.json(
      { error: "dayOfMonth must be between 1 and 31" },
      { status: 400 }
    );
  }

  try {
    const expense = await prisma.recurringExpense.create({
      data: {
        userId,
        accountId: body.accountId,
        categoryId: body.categoryId,
        amount: body.amount,
        description: body.description.trim(),
        frequency: body.frequency,
        dayOfMonth: body.dayOfMonth ?? null,
        nextDueDate: new Date(body.nextDueDate),
        isActive: body.isActive ?? true,
      },
      include: { account: true },
    });

    // Attach category
    const category = await prisma.category.findUnique({
      where: { id: expense.categoryId },
    });

    return NextResponse.json({ ...expense, category }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/recurring]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
