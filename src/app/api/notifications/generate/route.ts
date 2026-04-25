/**
 * API route: /api/notifications/generate
 *
 * POST  Trigger notification generation for the authenticated user.
 *       Runs budget, recurring, and goal generators. Useful for
 *       manual refresh or testing.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { generateAllNotifications } from "@/lib/wallet/notification-generator";

type SessionUser = { id: string };

export async function POST(): Promise<Response> {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateAllNotifications(userId, prisma);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/notifications/generate]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
