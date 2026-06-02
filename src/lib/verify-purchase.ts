import {
  checkoutSessionValidationError,
  friendlyStripeSessionError,
} from "@/lib/checkout-session";
import { getStripeClient } from "@/lib/stripe";
import { isCompletedCheckout } from "@/lib/stripe-orders";
import Stripe from "stripe";

export type VerifiedPurchase = {
  paid: boolean;
  customerEmail: string | null;
  checkoutSessionId: string;
};

export async function verifyPaidCheckoutSession(
  sessionId: string
): Promise<VerifiedPurchase> {
  const validationError = checkoutSessionValidationError(sessionId);
  if (validationError) {
    throw new Error(validationError);
  }

  const stripe = getStripeClient();

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer"],
    });
  } catch (e) {
    if (e instanceof Stripe.errors.StripeInvalidRequestError) {
      throw new Error(friendlyStripeSessionError(e.message));
    }
    throw new Error("Unable to verify payment with Stripe. Please try again.");
  }

  const paid =
    session.payment_status === "paid" ||
    session.status === "complete" ||
    (await isCompletedCheckout(sessionId));

  const customer =
    session.customer && typeof session.customer === "object" ? session.customer : null;

  const customerEmail =
    session.customer_details?.email ??
    session.customer_email ??
    (customer && "email" in customer && typeof customer.email === "string"
      ? customer.email
      : null);

  return {
    paid,
    customerEmail,
    checkoutSessionId: session.id,
  };
}
