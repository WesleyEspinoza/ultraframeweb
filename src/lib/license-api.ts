import { friendlyStripeSessionError } from "@/lib/checkout-session";

export const LICENSE_API_BASE =
  process.env.LICENSE_API_BASE_URL?.replace(/\/$/, "") ||
  "https://api.softwarerefresh.com/ultraframe/api/license";

export type LicenseDevice = {
  machineId: string;
  activatedAt: string;
};

export type RevealedLicense = {
  key: string;
  email: string;
  product: string;
  tier: string;
};

export type LicenseSessionState =
  | "loading"
  | "pending"
  | "already_revealed"
  | "token_received"
  | "error";

export type LicenseSessionResult = {
  state: LicenseSessionState;
  revealToken?: string;
  message?: string;
};

export type ManageDevicesResponse = {
  activeDevices: LicenseDevice[];
};

export type ActivateDeviceResponse = ManageDevicesResponse & {
  refreshed: boolean;
};

export class LicenseApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "LicenseApiError";
    this.status = status;
  }
}

function extractApiErrorMessage(data: unknown): string {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "Request failed.";

  const obj = data as Record<string, unknown>;

  if (typeof obj.error === "string") return obj.error;

  if (obj.error && typeof obj.error === "object") {
    const nested = obj.error as Record<string, unknown>;
    if (typeof nested.message === "string") return nested.message;
  }

  if (typeof obj.message === "string") return obj.message;

  return "Request failed.";
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new LicenseApiError("Invalid response from license service.", res.status || 500);
  }

  if (!res.ok) {
    throw new LicenseApiError(extractApiErrorMessage(data), res.status);
  }

  return data as T;
}

/** Normalize session API payloads into a single state machine. */
export function normalizeLicenseSession(data: Record<string, unknown>): LicenseSessionResult {
  const status = typeof data.status === "string" ? data.status.toLowerCase() : "";
  const state = typeof data.state === "string" ? data.state.toLowerCase() : "";

  if (
    data.alreadyRevealed === true ||
    status === "already_revealed" ||
    status === "revealed" ||
    state === "already_revealed" ||
    state === "revealed"
  ) {
    return { state: "already_revealed" };
  }

  const token =
    (typeof data.revealToken === "string" && data.revealToken) ||
    (typeof data.token === "string" && data.token) ||
    undefined;

  if (token) {
    return { state: "token_received", revealToken: token };
  }

  if (
    data.pending === true ||
    status === "pending" ||
    state === "pending" ||
    status === "processing"
  ) {
    return { state: "pending" };
  }

  if (typeof data.error === "string") {
    return { state: "error", message: friendlyStripeSessionError(data.error) };
  }

  if (data.error && typeof data.error === "object") {
    const nested = data.error as Record<string, unknown>;
    if (typeof nested.message === "string") {
      return { state: "error", message: friendlyStripeSessionError(nested.message) };
    }
  }

  return { state: "pending" };
}

export async function fetchLicenseSession(sessionId: string): Promise<LicenseSessionResult> {
  const res = await fetch(`/api/license/session/${encodeURIComponent(sessionId)}`, {
    method: "GET",
    cache: "no-store",
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new LicenseApiError("Invalid response from license service.", res.status || 500);
  }

  if (!res.ok) {
    throw new LicenseApiError(
      friendlyStripeSessionError(extractApiErrorMessage(data)),
      res.status
    );
  }

  return normalizeLicenseSession(data as Record<string, unknown>);
}

export async function revealLicense(token: string): Promise<RevealedLicense> {
  const res = await fetch("/api/license/reveal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });

  return parseJsonResponse<RevealedLicense>(res);
}

export async function listLicenseDevices(
  email: string,
  licenseKey: string
): Promise<ManageDevicesResponse> {
  const res = await fetch("/api/license/manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, licenseKey }),
    cache: "no-store",
  });

  return parseJsonResponse<ManageDevicesResponse>(res);
}

export async function activateLicenseDevice(
  email: string,
  licenseKey: string,
  machineId: string
): Promise<ActivateDeviceResponse> {
  const res = await fetch("/api/license/activate-device", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, licenseKey, machineId }),
    cache: "no-store",
  });

  return parseJsonResponse<ActivateDeviceResponse>(res);
}

export async function removeLicenseDevice(
  email: string,
  licenseKey: string,
  machineId: string
): Promise<ManageDevicesResponse> {
  const res = await fetch("/api/license/remove-device", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, licenseKey, machineId }),
    cache: "no-store",
  });

  return parseJsonResponse<ManageDevicesResponse>(res);
}
