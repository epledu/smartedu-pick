/**
 * NextAuth.js middleware for route protection.
 *
 * Protects /wallet/* dashboard routes only — every other route on
 * smartedu-pick is public and bypasses the auth check entirely.
 * The /wallet/login page itself is excluded so unauthenticated users
 * can reach it.
 */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
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
