/**
 * API route: /api/points/[id]
 *
 * GET    - Fetch a single point entry with full history (newest first).
 *
 * PUT    - Update balance. Automatically creates PointHistory EARN or USE
 *          entry based on delta (new - old). Requires userId ownership.
 *
 * DELETE - Hard delete point and cascaded history.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// GET /api/points/[id]
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

  const point = await prisma.point.findUnique({
    where: { id: (await params).id },
    include: {
      history: { orderBy: { date: "desc" } },
      _count: { select: { history: true } },
    },
  });

  if (!point) {
    return NextResponse.json({ error: "Point not found" }, { status: 404 });
  }

  if (point.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(point);
}

// ---------------------------------------------------------------------------
// PUT /api/points/[id]
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

  const point = await prisma.point.findUnique({ where: { id: (await params).id } });

  if (!point) {
    return NextResponse.json({ error: "Point not found" }, { status: 404 });
  }

  if (point.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    balance?: number | string;
    expiresAt?: string | null;
    description?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.balance === undefined) {
    return NextResponse.json({ error: "balance is required" }, { status: 400 });
  }

  const newBalance = Number(body.balance);
  if (isNaN(newBalance) || newBalance < 0) {
    return NextResponse.json({ error: "Invalid balance value" }, { status: 400 });
  }

  const prevBalance = Number(point.balance);
  const delta = newBalance - prevBalance;

  // Determine EARN or USE based on the direction of change
  const historyType = delta >= 0 ? ("EARN" as const) : ("USE" as const);
  const now = new Date();

  try {
    const [updated] = await prisma.$transaction([
      prisma.point.update({
        where: { id: (await params).id },
        data: {
          balance: newBalance,
          lastUpdated: now,
          ...(body.expiresAt !== undefined
            ? { expiresAt: body.expiresAt ? new Date(body.expiresAt) : null }
            : {}),
        },
      }),
      prisma.pointHistory.create({
        data: {
          pointId: (await params).id,
          amount: Math.abs(delta),
          type: historyType,
          date: now,
          description: body.description ?? (delta >= 0 ? "포인트 적립" : "포인트 사용"),
        },
      }),
    ]);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/points/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/points/[id]
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

  const point = await prisma.point.findUnique({ where: { id: (await params).id } });

  if (!point) {
    return NextResponse.json({ error: "Point not found" }, { status: 404 });
  }

  if (point.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // History is cascade-deleted via the Prisma schema relation
    await prisma.point.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/points/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
