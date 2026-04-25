"use client";

/**
 * BenefitBadge
 *
 * Small inline badge that displays a payment benefit summary.
 * Color coding:
 *   point    → yellow
 *   cashback → green
 *   discount → blue
 */
import { cn } from "@/lib/wallet/utils";
import type { PaymentBenefit } from "@/lib/wallet/payment-benefits";

interface Props {
  benefit: PaymentBenefit;
  className?: string;
}

const TYPE_STYLES: Record<PaymentBenefit["benefitType"], string> = {
  point: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cashback: "bg-green-100 text-green-800 border-green-200",
  discount: "bg-blue-100 text-blue-800 border-blue-200",
};

const TYPE_LABELS: Record<PaymentBenefit["benefitType"], string> = {
  point: "적립",
  cashback: "캐시백",
  discount: "할인",
};

export default function BenefitBadge({ benefit, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium",
        TYPE_STYLES[benefit.benefitType],
        className
      )}
      title={benefit.conditions}
    >
      <span>{benefit.description}</span>
      <span className="opacity-60">{TYPE_LABELS[benefit.benefitType]}</span>
    </span>
  );
}
