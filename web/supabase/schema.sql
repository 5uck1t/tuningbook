-- =====================================================================
--  TuningBook — Supabase setup
--  Paste this whole file into Supabase → SQL Editor → New query → Run.
--  Safe to run more than once.
-- =====================================================================

-- ---------- tables ----------

-- Per-user settings (currency, …)
create table if not exists public.settings (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  currency   text not null default 'EUR',
  updated_at timestamptz not null default now()
);

create table if not exists public.cars (
  id         uuid primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 80),
  make       text,
  model      text,
  year       text,
  notes      text,
  cover      jsonb,                         -- {"file": "...", "preview": "...", "name": "..."} or null
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mods (
  id          uuid primary key,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  car_id      uuid not null references public.cars (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 120),
  price       numeric(12, 2) not null default 0 check (price >= 0),
  date        date,
  mileage     integer check (mileage >= 0),
  category    text,
  description text,
  photos      jsonb not null default '[]',  -- [{"id","file","preview","name"}, …]
  receipts    jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.plan_items (
  id         uuid primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  car_id     uuid not null references public.cars (id) on delete cascade,
  title      text not null check (char_length(title) between 1 and 120),
  price      numeric(12, 2) not null default 0 check (price >= 0),
  priority   text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  category   text,
  link       text,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cars_user_idx       on public.cars (user_id);
create index if not exists mods_car_idx        on public.mods (car_id);
create index if not exists mods_user_idx       on public.mods (user_id);
create index if not exists plan_items_car_idx  on public.plan_items (car_id);
create index if not exists plan_items_user_idx on public.plan_items (user_id);

-- Keep updated_at current on every change.
create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists touch_settings   on public.settings;
drop trigger if exists touch_cars       on public.cars;
drop trigger if exists touch_mods       on public.mods;
drop trigger if exists touch_plan_items on public.plan_items;
create trigger touch_settings   before update on public.settings   for each row execute function public.touch_updated_at();
create trigger touch_cars       before update on public.cars       for each row execute function public.touch_updated_at();
create trigger touch_mods       before update on public.mods       for each row execute function public.touch_updated_at();
create trigger touch_plan_items before update on public.plan_items for each row execute function public.touch_updated_at();

-- ---------- security: every user sees only their own rows ----------

alter table public.settings   enable row level security;
alter table public.cars       enable row level security;
alter table public.mods       enable row level security;
alter table public.plan_items enable row level security;

drop policy if exists "own settings"   on public.settings;
drop policy if exists "own cars"       on public.cars;
drop policy if exists "own mods"       on public.mods;
drop policy if exists "own plan items" on public.plan_items;

create policy "own settings" on public.settings for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own cars" on public.cars for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Mods / plan items must also belong to a car the user owns.
create policy "own mods" on public.mods for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.cars c where c.id = car_id and c.user_id = (select auth.uid()))
  );

create policy "own plan items" on public.plan_items for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.cars c where c.id = car_id and c.user_id = (select auth.uid()))
  );

-- ---------- photo storage ----------
-- Private bucket; files live at  <user id>/<file name>.
-- The app compresses every photo to JPEG before upload (photos ≤1600 px, receipts ≤2400 px),
-- so 5 MB per file is a generous safety limit.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', false, 5242880, array['image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "own photos read"   on storage.objects;
drop policy if exists "own photos insert" on storage.objects;
drop policy if exists "own photos update" on storage.objects;
drop policy if exists "own photos delete" on storage.objects;

create policy "own photos read" on storage.objects for select to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "own photos insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "own photos update" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "own photos delete" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Done. You should now see settings, cars, mods and plan_items in the Table Editor
-- and a "photos" bucket under Storage.
