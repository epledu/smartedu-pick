/**
 * NextAuth.js configuration.
 *
 * Registers Google, Kakao, and Naver OAuth providers and wires up
 * the Prisma adapter for session/account persistence. On first sign-in
 * the createUser event seeds default categories and a cash wallet for
 * the new user.
 */
import NextAuth, { type NextAuthOptions, getServerSession as _getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import prisma from "@/lib/wallet/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/wallet/constants";

const isDev = process.env.NODE_ENV === "development";

// ---------------------------------------------------------------------------
// Kakao provider
// ---------------------------------------------------------------------------

interface KakaoProfile {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

function KakaoProvider(options: OAuthUserConfig<KakaoProfile>): OAuthConfig<KakaoProfile> {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    authorization: "https://kauth.kakao.com/oauth/authorize?scope=profile_nickname,profile_image,account_email",
    token: "https://kauth.kakao.com/oauth/token",
    userinfo: "https://kapi.kakao.com/v2/user/me",
    profile(profile: KakaoProfile) {
      return {
        id: String(profile.id),
        name: profile.kakao_account?.profile?.nickname ?? null,
        email: profile.kakao_account?.email ?? null,
        image: profile.kakao_account?.profile?.profile_image_url ?? null,
      };
    },
    ...options,
  };
}

// ---------------------------------------------------------------------------
// Naver provider
// ---------------------------------------------------------------------------

interface NaverProfile {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email?: string;
    name?: string;
    profile_image?: string;
  };
}

function NaverProvider(options: OAuthUserConfig<NaverProfile>): OAuthConfig<NaverProfile> {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth",
    authorization: "https://nid.naver.com/oauth2.0/authorize",
    token: "https://nid.naver.com/oauth2.0/token",
    userinfo: "https://openapi.naver.com/v1/nid/me",
    profile(profile: NaverProfile) {
      return {
        id: profile.response.id,
        name: profile.response.name ?? null,
        email: profile.response.email ?? null,
        image: profile.response.profile_image ?? null,
      };
    },
    ...options,
  };
}

// ---------------------------------------------------------------------------
// Provider configuration — only register providers with valid credentials
// ---------------------------------------------------------------------------

/**
 * Emit a console warning listing which OAuth providers are missing env vars.
 * Runs at module load time so the developer sees it immediately on startup.
 */
function warnMissingProviders(): void {
  const missing: string[] = [];
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) missing.push("Google");
  if (!process.env.KAKAO_CLIENT_ID || !process.env.KAKAO_CLIENT_SECRET) missing.push("Kakao");
  if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) missing.push("Naver");

  if (missing.length > 0) {
    console.warn(
      `[Auth] The following OAuth providers are NOT configured (missing env vars): ${missing.join(", ")}. ` +
        "See OAUTH_SETUP.md for setup instructions.",
    );
  }
}

warnMissingProviders();

/**
 * Build the providers list conditionally — only include providers that have
 * both CLIENT_ID and CLIENT_SECRET set to avoid NextAuth silent auth failures.
 */
function buildProviders(): NextAuthOptions["providers"] {
  const providers: NextAuthOptions["providers"] = [];

  // Dev-only credentials login — bypasses OAuth for local testing
  if (isDev) {
    providers.push(
      CredentialsProvider({
        name: "Dev Login",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "demo@smartbudget.app" },
        },
        async authorize(credentials) {
          if (!credentials?.email) return null;
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          return user;
        },
      }),
    );
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    );
  }

  if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
    providers.push(
      KakaoProvider({
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
      }),
    );
  }

  if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
    providers.push(
      NaverProvider({
        clientId: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
      }),
    );
  }

  return providers;
}

// ---------------------------------------------------------------------------
// AuthOptions
// ---------------------------------------------------------------------------

/**
 * User provisioning on first sign-in.
 * PrismaAdapter removed for Neon PgBouncer compatibility — we handle user
 * creation manually in the signIn callback with resilient error handling.
 */
async function provisionUser(profile: {
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { email: profile.email },
    select: { id: true },
  });
  if (existing) return existing.id;

  const user = await prisma.user.create({
    data: {
      email: profile.email,
      name: profile.name ?? null,
      image: profile.image ?? null,
    },
    select: { id: true },
  });

  // Seed default categories and cash wallet (best-effort, non-blocking)
  try {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((cat, idx) => ({
        userId: user.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        isDefault: true,
        sortOrder: idx,
      })),
    });
    await prisma.account.create({
      data: {
        userId: user.id,
        name: "현금",
        type: "CASH",
        balance: 0,
        currency: "KRW",
        color: "#10B981",
        icon: "Wallet",
      },
    });
  } catch (err) {
    console.error("[Auth] Default data seeding failed (non-fatal):", err);
  }

  return user.id;
}

export const authOptions: NextAuthOptions = {
  // PrismaAdapter intentionally removed — handled manually via signIn callback
  // to work around Neon PgBouncer + Prisma prepared-statement incompatibility
  // that caused OAUTH_CALLBACK_HANDLER_ERROR during session persistence.

  providers: buildProviders(),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/wallet/login",
  },

  callbacks: {
    /**
     * Provision the DB user on first sign-in. We previously swallowed errors
     * here to "keep the login flow alive" — but the middleware only checks
     * for token existence, so a missing user.id resulted in a half-logged-in
     * state: /wallet rendered while every /api/* call returned 401.
     *
     * Refusing the sign-in instead surfaces the real error and lets the user
     * retry once the underlying DB issue is resolved.
     */
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        const dbId = await provisionUser({
          email: user.email,
          name: user.name,
          image: user.image,
        });
        user.id = dbId;
        return true;
      } catch (err) {
        console.error("[Auth] provisionUser failed — denying sign-in:", err);
        return false;
      }
    },

    /** Persist user.id in the JWT. */
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user?.email) token.email = user.email;
      return token;
    },

    /** Expose user.id and email in the session object. */
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = (token.email as string) ?? session.user.email;
      }
      return session;
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Typed wrapper around NextAuth getServerSession for App Router usage. */
export function getServerSession() {
  return _getServerSession(authOptions);
}

export default NextAuth(authOptions);
