import { queueLicenseEmailDelivery } from "@/lib/license-email-delivery";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";
import { recordCompletedCheckout } from "@/lib/stripe-orders";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook verification failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await recordCompletedCheckout(session);
    if (session.id) {
      queueLicenseEmailDelivery(session.id);
    }
  }

  return NextResponse.json({ received: true });
}
