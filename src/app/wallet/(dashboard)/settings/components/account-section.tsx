"use client";

/**
 * AccountSection — shows account stats, signed-in provider info, and logout action.
 * Fetches aggregate stats from /api/user/stats on mount.
 */
import { useEffect, useState } from "react";
import { LogOut, CalendarDays, ArrowLeftRight, Tag, Wallet } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/wallet/ui/card";

interface UserStats {
  transactionCount: number;
  categoryCount: number;
  accountCount: number;
  memberSince: string | null;
}

/** Map NextAuth provider IDs to human-readable Korean labels. */
const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  kakao: "카카오",
  naver: "네이버",
  credentials: "개발 계정 (Credentials)",
};

export default function AccountSection() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Derive the provider label from the session token sub or provider hint.
  // NextAuth does not expose provider id directly in session, so we use a
  // heuristic: credentials sessions have no image and a fixed email domain.
  const providerLabel = (() => {
    if (!session?.user) return null;
    const email = session.user.email ?? "";
    if (email === "demo@smartbudget.app") return PROVIDER_LABELS["credentials"];
    // Fall back to a generic "소셜 로그인" label when provider is unknown
    return "소셜 로그인";
  })();

  useEffect(() => {
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {/* silently fail */})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/auth/signin" });
  };

  const memberSinceFormatted = stats?.memberSince
    ? new Date(stats.memberSince).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-800">계정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Signed-in provider info */}
        {providerLabel && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" aria-hidden="true" />
            <span>{providerLabel} 계정으로 로그인됨</span>
          </div>
        )}

        {/* Account creation date */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <CalendarDays className="w-4 h-4 text-amber-500 shrink-0" />
          <span>가입일: {loading ? "불러오는 중..." : memberSinceFormatted}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<ArrowLeftRight className="w-4 h-4 text-amber-500" />}
            label="총 거래"
            value={loading ? "-" : `${stats?.transactionCount ?? 0}건`}
          />
          <StatCard
            icon={<Tag className="w-4 h-4 text-amber-500" />}
            label="카테고리"
            value={loading ? "-" : `${stats?.categoryCount ?? 0}개`}
          />
          <StatCard
            icon={<Wallet className="w-4 h-4 text-amber-500" />}
            label="계좌"
            value={loading ? "-" : `${stats?.accountCount ?? 0}개`}
          />
        </div>

        {/* Data usage note */}
        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
          데이터 사용량: 클라우드 기반 저장 (용량 제한 없음)
        </div>

        {/* Logout */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2.5 w-full justify-center bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 bg-amber-50 rounded-xl border border-amber-100">
      {icon}
      <span className="text-base font-bold text-gray-800">{value}</span>
      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  );
}
