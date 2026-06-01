import { createManagedPaymentsCheckoutSession } from "@/lib/create-managed-payments-checkout";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await createManagedPaymentsCheckoutSession();
    return NextResponse.json({
      sessionId: result.sessionId,
      url: result.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session.";
    const status =
      message.includes("STRIPE_SECRET_KEY") || message.includes("catalog")
        ? 503
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
