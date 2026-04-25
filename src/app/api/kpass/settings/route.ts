/**
 * GET /api/kpass/settings
 *
 * Returns the default K-Pass settings.
 * userType is managed client-side in localStorage; this endpoint
 * provides the list of available types and their refund rates so the
 * frontend can render options without hard-coding them.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/wallet/auth";
import { K_PASS_REFUND_RATES } from "@/lib/wallet/constants";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    defaultUserType: "regular",
    userTypes: [
      {
        value: "regular",
        label: "일반",
        description: "만 19세 미만 또는 만 34세 초과",
        refundRate: K_PASS_REFUND_RATES.regular,
        refundPercent: 20,
      },
      {
        value: "youth",
        label: "청년",
        description: "만 19세 이상 ~ 만 34세 이하",
        refundRate: K_PASS_REFUND_RATES.youth,
        refundPercent: 30,
      },
      {
        value: "low_income",
        label: "저소득층",
        description: "기초생활수급자 또는 차상위계층",
        refundRate: K_PASS_REFUND_RATES.low_income,
        refundPercent: 53,
      },
    ],
  });
}
