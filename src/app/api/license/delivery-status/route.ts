import { checkoutSessionValidationError } from "@/lib/checkout-session";
import { getLicenseEmailDeliveryStatus } from "@/lib/license-email-delivery";
import { UserErrors, toUserError } from "@/lib/user-errors";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id")?.trim() ?? "";

  const validationError = checkoutSessionValidationError(sessionId);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const status = await getLicenseEmailDeliveryStatus(sessionId);
    return NextResponse.json(status);
  } catch (error) {
    console.error("[delivery-status] failed:", error);
    return NextResponse.json(
      { error: toUserError(error, UserErrors.generic) },
      { status: 500 }
    );
  }
}
