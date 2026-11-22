-- =====================================================================
--  TuningBook — admin role (run after schema.sql)
--  Paste into Supabase → SQL Editor → New query → Run. Safe to run more than once.
--
--  Admins can SEE everyone's garage (read-only) and the list of registered users.
--  They can't change or delete anything that isn't theirs: every write still goes through the
--  "own …" policies in schema.sql.
-- =====================================================================

-- ---------- who is an admin ----------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Row-level security ON with no policies = nobody can read or change this table through the
-- app / API, not even admins. Admins are added here in the SQL Editor (see the bottom).
alter table public.admins enable row level security;

-- true when the signed-in user is an admin. "security definer" lets it look into the locked
-- admins table; it only ever answers about the caller.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------- list of registered users (admins only) ----------

drop function if exists public.admin_list_users();
create function public.admin_list_users()
returns table (
  id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz, is_admin boolean,
  cars bigint, mods bigint, plan_items bigint, photo_files bigint, photo_bytes bigint
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can list users' using errcode = '42501';
  end if;
  return query
    select
      u.id, u.email::text, u.created_at, u.last_sign_in_at,
      exists (select 1 from public.admins a where a.user_id = u.id),
      (select count(*) from public.cars c where c.user_id = u.id),
      (select count(*) from public.mods m where m.user_id = u.id),
      (select count(*) from public.plan_items p where p.user_id = u.id),
      (select count(*) from storage.objects o
        where o.bucket_id = 'photos' and (storage.foldername(o.name))[1] = u.id::text),
      (select coalesce(sum((o.metadata ->> 'size')::bigint), 0)::bigint from storage.objects o
        where o.bucket_id = 'photos' and (storage.foldername(o.name))[1] = u.id::text)
    from auth.users u
    order by u.created_at;
end $$;

revoke execute on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;

-- ---------- admins may read every garage (select only) ----------

drop policy if exists "admins read settings"   on public.settings;
drop policy if exists "admins read cars"       on public.cars;
drop policy if exists "admins read mods"       on public.mods;
drop policy if exists "admins read plan items" on public.plan_items;
drop policy if exists "admins read photos"     on storage.objects;

create policy "admins read settings"   on public.settings   for select to authenticated using ((select public.is_admin()));
create policy "admins read cars"       on public.cars       for select to authenticated using ((select public.is_admin()));
create policy "admins read mods"       on public.mods       for select to authenticated using ((select public.is_admin()));
create policy "admins read plan items" on public.plan_items for select to authenticated using ((select public.is_admin()));
create policy "admins read photos"     on storage.objects   for select to authenticated
  using (bucket_id = 'photos' and (select public.is_admin()));

-- =====================================================================
--  Make yourself an admin: put your account's email below, select just these lines, and Run.
--  (Remove someone:  delete from public.admins where user_id = (select id from auth.users where email = '…');)
-- =====================================================================
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'you@example.com'
-- on conflict do nothing;
