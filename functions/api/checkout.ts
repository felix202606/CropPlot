import type { Env } from "../lib/env";
import { stripeForm } from "../lib/stripe";

export async function onRequestGet(context: { request: Request; env: Env }) {
  const origin = new URL(context.request.url).origin;
  const { env } = context;

  if (!env.STRIPE_SECRET_KEY) {
    return Response.redirect(`${origin}/subscribe/unavailable/`, 302);
  }

  const body = new URLSearchParams({
    mode: "subscription",
    success_url: `${origin}/subscribe/success/`,
    cancel_url: `${origin}/pricing/`,
    allow_promotion_codes: "true",
    "line_items[0][quantity]": "1",
  });

  if (env.STRIPE_PRICE_ID) {
    body.set("line_items[0][price]", env.STRIPE_PRICE_ID);
  } else {
    body.set("line_items[0][price_data][currency]", "usd");
    body.set("line_items[0][price_data][unit_amount]", "3599");
    body.set("line_items[0][price_data][recurring][interval]", "year");
    body.set("line_items[0][price_data][product_data][name]", "CropPlot Pro");
  }

  try {
    const session = (await stripeForm(env.STRIPE_SECRET_KEY, "checkout/sessions", body)) as { url?: string };
    if (!session.url) return new Response("Stripe did not return a checkout URL", { status: 502 });
    return Response.redirect(session.url, 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Checkout failed", { status: 502 });
  }
}
