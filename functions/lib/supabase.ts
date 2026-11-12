import type { Env } from "./env";

function configured(env: Env): env is Env & { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string } {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

function headers(env: Env & { SUPABASE_SERVICE_ROLE_KEY: string }) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function profileIdByEmail(env: Env, email: string) {
  if (!configured(env)) return null;
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id`,
    { headers: headers(env) },
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as { id: string }[];
  return rows[0]?.id ?? null;
}

export async function upsertSubscription(
  env: Env,
  row: {
    email: string;
    stripe_customer_id: string;
    stripe_subscription_id: string;
    status: string;
    price_id: string | null;
    current_period_end: string | null;
    user_id: string | null;
  },
) {
  if (!configured(env)) return;
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?on_conflict=stripe_customer_id`, {
    method: "POST",
    headers: { ...headers(env), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(`Supabase upsert failed: ${await response.text()}`);
}

export async function updateSubscriptionByCustomer(
  env: Env,
  customerId: string,
  patch: { status: string; price_id: string | null; current_period_end: string | null; stripe_subscription_id: string },
) {
  if (!configured(env)) return;
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/subscriptions?stripe_customer_id=eq.${encodeURIComponent(customerId)}`,
    { method: "PATCH", headers: headers(env), body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }) },
  );
  if (!response.ok) throw new Error(`Supabase update failed: ${await response.text()}`);
}

export async function userFromAccessToken(env: Env, accessToken: string) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  const user = (await response.json()) as { id?: string };
  return user.id ? { id: user.id } : null;
}

export async function insertDiagnosis(
  env: Env,
  row: { user_id: string; plant_slug: string | null; image_key: string },
) {
  if (!configured(env)) throw new Error("Supabase is not configured");
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/diagnoses`, {
    method: "POST",
    headers: { ...headers(env), Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(`Supabase insert failed: ${await response.text()}`);
  const rows = (await response.json()) as { id: string }[];
  return rows[0];
}
