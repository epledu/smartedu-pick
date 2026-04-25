/**
 * GET /api/payment-advisor
 *
 * Query params:
 *   merchant  — merchant name (optional)
 *   category  — category name (optional)
 *   amount    — transaction amount in KRW (optional, for savings calculation)
 *
 * Returns a sorted list of payment method recommendations with calculated savings.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  findBestPayment,
  calculateBenefit,
  PaymentBenefit,
} from "@/lib/wallet/payment-benefits";

export interface PaymentRecommendation {
  benefit: PaymentBenefit;
  savingsAmount: number; // calculated savings for given amount
  rank: number;
}

export interface PaymentAdvisorResponse {
  merchant?: string;
  category?: string;
  amount?: number;
  recommendations: PaymentRecommendation[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const merchant = searchParams.get("merchant") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const amountParam = searchParams.get("amount");
  const amount = amountParam ? Number(amountParam) : undefined;

  // Require at least one filter
  if (!merchant && !category) {
    return NextResponse.json(
      { error: "merchant 또는 category 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const benefits = findBestPayment(merchant, category);

  const recommendations: PaymentRecommendation[] = benefits.map(
    (benefit, index) => ({
      benefit,
      savingsAmount: amount ? calculateBenefit(amount, benefit) : 0,
      rank: index + 1,
    })
  );

  const response: PaymentAdvisorResponse = {
    merchant,
    category,
    amount,
    recommendations,
  };

  return NextResponse.json(response);
}
