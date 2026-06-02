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
const DEFAULT_MAX_POLL_ATTEMPTS = 45;

export type LicenseEmailDeliveryResult =
  | { status: "sent"; email: string }
  | { status: "already_sent"; email: string }
  | { status: "pending"; message: string }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

export type DeliverLicenseEmailOptions = {
  license?: RevealedLicense;
  maxPollAttempts?: number;
};

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
  options: DeliverLicenseEmailOptions = {}
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
    return {
      status: "skipped",
      reason:
        "No email on this checkout session. Use Stripe checkout with customer email collection enabled.",
    };
  }

  if (await isLicenseEmailMarkedSent(sessionId)) {
    return { status: "already_sent", email: recipient };
  }

  let license = options.license;
  const maxAttempts = options.maxPollAttempts ?? DEFAULT_MAX_POLL_ATTEMPTS;

  if (license) {
    if (license.email.trim().toLowerCase() !== recipient.toLowerCase()) {
      console.warn(
        "[license-email] license API email differs from Stripe checkout; sending to checkout email",
        { checkout: recipient, licenseEmail: license.email }
      );
    }
  } else {
    const resolved = await pollAndRevealLicense(sessionId, maxAttempts);
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
          "License was already revealed on the website. If you did not receive an email, use Help & support with your checkout email.",
      };
    }
    license = resolved.license;
  }

  try {
    await sendLicenseEmail(config, {
      to: recipient,
      license: { ...license, email: recipient },
      sessionId,
    });
    await markLicenseEmailSent(sessionId);
    console.info("[license-email] sent", { sessionId, to: maskEmail(recipient) });
    return { status: "sent", email: recipient };
  } catch (error) {
    console.error("[license-email] send failed:", error);
    const detail = error instanceof Error ? error.message : "Unknown SMTP error";
    return {
      status: "error",
      message: `Unable to send license email (${detail}). Check SMTP settings or try again.`,
    };
  }
}

async function pollAndRevealLicense(
  sessionId: string,
  maxAttempts: number
): Promise<
  | { status: "ok"; license: RevealedLicense }
  | { status: "pending"; message: string }
  | { status: "already_revealed" }
  | { status: "error"; message: string }
> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
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
    message: "License is still being generated. Keep this page open or check back shortly.",
  };
}

async function isLicenseEmailMarkedSent(sessionId: string): Promise<boolean> {
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.metadata?.[LICENSE_EMAIL_SENT_METADATA] === "true";
  } catch {
    return false;
  }
}

async function markLicenseEmailSent(sessionId: string): Promise<void> {
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata,
        [LICENSE_EMAIL_SENT_METADATA]: "true",
      },
    });
  } catch (error) {
    console.error("[license-email] could not update Stripe session metadata:", error);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Run license email delivery after checkout (must be awaited on serverless hosts). */
export async function runLicenseEmailDeliveryAfterCheckout(
  sessionId: string
): Promise<LicenseEmailDeliveryResult> {
  return deliverLicenseEmailForCheckout(sessionId, { maxPollAttempts: 20 });
}
