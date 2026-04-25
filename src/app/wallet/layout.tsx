/**
 * Wallet section layout — wraps every /wallet/* route with the providers
 * required by the budget app (auth, theme, SWR, toasts). The dashboard
 * shell (sidebar + header) lives one level deeper in (dashboard)/layout.tsx
 * so that /wallet/login can render without it.
 */
import { AuthProvider } from "@/components/wallet/auth/auth-provider";
import { ToastProvider } from "@/components/wallet/ui/toast-provider";
import { SWRProvider } from "@/components/wallet/providers/swr-provider";
import { ThemeProvider } from "@/components/wallet/providers/theme-provider";

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
