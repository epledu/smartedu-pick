/**
 * GET /api/codef/organizations
 *
 * Returns the list of Korean financial institutions supported by CODEF.
 * Used by the bank-picker UI to display the selection grid.
 */

import { NextResponse } from "next/server";
import { ORGANIZATIONS } from "@/lib/wallet/codef/organizations";

export async function GET() {
  return NextResponse.json(ORGANIZATIONS);
}
