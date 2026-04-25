/**
 * Internal CODEF HTTP transport layer.
 *
 * Exports getAccessToken and callApi for use within the codef package.
 * Server-side only — do NOT import in client components.
 */

import { getCodefConfig } from "./config";

// ---------------------------------------------------------------------------
// Token cache (module-level — survives across requests in the same process)
// ---------------------------------------------------------------------------

interface TokenCache {
  token: string;
  /** Unix timestamp (ms) after which the token must be refreshed. */
  expires: number;
}

let cachedToken: TokenCache | null = null;

/**
 * Obtain a valid OAuth access token, refreshing from CODEF when expired.
 * Tokens are valid for 10 days; we refresh 1 hour early as a safety buffer.
 */
export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const cfg = getCodefConfig();

  // Defensive validation — surface configuration issues early with a clear message
  if (!cfg.clientId || !cfg.clientSecret) {
    throw new Error(
      `CODEF credentials missing for env="${cfg.env}". ` +
        `Check CODEF_${cfg.env.toUpperCase()}_CLIENT_ID and CODEF_${cfg.env.toUpperCase()}_CLIENT_SECRET.`
    );
  }

  const auth = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");

  const res = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=read",
  });

  if (!res.ok) {
    const body = await res.text();
    // Include partial keys (first 8 chars) in error so we can diagnose env-var mismatches
    // without exposing full secrets.
    const idHint = cfg.clientId.slice(0, 8);
    const secretLen = cfg.clientSecret.length;
    throw new Error(
      `CODEF token error ${res.status} (env=${cfg.env}, clientId=${idHint}..., secretLen=${secretLen}): ${body.slice(0, 200)}`
    );
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  const ONE_HOUR_MS = 3_600_000;

  cachedToken = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 1_000 - ONE_HOUR_MS,
  };

  return cachedToken.token;
}

/**
 * POST a request to CODEF and parse the response.
 *
 * CODEF responses are URL-encoded (Korean characters are percent-encoded),
 * so we decode the raw text before JSON.parse.
 */
export async function callApi<T = unknown>(path: string, body: unknown): Promise<T> {
  const cfg = getCodefConfig();
  const token = await getAccessToken();

  const res = await fetch(`${cfg.baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  // CODEF response is x-www-form-urlencoded:
  //   - "%XX" hex sequences (Korean chars) → decodeURIComponent handles
  //   - "+" → space character (must convert manually before decodeURIComponent)
  const decoded = decodeURIComponent(raw.replace(/\+/g, " "));
  return JSON.parse(decoded) as T;
}
