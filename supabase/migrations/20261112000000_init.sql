-- CropPlot core schema.
-- Auth users live in auth.users (Supabase Auth).
-- Diagnosis photos live in Cloudflare R2; this table stores the object key and result.
-- Avatars use the built-in Supabase Storage bucket created below.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  email text not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'inactive',
  price_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create unique index subscriptions_email_lower_key on public.subscriptions (lower(email));

-- One JSONB document per plant: { name, emoji, good: [{slug, reason}], avoid: [...] }
create table public.companion_matrix (
  slug text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plant_slug text,
  image_key text,
  result jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.companion_matrix enable row level security;
alter table public.diagnoses enable row level security;

create policy "read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "read own subscription" on public.subscriptions
  for select to authenticated using (
    auth.uid() = user_id
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "public read companion matrix" on public.companion_matrix
  for select using (true);

create policy "manage own diagnoses" on public.diagnoses
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Writes to subscriptions come from the Stripe webhook using the service role,
-- which bypasses row level security.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);

  update public.subscriptions
  set user_id = new.id
  where user_id is null and lower(email) = lower(new.email);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "users upload own avatar" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
