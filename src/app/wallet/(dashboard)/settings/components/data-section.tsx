"use client";

/**
 * DataSection — data management actions: JSON export, date-range delete,
 * full data reset, and account deletion.
 *
 * Destructive actions require the user to type "전체삭제" to confirm.
 *
 * IMPORTANT: "전체 데이터 초기화" and "계정 삭제" are intentionally
 * separate operations with separate API modes:
 *   - reset  → DELETE /api/user/delete?mode=data    (keeps User record)
 *   - account → DELETE /api/user/delete?mode=account (removes User record)
 */
import { useState } from "react";
import Link from "next/link";
import { Download, Trash2, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/wallet/ui/card";
import { signOut } from "next-auth/react";

type ModalType = "range" | "reset" | "account" | null;

export default function DataSection() {
  const [modal, setModal] = useState<ModalType>(null);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleExportJson = async () => {
    try {
      const res = await fetch("/api/user/export-all");
      if (!res.ok) { setMessage("내보내기 실패"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wallet-diary-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { setMessage("네트워크 오류"); }
  };

  const openModal = (type: ModalType) => {
    setConfirmText("");
    setMessage("");
    setModal(type);
  };

  const closeModal = () => { setModal(null); setConfirmText(""); };

  /**
   * Reset all user data (transactions, budgets, etc.) but keep the account.
   * Calls mode=data so the User record is NOT deleted.
   * After success the page is refreshed so the user sees an empty state.
   */
  const handleResetData = async () => {
    if (confirmText !== "전체삭제") return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/delete?mode=data", {
        method: "DELETE",
        headers: { "X-Confirm-Delete": "yes" },
      });
      if (res.ok) {
        // Stay logged in — just reload so the UI reflects the empty state
        window.location.reload();
      } else {
        const data = await res.json();
        setMessage(data.error ?? "초기화 실패");
      }
    } catch { setMessage("네트워크 오류"); }
    finally { setLoading(false); }
  };

  /**
   * Delete the entire account including the User record.
   * Calls mode=account, then signs the user out.
   */
  const handleDeleteAccount = async () => {
    if (confirmText !== "전체삭제") return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/delete?mode=account", {
        method: "DELETE",
        headers: { "X-Confirm-Delete": "yes" },
      });
      if (res.ok) {
        await signOut({ callbackUrl: "/wallet/login" });
      } else {
        const data = await res.json();
        setMessage(data.error ?? "삭제 실패");
      }
    } catch { setMessage("네트워크 오류"); }
    finally { setLoading(false); }
  };

  // Pick the correct handler based on which modal is open
  const handleConfirm = modal === "reset" ? handleResetData : handleDeleteAccount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-800">데이터 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {message && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{message}</p>
        )}

        {/* JSON export */}
        <ActionRow
          icon={<Download className="w-4 h-4" />}
          label="전체 데이터 내보내기 (JSON)"
          desc="모든 거래, 카테고리, 계좌, 예산 등을 JSON 파일로 다운로드합니다."
          buttonLabel="내보내기"
          buttonClass="bg-amber-500 hover:bg-amber-600 text-white"
          onClick={handleExportJson}
        />

        {/* Excel export (link to reports page) */}
        <div className="flex items-start justify-between py-3 border-b border-gray-100">
          <div className="flex gap-3">
            <FileSpreadsheet className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">전체 데이터 내보내기 (Excel)</p>
              <p className="text-xs text-gray-500 mt-0.5">리포트 페이지에서 엑셀 형식으로 내보냅니다.</p>
            </div>
          </div>
          <Link href="/wallet/reports"
            className="shrink-0 px-3 py-1.5 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100">
            리포트로 이동
          </Link>
        </div>

        {/* Range delete */}
        <ActionRow
          icon={<Trash2 className="w-4 h-4" />}
          label="특정 기간 데이터 삭제"
          desc="선택한 기간의 거래 내역을 삭제합니다."
          buttonLabel="선택 삭제"
          buttonClass="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200"
          onClick={() => openModal("range")}
        />

        {/* Full data reset — account is KEPT */}
        <ActionRow
          icon={<AlertTriangle className="w-4 h-4" />}
          label="전체 데이터 초기화"
          desc="모든 거래, 예산, 목표 데이터를 삭제합니다. 계정과 로그인 정보는 유지됩니다."
          buttonLabel="전체 초기화"
          buttonClass="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
          onClick={() => openModal("reset")}
          danger
        />

        {/* Account delete — User record is removed */}
        <ActionRow
          icon={<Trash2 className="w-4 h-4" />}
          label="계정 삭제"
          desc="계정과 모든 데이터가 영구 삭제됩니다. 로그인 정보도 함께 삭제됩니다."
          buttonLabel="계정 삭제"
          buttonClass="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => openModal("account")}
          danger
        />
      </CardContent>

      {/* Confirmation modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            {modal === "range" ? (
              <RangeDeleteForm onCancel={closeModal} />
            ) : (
              <DestructiveConfirm
                title={modal === "reset" ? "전체 데이터 초기화" : "계정 삭제"}
                description={
                  modal === "reset"
                    ? "모든 거래, 예산, 목표 데이터를 삭제합니다. 계정과 로그인 정보는 유지됩니다. 계속하려면 아래에 「전체삭제」를 입력하세요."
                    : "계정과 모든 데이터가 영구 삭제됩니다. 로그인 정보도 함께 삭제됩니다. 계속하려면 아래에 「전체삭제」를 입력하세요."
                }
                keyword="전체삭제"
                value={confirmText}
                onChange={setConfirmText}
                loading={loading}
                onConfirm={handleConfirm}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ActionRow({ icon, label, desc, buttonLabel, buttonClass, onClick, danger }: {
  icon: React.ReactNode; label: string; desc: string;
  buttonLabel: string; buttonClass: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between py-3 border-b border-gray-100 last:border-0`}>
      <div className="flex gap-3">
        <span className={`mt-0.5 shrink-0 ${danger ? "text-red-400" : "text-gray-400"}`}>{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
      </div>
      <button onClick={onClick}
        className={`shrink-0 ml-3 px-3 py-1.5 text-sm rounded-lg transition-colors ${buttonClass}`}>
        {buttonLabel}
      </button>
    </div>
  );
}

function RangeDeleteForm({ onCancel }: { onCancel: () => void }) {
  return (
    <>
      <h3 className="text-base font-semibold text-gray-800">특정 기간 데이터 삭제</h3>
      <p className="text-sm text-gray-500">해당 기간의 거래 내역이 영구 삭제됩니다.</p>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500">시작일</label>
          <input type="date" className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">종료일</label>
          <input type="date" className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
        ※ 이 기능은 준비 중입니다. 곧 지원 예정입니다.
      </p>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">닫기</button>
      </div>
    </>
  );
}

function DestructiveConfirm({ title, description, keyword, value, onChange, loading, onConfirm, onCancel }: {
  title: string; description: string; keyword: string; value: string;
  onChange: (v: string) => void; loading: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`「${keyword}」 입력`}
        className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
      />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">취소</button>
        <button
          onClick={onConfirm}
          disabled={value !== keyword || loading}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "처리 중..." : "확인"}
        </button>
      </div>
    </>
  );
}
