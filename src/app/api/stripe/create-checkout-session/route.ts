import { createManagedPaymentsCheckoutSession } from "@/lib/create-managed-payments-checkout";
import { isUserSafeMessage, UserErrors } from "@/lib/user-errors";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let promotionCode: string | undefined;
  try {
    const body = await request.json();
    if (
      body &&
      typeof body === "object" &&
      "promotionCode" in body &&
      typeof body.promotionCode === "string"
    ) {
      promotionCode = body.promotionCode;
    }
  } catch {
    // Empty body is fine — optional promotion code.
  }

  try {
    const result = await createManagedPaymentsCheckoutSession({ promotionCode });
    return NextResponse.json({
      sessionId: result.sessionId,
      url: result.url,
    });
  } catch (error) {
    console.error("[checkout] session create failed:", error);
    const message = error instanceof Error ? error.message : UserErrors.checkout;
    return NextResponse.json(
      { error: isUserSafeMessage(message) ? message : UserErrors.checkout },
      { status: 503 }
    );
  }
}
