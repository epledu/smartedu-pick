/**
 * API route: /api/accounts
 *
 * GET  - List all accounts for the current user (isActive=true by default).
 *        Includes transaction count via _count.
 *        Query param: ?all=true to include inactive accounts.
 *
 * POST - Create a new account.
 *        Required: name, type. Optional: balance, currency, color, icon.
 *        Validates non-empty name and known AccountType.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

// Valid account types matching Prisma enum
const VALID_ACCOUNT_TYPES = ["BANK", "CARD", "CASH", "EPAY"] as const;
type AccountTypeValue = (typeof VALID_ACCOUNT_TYPES)[number];

// ---------------------------------------------------------------------------
// GET /api/accounts
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const includeInactive = searchParams.get("all") === "true";

  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("[GET /api/accounts]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/accounts
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    name?: string;
    type?: string;
    balance?: number | string;
    currency?: string;
    color?: string;
    icon?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json(
      { error: "Account name is required" },
      { status: 400 }
    );
  }

  if (!body.type || !VALID_ACCOUNT_TYPES.includes(body.type as AccountTypeValue)) {
    return NextResponse.json(
      { error: "Valid account type is required (BANK, CARD, CASH, EPAY)" },
      { status: 400 }
    );
  }

  const balance = body.balance !== undefined ? Number(body.balance) : 0;
  if (isNaN(balance)) {
    return NextResponse.json({ error: "Invalid balance value" }, { status: 400 });
  }

  try {
    const account = await prisma.account.create({
      data: {
        userId,
        name,
        type: body.type as AccountTypeValue,
        balance,
        currency: body.currency ?? "KRW",
        color: body.color ?? null,
        icon: body.icon ?? null,
        isActive: true,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("[POST /api/accounts]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
