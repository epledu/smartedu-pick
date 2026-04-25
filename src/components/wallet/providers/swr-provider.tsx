"use client";

/**
 * SWRProvider — wraps the app with a global SWR configuration.
 *
 * - Provides a shared fetcher so individual hooks don't need to define their own.
 * - Disables revalidateOnFocus globally to prevent unnecessary refetches on tab switch.
 * - Sets a 60s deduping window as a global baseline; individual hooks can override.
 */
import { SWRConfig } from "swr";

/** Default fetch function used by all SWR hooks unless overridden. */
const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Request failed: ${r.status}`);
    return r.json();
  });

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
