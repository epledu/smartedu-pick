/**
 * RSA password encryption for CODEF API.
 *
 * CODEF requires user passwords to be encrypted with their RSA public key
 * before being sent over the wire. This module handles key parsing and
 * PKCS#1 v1.5 encryption using Node.js built-in crypto.
 */

import crypto from "crypto";
import { getCodefConfig } from "./config";

/**
 * Wrap a raw base64 RSA public key string with PEM headers if missing.
 * CODEF_PUBLIC_KEY may be stored without the BEGIN/END markers.
 */
function toPem(rawKey: string): string {
  if (rawKey.includes("BEGIN PUBLIC KEY")) {
    return rawKey;
  }
  // Insert line breaks every 64 chars to comply with PEM format
  const body = rawKey.replace(/\s/g, "").match(/.{1,64}/g)?.join("\n") ?? rawKey;
  return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
}

/**
 * Encrypt a plain-text password using CODEF's RSA public key.
 *
 * CODEF mandates PKCS#1 v1.5 padding (RSA_PKCS1_PADDING).
 * The result is a base64-encoded ciphertext string.
 *
 * @throws When CODEF_PUBLIC_KEY is not configured.
 */
export function encryptPassword(password: string): string {
  const { publicKey } = getCodefConfig();

  if (!publicKey) {
    throw new Error("CODEF_PUBLIC_KEY is not configured");
  }

  const pem = toPem(publicKey);

  const encrypted = crypto.publicEncrypt(
    { key: pem, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(password, "utf8"),
  );

  return encrypted.toString("base64");
}
