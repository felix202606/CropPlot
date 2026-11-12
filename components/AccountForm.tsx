"use client";

import { browserSupabase } from "@/lib/supabase-browser";
import { syncGrowth } from "@/lib/growth";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState, type FormEvent } from "react";

function supabase() {
  return browserSupabase();
}

export function AccountForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [plan, setPlan] = useState<"Free" | "Pro" | null>(null);
  const [invite, setInvite] = useState<{ code: string; invited: number } | null>(null);

  useEffect(() => {
    const auth = supabase().auth;
    auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const address = session?.user.email;
    if (!address) {
      setPlan(null);
      return;
    }
    let cancelled = false;
    const userId = session.user.id;
    supabase()
      .from("subscriptions")
      .select("status")
      .eq("email", address)
      .limit(1)
      .then(({ data }) => {
        if (cancelled) return;
        const status = data?.[0]?.status;
        setPlan(status === "active" || status === "trialing" ? "Pro" : "Free");
      });
    syncGrowth(userId).then((result) => {
      if (!cancelled && result) setInvite(result);
    });
    return () => {
      cancelled = true;
    };
  }, [session]);

  function redirectTo() {
    return `${window.location.origin}/account/`;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || password.length < 6) {
      setError(true);
      setMessage("Use an email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    setMessage(null);
    const auth = supabase().auth;
    const result = creating
      ? await auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: redirectTo() },
        })
      : await auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (result.error) {
      setError(true);
      setMessage(result.error.message);
      return;
    }
    if (creating && !result.data.session) {
      setError(false);
      setMessage("Check your email to confirm the account, then sign in.");
    }
  }

  async function oauth(provider: "google" | "apple") {
    setBusy(true);
    setMessage(null);
    const { error: oauthError } = await supabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo() },
    });
    if (oauthError) {
      setBusy(false);
      setError(true);
      setMessage(oauthError.message);
    }
  }

  if (session?.user.email) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-soil-100">
        <p className="text-sm text-soil-900/70">Signed in</p>
        <p className="mt-1 text-lg font-semibold">{session.user.email}</p>
        <p className="mt-4 text-sm">
          Plan: <span className="font-semibold">{plan ?? "Checking…"}</span>
        </p>
        {invite?.code ? (
          <p className="mt-4 text-sm text-soil-900/80">
            Invite link: https://cropplot.com/?ref={invite.code}
            <span className="mt-1 block text-soil-900/60">{invite.invited} friends joined</span>
          </p>
        ) : null}
        <button
          type="button"
          className="mt-6 rounded-full bg-soil-900 px-5 py-2 text-sm font-semibold text-white"
          onClick={() => supabase().auth.signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex max-w-md flex-col gap-3 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-soil-100"
    >
      <button
        type="button"
        disabled={busy}
        onClick={() => oauth("google")}
        className="rounded-full border border-soil-100 px-5 py-3 text-sm font-semibold hover:bg-soil-50 disabled:opacity-60"
      >
        Continue with Google
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => oauth("apple")}
        className="rounded-full bg-soil-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        Continue with Apple
      </button>
      <p className="py-2 text-center text-sm text-soil-900/60">or use email</p>
      <label className="text-sm font-medium" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="rounded-xl border border-soil-100 px-3 py-2"
      />
      <label className="text-sm font-medium" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        autoComplete={creating ? "new-password" : "current-password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="rounded-xl border border-soil-100 px-3 py-2"
      />
      {message ? (
        <p className={error ? "text-sm text-red-700" : "text-sm text-leaf-700"}>{message}</p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-2 rounded-full bg-leaf-600 px-5 py-3 text-sm font-semibold text-white hover:bg-leaf-700 disabled:opacity-60"
      >
        {busy ? "Please wait…" : creating ? "Create account" : "Sign in"}
      </button>
      <button
        type="button"
        disabled={busy}
        className="text-sm font-medium text-leaf-700"
        onClick={() => {
          setCreating((value) => !value);
          setMessage(null);
        }}
      >
        {creating ? "I already have an account" : "Create an account"}
      </button>
    </form>
  );
}
