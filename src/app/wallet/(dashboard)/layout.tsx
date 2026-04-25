/**
 * Dashboard shell layout.
 *
 * Authentication is handled by middleware — this layout renders the
 * sidebar + header chrome around page content.
 *
 * Mobile: header + bottom nav, sidebar as a slide-in drawer.
 * Desktop (lg+): persistent left sidebar + header.
 * Main content padding: p-3 on mobile, p-6 on desktop.
 */
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/wallet/layout/header";
import Sidebar from "@/components/wallet/layout/sidebar";
import MobileBottomNav from "@/components/wallet/layout/mobile-bottom-nav";
import InstallPrompt from "@/components/wallet/pwa/install-prompt";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="wallet-shell flex h-screen overflow-hidden">
      {/* PWA install banner — rendered above all content */}
      <InstallPrompt />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          user={session?.user}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />

        {/* Main scrollable area — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 md:p-5 lg:p-6 bg-gray-50 dark:bg-[#1a1411] pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Fixed bottom navigation — mobile only */}
      <MobileBottomNav onMoreClick={() => setSidebarOpen(true)} />
    </div>
  );
}
