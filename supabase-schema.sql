-- ================================================================
-- TUGAS APP — Supabase SQL Schema
-- Jalankan ini di: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- ── TABEL TASKS ──────────────────────────────────────────────
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  note        text default '',
  matkul      text default 'Lainnya',
  priority    text default 'medium' check (priority in ('high', 'medium', 'low')),
  due         timestamptz,
  done        boolean default false,
  done_at     timestamptz,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────────────
-- Wajib diaktifkan agar setiap user hanya bisa akses data miliknya sendiri

alter table public.tasks enable row level security;

-- Policy: user hanya bisa SELECT task miliknya
create policy "Users can view own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

-- Policy: user hanya bisa INSERT task miliknya
create policy "Users can insert own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

-- Policy: user hanya bisa UPDATE task miliknya
create policy "Users can update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

-- Policy: user hanya bisa DELETE task miliknya
create policy "Users can delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- ── INDEX (opsional, untuk performa) ─────────────────────────
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_created_at_idx on public.tasks(created_at desc);
