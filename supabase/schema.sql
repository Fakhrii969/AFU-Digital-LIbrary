-- Jalankan seluruh isi file ini di Supabase > SQL Editor > New query > Run

-- 1) Tabel metadata dokumen
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('soal','pembahasan')),
  subtest text not null check (subtest in ('pu','ppu','pbm','pk','lbi','lbe','pm')),
  category text,
  title text not null,
  description text,
  file_path text not null,
  size_bytes bigint,
  hits integer not null default 0,
  pair_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists documents_type_subtest_idx on public.documents (type, subtest);

alter table public.documents enable row level security;

-- Pengunjung: boleh baca tanpa login
drop policy if exists "documents public read" on public.documents;
create policy "documents public read" on public.documents
  for select using (true);
-- Admin (user yang login): boleh tambah, ubah, hapus
drop policy if exists "documents admin insert" on public.documents;
create policy "documents admin insert" on public.documents
  for insert to authenticated with check (true);
drop policy if exists "documents admin update" on public.documents;
create policy "documents admin update" on public.documents
  for update to authenticated using (true) with check (true);
drop policy if exists "documents admin delete" on public.documents;
create policy "documents admin delete" on public.documents
  for delete to authenticated using (true);

-- 2) Bucket penyimpanan PDF (publik supaya bisa dibaca/diunduh tanpa login)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', true, 52428800, array['application/pdf'])
on conflict (id) do nothing;

drop policy if exists "pdf public read" on storage.objects;
create policy "pdf public read" on storage.objects
  for select using (bucket_id = 'documents');
drop policy if exists "pdf admin upload" on storage.objects;
create policy "pdf admin upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'documents');
drop policy if exists "pdf admin delete" on storage.objects;
create policy "pdf admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'documents');

-- 3) Pengaturan situs (pengumuman, tanggal hitung mundur UTBK)
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
  ('utbk_date', '2027-04-21T08:00:00+07:00'), ('utbk_confirmed', 'false'), ('announcement', '')
on conflict (key) do nothing;

-- 4) v4: hitungan dibuka + permintaan materi
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
