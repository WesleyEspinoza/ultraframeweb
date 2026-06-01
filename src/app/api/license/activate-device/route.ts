import { proxyLicenseApi } from "@/lib/license-api-server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  try {
    const upstream = await proxyLicenseApi("/activate-device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the license service. Please try again." },
      { status: 502 }
    );
  }
}
