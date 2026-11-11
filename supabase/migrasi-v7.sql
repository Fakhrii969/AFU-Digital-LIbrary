-- =====================================================================
-- MIGRASI V7: admin hanya email yang didaftarkan + admin wajib MFA (kalau MFA sudah aktif)
-- Jalankan SEKALI di Supabase > SQL Editor > New query > Run. Aman dijalankan ulang.
-- LANGKAH WAJIB: ganti email di baris "v_emails" di bawah dengan email adminmu.
-- =====================================================================

-- 1) Tabel admins hanya berisi email yang kamu daftarkan di bawah (migrasi-v5 dulu menjadikan SEMUA akun yang ada sebagai admin).
--    Kalau ada email yang tidak ditemukan, proses dibatalkan dan tidak ada yang dihapus (tidak ada yang terkunci).
do $$
declare
  v_emails text[] := array[
    'mfakhriinurikhsan@gmail.com',
    'anjani.rahmawati01@gmail.com'
  ];
  v_e text;
  v_ids uuid[] := '{}';
  v_id uuid;
begin
  foreach v_e in array v_emails loop
    select id into v_id from auth.users where lower(email) = lower(v_e);
    if v_id is null then
      raise exception 'Email % tidak ditemukan di auth.users. Perbaiki daftar v_emails lalu jalankan lagi.', v_e;
    end if;
    v_ids := v_ids || v_id;
  end loop;
  insert into public.admins (user_id) select unnest(v_ids) on conflict do nothing;
  delete from public.admins where user_id <> all (v_ids);
end $$;

-- 2) is_admin(): admin sah = ada di tabel admins DAN (sesi sudah lolos MFA, atau akun itu belum punya MFA).
--    Jadi setelah kamu mengaktifkan MFA, sandi yang bocor saja tidak cukup untuk menulis/menghapus apa pun.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid())
    and (
      coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      or not exists (select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified')
    );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Cek hasilnya (harus tepat sesuai daftar adminmu):
-- select u.email from public.admins a join auth.users u on u.id = a.user_id;
