/**
 * GET /api/categories/suggest?merchant=스타벅스&memo=라떼
 *
 * Returns the best category suggestion for the given merchant/memo input.
 *
 * Strategy:
 *   1. Look up user's prior transactions with same/similar merchant.
 *      If found and ratio >= 60% → return user's most-used category (high confidence).
 *   2. Fall back to built-in keyword rules.
 *   3. If nothing matches → return { suggestion: null }.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { classifyByBuiltin } from "@/lib/wallet/category-classifier";

// Extend NextAuth session user type to include id
type SessionUser = { id: string };

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchant = req.nextUrl.searchParams.get("merchant")?.trim() ?? "";
  const memo = req.nextUrl.searchParams.get("memo")?.trim() ?? "";
  const input = (merchant + " " + memo).trim();

  if (!input) {
    return NextResponse.json({ suggestion: null });
  }

  // ------------------------------------------------------------------
  // Step 1: User history — find most-used category for this merchant
  // ------------------------------------------------------------------
  if (merchant) {
    const history = await prisma.transaction.findMany({
      where: {
        userId,
        merchantName: { contains: merchant, mode: "insensitive" },
        type: "EXPENSE",
      },
      select: {
        categoryId: true,
        category: { select: { id: true, name: true } },
      },
      take: 50,
      orderBy: { date: "desc" },
    });

    if (history.length > 0) {
      // Tally votes per category
      const tally: Record<string, { count: number; name: string; id: string }> =
        {};
      for (const tx of history) {
        const id = tx.categoryId;
        const name = tx.category?.name ?? "미분류";
        tally[id] = { count: (tally[id]?.count ?? 0) + 1, name, id };
      }

      const sorted = Object.values(tally).sort((a, b) => b.count - a.count);
      const top = sorted[0];
      const ratio = top.count / history.length;

      // Require at least 60% agreement across recent transactions
      if (ratio >= 0.6) {
        return NextResponse.json({
          suggestion: {
            categoryId: top.id,
            categoryName: top.name,
            confidence: Math.min(0.95, 0.5 + ratio * 0.5),
            source: "user-history",
            sampleSize: history.length,
          },
        });
      }
    }
  }

  // ------------------------------------------------------------------
  // Step 2: Built-in rules
  // ------------------------------------------------------------------
  const builtin = classifyByBuiltin(input);
  if (builtin) {
    // Resolve category name → category ID for this user
    const cat = await prisma.category.findFirst({
      where: {
        OR: [{ userId }, { isDefault: true, userId: null }],
        name: builtin.categoryName,
      },
      select: { id: true, name: true },
    });

    if (cat) {
      return NextResponse.json({
        suggestion: {
          categoryId: cat.id,
          categoryName: cat.name,
          confidence: builtin.confidence,
          source: "builtin",
        },
      });
    }
  }

  return NextResponse.json({ suggestion: null });
}
