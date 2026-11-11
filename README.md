# AFU Digital Library — Panduan Lengkap (v4)

Perpustakaan PDF UTBK: HTML + CSS + JavaScript biasa (tanpa Node.js) + Supabase (database, penyimpanan PDF, login admin).
Hosting gratis di Netlify. Bisa dipasang di HP seperti aplikasi (PWA).

## Fitur
Pengunjung (tanpa login): Modul Soal dan Pembahasan per 7 subtes, baca dan download PDF, pencarian di semua subtes,
filter kategori dan urutan, favorit (disimpan di browser), tombol salin link, tautan soal ke pembahasan, bagian Terbaru,
label Baru, ukuran file, hitung mundur UTBK 2027 (hari, jam, menit, detik), pengumuman, halaman Tentang dan FAQ,
permintaan materi dan lapor masalah lewat DM Instagram, ID/English, Light/Dark, pasang sebagai aplikasi.
Baru di v4: **Try Out** (timer, simpan otomatis, nilai dihitung server, pengerjaan pertama jadi patokan statistik dan peringkat),
**Statistik Saya** (grafik perkembangan, rata-rata per subtes, subtes terlemah, target skor, bahas ulang jawaban),
**Asisten AFU** (chat customer service, bisa AI sungguhan), **Fokus Timer** (Pomodoro), strip angka, streak belajar,
"Lanjutkan belajar", progres gulir, tombol ke atas, maskot baru di header.
Admin: upload banyak PDF sekaligus, edit, hapus, pasangkan soal dan pembahasan, atur pengumuman dan tanggal UTBK,
ekspor daftar ke CSV.

## Isi folder
```
index.html · admin.html · manifest.webmanifest · sw.js
assets/   logo.png (asli, hanya diskalakan lewat CSS), og.png (preview link), icon-192.png, icon-512.png,
          mascot-wave.webp (maskot header), mascot-study.webp (maskot bagian "belajar di mana saja")
css/style.css        tampilan, warna, animasi
js/config.js         URL + key Supabase (+ kode GoatCounter opsional)
js/common.js         teks ID/EN, tema, efek tekan
js/app.js            halaman pengunjung
js/admin.js          halaman admin
supabase/schema.sql          instalasi BARU (semua tabel sekaligus)
supabase/migrasi-v3.sql      UPGRADE dari versi lama
```

---
# A. Pasang dari nol

## 1. Project Supabase
1. https://supabase.com → daftar → **New project** (nama `afu-library`, region Singapore, simpan password database).
2. Tunggu selesai 1–2 menit.

## 2. Database dan storage
1. **SQL Editor** → **New query**. Buka `supabase/schema.sql` di VS Code, Ctrl+A, Ctrl+C, paste, **Run**.
2. Harus muncul "Success". Cek: **Table Editor** ada `documents` dan `site_settings`; **Storage** ada bucket `documents`.

## 3. Akun admin dan pendaftaran pengguna
1. **Authentication → Users → Add user → Create new user** (email + password). Kalau ada kotak *Auto Confirm User*, centang.
2. Sejak v5 pengguna biasa mendaftar sendiri (email + sandi), jadi **Allow new users to sign up** harus **menyala** dan **Confirm email** juga menyala.
3. Admin HANYA akun yang ada di tabel `admins` (bukan semua akun yang login). Cek siapa adminnya:
   `select u.email from public.admins a join auth.users u on u.id = a.user_id;`
   Tambah admin: `insert into public.admins select id from auth.users where email = 'email@admin.com';`
   Cabut admin: `delete from public.admins where user_id = (select id from auth.users where email = 'email@x.com');`
4. Kalau login admin \"Email not confirmed\", jalankan: `update auth.users set email_confirmed_at = now() where email = 'emailkamu@contoh.com';`
5. Aktifkan CAPTCHA (Turnstile) di **Authentication → Attack Protection** agar pendaftaran massal sulit.

## 4. Sambungkan website
1. **Project Settings → API Keys**: copy **Project URL** dan **Publishable key** (`sb_publishable_...`).
2. Isi `js/config.js` (`SUPABASE_URL` dan `SUPABASE_ANON_KEY`). Jangan pakai key secret/service_role.

## 5. Jalankan di komputer
1. VS Code → **File → Open Folder** → folder proyek.
2. Install ekstensi **Live Server** (Ritwick Dey) → klik kanan `index.html` → **Open with Live Server**.
3. Refresh keras: Ctrl+Shift+R (Mac: Cmd+Shift+R).

## 6. Upload PDF
1. `/admin.html` → login.
2. Pilih Jenis (Modul Soal/Pembahasan), Subtes, Kategori (misal "Try Out 2026"), Judul, Deskripsi, lalu file PDF
   (boleh banyak sekaligus; judul otomatis dari nama file). Maksimal 50 MB per file. Klik **Upload**.
3. **Pasangkan soal dan pembahasan**: di daftar klik **Edit** pada soal, pilih pembahasannya di kolom *Pasangan*, simpan.
   Di website muncul tombol "Lihat pembahasan" (dan sebaliknya).

## 7. Hitung mundur dan pengumuman
1. Di `/admin.html` bagian **Pengaturan situs**: isi pengumuman (kosong = disembunyikan), tanggal dan jam UTBK (WIB).
2. Tanggal bawaan 21 April 2027 pukul 08.00 WIB adalah PERKIRAAN (mengikuti pola tahun-tahun sebelumnya);
   jadwal resmi biasanya diumumkan SNPMB menjelang akhir tahun. Setelah ada jadwal resmi, ubah tanggalnya, centang
   "Tanggal sudah resmi", lalu simpan. Tidak perlu deploy ulang.

## 8. Preview link, statistik, domain
- **Preview link**: di `index.html` ganti 2 kali `GANTI-DOMAINMU` dengan domainmu (tanpa https://).
  WhatsApp menyimpan cache preview; kirim link dengan `?v=2` untuk memperbaruinya.
- **Statistik (opsional)**: daftar di goatcounter.com, isi `GOATCOUNTER: "kode-kamu"` di `js/config.js`.
- **Domain sendiri**: beli domain → Netlify → Domain management → Add a domain → ikuti petunjuk DNS.

## 9. Online (Netlify)
1. Buka app.netlify.com/drop (login pakai email, Google, atau GitHub; atau jalur lain: netlify.com → Sign up →
   Add new project → Deploy manually).
2. Seret FOLDER proyek yang sudah diekstrak (bukan file ZIP) ke kotak drop. Tunggu sampai muncul alamat `.netlify.app`.
3. Ubah nama situs di Project configuration → Change project name.
4. Setelah mengubah file di folder, seret folder lagi ke tab **Deploys**. Upload PDF dan edit pengaturan lewat admin
   TIDAK perlu deploy ulang.

## 10. Pasang di HP
- Android (Chrome): menu titik tiga → Tambahkan ke layar utama, atau tombol **Pasang aplikasi** di bawah halaman.
- iPhone (Safari): Bagikan → Tambah ke Layar Utama. Perlu alamat https (Netlify sudah https).

---
# B. Upgrade dari versi lama
1. SQL Editor → paste isi `supabase/migrasi-v3.sql` (kalau dari v1/v2) lalu `supabase/migrasi-v4.sql` (Try Out) → Run (aman diulang).
2. Ekstrak ZIP baru, isi `js/config.js` kalau belum, ganti `GANTI-DOMAINMU`, lalu deploy ulang.
3. Dokumen lama tetap aman; yang belum punya ukuran file hanya tidak menampilkan ukurannya.

---
# C. Mengubah isi/tampilan
- Teks (ID dan EN): `js/common.js`, objek `D`. Deskripsi subtes: kunci `sd_...`.
- Warna: `css/style.css`, blok `:root` (Light) dan `[data-theme=dark]` (Dark) di bagian atas.
- Ukuran logo: `.logo img` di `css/style.css`. Logo hanya diskalakan.
- Maskot header: `.mascot` di bagian v4 `css/style.css` (ukuran, posisi). Bagian "belajar di mana saja": fungsi `promoHTML` di `js/app.js`, teksnya kunci `promo_...` di `js/common.js`.
- Hashtag di kartu hitung mundur: `js/app.js`, fungsi `countdownHTML` (kelas `tag-h`).
- Instagram footer: `index.html`, bagian `<footer>` (ada 2 akun: @1khsanzz dan @njaniira_).
- Tombol lapor dan minta materi membuka DM Instagram: ganti `IG_DM` di awal `js/app.js`.

# D. Catatan penting
- Kuota gratis Supabase (penyimpanan dan trafik) terbatas; kompres PDF sebelum upload dan cek Settings → Usage.
- Project gratis yang lama tidak aktif bisa dijeda otomatis; kalau terjadi, klik Restore di dashboard.
- Upload hanya materi milikmu atau yang jelas boleh disebarkan (hak cipta).
- Favorit tersimpan di browser pengunjung, bukan di server.

# E. Masalah umum
- "Supabase belum dihubungkan": `js/config.js` salah/kosong.
- Upload gagal "row-level security": belum login atau `schema.sql` belum dijalankan penuh.
- Gagal simpan edit/pengaturan: jalankan `migrasi-v3.sql`.
- Hitung mundur tidak tampil: tanggal di Pengaturan situs kosong/tidak valid.
- Perubahan tidak terlihat: Ctrl+Shift+R. Karena mode aplikasi memakai cache, tutup dan buka ulang aplikasinya.

---
# F. Try Out dan Statistik (v4)
1. Jalankan `supabase/migrasi-v4.sql` di SQL Editor (instalasi baru: sudah ada di `schema.sql`).
2. `/admin.html` → bagian **Try Out** → isi judul, durasi → **Buat try out** → **Tambah soal**.
3. Tempel soal dengan format ini (penanda subtes `#PU`, `#PPU`, `#PBM`, `#PK`, `#LBI`, `#LBE`, `#PM`):
```
#PU
1. Teks soal (boleh beberapa baris, x^2, H_{2}O, **tebal**)
A. Pilihan
B. Pilihan
C. Pilihan
D. Pilihan
E. Pilihan
Kunci: C
Pembahasan: Penjelasan (opsional)
Gambar: https://... (opsional; atau pakai tombol Unggah gambar)
```
   Klik **Periksa format** dulu, lalu **Simpan soal**. Bisa ditambah bertahap.
4. Cara penilaian: skor subtes 0–1000 = 1000 × benar ÷ jumlah soal; skor total = rata-rata skor subtes; tanpa minus. Ini ESTIMASI, bukan skor IRT resmi.
5. **Pengerjaan pertama** tiap perangkat dicatat server (satu baris per perangkat per try out) dan jadi dasar statistik dan peringkat. Pengerjaan berikutnya hanya latihan ulang.
6. Kunci jawaban dan pembahasan tidak bisa dibaca pengunjung lewat API; baru dikirim setelah jawaban dikumpulkan (fungsi `submit_tryout`).
7. Batasan jujur: tanpa login, "perangkat" = browser. Menghapus data browser atau pakai browser lain dianggap peserta baru. Kalau butuh peringkat anti-curang, tambahkan login siswa.

# G. Asisten AI (v4)
- **Bawaan (gratis, tanpa server)**: sudah aktif. Menjawab FAQ, mencari dokumen, info hitung mundur, tips, kontak admin.
- **AI sungguhan (Gemini, jatah gratis)**:
  1. Jalankan `supabase/migrasi-v6.sql` di SQL Editor (batas harian + saringan nama panggilan).
  2. Edge Functions → `afu-assistant` → tempel isi `supabase/functions/afu-assistant/index.ts` → Deploy. **Verify JWT dimatikan.**
  3. Secrets: `GEMINI_API_KEY` (wajib), `ALLOWED_ORIGIN` (alamat websitemu), opsional `AI_DAILY_PER_IP` (default 30) dan `AI_DAILY_GLOBAL` (default 400).
  4. Isi `AI_ENDPOINT` di `js/config.js`. Jika fungsi gagal atau jatah habis, asisten kembali ke mode FAQ.

# G2. Keamanan (v6)
`_headers` (Cloudflare Pages) berisi CSP dan header pengaman. Kalau menambah skrip atau layanan dari domain baru, tambahkan domainnya ke CSP di `_headers`, kalau tidak browser akan memblokirnya.

# H. File baru v4
`js/tryout.js` (Try Out + statistik), `js/tryout-import.js` (parser soal admin), `js/assistant.js` (chat), `supabase/migrasi-v4.sql`,
`supabase/functions/afu-assistant/index.ts`, `assets/mascot-face.webp` (avatar chat). `assets/mascot-wave.webp` diganti dengan maskot baru.
