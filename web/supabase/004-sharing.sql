-- =====================================================================
--  TuningBook — public build links (run after schema.sql)
--  Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.
--  Only ADDS columns, functions and rules — existing data is not changed.
--
--  A car is public while it has a share_id. Anyone with the link (…/#/b/<name>-<share_id>) can see:
--    the car's name / make / model / year / cover, its modifications (title, category, date, km,
--    description, build photos) and — only if share_prices is on — prices.
--  Never public: receipts, the plan, car notes, settings, other cars.
-- =====================================================================

alter table public.cars add column if not exists share_id     text;
alter table public.cars add column if not exists share_prices boolean not null default true;

create unique index if not exists cars_share_id_idx on public.cars (share_id) where share_id is not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'cars_share_id_format') then
    alter table public.cars add constraint cars_share_id_format
      check (share_id is null or share_id ~ '^[A-Za-z0-9]{10,32}$');
  end if;
end $$;

-- ---------- the public page's data ----------
-- Returns one shared car with its modifications, or null. Only the fields listed here leave the
-- database (no receipts / plan / notes; prices only when share_prices is on).
create or replace function public.get_shared_build(p_share_id text) returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'owner', c.user_id,
    'currency', coalesce((select s.currency from public.settings s where s.user_id = c.user_id), 'EUR'),
    'car', jsonb_build_object(
      'id', c.id, 'name', c.name, 'make', c.make, 'model', c.model, 'year', c.year,
      'cover', c.cover, 'share_prices', c.share_prices),
    'mods', coalesce((
      select jsonb_agg(jsonb_build_object(
          'id', m.id, 'title', m.title, 'category', m.category, 'date', m.date, 'mileage', m.mileage,
          'price', case when c.share_prices then m.price end,
          'description', m.description, 'photos', m.photos)
        order by m.date desc nulls last, m.created_at desc)
      from public.mods m where m.car_id = c.id), '[]'::jsonb)
  )
  from public.cars c
  where p_share_id ~ '^[A-Za-z0-9]{10,32}$' and c.share_id = p_share_id;
$$;

grant execute on function public.get_shared_build(text) to anon, authenticated;

-- ---------- photos of shared cars ----------
-- true when a stored file (<owner id>/<file>) is the cover or a build photo of a shared car.
-- Receipts are deliberately not included.
create or replace function public.is_shared_photo(object_name text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.cars c
    where c.share_id is not null
      and c.user_id::text = split_part(object_name, '/', 1)
      and (
        c.cover ->> 'file' = split_part(object_name, '/', 2)
        or exists (
          select 1 from public.mods m
          where m.car_id = c.id
            and m.photos @> jsonb_build_array(jsonb_build_object('file', split_part(object_name, '/', 2)))
        )
      )
  );
$$;

grant execute on function public.is_shared_photo(text) to anon, authenticated;

drop policy if exists "shared photos read" on storage.objects;
create policy "shared photos read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'photos' and public.is_shared_photo(name));
