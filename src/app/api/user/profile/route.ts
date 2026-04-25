/**
 * /api/user/profile
 *
 * GET - Return current user's profile information.
 * PUT - Update the user's display name.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/wallet/prisma";
import { getServerSession } from "@/lib/wallet/auth";

type SessionUser = { id: string; name?: string | null; email?: string | null };

// ---------------------------------------------------------------------------
// GET /api/user/profile
// ---------------------------------------------------------------------------

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as SessionUser;

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  });

  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

// ---------------------------------------------------------------------------
// PUT /api/user/profile
// ---------------------------------------------------------------------------

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as SessionUser;

  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name || name.length < 1 || name.length > 50) {
    return NextResponse.json(
      { error: "이름은 1~50자 사이여야 합니다." },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name },
    select: { id: true, name: true, email: true, image: true, updatedAt: true },
  });

  return NextResponse.json(updated);
}
