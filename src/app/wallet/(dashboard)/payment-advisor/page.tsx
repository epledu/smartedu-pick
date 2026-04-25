"use client";

/**
 * PaymentAdvisorPage
 *
 * Full-page view for the payment method advisor feature.
 * Lets users search by merchant or category and view ranked recommendations.
 * Also shows a popular categories grid for quick access.
 */
import { useState } from "react";
import { Sparkles } from "lucide-react";
import AdvisorSearch from "@/components/wallet/payment-advisor/advisor-search";
import PaymentRecommendation from "@/components/wallet/payment-advisor/payment-recommendation";
import { usePaymentAdvisor } from "@/hooks/wallet/use-payment-advisor";

// ---------------------------------------------------------------------------
// Popular category shortcuts
// ---------------------------------------------------------------------------

const POPULAR_CATEGORIES = [
  { label: "편의점", emoji: "🏪" },
  { label: "카페", emoji: "☕" },
  { label: "배달", emoji: "🛵" },
  { label: "마트", emoji: "🛒" },
  { label: "교통", emoji: "🚌" },
  { label: "문화", emoji: "🎬" },
  { label: "쇼핑", emoji: "🛍️" },
  { label: "온라인쇼핑", emoji: "📦" },
];

// ---------------------------------------------------------------------------
// Inner results component — uses the hook
// ---------------------------------------------------------------------------

interface ResultsProps {
  merchant?: string;
  category?: string;
  amount?: number;
}

function AdvisorResults({ merchant, category, amount }: ResultsProps) {
  const { recommendations, isLoading, error } = usePaymentAdvisor({
    merchant,
    category,
    amount,
  });

  if (!merchant && !category) return null;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">💳</p>
        <p className="text-sm">등록된 혜택 정보가 없습니다.</p>
        <p className="text-xs mt-1">다른 가맹점명이나 카테고리를 검색해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">
        {merchant && <span>&ldquo;{merchant}&rdquo;</span>}
        {merchant && category && " · "}
        {category && <span>{category}</span>}
        에 대한 추천 결과 {recommendations.length}개
      </p>
      {recommendations.map((rec) => (
        <PaymentRecommendation
          key={rec.benefit.id}
          recommendation={rec}
          rank={rec.rank}
          amount={amount}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PaymentAdvisorPage() {
  const [searchParams, setSearchParams] = useState<{
    merchant?: string;
    category?: string;
    amount?: number;
  }>({});

  function handleCategoryClick(cat: string) {
    setSearchParams({ category: cat });
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">최적 결제 방법</h1>
        </div>
        <p className="text-sm text-gray-500">
          가맹점별로 포인트 · 캐시백 · 할인 혜택이 가장 큰 결제 수단을 알려드립니다.
        </p>
      </div>

      {/* Search */}
      <AdvisorSearch onSearch={setSearchParams} />

      {/* Popular categories */}
      {!searchParams.merchant && !searchParams.category && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            인기 카테고리
          </p>
          <div className="grid grid-cols-4 gap-2">
            {POPULAR_CATEGORIES.map(({ label, emoji }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleCategoryClick(label)}
                className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-3 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-[11px] text-gray-600 font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <AdvisorResults
        merchant={searchParams.merchant}
        category={searchParams.category}
        amount={searchParams.amount}
      />
    </div>
  );
}
