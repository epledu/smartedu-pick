/**
 * /api/user/export-all
 *
 * GET - Export all user data as a single JSON file.
 *       Includes: transactions, categories, accounts, budgets, goals, points.
 *       Returns a downloadable JSON blob via Content-Disposition header.
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";

type SessionUser = { id: string; email?: string | null };

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as SessionUser;
  const uid = user.id;

  // Fetch all data in parallel for performance
  const [transactions, categories, accounts, budgets, goals, points] =
    await Promise.all([
      prisma.transaction.findMany({ where: { userId: uid } }),
      prisma.category.findMany({ where: { userId: uid } }),
      prisma.account.findMany({ where: { userId: uid } }),
      prisma.budget.findMany({ where: { userId: uid } }),
      prisma.goal.findMany({ where: { userId: uid } }),
      prisma.point.findMany({ where: { userId: uid } }),
    ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    userEmail: user.email,
    data: { transactions, categories, accounts, budgets, goals, points },
  };

  const json = JSON.stringify(payload, null, 2);
  const filename = `wallet-diary-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
