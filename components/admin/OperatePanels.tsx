"use client";

import { browserSupabase } from "@/lib/supabase-browser";
import { useEffect, useState, type FormEvent } from "react";

const proYearCents = 3599;

type SubscriptionRow = {
  id: string;
  email: string;
  status: string;
  source: string;
  current_period_end: string | null;
  grant_note: string | null;
  stripe_customer_id: string | null;
};

type AttributionRow = {
  user_id: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  referrer: string | null;
  landing_path: string | null;
  code: string | null;
  created_at: string;
};

type AgentRow = {
  id: string;
  name: string;
  email: string | null;
  code: string;
  status: string;
  commission_percent: number;
  note: string | null;
};

type ReferralRow = {
  id: string;
  referrer_id: string | null;
  agent_id: string | null;
  referred_id: string;
  code: string;
  reward_status: string;
  created_at: string;
};

type ProfileLite = { id: string; email: string | null; referral_code: string };

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function day(value: string | null) {
  return value ? value.slice(0, 10) : "—";
}

export function SubscriptionsPanel({ onNotice }: { onNotice: (message: string) => void }) {
  const [rows, setRows] = useState<SubscriptionRow[]>([]);
  const [email, setEmail] = useState("");
  const [until, setUntil] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const { data } = await browserSupabase()
      .from("subscriptions")
      .select("id,email,status,source,current_period_end,grant_note,stripe_customer_id")
      .order("updated_at", { ascending: false });
    setRows(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function grant(event: FormEvent) {
    event.preventDefault();
    const client = browserSupabase();
    const address = email.trim();
    const { data: profile } = await client.from("profiles").select("id").ilike("email", address).maybeSingle();
    const payload = {
      email: address,
      status: "active",
      source: "manual",
      current_period_end: until ? `${until}T23:59:59.000Z` : null,
      grant_note: note.trim() || null,
      user_id: profile?.id ?? null,
      updated_at: new Date().toISOString(),
    };
    const existing = rows.find((row) => row.email.toLowerCase() === address.toLowerCase());
    const { error } = existing
      ? await client.from("subscriptions").update(payload).eq("id", existing.id)
      : await client.from("subscriptions").insert(payload);
    onNotice(error ? error.message : "Pro grant saved.");
    if (!error) {
      setEmail("");
      setNote("");
      load();
    }
  }

  async function setStatus(row: SubscriptionRow, status: string) {
    const { error } = await browserSupabase()
      .from("subscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    onNotice(error ? error.message : "Subscription updated.");
    if (!error) load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={grant} className="grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-soil-100">
        <h2 className="font-display text-2xl font-semibold text-leaf-900">Grant Pro</h2>
        <p className="text-sm text-soil-900/70">
          Paid subscriptions still follow Stripe. Use this for a comp or a manual end date.
        </p>
        <label className="text-sm font-medium">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-soil-100 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-medium">
          Pro through
          <input
            type="date"
            value={until}
            onChange={(event) => setUntil(event.target.value)}
            className="mt-1 w-full rounded-xl border border-soil-100 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-medium">
          Note
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-1 w-full rounded-xl border border-soil-100 px-3 py-2 font-normal"
          />
        </label>
        <button type="submit" className="w-fit rounded-full bg-leaf-600 px-5 py-2 text-sm font-semibold text-white">
          Save grant
        </button>
      </form>
      <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-soil-100">
        <table className="w-full text-left text-sm">
          <thead className="text-soil-900/60">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Through</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-soil-100">
                <td className="px-4 py-3">
                  <div>{row.email}</div>
                  <div className="text-xs text-soil-900/50">{row.grant_note}</div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={row.status}
                    onChange={(event) => setStatus(row, event.target.value)}
                    className="rounded-lg border border-soil-100 px-2 py-1"
                  >
                    {["active", "trialing", "inactive", "past_due", "canceled"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">{row.stripe_customer_id ? "stripe" : row.source}</td>
                <td className="px-4 py-3">{day(row.current_period_end)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AttributionPanel() {
  const [rows, setRows] = useState<AttributionRow[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});

  useEffect(() => {
    const client = browserSupabase();
    Promise.all([
      client.from("attributions").select("user_id,source,medium,campaign,content,referrer,landing_path,code,created_at").order("created_at", { ascending: false }),
      client.from("profiles").select("id,email"),
    ]).then(([touches, profiles]) => {
      setRows(touches.data ?? []);
      const next: Record<string, string> = {};
      for (const profile of profiles.data ?? []) next[profile.id] = profile.email ?? "";
      setEmails(next);
    });
  }, []);

  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = row.source || (row.referrer ? "referral visit" : "direct");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {[...counts.entries()].map(([source, count]) => (
          <div key={source} className="rounded-3xl bg-white p-4 ring-1 ring-soil-100">
            <p className="text-sm text-soil-900/60">{source}</p>
            <p className="font-display text-3xl font-semibold text-leaf-900">{count}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-soil-100">
        <table className="w-full text-left text-sm">
          <thead className="text-soil-900/60">
            <tr>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Campaign</th>
              <th className="px-4 py-3 font-medium">Code</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.user_id} className="border-t border-soil-100">
                <td className="px-4 py-3">{emails[row.user_id] || row.user_id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  {row.source || "—"}
                  <div className="text-xs text-soil-900/50">{row.medium}</div>
                </td>
                <td className="px-4 py-3">{row.campaign || "—"}</td>
                <td className="px-4 py-3">{row.code || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-soil-900/60">
        First visit is kept. Links look like cropplot.com/?utm_source=instagram&utm_campaign=spring&ref=code
      </p>
    </div>
  );
}

export function AgentsPanel({ onNotice }: { onNotice: (message: string) => void }) {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [payouts, setPayouts] = useState<{ agent_id: string; amount_cents: number }[]>([]);
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState({ name: "", email: "", code: "", commission_percent: "20", note: "" });
  const [pay, setPay] = useState<Record<string, string>>({});

  async function load() {
    const client = browserSupabase();
    const [agentRes, referralRes, payoutRes, profileRes, subRes] = await Promise.all([
      client.from("agents").select("id,name,email,code,status,commission_percent,note").order("created_at"),
      client.from("referrals").select("id,referrer_id,agent_id,referred_id,code,reward_status,created_at"),
      client.from("agent_payouts").select("agent_id,amount_cents"),
      client.from("profiles").select("id,email"),
      client.from("subscriptions").select("email,status"),
    ]);
    setAgents(agentRes.data ?? []);
    setReferrals(referralRes.data ?? []);
    setPayouts(payoutRes.data ?? []);
    const people: Record<string, string> = {};
    for (const profile of profileRes.data ?? []) people[profile.id] = (profile.email ?? "").toLowerCase();
    setProfiles(people);
    const nextPlans: Record<string, string> = {};
    for (const sub of subRes.data ?? []) nextPlans[sub.email.toLowerCase()] = sub.status;
    setPlans(nextPlans);
  }

  useEffect(() => {
    load();
  }, []);

  async function createAgent(event: FormEvent) {
    event.preventDefault();
    const { error } = await browserSupabase().from("agents").insert({
      name: draft.name.trim(),
      email: draft.email.trim() || null,
      code: draft.code.trim().toLowerCase(),
      commission_percent: Number(draft.commission_percent),
      note: draft.note.trim() || null,
    });
    onNotice(error ? error.message : "Agent saved.");
    if (!error) {
      setDraft({ name: "", email: "", code: "", commission_percent: "20", note: "" });
      load();
    }
  }

  async function setStatus(agent: AgentRow, status: string) {
    const { error } = await browserSupabase().from("agents").update({ status }).eq("id", agent.id);
    onNotice(error ? error.message : "Agent updated.");
    if (!error) load();
  }

  async function recordPayout(agentId: string) {
    const dollars = Number(pay[agentId]);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      onNotice("Enter a payout amount.");
      return;
    }
    const { error } = await browserSupabase().from("agent_payouts").insert({
      agent_id: agentId,
      amount_cents: Math.round(dollars * 100),
    });
    onNotice(error ? error.message : "Payout recorded.");
    if (!error) {
      setPay({ ...pay, [agentId]: "" });
      load();
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={createAgent} className="grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-soil-100 sm:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold text-leaf-900 sm:col-span-2">New agent</h2>
        <input required placeholder="Name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="rounded-xl border border-soil-100 px-3 py-2" />
        <input type="email" placeholder="Email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} className="rounded-xl border border-soil-100 px-3 py-2" />
        <input required placeholder="Code" value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} className="rounded-xl border border-soil-100 px-3 py-2" />
        <input required type="number" min="0" max="100" placeholder="Commission %" value={draft.commission_percent} onChange={(event) => setDraft({ ...draft, commission_percent: event.target.value })} className="rounded-xl border border-soil-100 px-3 py-2" />
        <input placeholder="Note" value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} className="rounded-xl border border-soil-100 px-3 py-2 sm:col-span-2" />
        <button type="submit" className="w-fit rounded-full bg-leaf-600 px-5 py-2 text-sm font-semibold text-white">
          Add agent
        </button>
      </form>
      <ul className="grid gap-3">
        {agents.map((agent) => {
          const invited = referrals.filter((row) => row.agent_id === agent.id);
          const pro = invited.filter((row) => {
            const address = profiles[row.referred_id];
            const status = address ? plans[address] : undefined;
            return status === "active" || status === "trialing";
          }).length;
          const earned = Math.round(pro * proYearCents * Number(agent.commission_percent) / 100);
          const paid = payouts.filter((row) => row.agent_id === agent.id).reduce((sum, row) => sum + row.amount_cents, 0);
          return (
            <li key={agent.id} className="rounded-3xl bg-white p-5 ring-1 ring-soil-100">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold">{agent.name}</span>
                <span className="text-sm text-soil-900/60">{agent.email}</span>
                <span className="rounded-full bg-soil-100 px-2 py-0.5 text-xs font-semibold">{agent.code}</span>
                <span className="text-sm">{agent.commission_percent}% of $35.99</span>
                <select value={agent.status} onChange={(event) => setStatus(agent, event.target.value)} className="rounded-lg border border-soil-100 px-2 py-1 text-sm">
                  <option value="active">active</option>
                  <option value="paused">paused</option>
                </select>
              </div>
              <p className="mt-3 text-sm text-soil-900/70">
                {invited.length} signups · {pro} Pro · earned {money(earned)} · paid {money(paid)} · due {money(Math.max(earned - paid, 0))}
              </p>
              <p className="mt-1 text-xs text-soil-900/50">Share https://cropplot.com/?ref={agent.code}</p>
              <div className="mt-3 flex gap-2">
                <input
                  inputMode="decimal"
                  placeholder="Payout USD"
                  value={pay[agent.id] ?? ""}
                  onChange={(event) => setPay({ ...pay, [agent.id]: event.target.value })}
                  className="w-32 rounded-xl border border-soil-100 px-3 py-2 text-sm"
                />
                <button type="button" onClick={() => recordPayout(agent.id)} className="rounded-full bg-soil-900 px-4 py-2 text-sm font-semibold text-white">
                  Record payout
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ReferralsPanel({ onNotice }: { onNotice: (message: string) => void }) {
  const [rows, setRows] = useState<ReferralRow[]>([]);
  const [people, setPeople] = useState<Record<string, ProfileLite>>({});
  const [agents, setAgents] = useState<Record<string, string>>({});

  async function load() {
    const client = browserSupabase();
    const [referralRes, profileRes, agentRes] = await Promise.all([
      client.from("referrals").select("id,referrer_id,agent_id,referred_id,code,reward_status,created_at").order("created_at", { ascending: false }),
      client.from("profiles").select("id,email,referral_code"),
      client.from("agents").select("id,name"),
    ]);
    setRows(referralRes.data ?? []);
    const next: Record<string, ProfileLite> = {};
    for (const profile of profileRes.data ?? []) next[profile.id] = profile;
    setPeople(next);
    const names: Record<string, string> = {};
    for (const agent of agentRes.data ?? []) names[agent.id] = agent.name;
    setAgents(names);
  }

  useEffect(() => {
    load();
  }, []);

  async function grant(id: string) {
    const { error } = await browserSupabase().from("referrals").update({ reward_status: "granted" }).eq("id", id);
    onNotice(error ? error.message : "Reward marked granted.");
    if (!error) load();
  }

  const memberRows = rows.filter((row) => row.referrer_id);
  const byReferrer = new Map<string, number>();
  for (const row of memberRows) {
    if (!row.referrer_id) continue;
    byReferrer.set(row.referrer_id, (byReferrer.get(row.referrer_id) ?? 0) + 1);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-soil-100">
        <h2 className="font-display text-2xl font-semibold text-leaf-900">Member invites</h2>
        <p className="mt-2 text-sm text-soil-900/70">
          Every account has an invite code. A friend who opens cropplot.com/?ref=code and signs in is listed here. Mark the reward granted after you comp the inviter.
        </p>
        <ul className="mt-4 space-y-1 text-sm">
          {[...byReferrer.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, count]) => (
              <li key={id}>
                {people[id]?.email} · {count}
              </li>
            ))}
        </ul>
      </div>
      <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-soil-100">
        <table className="w-full text-left text-sm">
          <thead className="text-soil-900/60">
            <tr>
              <th className="px-4 py-3 font-medium">New member</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Reward</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-soil-100">
                <td className="px-4 py-3">{people[row.referred_id]?.email}</td>
                <td className="px-4 py-3">
                  {row.agent_id ? agents[row.agent_id] : people[row.referrer_id ?? ""]?.email}
                  <div className="text-xs text-soil-900/50">{row.code}</div>
                </td>
                <td className="px-4 py-3">
                  {row.reward_status === "pending" ? (
                    <button type="button" className="text-leaf-700" onClick={() => grant(row.id)}>
                      Mark granted
                    </button>
                  ) : (
                    row.reward_status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
