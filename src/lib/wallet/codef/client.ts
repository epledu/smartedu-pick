/**
 * CODEF API client — account registration and transaction fetching.
 *
 * Handles typed wrappers for the endpoints used by 지갑일기.
 * OAuth token management and HTTP transport live in ./api.ts.
 * Simple (push) auth functions live in ./simple-auth.ts.
 *
 * Server-side only — do NOT import in client components.
 */

import { callApi } from "./api";
import { encryptPassword } from "./encrypt";

// Re-export auth constants (safe for client use) and simple auth functions
export { LOGIN_TYPES, TELECOMS } from "./constants";
export {
  initSimpleAuth,
  completeSimpleAuth,
  type SimpleAuthInitInput,
  type SimpleAuthPending,
  type SimpleAuthSuccess,
} from "./simple-auth";

// ---------------------------------------------------------------------------
// Account registration (ID/PW)
// ---------------------------------------------------------------------------

export interface RegisterAccountInput {
  /** CODEF organization code (e.g. "0004" for KB국민은행). */
  organization: string;
  /** Business type: BK = 은행, CD = 카드사. */
  businessType: "BK" | "CD";
  /** Login method: "1" = ID/PW, "0" = 공동인증서. */
  loginType: "1" | "0";
  /** User's bank login ID. */
  id: string;
  /** User's plain-text password — encrypted internally before sending. */
  password: string;
}

interface RegisterResponse {
  result: { code: string; message: string };
  data: { connectedId?: string };
}

/**
 * Register a bank or card account via ID/PW with CODEF.
 * Returns the connectedId that must be stored for future sync calls.
 *
 * @throws On CODEF API errors or when connectedId is not returned.
 */
export async function registerAccount(input: RegisterAccountInput): Promise<string> {
  const encrypted = encryptPassword(input.password);

  const response = await callApi<RegisterResponse>("/v1/account/create", {
    accountList: [
      {
        countryCode: "KR",
        businessType: input.businessType,
        clientType: "P",
        organization: input.organization,
        loginType: input.loginType,
        id: input.id,
        password: encrypted,
      },
    ],
  });

  if (response.result.code !== "CF-00000") {
    throw new Error(`CODEF: ${response.result.message} (${response.result.code})`);
  }

  if (!response.data?.connectedId) {
    throw new Error("CODEF: connectedId was not returned");
  }

  return response.data.connectedId;
}

// ---------------------------------------------------------------------------
// Card approval list
// ---------------------------------------------------------------------------

export interface CardApproval {
  resApprovalDate: string;    // YYYYMMDD
  resApprovalTime: string;    // HHMMSS
  resApprovalAmount: string;  // integer string (KRW)
  resMemberStoreName: string; // 가맹점명
  resCardName?: string;
  resApprovalNo?: string;
}

interface CardApprovalResponse {
  result: { code: string; message: string };
  data: { resApprovalList?: CardApproval[] };
}

export interface FetchCardParams {
  connectedId: string;
  organization: string;
  startDate: string; // YYYYMMDD
  endDate: string;   // YYYYMMDD
}

/**
 * Fetch approved card transactions for a given date range.
 * Returns an empty array when no approvals exist.
 */
export async function fetchCardApprovals(params: FetchCardParams): Promise<CardApproval[]> {
  const response = await callApi<CardApprovalResponse>(
    "/v1/kr/card/p/account/approval-list",
    {
      connectedId: params.connectedId,
      organization: params.organization,
      startDate: params.startDate,
      endDate: params.endDate,
      orderBy: "0",
      inquiryType: "1",
    },
  );

  if (response.result.code !== "CF-00000") {
    throw new Error(`CODEF card: ${response.result.message} (${response.result.code})`);
  }

  return response.data.resApprovalList ?? [];
}

// ---------------------------------------------------------------------------
// Bank transaction list
// ---------------------------------------------------------------------------

export interface BankTransaction {
  resAccountTrDate: string;     // YYYYMMDD
  resAccountTrTime?: string;    // HHMMSS
  resAccountIn: string;         // 입금액 (integer string)
  resAccountOut: string;        // 출금액 (integer string)
  resAccountDesc1: string;      // 적요 (description)
  resAfterTranBalance: string;  // 거래 후 잔액
}

interface BankTransactionResponse {
  result: { code: string; message: string };
  data: { resTrHistoryList?: BankTransaction[] };
}

export interface FetchBankParams {
  connectedId: string;
  organization: string;
  account: string;   // account number
  startDate: string; // YYYYMMDD
  endDate: string;   // YYYYMMDD
}

/**
 * Fetch bank account transaction history for a given date range.
 * Returns an empty array when no transactions exist.
 */
export async function fetchBankTransactions(params: FetchBankParams): Promise<BankTransaction[]> {
  const response = await callApi<BankTransactionResponse>(
    "/v1/kr/bank/p/account/transaction-list",
    {
      connectedId: params.connectedId,
      organization: params.organization,
      account: params.account,
      startDate: params.startDate,
      endDate: params.endDate,
      orderBy: "0",
      inquiryType: "1",
    },
  );

  if (response.result.code !== "CF-00000") {
    throw new Error(`CODEF bank: ${response.result.message} (${response.result.code})`);
  }

  return response.data.resTrHistoryList ?? [];
}
