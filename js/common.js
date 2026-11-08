// Fungsi bersama: bahasa, tema, koneksi Supabase, efek tekan
const AFU = (() => {
  const C = window.AFU_CONFIG;
  const configured = C.SUPABASE_URL && !C.SUPABASE_URL.startsWith("ISI_");
  const sb = configured ? supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;

  const SUB = ["pu", "ppu", "pbm", "pk", "lbi", "lbe", "pm"];
  const ABBR = { pu: "PU", ppu: "PPU", pbm: "PBM", pk: "PK", lbi: "LBI", lbe: "LBE", pm: "PM" };

  const D = {
    id: {
      nav_home: "Beranda", nav_modul: "Modul Soal", nav_pemb: "Pembahasan", nav_fav: "Favorit", nav_about: "Tentang",
      hero_title: "Welcome to Library Digital free by AFU",
      hero_desc: "Ruang digital gratismu untuk belajar, berlatih, dan menyiapkan diri menuju kampus impian.",
      choose: "Pilih perpustakaan",
      modul_t: "Modul Soal", modul_d: "Kumpulan modul soal UTBK berdasarkan subtes.",
      pemb_t: "Pembahasan", pemb_d: "Kumpulan kunci jawaban dan pembahasan berdasarkan subtes.",
      open: "Buka", back: "Kembali", read: "Baca", download: "Download",
      pick_sub: "Pilih subtes untuk melihat dokumen yang tersedia.",
      docs_count: n => n + " dokumen", uncat: "Umum",
      empty: "Belum ada dokumen di subtes ini. Silakan cek lagi nanti.",
      loading: "Memuat...", err: "Gagal memuat data. Periksa koneksi lalu muat ulang halaman.",
      nocfg: "Supabase belum dihubungkan. Isi js/config.js dengan URL dan anon key proyekmu.",
      f_sub: "Digital Library by AFU", f_rights: "© 2026 AFU Digital Library. All rights reserved.",
      f_ig: "Dukung AFU Library Digital dengan follow instagram kami, biar kami makin semangat berkembang!",
      tagline: "Learn Better, Prepare Smarter.",
      f_desc: "Dapatkan info materi dan update terbaru dengan follow sosial media kami.",
      f_contact: "Hubungi kami", f_c_ig: "Follow Instagram kami", f_c_tt: "Ikuti TikTok kami",
      f_c_wa: "Chat WhatsApp jika butuh bantuan", f_c_em: "Kirim email jika perlu sesuatu",
      s_pu: "Penalaran Umum", s_ppu: "Pengetahuan dan Pemahaman Umum", s_pbm: "Pemahaman Bacaan dan Menulis",
      s_pk: "Pengetahuan Kuantitatif", s_lbi: "Literasi dalam Bahasa Indonesia",
      s_lbe: "Literasi dalam Bahasa Inggris", s_pm: "Penalaran Matematika",
      sd_pu: "Menguji kemampuan bernalar: menarik kesimpulan, menganalisis pola, dan memecahkan masalah dari informasi yang diberikan.",
      sd_ppu: "Menguji pengetahuan umum serta kemampuan memahami dan menalar informasi dari berbagai bidang.",
      sd_pbm: "Menguji pemahaman isi bacaan serta kaidah penulisan dan kebahasaan dalam Bahasa Indonesia.",
      sd_pk: "Menguji pengetahuan dan penalaran kuantitatif dengan konsep matematika dasar.",
      sd_lbi: "Menguji kemampuan memahami, menafsirkan, dan mengevaluasi teks berbahasa Indonesia.",
      sd_lbe: "Menguji kemampuan membaca, memahami, dan menafsirkan teks berbahasa Inggris.",
      sd_pm: "Menguji kemampuan bernalar matematis untuk menyelesaikan masalah kontekstual.",
      theme: "Ganti tema", lang: "Ganti bahasa",
      how_t: "Cara pakai", st1: "Pilih perpustakaan", st1d: "Modul Soal atau Pembahasan.",
      st2: "Pilih subtes", st2d: "Tujuh subtes UTBK, masing-masing punya koleksi sendiri.",
      st3: "Baca atau download", st3d: "Buka PDF langsung atau simpan ke perangkatmu.",
      search_ph: "Cari judul dokumen...", no_match: "Tidak ada dokumen yang cocok.",
      added: "Ditambahkan", new_badge: "Baru", copy: "Salin link", copied: "Link disalin",
      report: "Laporkan masalah", gsearch_ph: "Cari dokumen di semua subtes...",
      cd_title: "Menuju UTBK 2027", cd_est: "Perkiraan jadwal", cd_official: "Jadwal resmi",
      cd_check: "Cek info resmi di snpmb.id", cd_done: "UTBK 2027 sudah dimulai. Semangat dan sukses!",
      cd_d: "Hari", cd_h: "Jam", cd_m: "Menit", cd_s: "Detik",
      promo_a: "Kamu bisa belajar", promo_b: "di mana saja,",
      promo_d: "cukup dengan Handphone ataupun Laptop kamu sudah bisa belajar sendiri maupun dengan temanmu.",
      promo_btn: "Mulai Belajar Sekarang", promo_alt: "Maskot AFU sedang membaca buku di depan laptop",
      latest: "Terbaru", all: "Semua", sort_new: "Terbaru", sort_az: "Judul A–Z", sort_label: "Urutkan",
      fav_add: "Simpan ke favorit", fav_rm: "Hapus dari favorit", fav_t: "Favorit saya",
      fav_empty: "Belum ada favorit. Tekan ikon bintang pada dokumen untuk menyimpannya.",
      fav_note: "Favorit disimpan di browser ini saja, tanpa login.",
      see_pemb: "Lihat pembahasan", see_soal: "Lihat soal",
      request: "Minta materi", request_d: "Materi yang kamu cari belum ada? Kirim permintaan lewat DM Instagram.",
      close: "Tutup", install: "Pasang aplikasi",
      about_t: "Tentang AFU Digital Library",
      about_p: "AFU Digital Library adalah perpustakaan digital gratis untuk persiapan UTBK. Semua modul soal dan pembahasan dikelompokkan per subtes, bisa dibaca dan diunduh tanpa login.",
      faq_t: "Pertanyaan umum",
      q1: "Apakah semua materi gratis?", a1: "Ya. Semua dokumen bisa dibaca dan diunduh gratis tanpa login.",
      q2: "Bagaimana cara mengunduh?", a2: "Pilih Modul Soal atau Pembahasan, pilih subtes, lalu tekan tombol Download pada dokumen.",
      q3: "Apakah soal dan pembahasan saling terhubung?", a3: "Jika tersedia, kartu dokumen punya tombol untuk langsung membuka pasangannya (soal ke pembahasan atau sebaliknya).",
      q4: "Kapan UTBK 2027?", a4: "Tanggal pada hitung mundur adalah perkiraan sampai SNPMB mengumumkan jadwal resmi. Selalu cek snpmb.id untuk informasi terbaru.",
      q5: "File tidak bisa dibuka atau isinya salah?", a5: "Tekan Laporkan masalah pada dokumen tersebut, atau kirim DM Instagram.",
      q6: "Bisa dipasang seperti aplikasi?", a6: "Bisa. Android (Chrome): menu titik tiga lalu Tambahkan ke layar utama, atau tombol Pasang aplikasi di bawah halaman. iPhone (Safari): tombol Bagikan lalu Tambah ke Layar Utama."
    },
    en: {
      nav_home: "Home", nav_modul: "Practice Modules", nav_pemb: "Solutions", nav_fav: "Favorites", nav_about: "About",
      hero_title: "Welcome to Library Digital free by AFU",
      hero_desc: "Your free digital space to learn, practice, and prepare for your dream university.",
      choose: "Choose a library",
      modul_t: "Practice Modules", modul_d: "UTBK practice question modules organized by subtest.",
      pemb_t: "Solutions", pemb_d: "Answer keys and explanations organized by subtest.",
      open: "Open", back: "Back", read: "Read", download: "Download",
      pick_sub: "Pick a subtest to see the available documents.",
      docs_count: n => n + (n === 1 ? " document" : " documents"), uncat: "General",
      empty: "No documents in this subtest yet. Please check back later.",
      loading: "Loading...", err: "Could not load data. Check your connection and reload the page.",
      nocfg: "Supabase is not connected. Fill js/config.js with your project URL and anon key.",
      f_sub: "Digital Library by AFU", f_rights: "© 2026 AFU Digital Library. All rights reserved.",
      f_ig: "Support AFU Digital Library by following our Instagram, so we can stay motivated to grow!",
      tagline: "Learn Better, Prepare Smarter.",
      f_desc: "Get the latest materials and updates by following our social media.",
      f_contact: "Contact us", f_c_ig: "Follow our Instagram", f_c_tt: "Follow our TikTok",
      f_c_wa: "Chat on WhatsApp if you need help", f_c_em: "Send an email if you need anything",
      s_pu: "General Reasoning", s_ppu: "General Knowledge and Understanding", s_pbm: "Reading Comprehension and Writing",
      s_pk: "Quantitative Knowledge", s_lbi: "Indonesian Language Literacy",
      s_lbe: "English Language Literacy", s_pm: "Mathematical Reasoning",
      sd_pu: "Tests reasoning: drawing conclusions, analyzing patterns, and solving problems from the information given.",
      sd_ppu: "Tests general knowledge and the ability to understand and reason about information from many fields.",
      sd_pbm: "Tests reading comprehension plus Indonesian writing conventions and language rules.",
      sd_pk: "Tests quantitative knowledge and reasoning using basic mathematical concepts.",
      sd_lbi: "Tests the ability to understand, interpret, and evaluate texts in Indonesian.",
      sd_lbe: "Tests the ability to read, understand, and interpret texts in English.",
      sd_pm: "Tests mathematical reasoning for solving contextual problems.",
      theme: "Toggle theme", lang: "Switch language",
      how_t: "How it works", st1: "Choose a library", st1d: "Practice Modules or Solutions.",
      st2: "Pick a subtest", st2d: "Seven UTBK subtests, each with its own collection.",
      st3: "Read or download", st3d: "Open the PDF right away or save it to your device.",
      search_ph: "Search document title...", no_match: "No matching documents.",
      added: "Added", new_badge: "New", copy: "Copy link", copied: "Link copied",
      report: "Report a problem", gsearch_ph: "Search documents across all subtests...",
      cd_title: "Countdown to UTBK 2027", cd_est: "Estimated date", cd_official: "Official date",
      cd_check: "Check official info at snpmb.id", cd_done: "UTBK 2027 has started. Good luck!",
      cd_d: "Days", cd_h: "Hours", cd_m: "Minutes", cd_s: "Seconds",
      promo_a: "You can study", promo_b: "anywhere,",
      promo_d: "all you need is a phone or a laptop to study on your own or together with your friends.",
      promo_btn: "Start Learning Now", promo_alt: "AFU mascot reading a book in front of a laptop",
      latest: "Latest", all: "All", sort_new: "Newest", sort_az: "Title A–Z", sort_label: "Sort",
      fav_add: "Save to favorites", fav_rm: "Remove from favorites", fav_t: "My favorites",
      fav_empty: "No favorites yet. Tap the star icon on a document to save it.",
      fav_note: "Favorites are stored in this browser only, no login needed.",
      see_pemb: "See solutions", see_soal: "See questions",
      request: "Request material", request_d: "Can't find what you need? Send a request via Instagram DM.",
      close: "Close", install: "Install app",
      about_t: "About AFU Digital Library",
      about_p: "AFU Digital Library is a free digital library for UTBK preparation. All practice modules and solutions are grouped by subtest and can be read and downloaded without logging in.",
      faq_t: "Frequently asked questions",
      q1: "Is everything free?", a1: "Yes. Every document can be read and downloaded for free without logging in.",
      q2: "How do I download a file?", a2: "Choose Practice Modules or Solutions, pick a subtest, then tap Download on the document.",
      q3: "Are questions and solutions linked?", a3: "When available, a document card has a button that opens its counterpart (questions to solutions or the reverse).",
      q4: "When is UTBK 2027?", a4: "The countdown date is an estimate until SNPMB announces the official schedule. Always check snpmb.id for updates.",
      q5: "A file won't open or looks wrong?", a5: "Tap Report a problem on that document, or send an Instagram DM.",
      q6: "Can I install it like an app?", a6: "Yes. Android (Chrome): three-dot menu, then Add to Home screen, or the Install app button at the bottom of the page. iPhone (Safari): Share, then Add to Home Screen."
    }
  };

  let lang = localStorage.getItem("afu-lang") || "id";
  const t = (k, ...a) => { const v = D[lang][k]; return typeof v === "function" ? v(...a) : v ?? k; };

  function applyStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => (el.textContent = t(el.dataset.i18n)));
    document.querySelectorAll("[data-i18n-label]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nLabel)));
    const lb = document.getElementById("langBtn");
    if (lb) lb.textContent = lang === "id" ? "ID" : "EN";
  }
  let onChange = () => {};
  function setLang(l) { lang = l; localStorage.setItem("afu-lang", l); applyStatic(); onChange(); }
  function toggleTheme() {
    const n = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n; localStorage.setItem("afu-theme", n);
  }

  // efek riak saat tombol/kartu ditekan
  document.addEventListener("pointerdown", e => {
    const el = e.target.closest(".btn,.icon-btn,.nav a,a.card,.chip,.fav,.ig,.soc");
    if (!el) return;
    const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    el.appendChild(s); setTimeout(() => s.remove(), 650);
  });

  function init(cb) {
    onChange = cb || onChange;
    applyStatic();
    document.getElementById("langBtn")?.addEventListener("click", () => setLang(lang === "id" ? "en" : "id"));
    document.getElementById("themeBtn")?.addEventListener("click", toggleTheme);
  }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const url = (path, dl) => sb.storage.from(C.BUCKET).getPublicUrl(path, dl ? { download: dl } : undefined).data.publicUrl;
  const fmtSize = n => (!n ? "" : n < 1048576 ? Math.round(n / 1024) + " KB" : (n / 1048576).toFixed(1) + " MB");

  // Statistik pengunjung (opsional, tanpa cookie) lewat GoatCounter
  if (C.GOATCOUNTER) {
    const g = document.createElement("script");
    g.async = true; g.src = "https://gc.zgo.at/count.js";
    g.dataset.goatcounter = `https://${C.GOATCOUNTER}.goatcounter.com/count`;
    g.dataset.goatcounterSettings = '{"no_onload":true}';
    g.onload = () => window.goatcounter?.count?.({ path: location.pathname });
    document.head.appendChild(g);
  }

  return { C, sb, fmtSize, configured, SUB, ABBR, t, init, esc, url, get lang() { return lang; } };
})();
