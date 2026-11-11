-- =====================================================================
-- MIGRASI V6: batas pemakaian AI harian + saringan nama panggilan peringkat
-- Jalankan SEKALI di Supabase > SQL Editor > New query > Run.
-- Jalankan SEBELUM men-deploy edge function afu-assistant yang baru. Aman dijalankan ulang.
-- =====================================================================

-- 1) Penghitung pemakaian AI per hari (zona WIB). Tidak bisa dibaca/ditulis dari website:
--    RLS aktif tanpa policy, dan hanya service_role (edge function) yang boleh memanggil ai_hit.
create table if not exists public.ai_usage (
  day date not null,
  k   text not null,                -- 'all' = total semua pengguna, selain itu = hash IP (bukan IP asli)
  n   int  not null default 0,
  primary key (day, k)
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;

create or replace function public.ai_hit(p_ip text, p_ip_max int, p_all_max int)
returns text
language plpgsql security definer set search_path = public as $$
declare
  v_day date := (now() at time zone 'Asia/Jakarta')::date;
  v_ip int; v_all int;
begin
  -- hapus data lama (> 7 hari), cukup sesekali
  if random() < 0.02 then delete from public.ai_usage where day < v_day - 7; end if;

  -- 1) per pengguna (hash IP)
  insert into public.ai_usage (day, k, n) values (v_day, 'ip:' || left(coalesce(p_ip, 'x'), 64), 1)
    on conflict (day, k) do update set n = public.ai_usage.n + 1
    returning n into v_ip;
  if v_ip > p_ip_max then return 'ip'; end if;

  -- 2) total harian semua pengguna (melindungi jatah Gemini)
  insert into public.ai_usage (day, k, n) values (v_day, 'all', 1)
    on conflict (day, k) do update set n = public.ai_usage.n + 1
    returning n into v_all;
  if v_all > p_all_max then return 'all'; end if;

  return 'ok';
end $$;
revoke all on function public.ai_hit(text, int, int) from public, anon, authenticated;
grant execute on function public.ai_hit(text, int, int) to service_role;

-- 2) Saringan nama panggilan untuk peringkat (kata kasar, nama yang menyamar jadi admin, tautan)
create or replace function public.nick_ok(p_nick text)
returns boolean
language plpgsql immutable set search_path = public as $$
declare
  n text;
  w text;
  -- dicocokkan sebagai potongan kata (kata panjang, aman dari salah tangkap)
  bad_sub text[] := array['anjing','bangsat','bajingan','kontol','memek','ngentot','jancok','jancuk','pelacur','bokep',
    'goblok','kampret','brengsek','keparat','fuck','shit','bitch','pussy','nigger','nigga','porn',
    'admin','moderator','official','owner','staff','customerservice','autofocus','afudigital',
    'http','www'];
  -- dicocokkan hanya jika SELURUH nama sama (kata pendek, agar "Pasukan" tidak ikut terblokir)
  bad_eq  text[] := array['asu','babi','sex','afu','cs','dick','anjg','anjir','kntl','mmk','ngntd','tolol','gblk','lonte','pepek','titit','sange','mod','dev','bot'];
begin
  if p_nick is null or btrim(p_nick) = '' then return true; end if;
  -- samakan tulisan "4dm1n" = "admin", buang spasi, titik, dan simbol
  n := translate(lower(p_nick), '013457@$', 'oieastas');
  n := regexp_replace(n, '[^a-z]', '', 'g');
  if n = '' then return true; end if;
  foreach w in array bad_sub loop
    if position(w in n) > 0 then return false; end if;
  end loop;
  if n = any (bad_eq) then return false; end if;
  return true;
end $$;

-- 3) Pasang saringan di submit_tryout (isi sama dengan v5, hanya bagian nama panggilan yang beda):
--    nama yang tidak lolos otomatis ditampilkan sebagai "Anonim", pengerjaan tetap tersimpan.
create or replace function public.submit_tryout(
  p_tryout uuid, p_nick text, p_answers jsonb, p_secs int
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  q record; v_total int := 0; v_correct int := 0; v_per jsonb := '{}'::jsonb;
  v_key jsonb := '[]'::jsonb; v_score int; v_first boolean := false; v_rank int; v_n int;
  v_given int; v_sub record; v_dur int; v_dev text; v_nick text;
begin
  if auth.uid() is null then raise exception 'harus login'; end if;
  v_dev := 'u:' || auth.uid()::text;
  if not exists (select 1 from tryouts where id = p_tryout and (published or public.is_admin())) then
    raise exception 'try out tidak ditemukan';
  end if;
  select duration_min into v_dur from tryouts where id = p_tryout;

  v_nick := nullif(left(trim(coalesce(p_nick, '')), 24), '');
  if v_nick is not null and not public.nick_ok(v_nick) then v_nick := null; end if;

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
  values (p_tryout, v_dev, v_nick, v_score, v_correct, v_total, v_per,
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
revoke all on function public.submit_tryout(uuid, text, jsonb, int) from public;
grant execute on function public.submit_tryout(uuid, text, jsonb, int) to authenticated;

-- 4) Bersihkan nama lama yang tidak lolos saringan (jadi "Anonim" di peringkat)
update public.tryout_attempts set nickname = null where nickname is not null and not public.nick_ok(nickname);
