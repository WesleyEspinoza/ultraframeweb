/** Customer-safe error copy — never expose env, vendor, or stack details. */

export const UserErrors = {
  generic: "Something went wrong. Please try again later.",
  checkout: "Unable to start checkout right now. Please try again later.",
  pricing: "Unable to load pricing right now. Please refresh the page.",
  promoEnter: "Enter a promotion code.",
  promoInvalid: (code: string) =>
    `Promotion code "${code.trim()}" is invalid, expired, or no longer available.`,
  promoExpired: "This promotion code has expired.",
  promoUnavailable: "This promotion code is no longer available.",
  helpSend: "Unable to send your message right now. Please try again later.",
  helpUnavailable: "Help is temporarily unavailable. Please try again later.",
  licenseEmail: "Unable to email your license right now. Please try again in a few minutes.",
  licensePending:
    "Your license is still being prepared. Keep this page open or check back shortly.",
  licenseAlreadyRevealed:
    "Your license was already delivered. Check your inbox or visit Help for support.",
  licenseVerify:
    "We could not verify your purchase. Complete checkout again or contact support.",
  licenseService: "License service is temporarily unavailable. Please try again.",
  licenseManage: "Unable to manage your license right now. Check your email and license key.",
  licenseReveal: "Unable to reveal your license. Please try again or contact support.",
  licenseActivate: "Unable to activate this device. Please try again.",
  licenseRemove: "Unable to remove this device. Please try again.",
  downloadVerify:
    "Unable to verify your purchase. Please try again from your confirmation page.",
  forbidden: "This request could not be completed.",
  invalidRequest: "Something was wrong with your request. Please try again.",
} as const;

const TECHNICAL_PATTERN =
  /stripe|STRIPE_|EMAIL_|SMTP|\.env|netlify|vercel|api key|webhook|metadata|resource_missing|invalid_request|catalog not configured|hosting|deploy|check smtp|unknown smtp|serverless|ENOENT|AWS_|LICENSE_API|not configured on the server|same stripe mode|test\/live/i;

/** Returns true when a message is safe to show in the UI/API. */
export function isUserSafeMessage(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;
  if (TECHNICAL_PATTERN.test(trimmed)) return false;

  const safeHints = [
    "Promotion code",
    "Enter a promotion code",
    "This promotion code",
    "Missing checkout session",
    "This link does not contain",
    "This checkout session is invalid",
    "We could not find this checkout",
    "Return from Stripe",
    "Complete checkout",
    "Complete payment",
    "Payment has not",
    "A valid checkout session",
    "Name is required",
    "Email is required",
    "Message is required",
    "Enter a valid email",
    "Your license is still",
    "Keep this page open",
    "Check your inbox",
    "Help & support",
    "too long",
    "Unable to send your message",
    "Pricing is not available",
    "Invalid license",
    "license not found",
    "License not found",
    "Invalid email",
    "Invalid credentials",
    "already revealed",
    "Reveal token",
    "expired",
    "Unable to reach the license service",
    "Unable to load devices",
    "Unable to activate",
    "Unable to remove",
  ];

  return safeHints.some((hint) => trimmed.includes(hint));
}

export function toUserError(error: unknown, fallback: string = UserErrors.generic): string {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : fallback;

  return isUserSafeMessage(message) ? message.trim() : fallback;
}
