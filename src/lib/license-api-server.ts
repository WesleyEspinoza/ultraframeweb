import {
  LicenseApiError,
  LICENSE_API_BASE,
  normalizeLicenseSession,
  type RevealedLicense,
} from "@/lib/license-api";
import { toUserError, UserErrors } from "@/lib/user-errors";

export async function proxyLicenseApi(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const url = `${LICENSE_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  return fetch(url, {
    ...init,
    cache: "no-store",
  });
}

async function parseUpstreamJson<T>(res: Response): Promise<T> {
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new LicenseApiError("Invalid response from license service.", res.status || 500);
  }

  if (!res.ok) {
    const raw =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "License service request failed.";
    throw new LicenseApiError(toUserError(raw, UserErrors.licenseService), res.status);
  }

  return data as T;
}

export async function fetchLicenseSessionUpstream(sessionId: string) {
  const res = await proxyLicenseApi(`/session/${encodeURIComponent(sessionId)}`);
  const data = await parseUpstreamJson<Record<string, unknown>>(res);
  return normalizeLicenseSession(data);
}

export async function revealLicenseUpstream(token: string): Promise<RevealedLicense> {
  const res = await proxyLicenseApi("/reveal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token.trim() }),
  });
  return parseUpstreamJson<RevealedLicense>(res);
}
