"use client";

/**
 * AdvisorSearch
 *
 * Search panel for the payment advisor page.
 * Includes a merchant name input with autocomplete suggestions,
 * a category dropdown, and an optional amount input.
 */
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import { cn } from "@/lib/wallet/utils";
import { PAYMENT_BENEFITS, getAvailableCategories } from "@/lib/wallet/payment-benefits";

interface Props {
  onSearch: (params: {
    merchant?: string;
    category?: string;
    amount?: number;
  }) => void;
  className?: string;
}

// Extract unique merchant names for autocomplete
const MERCHANT_SUGGESTIONS = Array.from(
  new Set(
    PAYMENT_BENEFITS.map((b) => b.merchantPattern).filter(Boolean) as string[]
  )
).sort();

export default function AdvisorSearch({ onSearch, className }: Props) {
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = getAvailableCategories();

  const filtered = merchant
    ? MERCHANT_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(merchant.toLowerCase())
      ).slice(0, 8)
    : [];

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch({
      merchant: merchant || undefined,
      category: category || undefined,
      amount: amount ? Number(amount.replace(/\D/g, "")) : undefined,
    });
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      {/* Merchant input with autocomplete */}
      <div className="relative" ref={inputRef}>
        <label className="block text-xs text-gray-500 mb-1">가맹점명</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={merchant}
            onChange={(e) => {
              setMerchant(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="예: 스타벅스, CU, 배달의민족"
            className={cn(inputClass, "pl-9")}
          />
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && filtered.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto">
            {filtered.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700"
                  onClick={() => {
                    setMerchant(s);
                    setShowSuggestions(false);
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Category dropdown */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">카테고리 (선택)</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">전체 카테고리</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Amount input */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">결제 예정 금액 (선택)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₩</span>
          <input
            type="text"
            inputMode="numeric"
            value={amount ? Number(amount.replace(/\D/g, "")).toLocaleString("ko-KR") : ""}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className={cn(inputClass, "pl-7")}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        혜택 찾기
      </Button>
    </form>
  );
}
