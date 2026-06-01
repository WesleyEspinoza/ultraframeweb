import { checkoutSessionValidationError } from "@/lib/checkout-session";
import { deliverLicenseEmailForCheckout } from "@/lib/license-email-delivery";
import type { RevealedLicense } from "@/lib/license-api";
import { maskEmail } from "@/lib/email-transport";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const sessionId =
    body && typeof body === "object" && "sessionId" in body && typeof body.sessionId === "string"
      ? body.sessionId.trim()
      : "";

  const validationError = checkoutSessionValidationError(sessionId);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  let license: RevealedLicense | undefined;
  if (body && typeof body === "object" && "license" in body && body.license) {
    const raw = body.license as Record<string, unknown>;
    if (
      typeof raw.key === "string" &&
      typeof raw.email === "string" &&
      typeof raw.product === "string" &&
      typeof raw.tier === "string"
    ) {
      license = {
        key: raw.key.trim(),
        email: raw.email.trim(),
        product: raw.product.trim(),
        tier: raw.tier.trim(),
      };
    }
  }

  const result = await deliverLicenseEmailForCheckout(sessionId, { license });

  if (result.status === "sent") {
    return NextResponse.json({
      ok: true,
      sent: true,
      email: result.email,
      maskedEmail: maskEmail(result.email),
    });
  }

  if (result.status === "already_sent") {
    return NextResponse.json({
      ok: true,
      sent: true,
      alreadySent: true,
      email: result.email,
      maskedEmail: maskEmail(result.email),
    });
  }

  if (result.status === "pending") {
    return NextResponse.json({ ok: false, pending: true, message: result.message }, { status: 202 });
  }

  if (result.status === "skipped") {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({ error: result.message }, { status: 500 });
}
