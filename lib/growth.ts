import { browserSupabase } from "@/lib/supabase-browser";

const storageKey = "cropplot-attribution";

export type FirstTouch = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  code: string | null;
  referrer: string | null;
  landing_path: string | null;
};

function blankTouch(): FirstTouch {
  return {
    source: null,
    medium: null,
    campaign: null,
    content: null,
    code: null,
    referrer: null,
    landing_path: null,
  };
}

export function rememberVisit() {
  const params = new URLSearchParams(window.location.search);
  const incoming: FirstTouch = {
    source: params.get("utm_source"),
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
    content: params.get("utm_content"),
    code: params.get("ref"),
    referrer: document.referrer || null,
    landing_path: `${window.location.pathname}${window.location.search}`,
  };
  const saved = readTouch();
  if (!saved) {
    localStorage.setItem(storageKey, JSON.stringify(incoming));
    return;
  }
  const merged = { ...saved };
  for (const key of ["source", "medium", "campaign", "content", "code"] as const) {
    if (!merged[key] && incoming[key]) merged[key] = incoming[key];
  }
  localStorage.setItem(storageKey, JSON.stringify(merged));
}

function readTouch(): FirstTouch | null {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return { ...blankTouch(), ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export async function syncGrowth(userId: string) {
  const touch = readTouch() ?? blankTouch();
  const client = browserSupabase();
  const inserted = await client.from("attributions").insert({
    user_id: userId,
    source: touch.source,
    medium: touch.medium,
    campaign: touch.campaign,
    content: touch.content,
    referrer: touch.referrer,
    landing_path: touch.landing_path,
    code: touch.code,
  });
  if (inserted.error && inserted.error.code !== "23505") return null;
  if (touch.code) await client.rpc("claim_referral", { referral_code: touch.code });

  const [{ data: profile }, { count }] = await Promise.all([
    client.from("profiles").select("referral_code").eq("id", userId).maybeSingle(),
    client.from("referrals").select("id", { count: "exact", head: true }).eq("referrer_id", userId),
  ]);
  return {
    code: (profile?.referral_code as string | undefined) ?? "",
    invited: count ?? 0,
  };
}
