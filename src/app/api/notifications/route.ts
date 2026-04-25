/**
 * API route: /api/notifications
 *
 * GET  List user notifications, sorted by createdAt desc.
 *      Query params: unreadOnly=true, limit=20
 *
 * POST Create a new notification for the authenticated user.
 *      Body: { type, title, body, data? }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { Prisma } from "@prisma/client";
import type { NotificationType } from "@prisma/client";

type SessionUser = { id: string };

// ---------------------------------------------------------------------------
// GET /api/notifications
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: isNaN(limit) ? 20 : limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("[GET /api/notifications]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/notifications
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    type?: NotificationType;
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, title, body: bodyText, data } = body;
  if (!type || !title || !bodyText) {
    return NextResponse.json(
      { error: "type, title, and body are required" },
      { status: 400 }
    );
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body: bodyText,
        ...(data ? { data: data as Prisma.InputJsonValue } : {}),
      },
    });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("[POST /api/notifications]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
