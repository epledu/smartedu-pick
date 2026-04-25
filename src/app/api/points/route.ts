/**
 * API route: /api/points
 *
 * GET  - List all points for the current user.
 *        Includes history count per provider. Sorted by balance desc.
 *        Query param: ?type=APPTECH|LOYALTY to filter by type.
 *
 * POST - Create or update a point entry (upsert by userId + provider).
 *        Creates a PointHistory EARN entry for the initial balance.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

type SessionUser = { id: string; name?: string | null; email?: string | null };

const VALID_POINT_TYPES = ["APPTECH", "LOYALTY"] as const;
type PointTypeValue = (typeof VALID_POINT_TYPES)[number];

// ---------------------------------------------------------------------------
// GET /api/points
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get("type");

  try {
    const points = await prisma.point.findMany({
      where: {
        userId,
        ...(typeFilter && VALID_POINT_TYPES.includes(typeFilter as PointTypeValue)
          ? { type: typeFilter as PointTypeValue }
          : {}),
      },
      include: {
        _count: { select: { history: true } },
      },
      orderBy: { balance: "desc" },
    });

    return NextResponse.json(points);
  } catch (error) {
    console.error("[GET /api/points]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/points
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    provider?: string;
    type?: string;
    balance?: number | string;
    expiresAt?: string | null;
    description?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const provider = body.provider?.trim();
  if (!provider) {
    return NextResponse.json({ error: "provider is required" }, { status: 400 });
  }

  if (!body.type || !VALID_POINT_TYPES.includes(body.type as PointTypeValue)) {
    return NextResponse.json(
      { error: "Valid type is required (APPTECH, LOYALTY)" },
      { status: 400 }
    );
  }

  const balance = body.balance !== undefined ? Number(body.balance) : 0;
  if (isNaN(balance) || balance < 0) {
    return NextResponse.json({ error: "Invalid balance value" }, { status: 400 });
  }

  const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
  const now = new Date();

  try {
    // Upsert point record using composite unique key
    const point = await prisma.point.upsert({
      where: {
        userId_provider: { userId, provider },
      },
      update: {
        balance,
        lastUpdated: now,
        ...(expiresAt !== undefined ? { expiresAt } : {}),
      },
      create: {
        userId,
        provider,
        type: body.type as PointTypeValue,
        balance,
        lastUpdated: now,
        expiresAt,
      },
    });

    // Record initial/reset history entry
    await prisma.pointHistory.create({
      data: {
        pointId: point.id,
        amount: balance,
        type: "EARN",
        date: now,
        description: body.description ?? "잔액 설정",
      },
    });

    return NextResponse.json(point, { status: 201 });
  } catch (error) {
    console.error("[POST /api/points]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
