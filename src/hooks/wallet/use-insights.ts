"use client";

/**
 * useInsights hook — fetches spending insights from the API.
 *
 * Returns loading state, error state, and the sorted insights array.
 * Automatically refetches on component mount.
 */
import { useState, useEffect, useCallback } from "react";
import type { Insight } from "@/lib/wallet/insights";

interface UseInsightsResult {
  insights: Insight[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInsights(): UseInsightsResult {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/insights");
      if (!res.ok) {
        throw new Error(`Failed to fetch insights: ${res.status}`);
      }
      const data: Insight[] = await res.json();
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { insights, isLoading, error, refetch: fetchInsights };
}
