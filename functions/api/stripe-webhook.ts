import type { Env } from "../lib/env";
import { stripeGet, verifyStripeSignature } from "../lib/stripe";
import { profileIdByEmail, upsertSubscription } from "../lib/supabase";

type StripeSubscription = {
  id: string;
  customer: string | { id?: string };
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

function customerIdOf(sub: StripeSubscription) {
  return typeof sub.customer === "string" ? sub.customer : (sub.customer?.id ?? null);
}

function subscriptionIdFromInvoice(invoice: Record<string, unknown>) {
  if (typeof invoice.subscription === "string") return invoice.subscription;
  const parent = invoice.parent as { subscription_details?: { subscription?: string } } | undefined;
  const nested = parent?.subscription_details?.subscription;
  return typeof nested === "string" ? nested : null;
}

async function saveSubscription(env: Env, subscription: StripeSubscription, email?: string | null) {
  const customerId = customerIdOf(subscription);
  if (!customerId || !env.STRIPE_SECRET_KEY) return;

  let resolved = email ?? null;
  if (!resolved) {
    const customer = (await stripeGet(env.STRIPE_SECRET_KEY, `customers/${customerId}`)) as { email?: string | null };
    resolved = customer.email ?? null;
  }
  if (!resolved) return;

  await upsertSubscription(env, {
    email: resolved,
    user_id: await profileIdByEmail(env, resolved),
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    price_id: priceId(subscription),
    current_period_end: periodEnd(subscription),
  });
}

async function syncSubscription(env: Env, subscriptionId: string, email?: string | null) {
  if (!env.STRIPE_SECRET_KEY) return;
  const subscription = (await stripeGet(env.STRIPE_SECRET_KEY, `subscriptions/${subscriptionId}`)) as StripeSubscription;
  await saveSubscription(env, subscription, email);
}

async function syncCustomer(env: Env, customerId: string) {
  if (!env.STRIPE_SECRET_KEY) return;
  const list = (await stripeGet(
    env.STRIPE_SECRET_KEY,
    `subscriptions?customer=${encodeURIComponent(customerId)}&status=all&limit=1`,
  )) as { data?: StripeSubscription[] };
  const subscription = list.data?.[0];
  if (subscription) await saveSubscription(env, subscription);
}

async function customerFromCharge(env: Env, chargeId: string) {
  if (!env.STRIPE_SECRET_KEY) return null;
  const charge = (await stripeGet(env.STRIPE_SECRET_KEY, `charges/${chargeId}`)) as { customer?: string | null };
  return typeof charge.customer === "string" ? charge.customer : null;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { env, request } = context;
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response("Stripe is not configured", { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("Stripe-Signature") ?? "";
  const valid = await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return new Response("Invalid signature", { status: 400 });

  const event = JSON.parse(rawBody) as StripeEvent;
  const object = event.data.object;

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const email =
      (object.customer_details as { email?: string } | undefined)?.email ?? (object.customer_email as string | undefined);
    const subscriptionId = object.subscription as string | undefined;
    if (object.payment_status !== "unpaid" && subscriptionId) await syncSubscription(env, subscriptionId, email);
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    await saveSubscription(env, object as unknown as StripeSubscription);
  }

  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const subscriptionId = subscriptionIdFromInvoice(object);
    const email = object.customer_email as string | undefined;
    if (subscriptionId) await syncSubscription(env, subscriptionId, email);
    else if (typeof object.customer === "string") await syncCustomer(env, object.customer);
  }

  if (event.type === "charge.refunded") {
    const customerId = object.customer as string | undefined;
    if (customerId) await syncCustomer(env, customerId);
  }

  if (event.type === "charge.dispute.created" || event.type === "radar.early_fraud_warning.created") {
    const chargeId = object.charge as string | undefined;
    const customerId = chargeId ? await customerFromCharge(env, chargeId) : null;
    if (customerId) await syncCustomer(env, customerId);
  }

  return new Response("ok");
}
