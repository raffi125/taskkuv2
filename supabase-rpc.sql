-- ================================================================
-- RPC FUNCTION — jalankan di Supabase SQL Editor
-- Dibutuhkan agar login pakai username bisa lookup email
-- ================================================================

create or replace function public.get_email_by_user_id(uid uuid)
returns text
language sql
security definer
stable
as $$
  select email from auth.users where id = uid limit 1;
$$;
