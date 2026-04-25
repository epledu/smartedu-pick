/**
 * POST /api/codef/connect
 *
 * Registers a Korean bank or card account with CODEF and persists
 * the resulting connectedId to our database.
 *
 * The user's password is forwarded to the CODEF client which RSA-encrypts it
 * before sending — it is NEVER stored in our database.
 *
 * Body:
 *   organization  string  — CODEF org code (e.g. "0004")
 *   businessType  "BK"|"CD"
 *   loginType     "1"     — ID/PW only for now
 *   bankId        string  — user's login ID at the bank/card portal
 *   bankPassword  string  — plain-text password (encrypted before leaving server)
 *   accountName   string? — user-defined display label
 *   accountNum    string? — bank account number (required for BK)
 *
 * Response 201: { account, success: true }
 * Response 4xx/5xx: { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import { registerAccount } from "@/lib/wallet/codef/client";
import { findOrganization } from "@/lib/wallet/codef/organizations";

type SessionUser = { id: string };

// ---------------------------------------------------------------------------
// Request body shape
// ---------------------------------------------------------------------------

interface ConnectBody {
  organization?: string;
  businessType?: "BK" | "CD";
  loginType?: "1" | "0";
  bankId?: string;
  bankPassword?: string;
  accountName?: string;
  accountNum?: string;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ConnectBody;
  try {
    body = (await req.json()) as ConnectBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { organization, businessType, loginType = "1", bankId, bankPassword, accountName, accountNum } = body;

  // Validate required fields
  if (!organization || !businessType || !bankId || !bankPassword) {
    return NextResponse.json(
      { error: "organization, businessType, bankId, bankPassword are required" },
      { status: 400 },
    );
  }

  const org = findOrganization(organization);
  if (!org) {
    return NextResponse.json({ error: `Unknown organization code: ${organization}` }, { status: 400 });
  }

  if (businessType === "BK" && !accountNum) {
    return NextResponse.json({ error: "accountNum is required for bank accounts" }, { status: 400 });
  }

  try {
    // Call CODEF — password is RSA-encrypted inside registerAccount()
    const connectedId = await registerAccount({
      organization,
      businessType,
      loginType,
      id: bankId,
      password: bankPassword,
    });

    // Build a readable display name for the account
    const label = accountName?.trim()
      ? `[연동] ${org.name} (${accountName.trim()})`
      : `[연동] ${org.name}`;

    const accountType = businessType === "BK" ? "BANK" : "CARD";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const account = await (prisma.account.create as any)({
      data: {
        userId,
        name: label,
        type: accountType,
        balance: 0,
        currency: "KRW",
        icon: organization,         // store org code in icon field for UI lookup
        color: org.color ?? null,
        isActive: true,
        // CODEF fields — added in schema but Prisma client needs regeneration
        codefConnectedId: connectedId,
        codefOrgCode: organization,
        codefAccountNum: accountNum ?? null,
      },
    });

    return NextResponse.json({ account, success: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    // Surface CODEF error messages directly to help with diagnosis
    const status = message.startsWith("CODEF") ? 422 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
