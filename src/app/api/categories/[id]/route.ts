/**
 * API route: /api/categories/[id]
 *
 * PUT    - Update a category (name, icon, color, sortOrder).
 *          If isDefault=true, only icon/color changes are permitted.
 *
 * DELETE - Delete a category.
 *          Blocked for default categories.
 *          Moves all transactions in this category to the "미분류" fallback.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

// Extend NextAuth session user type to include id
type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find the "미분류" (uncategorized) category for the given user. */
async function getUncategorized(userId: string) {
  return prisma.category.findFirst({
    where: {
      name: "미분류",
      OR: [{ userId }, { isDefault: true, userId: null }],
    },
  });
}

// ---------------------------------------------------------------------------
// PUT /api/categories/[id]
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

  const category = await prisma.category.findUnique({
    where: { id: (await params).id },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // Only the owner may edit their categories (default categories have no owner
  // but we still allow icon/color edits when the user is authenticated)
  if (category.userId && category.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    name?: string;
    icon?: string;
    color?: string;
    sortOrder?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Default categories: only icon and color can be updated
  if (category.isDefault) {
    try {
      const updated = await prisma.category.update({
        where: { id: (await params).id },
        data: {
          icon: body.icon ?? category.icon,
          color: body.color ?? category.color,
        },
      });
      return NextResponse.json(updated);
    } catch (error) {
      console.error("[PUT /api/categories/:id] default update", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  // Custom category: full update allowed
  const updateData: {
    name?: string;
    icon?: string | null;
    color?: string | null;
    sortOrder?: number;
  } = {};

  if (body.name !== undefined) {
    const trimmed = body.name.trim();
    if (!trimmed) {
      return NextResponse.json(
        { error: "Category name cannot be empty" },
        { status: 400 }
      );
    }
    updateData.name = trimmed;
  }

  if (body.icon !== undefined) updateData.icon = body.icon;
  if (body.color !== undefined) updateData.color = body.color;
  if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

  try {
    const updated = await prisma.category.update({
      where: { id: (await params).id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/categories/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/categories/[id]
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

  const category = await prisma.category.findUnique({
    where: { id: (await params).id },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  if (category.isDefault) {
    return NextResponse.json(
      { error: "Cannot delete a default category" },
      { status: 400 }
    );
  }

  if (category.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Resolve fallback category before deletion
  const fallback = await getUncategorized(userId);

  if (!fallback) {
    return NextResponse.json(
      { error: "Fallback category '미분류' not found" },
      { status: 500 }
    );
  }

  try {
    await prisma.$transaction([
      // Move transactions to "미분류"
      prisma.transaction.updateMany({
        where: { categoryId: (await params).id },
        data: { categoryId: fallback.id },
      }),
      // Remove the category
      prisma.category.delete({ where: { id: (await params).id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/categories/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
