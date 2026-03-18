-- ================================================================
-- PROFILES TABLE — jalankan di Supabase SQL Editor
-- ================================================================

-- ── TABEL PROFILES ───────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  name        text not null,
  created_at  timestamptz default now()
);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── AUTO-CREATE PROFILE saat register ────────────────────────
-- Dipanggil otomatis oleh Supabase trigger setiap ada user baru
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger lama kalau ada, lalu buat baru
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
