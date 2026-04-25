"use client";

/**
 * AdvisorWidget
 *
 * Compact widget shown below the merchant name field in the transaction form.
 * Displays top 3 payment recommendations based on the current merchant input.
 * Includes a link to the full advisor page.
 */
import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { usePaymentAdvisor } from "@/hooks/wallet/use-payment-advisor";
import BenefitBadge from "./benefit-badge";
import { cn } from "@/lib/wallet/utils";

interface Props {
  merchantName: string;
  category?: string;
  amount?: number;
  className?: string;
}

export default function AdvisorWidget({
  merchantName,
  category,
  amount,
  className,
}: Props) {
  const { recommendations, isLoading } = usePaymentAdvisor({
    merchant: merchantName || undefined,
    category,
    amount,
  });

  // Only render when there's a merchant name
  if (!merchantName) return null;

  const top3 = recommendations.slice(0, 3);

  return (
    <div
      className={cn(
        "rounded-xl border border-indigo-100 bg-indigo-50 p-3 space-y-2",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-indigo-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">최적 결제수단</span>
        </div>
        <Link
          href={`/payment-advisor?merchant=${encodeURIComponent(merchantName)}`}
          className="text-[11px] text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5"
        >
          전체 보기 <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-24 rounded-full bg-indigo-200 animate-pulse" />
          ))}
        </div>
      )}

      {/* No results */}
      {!isLoading && top3.length === 0 && (
        <p className="text-xs text-indigo-400">등록된 혜택 정보가 없습니다.</p>
      )}

      {/* Recommendations */}
      {!isLoading && top3.length > 0 && (
        <div className="space-y-1.5">
          {top3.map((rec, i) => (
            <div key={rec.benefit.id} className="flex items-center gap-2">
              {/* Rank */}
              <span className="text-[11px] font-bold text-indigo-400 w-4">
                {i + 1}
              </span>
              {/* Method name */}
              <span className="text-xs font-medium text-gray-700 flex-1 truncate">
                {rec.benefit.paymentMethod}
              </span>
              {/* Badge */}
              <BenefitBadge benefit={rec.benefit} />
              {/* Savings */}
              {amount && rec.savingsAmount > 0 && (
                <span className="text-xs font-semibold text-green-600 shrink-0">
                  -{rec.savingsAmount.toLocaleString("ko-KR")}원
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
