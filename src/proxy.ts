/**
 * Next.js 16 proxy (formerly "middleware") for route protection.
 *
 * The file convention was renamed in Next 16 — same shape, same matcher,
 * just lives at src/proxy.ts now. NextAuth's withAuth still works as the
 * default export.
 *
 * Protects /wallet/* dashboard routes only — every other route on
 * smartedu-pick is public and bypasses the auth check entirely.
 * The /wallet/login page itself is excluded so unauthenticated users
 * can reach it.
 */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: "/wallet/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Protect every /wallet/* route except the login page itself.
     * Static assets, API auth handlers, and PWA worker files bypass auth.
     */
    "/wallet/((?!login).*)",
  ],
};
