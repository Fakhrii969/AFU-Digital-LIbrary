-- Jalankan SEKALI di Supabase > SQL Editor jika database dibuat dengan versi lama (v1/v2). Aman dijalankan ulang.
alter table public.documents add column if not exists size_bytes bigint;
alter table public.documents add column if not exists pair_id uuid references public.documents(id) on delete set null;

create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

drop policy if exists "settings public read" on public.site_settings;
drop policy if exists "settings admin insert" on public.site_settings;
drop policy if exists "settings admin update" on public.site_settings;
drop policy if exists "settings admin delete" on public.site_settings;
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin insert" on public.site_settings for insert to authenticated with check (true);
create policy "settings admin update" on public.site_settings for update to authenticated using (true) with check (true);
create policy "settings admin delete" on public.site_settings for delete to authenticated using (true);

insert into public.site_settings (key, value) values
  ('utbk_date', '2027-04-21T08:00:00+07:00'),
  ('utbk_confirmed', 'false'),
  ('announcement', '')
on conflict (key) do nothing;
