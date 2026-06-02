import { isUserSafeMessage, UserErrors } from "@/lib/user-errors";

/** Stripe Checkout Session IDs look like cs_test_… or cs_live_… (long random suffix). */
const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]{16,}$/;

export function isValidCheckoutSessionId(sessionId: string): boolean {
  return SESSION_ID_PATTERN.test(sessionId.trim());
}

export function checkoutSessionValidationError(sessionId: string | null): string | null {
  if (!sessionId?.trim()) {
    return "Missing checkout session. Complete payment through checkout to receive your license.";
  }
  if (!isValidCheckoutSessionId(sessionId)) {
    return "This link does not contain a valid checkout session. Use the URL Stripe sends you after payment, or complete checkout again.";
  }
  return null;
}

/** Turn Stripe / API error payloads into customer-safe copy. */
export function friendlyStripeSessionError(message: string): string {
  if (/no such checkout\.session/i.test(message) || /resource_missing/i.test(message)) {
    return "We could not find this order. Complete a new purchase from the checkout page.";
  }
  if (/invalid_request/i.test(message)) {
    return "This order link is not valid. Return from checkout after payment or start again.";
  }
  if (isUserSafeMessage(message)) {
    return message.trim();
  }
  return UserErrors.licenseVerify;
}
