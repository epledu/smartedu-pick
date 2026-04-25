/**
 * POST /api/banking/connect
 *
 * Simulates an Open Banking OAuth connection flow.
 * In production this endpoint would redirect to the bank's OAuth provider.
 * Here it creates a regular Account record with a "[연동]" prefix so the
 * UI can distinguish connected accounts.
 *
 * Body: { provider: string; accountName: string; accountType: "BANK"|"CARD" }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { BANK_PROVIDERS } from "@/lib/wallet/bank-mock";

type SessionUser = { id: string; name?: string | null; email?: string | null };

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { provider?: string; accountName?: string; accountType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { provider, accountName, accountType } = body;

  if (!provider) {
    return NextResponse.json({ error: "provider is required" }, { status: 400 });
  }

  const bankDef = BANK_PROVIDERS.find((b) => b.id === provider);
  if (!bankDef) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const validTypes = ["BANK", "CARD"] as const;
  const resolvedType =
    accountType && validTypes.includes(accountType as "BANK" | "CARD")
      ? (accountType as "BANK" | "CARD")
      : bankDef.accountType;

  // Name format: "[연동] 국민은행 (내 계좌명)" — prefix allows quick identification
  const resolvedName = accountName?.trim()
    ? `[연동] ${bankDef.name} (${accountName.trim()})`
    : `[연동] ${bankDef.name}`;

  try {
    // Check for duplicate connected account for the same provider
    const existing = await prisma.account.findFirst({
      where: {
        userId,
        name: { startsWith: `[연동] ${bankDef.name}` },
        isActive: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `이미 ${bankDef.name} 계좌가 연동되어 있습니다.` },
        { status: 409 }
      );
    }

    const account = await prisma.account.create({
      data: {
        userId,
        name: resolvedName,
        type: resolvedType,
        balance: 0,
        currency: "KRW",
        // Store provider id in the icon field for later retrieval
        icon: provider,
        isActive: true,
      },
    });

    return NextResponse.json(
      { account, provider: bankDef.name, connected: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/banking/connect]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
