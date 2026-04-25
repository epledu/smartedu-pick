"use client";

/**
 * ProfileSection — displays and allows inline editing of the user's display name.
 * Avatar is sourced from session.user.image; email is read-only.
 */
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { User, Pencil, Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/wallet/ui/card";

export default function ProfileSection() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "저장 실패");
        return;
      }
      // Refresh session so header reflects new name
      await update({ name: name.trim() });
      setSavedAt(new Date().toLocaleString("ko-KR"));
      setEditing(false);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name ?? "");
    setError("");
    setEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-amber-800">프로필</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          {user?.image ? (
            <Image
              src={user.image}
              alt="프로필 사진"
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-amber-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-200">
              <User className="w-8 h-8 text-amber-400" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{user?.name ?? "사용자"}</p>
            <p className="text-sm text-gray-500">{user?.email ?? ""}</p>
          </div>
        </div>

        {/* Editable name row */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">이름</label>
          {editing ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                maxLength={50}
                placeholder="이름 입력"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                aria-label="저장"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                aria-label="취소"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <span className="flex-1 text-sm text-gray-800 border border-transparent px-3 py-2">
                {user?.name ?? "-"}
              </span>
              <button
                onClick={() => { setName(user?.name ?? ""); setEditing(true); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 border border-amber-200"
              >
                <Pencil className="w-3.5 h-3.5" />
                프로필 수정
              </button>
            </div>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">이메일</label>
          <p className="text-sm text-gray-500 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            {user?.email ?? "-"}
          </p>
        </div>

        {savedAt && (
          <p className="text-xs text-gray-400">마지막 저장: {savedAt}</p>
        )}
      </CardContent>
    </Card>
  );
}
