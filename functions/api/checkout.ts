import type { Env } from "../lib/env";
import { stripeForm } from "../lib/stripe";

// Stable label so Checkout sessions can be compared in the Stripe Dashboard.
const INTEGRATION_ID = "cropplot_pro_mnvqplrx";

export async function onRequestGet(context: { request: Request; env: Env }) {
  const origin = new URL(context.request.url).origin;
  const { env } = context;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
    return Response.redirect(`${origin}/subscribe/unavailable/`, 302);
  }

  const body = new URLSearchParams({
    mode: "subscription",
    cancel_url: `${origin}/pricing/`,
    allow_promotion_codes: "true",
    "line_items[0][price]": env.STRIPE_PRICE_ID,
    "line_items[0][quantity]": "1",
    integration_identifier: INTEGRATION_ID,
    "subscription_data[billing_mode][type]": "flexible",
    "subscription_data[metadata][product]": "cropplot_pro",
  });

  // Stripe replaces this token only when the braces are not percent-encoded.
  const success = `${encodeURIComponent(`${origin}/subscribe/success/?session_id=`)}{CHECKOUT_SESSION_ID}`;
  const encoded = `${body.toString()}&success_url=${success}`;

  try {
    const session = (await stripeForm(env.STRIPE_SECRET_KEY, "checkout/sessions", encoded)) as { url?: string };
    if (!session.url) return new Response("Stripe did not return a checkout URL", { status: 502 });
    return Response.redirect(session.url, 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Checkout failed", { status: 502 });
  }
}
