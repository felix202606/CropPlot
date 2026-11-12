"use client";

import { AgentsPanel, AttributionPanel, ReferralsPanel, SubscriptionsPanel } from "@/components/admin/OperatePanels";
import { asDownloadCopy, asHomeCopy, type DownloadCopy, type HomeCopy } from "@/lib/home-copy";
import { browserSupabase } from "@/lib/supabase-browser";
import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

type Tab = "users" | "subscriptions" | "attribution" | "agents" | "referrals" | "content" | "banners";

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  referral_code: string;
  created_at: string;
};

type Banner = {
  id: string;
  audience: "web" | "app";
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

const emptyBanner = {
  audience: "app" as "web" | "app",
  title: "",
  body: "",
  cta_label: "",
  cta_url: "",
  active: false,
  starts_at: "",
  ends_at: "",
};

function dateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

function startStamp(value: string) {
  return value ? `${value}T00:00:00.000Z` : null;
}

function endStamp(value: string) {
  return value ? `${value}T23:59:59.000Z` : null;
}

export function AdminApp() {
  const [tab, setTab] = useState<Tab>("users");
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const auth = browserSupabase().auth;
    auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) {
      setAdmin(false);
      setReady(true);
      return;
    }
    setReady(false);
    browserSupabase()
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setAdmin(data?.role === "admin");
        setReady(true);
      });
  }, [session]);

  if (!ready) return <p className="text-center text-soil-900/70">Loading…</p>;
  if (!session) return <AdminSignIn />;
  if (!admin) {
    return (
      <p className="text-center text-soil-900/70">
        {session.user.email} is not an admin.{" "}
        <button className="text-leaf-700 underline" onClick={() => browserSupabase().auth.signOut()}>
          Sign out
        </button>
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap gap-2">
        {(
          [
            ["users", "Users"],
            ["subscriptions", "Subscriptions"],
            ["attribution", "Attribution"],
            ["agents", "Agents"],
            ["referrals", "Referrals"],
            ["content", "Web content"],
            ["banners", "Banners"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setNotice(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === id ? "bg-leaf-600 text-white" : "bg-white ring-1 ring-soil-100"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="ml-auto text-sm text-leaf-700"
          onClick={() => browserSupabase().auth.signOut()}
        >
          Sign out
        </button>
      </div>
      {notice ? <p className="mb-4 text-sm text-leaf-700">{notice}</p> : null}
      {tab === "users" ? <UsersPanel onNotice={setNotice} /> : null}
      {tab === "subscriptions" ? <SubscriptionsPanel onNotice={setNotice} /> : null}
      {tab === "attribution" ? <AttributionPanel /> : null}
      {tab === "agents" ? <AgentsPanel onNotice={setNotice} /> : null}
      {tab === "referrals" ? <ReferralsPanel onNotice={setNotice} /> : null}
      {tab === "content" ? <ContentPanel onNotice={setNotice} /> : null}
      {tab === "banners" ? <BannersPanel onNotice={setNotice} /> : null}
    </div>
  );
}

function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const { error } = await browserSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setMessage(error ? error.message : null);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-md flex-col gap-3">
      <p className="text-sm text-soil-900/70">Sign in with an admin account.</p>
      <button
        type="button"
        className="rounded-full border border-soil-100 bg-white px-5 py-3 text-sm font-semibold"
        onClick={() =>
          browserSupabase().auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/admin/` },
          })
        }
      >
        Continue with Google
      </button>
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="rounded-xl border border-soil-100 px-3 py-2"
      />
      <input
        type="password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        className="rounded-xl border border-soil-100 px-3 py-2"
      />
      {message ? <p className="text-sm text-red-700">{message}</p> : null}
      <button type="submit" className="rounded-full bg-leaf-600 px-5 py-3 text-sm font-semibold text-white">
        Sign in
      </button>
    </form>
  );
}

function UsersPanel({ onNotice }: { onNotice: (message: string) => void }) {
  const [rows, setRows] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [sources, setSources] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");

  async function load() {
    const client = browserSupabase();
    const [{ data: profiles }, { data: subs }, { data: touches }] = await Promise.all([
      client.from("profiles").select("id,email,display_name,role,referral_code,created_at").order("created_at"),
      client.from("subscriptions").select("email,status"),
      client.from("attributions").select("user_id,source,code"),
    ]);
    setRows(profiles ?? []);
    const next: Record<string, string> = {};
    for (const sub of subs ?? []) next[sub.email.toLowerCase()] = sub.status;
    setPlans(next);
    const from: Record<string, string> = {};
    for (const touch of touches ?? []) from[touch.user_id] = touch.source || touch.code || "direct";
    setSources(from);
  }

  useEffect(() => {
    load();
  }, []);

  async function setRole(id: string, role: string) {
    const { error } = await browserSupabase().from("profiles").update({ role }).eq("id", id);
    onNotice(error ? error.message : "Role saved.");
    if (!error) load();
  }

  const visible = rows.filter((row) => {
    const haystack = `${row.email ?? ""} ${row.display_name ?? ""} ${row.referral_code}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="grid gap-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search email or invite code"
        className="rounded-xl border border-soil-100 bg-white px-3 py-2"
      />
      <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-soil-100">
      <table className="w-full text-left text-sm">
        <thead className="text-soil-900/60">
          <tr>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Invite code</th>
            <th className="px-4 py-3 font-medium">Role</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => {
            const status = row.email ? plans[row.email.toLowerCase()] : undefined;
            const plan = status === "active" || status === "trialing" ? "Pro" : "Free";
            return (
              <tr key={row.id} className="border-t border-soil-100">
                <td className="px-4 py-3">
                  <div>{row.email}</div>
                  <div className="text-xs text-soil-900/50">{row.display_name}</div>
                </td>
                <td className="px-4 py-3">{plan}</td>
                <td className="px-4 py-3">{sources[row.id] || "—"}</td>
                <td className="px-4 py-3">{row.referral_code}</td>
                <td className="px-4 py-3">
                  <select
                    value={row.role}
                    onChange={(event) => setRole(row.id, event.target.value)}
                    className="rounded-lg border border-soil-100 px-2 py-1"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function ContentPanel({ onNotice }: { onNotice: (message: string) => void }) {
  const [home, setHome] = useState<HomeCopy | null>(null);
  const [download, setDownload] = useState<DownloadCopy | null>(null);

  useEffect(() => {
    browserSupabase()
      .from("site_copy")
      .select("slug,data")
      .in("slug", ["home", "download"])
      .then(({ data }) => {
        const bySlug = Object.fromEntries((data ?? []).map((row) => [row.slug, row.data]));
        setHome(asHomeCopy(bySlug.home));
        setDownload(asDownloadCopy(bySlug.download));
      });
  }, []);

  async function save(slug: string, label: string, data: HomeCopy | DownloadCopy) {
    const { error } = await browserSupabase().from("site_copy").upsert({
      slug,
      label,
      data,
      updated_at: new Date().toISOString(),
    });
    onNotice(error ? error.message : "Page copy saved.");
  }

  if (!home || !download) return <p>Loading…</p>;

  return (
    <div className="grid gap-8">
      <form
        className="grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-soil-100"
        onSubmit={(event) => {
          event.preventDefault();
          save("home", "Homepage", home);
        }}
      >
        <h2 className="font-display text-2xl font-semibold text-leaf-900">Homepage</h2>
        <Field label="Eyebrow" value={home.eyebrow} onChange={(eyebrow) => setHome({ ...home, eyebrow })} />
        <Area label="Headline" value={home.headline} onChange={(headline) => setHome({ ...home, headline })} />
        <Area label="Intro" value={home.subhead} onChange={(subhead) => setHome({ ...home, subhead })} />
        <Field label="Primary button" value={home.primaryLabel} onChange={(primaryLabel) => setHome({ ...home, primaryLabel })} />
        <Field label="Primary link" value={home.primaryHref} onChange={(primaryHref) => setHome({ ...home, primaryHref })} />
        <Field label="Secondary button" value={home.secondaryLabel} onChange={(secondaryLabel) => setHome({ ...home, secondaryLabel })} />
        <Field label="Secondary link" value={home.secondaryHref} onChange={(secondaryHref) => setHome({ ...home, secondaryHref })} />
        <Field label="Footnote" value={home.footnote} onChange={(footnote) => setHome({ ...home, footnote })} />
        <Save />
      </form>
      <form
        className="grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-soil-100"
        onSubmit={(event) => {
          event.preventDefault();
          save("download", "Download band", download);
        }}
      >
        <h2 className="font-display text-2xl font-semibold text-leaf-900">Download band</h2>
        <Field label="Title" value={download.title} onChange={(title) => setDownload({ ...download, title })} />
        <Area label="Body" value={download.body} onChange={(body) => setDownload({ ...download, body })} />
        <Field label="Button" value={download.cta} onChange={(cta) => setDownload({ ...download, cta })} />
        <Save />
      </form>
      <p className="text-sm text-soil-900/60">
        Preview the homepage after saving. <Link href="/" className="text-leaf-700 underline">Open home</Link>
      </p>
    </div>
  );
}

function BannersPanel({ onNotice }: { onNotice: (message: string) => void }) {
  const [rows, setRows] = useState<Banner[]>([]);
  const [draft, setDraft] = useState(emptyBanner);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    const { data } = await browserSupabase()
      .from("banners")
      .select("id,audience,title,body,cta_label,cta_url,active,starts_at,ends_at")
      .order("updated_at", { ascending: false });
    setRows(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function payload() {
    return {
      audience: draft.audience,
      title: draft.title.trim(),
      body: draft.body,
      cta_label: draft.cta_label.trim() || null,
      cta_url: draft.cta_url.trim() || null,
      active: draft.active,
      starts_at: startStamp(draft.starts_at),
      ends_at: endStamp(draft.ends_at),
      updated_at: new Date().toISOString(),
    };
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const client = browserSupabase();
    const { error } = editing
      ? await client.from("banners").update(payload()).eq("id", editing)
      : await client.from("banners").insert(payload());
    onNotice(error ? error.message : "Banner saved.");
    if (!error) {
      setDraft(emptyBanner);
      setEditing(null);
      load();
    }
  }

  async function remove(id: string) {
    const { error } = await browserSupabase().from("banners").delete().eq("id", id);
    onNotice(error ? error.message : "Banner deleted.");
    if (!error) load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={save} className="grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-soil-100">
        <h2 className="font-display text-2xl font-semibold text-leaf-900">
          {editing ? "Edit banner" : "New banner"}
        </h2>
        <label className="text-sm font-medium">
          Where it shows
          <select
            value={draft.audience}
            onChange={(event) => setDraft({ ...draft, audience: event.target.value as "web" | "app" })}
            className="mt-1 w-full rounded-xl border border-soil-100 px-3 py-2"
          >
            <option value="app">App home</option>
            <option value="web">Website</option>
          </select>
        </label>
        <Field label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
        <Area label="Activity page" value={draft.body} onChange={(body) => setDraft({ ...draft, body })} />
        <Field label="Button label" value={draft.cta_label} onChange={(cta_label) => setDraft({ ...draft, cta_label })} />
        <Field label="Button link" value={draft.cta_url} onChange={(cta_url) => setDraft({ ...draft, cta_url })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Starts" type="date" value={draft.starts_at} onChange={(starts_at) => setDraft({ ...draft, starts_at })} />
          <Field label="Ends" type="date" value={draft.ends_at} onChange={(ends_at) => setDraft({ ...draft, ends_at })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
          />
          Visible now
        </label>
        <div className="flex gap-3">
          <Save label={editing ? "Update banner" : "Create banner"} />
          {editing ? (
            <button
              type="button"
              className="text-sm text-soil-900/70"
              onClick={() => {
                setEditing(null);
                setDraft(emptyBanner);
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      <ul className="grid gap-3">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl bg-white p-4 ring-1 ring-soil-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-soil-100 px-2 py-0.5 text-xs font-semibold uppercase">{row.audience}</span>
              <span className="font-semibold">{row.title}</span>
              <span className="text-xs text-soil-900/50">{row.active ? "Visible" : "Hidden"}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-soil-900/70">{row.body}</p>
            <div className="mt-3 flex gap-4 text-sm">
              <button
                type="button"
                className="text-leaf-700"
                onClick={() => {
                  setEditing(row.id);
                  setDraft({
                    audience: row.audience,
                    title: row.title,
                    body: row.body,
                    cta_label: row.cta_label ?? "",
                    cta_url: row.cta_url ?? "",
                    active: row.active,
                    starts_at: dateInput(row.starts_at),
                    ends_at: dateInput(row.ends_at),
                  });
                }}
              >
                Edit
              </button>
              {row.audience === "web" ? (
                <Link href={`/activity/?id=${row.id}`} className="text-leaf-700">
                  Open page
                </Link>
              ) : null}
              <button type="button" className="text-red-700" onClick={() => remove(row.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-soil-100 px-3 py-2 font-normal"
      />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-soil-100 px-3 py-2 font-normal"
      />
    </label>
  );
}

function Save({ label = "Save" }: { label?: string }) {
  return (
    <button type="submit" className="w-fit rounded-full bg-leaf-600 px-5 py-2 text-sm font-semibold text-white">
      {label}
    </button>
  );
}
