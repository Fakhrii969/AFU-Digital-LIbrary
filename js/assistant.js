// Asisten AFU: widget chat (customer service).
// Urutan jawab: (0) saringan data pribadi -> (1) FAQ + pencarian dokumen (gratis, instan) -> (2) Gemini lewat
// Supabase Edge Function (supabase/functions/afu-assistant), hanya untuk pertanyaan yang tidak cocok dengan FAQ.
// Kalau AI_ENDPOINT kosong atau AI gagal/jatah habis, asisten tetap menjawab sopan tanpa error.
(() => {
  "use strict";
  const { t, esc, C } = AFU;
  const tr = (id, en) => (AFU.lang === "id" ? id : en);
  const App = () => window.AFUApp;
  const WA = "https://wa.me/6282225013782";
  const KEY = "afu-chat";
  let msgs = [], open = false, busy = false;
  try { msgs = JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (e) {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-30))); } catch (e) {} };

  // teks aman -> html: **tebal**, [judul](link), baris baru
  const render = txt => esc(txt)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\[([^\]]+)\]\(((?:https:\/\/|\/)[^)\s]+)\)/g, (m, a, u) => `<a href="${u}"${u.startsWith("/") ? "" : ' target="_blank" rel="noopener"'}>${a}</a>`)
    .replace(/\n/g, "<br>");

  // ---------- saringan data pribadi (samakan dengan hasPII di supabase/functions/afu-assistant/index.ts) ----------
  const hasPII = s => {
    const q = String(s).toLowerCase();
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(q)
      || /\d{8,}/.test(q)
      || /\b\d{3,4}[\s.\-]\d{3,4}[\s.\-]\d{2,}/.test(q)
      || /(?:\+?62|\b0)\s*8\d[\d\s.\-]{6,}/.test(q)
      || /\b(?:kata\s*sandi|sandi|password|passwd|pw|pin|otp)(?:ku|nya)?\s*(?:saya|aku|gue|baru|lama)?\s*(?:adalah|yaitu|is|:|=|->)\s*\S+/.test(q)
      || /\b(?:kata\s*sandi|sandi|password|passwd|pw|pin|otp)(?:ku|nya)?\s+(?:saya|aku|gue|baru|lama)?\s*\S*\d\S*/.test(q);
  };
  const PII_MSG = () => tr("Pengingat ramah: yuk jangan tulis data pribadi (email, nomor HP, deretan angka panjang, atau kata sandi) di chat ini ya. Pesan tadi tidak aku proses. Tanyakan lagi tanpa data itu, atau hubungi admin lewat [WhatsApp](" + WA + ").",
    "Friendly reminder: please don't type personal data (email, phone number, long ID numbers or passwords) in this chat. I didn't process that message. Ask again without it, or contact the admin on [WhatsApp](" + WA + ").");
  const AI_DOWN = () => tr("Maaf ya, asisten AI lagi istirahat sebentar. Coba lihat Pertanyaan umum di halaman [Beranda](/) atau chat admin lewat [WhatsApp](" + WA + ").",
    "Sorry, the AI helper is resting for a bit. Please check the FAQ on the [Home](/) page or chat the admin on [WhatsApp](" + WA + ").");

  // ---------- otak lokal (FAQ) ----------
  const has = (q, words) => words.some(w => q.includes(w));
  const SUBKEY = {
    pu: ["penalaran umum", " pu ", "pu."], ppu: ["ppu", "pengetahuan dan pemahaman", "pengetahuan umum"], pbm: ["pbm", "bacaan dan menulis"],
    pk: ["kuantitatif", " pk "], lbi: ["lbi", "literasi bahasa indonesia", "literasi indonesia"], lbe: ["lbe", "literasi bahasa inggris", "bahasa inggris", "english"], pm: ["penalaran matematika", " pm ", "matematika"]
  };
  async function searchDocs(q, n = 4) {
    const stop = new Set(["cari", "carikan", "dokumen", "modul", "soal", "pembahasan", "tolong", "ada", "apa", "yang", "dong", "mau", "minta", "find", "search", "the", "for", "please", "a", "an", "of", "untuk", "dan", "di", "ke"]);
    const toks = q.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 1 && !stop.has(w));
    if (!toks.length) return [];
    let all = [];
    try { all = await App().loadAll(); } catch (e) { return []; }
    return all.map(d => {
      const hay = (d.title + " " + (d.description || "") + " " + (d.category || "") + " " + d.subtest).toLowerCase();
      const hit = toks.filter(w => hay.includes(w)).length;
      return { d, hit };
    }).filter(x => x.hit && x.hit >= Math.ceil(toks.length / 2)).sort((a, b) => b.hit - a.hit).slice(0, n).map(x => x.d);
  }
  const docLinks = ds => ds.map(d => `• [${d.title}](${AFU.url(d.file_path)}) (${d.type === "soal" ? t("modul_t") : t("pemb_t")} ${AFU.ABBR[d.subtest]})`).join("\n");
  function daysLeft() {
    const S = App().S, ms = new Date(S.utbk_date).getTime();
    if (isNaN(ms)) return null;
    const d = Math.ceil((ms - Date.now()) / 864e5);
    const date = new Date(ms).toLocaleDateString(AFU.lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
    return { d, date, official: S.utbk_confirmed === "true" };
  }

  async function localReply(raw, strict) {
    const q = " " + raw.toLowerCase().replace(/[?!.,]/g, " ") + " ";
    if (has(q, [" halo", " hai ", " hi ", " hello", " pagi", " siang", " sore", " malam", "assalam", "permisi"]) && q.length < 40)
      return tr("Halo! Aku asisten AFU. Aku bisa bantu cari materi, jelasin cara pakai Try Out, atau info UTBK. Mau tanya apa?", "Hi! I'm the AFU assistant. I can help you find materials, explain how Mock Tests work, or share UTBK info. What would you like to know?");
    if (has(q, ["terima kasih", "makasih", "thanks", "thank you", "thx"]))
      return tr("Sama-sama! Semangat belajarnya ya. Kalau butuh apa-apa lagi, tanya aja.", "You're welcome! Keep up the great studying. Ask me anytime.");
    if (has(q, [" cari", " carikan", " search", " find "])) { const f = await searchDocs(raw); if (f.length) return tr("Ini dokumen yang cocok:\n", "Here are matching documents:\n") + docLinks(f); }
    if (has(q, ["try out", "tryout", "simulasi", "mock", "ujian online"]) || has(q, ["skor", "nilai try", "nilai tryout", "nilaiku", "score", "statistik", "statistic", "peringkat", "ranking", "leaderboard"]))
      return tr("**Try Out** ada di tab [Try Out](/tryout). Ada timer, jawaban tersimpan otomatis, dan nilai dihitung sistem. Untuk mengerjakannya kamu perlu **masuk ke akun** dulu.\n\nPengerjaan **pertama** tiap try out di akunmu yang dihitung ke statistik dan peringkat; pengerjaan berikutnya jadi latihan ulang. Skor tiap subtes 0–1000 (benar ÷ jumlah soal), skor total adalah rata-rata subtes. Peringkat memakai nama panggilanmu (boleh nama samaran). Lihat perkembanganmu di [Statistik Saya](/tryout/statistik).",
        "**Mock Tests** live in the [Mock Tests](/tryout) tab. They have a timer, auto-saved answers, and system-graded scores. You need to **log in** to take them.\n\nYour **first** attempt at each mock test on your account counts toward statistics and rankings; later ones are practice runs. Each subtest is scored 0–1000 (correct ÷ questions) and the total is the subtest average. Rankings show your nickname (it can be a pseudonym). Track progress in [My Statistics](/tryout/statistik).");
    if (has(q, ["kapan utbk", "jadwal utbk", "tanggal utbk", "berapa hari", "hitung mundur", "countdown", "when is utbk", "utbk date", "how many days"])) {
      const x = daysLeft();
      if (x) return x.d > 0
        ? tr(`UTBK 2027 kira-kira **${x.d} hari lagi** (${x.date}). Tanggal ini ${x.official ? "sudah resmi dari SNPMB" : "masih perkiraan sampai SNPMB mengumumkan jadwal resmi"}. Selalu cek [snpmb.id](https://snpmb.id).`,
             `UTBK 2027 is about **${x.d} days away** (${x.date}). This date is ${x.official ? "official from SNPMB" : "an estimate until SNPMB announces the official schedule"}. Always check [snpmb.id](https://snpmb.id).`)
        : tr("UTBK 2027 sudah dimulai. Semangat dan sukses!", "UTBK 2027 has started. Good luck!");
    }
    if (has(q, ["lupa sandi", "lupa password", "lupa kata sandi", "reset sandi", "reset password", "ganti sandi", "ganti password", "forgot password", "forgot my password", "reset my password"]))
      return tr("Tenang, gampang kok. Klik ikon akun di bagian atas halaman, pilih **Masuk**, lalu tekan **Lupa sandi?**. Isi email akunmu, nanti kami kirim tautan untuk membuat sandi baru. Cek folder spam kalau belum terlihat ya.",
        "No worries, it's easy. Tap the account icon at the top of the page, choose **Log in**, then tap **Forgot password?**. Enter your account email and we'll send a link to set a new password. Check spam if you don't see it.");
    if (has(q, ["hapus akun", "delete account", "delete my account", "hapus data saya", "tutup akun"]))
      return tr("Klik ikon akun di bagian atas halaman, lalu pilih **Hapus akun saya**. Akun, skor di peringkat, dan data belajarmu (streak, riwayat, favorit, target) ikut terhapus **permanen** dan tidak bisa dikembalikan. Detailnya ada di [Kebijakan Privasi](/privasi).",
        "Tap the account icon at the top of the page, then choose **Delete my account**. Your account, leaderboard scores and study data (streak, history, favorites, target) are deleted **permanently** and cannot be restored. Details are in the [Privacy Policy](/privasi).");
    if (has(q, ["streak", "beruntun", "target nilai", "riwayat"]))
      return tr("**Streak** menghitung hari belajarmu berturut-turut. Streak, riwayat try out, favorit, dan target nilaimu tersimpan di akun dan ikut ke perangkat lain saat kamu masuk. Kalau belum masuk, datanya hanya ada di browser ini. Lihat perkembanganmu di [Statistik Saya](/tryout/statistik).",
        "Your **streak** counts consecutive study days. Streak, mock test history, favorites and target are saved to your account and follow you to other devices when you log in. If you're not logged in, they only live in this browser. See your progress in [My Statistics](/tryout/statistik).");
    if (has(q, ["daftar", "buat akun", "sign up", "signup", "register", "masuk akun", "log in", "login", "belum bisa masuk", "verifikasi"]) && !has(q, ["daftar isi", "daftar soal"]))
      return tr("Klik ikon akun di bagian atas halaman, pilih tab **Daftar**, isi email dan sandi (minimal 8 karakter), centang persetujuan, lalu klik **Daftar**. Kami kirim email verifikasi; klik tautannya, lalu kembali dan **Masuk**. Cek folder spam kalau belum terlihat. Akun hanya dibutuhkan untuk [Try Out](/tryout); membaca dan download dokumen tetap tanpa login.",
        "Tap the account icon at the top of the page, choose the **Sign up** tab, enter your email and a password (min. 8 characters), tick the agreement, then tap **Sign up**. We'll send a verification email; click the link, then come back and **Log in**. Check spam if you don't see it. An account is only needed for [Mock Tests](/tryout); reading and downloading stay login-free.");
    if (has(q, ["install", "pasang", "aplikasi", "layar utama", "home screen", " app "])) return t("a6");
    if (has(q, ["gratis", "bayar", "berbayar", "free", "harga", "biaya"])) return t("a1") + tr(" Akun hanya dibutuhkan untuk mengerjakan Try Out.", " An account is only needed for Mock Tests.");
    if (has(q, ["download", "unduh", "simpan pdf", "save pdf"])) return t("a2");
    if (has(q, ["favorit", "favorite", "bintang", "bookmark", "simpan dokumen"])) return tr("Tekan ikon bintang di kartu dokumen untuk menyimpannya. Semua favoritmu ada di tab [Favorit](/favorit). Kalau kamu masuk ke akun, favoritmu ikut ke perangkat lain; kalau belum, tersimpan di browser ini saja.", "Tap the star on a document card to save it. All your favorites live in the [Favorites](/favorit) tab. If you're logged in they follow you to other devices; otherwise they're stored in this browser only.");
    if (has(q, ["lapor", "error", "rusak", "tidak bisa dibuka", "gak bisa dibuka", "nggak bisa", "gagal", "isinya salah", "ada yang salah", "bug", "report", "broken", "doesn't open", "not open"]))
      return tr(`Maaf ya ada kendala. Kamu bisa lapor lewat [DM Instagram](${App().IG_DM}) atau chat [WhatsApp admin](${WA}). Sebutkan judul dokumen dan masalahnya supaya cepat dibereskan.`, `Sorry about the trouble. Report it via [Instagram DM](${App().IG_DM}) or [WhatsApp admin](${WA}). Include the document title and the problem so we can fix it fast.`);
    if (has(q, ["minta materi", "request", "permintaan", "belum ada", "tidak ada materi", "tambah materi", "tambahin"]))
      return tr(`Materi yang kamu cari belum ada? Kirim permintaan lewat [DM Instagram](${App().IG_DM}) ya, nanti kami usahakan.`, `Can't find what you need? Send a request via [Instagram DM](${App().IG_DM}) and we'll try to add it.`);
    if (has(q, ["kontak", "hubungi", "admin", "cs ", "whatsapp", " wa ", "email", "instagram", "tiktok", "contact", "human", "manusia"]))
      return tr(`Kamu bisa hubungi tim AFU lewat:\n• [WhatsApp 0822-2501-3782](${WA})\n• [Instagram @afu.digital.library](https://www.instagram.com/afu.digital.library/)\n• [TikTok](https://www.tiktok.com/@afu.digital.library)\n• afudigitallibrary@gmail.com`,
        `You can reach the AFU team via:\n• [WhatsApp 0822-2501-3782](${WA})\n• [Instagram @afu.digital.library](https://www.instagram.com/afu.digital.library/)\n• [TikTok](https://www.tiktok.com/@afu.digital.library)\n• afudigitallibrary@gmail.com`);
    if (has(q, ["tips", "strategi", "cara belajar", "tips belajar", "study", "strategy", "motivasi", "fokus", "pomodoro"]))
      return tr("Tips singkat:\n1. Kerjakan **Try Out** berkala untuk tahu posisimu, lalu lihat subtes terlemah di [Statistik](/tryout/statistik).\n2. Latih subtes lemah lewat [Modul Soal](/modul), cek [Pembahasan](/pembahasan) setelahnya.\n3. Pakai **Fokus Timer** (Pomodoro) di beranda: 25 menit fokus, 5 menit istirahat.\n4. Konsisten tiap hari lebih ampuh daripada belajar maraton.",
        "Quick tips:\n1. Take **Mock Tests** regularly to see where you stand, then check your weakest subtest in [Statistics](/tryout/statistik).\n2. Practice weak subtests with [Practice Modules](/modul), then read the [Solutions](/pembahasan).\n3. Use the **Focus Timer** (Pomodoro) on the home page: 25 minutes focus, 5 minutes rest.\n4. Daily consistency beats marathon sessions.");
    for (const k of AFU.SUB) {
      if (has(q, SUBKEY[k])) return `**${AFU.ABBR[k]} · ${t("s_" + k)}**\n${t("sd_" + k)}\n\n[${t("modul_t")} ${AFU.ABBR[k]}](/modul/${k}) · [${t("pemb_t")} ${AFU.ABBR[k]}](/pembahasan/${k})`;
    }
    if (has(q, ["pembahasan", "kunci jawaban", "solution", "answer key", "explanation"]) && !(await searchDocs(raw, 1)).length)
      return tr("Pembahasan dikelompokkan per subtes di tab [Pembahasan](/pembahasan). Di kartu Modul Soal ada tombol **Lihat pembahasan** kalau pasangannya tersedia.", "Solutions are grouped by subtest in the [Solutions](/pembahasan) tab. Practice cards have a **See solutions** button when a pair is available.");
    // cari dokumen
    const ds = await searchDocs(raw);
    if (ds.length) return tr("Ini dokumen yang cocok:\n", "Here are matching documents:\n") + docLinks(ds);
    if (strict) return null; // tidak ada jawaban FAQ -> serahkan ke Gemini
    return tr(`Hmm, aku belum menemukan jawabannya. Coba kata kunci lain (misalnya nama subtes atau judul), atau tanya admin lewat [WhatsApp](${WA}). Kamu juga bisa [minta materi](${App().IG_DM}).`,
      `Hmm, I couldn't find an answer. Try other keywords (like a subtest name or title), or ask the admin on [WhatsApp](${WA}). You can also [request material](${App().IG_DM}).`);
  }

  // ---------- AI sungguhan (opsional) ----------
  async function aiReply(raw) {
    const ds = await searchDocs(raw, 5);
    const body = {
      lang: AFU.lang, page: location.pathname,
      messages: msgs.filter(m => !m.skip && !m.pii).slice(-5).map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text.slice(0, 600) })).concat([{ role: "user", content: raw.slice(0, 600) }]).slice(-6),
      docs: ds.map(d => ({ title: d.title, type: d.type, subtest: d.subtest, url: AFU.url(d.file_path) })),
      utbk: daysLeft()
    };
    const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 20000);
    try {
      const r = await fetch(C.AI_ENDPOINT, { method: "POST", signal: ctl.signal,
        headers: { "Content-Type": "application/json", apikey: C.SUPABASE_ANON_KEY, Authorization: "Bearer " + C.SUPABASE_ANON_KEY }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error("http " + r.status);
      const j = await r.json();
      if (!j.reply) throw new Error("empty");
      return String(j.reply);
    } finally { clearTimeout(to); }
  }

  // ---------- UI ----------
  let fab, panel, list, input;
  const chips = () => [
    tr("Cara download", "How to download"), tr("Info Try Out", "About Mock Tests"), tr("Kapan UTBK?", "When is UTBK?"),
    tr("Tips belajar", "Study tips"), tr("Hubungi admin", "Contact admin")
  ];
  const chipQ = () => [
    tr("Bagaimana cara download?", "How do I download?"), tr("Jelaskan cara kerja Try Out", "Explain how Mock Tests work"), tr("Kapan UTBK 2027?", "When is UTBK 2027?"),
    tr("Tips belajar UTBK", "UTBK study tips"), tr("Kontak admin", "Contact admin")
  ];
  function paint() {
    list.innerHTML = msgs.map(m => `<div class="ai-m ${m.role}">${m.role === "bot" ? '<img src="/assets/mascot-face.webp" alt="" width="32" height="32">' : ""}<div class="ai-b">${render(m.text)}</div></div>`).join("")
      + (busy ? '<div class="ai-m bot"><img src="/assets/mascot-face.webp" alt="" width="32" height="32"><div class="ai-b typing"><i></i><i></i><i></i></div></div>' : "");
    list.scrollTop = list.scrollHeight;
  }
  function welcome() {
    if (!msgs.length) { msgs.push({ role: "bot", skip: true, text: tr("Halo! Aku **Asisten AFU** 👋\nAku bisa bantu cari materi, jelasin cara pakai Try Out, atau info UTBK. Pilih topik di bawah atau langsung tulis pertanyaanmu.", "Hi! I'm the **AFU Assistant** 👋\nI can help you find materials, explain Mock Tests, or share UTBK info. Pick a topic below or just type your question.") }); save(); }
  }
  async function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    const pii = hasPII(text);
    // pesan berisi data pribadi tidak disimpan di riwayat chat dan tidak pernah dikirim ke AI
    msgs.push({ role: "user", pii, text: pii ? tr("(pesan berisi data pribadi, disembunyikan)", "(message with personal data, hidden)") : text.slice(0, 500) });
    busy = true; input.value = ""; paint(); save();
    let reply;
    const t0 = Date.now();
    if (pii) reply = PII_MSG();
    else {
      try {
        reply = await localReply(text, true);                       // 1) FAQ dulu (gratis, instan)
        if (reply === null) {                                       // 2) di luar FAQ -> Gemini
          if (C.AI_ENDPOINT) { try { reply = await aiReply(text); } catch (e) { reply = AI_DOWN(); } }
          else reply = await localReply(text);
        }
      } catch (e) { reply = tr("Maaf, ada kendala. Coba lagi ya, atau hubungi admin lewat WhatsApp.", "Sorry, something went wrong. Please try again or contact the admin on WhatsApp."); }
    }
    const wait = Math.max(0, 550 - (Date.now() - t0));
    setTimeout(() => { busy = false; msgs.push({ role: "bot", text: reply }); paint(); save(); }, wait);
  }
  function toggle(on) {
    open = on ?? !open;
    panel.classList.toggle("on", open); fab.classList.toggle("hide", open);
    panel.setAttribute("aria-hidden", String(!open));
    if (open) { welcome(); paint(); setTimeout(() => input.focus(), 250); }
  }
  function build() {
    fab = document.createElement("button");
    fab.type = "button"; fab.className = "ai-fab";
    fab.setAttribute("aria-label", tr("Buka asisten AFU", "Open AFU assistant"));
    fab.innerHTML = `<img src="/assets/mascot-face.webp" alt="" width="44" height="44"><span class="ai-lbl"></span><i class="ai-dot"></i>`;
    panel = document.createElement("section");
    panel.className = "ai-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Asisten AFU"); panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `
      <header class="ai-h"><img src="/assets/mascot-face.webp" alt="" width="40" height="40">
        <div><b>${tr("Asisten AFU", "AFU Assistant")}</b><span class="ai-on">${C.AI_ENDPOINT ? "AI" : tr("Online", "Online")}</span></div>
        <button type="button" class="ai-x" aria-label="${esc(t("close"))}">×</button></header>
      <div class="ai-list" id="aiList" aria-live="polite"></div>
      <div class="ai-chips" id="aiChips"></div>
      <form class="ai-f" id="aiForm" autocomplete="off"><input id="aiIn" type="text" maxlength="300" placeholder="${esc(tr("Tulis pertanyaanmu...", "Type your question..."))}" aria-label="${esc(tr("Pertanyaan", "Question"))}">
        <button type="submit" class="ai-s" aria-label="${esc(tr("Kirim", "Send"))}"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>`;
    document.body.append(fab, panel);
    list = panel.querySelector("#aiList"); input = panel.querySelector("#aiIn");
    const drawChips = () => {
      const c = panel.querySelector("#aiChips"), q = chipQ();
      c.innerHTML = chips().map((x, i) => `<button type="button" class="chip" data-q="${esc(q[i])}">${esc(x)}</button>`).join("");
    };
    drawChips();
    // label sapaan singkat di tombol (muncul sebentar)
    const lbl = fab.querySelector(".ai-lbl");
    lbl.textContent = tr("Tanya AFU", "Ask AFU");
    fab.addEventListener("click", () => toggle(true));
    panel.querySelector(".ai-x").addEventListener("click", () => toggle(false));
    panel.querySelector("#aiChips").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (b) send(b.dataset.q); });
    panel.querySelector("#aiForm").addEventListener("submit", e => { e.preventDefault(); send(input.value); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && open) toggle(false); });
    // tautan di dalam chat tetap membuka halaman tanpa reload; di HP panel ditutup agar halaman terlihat
    list.addEventListener("click", e => { const a = e.target.closest("a[href^='/']"); if (a && innerWidth < 640) toggle(false); });
    // ganti bahasa: segarkan label dan chip
    document.getElementById("langBtn")?.addEventListener("click", () => setTimeout(() => {
      lbl.textContent = tr("Tanya AFU", "Ask AFU"); drawChips();
      panel.querySelector("b").textContent = tr("Asisten AFU", "AFU Assistant");
      input.placeholder = tr("Tulis pertanyaanmu...", "Type your question...");
    }, 0));
    setTimeout(() => fab.classList.add("nudge"), 4000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
