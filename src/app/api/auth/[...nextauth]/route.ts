/**
 * NextAuth.js catch-all route handler for the App Router.
 *
 * Delegates all GET and POST requests under /api/auth/* to NextAuth.
 */
import NextAuth from "next-auth";
import { authOptions } from "@/lib/wallet/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
