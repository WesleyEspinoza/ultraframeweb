import { proxyLicenseApi } from "@/lib/license-api-server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.token?.trim()) {
    return NextResponse.json({ error: "Reveal token is required." }, { status: 400 });
  }

  try {
    const upstream = await proxyLicenseApi("/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: body.token.trim() }),
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
