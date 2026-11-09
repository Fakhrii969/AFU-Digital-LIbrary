// Try Out + Statistik nilai. Penilaian dilakukan di server (fungsi submit_tryout);
// pengerjaan PERTAMA tiap perangkat dihitung ke statistik dan peringkat.
(() => {
  "use strict";
  const { t, esc, sb, SUB, ABBR } = AFU;

  AFU.extend("id", {
    to_title: "Try Out UTBK", to_sub: "Kerjakan simulasi dengan timer, nilai dihitung sistem, lalu pantau perkembanganmu.",
    to_tab_list: "Daftar Try Out", to_tab_stats: "Statistik Saya",
    to_empty: "Belum ada try out yang tersedia. Pantau terus ya!",
    to_nq: n => n + " soal", to_nmin: n => n + " menit",
    to_start: "Mulai mengerjakan", to_resume: "Lanjutkan pengerjaan", to_open: "Buka", to_first_score: "Skor pertama",
    to_draft: "Ada draft",
    to_rules_t: "Aturan main",
    to_rule1: "Timer berjalan sejak kamu menekan Mulai. Jawaban tersimpan otomatis, jadi aman kalau halaman tertutup.",
    to_rule2: "Pengerjaan PERTAMA dihitung sistem ke statistik dan peringkat. Pengerjaan berikutnya menjadi latihan ulang dan tidak mengubah statistik.",
    to_rule3: "Skor tiap subtes 0–1000 = 1000 × benar ÷ jumlah soal. Skor total = rata-rata skor subtes. Tidak ada pengurangan untuk jawaban salah. Ini estimasi, bukan skor IRT resmi UTBK.",
    to_nick: "Nama panggilan (tampil di peringkat)", to_nick_ph: "Opsional, misalnya Raka",
    to_board: "Peringkat dan sebaran nilai", to_part: "Peserta", to_avg: "Rata-rata", to_max: "Tertinggi",
    to_no_board: "Belum ada peserta. Jadilah yang pertama!", to_top10: "10 skor teratas", to_dist: "Sebaran skor",
    to_you: "Kamu", to_anon: "Anonim", to_no_q: "Try out ini belum memiliki soal.",
    to_q_of: (n, m) => `Soal ${n} dari ${m}`, to_flag: "Ragu-ragu", to_prev: "Sebelumnya", to_next: "Berikutnya",
    to_clear: "Hapus jawaban", to_finish: "Selesai", to_nav: "Navigasi soal",
    to_lg_done: "Terjawab", to_lg_flag: "Ragu-ragu", to_lg_empty: "Kosong",
    to_c_t: "Anda yakin mengirim jawaban Anda?", to_c_chk: "Saya sudah memeriksa kembali jawaban saya",
    to_c_d: (a, e, f) => `Terjawab ${a}, kosong ${e}${f ? `, ditandai ragu-ragu ${f}` : ""}. Setelah dikirim, jawaban tidak bisa diubah.`,
    to_c_back: "Cek kembali", to_c_send: "Kirim",
    to_leave: "Pengerjaan sedang berjalan. Jawabanmu tetap tersimpan sebagai draft. Tetap keluar?",
    to_timeup: "Waktu habis. Jawabanmu dikirim otomatis.", to_left5: "Sisa waktu 5 menit!",
    to_sending: "Menghitung nilai...", to_send_err: "Gagal mengirim jawaban. Jawabanmu aman di perangkat ini. Periksa koneksi lalu coba lagi.",
    to_retry: "Coba kirim lagi",
    to_res_t: "Hasil Try Out", to_score: "Skor", to_correct: "Benar", to_wrong: "Salah", to_blank: "Kosong",
    to_time: "Waktu", to_rank: "Peringkat",
    to_first_note: "Pengerjaan pertama: skor ini dihitung ke statistik dan peringkat.",
    to_redo_note: "Latihan ulang: skor ini tidak dihitung ke statistik.",
    to_review: "Pembahasan jawaban", to_f_all: "Semua", to_f_wrong: "Salah", to_f_blank: "Kosong", to_f_right: "Benar",
    to_your: "Jawabanmu", to_key: "Kunci", to_expl: "Pembahasan", to_none: "Tidak dijawab", to_no_expl: "Belum ada pembahasan untuk soal ini.",
    to_share: "Salin hasil", to_shared: "Hasil disalin", to_redo: "Latihan ulang", to_back_list: "Daftar try out",
    to_by_sub: "Skor per subtes", to_vs_avg: "rata-rata peserta",
    to_lv4: "Luar biasa! Pertahankan ritmenya.", to_lv3: "Bagus. Sedikit lagi menuju target.", to_lv2: "Cukup. Fokus ke subtes yang masih rendah.", to_lv1: "Masih bisa naik. Mulai dari pembahasan soal yang salah.",
    to_share_txt: (title, score, c, n) => `Aku dapat skor ${score} di ${title} (benar ${c} dari ${n}) di AFU Digital Library!`,
    to_load_err: "Gagal memuat try out. Periksa koneksi lalu muat ulang halaman.",
    to_need_db: "Fitur Try Out butuh database terbaru. Jalankan supabase/migrasi-v4.sql di Supabase SQL Editor.",
    st_t: "Statistik nilai try out", st_note: "Dihitung dari pengerjaan pertama tiap try out. Latihan ulang tidak ikut dihitung.",
    st_n: "Try out selesai", st_avg: "Rata-rata skor", st_best: "Skor tertinggi", st_acc: "Akurasi",
    st_trend: "Perkembangan skor", st_sub: "Rata-rata per subtes", st_weak: "Perlu diperkuat",
    st_weak_d: s => `${s} adalah subtes dengan rata-rata terendahmu. Latih lewat modul, lalu cek pembahasannya.`,
    st_modul: "Buka Modul Soal", st_pemb: "Buka Pembahasan",
    st_target: "Target skor", st_target_set: "Simpan", st_target_left: n => `Kurang ${n} poin dari targetmu.`, st_target_ok: "Target tercapai. Naikkan lagi targetnya!",
    st_hist: "Riwayat pengerjaan", st_first: "Pertama", st_redo: "Ulang", st_view: "Bahas",
    st_empty: "Belum ada data. Selesaikan satu try out untuk melihat statistikmu.", st_empty_btn: "Lihat daftar try out",
    st_reset: "Hapus riwayat di perangkat ini", st_reset_q: "Hapus semua riwayat try out di perangkat ini? Data peringkat di server tidak ikut terhapus.",
    st_peer: "vs rata-rata peserta", st_local: "Riwayat disimpan di browser ini."
  });
  AFU.extend("en", {
    to_title: "UTBK Mock Tests", to_sub: "Take timed simulations, get system-graded scores, and track your progress.",
    to_tab_list: "Mock Tests", to_tab_stats: "My Statistics",
    to_empty: "No mock tests available yet. Stay tuned!",
    to_nq: n => n + (n === 1 ? " question" : " questions"), to_nmin: n => n + " min",
    to_start: "Start test", to_resume: "Resume test", to_open: "Open", to_first_score: "First score",
    to_draft: "Draft saved",
    to_rules_t: "How it works",
    to_rule1: "The timer starts when you press Start. Answers are saved automatically, so closing the page is safe.",
    to_rule2: "Your FIRST attempt is counted by the system in statistics and rankings. Later attempts are practice runs and do not change your statistics.",
    to_rule3: "Each subtest score is 0–1000 = 1000 × correct ÷ number of questions. Total score is the average of subtest scores. No penalty for wrong answers. This is an estimate, not the official IRT UTBK score.",
    to_nick: "Nickname (shown on the leaderboard)", to_nick_ph: "Optional, e.g. Raka",
    to_board: "Leaderboard and score distribution", to_part: "Participants", to_avg: "Average", to_max: "Highest",
    to_no_board: "No participants yet. Be the first!", to_top10: "Top 10 scores", to_dist: "Score distribution",
    to_you: "You", to_anon: "Anonymous", to_no_q: "This mock test has no questions yet.",
    to_q_of: (n, m) => `Question ${n} of ${m}`, to_flag: "Mark for review", to_prev: "Previous", to_next: "Next",
    to_clear: "Clear answer", to_finish: "Finish", to_nav: "Question navigator",
    to_lg_done: "Answered", to_lg_flag: "Marked", to_lg_empty: "Empty",
    to_c_t: "Are you sure you want to submit your answers?", to_c_chk: "I have double-checked my answers",
    to_c_d: (a, e, f) => `Answered ${a}, empty ${e}${f ? `, marked ${f}` : ""}. You cannot change answers after submitting.`,
    to_c_back: "Check again", to_c_send: "Submit",
    to_leave: "A test is in progress. Your answers stay saved as a draft. Leave anyway?",
    to_timeup: "Time is up. Your answers were submitted automatically.", to_left5: "5 minutes left!",
    to_sending: "Calculating your score...", to_send_err: "Could not submit. Your answers are safe on this device. Check your connection and try again.",
    to_retry: "Try submitting again",
    to_res_t: "Mock Test Result", to_score: "Score", to_correct: "Correct", to_wrong: "Wrong", to_blank: "Empty",
    to_time: "Time", to_rank: "Rank",
    to_first_note: "First attempt: this score counts toward statistics and rankings.",
    to_redo_note: "Practice run: this score does not count toward statistics.",
    to_review: "Answer review", to_f_all: "All", to_f_wrong: "Wrong", to_f_blank: "Empty", to_f_right: "Correct",
    to_your: "Your answer", to_key: "Key", to_expl: "Explanation", to_none: "Not answered", to_no_expl: "No explanation for this question yet.",
    to_share: "Copy result", to_shared: "Result copied", to_redo: "Practice again", to_back_list: "Mock tests",
    to_by_sub: "Score per subtest", to_vs_avg: "participant average",
    to_lv4: "Excellent! Keep the rhythm.", to_lv3: "Good. A little more to reach your target.", to_lv2: "Decent. Focus on the lower subtests.", to_lv1: "There is room to grow. Start with the explanations of wrong answers.",
    to_share_txt: (title, score, c, n) => `I scored ${score} on ${title} (${c} of ${n} correct) at AFU Digital Library!`,
    to_load_err: "Could not load mock tests. Check your connection and reload.",
    to_need_db: "Mock tests need the latest database. Run supabase/migrasi-v4.sql in the Supabase SQL Editor.",
    st_t: "Mock test statistics", st_note: "Based on your first attempt at each mock test. Practice runs are not counted.",
    st_n: "Tests completed", st_avg: "Average score", st_best: "Highest score", st_acc: "Accuracy",
    st_trend: "Score progress", st_sub: "Average per subtest", st_weak: "Needs work",
    st_weak_d: s => `${s} is your lowest-scoring subtest. Practice with the modules, then check the solutions.`,
    st_modul: "Open Practice Modules", st_pemb: "Open Solutions",
    st_target: "Target score", st_target_set: "Save", st_target_left: n => `${n} points to go.`, st_target_ok: "Target reached. Raise it!",
    st_hist: "Attempt history", st_first: "First", st_redo: "Retry", st_view: "Review",
    st_empty: "No data yet. Finish one mock test to see your statistics.", st_empty_btn: "See mock tests",
    st_reset: "Clear history on this device", st_reset_q: "Clear all mock test history on this device? Server rankings are not deleted.",
    st_peer: "vs participant average", st_local: "History is stored in this browser."
  });

  // ---------- util ----------
  const LS = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const $ = id => document.getElementById(id);
  const A = () => window.AFUApp;
  const did = () => {
    let d = LS.get("afu-did");
    if (!d) { d = (window.crypto?.randomUUID ? crypto.randomUUID() : "d" + Date.now() + Math.random().toString(36).slice(2)); LS.set("afu-did", d); }
    return d;
  };
  const hist = () => LS.get("afu-hist", []);
  const firsts = () => hist().filter(h => h.first);
  const firstOf = tid => firsts().find(h => h.tid === tid);
  const draftKey = tid => "afu-draft-" + tid;
  const subIdx = k => SUB.indexOf(k) + 1;
  const subName = k => t("s_" + k);
  const L = ["A", "B", "C", "D", "E"];
  const dateFmt = ts => new Date(ts).toLocaleDateString(AFU.lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short", year: "numeric" });
  const fmtDur = s => { s = Math.max(0, Math.round(s || 0)); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60; return h ? `${h}j ${m}m` : `${m}m ${String(x).padStart(2, "0")}d`; };
  const clock = ms => { const s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60; const p = n => String(n).padStart(2, "0"); return (h ? h + ":" : "") + p(m) + ":" + p(x); };
  const level = sc => (sc >= 800 ? 4 : sc >= 650 ? 3 : sc >= 500 ? 2 : 1);
  // teks soal: aman (di-escape), mendukung **tebal**, x^2 / x^{10}, H_{2}O, dan baris baru
  const fmt = s => esc(s)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>").replace(/\^(-?[A-Za-z0-9]+)/g, "<sup>$1</sup>")
    .replace(/_\{([^}]+)\}/g, "<sub>$1</sub>")
    .replace(/\n/g, "<br>");
  const safeImg = u => (/^https:\/\//i.test(u || "") ? u : "");
  const dbErr = e => { const m = String(e?.message || e || ""); return /relation|does not exist|schema cache|permission denied|function/i.test(m) ? t("to_need_db") : t("to_load_err"); };
  const ICO = {
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    flag: '<svg viewBox="0 0 24 24"><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>',
    trophy: '<svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M4 20V4M4 20h16M8 16l4-5 3 3 5-7"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>',
    redo: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/></svg>'
  };

  // ---------- data ----------
  const cache = {};
  async function pageAll(build) {
    let all = [], from = 0;
    for (;;) {
      const { data, error } = await build().range(from, from + 999);
      if (error) throw error;
      all = all.concat(data);
      if (data.length < 1000) break;
      from += 1000;
    }
    return all;
  }
  async function loadList(force) {
    if (cache.list && !force) return cache.list;
    const { data, error } = await sb.from("tryouts").select("id,title,description,duration_min,created_at")
      .eq("published", true).order("created_at", { ascending: false });
    if (error) throw error;
    const rows = await pageAll(() => sb.from("tryout_questions").select("tryout_id,subtest").order("id"));
    const by = {};
    rows.forEach(r => { const o = (by[r.tryout_id] ||= { n: 0, subs: {} }); o.n++; o.subs[r.subtest] = (o.subs[r.subtest] || 0) + 1; });
    return (cache.list = data.map(d => ({ ...d, n: by[d.id]?.n || 0, subs: by[d.id]?.subs || {} })));
  }
  async function loadTo(tid) {
    const list = await loadList();
    const to = list.find(x => x.id === tid);
    if (!to) return null;
    const qs = await pageAll(() => sb.from("tryout_questions").select("id,subtest,position,body,image_url,options")
      .eq("tryout_id", tid).order("position").order("id"));
    qs.sort((a, b) => SUB.indexOf(a.subtest) - SUB.indexOf(b.subtest) || a.position - b.position);
    return { to, qs };
  }
  async function loadStats(tid) {
    const { data, error } = await sb.rpc("tryout_stats", { p_tryout: tid, p_device: did() });
    if (error) throw error;
    return data;
  }

  // ---------- kerangka halaman ----------
  const tabs = on => `<div class="to-tabs" role="tablist">
    <a class="to-tab" role="tab" aria-selected="${on === "list"}" href="/tryout">${ICO.list}${esc(t("to_tab_list"))}</a>
    <a class="to-tab" role="tab" aria-selected="${on === "stats"}" href="/tryout/statistik">${ICO.chart}${esc(t("to_tab_stats"))}</a></div>`;
  const skeleton = n => `<div class="grid2">${Array.from({ length: n }, () => '<div class="card skel"><i></i><i></i><i></i></div>').join("")}</div>`;
  const head = on => `<a class="back" href="/">${ICO.back}${esc(t("back"))}</a>
    <h1>${esc(t("to_title"))}</h1><p class="lead sm">${esc(t("to_sub"))}</p>${tabs(on)}`;
  let X = null; // sesi pengerjaan yang sedang berjalan
  let tickId = 0;
  const stopTimer = () => { clearInterval(tickId); tickId = 0; };
  const root = () => document.getElementById("app");
  const notice = (text, cls = "warn") => `<p class="notice ${cls}">${esc(text)}</p>`;

  // ---------- 1) daftar ----------
  async function listPage() {
    stopTimer(); X = null;
    root().innerHTML = `<section class="wrap page">${head("list")}<div id="toBody">${skeleton(2)}</div></section>`;
    let list;
    try { list = await loadList(true); } catch (e) { $("toBody") && ($("toBody").innerHTML = notice(dbErr(e))); return; }
    const box = $("toBody"); if (!box) return;
    if (!list.length) { box.innerHTML = `<p class="notice">${esc(t("to_empty"))}</p>`; return; }
    box.innerHTML = `<div class="grid2">${list.map(d => {
      const f = firstOf(d.id), draft = LS.get(draftKey(d.id));
      const chips = SUB.filter(k => d.subs[k]).map(k => `<span class="badge sm" style="--c:var(--b${subIdx(k)})">${ABBR[k]}</span>`).join("");
      return `<a class="card to-card" href="/tryout/${esc(d.id)}">
        <span class="ico">${ICO.list}</span>
        <h3>${esc(d.title)}</h3>
        ${d.description ? `<p>${esc(d.description)}</p>` : ""}
        <div class="to-meta"><span>${ICO.list}${esc(t("to_nq", d.n))}</span><span>${ICO.clock}${esc(t("to_nmin", d.duration_min))}</span></div>
        <div class="to-chips">${chips}</div>
        <div class="to-foot">
          ${f ? `<span class="pill ok">${ICO.check}${esc(t("to_first_score"))}: <b>${f.score}</b></span>` : draft ? `<span class="pill warn">${esc(t("to_draft"))}</span>` : "<span></span>"}
          <span class="go">${esc(draft ? t("to_resume") : t("to_open"))}${ICO.next}</span>
        </div></a>`;
    }).join("")}</div>`;
    A().stagger();
  }

  // ---------- 2) detail + peringkat ----------
  async function detailPage(tid) {
    stopTimer(); X = null;
    root().innerHTML = `<section class="wrap page">${head("list")}<div id="toBody">${skeleton(1)}</div></section>`;
    let data;
    try { data = await loadTo(tid); } catch (e) { $("toBody") && ($("toBody").innerHTML = notice(dbErr(e))); return; }
    const box = $("toBody"); if (!box) return;
    if (!data) { box.innerHTML = notice(t("to_load_err")); return; }
    const { to, qs } = data;
    const subs = {}; qs.forEach(q => (subs[q.subtest] = (subs[q.subtest] || 0) + 1));
    const draft = LS.get(draftKey(tid)), f = firstOf(tid);
    const nick = LS.get("afu-nick", "");
    box.innerHTML = `
      <div class="card to-detail">
        <div class="to-d-top">
          <div><h2>${esc(to.title)}</h2>${to.description ? `<p class="muted">${esc(to.description)}</p>` : ""}</div>
          ${f ? `<span class="pill ok">${ICO.check}${esc(t("to_first_score"))}: <b>${f.score}</b></span>` : ""}
        </div>
        <div class="to-meta big"><span>${ICO.list}${esc(t("to_nq", qs.length))}</span><span>${ICO.clock}${esc(t("to_nmin", to.duration_min))}</span></div>
        <div class="to-subs">${SUB.filter(k => subs[k]).map(k => `<div class="to-sub" style="--c:var(--b${subIdx(k)})"><span class="badge">${ABBR[k]}</span><span>${esc(subName(k))}</span><b>${esc(t("to_nq", subs[k]))}</b></div>`).join("")}</div>
        <h3 class="to-h3">${esc(t("to_rules_t"))}</h3>
        <ul class="to-rules"><li>${esc(t("to_rule1"))}</li><li>${esc(t("to_rule2"))}</li><li>${esc(t("to_rule3"))}</li></ul>
        ${qs.length ? `
          ${draft ? "" : `<label class="to-nick">${esc(t("to_nick"))}<input id="nick" maxlength="24" placeholder="${esc(t("to_nick_ph"))}" value="${esc(nick)}" autocomplete="nickname"></label>`}
          <button class="btn promo-btn to-go" id="goBtn" type="button">${draft ? ICO.redo : ICO.play}${esc(draft ? t("to_resume") : t("to_start"))}</button>`
          : notice(t("to_no_q"), "")}
      </div>
      <div id="board"></div>`;
    $("goBtn")?.addEventListener("click", () => {
      if (!draft) LS.set("afu-nick", ($("nick")?.value || "").trim().slice(0, 24));
      startExam(data, draft);
    });
    drawBoard(tid);
  }
  async function drawBoard(tid) {
    const el = $("board"); if (!el) return;
    el.innerHTML = `<div class="card skel"><i></i><i></i></div>`;
    let s;
    try { s = await loadStats(tid); } catch (e) { el.innerHTML = ""; return; }
    if (!$("board")) return;
    const mine = firstOf(tid);
    if (!s.n) { el.innerHTML = `<h2 class="how-t">${esc(t("to_board"))}</h2><p class="notice">${esc(t("to_no_board"))}</p>`; return; }
    const max = Math.max(1, ...s.dist);
    const myB = mine ? Math.min(9, Math.floor(mine.score / 100)) : -1;
    el.innerHTML = `
      <h2 class="how-t">${esc(t("to_board"))}</h2>
      <div class="to-kpis">
        <div class="kpi">${ICO.users}<b>${s.n}</b><span>${esc(t("to_part"))}</span></div>
        <div class="kpi">${ICO.chart}<b>${s.avg}</b><span>${esc(t("to_avg"))}</span></div>
        <div class="kpi">${ICO.trophy}<b>${s.max}</b><span>${esc(t("to_max"))}</span></div>
        ${s.my_rank ? `<div class="kpi me">${ICO.flag}<b>#${s.my_rank}</b><span>${esc(t("to_rank"))}</span></div>` : ""}
      </div>
      <div class="to-two">
        <div class="card"><h3 class="to-h3">${esc(t("to_top10"))}</h3>
          <ol class="lb">${s.top.map((r, i) => `<li class="${mine && r.score === mine.score && r.nick === (LS.get("afu-nick", "") || t("to_anon")) ? "me" : ""}"><span class="r">${i + 1}</span><span class="n">${esc(r.nick === "Anonim" ? t("to_anon") : r.nick)}</span><span class="t">${r.secs ? esc(fmtDur(r.secs)) : ""}</span><b>${r.score}</b></li>`).join("")}</ol></div>
        <div class="card"><h3 class="to-h3">${esc(t("to_dist"))}</h3>
          <div class="dist">${s.dist.map((c, i) => `<div class="d ${i === myB ? "me" : ""}" title="${i * 100}–${i === 9 ? 1000 : i * 100 + 99}: ${c}"><i style="height:${Math.round((c / max) * 100)}%"></i><span>${i * 100}</span></div>`).join("")}</div>
          ${myB >= 0 ? `<p class="muted dist-n">${esc(t("to_you"))}: <b>${mine.score}</b></p>` : ""}</div>
      </div>`;
  }

  // ---------- 3) pengerjaan ----------
  function startExam(data, draft) {
    const { to, qs } = data;
    const now = Date.now();
    X = {
      to, qs, tid: to.id, ans: draft?.ans || {}, flag: new Set(draft?.flag || []), cur: Math.min(draft?.cur || 0, qs.length - 1),
      startedAt: draft?.startedAt || now, endAt: draft?.endAt || now + to.duration_min * 60000, nick: draft?.nick ?? LS.get("afu-nick", ""),
      warned: false, sending: false
    };
    saveDraft();
    window.scrollTo(0, 0);
    renderExam();
    stopTimer(); tickId = setInterval(tick, 500); tick();
  }
  function saveDraft() {
    if (!X) return;
    LS.set(draftKey(X.tid), { ans: X.ans, flag: [...X.flag], cur: X.cur, startedAt: X.startedAt, endAt: X.endAt, nick: X.nick });
  }
  function tick() {
    if (!X) return stopTimer();
    const ms = X.endAt - Date.now(), el = $("xTimer");
    if (el) { el.textContent = clock(ms); el.classList.toggle("low", ms <= 300000); }
    if (ms <= 300000 && ms > 0 && !X.warned) { X.warned = true; A().toast(t("to_left5")); }
    if (ms <= 0 && !X.sending) { A().toast(t("to_timeup")); submit(); }
  }
  function renderExam() {
    root().innerHTML = `
      <section class="wrap exam">
        <div class="exam-bar">
          <div class="exam-t"><b>${esc(X.to.title)}</b><span class="muted" id="xPos"></span></div>
          <div class="exam-timer" id="xTimer" role="timer">--:--</div>
          <button class="btn sm" id="xFinish" type="button">${ICO.check}${esc(t("to_finish"))}</button>
        </div>
        <div class="exam-prog"><i id="xProg"></i></div>
        <div class="exam-body">
          <div class="card exam-q" id="xQ" aria-live="polite"></div>
          <aside class="card exam-nav" aria-label="${esc(t("to_nav"))}">
            <h3 class="to-h3">${esc(t("to_nav"))}</h3><div id="xNav"></div>
            <div class="legend"><span><i class="qn done"></i>${esc(t("to_lg_done"))}</span><span><i class="qn flag"></i>${esc(t("to_lg_flag"))}</span><span><i class="qn"></i>${esc(t("to_lg_empty"))}</span></div>
          </aside>
        </div>
      </section>`;
    document.body.classList.add("in-exam");
    $("xFinish").addEventListener("click", confirmFinish);
    $("xQ").addEventListener("click", onQClick);
    $("xNav").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) goTo(+b.dataset.go); });
    paint();
  }
  function paint() {
    const q = X.qs[X.cur], n = X.qs.length, a = X.ans[q.id], fl = X.flag.has(q.id);
    $("xPos").textContent = t("to_q_of", X.cur + 1, n) + " · " + ABBR[q.subtest];
    const done = Object.keys(X.ans).length;
    $("xProg").style.width = Math.round((done / n) * 100) + "%";
    const img = safeImg(q.image_url);
    $("xQ").innerHTML = `
      <div class="q-head">
        <span class="badge" style="--c:var(--b${subIdx(q.subtest)})">${ABBR[q.subtest]}</span>
        <span class="muted">${esc(subName(q.subtest))} · ${esc(t("to_q_of", X.cur + 1, n))}</span>
        <button class="flagbtn" type="button" data-act="flag" aria-pressed="${fl}">${ICO.flag}${esc(t("to_flag"))}</button>
      </div>
      <div class="q-body">${fmt(q.body)}</div>
      ${img ? `<img class="q-img" src="${esc(img)}" alt="" loading="lazy">` : ""}
      <div class="opts" role="group">${q.options.map((o, i) => `<button class="opt" type="button" data-opt="${i}" aria-pressed="${a === i}"><b>${L[i]}</b><span>${fmt(o)}</span></button>`).join("")}</div>
      <div class="q-nav">
        <button class="btn ghost" type="button" data-act="prev" ${X.cur === 0 ? "disabled" : ""}>${ICO.back}${esc(t("to_prev"))}</button>
        <button class="linkbtn" type="button" data-act="clear" ${a === undefined ? "hidden" : ""}>${esc(t("to_clear"))}</button>
        ${X.cur === n - 1
          ? `<button class="btn finish" type="button" data-act="finish">${ICO.check}${esc(t("to_finish"))}</button>`
          : `<button class="btn" type="button" data-act="next">${esc(t("to_next"))}${ICO.next}</button>`}
      </div>`;
    let idx = 0, html = "";
    SUB.filter(k => X.qs.some(x => x.subtest === k)).forEach(k => {
      html += `<div class="nav-grp"><div class="nav-h" style="--c:var(--b${subIdx(k)})"><span class="badge sm">${ABBR[k]}</span></div><div class="qgrid">`;
      X.qs.forEach((x, i) => {
        if (x.subtest !== k) return;
        html += `<button type="button" class="qn ${X.ans[x.id] !== undefined ? "done" : ""} ${X.flag.has(x.id) ? "flag" : ""} ${i === X.cur ? "cur" : ""}" data-go="${i}" aria-label="${i + 1}">${i + 1}</button>`;
        idx++;
      });
      html += "</div></div>";
    });
    $("xNav").innerHTML = html;
  }
  function goTo(i) {
    X.cur = Math.max(0, Math.min(X.qs.length - 1, i)); saveDraft(); paint();
    $("xQ").scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  function onQClick(e) {
    const q = X.qs[X.cur];
    const o = e.target.closest("[data-opt]");
    if (o) {
      const i = +o.dataset.opt;
      if (X.ans[q.id] === i) delete X.ans[q.id]; else X.ans[q.id] = i;
      saveDraft(); return paint();
    }
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act;
    if (a === "prev") goTo(X.cur - 1);
    else if (a === "next") goTo(X.cur + 1);
    else if (a === "finish") confirmFinish();
    else if (a === "clear") { delete X.ans[q.id]; saveDraft(); paint(); }
    else if (a === "flag") { X.flag.has(q.id) ? X.flag.delete(q.id) : X.flag.add(q.id); saveDraft(); paint(); }
  }
  document.addEventListener("keydown", e => {
    if (!X || X.sending || !$("xQ") || e.target.closest("input,textarea,select") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (document.getElementById("toDlg")) return;
    const k = e.key.toLowerCase();
    if (k === "arrowright") { e.preventDefault(); goTo(X.cur + 1); }
    else if (k === "arrowleft") { e.preventDefault(); goTo(X.cur - 1); }
    else if ("abcde".includes(k) && k.length === 1) {
      const q = X.qs[X.cur], i = "abcde".indexOf(k);
      if (i < q.options.length) { X.ans[q.id] === i ? delete X.ans[q.id] : (X.ans[q.id] = i); saveDraft(); paint(); }
    }
  });
  window.addEventListener("beforeunload", e => { if (X && !X.sending && $("xQ")) { e.preventDefault(); e.returnValue = ""; } });

  function dialog(html) {
    const d = document.createElement("div");
    d.className = "dlg"; d.id = "toDlg"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    d.innerHTML = `<div class="dlg-card">${html}</div>`;
    document.body.appendChild(d);
    return d;
  }
  function confirmFinish() {
    if (!X || X.sending) return;
    const n = X.qs.length, a = Object.keys(X.ans).length;
    const d = dialog(`<h3>${esc(t("to_c_t"))}</h3><p>${esc(t("to_c_d", a, n - a, X.flag.size))}</p>
      <label class="dlg-chk"><input type="checkbox" id="dChk"><span>${esc(t("to_c_chk"))}</span></label>
      <div class="btns"><button class="btn ghost" type="button" id="dBack">${esc(t("to_c_back"))}</button><button class="btn" type="button" id="dSend" disabled>${esc(t("to_c_send"))}</button></div>`);
    $("dBack").onclick = () => d.remove();
    $("dChk").onchange = e => { $("dSend").disabled = !e.target.checked; };
    $("dSend").onclick = () => { if (!$("dChk").checked) return; d.remove(); submit(); };
    $("dChk").focus();
  }

  // ---------- 4) kirim + hasil ----------
  async function submit() {
    if (!X || X.sending) return;
    X.sending = true; stopTimer();
    document.getElementById("toDlg")?.remove();
    const secs = Math.min(Math.round((Date.now() - X.startedAt) / 1000), X.to.duration_min * 60);
    const d = dialog(`<div class="spin"></div><p class="dlg-c">${esc(t("to_sending"))}</p>`);
    const { data, error } = await sb.rpc("submit_tryout", { p_tryout: X.tid, p_device: did(), p_nick: X.nick || null, p_answers: X.ans, p_secs: secs });
    d.remove();
    if (error || !data) {
      X.sending = false;
      const d2 = dialog(`<h3>${esc(t("to_send_err"))}</h3><div class="btns"><button class="btn" type="button" id="dRetry">${esc(t("to_retry"))}</button></div>`);
      $("dRetry").onclick = () => { d2.remove(); submit(); };
      return;
    }
    const entry = { tid: X.tid, title: X.to.title, ts: Date.now(), first: !!data.first, score: data.score, c: data.correct, n: data.total,
      per: data.per_subtest, secs, rank: data.rank || null, part: data.participants || null };
    const h = hist();
    h.push(entry);
    // simpan jawaban 12 pengerjaan terakhir supaya bisa dibahas lagi nanti
    h.forEach((x, i) => { if (i < h.length - 12) delete x.ans; });
    entry.ans = { ...X.ans };
    LS.set("afu-hist", h.slice(-150));
    LS.del(draftKey(X.tid));
    cache.list = null;
    const view = { to: X.to, qs: X.qs, ans: { ...X.ans }, res: data, entry, secs };
    X = null;
    resultPage(view, true);
  }
  function ring(score) {
    const r = 54, c = 2 * Math.PI * r, p = Math.max(0, Math.min(1, score / 1000));
    return `<svg class="ring" viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="${r}" class="rb"/>
      <circle cx="70" cy="70" r="${r}" class="rf" style="--c:${c.toFixed(1)};--o:${(c * (1 - p)).toFixed(1)}"/></svg>`;
  }
  function resultPage(v, fresh) {
    stopTimer(); document.body.classList.remove("in-exam");
    const { to, qs, ans, res, entry } = v;
    const key = Object.fromEntries((res.key || []).map(k => [k.id, k]));
    const wrong = qs.filter(q => ans[q.id] !== undefined && ans[q.id] !== key[q.id]?.answer).length;
    const blank = qs.filter(q => ans[q.id] === undefined).length;
    const first = entry.first;
    const per = entry.per || res.per_subtest || {};
    window.scrollTo(0, 0);
    root().innerHTML = `
      <section class="wrap page">
        <a class="back" href="/tryout">${ICO.back}${esc(t("to_back_list"))}</a>
        <h1>${esc(t("to_res_t"))}</h1><p class="lead sm">${esc(to.title)}</p>
        <div class="card res">
          <div class="res-ring">${ring(entry.score)}<div class="res-n"><small>${esc(t("to_score"))}</small><b id="sc">0</b><span>/ 1000</span></div></div>
          <div class="res-side">
            <span class="pill ${first ? "ok" : "warn"}">${first ? ICO.check : ICO.redo}${esc(t(first ? "to_first_note" : "to_redo_note"))}</span>
            <p class="res-lv">${esc(t("to_lv" + level(entry.score)))}</p>
            <div class="to-kpis sm">
              <div class="kpi ok">${ICO.check}<b>${entry.c}</b><span>${esc(t("to_correct"))}</span></div>
              <div class="kpi bad">${ICO.x}<b>${wrong}</b><span>${esc(t("to_wrong"))}</span></div>
              <div class="kpi">${ICO.list}<b>${blank}</b><span>${esc(t("to_blank"))}</span></div>
              <div class="kpi">${ICO.clock}<b>${esc(fmtDur(v.secs ?? entry.secs))}</b><span>${esc(t("to_time"))}</span></div>
              ${first && entry.rank ? `<div class="kpi me">${ICO.trophy}<b>#${entry.rank}</b><span>${esc(t("to_rank"))}${entry.part ? " / " + entry.part : ""}</span></div>` : ""}
            </div>
          </div>
        </div>
        <h2 class="how-t">${esc(t("to_by_sub"))}</h2>
        <div class="card sbars" id="sbars">${SUB.filter(k => per[k]).map(k => `
          <div class="sb" style="--c:var(--b${subIdx(k)})"><span class="badge">${ABBR[k]}</span>
            <div class="bar-t"><i style="width:${Math.round(per[k].s / 10)}%"></i><u class="avg" data-avg="${k}" hidden></u></div>
            <b>${per[k].s}</b><small>${per[k].c}/${per[k].t}</small></div>`).join("")}
          <p class="muted sb-note" id="sbNote" hidden></p></div>
        <div class="btns res-act">
          <button class="btn" type="button" id="rShare">${ICO.copy}${esc(t("to_share"))}</button>
          <a class="btn ghost" href="/tryout/${esc(to.id)}">${ICO.redo}${esc(t("to_redo"))}</a>
          <a class="btn ghost" href="/tryout/statistik">${ICO.chart}${esc(t("to_tab_stats"))}</a>
        </div>
        <h2 class="how-t" id="rvT">${esc(t("to_review"))}</h2>
        <div class="chips" id="rvF">${[["all", "to_f_all"], ["wrong", "to_f_wrong"], ["blank", "to_f_blank"], ["right", "to_f_right"]].map(([k, s], i) =>
          `<button class="chip" type="button" data-f="${k}" aria-pressed="${i === 0}">${esc(t(s))}</button>`).join("")}</div>
        <div id="rv"></div>
      </section>`;
    // animasi angka skor
    const el = $("sc"), t0 = performance.now(), dur = 1100;
    const step = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(entry.score * e); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    if (fresh && entry.score >= 700 && !matchMedia("(prefers-reduced-motion: reduce)").matches) confetti();
    $("rShare").onclick = () => A().copy(t("to_share_txt", to.title, entry.score, entry.c, entry.n), t("to_shared"));
    // rata-rata peserta per subtes
    loadStats(to.id).then(s => {
      if (!s?.n || !$("sbars")) return;
      Object.entries(s.subtest_avg || {}).forEach(([k, a]) => { const u = document.querySelector(`[data-avg="${k}"]`); if (u) { u.hidden = false; u.style.left = Math.round(a / 10) + "%"; u.title = t("to_vs_avg") + ": " + a; } });
      const n = $("sbNote"); n.hidden = false; n.textContent = `│ ${t("to_vs_avg")} (${s.n} ${t("to_part").toLowerCase()})`;
    }).catch(() => {});
    // pembahasan
    let f = "all";
    const draw = () => {
      const list = qs.map((q, i) => ({ q, i, a: ans[q.id], k: key[q.id] })).filter(x => {
        const ok = x.a !== undefined && x.a === x.k?.answer;
        return f === "all" || (f === "right" && ok) || (f === "wrong" && x.a !== undefined && !ok) || (f === "blank" && x.a === undefined);
      });
      $("rv").innerHTML = list.length ? list.map(({ q, i, a, k }) => {
        const ok = a !== undefined && a === k?.answer;
        return `<article class="card rv ${a === undefined ? "blank" : ok ? "ok" : "bad"}">
          <div class="q-head"><span class="badge" style="--c:var(--b${subIdx(q.subtest)})">${ABBR[q.subtest]}</span><span class="muted">${esc(t("to_q_of", i + 1, qs.length))}</span>
            <span class="pill ${a === undefined ? "" : ok ? "ok" : "bad"}">${a === undefined ? esc(t("to_none")) : ok ? ICO.check + esc(t("to_correct")) : ICO.x + esc(t("to_wrong"))}</span></div>
          <div class="q-body">${fmt(q.body)}</div>${safeImg(q.image_url) ? `<img class="q-img" src="${esc(safeImg(q.image_url))}" alt="" loading="lazy">` : ""}
          <div class="opts static">${q.options.map((o, j) => `<div class="opt ${j === k?.answer ? "right" : ""} ${j === a && j !== k?.answer ? "wrongc" : ""}"><b>${L[j]}</b><span>${fmt(o)}</span>
            ${j === k?.answer ? `<em>${esc(t("to_key"))}</em>` : j === a ? `<em>${esc(t("to_your"))}</em>` : ""}</div>`).join("")}</div>
          <div class="expl"><strong>${esc(t("to_expl"))}</strong><p>${k?.explanation ? fmt(k.explanation) : `<span class="muted">${esc(t("to_no_expl"))}</span>`}</p></div></article>`;
      }).join("") : `<p class="notice">${esc(t("no_match"))}</p>`;
    };
    $("rvF").addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      f = b.dataset.f; document.querySelectorAll("#rvF .chip").forEach(x => x.setAttribute("aria-pressed", x === b)); draw();
    });
    draw();
  }
  // bahas ulang dari riwayat: nilai ulang jawaban tersimpan (tidak mengubah skor pertama di server)
  async function reviewHistory(i) {
    const h = hist()[i]; if (!h?.ans) return;
    root().innerHTML = `<section class="wrap page"><a class="back" href="/tryout/statistik">${ICO.back}${esc(t("to_tab_stats"))}</a>${skeleton(1)}</section>`;
    try {
      const data = await loadTo(h.tid); if (!data) throw new Error("x");
      const { data: res, error } = await sb.rpc("submit_tryout", { p_tryout: h.tid, p_device: did(), p_nick: null, p_answers: h.ans, p_secs: h.secs || 0 });
      if (error) throw error;
      resultPage({ to: data.to, qs: data.qs, ans: h.ans, res, entry: h, secs: h.secs }, false);
    } catch (e) { root().innerHTML = `<section class="wrap page"><a class="back" href="/tryout/statistik">${ICO.back}${esc(t("to_tab_stats"))}</a>${notice(dbErr(e))}</section>`; }
  }
  function confetti() {
    const c = document.createElement("canvas");
    c.className = "confetti"; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    const g = c.getContext("2d"), col = ["#1f5fe0", "#00a8f0", "#f5b21b", "#ff7a59", "#7b52e8", "#2fcf8e"];
    const P = Array.from({ length: 130 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 13, vy: -Math.random() * 13 - 3,
      s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: col[(Math.random() * col.length) | 0] }));
    let f = 0;
    const loop = () => {
      g.clearRect(0, 0, c.width, c.height);
      P.forEach(p => { p.vy += .32; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6); g.restore(); });
      if (++f < 170) requestAnimationFrame(loop); else c.remove();
    };
    loop();
  }

  // ---------- 5) statistik saya ----------
  function lineChart(pts) {
    const W = 640, H = 220, pl = 38, pr = 14, pt = 14, pb = 28;
    const x = i => pl + (pts.length === 1 ? (W - pl - pr) / 2 : (i * (W - pl - pr)) / (pts.length - 1));
    const y = v => pt + (1 - v / 1000) * (H - pt - pb);
    const grid = [0, 250, 500, 750, 1000].map(v => `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" class="gl"/><text x="${pl - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
    const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.score).toFixed(1)}`).join(" ");
    const area = `${line} L${x(pts.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
    const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.score).toFixed(1)}" r="5" class="dot"><title>${esc(p.title)}: ${p.score}</title></circle>`).join("");
    const labs = pts.map((p, i) => (pts.length <= 8 || i % Math.ceil(pts.length / 8) === 0 ? `<text x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${i + 1}</text>` : "")).join("");
    return `<svg class="lchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("st_trend"))}"><defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      ${grid}<path d="${area}" fill="url(#lg)" stroke="none"/><path d="${line}" class="ln" pathLength="1"/>${dots}${labs}</svg>`;
  }
  function statsPage() {
    stopTimer(); X = null;
    const all = hist(), fs = firsts().sort((a, b) => a.ts - b.ts);
    if (!fs.length) {
      root().innerHTML = `<section class="wrap page">${head("stats")}<div class="card empty"><span class="ico">${ICO.chart}</span><p>${esc(t("st_empty"))}</p>
        <a class="btn" href="/tryout">${esc(t("st_empty_btn"))}</a></div>
        ${all.length ? histTable(all) : ""}</section>`;
      bindHist(); return;
    }
    const n = fs.length, avg = Math.round(fs.reduce((s, h) => s + h.score, 0) / n), best = Math.max(...fs.map(h => h.score));
    const C = fs.reduce((s, h) => s + h.c, 0), N = fs.reduce((s, h) => s + h.n, 0), acc = N ? Math.round((C / N) * 100) : 0;
    const sub = {};
    fs.forEach(h => Object.entries(h.per || {}).forEach(([k, v]) => { (sub[k] ||= []).push(v.s); }));
    const subAvg = SUB.filter(k => sub[k]).map(k => ({ k, v: Math.round(sub[k].reduce((a, b) => a + b, 0) / sub[k].length) }));
    const weak = subAvg.length > 1 ? [...subAvg].sort((a, b) => a.v - b.v)[0] : null;
    const target = LS.get("afu-target", 0);
    const latest = fs[fs.length - 1].score;
    root().innerHTML = `
      <section class="wrap page">${head("stats")}
        <h2 class="how-t first">${esc(t("st_t"))}</h2><p class="muted">${esc(t("st_note"))}</p>
        <div class="to-kpis">
          <div class="kpi">${ICO.check}<b>${n}</b><span>${esc(t("st_n"))}</span></div>
          <div class="kpi">${ICO.chart}<b>${avg}</b><span>${esc(t("st_avg"))}</span></div>
          <div class="kpi">${ICO.trophy}<b>${best}</b><span>${esc(t("st_best"))}</span></div>
          <div class="kpi">${ICO.flag}<b>${acc}%</b><span>${esc(t("st_acc"))}</span></div>
        </div>
        <div class="card"><h3 class="to-h3">${esc(t("st_trend"))}</h3>${lineChart(fs)}</div>
        <div class="to-two">
          <div class="card"><h3 class="to-h3">${esc(t("st_sub"))}</h3>
            <div class="sbars flat">${subAvg.map(({ k, v }) => `<div class="sb" style="--c:var(--b${subIdx(k)})"><span class="badge">${ABBR[k]}</span><div class="bar-t"><i style="width:${Math.round(v / 10)}%"></i></div><b>${v}</b></div>`).join("")}</div>
            ${weak ? `<div class="weak"><strong>${esc(t("st_weak"))}: ${ABBR[weak.k]}</strong><p>${esc(t("st_weak_d", subName(weak.k)))}</p>
              <div class="btns"><a class="btn sm" href="/modul/${weak.k}">${esc(t("st_modul"))}</a><a class="btn ghost sm" href="/pembahasan/${weak.k}">${esc(t("st_pemb"))}</a></div></div>` : ""}</div>
          <div class="card"><h3 class="to-h3">${esc(t("st_target"))}</h3>
            <form id="tgForm" class="tg"><input id="tg" type="number" min="100" max="1000" step="10" value="${target || ""}" placeholder="800" inputmode="numeric"><button class="btn sm" type="submit">${esc(t("st_target_set"))}</button></form>
            ${target ? `<div class="bar-t big"><i style="width:${Math.min(100, Math.round((latest / target) * 100))}%"></i></div>
              <p class="muted">${esc(latest >= target ? t("st_target_ok") : t("st_target_left", target - latest))}</p>` : ""}
            <p class="muted" style="margin-top:1rem">${esc(t("st_local"))}</p></div>
        </div>
        ${histTable(all)}
        <p><button class="linkbtn danger-l" id="hReset" type="button">${esc(t("st_reset"))}</button></p>
      </section>`;
    $("tgForm").addEventListener("submit", e => { e.preventDefault(); const v = Math.max(0, Math.min(1000, +$("tg").value || 0)); LS.set("afu-target", v); statsPage(); });
    $("hReset").addEventListener("click", () => { if (confirm(t("st_reset_q"))) { LS.del("afu-hist"); statsPage(); } });
    bindHist();
    // bandingkan dengan rata-rata peserta (diambil bertahap, gagal pun tidak masalah)
    [...fs].reverse().slice(0, 8).forEach(h => loadStats(h.tid).then(s => {
      const c = document.querySelector(`[data-peer="${h.tid}"]`);
      if (c && s?.n > 1) c.innerHTML = `<span class="${h.score >= s.avg ? "up" : "down"}">${h.score >= s.avg ? "▲" : "▼"} ${Math.abs(h.score - s.avg)}</span> <small>${esc(t("st_peer"))} (${s.avg})</small>`;
    }).catch(() => {}));
  }
  function histTable(all) {
    const rows = all.map((h, i) => ({ h, i })).reverse();
    return `<h2 class="how-t">${esc(t("st_hist"))}</h2><div class="card hist"><div class="hrows">${rows.map(({ h, i }) => `
      <div class="hrow">
        <div class="hm"><strong>${esc(h.title)}</strong><span class="muted">${esc(dateFmt(h.ts))} · ${esc(t("to_correct"))} ${h.c}/${h.n} · ${esc(fmtDur(h.secs))}</span>
          ${h.first ? `<span class="peer" data-peer="${esc(h.tid)}"></span>` : ""}</div>
        <span class="pill ${h.first ? "ok" : ""}">${esc(t(h.first ? "st_first" : "st_redo"))}</span>
        <b class="hs">${h.score}</b>
        ${h.ans ? `<button class="btn ghost sm" type="button" data-rv="${i}">${esc(t("st_view"))}</button>` : "<span></span>"}
      </div>`).join("")}</div></div>`;
  }
  function bindHist() { document.querySelectorAll("[data-rv]").forEach(b => b.addEventListener("click", () => reviewHistory(+b.dataset.rv))); }

  // ---------- router ----------
  AFU.TO = {
    render(sub) {
      document.body.classList.remove("in-exam");
      if (!AFU.configured) return (root().innerHTML = `<div class="wrap"><p class="notice warn">${esc(t("nocfg"))}</p></div>`);
      if (sub === "statistik") return statsPage();
      if (sub) return detailPage(sub);
      return listPage();
    },
    leaving() { // dipanggil saat pindah halaman; kembalikan false untuk membatalkan
      if (X && !X.sending && $("xQ")) {
        if (!confirm(t("to_leave"))) return false;
        stopTimer(); X = null;
      }
      return true;
    },
    busy: () => !!(X && !X.sending && $("xQ")),
    repaint() { if (X && $("xQ")) { renderExam(); tick(); } },
    count: () => firsts().length,
    hasDraft: () => Object.keys(localStorage).some(k => k.startsWith("afu-draft-")),
    stats: () => { const f = firsts(); return { n: f.length, avg: f.length ? Math.round(f.reduce((s, h) => s + h.score, 0) / f.length) : 0, best: f.length ? Math.max(...f.map(h => h.score)) : 0 }; },
    loadList
  };
})();
