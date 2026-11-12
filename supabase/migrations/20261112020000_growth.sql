-- Invite codes, first-touch attribution, agents, and member referrals.

alter table public.profiles
  add column if not exists referral_code text;

alter table public.subscriptions
  add column if not exists source text not null default 'stripe';

alter table public.subscriptions
  drop constraint if exists subscriptions_source_check;

alter table public.subscriptions
  add constraint subscriptions_source_check check (source in ('stripe', 'manual'));

alter table public.subscriptions
  add column if not exists grant_note text;

update public.profiles
set referral_code = lower(substr(replace(id::text, '-', ''), 1, 8))
where referral_code is null;

alter table public.profiles
  alter column referral_code set not null;

create unique index if not exists profiles_referral_code_key
  on public.profiles (lower(referral_code));

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  privileged boolean := current_user in ('postgres', 'supabase_admin')
    or coalesce(auth.role(), '') = 'service_role'
    or public.is_admin();
begin
  if new.role is distinct from old.role and not privileged then
    raise exception 'Only an admin can change roles';
  end if;
  if new.referral_code is distinct from old.referral_code and not privileged then
    raise exception 'Only an admin can change invite codes';
  end if;
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, referral_code)
  values (
    new.id,
    new.email,
    case
      when lower(coalesce(new.email, '')) = 'cropplotapp@gmail.com' then 'admin'
      else 'user'
    end,
    lower(substr(replace(new.id::text, '-', ''), 1, 8))
  );

  update public.subscriptions
  set user_id = new.id
  where user_id is null and lower(email) = lower(new.email);

  return new;
end;
$$;

create table if not exists public.attributions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  source text,
  medium text,
  campaign text,
  content text,
  referrer text,
  landing_path text,
  code text,
  created_at timestamptz not null default now()
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  code text not null,
  status text not null default 'active' check (status in ('active', 'paused')),
  commission_percent numeric not null default 20 check (commission_percent >= 0 and commission_percent <= 100),
  note text,
  created_at timestamptz not null default now()
);

create unique index if not exists agents_code_key on public.agents (lower(code));

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references public.profiles (id) on delete cascade,
  agent_id uuid references public.agents (id) on delete restrict,
  referred_id uuid not null unique references public.profiles (id) on delete cascade,
  code text not null,
  reward_status text not null default 'pending' check (reward_status in ('pending', 'granted', 'none')),
  created_at timestamptz not null default now(),
  check (num_nonnulls(referrer_id, agent_id) = 1)
);

create table if not exists public.agent_payouts (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents (id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  note text,
  paid_at timestamptz not null default now()
);

create or replace function public.protect_agent_code()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.code = lower(btrim(new.code));
  if new.code !~ '^[a-z0-9]{3,16}$' then
    raise exception 'Agent code must be 3 to 16 letters or numbers';
  end if;
  if exists (
    select 1 from public.profiles
    where lower(referral_code) = new.code
  ) then
    raise exception 'That code is already a member invite code';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_agent_code on public.agents;
create trigger protect_agent_code
  before insert or update on public.agents
  for each row execute function public.protect_agent_code();

create or replace function public.claim_referral(referral_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  normalized text := lower(btrim(coalesce(referral_code, '')));
  found_agent uuid;
  found_referrer uuid;
begin
  if me is null or normalized = '' then
    return;
  end if;
  if exists (select 1 from public.referrals where referred_id = me) then
    return;
  end if;

  select id into found_agent
  from public.agents
  where lower(code) = normalized and status = 'active'
  limit 1;

  if found_agent is not null then
    insert into public.referrals (agent_id, referred_id, code, reward_status)
    values (found_agent, me, normalized, 'none');
    return;
  end if;

  select id into found_referrer
  from public.profiles
  where lower(referral_code) = normalized and id <> me
  limit 1;

  if found_referrer is not null then
    insert into public.referrals (referrer_id, referred_id, code, reward_status)
    values (found_referrer, me, normalized, 'pending');
  end if;
end;
$$;

revoke all on function public.claim_referral(text) from public;
grant execute on function public.claim_referral(text) to authenticated;

alter table public.attributions enable row level security;
alter table public.agents enable row level security;
alter table public.referrals enable row level security;
alter table public.agent_payouts enable row level security;

drop policy if exists "insert own attribution" on public.attributions;
create policy "insert own attribution" on public.attributions
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "read own attribution" on public.attributions;
create policy "read own attribution" on public.attributions
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin write attribution" on public.attributions;
create policy "admin write attribution" on public.attributions
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin agents" on public.agents;
create policy "admin agents" on public.agents
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read own referrals" on public.referrals;
create policy "read own referrals" on public.referrals
  for select to authenticated
  using (referrer_id = auth.uid() or referred_id = auth.uid() or public.is_admin());

drop policy if exists "admin write referrals" on public.referrals;
create policy "admin write referrals" on public.referrals
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin payouts" on public.agent_payouts;
create policy "admin payouts" on public.agent_payouts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin insert subscriptions" on public.subscriptions;
create policy "admin insert subscriptions" on public.subscriptions
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin update subscriptions" on public.subscriptions;
create policy "admin update subscriptions" on public.subscriptions
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.attributions to authenticated;
grant select, insert, update, delete on public.agents to authenticated;
grant select, insert, update, delete on public.referrals to authenticated;
grant select, insert, update, delete on public.agent_payouts to authenticated;
