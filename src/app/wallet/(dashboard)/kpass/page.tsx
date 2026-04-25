"use client";

/**
 * K-패스 환급 page.
 *
 * Shows the user's K-Pass transit refund status for the current month,
 * a type selector, history chart, and yearly projection.
 *
 * K-Pass is a Korean government program that refunds transit fares for
 * users who ride public transport 15+ times per month (launched May 2024).
 */
import Link from "next/link";
import { Train, Info, ChevronRight } from "lucide-react";
import KPassProgress from "@/components/wallet/kpass/kpass-progress";
import KPassRefundCard from "@/components/wallet/kpass/kpass-refund-card";
import UserTypeSelector from "@/components/wallet/kpass/user-type-selector";
import KPassHistory from "@/components/wallet/kpass/kpass-history";
import KPassGuide from "@/components/wallet/kpass/kpass-guide";
import { useKPass, useUserType } from "@/hooks/wallet/use-kpass";
import { K_PASS_REFUND_RATES } from "@/lib/wallet/constants";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatWon(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function KPassPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { userType, setUserType } = useUserType();
  const { data, loading, error } = useKPass(year, month, userType);

  const cm = data?.currentMonth;
  const refundRate = K_PASS_REFUND_RATES[userType];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-xl">
          <Train className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">K-패스 환급</h1>
          <p className="text-sm text-gray-500">대중교통 이용 횟수에 따른 정부 환급 프로그램</p>
        </div>
      </div>

      {/* Info banner — explain K-Pass briefly */}
      <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-blue-700 leading-snug">
          <strong>K-패스란?</strong> 월 15회 이상 대중교통 이용 시 결제 금액의 일부를 환급해 주는
          정부 사업입니다. 최대 60회까지 인정되며 유형에 따라 20~53%를 돌려받습니다.
        </p>
      </div>

      {/* User type selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <UserTypeSelector value={userType} onChange={setUserType} />
      </div>

      {/* Loading / error state */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
          데이터를 불러오는 중…
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Refund card */}
      {cm && (
        <KPassRefundCard
          refundAmount={cm.refundAmount}
          isEligible={cm.isEligible}
          remaining={cm.remaining}
          totalSpent={cm.totalSpent}
          refundRate={refundRate}
        />
      )}

      {/* Progress section */}
      {cm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <KPassProgress uses={cm.uses} isEligible={cm.isEligible} />
        </div>
      )}

      {/* Yearly projection */}
      {data?.yearlyProjection !== undefined && data.yearlyProjection > 0 && (
        <div className="bg-indigo-50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-600 font-medium">연간 예상 환급액</p>
            <p className="text-2xl font-bold text-indigo-700 mt-0.5">
              {formatWon(data.yearlyProjection)}
            </p>
          </div>
          <p className="text-xs text-indigo-400 max-w-[140px] text-right">
            최근 6개월 평균 기준 추정치
          </p>
        </div>
      )}

      {/* History */}
      {data?.history && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <KPassHistory history={data.history} />
        </div>
      )}

      {/* Integration guide — expandable accordion */}
      <KPassGuide />

      {/* Link to transport transactions */}
      <Link
        href="/wallet/transactions?categoryName=교통"
        className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 shadow-sm
          hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Train className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">교통 거래 내역 보기</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </Link>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center pb-2">
        환급액은 K-패스 카드사 또는 교통카드 앱에서 지급됩니다. 실제 금액은 다를 수 있습니다.
      </p>
    </div>
  );
}
