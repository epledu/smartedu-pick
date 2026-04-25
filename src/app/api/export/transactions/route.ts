/**
 * GET /api/export/transactions
 *
 * Exports transaction data as CSV or XLSX for download.
 *
 * Query parameters:
 *   format  - "csv" (default) | "xlsx"
 *   year    - 4-digit year (optional filter)
 *   month   - 1–12 (optional, requires year)
 *   dateFrom - ISO date string (optional)
 *   dateTo   - ISO date string (optional)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";
import { transactionsToCSV, transactionsToXLSX } from "@/lib/wallet/export";

type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// Date range helpers
// ---------------------------------------------------------------------------

function buildDateFilter(
  year?: string,
  month?: string,
  dateFrom?: string,
  dateTo?: string
): { gte?: Date; lte?: Date } | undefined {
  // Explicit date range takes precedence
  if (dateFrom || dateTo) {
    return {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }

  // Year + optional month filter
  if (year) {
    const y = parseInt(year, 10);
    if (month) {
      const m = parseInt(month, 10);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      return { gte: start, lte: end };
    }
    return { gte: new Date(y, 0, 1), lte: new Date(y, 11, 31, 23, 59, 59, 999) };
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// Filename helper
// ---------------------------------------------------------------------------

function buildFilename(format: string, year?: string, month?: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const period = year
    ? month
      ? `${year}-${String(month).padStart(2, "0")}`
      : year
    : today;
  return `transactions_${period}.${format}`;
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as SessionUser).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const format = searchParams.get("format") ?? "csv";
  const year = searchParams.get("year") ?? undefined;
  const month = searchParams.get("month") ?? undefined;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;

  if (format !== "csv" && format !== "xlsx") {
    return NextResponse.json({ error: "Invalid format. Use csv or xlsx." }, { status: 400 });
  }

  const dateFilter = buildDateFilter(year, month, dateFrom, dateTo);

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        ...(dateFilter ? { date: dateFilter } : {}),
      },
      include: {
        category: { select: { name: true } },
        account: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    const filename = buildFilename(format, year, month);

    if (format === "xlsx") {
      const buffer = transactionsToXLSX(
        transactions.map((t) => ({
          ...t,
          date: t.date.toISOString(),
          amount: Number(t.amount),
        }))
      );
      return new NextResponse(Buffer.from(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        },
      });
    }

    // CSV — default
    const csv = transactionsToCSV(
      transactions.map((t) => ({
        ...t,
        date: t.date.toISOString(),
        amount: Number(t.amount),
      }))
    );
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (err) {
    console.error("[GET /api/export/transactions]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
