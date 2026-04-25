"use client";

/**
 * usePaymentAdvisor
 *
 * Fetches payment method recommendations from /api/payment-advisor.
 * Input is debounced (400ms) to avoid excessive requests while typing.
 */
import { useState, useEffect, useRef } from "react";
import type {
  PaymentAdvisorResponse,
  PaymentRecommendation,
} from "@/app/api/payment-advisor/route";

interface UsePaymentAdvisorOptions {
  merchant?: string;
  category?: string;
  amount?: number;
}

interface UsePaymentAdvisorResult {
  recommendations: PaymentRecommendation[];
  isLoading: boolean;
  error: string | null;
}

const DEBOUNCE_MS = 400;

export function usePaymentAdvisor({
  merchant,
  category,
  amount,
}: UsePaymentAdvisorOptions): UsePaymentAdvisorResult {
  const [recommendations, setRecommendations] = useState<
    PaymentRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track the latest abort controller so we can cancel stale requests
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending debounce
    if (timerRef.current) clearTimeout(timerRef.current);

    // Nothing to search
    if (!merchant && !category) {
      setRecommendations([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);

    timerRef.current = setTimeout(async () => {
      // Abort the previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams();
        if (merchant) params.set("merchant", merchant);
        if (category) params.set("category", category);
        if (amount && amount > 0) params.set("amount", String(amount));

        const res = await fetch(`/api/payment-advisor?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? "혜택 정보를 불러오지 못했습니다.");
          setRecommendations([]);
        } else {
          const data: PaymentAdvisorResponse = await res.json();
          setRecommendations(data.recommendations);
          setError(null);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("네트워크 오류가 발생했습니다.");
          setRecommendations([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchant, category, amount]);

  return { recommendations, isLoading, error };
}
