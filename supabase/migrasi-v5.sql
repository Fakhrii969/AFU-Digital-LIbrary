-- =====================================================================
-- MIGRASI V5: akun pengguna (email + sandi), admin terpisah, peringkat per akun
-- Jalankan SEKALI di Supabase > SQL Editor SEBELUM website versi baru di-upload.
-- Aman dijalankan ulang.
-- =====================================================================

-- 1) Daftar admin. Tabel ini tidak bisa dibaca/ditulis dari website (RLS aktif tanpa policy).
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Semua akun yang SUDAH ADA sekarang dijadikan admin (sebelum ini hanya akun adminmu yang ada).
-- Jalankan skrip ini SEBELUM membuka pendaftaran pengguna.
insert into public.admins (user_id) select id from auth.users on conflict do nothing;
-- Cek siapa saja adminnya:  select u.email from public.admins a join auth.users u on u.id = a.user_id;
-- Menambah admin lain:      insert into public.admins select id from auth.users where email = 'email@admin.com';
-- Mencabut admin:           delete from public.admins where user_id = (select id from auth.users where email = 'email@x.com');

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2) Semua hak tulis admin: hanya untuk admin sungguhan (bukan semua akun yang login)
drop policy if exists "documents admin insert" on public.documents;
drop policy if exists "documents admin update" on public.documents;
drop policy if exists "documents admin delete" on public.documents;
create policy "documents admin insert" on public.documents for insert to authenticated with check (public.is_admin());
create policy "documents admin update" on public.documents for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "documents admin delete" on public.documents for delete to authenticated using (public.is_admin());

drop policy if exists "pdf admin upload" on storage.objects;
drop policy if exists "pdf admin delete" on storage.objects;
create policy "pdf admin upload" on storage.objects for insert to authenticated with check (bucket_id = 'documents' and public.is_admin());
create policy "pdf admin delete" on storage.objects for delete to authenticated using (bucket_id = 'documents' and public.is_admin());

drop policy if exists "tryout img admin upload" on storage.objects;
drop policy if exists "tryout img admin delete" on storage.objects;
create policy "tryout img admin upload" on storage.objects for insert to authenticated with check (bucket_id = 'tryout-img' and public.is_admin());
create policy "tryout img admin delete" on storage.objects for delete to authenticated using (bucket_id = 'tryout-img' and public.is_admin());

drop policy if exists "settings admin insert" on public.site_settings;
drop policy if exists "settings admin update" on public.site_settings;
drop policy if exists "settings admin delete" on public.site_settings;
create policy "settings admin insert" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "settings admin update" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "settings admin delete" on public.site_settings for delete to authenticated using (public.is_admin());

drop policy if exists "tryouts public read" on public.tryouts;
drop policy if exists "tryouts admin write" on public.tryouts;
create policy "tryouts public read" on public.tryouts for select using (published or public.is_admin());
create policy "tryouts admin write" on public.tryouts for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tq admin write" on public.tryout_questions;
create policy "tq admin write" on public.tryout_questions for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "ta admin read" on public.tryout_attempts;
drop policy if exists "ta admin delete" on public.tryout_attempts;
create policy "ta admin read" on public.tryout_attempts for select to authenticated using (public.is_admin());
create policy "ta admin delete" on public.tryout_attempts for delete to authenticated using (public.is_admin());

-- 3) Kunci jawaban & pembahasan TIDAK boleh terbaca oleh pengguna biasa (anon maupun yang login)
revoke select on public.tryout_questions from anon, authenticated;
grant select (id, tryout_id, subtest, position, body, image_url, options) on public.tryout_questions to anon, authenticated;

-- Admin membaca kunci lewat fungsi ini (hanya berhasil untuk admin)
create or replace function public.admin_questions(p_tryout uuid)
returns table (id uuid, subtest text, "position" int, body text, answer smallint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'bukan admin'; end if;
  return query select q.id, q.subtest, q."position", q.body, q.answer
    from tryout_questions q where q.tryout_id = p_tryout order by q."position", q.created_at;
end $$;
revoke all on function public.admin_questions(uuid) from public;
grant execute on function public.admin_questions(uuid) to authenticated;

-- 4) Data belajar per akun (streak, riwayat, favorit, target, nama panggilan)
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint user_data_size check (pg_column_size(data) < 400000)
);
alter table public.user_data enable row level security;
drop policy if exists "user_data own select" on public.user_data;
drop policy if exists "user_data own insert" on public.user_data;
drop policy if exists "user_data own update" on public.user_data;
create policy "user_data own select" on public.user_data for select to authenticated using (user_id = auth.uid());
create policy "user_data own insert" on public.user_data for insert to authenticated with check (user_id = auth.uid());
create policy "user_data own update" on public.user_data for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 5) Nilai try out: sekarang WAJIB login, satu hasil pertama per AKUN per try out
drop function if exists public.submit_tryout(uuid, text, text, jsonb, int);
create or replace function public.submit_tryout(
  p_tryout uuid, p_nick text, p_answers jsonb, p_secs int
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  q record; v_total int := 0; v_correct int := 0; v_per jsonb := '{}'::jsonb;
  v_key jsonb := '[]'::jsonb; v_score int; v_first boolean := false; v_rank int; v_n int;
  v_given int; v_sub record; v_dur int; v_dev text;
begin
  if auth.uid() is null then raise exception 'harus login'; end if;
  v_dev := 'u:' || auth.uid()::text;
  if not exists (select 1 from tryouts where id = p_tryout and (published or public.is_admin())) then
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

  for v_sub in select key, value from jsonb_each(v_per) loop
    v_per := jsonb_set(v_per, array[v_sub.key, 's'],
      to_jsonb(round(1000.0 * (v_sub.value ->> 'c')::int / (v_sub.value ->> 't')::int)::int), true);
  end loop;
  select round(avg((value ->> 's')::numeric))::int into v_score from jsonb_each(v_per);

  insert into tryout_attempts (tryout_id, device_id, nickname, score, correct, total, per_subtest, secs)
  values (p_tryout, v_dev, nullif(left(trim(coalesce(p_nick, '')), 24), ''), v_score, v_correct, v_total, v_per,
          least(greatest(coalesce(p_secs, 0), 0), v_dur * 60 + 30))
  on conflict (tryout_id, device_id) do nothing;
  get diagnostics v_n = row_count;
  v_first := v_n = 1;

  select count(*) into v_n from tryout_attempts where tryout_id = p_tryout;
  select count(*) + 1 into v_rank from tryout_attempts a
    where a.tryout_id = p_tryout and a.score > (select score from tryout_attempts where tryout_id = p_tryout and device_id = v_dev);

  return jsonb_build_object('first', v_first, 'score', v_score, 'correct', v_correct, 'total', v_total,
    'per_subtest', v_per, 'key', v_key, 'participants', v_n,
    'rank', case when v_first then v_rank else null end);
end $$;

-- 6) Statistik & peringkat publik (siapa pun boleh melihat; "peringkatku" memakai akun yang login)
drop function if exists public.tryout_stats(uuid, text);
create or replace function public.tryout_stats(p_tryout uuid)
returns jsonb language plpgsql security definer stable set search_path = public as $$
declare v_n int; v_avg numeric; v_max int; v_min int; v_top jsonb; v_dist jsonb; v_sub jsonb; v_rank int; v_mine int; v_dev text;
begin
  v_dev := case when auth.uid() is null then null else 'u:' || auth.uid()::text end;
  select count(*), round(avg(score)), max(score), min(score) into v_n, v_avg, v_max, v_min from tryout_attempts where tryout_id = p_tryout;
  select coalesce(jsonb_agg(jsonb_build_object('nick', coalesce(nickname, 'Anonim'), 'score', score, 'secs', secs) order by score desc, secs asc), '[]'::jsonb)
    into v_top from (select nickname, score, secs from tryout_attempts where tryout_id = p_tryout order by score desc, secs asc limit 10) t;
  select coalesce(jsonb_agg(c order by b), '[]'::jsonb) into v_dist from (
    select g.b, (select count(*) from tryout_attempts a where a.tryout_id = p_tryout and least(a.score / 100, 9) = g.b) c
    from generate_series(0, 9) as g(b)) x;
  select coalesce(jsonb_object_agg(k, a), '{}'::jsonb) into v_sub from (
    select e.key k, round(avg((e.value ->> 's')::numeric)) a
    from tryout_attempts t, jsonb_each(t.per_subtest) e where t.tryout_id = p_tryout group by e.key) s;
  if v_dev is not null then
    select score into v_mine from tryout_attempts where tryout_id = p_tryout and device_id = v_dev;
    if v_mine is not null then
      select count(*) + 1 into v_rank from tryout_attempts where tryout_id = p_tryout and score > v_mine;
    end if;
  end if;
  return jsonb_build_object('n', v_n, 'avg', v_avg, 'max', v_max, 'min', v_min, 'top', v_top, 'dist', v_dist,
    'subtest_avg', v_sub, 'my_rank', v_rank, 'my_score', v_mine);
end $$;

-- 7) Hapus akun sendiri (hak pengguna atas datanya). Akun admin tidak bisa dihapus lewat sini.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'harus login'; end if;
  if public.is_admin() then raise exception 'akun admin tidak bisa dihapus dari website'; end if;
  delete from public.tryout_attempts where device_id = 'u:' || auth.uid()::text;
  delete from public.user_data where user_id = auth.uid();
  delete from auth.users where id = auth.uid();
end $$;

-- 8) Izin eksekusi
revoke all on function public.submit_tryout(uuid, text, jsonb, int) from public;
revoke all on function public.tryout_stats(uuid) from public;
revoke all on function public.delete_my_account() from public;
grant execute on function public.submit_tryout(uuid, text, jsonb, int) to authenticated;
grant execute on function public.tryout_stats(uuid) to anon, authenticated;
grant execute on function public.delete_my_account() to authenticated;

-- (Opsional) Hasil lama yang dikirim tanpa akun (berbasis perangkat) masih ikut peringkat.
-- Kalau ingin peringkat hanya berisi hasil akun terdaftar, hapus dengan:
--   delete from public.tryout_attempts where device_id not like 'u:%';
