/**
 * /api/user/delete
 *
 * DELETE - Deletes user-owned data based on the requested mode.
 *          Requires the custom header  X-Confirm-Delete: yes  to guard
 *          against accidental calls.
 *
 * Mode (query param or request body):
 *   mode=data    — Delete all user data (transactions, categories, accounts,
 *                  budgets, goals, points, recurring expenses, notifications)
 *                  but KEEP the User record so the session remains valid.
 *   mode=account — Delete everything including User, Session, AuthAccount
 *                  records (current "full wipe" behaviour).
 *
 * Deletion order respects FK constraints that Prisma cannot auto-cascade.
 * All deletes run inside a single prisma.$transaction for atomicity.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";

type SessionUser = { id: string };
type DeleteMode = "data" | "account";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Safety guard — caller must explicitly set confirmation header
  const confirm = req.headers.get("X-Confirm-Delete");
  if (confirm !== "yes") {
    return NextResponse.json(
      { error: "Missing or invalid X-Confirm-Delete header" },
      { status: 400 }
    );
  }

  // Resolve deletion mode from query param first, then request body
  let mode: DeleteMode = "data"; // safe default: never accidentally delete account
  const queryMode = req.nextUrl.searchParams.get("mode");

  if (queryMode === "data" || queryMode === "account") {
    mode = queryMode;
  } else if (queryMode !== null) {
    // Unknown mode value provided — reject rather than silently fall back
    return NextResponse.json(
      { error: `Unknown mode: "${queryMode}". Use "data" or "account".` },
      { status: 400 }
    );
  } else {
    // No query param — check JSON body
    try {
      const body = await req.json().catch(() => ({}));
      if (body?.mode === "data" || body?.mode === "account") {
        mode = body.mode as DeleteMode;
      }
    } catch {
      // Body parse failure is acceptable; default mode ("data") is used
    }
  }

  const user = session.user as SessionUser;
  const uid = user.id;

  if (mode === "data") {
    // Delete all user-generated data but preserve the User record and auth records
    await prisma.$transaction([
      prisma.notification.deleteMany({ where: { userId: uid } }),
      prisma.transaction.deleteMany({ where: { userId: uid } }),
      prisma.recurringExpense.deleteMany({ where: { userId: uid } }),
      prisma.budget.deleteMany({ where: { userId: uid } }),
      prisma.goal.deleteMany({ where: { userId: uid } }),
      prisma.point.deleteMany({ where: { userId: uid } }),
      prisma.account.deleteMany({ where: { userId: uid } }),
      prisma.category.deleteMany({ where: { userId: uid } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "모든 데이터가 초기화되었습니다. 계정은 유지됩니다.",
    });
  }

  // mode === "account": delete everything including the User record
  await prisma.$transaction([
    prisma.notification.deleteMany({ where: { userId: uid } }),
    prisma.transaction.deleteMany({ where: { userId: uid } }),
    prisma.recurringExpense.deleteMany({ where: { userId: uid } }),
    prisma.budget.deleteMany({ where: { userId: uid } }),
    prisma.goal.deleteMany({ where: { userId: uid } }),
    prisma.point.deleteMany({ where: { userId: uid } }),
    prisma.account.deleteMany({ where: { userId: uid } }),
    prisma.category.deleteMany({ where: { userId: uid } }),
    prisma.session.deleteMany({ where: { userId: uid } }),
    prisma.authAccount.deleteMany({ where: { userId: uid } }),
    prisma.user.delete({ where: { id: uid } }),
  ]);

  return NextResponse.json({
    success: true,
    message: "계정과 모든 데이터가 삭제되었습니다.",
  });
}
