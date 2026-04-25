"use client";

/**
 * Thin wrapper around next-auth SessionProvider.
 *
 * Required because SessionProvider is a client component that must sit
 * above any component that calls useSession(). Place this in the root
 * layout so the session is available app-wide.
 */
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
