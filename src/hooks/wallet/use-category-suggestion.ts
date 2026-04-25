"use client";
/**
 * use-category-suggestion.ts
 *
 * React hook that fetches a category suggestion from the API based on merchant
 * and memo input. Requests are debounced (350 ms) to avoid firing on every keystroke.
 * In-flight requests are aborted when new input arrives.
 */
import { useEffect, useState, useRef } from "react";

export interface CategorySuggestion {
  categoryId: string;
  categoryName: string;
  confidence: number;
  source: "user-history" | "builtin" | "fallback";
  sampleSize?: number;
}

const DEBOUNCE_MS = 350;
const MIN_INPUT_LEN = 2;

/**
 * Fetch a category suggestion based on merchant/memo input.
 *
 * @param merchant - Merchant name field value
 * @param memo     - Optional memo field value
 * @returns { suggestion, loading }
 */
export function useCategorySuggestion(
  merchant: string,
  memo: string = ""
) {
  const [suggestion, setSuggestion] = useState<CategorySuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const lastReq = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = (merchant + " " + memo).trim();

    // Clear suggestion when input is too short
    if (trimmed.length < MIN_INPUT_LEN) {
      setSuggestion(null);
      return;
    }

    // Debounce the fetch
    const handle = setTimeout(() => {
      // Abort any pending request
      lastReq.current?.abort();
      const ctrl = new AbortController();
      lastReq.current = ctrl;
      setLoading(true);

      const params = new URLSearchParams();
      if (merchant) params.set("merchant", merchant);
      if (memo) params.set("memo", memo);

      fetch(`/api/categories/suggest?${params}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => setSuggestion(data.suggestion ?? null))
        .catch(() => {
          // Silently ignore abort errors and transient network failures
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [merchant, memo]);

  return { suggestion, loading };
}
