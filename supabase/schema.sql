-- ============================================================================
-- QIF Survey Master - Supabase schema, RLS and RPCs
-- Property of AUDA-NEPAD. Run in the Supabase SQL editor (one shot, idempotent).
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.country_status (
  iso3 text primary key,
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  org text,
  role text not null check (role in ('super','country','mdb','regional','oacps','partner')),
  scope_regions text[] not null default '{}',
  scope_countries text[] not null default '{}',
  can_view boolean not null default true,
  can_download boolean not null default false,
  must_change boolean not null default true,
  created_at timestamptz not null default now(),
  created_by text
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  email text not null,
  name text,
  iso3 text not null,
  category text not null,
  level text not null,
  expires_at timestamptz not null default now() + interval '7 days',
  used_at timestamptz,
  created_at timestamptz not null default now(),
  created_by text
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  respondent_id text,
  invite_id uuid references public.invites(id),
  iso3 text not null,
  region text not null,
  tier int,
  family text,
  language text,
  category text,
  level text,
  answers jsonb not null
);

create table if not exists public.signup_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text, email text, iso3 text, category text, level text,
  phone text, job_title text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reason text,
  decided_by text,
  decided_at timestamptz
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor text,
  action text not null,
  detail jsonb not null default '{}'::jsonb
);

create index if not exists responses_iso3_idx on public.responses (iso3);
create index if not exists responses_region_idx on public.responses (region);
create index if not exists invites_token_idx on public.invites (token);

-- ---------------------------------------------------------------------------
-- Helper predicates
-- ---------------------------------------------------------------------------
create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_super() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce((select role = 'super' from public.profiles where id = auth.uid()), false) $$;

create or replace function public.in_scope(p_iso3 text, p_region text) returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce((
     select p.role = 'super'
         or p_region = any(p.scope_regions)
         or p_iso3   = any(p.scope_countries)
     from public.profiles p where p.id = auth.uid()), false) $$;

-- Region of a country is carried on each row; invites join countries client side.
create or replace function public.iso_region(p_iso3 text) returns text
language sql stable as
$$ select case
     when p_iso3 in ('JAM','CUB','DOM','TTO','GUY','BRB','LCA','SUR','GRD','BHS','HTI','KNA','DMA','VCT','BLZ','ATG') then 'caribbean'
     when p_iso3 in ('FJI','PNG','VUT','TLS','SLB','WSM','TON','KIR','COK','MHL','FSM','NRU','NIU','PLW','TUV') then 'pacific'
     else 'africa' end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.country_status enable row level security;
alter table public.profiles enable row level security;
alter table public.invites enable row level security;
alter table public.responses enable row level security;
alter table public.signup_requests enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists country_status_read on public.country_status;
create policy country_status_read on public.country_status for select using (true);

drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles for select using (id = auth.uid() or public.is_super());

drop policy if exists invites_admin_read on public.invites;
create policy invites_admin_read on public.invites for select
  using (public.in_scope(iso3, public.iso_region(iso3)));

drop policy if exists responses_admin_read on public.responses;
create policy responses_admin_read on public.responses for select
  using (public.in_scope(iso3, region));

drop policy if exists requests_admin_read on public.signup_requests;
create policy requests_admin_read on public.signup_requests for select
  using (public.in_scope(iso3, public.iso_region(iso3)));

drop policy if exists audit_super_read on public.audit_log;
create policy audit_super_read on public.audit_log for select using (public.is_super());

-- No direct INSERT/UPDATE/DELETE policies: all writes go through the RPCs below.

-- ---------------------------------------------------------------------------
-- RPCs (SECURITY DEFINER)
-- ---------------------------------------------------------------------------
create or replace function public.set_country_enabled(p_iso3 text, p_enabled boolean)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super() then return json_build_object('ok', false, 'why', 'forbidden'); end if;
  insert into public.country_status (iso3, enabled, updated_at, updated_by)
  values (upper(p_iso3), p_enabled, now(), (select email from public.profiles where id = auth.uid()))
  on conflict (iso3) do update set enabled = excluded.enabled, updated_at = now(), updated_by = excluded.updated_by;
  insert into public.audit_log (actor, action, detail)
  values ((select email from public.profiles where id = auth.uid()), 'country_' || case when p_enabled then 'enabled' else 'disabled' end,
          json_build_object('iso3', upper(p_iso3))::jsonb);
  return json_build_object('ok', true);
end $$;

create or replace function public.quota_cap(p_category text, p_level text) returns int
language sql immutable as
$$ select case when p_category in ('nsb','nmi','nab','nlmb') and p_level in ('ao','pol') then 1 else 2 end $$;

create or replace function public.quota_used(p_iso3 text, p_category text, p_level text) returns int
language sql stable security definer set search_path = public as
$$ select (select count(*) from public.invites i
            where i.iso3 = p_iso3 and i.category = p_category and i.level = p_level
              and (i.used_at is not null or i.expires_at > now()))::int $$;

create or replace function public.create_invite(p json)
returns json language plpgsql security definer set search_path = public as $$
declare v_tok text; v_iso text; v_cat text; v_lvl text; v_actor text;
begin
  select email into v_actor from public.profiles where id = auth.uid();
  if v_actor is null then return json_build_object('ok', false, 'why', 'forbidden'); end if;
  v_iso := upper(p->>'iso3'); v_cat := p->>'category'; v_lvl := p->>'level';
  if not public.in_scope(v_iso, public.iso_region(v_iso)) then
    return json_build_object('ok', false, 'why', 'out_of_scope');
  end if;
  if public.quota_used(v_iso, v_cat, v_lvl) >= public.quota_cap(v_cat, v_lvl) then
    return json_build_object('ok', false, 'why', 'quota');
  end if;
  v_tok := encode(gen_random_bytes(16), 'hex');
  insert into public.invites (token, email, name, iso3, category, level, created_by)
  values (v_tok, p->>'email', p->>'name', v_iso, v_cat, v_lvl, v_actor);
  insert into public.audit_log (actor, action, detail)
  values (v_actor, 'invite_created', json_build_object('iso3', v_iso, 'category', v_cat, 'level', v_lvl, 'email', p->>'email')::jsonb);
  return json_build_object('ok', true, 'token', v_tok,
    'expires_at', to_char(now() + interval '7 days', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'));
end $$;

create or replace function public.validate_invite(p_token text)
returns json language plpgsql security definer set search_path = public as $$
declare v record; v_enabled boolean;
begin
  select * into v from public.invites where token = p_token;
  if v is null then return json_build_object('ok', false, 'why', 'not_found'); end if;
  if v.used_at is not null then return json_build_object('ok', false, 'why', 'used'); end if;
  if v.expires_at < now() then return json_build_object('ok', false, 'why', 'expired'); end if;
  select enabled into v_enabled from public.country_status where iso3 = v.iso3;
  return json_build_object('ok', true, 'invite', json_build_object(
    'token', v.token, 'email', v.email, 'name', v.name, 'iso3', v.iso3,
    'category', v.category, 'level', v.level, 'expires_at', v.expires_at,
    'country_enabled', coalesce(v_enabled, false)));
end $$;

create or replace function public.submit_response(p_token text, p_meta json, p_answers jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare v record; v_id uuid;
begin
  if p_token is not null and p_token <> '' then
    select * into v from public.invites where token = p_token;
    if v is null then return json_build_object('ok', false, 'why', 'not_found'); end if;
    if v.used_at is not null then return json_build_object('ok', false, 'why', 'used'); end if;
    if v.expires_at < now() then return json_build_object('ok', false, 'why', 'expired'); end if;
    update public.invites set used_at = now() where id = v.id;
  end if;
  insert into public.responses (respondent_id, invite_id, iso3, region, tier, family, language, category, level, answers)
  values (p_meta->>'respondent_id', (select id from public.invites where token = nullif(p_token, '')),
          upper(p_meta->>'iso3'), p_meta->>'region', (p_meta->>'tier')::int,
          p_meta->>'family', p_meta->>'language', p_meta->>'category', p_meta->>'level', p_answers)
  returning id into v_id;
  return json_build_object('ok', true, 'id', v_id);
end $$;

create or replace function public.request_access(p json)
returns json language plpgsql security definer set search_path = public as $$
declare v_iso text; v_cat text; v_lvl text; v_enabled boolean; v_tok text;
begin
  v_iso := upper(p->>'iso3'); v_cat := p->>'category'; v_lvl := p->>'level';
  if coalesce(p->>'email','') = '' and coalesce(p->>'phone','') = '' then
    return json_build_object('ok', false, 'why', 'missing');
  end if;
  if exists (select 1 from public.signup_requests where email = p->>'email' and status = 'pending')
     or exists (select 1 from public.invites where email = p->>'email' and expires_at > now() and used_at is null) then
    return json_build_object('ok', false, 'why', 'duplicate');
  end if;
  select enabled into v_enabled from public.country_status where iso3 = v_iso;
  if coalesce(v_enabled, false) and public.quota_used(v_iso, v_cat, v_lvl) < public.quota_cap(v_cat, v_lvl) then
    v_tok := encode(gen_random_bytes(16), 'hex');
    insert into public.invites (token, email, name, iso3, category, level, created_by)
    values (v_tok, p->>'email', p->>'name', v_iso, v_cat, v_lvl, 'auto-validation');
    insert into public.signup_requests (name, email, iso3, category, level, phone, job_title, status, reason, decided_by, decided_at)
    values (p->>'name', p->>'email', v_iso, v_cat, v_lvl, p->>'phone', p->>'job_title', 'approved', 'auto', 'auto-validation', now());
    return json_build_object('ok', true, 'mode', 'auto', 'token', v_tok);
  end if;
  insert into public.signup_requests (name, email, iso3, category, level, phone, job_title, reason)
  values (p->>'name', p->>'email', v_iso, v_cat, v_lvl, p->>'phone', p->>'job_title',
          case when not coalesce(v_enabled, false) then 'country_not_open' else 'quota' end);
  return json_build_object('ok', true, 'mode', 'pending',
    'reason', case when not coalesce(v_enabled, false) then 'wave' else 'quota' end);
end $$;

create or replace function public.decide_request(p_id uuid, p_approve boolean)
returns json language plpgsql security definer set search_path = public as $$
declare v record; v_tok text; v_actor text;
begin
  select email into v_actor from public.profiles where id = auth.uid();
  if v_actor is null then return json_build_object('ok', false, 'why', 'forbidden'); end if;
  select * into v from public.signup_requests where id = p_id and status = 'pending';
  if v is null then return json_build_object('ok', false, 'why', 'not_found'); end if;
  if not public.in_scope(v.iso3, public.iso_region(v.iso3)) then
    return json_build_object('ok', false, 'why', 'out_of_scope');
  end if;
  if p_approve then
    if public.quota_used(v.iso3, v.category, v.level) >= public.quota_cap(v.category, v.level) then
      return json_build_object('ok', false, 'why', 'quota');
    end if;
    v_tok := encode(gen_random_bytes(16), 'hex');
    insert into public.invites (token, email, name, iso3, category, level, created_by)
    values (v_tok, v.email, v.name, v.iso3, v.category, v.level, v_actor);
    update public.signup_requests set status = 'approved', decided_by = v_actor, decided_at = now() where id = p_id;
    return json_build_object('ok', true, 'token', v_tok);
  end if;
  update public.signup_requests set status = 'rejected', decided_by = v_actor, decided_at = now() where id = p_id;
  return json_build_object('ok', true);
end $$;

create or replace function public.my_profile()
returns json language sql stable security definer set search_path = public as
$$ select coalesce(row_to_json(p)::json, json_build_object('ok', false, 'why', 'no_profile'))
   from public.profiles p where p.id = auth.uid() $$;

create or replace function public.password_changed()
returns json language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set must_change = false where id = auth.uid();
  return json_build_object('ok', true);
end $$;

create or replace function public.update_rights(p_id uuid, p json)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super() then return json_build_object('ok', false, 'why', 'forbidden'); end if;
  update public.profiles set
    role = coalesce(p->>'role', role),
    scope_regions = coalesce((select array_agg(x) from json_array_elements_text(p->'scope_regions') x), scope_regions),
    scope_countries = coalesce((select array_agg(upper(x)) from json_array_elements_text(p->'scope_countries') x), scope_countries),
    can_view = coalesce((p->>'can_view')::boolean, can_view),
    can_download = coalesce((p->>'can_download')::boolean, can_download)
  where id = p_id;
  insert into public.audit_log (actor, action, detail)
  values ((select email from public.profiles where id = auth.uid()), 'rights_updated', json_build_object('profile', p_id, 'rights', p)::jsonb);
  return json_build_object('ok', true);
end $$;

create or replace function public.log_action(p_action text, p_detail json default '{}')
returns json language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_log (actor, action, detail)
  values (coalesce((select email from public.profiles where id = auth.uid()), 'anonymous'), p_action, p_detail::jsonb);
  return json_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------------------
-- Grants: everything flows through RPCs + RLS-protected SELECTs
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
grant select on public.country_status to anon, authenticated;
grant select on public.profiles, public.invites, public.responses,
      public.signup_requests, public.audit_log to authenticated;
grant execute on function
  public.validate_invite(text), public.submit_response(text, json, jsonb),
  public.request_access(json) to anon, authenticated;
grant execute on function
  public.set_country_enabled(text, boolean), public.create_invite(json),
  public.decide_request(uuid, boolean), public.my_profile(), public.password_changed(),
  public.update_rights(uuid, json), public.log_action(text, json),
  public.my_role(), public.is_super(), public.in_scope(text, text),
  public.iso_region(text), public.quota_cap(text, text), public.quota_used(text, text, text)
  to authenticated;
grant execute on function public.iso_region(text), public.quota_cap(text, text) to anon;

-- ---------------------------------------------------------------------------
-- Seed: the 18 confirmed African implementation countries start enabled;
-- every other country (incl. Caribbean and Pacific) starts disabled and can
-- be enabled by the super admin from the console.
-- ---------------------------------------------------------------------------
insert into public.country_status (iso3, enabled, updated_by)
select x, true, 'seed' from unnest(array[
  'CIV','GHA','BFA','SEN','ETH','UGA','MUS','DJI','ZWE','ZMB','LSO','BWA','TUN','MRT','EGY','CMR','TCD','GAB'
]) x
on conflict (iso3) do nothing;

