/**
 * API route: /api/categories
 *
 * GET  - List all categories for the current user
 *        (default categories + user custom categories), sorted by sortOrder.
 *        Includes transaction count via _count.
 *
 * POST - Create a new custom category.
 *        Required: name. Optional: icon, color, parentId.
 *        Validates non-empty name and no duplicate name for the same user.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// GET /api/categories
// ---------------------------------------------------------------------------

export async function GET() {
  const session = await getServerSession();

  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId },
          { isDefault: true, userId: null },
        ],
      },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/categories
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    name?: string;
    icon?: string;
    color?: string;
    parentId?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json(
      { error: "Category name is required" },
      { status: 400 }
    );
  }

  // Check for duplicate name within the same user
  const existing = await prisma.category.findFirst({
    where: { userId: userId, name },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Category with this name already exists" },
      { status: 409 }
    );
  }

  // Determine next sortOrder
  const maxOrder = await prisma.category.aggregate({
    where: { userId: userId },
    _max: { sortOrder: true },
  });

  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  try {
    const category = await prisma.category.create({
      data: {
        userId: userId,
        name,
        icon: body.icon ?? null,
        color: body.color ?? null,
        parentId: body.parentId ?? null,
        isDefault: false,
        sortOrder,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("[POST /api/categories]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
