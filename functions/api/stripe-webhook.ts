import type { Env } from "../lib/env";
import { stripeGet, verifyStripeSignature } from "../lib/stripe";
import { profileIdByEmail, updateSubscriptionByCustomer, upsertSubscription } from "../lib/supabase";

type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  current_period_end?: number;
  items?: { data?: { price?: { id?: string }; current_period_end?: number }[] };
};

type StripeEvent = {
  type: string;
  data: { object: Record<string, unknown> };
};

function periodEnd(sub: StripeSubscription) {
  const unix = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  return unix ? new Date(unix * 1000).toISOString() : null;
}

function priceId(sub: StripeSubscription) {
  return sub.items?.data?.[0]?.price?.id ?? null;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { env, request } = context;
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe is not configured", { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("Stripe-Signature") ?? "";
  const valid = await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return new Response("Invalid signature", { status: 400 });

  const event = JSON.parse(rawBody) as StripeEvent;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = (session.customer_details as { email?: string } | undefined)?.email ?? (session.customer_email as string | undefined);
    const customerId = session.customer as string | undefined;
    const subscriptionId = session.subscription as string | undefined;
    if (!email || !customerId || !subscriptionId) return new Response("ok");

    const subscription = (await stripeGet(env.STRIPE_SECRET_KEY, `subscriptions/${subscriptionId}`)) as StripeSubscription;
    await upsertSubscription(env, {
      email,
      user_id: await profileIdByEmail(env, email),
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      price_id: priceId(subscription),
      current_period_end: periodEnd(subscription),
    });
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as unknown as StripeSubscription;
    await updateSubscriptionByCustomer(env, subscription.customer, {
      stripe_subscription_id: subscription.id,
      status: event.type === "customer.subscription.deleted" ? "canceled" : subscription.status,
      price_id: priceId(subscription),
      current_period_end: periodEnd(subscription),
    });
  }

  return new Response("ok");
}
