import type { Env } from "../lib/env";
import { stripeForm } from "../lib/stripe";
import { subscriptionCustomerByEmail, userFromAccessToken } from "../lib/supabase";

// Signed-in app users open Stripe's Customer Portal to cancel or update the card.
export async function onRequestGet(context: { request: Request; env: Env }) {
  const { env, request } = context;
  const origin = new URL(request.url).origin;
  if (!env.STRIPE_SECRET_KEY) return Response.json({ error: "Stripe is not configured" }, { status: 503 });

  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "Sign in required" }, { status: 401 });

  const user = await userFromAccessToken(env, token);
  if (!user?.email) return Response.json({ error: "Invalid session" }, { status: 401 });

  const customerId = await subscriptionCustomerByEmail(env, user.email);
  if (!customerId) return Response.json({ error: "No CropPlot Pro subscription for this account" }, { status: 404 });

  try {
    const session = (await stripeForm(
      env.STRIPE_SECRET_KEY,
      "billing_portal/sessions",
      new URLSearchParams({ customer: customerId, return_url: `${origin}/pricing/` }),
    )) as { url?: string };
    if (!session.url) return new Response("Stripe did not return a portal URL", { status: 502 });
    return Response.redirect(session.url, 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Portal failed", { status: 502 });
  }
}
