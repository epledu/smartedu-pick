/**
 * /api/user/stats
 *
 * GET - Return aggregate statistics for the current user's account:
 *       transactionCount, categoryCount, accountCount, memberSince.
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";

type SessionUser = { id: string };

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as SessionUser;

  const [transactionCount, categoryCount, accountCount, userRecord] =
    await Promise.all([
      prisma.transaction.count({ where: { userId: user.id } }),
      prisma.category.count({ where: { userId: user.id } }),
      prisma.account.count({ where: { userId: user.id } }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { createdAt: true },
      }),
    ]);

  return NextResponse.json({
    transactionCount,
    categoryCount,
    accountCount,
    memberSince: userRecord?.createdAt ?? null,
  });
}
