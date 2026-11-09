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


-- ============ v4: TRY OUT (sama dengan migrasi-v4.sql) ============
-- 1) Paket try out
create table if not exists public.tryouts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_min int not null default 90 check (duration_min between 1 and 600),
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Soal try out (kunci jawaban dan pembahasan TIDAK bisa dibaca pengunjung, hanya lewat fungsi nilai di bawah)
create table if not exists public.tryout_questions (
  id uuid primary key default gen_random_uuid(),
  tryout_id uuid not null references public.tryouts(id) on delete cascade,
  subtest text not null check (subtest in ('pu','ppu','pbm','pk','lbi','lbe','pm')),
  position int not null default 0,
  body text not null,
  image_url text,
  options jsonb not null,
  answer smallint not null check (answer between 0 and 4),
  explanation text,
  created_at timestamptz not null default now()
);
create index if not exists tryout_q_idx on public.tryout_questions (tryout_id, position);

-- 3) Hasil pengerjaan pertama (satu baris per perangkat per try out)
create table if not exists public.tryout_attempts (
  id uuid primary key default gen_random_uuid(),
  tryout_id uuid not null references public.tryouts(id) on delete cascade,
  device_id text not null,
  nickname text,
  score int not null,
  correct int not null,
  total int not null,
  per_subtest jsonb not null default '{}'::jsonb,
  secs int,
  created_at timestamptz not null default now(),
  unique (tryout_id, device_id)
);
create index if not exists tryout_attempts_idx on public.tryout_attempts (tryout_id, score desc);

alter table public.tryouts enable row level security;
alter table public.tryout_questions enable row level security;
alter table public.tryout_attempts enable row level security;

drop policy if exists "tryouts public read" on public.tryouts;
create policy "tryouts public read" on public.tryouts for select using (published or auth.role() = 'authenticated');
drop policy if exists "tryouts admin write" on public.tryouts;
create policy "tryouts admin write" on public.tryouts for all to authenticated using (true) with check (true);

drop policy if exists "tq public read" on public.tryout_questions;
create policy "tq public read" on public.tryout_questions for select using (true);
drop policy if exists "tq admin write" on public.tryout_questions;
create policy "tq admin write" on public.tryout_questions for all to authenticated using (true) with check (true);

drop policy if exists "ta admin read" on public.tryout_attempts;
create policy "ta admin read" on public.tryout_attempts for select to authenticated using (true);
drop policy if exists "ta admin delete" on public.tryout_attempts;
create policy "ta admin delete" on public.tryout_attempts for delete to authenticated using (true);

-- Pengunjung (anon) hanya boleh membaca kolom soal TANPA kunci jawaban dan pembahasan
revoke select on public.tryout_questions from anon;
grant select (id, tryout_id, subtest, position, body, image_url, options) on public.tryout_questions to anon;
grant select on public.tryout_questions to authenticated;

-- 4) Fungsi: nilai jawaban, simpan jika PERTAMA, kembalikan kunci + pembahasan
--    p_answers: {"<id soal>": <0..4>}  (soal tanpa jawaban dianggap kosong)
create or replace function public.submit_tryout(
  p_tryout uuid, p_device text, p_nick text, p_answers jsonb, p_secs int
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  q record; v_total int := 0; v_correct int := 0; v_per jsonb := '{}'::jsonb;
  v_key jsonb := '[]'::jsonb; v_score int; v_first boolean := false; v_rank int; v_n int;
  v_given int; v_sub record; v_dur int;
begin
  if p_device is null or length(p_device) < 8 or length(p_device) > 80 then raise exception 'device tidak valid'; end if;
  if not exists (select 1 from tryouts where id = p_tryout and (published or auth.role() = 'authenticated')) then
    raise exception 'try out tidak ditemukan';
  end if;
  select duration_min into v_dur from tryouts where id = p_tryout;

  for q in select * from tryout_questions where tryout_id = p_tryout order by position, created_at loop
    v_total := v_total + 1;
    v_given := case when p_answers ? q.id::text and jsonb_typeof(p_answers -> q.id::text) = 'number'
                    then (p_answers ->> q.id::text)::int else null end;
    if v_given = q.answer then v_correct := v_correct + 1; end if;
    v_per := jsonb_set(v_per, array[q.subtest],
      jsonb_build_object('c', coalesce((v_per -> q.subtest ->> 'c')::int, 0) + (case when v_given = q.answer then 1 else 0 end),
                         't', coalesce((v_per -> q.subtest ->> 't')::int, 0) + 1), true);
    v_key := v_key || jsonb_build_object('id', q.id, 'answer', q.answer, 'explanation', q.explanation);
  end loop;
  if v_total = 0 then raise exception 'try out belum punya soal'; end if;

  -- skor tiap subtes 0-1000 = 1000 x benar / jumlah soal; skor total = rata-rata subtes
  for v_sub in select key, value from jsonb_each(v_per) loop
    v_per := jsonb_set(v_per, array[v_sub.key, 's'],
      to_jsonb(round(1000.0 * (v_sub.value ->> 'c')::int / (v_sub.value ->> 't')::int)::int), true);
  end loop;
  select round(avg((value ->> 's')::numeric))::int into v_score from jsonb_each(v_per);

  insert into tryout_attempts (tryout_id, device_id, nickname, score, correct, total, per_subtest, secs)
  values (p_tryout, p_device, nullif(left(trim(coalesce(p_nick, '')), 24), ''), v_score, v_correct, v_total, v_per,
          least(greatest(coalesce(p_secs, 0), 0), v_dur * 60 + 30))
  on conflict (tryout_id, device_id) do nothing;
  get diagnostics v_n = row_count;
  v_first := v_n = 1;

  select count(*) into v_n from tryout_attempts where tryout_id = p_tryout;
  select count(*) + 1 into v_rank from tryout_attempts a
    where a.tryout_id = p_tryout and a.score > (select score from tryout_attempts where tryout_id = p_tryout and device_id = p_device);

  return jsonb_build_object('first', v_first, 'score', v_score, 'correct', v_correct, 'total', v_total,
    'per_subtest', v_per, 'key', v_key, 'participants', v_n,
    'rank', case when v_first then v_rank else null end);
end $$;

-- 5) Fungsi: statistik publik satu try out (rata-rata, sebaran, 10 teratas, peringkat perangkat ini)
create or replace function public.tryout_stats(p_tryout uuid, p_device text default null)
returns jsonb language plpgsql security definer stable set search_path = public as $$
declare v_n int; v_avg numeric; v_max int; v_min int; v_top jsonb; v_dist jsonb; v_sub jsonb; v_rank int; v_mine int;
begin
  select count(*), round(avg(score)), max(score), min(score) into v_n, v_avg, v_max, v_min from tryout_attempts where tryout_id = p_tryout;
  select coalesce(jsonb_agg(jsonb_build_object('nick', coalesce(nickname, 'Anonim'), 'score', score, 'secs', secs) order by score desc, secs asc), '[]'::jsonb)
    into v_top from (select nickname, score, secs from tryout_attempts where tryout_id = p_tryout order by score desc, secs asc limit 10) t;
  select coalesce(jsonb_agg(c order by b), '[]'::jsonb) into v_dist from (
    select g.b, (select count(*) from tryout_attempts a where a.tryout_id = p_tryout and least(a.score / 100, 9) = g.b) c
    from generate_series(0, 9) as g(b)) x;
  select coalesce(jsonb_object_agg(k, a), '{}'::jsonb) into v_sub from (
    select e.key k, round(avg((e.value ->> 's')::numeric)) a
    from tryout_attempts t, jsonb_each(t.per_subtest) e where t.tryout_id = p_tryout group by e.key) s;
  if p_device is not null then
    select score into v_mine from tryout_attempts where tryout_id = p_tryout and device_id = p_device;
    if v_mine is not null then
      select count(*) + 1 into v_rank from tryout_attempts where tryout_id = p_tryout and score > v_mine;
    end if;
  end if;
  return jsonb_build_object('n', v_n, 'avg', v_avg, 'max', v_max, 'min', v_min, 'top', v_top, 'dist', v_dist,
    'subtest_avg', v_sub, 'my_rank', v_rank, 'my_score', v_mine);
end $$;

revoke all on function public.submit_tryout(uuid, text, text, jsonb, int) from public;
revoke all on function public.tryout_stats(uuid, text) from public;
grant execute on function public.submit_tryout(uuid, text, text, jsonb, int) to anon, authenticated;
grant execute on function public.tryout_stats(uuid, text) to anon, authenticated;

-- 6) Bucket gambar untuk soal (opsional, diunggah admin)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tryout-img', 'tryout-img', true, 5242880, array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;
drop policy if exists "tryout img public read" on storage.objects;
create policy "tryout img public read" on storage.objects for select using (bucket_id = 'tryout-img');
drop policy if exists "tryout img admin upload" on storage.objects;
create policy "tryout img admin upload" on storage.objects for insert to authenticated with check (bucket_id = 'tryout-img');
drop policy if exists "tryout img admin delete" on storage.objects;
create policy "tryout img admin delete" on storage.objects for delete to authenticated using (bucket_id = 'tryout-img');
