/**
 * Wallet section layout — wraps every /wallet/* route with the providers
 * required by the budget app (auth, theme, SWR, toasts). The dashboard
 * shell (sidebar + header) lives one level deeper in (dashboard)/layout.tsx
 * so that /wallet/login can render without it.
 */
import type { Metadata } from "next";
import { AuthProvider } from "@/components/wallet/auth/auth-provider";
import { ToastProvider } from "@/components/wallet/ui/toast-provider";
import { SWRProvider } from "@/components/wallet/providers/swr-provider";
import { ThemeProvider } from "@/components/wallet/providers/theme-provider";

// Personal finance pages should never appear in search results, even if a
// crawler somehow reaches them. The `noindex` directive belongs in <head>
// — robots.txt only blocks well-behaved crawlers.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SWRProvider>
          <ToastProvider>{children}</ToastProvider>
        </SWRProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
