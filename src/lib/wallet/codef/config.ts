/**
 * CODEF API environment configuration.
 *
 * Reads environment variables to determine which CODEF environment to use
 * (demo | sandbox | production) and returns the matching credentials and base URL.
 */

export type CodefEnv = "demo" | "sandbox" | "production";

/** Full CODEF configuration resolved from environment variables. */
export interface CodefConfig {
  env: CodefEnv;
  baseUrl: string;
  tokenUrl: string;
  publicKey: string;
  clientId: string;
  clientSecret: string;
}

const BASE_URLS: Record<CodefEnv, string> = {
  demo: "https://development.codef.io",
  sandbox: "https://sandbox.codef.io",
  production: "https://api.codef.io",
};

/** OAuth token endpoint — same for all environments. */
const TOKEN_URL = "https://oauth.codef.io/oauth/token";

/**
 * Strip whitespace, surrounding quotes, and stray newlines from env var values.
 * Vercel/Windows clipboards sometimes inject these and break OAuth requests
 * with cryptic "No client found" errors.
 */
function clean(value: string | undefined): string {
  if (!value) return "";
  return value
    .trim()
    .replace(/^["']|["']$/g, "") // strip surrounding quotes
    .replace(/[\r\n]+/g, "");      // strip newlines
}

/**
 * Returns the resolved CODEF configuration based on CODEF_ENV environment variable.
 * Falls back to "demo" when CODEF_ENV is not set.
 */
export function getCodefConfig(): CodefConfig {
  const env = (clean(process.env.CODEF_ENV) || "demo") as CodefEnv;

  const credentials: Record<CodefEnv, { clientId: string; clientSecret: string }> = {
    demo: {
      clientId: clean(process.env.CODEF_DEMO_CLIENT_ID),
      clientSecret: clean(process.env.CODEF_DEMO_CLIENT_SECRET),
    },
    sandbox: {
      clientId: clean(process.env.CODEF_SANDBOX_CLIENT_ID),
      clientSecret: clean(process.env.CODEF_SANDBOX_CLIENT_SECRET),
    },
    production: {
      clientId: clean(process.env.CODEF_PROD_CLIENT_ID),
      clientSecret: clean(process.env.CODEF_PROD_CLIENT_SECRET),
    },
  };

  return {
    env,
    baseUrl: BASE_URLS[env],
    tokenUrl: TOKEN_URL,
    publicKey: clean(process.env.CODEF_PUBLIC_KEY),
    ...credentials[env],
  };
}
