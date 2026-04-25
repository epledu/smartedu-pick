/**
 * Korean bank and card organization codes for CODEF API.
 *
 * Each organization has a CODEF-assigned numeric code used in API requests,
 * along with metadata for the UI (name, type, brand color).
 */

/** A single bank or card company supported by CODEF. */
export interface Organization {
  /** CODEF organization code (e.g. "0004" for KB국민은행). */
  code: string;
  /** Display name in Korean. */
  name: string;
  /** BK = 은행, CD = 카드사. */
  type: "BK" | "CD";
  /** Supported login methods: "1" = ID/PW, "0" = 공동인증서. */
  loginTypes: ("1" | "0")[];
  /** Brand color for UI rendering (hex). */
  color?: string;
}

/** Complete list of supported Korean financial institutions. */
export const ORGANIZATIONS: Organization[] = [
  // ── Banks ────────────────────────────────────────────────────────────────
  { code: "0004", name: "KB국민은행",   type: "BK", loginTypes: ["1"], color: "#FFB300" },
  { code: "0088", name: "신한은행",     type: "BK", loginTypes: ["1"], color: "#0050A0" },
  { code: "0020", name: "우리은행",     type: "BK", loginTypes: ["1"], color: "#0067AC" },
  { code: "0081", name: "하나은행",     type: "BK", loginTypes: ["1"], color: "#008C95" },
  { code: "0011", name: "NH농협은행",   type: "BK", loginTypes: ["1"], color: "#019B41" },
  { code: "0003", name: "IBK기업은행",  type: "BK", loginTypes: ["1"], color: "#0070B8" },
  { code: "0090", name: "카카오뱅크",   type: "BK", loginTypes: ["1"], color: "#FFE600" },
  { code: "0092", name: "토스뱅크",     type: "BK", loginTypes: ["1"], color: "#0064FF" },
  { code: "0023", name: "SC제일은행",   type: "BK", loginTypes: ["1"], color: "#1D4F8C" },

  // ── Card companies ────────────────────────────────────────────────────────
  { code: "0301", name: "삼성카드",     type: "CD", loginTypes: ["1"], color: "#1428A0" },
  { code: "0306", name: "신한카드",     type: "CD", loginTypes: ["1"], color: "#0050A0" },
  { code: "0302", name: "현대카드",     type: "CD", loginTypes: ["1"], color: "#000000" },
  { code: "0303", name: "롯데카드",     type: "CD", loginTypes: ["1"], color: "#E60012" },
  { code: "0307", name: "하나카드",     type: "CD", loginTypes: ["1"], color: "#008C95" },
  { code: "0304", name: "BC카드",       type: "CD", loginTypes: ["1"], color: "#E50019" },
  { code: "0309", name: "NH농협카드",   type: "CD", loginTypes: ["1"], color: "#019B41" },
];

/**
 * Find an organization by its CODEF code.
 * Returns undefined when the code is not in the list.
 */
export function findOrganization(code: string): Organization | undefined {
  return ORGANIZATIONS.find((o) => o.code === code);
}

/** Return all banks only. */
export function getBanks(): Organization[] {
  return ORGANIZATIONS.filter((o) => o.type === "BK");
}

/** Return all card companies only. */
export function getCardCompanies(): Organization[] {
  return ORGANIZATIONS.filter((o) => o.type === "CD");
}
