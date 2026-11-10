// Fungsi bersama: bahasa, tema, koneksi Supabase, efek tekan
const AFU = (() => {
  const C = window.AFU_CONFIG;
  const configured = C.SUPABASE_URL && !C.SUPABASE_URL.startsWith("ISI_");
  const sb = configured ? supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;

  const SUB = ["pu", "ppu", "pbm", "pk", "lbi", "lbe", "pm"];
  const ABBR = { pu: "PU", ppu: "PPU", pbm: "PBM", pk: "PK", lbi: "LBI", lbe: "LBE", pm: "PM" };

  const D = {
    id: {
      nav_home: "Beranda", nav_modul: "Modul Soal", nav_pemb: "Pembahasan", nav_to: "Try Out", nav_fav: "Favorit", nav_about: "Tentang",
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
      fav_note: "Favorit tersimpan di browser ini. Masuk ke akunmu agar favorit ikut ke perangkat lain.",
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
      nav_home: "Home", nav_modul: "Practice Modules", nav_pemb: "Solutions", nav_to: "Mock Tests", nav_fav: "Favorites", nav_about: "About",
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
      fav_note: "Favorites are stored in this browser. Log in so they follow you across devices.",
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
  function setLang(l) { lang = l; localStorage.setItem("afu-lang", l); applyStatic(); onChange(); if (typeof paintAcc === "function") paintAcc(); }
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

  // ===== Akun pengguna (email + sandi) dan sinkronisasi data belajar =====
  // Tanpa login semuanya tetap tersimpan di browser. Setelah login, data ikut tersimpan di akun (tabel user_data).
  const SYNC_KEYS = ["afu-streak", "afu-fav", "afu-target", "afu-hist", "afu-nick"];
  const L2 = (id, en) => (lang === "id" ? id : en);
  const jget = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } };
  let user = null, syncing = false, pushTimer = 0, pullDone = false, pulledFor = null, readyRes = () => {};
  const authListeners = [];
  const ready = sb ? new Promise(r => (readyRes = r)) : Promise.resolve();

  // setiap perubahan pada data belajar otomatis dikirim ke akun (jika sedang login)
  const _set = Storage.prototype.setItem, _rm = Storage.prototype.removeItem;
  const touched = (self, k) => { if (self === localStorage && !syncing && SYNC_KEYS.includes(k)) schedulePush(); };
  Storage.prototype.setItem = function (k, v) { _set.call(this, k, v); touched(this, k); };
  Storage.prototype.removeItem = function (k) { _rm.call(this, k); touched(this, k); };
  function schedulePush() {
    if (!user || !pullDone) return;
    clearTimeout(pushTimer); pushTimer = setTimeout(() => pushNow().catch(() => {}), 1200);
  }
  async function pushNow() {
    if (!user || !sb) return;
    const data = {};
    SYNC_KEYS.forEach(k => { const v = jget(k, undefined); if (v !== undefined) data[k] = v; });
    await sb.from("user_data").upsert({ user_id: user.id, data, updated_at: new Date().toISOString() });
  }
  function pickStreak(a, b) {
    if (!a) return b; if (!b) return a;
    if (a.last !== b.last) return a.last > b.last ? a : b;
    return (a.n || 0) >= (b.n || 0) ? a : b;
  }
  function tidyHist(h) {
    h.sort((x, y) => (x.ts || 0) - (y.ts || 0));
    h = h.slice(-150);
    h.forEach((x, i) => { if (i < h.length - 12) delete x.ans; });
    return h;
  }
  function mergeData(srv, known) {
    const out = {}, loc = k => jget(k, undefined);
    out["afu-streak"] = pickStreak(loc("afu-streak"), srv["afu-streak"]);
    if (known) {
      // perangkat ini sudah pernah sinkron dengan akun ini: data akun yang berlaku
      ["afu-fav", "afu-target", "afu-nick", "afu-hist"].forEach(k => (out[k] = srv[k] === undefined ? null : srv[k]));
      return out;
    }
    // sinkron pertama: gabungkan data di browser ini dengan data akun
    const fa = Array.isArray(loc("afu-fav")) ? loc("afu-fav") : [], fb = Array.isArray(srv["afu-fav"]) ? srv["afu-fav"] : [];
    out["afu-fav"] = [...new Set([...fb, ...fa])];
    out["afu-target"] = srv["afu-target"] ?? loc("afu-target");
    out["afu-nick"] = srv["afu-nick"] || loc("afu-nick") || "";
    const ha = Array.isArray(loc("afu-hist")) ? loc("afu-hist") : [], hb = Array.isArray(srv["afu-hist"]) ? srv["afu-hist"] : [];
    const seen = new Set(), all = [];
    [...hb, ...ha].forEach(x => { const id = (x.tid || "") + ":" + (x.ts || 0); if (!seen.has(id)) { seen.add(id); all.push(x); } });
    out["afu-hist"] = tidyHist(all);
    return out;
  }
  async function pullSync() {
    if (!user || !sb) return;
    const uid = user.id;
    const { data, error } = await sb.from("user_data").select("data").eq("user_id", uid).maybeSingle();
    if (error) return; // jaringan atau migrasi belum dijalankan: data lokal tetap dipakai
    const known = !!data && localStorage.getItem("afu-synced") === uid;
    const merged = mergeData(data?.data || {}, known);
    let changed = false;
    syncing = true;
    SYNC_KEYS.forEach(k => {
      const v = merged[k], cur = localStorage.getItem(k);
      if (v === undefined || v === null) { if (cur !== null) { _rm.call(localStorage, k); changed = true; } return; }
      const s = JSON.stringify(v);
      if (cur !== s) { _set.call(localStorage, k, s); changed = true; }
    });
    _set.call(localStorage, "afu-synced", uid);
    syncing = false; pullDone = true;
    try { await pushNow(); } catch (e) {}
    const inExam = document.body.classList.contains("in-exam") || !!window.AFU?.TO?.busy?.();
    if (changed && !inExam && Date.now() - +(sessionStorage.getItem("afu-sync-rl") || 0) > 20000) {
      sessionStorage.setItem("afu-sync-rl", String(Date.now())); location.reload();
    }
  }
  function wipeLocal() {
    syncing = true;
    SYNC_KEYS.forEach(k => _rm.call(localStorage, k));
    _rm.call(localStorage, "afu-synced");
    Object.keys(localStorage).filter(k => k.startsWith("afu-draft-")).forEach(k => _rm.call(localStorage, k));
    syncing = false;
  }
  const authErr = e => {
    const m = String(e?.message || e || "");
    if (/invalid login|invalid credentials/i.test(m)) return L2("Email atau sandi salah.", "Wrong email or password.");
    if (/not confirmed/i.test(m)) return L2("Email belum diverifikasi. Cek kotak masuk (dan folder spam).", "Email not verified yet. Check your inbox (and spam).");
    if (/rate limit|too many|after \d+ seconds/i.test(m)) return L2("Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.", "Too many attempts. Please wait a moment and try again.");
    if (/password/i.test(m)) return L2("Sandi belum memenuhi syarat (minimal 8 karakter).", "Password is too weak (minimum 8 characters).");
    if (/network|fetch/i.test(m)) return L2("Koneksi bermasalah. Coba lagi.", "Connection problem. Please try again.");
    return L2("Terjadi kesalahan. Coba lagi.", "Something went wrong. Please try again.");
  };
  async function signOut() {
    if (window.AFU?.TO?.busy?.()) { alert(L2("Selesaikan try out yang sedang berjalan dulu.", "Finish the running mock test first.")); return false; }
    try { await pushNow(); } catch (e) {}
    await sb.auth.signOut();
    wipeLocal(); location.reload();
  }

  if (sb) {
    sb.auth.onAuthStateChange((ev, session) => {
      const before = user?.id || null;
      user = session?.user || null;
      readyRes();
      if (ev === "SIGNED_OUT") { wipeLocal(); pullDone = false; pulledFor = null; }
      if (user && pulledFor !== user.id) { pulledFor = user.id; pullDone = false; setTimeout(() => pullSync().catch(() => {}), 0); }
      if (ev === "PASSWORD_RECOVERY") setTimeout(() => openAccount({ mode: "recover" }), 0);
      paintAcc();
      if ((user?.id || null) !== before) authListeners.forEach(fn => { try { fn(user); } catch (e) {} });
    });
  }

  // ---- tombol akun di header + dialog ----
  function paintAcc() {
    const b = document.getElementById("accBtn"); if (!b) return;
    b.innerHTML = user ? `<span class="acc-av">${esc((user.email || "?")[0].toUpperCase())}</span>`
      : '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>';
    const lab = user ? L2("Akun saya", "My account") : L2("Masuk atau daftar", "Log in or sign up");
    b.setAttribute("aria-label", lab); b.title = lab; b.classList.toggle("on", !!user);
  }
  function mountAcc() {
    if (!sb) return;
    const ctrl = document.querySelector(".ctrl");
    if (!ctrl || document.getElementById("accBtn")) return;
    const b = document.createElement("button");
    b.id = "accBtn"; b.type = "button"; b.className = "icon-btn acc-btn";
    b.addEventListener("click", () => openAccount());
    ctrl.insertBefore(b, ctrl.firstChild); paintAcc();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAcc); else mountAcc();

  function openAccount(o = {}) {
    if (!sb) return;
    document.getElementById("afuAuth")?.remove();
    let mode = o.mode || (user ? "acct" : "in");
    const d = document.createElement("div");
    d.className = "dlg"; d.id = "afuAuth"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    document.body.appendChild(d);
    const close = () => d.remove();
    d.addEventListener("click", e => { if (e.target === d) close(); });
    const say = (text, ok) => { const m = d.querySelector(".acc-msg"); if (!m) return; m.textContent = text || ""; m.className = "acc-msg notice " + (ok ? "ok" : "warn"); m.hidden = !text; };
    const busy = (on) => d.querySelectorAll("button,input").forEach(x => (x.disabled = on));
    const msgBox = '<p class="acc-msg notice" hidden role="alert"></p>';
    const closeBtn = `<button class="btn ghost" type="button" data-x="close">${esc(L2("Tutup", "Close"))}</button>`;

    function draw() {
      if (mode === "acct") {
        const nick = jget("afu-nick", "");
        d.innerHTML = `<div class="dlg-card acc">
          <h3>${esc(L2("Akun saya", "My account"))}</h3>
          <p class="acc-mail">${esc(user?.email || "")}</p>
          <label>${esc(L2("Nama panggilan (tampil di peringkat)", "Nickname (shown on the leaderboard)"))}
            <input id="accNick" maxlength="24" value="${esc(nick)}" autocomplete="nickname"></label>
          <p class="muted acc-note">${esc(L2("Streak, riwayat try out, favorit, dan target nilaimu tersimpan di akun ini dan ikut ke perangkat lain saat kamu masuk.", "Your streak, mock test history, favorites and target are saved to this account and follow you across devices."))}</p>
          ${msgBox}
          <div class="btns"><button class="btn ghost" type="button" data-x="save">${esc(L2("Simpan nama", "Save nickname"))}</button><button class="btn" type="button" data-x="out">${esc(L2("Keluar", "Log out"))}</button></div>
          <p class="acc-foot"><button class="linkbtn danger-l" type="button" data-x="del">${esc(L2("Hapus akun saya", "Delete my account"))}</button> · <button class="linkbtn" type="button" data-x="close">${esc(L2("Tutup", "Close"))}</button></p>
        </div>`;
      } else if (mode === "forgot") {
        d.innerHTML = `<div class="dlg-card acc"><h3>${esc(L2("Lupa sandi", "Forgot password"))}</h3>
          <p class="muted">${esc(L2("Masukkan email akunmu. Kami kirim tautan untuk membuat sandi baru.", "Enter your account email. We will send you a link to set a new password."))}</p>
          <form id="accForm" novalidate>
            <label>Email<input id="accEmail" type="email" autocomplete="email" required></label>${msgBox}
            <div class="btns"><button class="btn ghost" type="button" data-m="in">${esc(L2("Kembali", "Back"))}</button><button class="btn" type="submit">${esc(L2("Kirim tautan", "Send link"))}</button></div>
          </form></div>`;
      } else if (mode === "recover") {
        d.innerHTML = `<div class="dlg-card acc"><h3>${esc(L2("Buat sandi baru", "Set a new password"))}</h3>
          <form id="accForm" novalidate>
            <label>${esc(L2("Sandi baru (minimal 8 karakter)", "New password (min. 8 characters)"))}<input id="accPw" type="password" autocomplete="new-password" required></label>
            <label>${esc(L2("Ulangi sandi baru", "Repeat new password"))}<input id="accPw2" type="password" autocomplete="new-password" required></label>${msgBox}
            <div class="btns">${closeBtn}<button class="btn" type="submit">${esc(L2("Simpan sandi", "Save password"))}</button></div>
          </form></div>`;
      } else {
        const up = mode === "up";
        d.innerHTML = `<div class="dlg-card acc">
          <h3>${esc(up ? L2("Buat akun", "Create account") : L2("Masuk", "Log in"))}</h3>
          ${o.reason ? `<p class="muted">${esc(o.reason)}</p>` : ""}
          <div class="acc-tabs" role="tablist">
            <button type="button" role="tab" data-m="in" aria-pressed="${!up}">${esc(L2("Masuk", "Log in"))}</button>
            <button type="button" role="tab" data-m="up" aria-pressed="${up}">${esc(L2("Daftar", "Sign up"))}</button>
          </div>
          <form id="accForm" novalidate>
            <label>Email<input id="accEmail" type="email" autocomplete="email" required></label>
            <label>${esc(L2("Sandi", "Password"))}${up ? esc(L2(" (minimal 8 karakter)", " (min. 8 characters)")) : ""}<input id="accPw" type="password" autocomplete="${up ? "new-password" : "current-password"}" required></label>
            ${up ? `<label>${esc(L2("Ulangi sandi", "Repeat password"))}<input id="accPw2" type="password" autocomplete="new-password" required></label>
            <label class="dlg-chk"><input type="checkbox" id="accAgree"><span>${esc(L2("Saya setuju data akunku (email, skor, streak, riwayat) disimpan sesuai", "I agree my account data (email, scores, streak, history) is stored as described in the"))} <a href="/privasi" target="_blank" rel="noopener">${esc(L2("Kebijakan Privasi", "Privacy Policy"))}</a>.</span></label>` : ""}
            ${msgBox}
            <div class="btns">${closeBtn}<button class="btn" type="submit">${esc(up ? L2("Daftar", "Sign up") : L2("Masuk", "Log in"))}</button></div>
          </form>
          ${up ? "" : `<p class="acc-foot"><button class="linkbtn" type="button" data-m="forgot">${esc(L2("Lupa sandi?", "Forgot password?"))}</button></p>`}
        </div>`;
      }
      d.querySelector("input")?.focus();
    }

    d.addEventListener("click", async e => {
      const m = e.target.closest("[data-m]");
      if (m) { mode = m.dataset.m; draw(); return; }
      const x = e.target.closest("[data-x]"); if (!x) return;
      const a = x.dataset.x;
      if (a === "close") close();
      else if (a === "save") {
        const v = d.querySelector("#accNick").value.trim().slice(0, 24);
        localStorage.setItem("afu-nick", JSON.stringify(v)); say(L2("Tersimpan.", "Saved."), true);
      } else if (a === "out") { busy(true); if ((await signOut()) === false) busy(false); }
      else if (a === "del") {
        if (!confirm(L2("Hapus akunmu beserta skor, riwayat, dan data belajar secara permanen? Ini tidak bisa dibatalkan.", "Permanently delete your account with all scores, history and study data? This cannot be undone."))) return;
        busy(true);
        const { error } = await sb.rpc("delete_my_account");
        if (error) { busy(false); return say(/admin/i.test(error.message) ? L2("Akun admin tidak bisa dihapus dari website.", "Admin accounts cannot be deleted here.") : authErr(error), false); }
        await sb.auth.signOut({ scope: "local" }); wipeLocal(); location.reload();
      }
    });

    d.addEventListener("submit", async e => {
      e.preventDefault();
      const email = d.querySelector("#accEmail")?.value.trim() || "";
      const pw = d.querySelector("#accPw")?.value || "", pw2 = d.querySelector("#accPw2")?.value || "";
      const okMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      try {
        if (mode === "forgot") {
          if (!okMail) return say(L2("Format email belum benar.", "Invalid email address."), false);
          busy(true);
          const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + "/" });
          busy(false);
          if (error) return say(authErr(error), false);
          return say(L2("Jika email terdaftar, tautan untuk membuat sandi baru sudah dikirim. Cek juga folder spam.", "If the email is registered, a link to set a new password has been sent. Check spam too."), true);
        }
        if (mode === "recover") {
          if (pw.length < 8) return say(L2("Sandi minimal 8 karakter.", "Password must be at least 8 characters."), false);
          if (pw !== pw2) return say(L2("Kedua sandi belum sama.", "The two passwords do not match."), false);
          busy(true);
          const { error } = await sb.auth.updateUser({ password: pw });
          busy(false);
          if (error) return say(authErr(error), false);
          say(L2("Sandi diperbarui. Kamu sudah masuk.", "Password updated. You are logged in."), true);
          return setTimeout(close, 1200);
        }
        if (!okMail) return say(L2("Format email belum benar.", "Invalid email address."), false);
        if (mode === "in") {
          if (!pw) return say(L2("Isi sandimu.", "Enter your password."), false);
          busy(true);
          const { error } = await sb.auth.signInWithPassword({ email, password: pw });
          if (error) { busy(false); return say(authErr(error), false); }
          return close();
        }
        // daftar
        if (pw.length < 8) return say(L2("Sandi minimal 8 karakter.", "Password must be at least 8 characters."), false);
        if (pw !== pw2) return say(L2("Kedua sandi belum sama.", "The two passwords do not match."), false);
        if (!d.querySelector("#accAgree").checked) return say(L2("Centang persetujuan dulu.", "Please tick the agreement first."), false);
        busy(true);
        const { data, error } = await sb.auth.signUp({ email, password: pw, options: { emailRedirectTo: location.origin + "/" } });
        busy(false);
        if (error) return say(authErr(error), false);
        if (data?.session) return close();
        say(L2("Hampir selesai! Kami mengirim email verifikasi. Klik tautan di dalamnya, lalu kembali ke sini dan masuk. Cek folder spam jika belum terlihat.", "Almost done! We sent a verification email. Click the link inside, then come back and log in. Check spam if you do not see it."), true);
      } catch (err) { busy(false); say(authErr(err), false); }
    });
    d.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    draw();
  }

  const auth = {
    get user() { return user; },
    ready,
    onChange(fn) { authListeners.push(fn); },
    open: openAccount,
    signOut
  };

  const extend = (l, o) => Object.assign(D[l], o);
  return { C, sb, fmtSize, configured, SUB, ABBR, t, init, esc, url, extend, auth, get lang() { return lang; } };
})();
