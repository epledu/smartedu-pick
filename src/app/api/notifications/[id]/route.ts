/**
 * API route: /api/notifications/[id]
 *
 * PUT    Mark notification as read.
 * DELETE Remove a notification by id.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

type SessionUser = { id: string };

// ---------------------------------------------------------------------------
// PUT /api/notifications/[id]
// ---------------------------------------------------------------------------

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/notifications/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/notifications/[id]
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

  try {
    const existing = await prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.notification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/notifications/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
