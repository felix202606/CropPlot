-- Admin role, editable homepage copy, and campaign banners.

alter table public.profiles
  add column if not exists role text not null default 'user';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'admin'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and current_user not in ('postgres', 'supabase_admin')
     and coalesce(auth.role(), '') <> 'service_role'
     and not public.is_admin() then
    raise exception 'Only an admin can change roles';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case
      when lower(coalesce(new.email, '')) = 'cropplotapp@gmail.com' then 'admin'
      else 'user'
    end
  );

  update public.subscriptions
  set user_id = new.id
  where user_id is null and lower(email) = lower(new.email);

  return new;
end;
$$;

update public.profiles
set role = 'admin'
where lower(email) = 'cropplotapp@gmail.com';

drop policy if exists "admin read profiles" on public.profiles;
create policy "admin read profiles" on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists "admin update profiles" on public.profiles;
create policy "admin update profiles" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin read subscriptions" on public.subscriptions;
create policy "admin read subscriptions" on public.subscriptions
  for select to authenticated using (public.is_admin());

create table if not exists public.site_copy (
  slug text primary key,
  label text not null,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  audience text not null check (audience in ('web', 'app')),
  title text not null,
  body text not null default '',
  cta_label text,
  cta_url text,
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.site_copy enable row level security;
alter table public.banners enable row level security;

drop policy if exists "public read site copy" on public.site_copy;
create policy "public read site copy" on public.site_copy
  for select using (true);

drop policy if exists "admin write site copy" on public.site_copy;
create policy "admin write site copy" on public.site_copy
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read banners" on public.banners;
create policy "read banners" on public.banners
  for select using (
    public.is_admin()
    or (
      active
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now())
    )
  );

drop policy if exists "admin write banners" on public.banners;
create policy "admin write banners" on public.banners
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.site_copy to anon, authenticated;
grant insert, update, delete on public.site_copy to authenticated;
grant select on public.banners to anon, authenticated;
grant insert, update, delete on public.banners to authenticated;

insert into public.site_copy (slug, label, data)
values
  (
    'home',
    'Homepage',
    '{
      "eyebrow": "🌱 Coming soon to iOS & Android",
      "headline": "Grow more food.\nLose fewer plants.",
      "subhead": "CropPlot is the smart garden planner for home growers. Map your beds, get watering and harvest reminders, diagnose sick plants with a photo, and get warned before frost hits.",
      "primaryLabel": "Start free",
      "primaryHref": "#download",
      "secondaryLabel": "See features",
      "secondaryHref": "#features",
      "footnote": "Free forever for unlimited plants. Pro from $35.99/year."
    }'::jsonb
  ),
  (
    'download',
    'Download band',
    '{
      "title": "Your best season starts here",
      "body": "CropPlot is launching soon on the App Store and Google Play. Want early access?",
      "cta": "Join the early access list"
    }'::jsonb
  )
on conflict (slug) do nothing;
