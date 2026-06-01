import { LICENSE_API_BASE } from "@/lib/license-api";

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
