-- Modelo privado de casal para o Ritmo. Rode no SQL Editor do projeto Supabase.
-- Não use a chave service_role no navegador.
create extension if not exists pgcrypto;

create table if not exists public.ritmo_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Nosso treino',
  workout_titles jsonb not null default '{}'::jsonb,
  invite_code text not null unique default encode(gen_random_bytes(16), 'hex'),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.ritmo_groups add column if not exists workout_titles jsonb not null default '{}'::jsonb;

create table if not exists public.ritmo_members (
  group_id uuid not null references public.ritmo_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.ritmo_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  age smallint check (age between 13 and 110),
  weight_kg numeric(5,1) check (weight_kg between 25 and 350),
  height_cm numeric(5,1) check (height_cm between 100 and 230),
  goal text,
  days_per_week smallint check (days_per_week between 2 and 6),
  training_weekdays smallint[] not null default array[0,2,4] check (cardinality(training_weekdays) between 2 and 6),
  session_minutes smallint check (session_minutes between 30 and 120),
  experience text,
  equipment text,
  likes text,
  injury_area text,
  limitations text,
  cardio_minutes smallint not null default 15 check (cardio_minutes between 0 and 60),
  target_date date,
  nutrition_goal text,
  food_notes text,
  updated_at timestamptz not null default now()
);

create table if not exists public.ritmo_checkins (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.ritmo_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  activity text not null,
  caption text,
  duration_minutes smallint check (duration_minutes between 1 and 600),
  photo_path text,
  local_date date not null default current_date,
  participant_ids uuid[] not null default '{}',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(group_id,user_id,local_date)
);
alter table public.ritmo_checkins add column if not exists duration_minutes smallint check (duration_minutes between 1 and 600);
create index if not exists ritmo_checkins_group_time on public.ritmo_checkins(group_id, occurred_at desc);

create table if not exists public.ritmo_messages (
  id bigint generated always as identity primary key,
  group_id uuid not null references public.ritmo_groups(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists ritmo_messages_group_time on public.ritmo_messages(group_id, created_at desc);

create or replace function public.ritmo_is_member(target_group uuid, target_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public, auth
as $$ select exists (select 1 from public.ritmo_members m where m.group_id = target_group and m.user_id = target_user); $$;

create or replace function public.ritmo_all_participants_are_members(target_group uuid, participants uuid[])
returns boolean language sql stable security definer set search_path = public, auth
as $$ select coalesce(array_length(participants,1),0)>0 and not exists (
  select 1 from unnest(participants) person_id where not public.ritmo_is_member(target_group,person_id)
); $$;

create or replace function public.ritmo_create_group(group_name text default 'Nosso treino')
returns table(group_id uuid, invite_code text)
language plpgsql security definer set search_path = public, auth
as $$
declare new_group public.ritmo_groups;
begin
  if auth.uid() is null then raise exception 'Entre na sua conta primeiro.'; end if;
  if exists (select 1 from public.ritmo_members where user_id = auth.uid()) then raise exception 'Esta conta já está em um grupo.'; end if;
  insert into public.ritmo_groups(name, created_by) values (left(coalesce(nullif(trim(group_name),''),'Nosso treino'), 50), auth.uid()) returning * into new_group;
  insert into public.ritmo_members(group_id,user_id) values (new_group.id,auth.uid());
  return query select new_group.id,new_group.invite_code;
end $$;

create or replace function public.ritmo_join_group(code text)
returns uuid language plpgsql security definer set search_path = public, auth
as $$
declare target public.ritmo_groups;
begin
  if auth.uid() is null then raise exception 'Entre na sua conta primeiro.'; end if;
  if exists (select 1 from public.ritmo_members where user_id = auth.uid()) then raise exception 'Esta conta já está em um grupo.'; end if;
  select * into target from public.ritmo_groups g where g.invite_code = trim(code) for update;
  if target.id is null then raise exception 'Código de convite inválido.'; end if;
  if (select count(*) from public.ritmo_members where group_id=target.id) >= 2 then raise exception 'Este grupo já tem duas pessoas.'; end if;
  insert into public.ritmo_members(group_id,user_id) values(target.id,auth.uid());
  return target.id;
end $$;

alter table public.ritmo_groups enable row level security;
alter table public.ritmo_members enable row level security;
alter table public.ritmo_profiles enable row level security;
alter table public.ritmo_checkins enable row level security;
alter table public.ritmo_messages enable row level security;

drop policy if exists ritmo_group_read on public.ritmo_groups;
create policy ritmo_group_read on public.ritmo_groups for select to authenticated using (public.ritmo_is_member(id));
drop policy if exists ritmo_group_update on public.ritmo_groups;
create policy ritmo_group_update on public.ritmo_groups for update to authenticated using (public.ritmo_is_member(id)) with check (public.ritmo_is_member(id));
drop policy if exists ritmo_members_read on public.ritmo_members;
create policy ritmo_members_read on public.ritmo_members for select to authenticated using (public.ritmo_is_member(group_id));
drop policy if exists ritmo_profile_read on public.ritmo_profiles;
create policy ritmo_profile_read on public.ritmo_profiles for select to authenticated using (
  user_id = auth.uid() or exists (
    select 1 from public.ritmo_members mine join public.ritmo_members theirs on theirs.group_id=mine.group_id
    where mine.user_id=auth.uid() and theirs.user_id=ritmo_profiles.user_id
  )
);
drop policy if exists ritmo_profile_insert on public.ritmo_profiles;
create policy ritmo_profile_insert on public.ritmo_profiles for insert to authenticated with check (user_id=auth.uid());
drop policy if exists ritmo_profile_update on public.ritmo_profiles;
create policy ritmo_profile_update on public.ritmo_profiles for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists ritmo_checkins_read on public.ritmo_checkins;
create policy ritmo_checkins_read on public.ritmo_checkins for select to authenticated using (public.ritmo_is_member(group_id));
drop policy if exists ritmo_checkins_insert on public.ritmo_checkins;
create policy ritmo_checkins_insert on public.ritmo_checkins for insert to authenticated with check (user_id=auth.uid() and auth.uid()=any(participant_ids) and public.ritmo_is_member(group_id) and public.ritmo_all_participants_are_members(group_id,participant_ids));
drop policy if exists ritmo_checkins_delete on public.ritmo_checkins;
create policy ritmo_checkins_delete on public.ritmo_checkins for delete to authenticated using (user_id=auth.uid() and public.ritmo_is_member(group_id));
drop policy if exists ritmo_messages_read on public.ritmo_messages;
create policy ritmo_messages_read on public.ritmo_messages for select to authenticated using (public.ritmo_is_member(group_id));
drop policy if exists ritmo_messages_insert on public.ritmo_messages;
create policy ritmo_messages_insert on public.ritmo_messages for insert to authenticated with check (sender_id=auth.uid() and public.ritmo_is_member(group_id));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('ritmo-private','ritmo-private',false,5242880,array['image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists ritmo_photo_read on storage.objects;
create policy ritmo_photo_read on storage.objects for select to authenticated using (
  bucket_id='ritmo-private' and (storage.foldername(name))[1] in
  (select group_id::text from public.ritmo_members where user_id=auth.uid())
);
drop policy if exists ritmo_photo_insert on storage.objects;
create policy ritmo_photo_insert on storage.objects for insert to authenticated with check (
  bucket_id='ritmo-private' and (storage.foldername(name))[2]=auth.uid()::text and
  (storage.foldername(name))[1] in (select group_id::text from public.ritmo_members where user_id=auth.uid())
);
drop policy if exists ritmo_photo_delete on storage.objects;
create policy ritmo_photo_delete on storage.objects for delete to authenticated using (
  bucket_id='ritmo-private' and (storage.foldername(name))[2]=auth.uid()::text and
  (storage.foldername(name))[1] in (select group_id::text from public.ritmo_members where user_id=auth.uid())
);

revoke all on function public.ritmo_is_member(uuid,uuid) from public;
revoke all on function public.ritmo_create_group(text) from public;
revoke all on function public.ritmo_join_group(text) from public;
grant execute on function public.ritmo_is_member(uuid,uuid) to authenticated;
grant execute on function public.ritmo_all_participants_are_members(uuid,uuid[]) to authenticated;
grant execute on function public.ritmo_create_group(text) to authenticated;
grant execute on function public.ritmo_join_group(text) to authenticated;
grant select on public.ritmo_groups,public.ritmo_members,public.ritmo_profiles,public.ritmo_checkins,public.ritmo_messages to authenticated;
grant update(workout_titles) on public.ritmo_groups to authenticated;
grant insert,update on public.ritmo_profiles to authenticated;
grant insert,delete on public.ritmo_checkins to authenticated;
grant insert on public.ritmo_messages to authenticated;

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='ritmo_messages') then
    alter publication supabase_realtime add table public.ritmo_messages;
  end if;
end $$;

