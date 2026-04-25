/**
 * CODEF authentication constants.
 *
 * Safe to import in both server and client code — no Node.js APIs used.
 */

/** CODEF loginType codes for supported authentication methods. */
export const LOGIN_TYPES = {
  CERT: "0",
  ID_PW: "1",
  FIN_CERT: "2",
  PASS: "5",
  KAKAO: "6",
  NAVER: "7",
  PAYCO: "8",
  TOSS: "9",
  SAMSUNG: "10",
} as const;

/** Mobile carrier codes used when loginType is PASS (5). */
export const TELECOMS = [
  { code: "0", name: "SKT" },
  { code: "1", name: "KT" },
  { code: "2", name: "LG U+" },
  { code: "3", name: "SKT 알뜰폰" },
  { code: "4", name: "KT 알뜰폰" },
  { code: "5", name: "LG 알뜰폰" },
] as const;
