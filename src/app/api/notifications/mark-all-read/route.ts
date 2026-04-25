/**
 * API route: /api/notifications/mark-all-read
 *
 * POST  Mark all unread notifications for the authenticated user as read.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";

type SessionUser = { id: string };

export async function POST() {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ updated: result.count });
  } catch (error) {
    console.error("[POST /api/notifications/mark-all-read]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
