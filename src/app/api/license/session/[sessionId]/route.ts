import { checkoutSessionValidationError } from "@/lib/checkout-session";
import { proxyLicenseApi } from "@/lib/license-api-server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;

  const validationError = checkoutSessionValidationError(sessionId ?? null);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const upstream = await proxyLicenseApi(`/session/${encodeURIComponent(sessionId)}`);
    const body = await upstream.text();
    return new NextResponse(body, {
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
