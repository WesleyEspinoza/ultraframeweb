import { getEmailConfig, getEmailConfigErrorMessage } from "@/lib/email-config";
import { maskEmail } from "@/lib/email-transport";
import {
  fetchLicenseSessionUpstream,
  revealLicenseUpstream,
} from "@/lib/license-api-server";
import type { RevealedLicense } from "@/lib/license-api";
import { sendLicenseEmail } from "@/lib/send-license-email";
import { verifyPaidCheckoutSession } from "@/lib/verify-purchase";
import { getStripeClient } from "@/lib/stripe";

const LICENSE_EMAIL_SENT_METADATA = "ultraframe_license_email_sent";
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 45;

export type LicenseEmailDeliveryResult =
  | { status: "sent"; email: string }
  | { status: "already_sent"; email: string }
  | { status: "pending"; message: string }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

export async function getLicenseEmailDeliveryStatus(
  sessionId: string
): Promise<{ sent: boolean; email: string | null; maskedEmail: string | null }> {
  const purchase = await verifyPaidCheckoutSession(sessionId);
  if (!purchase.paid || !purchase.customerEmail) {
    return { sent: false, email: null, maskedEmail: null };
  }

  const sent = await isLicenseEmailMarkedSent(sessionId);

  return {
    sent,
    email: purchase.customerEmail,
    maskedEmail: maskEmail(purchase.customerEmail),
  };
}

export async function deliverLicenseEmailForCheckout(
  sessionId: string,
  options?: { license?: RevealedLicense }
): Promise<LicenseEmailDeliveryResult> {
  const config = getEmailConfig();
  if (!config) {
    return { status: "error", message: getEmailConfigErrorMessage("license") };
  }

  let purchase;
  try {
    purchase = await verifyPaidCheckoutSession(sessionId);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to verify checkout.",
    };
  }

  if (!purchase.paid) {
    return { status: "skipped", reason: "Checkout is not paid." };
  }

  const recipient = purchase.customerEmail?.trim();
  if (!recipient) {
    return { status: "skipped", reason: "No email on this checkout session." };
  }

  if (await isLicenseEmailMarkedSent(sessionId)) {
    return { status: "already_sent", email: recipient };
  }

  let license = options?.license;

  if (license) {
    if (license.email.trim().toLowerCase() !== recipient.toLowerCase()) {
      return { status: "error", message: "License email does not match checkout." };
    }
  } else {
    const resolved = await pollAndRevealLicense(sessionId);
    if (resolved.status === "pending") {
      return { status: "pending", message: resolved.message };
    }
    if (resolved.status === "error") {
      return { status: "error", message: resolved.message };
    }
    if (resolved.status === "already_revealed") {
      return {
        status: "pending",
        message:
          "License was already revealed. If you did not receive an email, use Help & support with your checkout email.",
      };
    }
    license = resolved.license;
  }

  try {
    await sendLicenseEmail(config, {
      to: recipient,
      license,
      sessionId,
    });
    await markLicenseEmailSent(sessionId);
    return { status: "sent", email: recipient };
  } catch (error) {
    console.error("[license-email] send failed:", error);
    return {
      status: "error",
      message: "Unable to send license email. Please try again later.",
    };
  }
}

async function pollAndRevealLicense(
  sessionId: string
): Promise<
  | { status: "ok"; license: RevealedLicense }
  | { status: "pending"; message: string }
  | { status: "already_revealed" }
  | { status: "error"; message: string }
> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    try {
      const session = await fetchLicenseSessionUpstream(sessionId);

      if (session.state === "already_revealed") {
        return { status: "already_revealed" };
      }

      if (session.state === "error") {
        return {
          status: "error",
          message: session.message ?? "License session error.",
        };
      }

      if (session.state === "token_received" && session.revealToken) {
        const license = await revealLicenseUpstream(session.revealToken);
        return { status: "ok", license };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "License service unavailable.";
      return { status: "error", message };
    }

    await sleep(POLL_INTERVAL_MS);
  }

  return {
    status: "pending",
    message: "License is still being generated. We will retry automatically.",
  };
}

async function isLicenseEmailMarkedSent(sessionId: string): Promise<boolean> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.metadata?.[LICENSE_EMAIL_SENT_METADATA] === "true";
}

async function markLicenseEmailSent(sessionId: string): Promise<void> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  await stripe.checkout.sessions.update(sessionId, {
    metadata: {
      ...session.metadata,
      [LICENSE_EMAIL_SENT_METADATA]: "true",
    },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fire-and-forget delivery after Stripe webhook (do not await in webhook handler). */
export function queueLicenseEmailDelivery(sessionId: string): void {
  void (async () => {
    // Prefer on-page reveal + client-triggered email; fall back after a short delay.
    await sleep(10000);

    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await deliverLicenseEmailForCheckout(sessionId);
      if (
        result.status === "sent" ||
        result.status === "already_sent" ||
        result.status === "skipped"
      ) {
        return;
      }
      if (result.status === "pending") {
        await sleep(5000);
        continue;
      }
      console.error("[license-email] queue failed:", result);
      return;
    }
  })();
}
