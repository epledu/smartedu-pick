"use client";

/**
 * PaymentRecommendation
 *
 * Card that displays a single payment method recommendation.
 * Shows the payment method name, benefit description, and calculated savings.
 * The top-ranked result gets a "#1 추천" badge.
 */
import { cn } from "@/lib/wallet/utils";
import BenefitBadge from "./benefit-badge";
import type { PaymentRecommendation as Recommendation } from "@/app/api/payment-advisor/route";

interface Props {
  recommendation: Recommendation;
  rank: number;
  amount?: number;
  className?: string;
}

// Map well-known payment method names to an emoji icon
function getPaymentIcon(method: string): string {
  if (method.includes("카카오")) return "💛";
  if (method.includes("네이버")) return "💚";
  if (method.includes("삼성")) return "🔵";
  if (method.includes("현대")) return "⚫";
  if (method.includes("신한")) return "🔷";
  if (method.includes("KB") || method.includes("국민")) return "⭐";
  if (method.includes("롯데") || method.includes("L.pay")) return "🔴";
  if (method.includes("SSG") || method.includes("이마트")) return "🟠";
  if (method.includes("우리")) return "🟢";
  if (method.includes("쿠팡") || method.includes("로켓")) return "🛒";
  if (method.includes("스타벅스")) return "☕";
  return "💳";
}

export default function PaymentRecommendation({
  recommendation,
  rank,
  amount,
  className,
}: Props) {
  const { benefit, savingsAmount } = recommendation;
  const isTop = rank === 1;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-xl border p-4 transition-shadow",
        isTop
          ? "border-indigo-300 bg-indigo-50 shadow-sm"
          : "border-gray-200 bg-white hover:shadow-sm",
        className
      )}
    >
      {/* Rank badge */}
      {isTop && (
        <span className="absolute -top-2.5 left-3 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
          #1 추천
        </span>
      )}
      {!isTop && (
        <span className="absolute -top-2.5 left-3 rounded-full bg-gray-400 px-2 py-0.5 text-[10px] font-bold text-white">
          #{rank}
        </span>
      )}

      {/* Payment method icon */}
      <span className="text-2xl leading-none mt-0.5">
        {getPaymentIcon(benefit.paymentMethod)}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {benefit.paymentMethod}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{benefit.description}</p>
        {benefit.conditions && (
          <p className="text-[11px] text-gray-400 mt-0.5">{benefit.conditions}</p>
        )}
        <div className="mt-1.5">
          <BenefitBadge benefit={benefit} />
        </div>
      </div>

      {/* Savings amount (only when amount provided) */}
      {amount && amount > 0 && savingsAmount > 0 && (
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">절약</p>
          <p className="text-sm font-bold text-green-600">
            {savingsAmount.toLocaleString("ko-KR")}원
          </p>
        </div>
      )}
    </div>
  );
}
