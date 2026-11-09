-- Jalankan SEKALI di Supabase > SQL Editor (v4). Aman dijalankan ulang.
-- 1) Hitungan dokumen dibuka (untuk "Paling populer")
alter table public.documents add column if not exists hits integer not null default 0;

create or replace function public.inc_hit(doc uuid) returns void
language sql security definer set search_path = public as $$
  update public.documents set hits = hits + 1 where id = doc;
$$;
revoke all on function public.inc_hit(uuid) from public;
grant execute on function public.inc_hit(uuid) to anon, authenticated;

-- 2) Permintaan materi dari pengunjung
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  subtest text check (subtest is null or subtest in ('pu','ppu','pbm','pk','lbi','lbe','pm')),
  message text not null check (char_length(message) between 5 and 500),
  contact text check (contact is null or char_length(contact) <= 120),
  done boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.requests enable row level security;
drop policy if exists "requests public insert" on public.requests;
drop policy if exists "requests admin read" on public.requests;
drop policy if exists "requests admin update" on public.requests;
drop policy if exists "requests admin delete" on public.requests;
create policy "requests public insert" on public.requests for insert to anon, authenticated with check (true);
create policy "requests admin read" on public.requests for select to authenticated using (true);
create policy "requests admin update" on public.requests for update to authenticated using (true) with check (true);
create policy "requests admin delete" on public.requests for delete to authenticated using (true);
