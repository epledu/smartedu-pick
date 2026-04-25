/**
 * Module augmentation for next-auth to expose `user.id` in Session.
 *
 * NextAuth v4 does not include `id` on Session.user by default.
 * We extend the built-in Session and User interfaces here so TypeScript
 * can resolve `session.user.id` throughout the app.
 */
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
