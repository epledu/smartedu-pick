/**
 * CODEF 간편인증 (simple / push-notification auth) functions.
 *
 * Implements the two-step flow:
 *  Step 1 — initSimpleAuth: sends push notification to user's phone
 *  Step 2 — completeSimpleAuth: confirms approval after user taps in-app
 *
 * Server-side only — do NOT import in client components.
 */

import { callApi } from "./api";
import { getCodefConfig } from "./config";
export { LOGIN_TYPES, TELECOMS } from "./constants";

// ---------------------------------------------------------------------------
// User-friendly error messages for common CODEF result codes
// ---------------------------------------------------------------------------

/**
 * Translate raw CODEF error codes into actionable Korean messages.
 * Includes the resolved env name so users can verify CODEF_ENV is applied.
 */
function formatCodefError(code: string, message: string): string {
  const cleaned = message.replace(/\+/g, " ").trim();
  const env = getCodefConfig().env;

  switch (code) {
    case "CF-04000":
      return (
        `${cleaned} [env=${env}, code=${code}]\n\n` +
        `[해결 방법]\n` +
        `1. Sandbox 환경에서는 본인 정보가 아닌 다음 가상 계정으로 시도해보세요:\n` +
        `   • 이름: 홍길동\n` +
        `   • 생년월일: 19900101\n` +
        `   • 휴대폰: 01012345678\n` +
        `   • 통신사: SKT\n\n` +
        `2. Demo 환경이면 위 안내 무시 — Demo는 실제 인증 차단됨.\n\n` +
        `3. 정식버전(Production)이면 본인 정보 + 폰에 인증 앱이 켜져 있어야 함.`
      );
    case "CF-03002":
      return `${cleaned} 폰에서 인증을 완료한 뒤 '인증 완료' 버튼을 눌러주세요. (${code})`;
    case "CF-12100":
    case "CF-12101":
      return `인증 시간이 초과되었습니다. 다시 시도해주세요. (${code})`;
    default:
      return `${cleaned} [env=${env}, code=${code}]`;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Input fields required to initiate a simple auth push request. */
export interface SimpleAuthInitInput {
  organization: string;
  businessType: "BK" | "CD";
  /** loginType from LOGIN_TYPES — e.g. LOGIN_TYPES.KAKAO */
  loginType: string;
  userName: string;
  /** "1" = male, "2" = female (from 주민번호 7th digit) */
  userGender: "1" | "2";
  /** YYYYMMDD */
  birthDate: string;
  /** Mobile number without dashes */
  phoneNo: string;
  /** Carrier code from TELECOMS (required for PASS) */
  telecom: string;
}

/** State token returned when CODEF is waiting for phone approval. */
export interface SimpleAuthPending {
  pending: true;
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: number;
  /** Echo of the original request — required for Step 2 body reconstruction. */
  input: SimpleAuthInitInput;
}

/** Returned when CODEF auto-confirms without a 2-way step. */
export interface SimpleAuthSuccess {
  pending: false;
  connectedId: string;
}

// ---------------------------------------------------------------------------
// Step 1 — initiate
// ---------------------------------------------------------------------------

/**
 * Send a push notification to the user's chosen app (Kakao, PASS, Toss, etc.).
 * Returns a pending state token or an immediate connectedId.
 */
export async function initSimpleAuth(
  input: SimpleAuthInitInput,
): Promise<SimpleAuthPending | SimpleAuthSuccess> {
  const response = await callApi<{
    result: { code: string; message: string };
    data: {
      continue2Way?: boolean;
      jobIndex?: number;
      threadIndex?: number;
      jti?: string;
      twoWayTimestamp?: number;
      connectedId?: string;
    };
  }>("/v1/account/create", {
    accountList: [
      {
        countryCode: "KR",
        businessType: input.businessType,
        clientType: "P",
        organization: input.organization,
        loginType: input.loginType,
        loginTypeLevel: "1",
        id: "",
        password: "",
        userName: input.userName,
        userGender: input.userGender,
        birthDate: input.birthDate,
        phoneNo: input.phoneNo,
        telecom: input.telecom,
      },
    ],
  });

  // CF-03002 — waiting for user to approve on their device
  if (response.result.code === "CF-03002" && response.data.continue2Way) {
    return {
      pending: true,
      jobIndex: response.data.jobIndex ?? 0,
      threadIndex: response.data.threadIndex ?? 0,
      jti: response.data.jti ?? "",
      twoWayTimestamp: response.data.twoWayTimestamp ?? 0,
      input,
    };
  }

  // CF-00000 with connectedId — provider auto-confirmed (rare)
  if (response.result.code === "CF-00000" && response.data.connectedId) {
    return { pending: false, connectedId: response.data.connectedId };
  }

  throw new Error(formatCodefError(response.result.code, response.result.message));
}

// ---------------------------------------------------------------------------
// Step 2 — complete
// ---------------------------------------------------------------------------

/**
 * Re-call the same endpoint with 2-way markers after the user approves.
 * Returns the connectedId on success.
 */
export async function completeSimpleAuth(pending: SimpleAuthPending): Promise<string> {
  const response = await callApi<{
    result: { code: string; message: string };
    data: { connectedId?: string };
  }>("/v1/account/create", {
    accountList: [
      {
        countryCode: "KR",
        businessType: pending.input.businessType,
        clientType: "P",
        organization: pending.input.organization,
        loginType: pending.input.loginType,
        loginTypeLevel: "1",
        id: "",
        password: "",
        userName: pending.input.userName,
        userGender: pending.input.userGender,
        birthDate: pending.input.birthDate,
        phoneNo: pending.input.phoneNo,
        telecom: pending.input.telecom,
        is2Way: true,
        simpleAuth: "1",
        jobIndex: pending.jobIndex,
        threadIndex: pending.threadIndex,
        jti: pending.jti,
        twoWayTimestamp: pending.twoWayTimestamp,
      },
    ],
  });

  if (response.result.code !== "CF-00000" || !response.data.connectedId) {
    throw new Error(`CODEF: ${response.result.message} (${response.result.code})`);
  }

  return response.data.connectedId;
}
