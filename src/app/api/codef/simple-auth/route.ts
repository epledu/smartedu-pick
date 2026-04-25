/**
 * POST /api/codef/simple-auth
 *
 * Two-step simple (push) authentication endpoint.
 *
 * Mode is controlled via the `mode` query param:
 *
 *  ?mode=init
 *    Body: { organization, businessType, loginType, userName, birthDate,
 *            phoneNo, telecom, gender, accountName, accountNum? }
 *    Response:
 *      - { status: "pending", token: "<base64>" }  — phone notification sent
 *      - { status: "connected", connectedId }       — auto-confirmed (rare)
 *
 *  ?mode=complete
 *    Body: { token, accountName, accountType, accountNum? }
 *    Response:
 *      - { status: "connected", account }
 *      - { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import prisma from "@/lib/wallet/prisma";
import {
  initSimpleAuth,
  completeSimpleAuth,
  type SimpleAuthPending,
} from "@/lib/wallet/codef/simple-auth";
import { findOrganization } from "@/lib/wallet/codef/organizations";

type SessionUser = { id: string };

// ---------------------------------------------------------------------------
// Request body types
// ---------------------------------------------------------------------------

interface InitBody {
  organization?: string;
  businessType?: "BK" | "CD";
  loginType?: string;
  userName?: string;
  birthDate?: string;
  phoneNo?: string;
  telecom?: string;
  gender?: "1" | "2";
  accountName?: string;
  accountNum?: string;
}

interface CompleteBody {
  token?: string;
  accountName?: string;
  accountType?: "BANK" | "CARD";
  accountNum?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Encode SimpleAuthPending as a base64 JSON string for stateless round-trip. */
function encodePendingToken(pending: SimpleAuthPending): string {
  return Buffer.from(JSON.stringify(pending)).toString("base64");
}

/** Decode the token back into SimpleAuthPending. */
function decodePendingToken(token: string): SimpleAuthPending {
  const json = Buffer.from(token, "base64").toString("utf-8");
  return JSON.parse(json) as SimpleAuthPending;
}

// ---------------------------------------------------------------------------
// Mode: init
// ---------------------------------------------------------------------------

async function handleInit(userId: string, body: InitBody): Promise<NextResponse> {
  const {
    organization,
    businessType,
    loginType,
    userName,
    birthDate,
    phoneNo,
    telecom,
    gender,
    accountNum,
  } = body;

  if (!organization || !businessType || !loginType || !userName || !birthDate || !phoneNo || !telecom || !gender) {
    return NextResponse.json(
      { error: "organization, businessType, loginType, userName, birthDate, phoneNo, telecom, gender are required" },
      { status: 400 },
    );
  }

  const org = findOrganization(organization);
  if (!org) {
    return NextResponse.json({ error: `Unknown organization: ${organization}` }, { status: 400 });
  }

  if (businessType === "BK" && !accountNum) {
    return NextResponse.json({ error: "accountNum is required for bank connections" }, { status: 400 });
  }

  // Suppress unused variable warning — userId is validated upstream
  void userId;

  try {
    const result = await initSimpleAuth({
      organization,
      businessType,
      loginType,
      userName,
      userGender: gender,
      birthDate,
      phoneNo,
      telecom,
    });

    if (result.pending) {
      const token = encodePendingToken(result);
      return NextResponse.json({ status: "pending", token });
    }

    // Auto-confirmed — connectedId returned immediately
    return NextResponse.json({ status: "connected", connectedId: result.connectedId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "CODEF request failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

// ---------------------------------------------------------------------------
// Mode: complete
// ---------------------------------------------------------------------------

async function handleComplete(userId: string, body: CompleteBody): Promise<NextResponse> {
  const { token, accountName, accountType, accountNum } = body;

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  let pending: SimpleAuthPending;
  try {
    pending = decodePendingToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid or malformed token" }, { status: 400 });
  }

  const org = findOrganization(pending.input.organization);
  if (!org) {
    return NextResponse.json({ error: "Organization not found in token" }, { status: 400 });
  }

  try {
    const connectedId = await completeSimpleAuth(pending);

    const resolvedType = accountType ?? (pending.input.businessType === "BK" ? "BANK" : "CARD");
    const label = accountName?.trim()
      ? `[연동] ${org.name} (${accountName.trim()})`
      : `[연동] ${org.name}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const account = await (prisma.account.create as any)({
      data: {
        userId,
        name: label,
        type: resolvedType,
        balance: 0,
        currency: "KRW",
        icon: pending.input.organization,
        color: org.color ?? null,
        isActive: true,
        codefConnectedId: connectedId,
        codefOrgCode: pending.input.organization,
        codefAccountNum: accountNum ?? null,
      },
    });

    return NextResponse.json({ status: "connected", account }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Connection failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = req.nextUrl.searchParams.get("mode");

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (mode === "init") {
    return handleInit(userId, body as InitBody);
  }

  if (mode === "complete") {
    return handleComplete(userId, body as CompleteBody);
  }

  return NextResponse.json({ error: "mode must be 'init' or 'complete'" }, { status: 400 });
}
