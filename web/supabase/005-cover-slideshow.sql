-- =====================================================================
--  TuningBook — cover photo slideshow (run after 004-sharing.sql)
--  Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.
--  Only ADDS a column and updates two functions — existing data is not changed.
--
--  A car can have up to 5 cover photos: `cover` is the main one (garage card, PDF, build card),
--  the new `gallery` column holds up to 4 more. The car page shows them as a slideshow.
-- =====================================================================

alter table public.cars add column if not exists gallery jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'cars_gallery_max') then
    alter table public.cars add constraint cars_gallery_max
      check (jsonb_typeof(gallery) = 'array' and jsonb_array_length(gallery) <= 4);
  end if;
end $$;

-- ---------- the public page's data: now includes the extra cover photos ----------
create or replace function public.get_shared_build(p_share_id text) returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'owner', c.user_id,
    'currency', coalesce((select s.currency from public.settings s where s.user_id = c.user_id), 'EUR'),
    'car', jsonb_build_object(
      'id', c.id, 'name', c.name, 'make', c.make, 'model', c.model, 'year', c.year,
      'cover', c.cover, 'gallery', c.gallery, 'share_prices', c.share_prices),
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

-- ---------- photos of shared cars: cover photos (main + gallery) and build photos ----------
-- Receipts are still never included.
create or replace function public.is_shared_photo(object_name text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.cars c
    where c.share_id is not null
      and c.user_id::text = split_part(object_name, '/', 1)
      and (
        c.cover ->> 'file' = split_part(object_name, '/', 2)
        or c.gallery @> jsonb_build_array(jsonb_build_object('file', split_part(object_name, '/', 2)))
        or exists (
          select 1 from public.mods m
          where m.car_id = c.id
            and m.photos @> jsonb_build_array(jsonb_build_object('file', split_part(object_name, '/', 2)))
        )
      )
  );
$$;

grant execute on function public.is_shared_photo(text) to anon, authenticated;
