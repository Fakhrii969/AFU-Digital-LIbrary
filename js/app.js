(() => {
  const { t, esc, sb, SUB, ABBR } = AFU;
  const app = document.getElementById("app");
  AFU.extend("id", {
    hs_docs: "Dokumen gratis", hs_to: "Paket try out", hs_sub: "Subtes UTBK", hs_streak: "Hari beruntun belajar",
    tb_t: "Try Out UTBK", tb_d: "Simulasi dengan timer, nilai dihitung sistem, lengkap dengan statistik dan peringkat. Pengerjaan pertama jadi patokan nilaimu.",
    tb_btn: "Mulai Try Out", tb_stat: "Statistikmu", tb_avg: "rata-rata skor", tb_best: "skor tertinggi", tb_n: "try out selesai", tb_draft: "Ada try out yang belum selesai. Lanjutkan yuk!", tb_new: "Baru",
    rc_t: "Lanjutkan belajar", rc_clear: "Hapus riwayat",
    pm_t: "Fokus Timer", pm_d: "Teknik Pomodoro: belajar fokus, lalu istirahat singkat supaya otak tetap segar.",
    pm_focus: "Foku(() => {
  const { t, esc, sb, SUB, ABBR } = AFU;
  const app = document.getElementById("app");
  AFU.extend("id", {
    hs_docs: "Dokumen gratis", hs_to: "Paket try out", hs_sub: "Subtes UTBK", hs_streak: "Hari beruntun belajar",
    tb_t: "Try Out UTBK", tb_d: "Simulasi dengan timer, nilai dihitung sistem, lengkap dengan statistik dan peringkat. Pengerjaan pertama jadi patokan nilaimu.",
    tb_btn: "Mulai Try Out", tb_stat: "Statistikmu", tb_avg: "rata-rata skor", tb_best: "skor tertinggi", tb_n: "try out selesai", tb_draft: "Ada try out yang belum selesai. Lanjutkan yuk!", tb_new: "Baru",
    rc_t: "Lanjutkan belajar", rc_clear: "Hapus riwayat",
    pm_t: "Fokus Timer", pm_d: "Teknik Pomodoro: belajar fokus, lalu istirahat singkat supaya otak tetap segar.",
    pm_focus: "Fokus", pm_break: "Istirahat", pm_start: "Mulai", pm_pause: "Jeda", pm_reset: "Ulang",
    pm_today: n => n + " sesi fokus hari ini", pm_done_f: "Sesi fokus selesai. Istirahat dulu ya!", pm_done_b: "Istirahat selesai. Yuk lanjut belajar!",
    totop: "Kembali ke atas"
  });
  AFU.extend("en", {
    hs_docs: "Free documents", hs_to: "Mock tests", hs_sub: "UTBK subtests", hs_streak: "Day study streak",
    tb_t: "UTBK Mock Tests", tb_d: "Timed simulations with system-graded scores, statistics and rankings. Your first attempt is the one that counts.",
    tb_btn: "Start a Mock Test", tb_stat: "Your statistics", tb_avg: "average score", tb_best: "highest score", tb_n: "tests completed", tb_draft: "You have an unfinished mock test. Resume it!", tb_new: "New",
    rc_t: "Continue studying", rc_clear: "Clear history",
    pm_t: "Focus Timer", pm_d: "Pomodoro technique: focus hard, then take a short break to keep your mind fresh.",
    pm_focus: "Focus", pm_break: "Break", pm_start: "Start", pm_pause: "Pause", pm_reset: "Reset",
    pm_today: n => n + (n === 1 ? " focus session today" : " focus sessions today"), pm_done_f: "Focus session done. Take a break!", pm_done_b: "Break is over. Back to studying!",
    totop: "Back to top"
  });
  const LS = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const TYPES = { modul: "soal", pembahasan: "pembahasan" };
  const IG_DM = "https://ig.me/m/afu.digital.library"; // tombol "Laporkan masalah" dan "Minta materi" membuka DM Instagram ini
  // Nilai awal; yang di Supabase (tabel site_settings, diatur dari admin) menimpa ini
  const S = { utbk_date: "2027-04-21T08:00:00+07:00", utbk_confirmed: "false", announcement: "" };
  const ICON = {
    book: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v2H6.5"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    dl: '<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.3 2-4.3.2 1.5 1 2.3 1.8 2.8C11 9 11 6 12 3z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    trophy: '<svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
    redo: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
  };
  const cache = {};
  let cdTimer, page = "";

  // ---- data ----
  async function loadAll() {
    if (cache.all) return cache.all;
    let all = [], from = 0;
    for (;;) {
      const { data, error } = await sb.from("documents").select("*").order("created_at", { ascending: false }).order("id").range(from, from + 999);
      if (error) throw error;
      all = all.concat(data);
      if (data.length < 1000) break;
      from += 1000;
    }
    cache.byId = Object.fromEntries(all.map(d => [d.id, d]));
    return (cache.all = all);
  }
  const load = async type => (await loadAll()).filter(d => d.type === type);
  async function loadSettings() {
    if (!AFU.configured) return;
    try { const { data } = await sb.from("site_settings").select("key,value"); (data || []).forEach(r => (S[r.key] = r.value)); } catch (e) {}
  }

  // ---- util ----
  const msg = (text, cls = "") => `<div class="wrap"><p class="notice ${cls}">${esc(text)}</p></div>`;
  const title = type => (type === "modul" ? t("modul_t") : t("pemb_t"));
  const isNew = d => Date.now() - new Date(d.created_at).getTime() < 7 * 864e5;
  const stagger = () => document.querySelectorAll(".grid2>.card,.shelf>.card,.steps>li").forEach((c, i) => c.style.setProperty("--i", Math.min(i, 10)));
  const favs = () => { try { return JSON.parse(localStorage.getItem("afu-fav")) || []; } catch (e) { return []; } };
  const saveFavs = a => { try { localStorage.setItem("afu-fav", JSON.stringify(a)); } catch (e) {} };
  const updFavN = () => { const n = favs().length, el = document.getElementById("favN"); if (el) el.textContent = n ? n : ""; };

  function toast(text) {
    let el = document.getElementById("toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = text; el.classList.add("on");
    clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove("on"), 1800);
  }
  async function copy(text, okMsg) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const i = document.createElement("input"); i.value = text; document.body.appendChild(i); i.select(); document.execCommand("copy"); i.remove(); }
    toast(okMsg || t("copied"));
  }
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-copy]"); if (c) return copy(c.dataset.copy);
    const f = e.target.closest("[data-fav]"); if (!f) return;
    const id = f.dataset.fav; let a = favs(); const on = !a.includes(id);
    a = on ? [...a, id] : a.filter(x => x !== id); saveFavs(a);
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => { b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", t(on ? "fav_rm" : "fav_add")); });
    updFavN();
    if (page === "favorit" && !on) setTimeout(favPage, 250);
  });

  // riwayat dokumen yang dibuka (disimpan di browser)
  document.addEventListener("click", e => {
    const o = e.target.closest("[data-open]"); if (!o) return;
    const id = o.dataset.open; LS.set("afu-recent", [id, ...LS.get("afu-recent", []).filter(x => x !== id)].slice(0, 6));
  });

  // ---- kartu dokumen ----
  function docCard(d, tag) {
    const loc = AFU.lang === "id" ? "id-ID" : "en-US";
    const date = new Date(d.created_at).toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" });
    const meta = [AFU.fmtSize(d.size_bytes), t("added") + " " + date].filter(Boolean).join(" · ");
    const url = AFU.url(d.file_path);
    const partner = d.pair_id && cache.byId?.[d.pair_id];
    const on = favs().includes(d.id);
    return `
      <article class="card doc" data-q="${esc((d.title + " " + (d.description || "")).toLowerCase())}">
        <button class="fav" type="button" data-fav="${esc(d.id)}" aria-pressed="${on}" aria-label="${esc(t(on ? "fav_rm" : "fav_add"))}">${ICON.star}</button>
        <span class="pdf">${ICON.doc}<small>PDF</small></span>
        <div class="doc-b">
          ${tag ? `<span class="tag">${esc(tag)}</span>` : ""}
          <h3>${esc(d.title)}${isNew(d) ? `<span class="new">${esc(t("new_badge"))}</span>` : ""}</h3>
          ${d.description ? `<p>${esc(d.description)}</p>` : ""}
          <span class="muted">${esc(meta)}</span>
          <div class="btns">
            <a class="btn" data-open="${esc(d.id)}" href="${esc(url)}" target="_blank" rel="noopener">${ICON.eye}${esc(t("read"))}</a>
            <a class="btn ghost" data-open="${esc(d.id)}" href="${esc(AFU.url(d.file_path, d.title + ".pdf"))}">${ICON.dl}${esc(t("download"))}</a>
            <button class="btn ghost sm" type="button" data-copy="${esc(url)}">${ICON.copy}${esc(t("copy"))}</button>
            ${partner ? `<a class="btn ghost sm" href="${esc(AFU.url(partner.file_path))}" target="_blank" rel="noopener">${ICON.link}${esc(t(d.type === "soal" ? "see_pemb" : "see_soal"))}</a>` : ""}
          </div>
          <a class="report" href="${IG_DM}" target="_blank" rel="noopener">${esc(t("report"))}</a>
        </div>
      </article>`;
  }

  // ---- pengumuman ----
  function renderBanner() {
    const b = document.getElementById("banner"), txt = (S.announcement || "").trim();
    let seen = ""; try { seen = sessionStorage.getItem("afu-ban"); } catch (e) {}
    if (!txt || seen === txt) { b.hidden = true; return; }
    b.hidden = false;
    b.innerHTML = `<div class="wrap banner-in"><span>${esc(txt)}</span><button type="button" id="banX" aria-label="${esc(t("close"))}">×</button></div>`;
    document.getElementById("banX").onclick = () => { try { sessionStorage.setItem("afu-ban", txt); } catch (e) {} b.hidden = true; };
  }

  // ---- hitung mundur ----
  function countdownHTML() {
    const ms = new Date(S.utbk_date).getTime(); if (isNaN(ms)) return "";
    const loc = AFU.lang === "id" ? "id-ID" : "en-US";
    const dateTxt = new Date(ms).toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
    return `<section class="wrap"><div class="count" id="count" data-ms="${ms}">
      <div class="count-txt"><h2>${esc(t("cd_title"))}</h2><p class="when">${ICON.cal}<span>${esc(dateTxt)}</span></p>
        <div class="tags"><span class="chip-est">${esc(t(S.utbk_confirmed === "true" ? "cd_official" : "cd_est"))}</span><span class="tag-h">#MerdekaBelajar</span><span class="tag-h">#SuksesMasukKampusId</span></div>
        <a class="count-link" href="https://snpmb.id" target="_blank" rel="noopener">${esc(t("cd_check"))}</a></div>
      <div class="tiles" role="timer" aria-label="${esc(t("cd_title"))}">${["d", "h", "m", "s"].map(k =>
        `<div class="tile"><b data-u="${k}">--</b><span>${esc(t("cd_" + k))}</span></div>`).join("")}</div>
    </div></section>`;
  }
  function startCountdown() {
    const el = document.getElementById("count"); if (!el) return;
    const target = +el.dataset.ms, nodes = {};
    el.querySelectorAll("[data-u]").forEach(n => (nodes[n.dataset.u] = n));
    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) { el.querySelector(".tiles").innerHTML = `<p class="cd-done">${esc(t("cd_done"))}</p>`; clearInterval(cdTimer); return; }
      const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
      for (const k in v) {
        const txt = String(v[k]).padStart(k === "d" ? 1 : 2, "0");
        if (nodes[k].textContent !== txt) { nodes[k].textContent = txt; nodes[k].classList.remove("tick"); void nodes[k].offsetWidth; nodes[k].classList.add("tick"); }
      }
    };
    clearInterval(cdTimer); tick(); cdTimer = setInterval(tick, 1000);
  }

  // ---- beranda ----
  const HEX = [[180, 175], [296, 175], [238, 273], [122, 273], [64, 175], [122, 77], [238, 77]];
  const honey = () => `<div class="honey">${HEX.map(([x, y], i) =>
    `<a class="hex" href="/modul/${SUB[i]}" title="${esc(t("s_" + SUB[i]))}" aria-label="${esc(t("s_" + SUB[i]))}" style="left:${x - 55}px;top:${y - 63}px;--c:var(--b${i + 1});--d:${i * 80}ms">${ABBR[SUB[i]]}</a>`).join("")}</div>`;

  // ---- promo "belajar di mana saja" ----
  const promoHTML = () => `
    <section class="promo" aria-labelledby="promoT">
      <div class="promo-art">
        <span class="spark sp1"></span><span class="spark sp2"></span><span class="spark sp3"></span>
        <img src="/assets/mascot-study.webp" alt="${esc(t("promo_alt"))}" width="800" height="711" loading="lazy" decoding="async">
      </div>
      <div class="promo-txt">
        <h2 id="promoT">${esc(t("promo_a"))}<br><em>${esc(t("promo_b"))}<span class="swoosh" aria-hidden="true"><svg viewBox="0 0 300 14" preserveAspectRatio="none"><path d="M3 10C70 2 190 1 297 8"/></svg></span></em></h2>
        <p>${esc(t("promo_d"))}</p>
        <a class="btn promo-btn" href="/modul">${esc(t("promo_btn"))}${ICON.arrow}</a>
      </div>
    </section>`;

  // ---- streak belajar (hari beruntun membuka website) ----
  function touchStreak() {
    const day = d => d.toLocaleDateString("sv-SE");
    const st = LS.get("afu-streak", { last: "", n: 0 }), today = day(new Date());
    if (st.last !== today) { st.n = st.last === day(new Date(Date.now() - 864e5)) ? st.n + 1 : 1; st.last = today; LS.set("afu-streak", st); }
    return st.n || 1;
  }

  // ---- strip angka ----
  const stripHTML = () => `
    <section class="wrap strip-w"><div class="strip" id="strip">
      <div class="st"><b data-n="docs">0</b><span>${esc(t("hs_docs"))}</span></div>
      <div class="st"><b data-n="to">0</b><span>${esc(t("hs_to"))}</span></div>
      <div class="st"><b data-n="sub">7</b><span>${esc(t("hs_sub"))}</span></div>
      <div class="st fire">${ICON.flame}<b data-n="streak">${touchStreak()}</b><span>${esc(t("hs_streak"))}</span></div>
    </div></section>`;
  function countUp(el, to) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || to < 2) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = now => { const p = Math.min(1, (now - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1 && el.isConnected) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  async function fillStrip() {
    const el = document.getElementById("strip"); if (!el || !AFU.configured) return;
    const set = (k, v) => { const n = el.querySelector(`[data-n="${k}"]`); if (n) countUp(n, v); };
    try { set("docs", (await loadAll()).length); } catch (e) {}
    try { set("to", (await AFU.TO.loadList()).length); } catch (e) {}
  }

  // ---- banner Try Out ----
  function tryoutBannerHTML() {
    const st = AFU.TO.stats(), draft = AFU.TO.hasDraft();
    return `<section class="tbanner">
      <div class="tb-txt"><span class="tb-new">${esc(t("tb_new"))}</span>
        <h2>${esc(t("tb_t"))}</h2><p>${esc(t("tb_d"))}</p>
        ${draft ? `<p class="tb-draft">${esc(t("tb_draft"))}</p>` : ""}
        <a class="btn tb-btn" href="/tryout">${esc(t("tb_btn"))}${ICON.arrow}</a></div>
      <div class="tb-stat card">
        <h3>${ICON.trophy}${esc(t("tb_stat"))}</h3>
        ${st.n ? `<div class="tb-grid"><div><b>${st.avg}</b><span>${esc(t("tb_avg"))}</span></div><div><b>${st.best}</b><span>${esc(t("tb_best"))}</span></div><div><b>${st.n}</b><span>${esc(t("tb_n"))}</span></div></div>
        <a class="go" href="/tryout/statistik">${esc(t("to_tab_stats"))}${ICON.next}</a>`
        : `<p class="muted">${esc(t("st_empty"))}</p>`}
      </div></section>`;
  }

  // ---- lanjutkan belajar ----
  function fillRecent() {
    const box = document.getElementById("recent"); if (!box) return;
    const docs = LS.get("afu-recent", []).map(id => cache.byId?.[id]).filter(Boolean);
    if (!docs.length) { box.innerHTML = ""; return; }
    box.innerHTML = `<h2 class="how-t">${esc(t("rc_t"))}</h2><div class="grid2">${docs.slice(0, 2).map(d =>
      docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`;
    stagger();
  }

  // ---- Fokus Timer (Pomodoro) ----
  const PM = { mode: "focus", dur: { focus: 1500, break: 300 }, left: 1500, end: 0, run: false, id: 0 };
  const pmToday = () => { const d = new Date().toLocaleDateString("sv-SE"), v = LS.get("afu-pomo", {}); return v.d === d ? v.n : 0; };
  function beep() {
    try {
      const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.setValueAtTime(.15, c.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .6); o.start(); o.stop(c.currentTime + .6);
    } catch (e) {}
  }
  function pmPaint() {
    const time = document.getElementById("pmTime"), ring = document.getElementById("pmRing");
    const m = String(Math.floor(PM.left / 60)).padStart(2, "0"), sec = String(PM.left % 60).padStart(2, "0");
    if (time) time.textContent = `${m}:${sec}`;
    if (ring) ring.style.strokeDashoffset = String(327 * (1 - PM.left / PM.dur[PM.mode]));
    document.title = PM.run ? `(${m}:${sec}) AFU Digital Library` : "AFU Digital Library";
  }
  function pmTick() {
    PM.left = Math.max(0, Math.round((PM.end - Date.now()) / 1000));
    if (PM.left <= 0) {
      clearInterval(PM.id); PM.run = false; beep();
      if (PM.mode === "focus") { const d = new Date().toLocaleDateString("sv-SE"); LS.set("afu-pomo", { d, n: pmToday() + 1 }); }
      toast(t(PM.mode === "focus" ? "pm_done_f" : "pm_done_b"));
      PM.mode = PM.mode === "focus" ? "break" : "focus"; PM.left = PM.dur[PM.mode];
      pmDraw(); return;
    }
    pmPaint();
  }
  const pomoHTML = () => `
    <section class="pomo" id="pomo"><div class="pomo-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="pb"/><circle id="pmRing" cx="60" cy="60" r="52" class="pf"/></svg><b id="pmTime">25:00</b></div>
      <div class="pomo-txt"><h2>${ICON.clock}${esc(t("pm_t"))}</h2><p>${esc(t("pm_d"))}</p>
        <div class="seg" role="tablist"><button type="button" data-pm="focus" aria-pressed="true">${esc(t("pm_focus"))} 25</button><button type="button" data-pm="break" aria-pressed="false">${esc(t("pm_break"))} 5</button></div>
        <div class="btns"><button class="btn" id="pmGo" type="button"></button><button class="btn ghost" id="pmReset" type="button">${ICON.redo}${esc(t("pm_reset"))}</button></div>
        <p class="muted" id="pmN"></p></div></section>`;
  function pmDraw() {
    const go = document.getElementById("pmGo"); if (!go) return pmPaint();
    go.innerHTML = (PM.run ? ICON.pause : ICON.play) + esc(t(PM.run ? "pm_pause" : "pm_start"));
    document.querySelectorAll("[data-pm]").forEach(b => b.setAttribute("aria-pressed", b.dataset.pm === PM.mode));
    document.getElementById("pomo")?.classList.toggle("brk", PM.mode === "break");
    const n = document.getElementById("pmN"); if (n) n.textContent = t("pm_today", pmToday());
    pmPaint();
  }
  function bindPomo() {
    const el = document.getElementById("pomo"); if (!el) return;
    document.getElementById("pmGo").onclick = () => {
      if (PM.run) { clearInterval(PM.id); PM.run = false; }
      else { PM.run = true; PM.end = Date.now() + PM.left * 1000; clearInterval(PM.id); PM.id = setInterval(pmTick, 500); }
      pmDraw();
    };
    document.getElementById("pmReset").onclick = () => { clearInterval(PM.id); PM.run = false; PM.left = PM.dur[PM.mode]; pmDraw(); };
    el.querySelectorAll("[data-pm]").forEach(b => (b.onclick = () => { clearInterval(PM.id); PM.run = false; PM.mode = b.dataset.pm; PM.left = PM.dur[PM.mode]; pmDraw(); }));
    pmDraw();
  }

  function home() {
    app.innerHTML = `
      <section class="hero"><div class="wrap hero-in">
        <div class="hero-txt">
          <h1>${esc(t("hero_title"))}</h1>
          <p class="lead">${esc(t("hero_desc"))}</p>
          <label class="search gs">${ICON.search}<input id="gq" type="search" placeholder="${esc(t("gsearch_ph"))}" autocomplete="off"></label>
        </div>
        ${honey()}
      </div></section>
      <section class="wrap" id="gres" aria-live="polite"></section>
      ${countdownHTML()}
      ${stripHTML()}
      <section class="wrap choose">
        <h2 class="sr">${esc(t("choose"))}</h2>
        <div class="grid2">
          <a class="card big" href="/modul"><span class="ico">${ICON.book}</span>
            <h3>${esc(t("modul_t"))}</h3><p>${esc(t("modul_d"))}</p><span class="go">${esc(t("open"))}${ICON.next}</span></a>
          <a class="card big alt" href="/pembahasan"><span class="ico">${ICON.doc}</span>
            <h3>${esc(t("pemb_t"))}</h3><p>${esc(t("pemb_d"))}</p><span class="go">${esc(t("open"))}${ICON.next}</span></a>
        </div>
        ${tryoutBannerHTML()}
        <div id="latest"></div>
        <div id="recent"></div>
        ${promoHTML()}
        ${pomoHTML()}
        <h2 class="how-t">${esc(t("how_t"))}</h2>
        <ol class="steps">
          ${[1, 2, 3].map(n => `<li><b>${n}</b><div><strong>${esc(t("st" + n))}</strong><span>${esc(t("st" + n + "d"))}</span></div></li>`).join("")}
        </ol>
      </section>`;
    stagger(); startCountdown(); fillLatest(); fillStrip(); bindPomo();
    let timer;
    document.getElementById("gq").addEventListener("input", e => { clearTimeout(timer); timer = setTimeout(() => globalSearch(e.target.value), 250); });
  }
  async function fillLatest() {
    if (!AFU.configured) return;
    try {
      const all = await loadAll(), box = document.getElementById("latest");
      if (!box || !all.length) return;
      box.innerHTML = `<h2 class="how-t">${esc(t("latest"))}</h2><div class="grid2">${all.slice(0, 6).map(d =>
        docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`;
      stagger(); fillRecent();
    } catch (e) {}
  }
  async function globalSearch(v) {
    const box = document.getElementById("gres"); if (!box) return;
    v = v.trim().toLowerCase();
    if (v.length < 2) { box.innerHTML = ""; return; }
    if (!AFU.configured) { box.innerHTML = `<p class="notice warn">${esc(t("nocfg"))}</p>`; return; }
    try {
      const all = await loadAll();
      const res = all.filter(d => (d.title + " " + (d.description || "") + " " + (d.category || "")).toLowerCase().includes(v)).slice(0, 12);
      if (!box.isConnected) return;
      box.innerHTML = res.length
        ? `<div class="grid2 gres-list">${res.map(d => docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`
        : `<p class="notice">${esc(t("no_match"))}</p>`;
      stagger();
    } catch (e) { box.innerHTML = `<p class="notice warn">${esc(t("err"))}</p>`; }
  }

  // ---- daftar subtes (rak buku) ----
  async function subtests(type) {
    if (!AFU.configured) return (app.innerHTML = msg(t("nocfg"), "warn"));
    app.innerHTML = msg(t("loading"));
    let docs = [];
    try { docs = await load(TYPES[type]); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(title(type))}</h1><p class="lead sm">${esc(t("pick_sub"))}</p>
        <div class="shelf">${SUB.map((k, i) => {
          const n = docs.filter(d => d.subtest === k).length;
          return `<a class="card book" href="/${type}/${k}" style="--c:var(--b${i + 1})">
            <span class="spine"><b>${ABBR[k]}</b></span>
            <span class="bk"><h3>${esc(t("s_" + k))}</h3><span class="muted">${esc(t("docs_count", n))}</span></span>
            <span class="arrow">${ICON.next}</span></a>`;
        }).join("")}</div>
      </section>`;
    stagger();
  }

  // ---- halaman dokumen: filter kategori, cari, urutkan ----
  async function docsPage(type, sub) {
    if (!AFU.configured) return (app.innerHTML = msg(t("nocfg"), "warn"));
    app.innerHTML = msg(t("loading"));
    let docs;
    try { docs = (await load(TYPES[type])).filter(d => d.subtest === sub); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    const catOf = d => d.category?.trim() || t("uncat");
    const cats = [...new Set(docs.map(catOf))];
    const idx = SUB.indexOf(sub) + 1;
    const st = { cat: "", sort: "new", q: "" };
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="/${type}">${ICON.back}${esc(title(type))}</a>
        <h1 class="sub-h" style="--c:var(--b${idx})"><span class="badge lg">${ABBR[sub]}</span> ${esc(t("s_" + sub))}</h1>
        <p class="sub-d">${esc(t("sd_" + sub))}</p>
        ${docs.length ? `<div class="toolbar">
          <label class="search">${ICON.search}<input id="q" type="search" placeholder="${esc(t("search_ph"))}"></label>
          <label class="sortbox"><span class="sr">${esc(t("sort_label"))}</span><select id="sort"><option value="new">${esc(t("sort_new"))}</option><option value="az">${esc(t("sort_az"))}</option></select></label>
        </div>
        ${cats.length > 1 ? `<div class="chips" id="chips"><button class="chip" type="button" data-cat="" aria-pressed="true">${esc(t("all"))}</button>${cats.map(c => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}</div>` : ""}
        <div id="docs"></div>`
        : `<p class="notice">${esc(t("empty"))}</p><a class="btn" href="${IG_DM}" target="_blank" rel="noopener">${ICON.chat}${esc(t("request"))}</a>`}
      </section>`;
    if (!docs.length) return;
    const box = document.getElementById("docs");
    const draw = () => {
      const v = st.q.toLowerCase();
      let list = docs.filter(d => (!st.cat || catOf(d) === st.cat) && (!v || (d.title + " " + (d.description || "")).toLowerCase().includes(v)));
      if (st.sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title, "id", { numeric: true }));
      if (!list.length) { box.innerHTML = `<p class="notice">${esc(t("no_match"))}</p>`; return; }
      const groups = {};
      list.forEach(d => (groups[catOf(d)] ||= []).push(d));
      box.innerHTML = Object.entries(groups).map(([c, l]) =>
        `<section class="grp"><h2 class="cat">${esc(c)}</h2><div class="grid2">${l.map(d => docCard(d)).join("")}</div></section>`).join("");
      stagger();
    };
    document.getElementById("q").addEventListener("input", e => { st.q = e.target.value.trim(); draw(); });
    document.getElementById("sort").addEventListener("change", e => { st.sort = e.target.value; draw(); });
    document.getElementById("chips")?.addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      st.cat = b.dataset.cat;
      document.querySelectorAll("#chips .chip").forEach(x => x.setAttribute("aria-pressed", x === b));
      draw();
    });
    draw();
  }

  // ---- favorit ----
  async function favPage() {
    if (!AFU.configured) return (app.innerHTML = msg(t("nocfg"), "warn"));
    try { await loadAll(); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    const list = favs().map(id => cache.byId[id]).filter(Boolean);
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(t("fav_t"))}</h1><p class="lead sm">${esc(t("fav_note"))}</p>
        ${list.length ? `<div class="grid2">${list.map(d => docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`
          : `<p class="notice">${esc(t("fav_empty"))}</p>`}
      </section>`;
    stagger();
  }

  // ---- tentang + FAQ ----
  function aboutPage() {
    app.innerHTML = `
      <section class="wrap page narrow-p">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(t("about_t"))}</h1><p class="lead sm">${esc(t("about_p"))}</p>
        <div class="req card"><div><h3>${esc(t("request"))}</h3><p>${esc(t("request_d"))}</p></div>
          <a class="btn" href="${IG_DM}" target="_blank" rel="noopener">${ICON.chat}${esc(t("request"))}</a></div>
        <h2 class="how-t">${esc(t("faq_t"))}</h2>
        <div class="faq">${[1, 2, 3, 4, 5, 6].map(n => `<details><summary>${esc(t("q" + n))}</summary><p>${esc(t("a" + n))}</p></details>`).join("")}</div>
      </section>`;
  }

  // ---- router (tanpa #, pakai History API) ----
  function route() {
    clearInterval(cdTimer);
    const [type, sub] = location.pathname.split("/").filter(Boolean);
    page = type || "";
    window.scrollTo(0, 0);
    window.goatcounter?.count?.({ path: location.pathname });
    document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "/" + (page && (TYPES[page] || page === "favorit" || page === "tentang" || page === "tryout") ? page : "")));
    app.classList.remove("enter"); void app.offsetWidth; app.classList.add("enter");
    updFavN();
    if (page === "favorit") return favPage();
    if (page === "tentang") return aboutPage();
    if (page === "tryout") return AFU.TO.render(sub);
    if (!TYPES[type]) return home();
    if (!SUB.includes(sub)) return subtests(type);
    return docsPage(type, sub);
  }

  // ---- PWA ----
  let installEvt;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; document.getElementById("installBtn").hidden = false; });
  document.getElementById("installBtn").addEventListener("click", async () => {
    if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice; installEvt = null; document.getElementById("installBtn").hidden = true;
  });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));

  AFU.init(() => { renderBanner(); if (AFU.TO.busy()) AFU.TO.repaint(); else route(); });

  // helper untuk file lain (tryout.js, assistant.js)
  window.AFUApp = { ICON, toast, copy, stagger, loadAll, S, IG_DM, esc, get docs() { return cache.all || []; } };
  let lastPath = location.pathname;

  // pindah halaman tanpa reload
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href^='/']");
    if (!a || a.target || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (a.getAttribute("href").startsWith("/admin")) return;
    e.preventDefault();
    if (!AFU.TO.leaving()) return;
    history.pushState(null, "", a.getAttribute("href"));
    lastPath = location.pathname;
    route();
  });
  window.addEventListener("popstate", () => {
    if (!AFU.TO.leaving()) { history.pushState(null, "", lastPath); return; }
    lastPath = location.pathname;
    route();
  });
  // link lama (/#/modul/pu) diarahkan ke bentuk baru
  if (location.hash.startsWith("#/")) history.replaceState(null, "", location.hash.slice(1));

  loadSettings().finally(() => { renderBanner(); route(); });

  // ---- sentuhan UI: progres gulir, tombol ke atas, pintasan "/" ----
  (() => {
    const bar = document.createElement("div"); bar.className = "scrollbar"; bar.setAttribute("aria-hidden", "true");
    const up = document.createElement("button"); up.type = "button"; up.className = "totop"; up.hidden = true; up.innerHTML = ICON.up;
    up.setAttribute("aria-label", t("totop")); up.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.append(bar, up);
    let raf = 0;
    const upd = () => {
      raf = 0;
      const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
      up.hidden = h.scrollTop < 700;
    };
    window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    document.addEventListener("keydown", e => {
      if (e.key !== "/" || e.target.closest("input,textarea,select") || e.metaKey || e.ctrlKey) return;
      const q = document.getElementById("gq"); if (q) { e.preventDefault(); q.focus(); }
    });
  })();
})();

// ---------- v8: aurora latar ikut kursor, kartu miring saat kursor di dalamnya, cahaya aurora di dalam kartu, tombol magnetik ----------
(() => {
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const app = document.getElementById("app");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ===== aurora latar: 4 gumpalan cahaya, diselipkan sebagai latar =====
  const au = document.createElement("div");
  au.className = "aurora"; au.setAttribute("aria-hidden", "true");
  au.innerHTML = "<i></i><i></i><i></i><i></i>";
  document.body.prepend(au);
  document.documentElement.classList.add("has-aurora");
  const blobs = [...au.children], FOLLOW = [.32, .20, .28, .16]; // makin besar = makin jauh ikut kursor
  let ax = 0, ay = 0, tx = 0, ty = 0, auRun = false;
  const auLoop = () => {
    ax += (tx - ax) * .06; ay += (ty - ay) * .06; // gerak halus, ada "ekor"
    blobs.forEach((b, i) => { b.style.translate = `${(ax * FOLLOW[i]).toFixed(1)}px ${(ay * FOLLOW[i]).toFixed(1)}px`; });
    if (Math.abs(tx - ax) > .3 || Math.abs(ty - ay) > .3) requestAnimationFrame(auLoop); else auRun = false;
  };

  // ===== kartu: miring HANYA saat kursor ada di dalam kartu =====
  // DIR = 1  -> sisi kartu yang dekat kursor "menghadap" kursor. Ubah ke -1 kalau mau kebalikannya.
  const DIR = 1;
  // max = sudut miring maksimal (derajat) saat kursor di tepi kartu. Kecilkan angkanya kalau masih terlalu miring.
  const GROUPS = [
    { sel: ".card.big,.card.to-card", max: 6 },        // kartu besar beranda + kartu try out
    { sel: ".card.book", max: 5 },                      // kartu subtes
    { sel: ".card.doc", max: 3.5 },                     // kartu dokumen (lebar, jadi miringnya lebih kecil)
    { sel: ".honey", max: 7, minWidth: 821 }            // 7 heksagon = satu kartu, miring bersama
  ];
  const ALL = GROUPS.map(g => g.sel).join(","), MAG = ".promo-btn,.soc,.ctrl .icon-btn";
  const groupOf = el => GROUPS.find(g => el.matches(g.sel));
  const resetT = el => { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); };
  const resetM = el => { el.style.translate = ""; };
  let px = 0, py = 0, has = false, pRaf = 0, curT = null, curM = null;

  // satu titik kursor -> cari kartu di bawahnya -> miringkan + gerakkan cahaya di dalamnya
  const point = (x, y, target) => {
    const el = target && target.closest ? target.closest(ALL) : null;
    if (curT && curT !== el) resetT(curT); // kursor keluar dari kartu -> kartu kembali lurus
    curT = el;
    if (!el) return;
    const g = groupOf(el);
    if (g.minWidth && innerWidth < g.minWidth) return resetT(el);
    const r = el.getBoundingClientRect();
    const fx = clamp((x - r.left) / r.width, 0, 1), fy = clamp((y - r.top) / r.height, 0, 1); // posisi kursor di dalam kartu, 0..1
    el.style.setProperty("--ry", (DIR * (fx - .5) * 2 * g.max).toFixed(2) + "deg");
    el.style.setProperty("--rx", (-DIR * (fy - .5) * 2 * g.max).toFixed(2) + "deg");
    el.style.setProperty("--mx", (fx * 100).toFixed(1) + "%"); // posisi cahaya aurora di dalam kartu
    el.style.setProperty("--my", (fy * 100).toFixed(1) + "%");
  };
  const sched = target => {
    if (pRaf) return;
    pRaf = requestAnimationFrame(() => { pRaf = 0; if (has) point(px, py, target || document.elementFromPoint(px, py)); });
  };

  if (fine && !reduce) {
    addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX; py = e.clientY; has = true;
      sched(e.target);

      // aurora latar ikut kursor
      tx = px - innerWidth / 2; ty = py - innerHeight / 2;
      if (!auRun) { auRun = true; requestAnimationFrame(auLoop); }

      // tombol magnetik
      const m = e.target.closest && e.target.closest(MAG);
      if (curM && curM !== m) resetM(curM);
      curM = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.translate = `${((px - (r.left + r.width / 2)) * .25).toFixed(1)}px ${((py - (r.top + r.height / 2)) * .25).toFixed(1)}px`;
      }
    }, { passive: true });
    addEventListener("scroll", () => sched(null), { passive: true }); // kartu bergeser saat gulir, hitung ulang
    document.documentElement.addEventListener("mouseleave", () => {
      has = false;
      if (curT) resetT(curT); curT = null;
      if (curM) resetM(curM); curM = null;
    });
  }

  // ===== muncul halus saat digulir + dipasang ulang tiap halaman dirender =====
  let scan = () => {};
  if (!reduce && app && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
    const SEL = ".promo,.count,.how-t,.steps,.faq,.req,.tbanner,.pomo";
    scan = () => app.querySelectorAll(SEL).forEach(el => { if (el.dataset.rv) return; el.dataset.rv = "1"; el.classList.add("reveal"); io.observe(el); });
  }
  if (app) {
    let mRaf = 0;
    new MutationObserver(() => { if (!mRaf) mRaf = requestAnimationFrame(() => { mRaf = 0; scan(); }); }).observe(app, { childList: true, subtree: true });
    scan();
  }
})();

// ---------- v9: palet perintah (Ctrl/Cmd+K), pintasan keyboard, target harian + XP + badge, transisi tema ----------
(() => {
  const L = (a, b) => (AFU.lang === "id" ? a : b);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const today = () => new Date().toLocaleDateString("sv-SE");
  const toast = m => { if (window.AFUApp) AFUApp.toast(m); };
  const typing = el => !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || "");
  const SUBS = AFU.SUB, ABBR = AFU.ABBR;

  // pindah halaman lewat router bawaan (klik pada link internal)
  const go = href => {
    const a = document.createElement("a");
    a.href = href; a.style.display = "none";
    document.body.appendChild(a); a.click(); a.remove();
  };

  /* =============== 1) palet perintah =============== */
  let box, input, list, items = [], idx = 0, lastFocus = null, docsReady = false;

  const pageItems = () => [
    { sec: L("Halaman", "Pages"), ic: "🏠", t: L("Beranda", "Home"), s: "/", run: () => go("/") },
    { sec: L("Halaman", "Pages"), ic: "📚", t: AFU.t("nav_modul"), s: "/modul", run: () => go("/modul") },
    { sec: L("Halaman", "Pages"), ic: "✅", t: AFU.t("nav_pemb"), s: "/pembahasan", run: () => go("/pembahasan") },
    { sec: L("Halaman", "Pages"), ic: "📝", t: AFU.t("nav_to"), s: "/tryout", run: () => go("/tryout") },
    { sec: L("Halaman", "Pages"), ic: "📊", t: L("Statistik saya", "My stats"), s: "/tryout/statistik", run: () => go("/tryout/statistik") },
    { sec: L("Halaman", "Pages"), ic: "⭐", t: AFU.t("nav_fav"), s: "/favorit", run: () => go("/favorit") },
    { sec: L("Halaman", "Pages"), ic: "ℹ️", t: AFU.t("nav_about"), s: "/tentang", run: () => go("/tentang") }
  ];

  const actionItems = () => [
    { sec: L("Aksi", "Actions"), ic: "🌗", t: L("Ganti tema terang/gelap", "Toggle light/dark theme"), k: "T", run: () => document.getElementById("themeBtn")?.click() },
    { sec: L("Aksi", "Actions"), ic: "🌐", t: L("Ganti bahasa ID/EN", "Switch language ID/EN"), k: "L", run: () => document.getElementById("langBtn")?.click() },
    { sec: L("Aksi", "Actions"), ic: "⏱️", t: L("Buka Fokus Timer", "Open Focus Timer"), run: () => {
      go("/");
      setTimeout(() => document.getElementById("pomo")?.scrollIntoView({ behavior: "smooth", block: "center" }), 450);
    } },
    { sec: L("Aksi", "Actions"), ic: "⌨️", t: L("Lihat pintasan keyboard", "Show keyboard shortcuts"), k: "?", run: () => setTimeout(openHelp, 60) },
    { sec: L("Aksi", "Actions"), ic: "🔗", t: L("Salin link halaman ini", "Copy this page link"), run: () => { if (window.AFUApp) AFUApp.copy(location.href); } }
  ];

  const subItems = () => {
    const out = [];
    SUBS.forEach(k => {
      out.push({ sec: L("Subtes: Modul Soal", "Subtests: Question modules"), ic: "📘", t: ABBR[k] + " · " + AFU.t("s_" + k), s: "/modul/" + k, run: () => go("/modul/" + k) });
    });
    SUBS.forEach(k => {
      out.push({ sec: L("Subtes: Pembahasan", "Subtests: Solutions"), ic: "📗", t: ABBR[k] + " · " + AFU.t("s_" + k), s: "/pembahasan/" + k, run: () => go("/pembahasan/" + k) });
    });
    return out;
  };

  const docItems = () => ((window.AFUApp && AFUApp.docs) || []).map(d => ({
    sec: L("Dokumen", "Documents"),
    ic: d.type === "soal" ? "📄" : "💡",
    t: d.title,
    s: (d.type === "soal" ? AFU.t("modul_t") : AFU.t("pemb_t")) + " · " + (ABBR[d.subtest] || d.subtest) + (d.category ? " · " + d.category : ""),
    run: () => go((d.type === "soal" ? "/modul/" : "/pembahasan/") + d.subtest)
  }));

  // skor pencarian: semua kata harus ada; awal kata dihargai lebih tinggi
  const score = (q, text) => {
    const s = text.toLowerCase(), words = q.toLowerCase().split(/\s+/).filter(Boolean);
    let sc = 0;
    for (const w of words) {
      const i = s.indexOf(w);
      if (i < 0) return -1;
      sc += i === 0 ? 3 : /[\s·\-/]/.test(s[i - 1]) ? 2 : 1;
    }
    return sc;
  };

  function compute(q) {
    const all = [...pageItems(), ...actionItems(), ...subItems(), ...docItems()];
    if (!q.trim()) return all.filter(x => x.sec !== L("Dokumen", "Documents")).slice(0, 14);
    return all
      .map(x => ({ x, sc: score(q, x.t + " " + (x.s || "") + " " + x.sec) }))
      .filter(r => r.sc >= 0)
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 40)
      .map(r => r.x);
  }

  function paintList() {
    if (!items.length) { list.innerHTML = `<li class="cp-empty">${esc(L("Tidak ada yang cocok.", "Nothing matches."))}</li>`; input.removeAttribute("aria-activedescendant"); return; }
    let html = "", last = "";
    items.forEach((x, i) => {
      if (x.sec !== last) { html += `<li class="cp-sec" role="presentation">${esc(x.sec)}</li>`; last = x.sec; }
      html += `<li class="cp-it${i === idx ? " on" : ""}" role="option" id="cp-i-${i}" data-i="${i}" aria-selected="${i === idx}">
        <span class="cp-ic" aria-hidden="true">${x.ic}</span>
        <span class="cp-t">${esc(x.t)}${x.s ? `<span class="cp-s">${esc(x.s)}</span>` : ""}</span>
        ${x.k ? `<span class="cp-k">${esc(x.k)}</span>` : ""}</li>`;
    });
    list.innerHTML = html;
    input.setAttribute("aria-activedescendant", "cp-i-" + idx);
    list.querySelector(".cp-it.on")?.scrollIntoView({ block: "nearest" });
  }

  function refresh() { items = compute(input.value); idx = 0; paintList(); }
  function choose(i) { const x = items[i]; if (!x) return; closePalette(false); x.run(); }

  function buildPalette() {
    box = document.createElement("div");
    box.className = "cp"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
    box.innerHTML = `<div class="cp-box">
      <div class="cp-in"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input id="cpIn" type="text" role="combobox" aria-expanded="true" aria-controls="cpList" autocomplete="off" spellcheck="false"></div>
      <ul class="cp-list" id="cpList" role="listbox"></ul>
      <div class="cp-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> <span data-l="nav"></span></span><span><kbd>Enter</kbd> <span data-l="open"></span></span><span><kbd>Esc</kbd> <span data-l="close"></span></span></div></div>`;
    document.body.appendChild(box);
    input = box.querySelector("#cpIn"); list = box.querySelector("#cpList");
    box.addEventListener("mousedown", e => { if (e.target === box) closePalette(true); });
    list.addEventListener("mousemove", e => {
      const li = e.target.closest(".cp-it"); if (!li) return;
      const i = +li.dataset.i; if (i !== idx) { idx = i; paintList(); }
    });
    list.addEventListener("click", e => { const li = e.target.closest(".cp-it"); if (li) choose(+li.dataset.i); });
    input.addEventListener("input", refresh);
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); idx = (idx + 1) % Math.max(items.length, 1); paintList(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); idx = (idx - 1 + items.length) % Math.max(items.length, 1); paintList(); }
      else if (e.key === "Enter") { e.preventDefault(); choose(idx); }
      else if (e.key === "Escape") { e.preventDefault(); closePalette(true); }
      else if (e.key === "Tab") { e.preventDefault(); }
    });
  }

  function openPalette() {
    if (!box) buildPalette();
    lastFocus = document.activeElement;
    input.placeholder = L("Cari halaman, subtes, atau dokumen...", "Search pages, subtests, or documents...");
    box.querySelector("[data-l=nav]").textContent = L("pilih", "navigate");
    box.querySelector("[data-l=open]").textContent = L("buka", "open");
    box.querySelector("[data-l=close]").textContent = L("tutup", "close");
    input.value = ""; refresh();
    box.classList.add("on"); document.documentElement.style.overflow = "hidden";
    setTimeout(() => input.focus(), 30);
    if (!docsReady && window.AFUApp) {
      docsReady = true;
      Promise.resolve(AFUApp.loadAll()).then(() => { if (box.classList.contains("on")) refresh(); }).catch(() => { docsReady = false; });
    }
  }
  function closePalette(restore) {
    if (!box) return;
    box.classList.remove("on"); document.documentElement.style.overflow = "";
    if (restore && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  const paletteOpen = () => !!box && box.classList.contains("on");

  /* =============== 2) tombol palet di header =============== */
  function mountButton() {
    const ctrl = document.querySelector(".ctrl");
    if (!ctrl || document.getElementById("cpBtn")) return;
    const b = document.createElement("button");
    b.id = "cpBtn"; b.type = "button"; b.className = "cp-btn";
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span id="cpBtnT"></span><kbd>${isMac ? "⌘K" : "Ctrl K"}</kbd>`;
    b.addEventListener("click", openPalette);
    ctrl.insertBefore(b, ctrl.firstChild);
    labelButton();
  }
  function labelButton() {
    const s = document.getElementById("cpBtnT"), b = document.getElementById("cpBtn");
    if (s) s.textContent = L("Cari", "Search");
    if (b) b.setAttribute("aria-label", L("Buka pencarian cepat", "Open quick search"));
  }

  /* =============== 3) pintasan keyboard =============== */
  let help;
  function buildHelp() {
    help = document.createElement("div");
    help.className = "kb"; help.setAttribute("role", "dialog"); help.setAttribute("aria-modal", "true");
    help.addEventListener("mousedown", e => { if (e.target === help) closeHelp(); });
    document.body.appendChild(help);
  }
  function openHelp() {
    if (!help) buildHelp();
    const rows = [
      [isMac ? "⌘ K" : "Ctrl K", L("Pencarian cepat", "Quick search")],
      ["/", L("Fokus ke kotak cari beranda", "Focus the home search box")],
      ["H", L("Ke beranda", "Go home")],
      ["M", AFU.t("modul_t")],
      ["F", AFU.t("fav_t")],
      ["T", L("Ganti tema", "Toggle theme")],
      ["L", L("Ganti bahasa", "Switch language")],
      ["?", L("Tampilkan daftar ini", "Show this list")]
    ];
    help.innerHTML = `<div class="kb-box"><h2>${esc(L("Pintasan keyboard", "Keyboard shortcuts"))}</h2>
      ${rows.map(r => `<div class="kb-row"><span>${esc(r[1])}</span><kbd>${esc(r[0])}</kbd></div>`).join("")}
      <button type="button" class="btn ghost kb-x">${esc(AFU.t("close"))}</button></div>`;
    help.querySelector(".kb-x").addEventListener("click", closeHelp);
    help.classList.add("on");
    help.querySelector(".kb-x").focus();
  }
  function closeHelp() { if (help) help.classList.remove("on"); }

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      paletteOpen() ? closePalette(true) : openPalette();
      return;
    }
    if (e.key === "Escape") { if (help && help.classList.contains("on")) closeHelp(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target) || paletteOpen()) return;
    const k = e.key.toLowerCase();
    if (e.key === "?") { e.preventDefault(); openHelp(); }
    else if (k === "t") document.getElementById("themeBtn")?.click();
    else if (k === "l") document.getElementById("langBtn")?.click();
    else if (k === "h") go("/");
    else if (k === "m") go("/modul");
    else if (k === "f") go("/favorit");
  });

  /* =============== 4) transisi tema yang mulus =============== */
  document.addEventListener("click", e => {
    if (!e.target.closest("#themeBtn")) return;
    const h = document.documentElement;
    h.classList.add("theme-fade");
    clearTimeout(h._tf); h._tf = setTimeout(() => h.classList.remove("theme-fade"), 450);
  }, true);

  /* =============== 5) target harian, XP, level, dan badge =============== */
  const DK = "afu-daily", XK = "afu-xp";
  const daily = () => {
    const v = store.get(DK, {});
    return v.d === today() ? v : { d: today(), ids: [], goal: v.goal || 3, done: false };
  };
  const xpData = () => Object.assign({ total: 0, opens: 0, goals: 0, pomo: { d: "", n: 0 }, pomoAll: 0 }, store.get(XK, {}));
  const level = xp => Math.floor(xp / 100) + 1;

  const BADGES = [
    { ic: "📖", n: ["Pembuka Buku", "First Page"], ok: (x) => x.opens >= 1 },
    { ic: "📚", n: ["Kutu Buku (25 dokumen)", "Bookworm (25 docs)"], ok: (x) => x.opens >= 25 },
    { ic: "🍅", n: ["Fokus Pemula", "Focus Rookie"], ok: (x) => x.pomoAll >= 1 },
    { ic: "🔥", n: ["Streak 3 hari", "3-day streak"], ok: (x, s) => s >= 3 },
    { ic: "⚡", n: ["Streak 7 hari", "7-day streak"], ok: (x, s) => s >= 7 },
    { ic: "👑", n: ["Streak 30 hari", "30-day streak"], ok: (x, s) => s >= 30 },
    { ic: "🎯", n: ["Target tercapai", "Goal reached"], ok: (x) => x.goals >= 1 },
    { ic: "🏆", n: ["Konsisten (7 target)", "Consistent (7 goals)"], ok: (x) => x.goals >= 7 },
    { ic: "🚀", n: ["Level 5", "Level 5"], ok: (x) => level(x.total) >= 5 }
  ];

  function award(points, why) {
    const x = xpData(), before = level(x.total);
    x.total += points; store.set(XK, x);
    if (level(x.total) > before) toast(L("Naik ke level ", "Level up! Now level ") + level(x.total) + " 🎉");
    else if (why) toast("+" + points + " XP · " + why);
  }

  // dokumen yang dibuka hari ini dihitung sekali per dokumen
  document.addEventListener("click", e => {
    const o = e.target.closest("[data-open]"); if (!o) return;
    const d = daily(), id = o.dataset.open;
    if (d.ids.includes(id)) return;
    d.ids.push(id);
    const x = xpData(); x.opens += 1; store.set(XK, x);
    let bonus = false;
    if (!d.done && d.ids.length >= d.goal) {
      d.done = true; bonus = true;
      const y = xpData(); y.goals += 1; store.set(XK, y);
    }
    store.set(DK, d);
    award(10, L("buka dokumen", "opened a document"));
    if (bonus) setTimeout(() => { award(20); toast(L("Target harian tercapai! +20 XP 🎯", "Daily goal reached! +20 XP 🎯")); }, 1900);
    paintGoal();
  });

  // sesi Pomodoro diambil dari data Fokus Timer yang sudah ada
  setInterval(() => {
    const p = store.get("afu-pomo", null); if (!p || p.d !== today()) return;
    const x = xpData(), prev = x.pomo.d === p.d ? x.pomo.n : 0;
    if (p.n > prev) {
      const add = p.n - prev;
      x.pomo = { d: p.d, n: p.n }; x.pomoAll += add; store.set(XK, x);
      award(25 * add, L("sesi fokus selesai", "focus session done"));
      paintGoal();
    }
  }, 4000);

  const streakN = () => (store.get("afu-streak", {}).n || 0);

  function goalHTML() {
    const d = daily(), x = xpData(), s = streakN();
    const n = Math.min(d.ids.length, d.goal), pct = Math.round((n / d.goal) * 100);
    const lv = level(x.total), cur = x.total % 100;
    const done = d.ids.length >= d.goal;
    return `<div class="goal-ring${done ? " done" : ""}" style="--p:${pct}" role="img" aria-label="${n}/${d.goal}"><b>${n}/${d.goal}</b></div>
      <div><h2 id="goalT">${esc(done ? L("Target hari ini tercapai! 🎉", "Today's goal reached! 🎉") : L("Target belajar hari ini", "Today's study goal"))}</h2>
        <p>${esc(L("Buka " + d.goal + " dokumen hari ini untuk mengumpulkan XP.", "Open " + d.goal + " documents today to earn XP."))}</p>
        <div class="goal-ctl"><button type="button" data-g="-1" aria-label="${esc(L("Kurangi target", "Decrease goal"))}">−</button>
          <span>${esc(L(d.goal + " dokumen", d.goal + " docs"))}</span>
          <button type="button" data-g="1" aria-label="${esc(L("Tambah target", "Increase goal"))}">+</button></div></div>
      <div class="xp"><span class="xp-lv">Lv ${lv}</span><div class="xp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${cur}"><i style="width:${cur}%"></i></div><span class="xp-n">${x.total} XP</span></div>
      <div class="badges">${BADGES.map(b => `<span class="bdg${b.ok(x, s) ? " on" : ""}">${b.ic} ${esc(AFU.lang === "id" ? b.n[0] : b.n[1])}</span>`).join("")}</div>`;
  }

  function paintGoal() {
    const g = document.getElementById("goal"); if (!g) return;
    g.innerHTML = goalHTML();
    // animasi isi bar XP dan cincin saat pertama muncul
    const bar = g.querySelector(".xp-bar i"); if (bar) { const w = bar.style.width; bar.style.width = "0"; requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = w; })); }
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("#goal [data-g]"); if (!b) return;
    const d = daily(); d.goal = Math.max(1, Math.min(10, d.goal + (+b.dataset.g)));
    if (d.ids.length >= d.goal && !d.done) d.done = true;
    store.set(DK, d); paintGoal();
  });

  function mountGoal() {
    const rec = document.getElementById("recent");
    if (!rec || document.getElementById("goal")) return;
    const g = document.createElement("section");
    g.id = "goal"; g.className = "goal"; g.setAttribute("aria-labelledby", "goalT");
    rec.parentNode.insertBefore(g, rec);
    paintGoal();
  }

  /* =============== 6) pasang semuanya + ikuti perubahan halaman/bahasa =============== */
  let pending = 0;
  const sync = () => { pending = 0; mountButton(); mountGoal(); };
  const schedule = () => { if (!pending) pending = requestAnimationFrame(sync); };
  const app = document.getElementById("app");
  if (app) new MutationObserver(schedule).observe(app, { childList: true });
  new MutationObserver(() => { labelButton(); paintGoal(); if (paletteOpen()) refresh(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  sync();
})();
    hs_docs: "Free documents", hs_to: "Mock tests", hs_sub: "UTBK subtests", hs_streak: "Day study streak",
    tb_t: "UTBK Mock Tests", tb_d: "Timed simulations with system-graded scores, statistics and rankings. Your first attempt is the one that counts.",
    tb_btn: "Start a Mock Test", tb_stat: "Your statistics", tb_avg: "average score", tb_best: "highest score", tb_n: "tests completed", tb_draft: "You have an unfinished mock test. Resume it!", tb_new: "New",
    rc_t: "Continue studying", rc_clear: "Clear history",
    pm_t: "Focus Timer", pm_d: "Pomodoro technique: focus hard, then take a short break to keep your mind fresh.",
    pm_focus: "Focus", pm_break: "Break", pm_start: "Start", pm_pause: "Pause", pm_reset: "Reset",
    pm_today: n => n + (n === 1 ? " focus session today" : " focus sessions today"), pm_done_f: "Focus session done. Take a break!", pm_done_b: "Break is over. Back to studying!",
    totop: "Back to top"
  });
  const LS = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const TYPES = { modul: "soal", pembahasan: "pembahasan" };
  const IG_DM = "https://ig.me/m/afu.digital.library"; // tombol "Laporkan masalah" dan "Minta materi" membuka DM Instagram ini
  // Nilai awal; yang di Supabase (tabel site_settings, diatur dari admin) menimpa ini
  const S = { utbk_date: "2027-04-21T08:00:00+07:00", utbk_confirmed: "false", announcement: "" };
  const ICON = {
    book: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v2H6.5"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    dl: '<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.3 2-4.3.2 1.5 1 2.3 1.8 2.8C11 9 11 6 12 3z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    trophy: '<svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
    redo: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
  };
  const cache = {};
  let cdTimer, page = "";

  // ---- data ----
  async function loadAll() {
    if (cache.all) return cache.all;
    let all = [], from = 0;
    for (;;) {
      const { data, error } = await sb.from("documents").select("*").order("created_at", { ascending: false }).order("id").range(from, from + 999);
      if (error) throw error;
      all = all.concat(data);
      if (data.length < 1000) break;
      from += 1000;
    }
    cache.byId = Object.fromEntries(all.map(d => [d.id, d]));
    return (cache.all = all);
  }
  const load = async type => (await loadAll()).filter(d => d.type === type);
  async function loadSettings() {
    if (!AFU.configured) return;
    try { const { data } = await sb.from("site_settings").select("key,value"); (data || []).forEach(r => (S[r.key] = r.value)); } catch (e) {}
  }

  // ---- util ----
  const msg = (text, cls = "") => `<div class="wrap"><p class="notice ${cls}">${esc(text)}</p></div>`;
  const title = type => (type === "modul" ? t("modul_t") : t("pemb_t"));
  const isNew = d => Date.now() - new Date(d.created_at).getTime() < 7 * 864e5;
  const stagger = () => document.querySelectorAll(".grid2>.card,.shelf>.card,.steps>li").forEach((c, i) => c.style.setProperty("--i", Math.min(i, 10)));
  const favs = () => { try { return JSON.parse(localStorage.getItem("afu-fav")) || []; } catch (e) { return []; } };
  const saveFavs = a => { try { localStorage.setItem("afu-fav", JSON.stringify(a)); } catch (e) {} };
  const updFavN = () => { const n = favs().length, el = document.getElementById("favN"); if (el) el.textContent = n ? n : ""; };

  function toast(text) {
    let el = document.getElementById("toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = text; el.classList.add("on");
    clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove("on"), 1800);
  }
  async function copy(text, okMsg) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const i = document.createElement("input"); i.value = text; document.body.appendChild(i); i.select(); document.execCommand("copy"); i.remove(); }
    toast(okMsg || t("copied"));
  }
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-copy]"); if (c) return copy(c.dataset.copy);
    const f = e.target.closest("[data-fav]"); if (!f) return;
    const id = f.dataset.fav; let a = favs(); const on = !a.includes(id);
    a = on ? [...a, id] : a.filter(x => x !== id); saveFavs(a);
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => { b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", t(on ? "fav_rm" : "fav_add")); });
    updFavN();
    if (page === "favorit" && !on) setTimeout(favPage, 250);
  });

  // riwayat dokumen yang dibuka (disimpan di browser)
  document.addEventListener("click", e => {
    const o = e.target.closest("[data-open]"); if (!o) return;
    const id = o.dataset.open; LS.set("afu-recent", [id, ...LS.get("afu-recent", []).filter(x => x !== id)].slice(0, 6));
  });

  // ---- kartu dokumen ----
  function docCard(d, tag) {
    const loc = AFU.lang === "id" ? "id-ID" : "en-US";
    const date = new Date(d.created_at).toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" });
    const meta = [AFU.fmtSize(d.size_bytes), t("added") + " " + date].filter(Boolean).join(" · ");
    const url = AFU.url(d.file_path);
    const partner = d.pair_id && cache.byId?.[d.pair_id];
    const on = favs().includes(d.id);
    return `
      <article class="card doc" data-q="${esc((d.title + " " + (d.description || "")).toLowerCase())}">
        <button class="fav" type="button" data-fav="${esc(d.id)}" aria-pressed="${on}" aria-label="${esc(t(on ? "fav_rm" : "fav_add"))}">${ICON.star}</button>
        <span class="pdf">${ICON.doc}<small>PDF</small></span>
        <div class="doc-b">
          ${tag ? `<span class="tag">${esc(tag)}</span>` : ""}
          <h3>${esc(d.title)}${isNew(d) ? `<span class="new">${esc(t("new_badge"))}</span>` : ""}</h3>
          ${d.description ? `<p>${esc(d.description)}</p>` : ""}
          <span class="muted">${esc(meta)}</span>
          <div class="btns">
            <a class="btn" data-open="${esc(d.id)}" href="${esc(url)}" target="_blank" rel="noopener">${ICON.eye}${esc(t("read"))}</a>
            <a class="btn ghost" data-open="${esc(d.id)}" href="${esc(AFU.url(d.file_path, d.title + ".pdf"))}">${ICON.dl}${esc(t("download"))}</a>
            <button class="btn ghost sm" type="button" data-copy="${esc(url)}">${ICON.copy}${esc(t("copy"))}</button>
            ${partner ? `<a class="btn ghost sm" href="${esc(AFU.url(partner.file_path))}" target="_blank" rel="noopener">${ICON.link}${esc(t(d.type === "soal" ? "see_pemb" : "see_soal"))}</a>` : ""}
          </div>
          <a class="report" href="${IG_DM}" target="_blank" rel="noopener">${esc(t("report"))}</a>
        </div>
      </article>`;
  }

  // ---- pengumuman ----
  function renderBanner() {
    const b = document.getElementById("banner"), txt = (S.announcement || "").trim();
    let seen = ""; try { seen = sessionStorage.getItem("afu-ban"); } catch (e) {}
    if (!txt || seen === txt) { b.hidden = true; return; }
    b.hidden = false;
    b.innerHTML = `<div class="wrap banner-in"><span>${esc(txt)}</span><button type="button" id="banX" aria-label="${esc(t("close"))}">×</button></div>`;
    document.getElementById("banX").onclick = () => { try { sessionStorage.setItem("afu-ban", txt); } catch (e) {} b.hidden = true; };
  }

  // ---- hitung mundur ----
  function countdownHTML() {
    const ms = new Date(S.utbk_date).getTime(); if (isNaN(ms)) return "";
    const loc = AFU.lang === "id" ? "id-ID" : "en-US";
    const dateTxt = new Date(ms).toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
    return `<section class="wrap"><div class="count" id="count" data-ms="${ms}">
      <div class="count-txt"><h2>${esc(t("cd_title"))}</h2><p class="when">${ICON.cal}<span>${esc(dateTxt)}</span></p>
        <div class="tags"><span class="chip-est">${esc(t(S.utbk_confirmed === "true" ? "cd_official" : "cd_est"))}</span><span class="tag-h">#MerdekaBelajar</span><span class="tag-h">#SuksesMasukKampusId</span></div>
        <a class="count-link" href="https://snpmb.id" target="_blank" rel="noopener">${esc(t("cd_check"))}</a></div>
      <div class="tiles" role="timer" aria-label="${esc(t("cd_title"))}">${["d", "h", "m", "s"].map(k =>
        `<div class="tile"><b data-u="${k}">--</b><span>${esc(t("cd_" + k))}</span></div>`).join("")}</div>
    </div></section>`;
  }
  function startCountdown() {
    const el = document.getElementById("count"); if (!el) return;
    const target = +el.dataset.ms, nodes = {};
    el.querySelectorAll("[data-u]").forEach(n => (nodes[n.dataset.u] = n));
    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) { el.querySelector(".tiles").innerHTML = `<p class="cd-done">${esc(t("cd_done"))}</p>`; clearInterval(cdTimer); return; }
      const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
      for (const k in v) {
        const txt = String(v[k]).padStart(k === "d" ? 1 : 2, "0");
        if (nodes[k].textContent !== txt) { nodes[k].textContent = txt; nodes[k].classList.remove("tick"); void nodes[k].offsetWidth; nodes[k].classList.add("tick"); }
      }
    };
    clearInterval(cdTimer); tick(); cdTimer = setInterval(tick, 1000);
  }

  // ---- beranda ----
  const HEX = [[180, 175], [296, 175], [238, 273], [122, 273], [64, 175], [122, 77], [238, 77]];
  const honey = () => `<div class="honey">${HEX.map(([x, y], i) =>
    `<a class="hex" href="/modul/${SUB[i]}" title="${esc(t("s_" + SUB[i]))}" aria-label="${esc(t("s_" + SUB[i]))}" style="left:${x - 55}px;top:${y - 63}px;--c:var(--b${i + 1});--d:${i * 80}ms">${ABBR[SUB[i]]}</a>`).join("")}</div>`;

  // ---- promo "belajar di mana saja" ----
  const promoHTML = () => `
    <section class="promo" aria-labelledby="promoT">
      <div class="promo-art">
        <span class="spark sp1"></span><span class="spark sp2"></span><span class="spark sp3"></span>
        <img src="/assets/mascot-study.webp" alt="${esc(t("promo_alt"))}" width="800" height="711" loading="lazy" decoding="async">
      </div>
      <div class="promo-txt">
        <h2 id="promoT">${esc(t("promo_a"))}<br><em>${esc(t("promo_b"))}<span class="swoosh" aria-hidden="true"><svg viewBox="0 0 300 14" preserveAspectRatio="none"><path d="M3 10C70 2 190 1 297 8"/></svg></span></em></h2>
        <p>${esc(t("promo_d"))}</p>
        <a class="btn promo-btn" href="/modul">${esc(t("promo_btn"))}${ICON.arrow}</a>
      </div>
    </section>`;

  // ---- streak belajar (hari beruntun membuka website) ----
  function touchStreak() {
    const day = d => d.toLocaleDateString("sv-SE");
    const st = LS.get("afu-streak", { last: "", n: 0 }), today = day(new Date());
    if (st.last !== today) { st.n = st.last === day(new Date(Date.now() - 864e5)) ? st.n + 1 : 1; st.last = today; LS.set("afu-streak", st); }
    return st.n || 1;
  }

  // ---- strip angka ----
  const stripHTML = () => `
    <section class="wrap strip-w"><div class="strip" id="strip">
      <div class="st"><b data-n="docs">0</b><span>${esc(t("hs_docs"))}</span></div>
      <div class="st"><b data-n="to">0</b><span>${esc(t("hs_to"))}</span></div>
      <div class="st"><b data-n="sub">7</b><span>${esc(t("hs_sub"))}</span></div>
      <div class="st fire">${ICON.flame}<b data-n="streak">${touchStreak()}</b><span>${esc(t("hs_streak"))}</span></div>
    </div></section>`;
  function countUp(el, to) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || to < 2) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = now => { const p = Math.min(1, (now - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1 && el.isConnected) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  async function fillStrip() {
    const el = document.getElementById("strip"); if (!el || !AFU.configured) return;
    const set = (k, v) => { const n = el.querySelector(`[data-n="${k}"]`); if (n) countUp(n, v); };
    try { set("docs", (await loadAll()).length); } catch (e) {}
    try { set("to", (await AFU.TO.loadList()).length); } catch (e) {}
  }

  // ---- banner Try Out ----
  function tryoutBannerHTML() {
    const st = AFU.TO.stats(), draft = AFU.TO.hasDraft();
    return `<section class="tbanner">
      <div class="tb-txt"><span class="tb-new">${esc(t("tb_new"))}</span>
        <h2>${esc(t("tb_t"))}</h2><p>${esc(t("tb_d"))}</p>
        ${draft ? `<p class="tb-draft">${esc(t("tb_draft"))}</p>` : ""}
        <a class="btn tb-btn" href="/tryout">${esc(t("tb_btn"))}${ICON.arrow}</a></div>
      <div class="tb-stat card">
        <h3>${ICON.trophy}${esc(t("tb_stat"))}</h3>
        ${st.n ? `<div class="tb-grid"><div><b>${st.avg}</b><span>${esc(t("tb_avg"))}</span></div><div><b>${st.best}</b><span>${esc(t("tb_best"))}</span></div><div><b>${st.n}</b><span>${esc(t("tb_n"))}</span></div></div>
        <a class="go" href="/tryout/statistik">${esc(t("to_tab_stats"))}${ICON.next}</a>`
        : `<p class="muted">${esc(t("st_empty"))}</p>`}
      </div></section>`;
  }

  // ---- lanjutkan belajar ----
  function fillRecent() {
    const box = document.getElementById("recent"); if (!box) return;
    const docs = LS.get("afu-recent", []).map(id => cache.byId?.[id]).filter(Boolean);
    if (!docs.length) { box.innerHTML = ""; return; }
    box.innerHTML = `<h2 class="how-t">${esc(t("rc_t"))}</h2><div class="grid2">${docs.slice(0, 2).map(d =>
      docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`;
    stagger();
  }

  // ---- Fokus Timer (Pomodoro) ----
  const PM = { mode: "focus", dur: { focus: 1500, break: 300 }, left: 1500, end: 0, run: false, id: 0 };
  const pmToday = () => { const d = new Date().toLocaleDateString("sv-SE"), v = LS.get("afu-pomo", {}); return v.d === d ? v.n : 0; };
  function beep() {
    try {
      const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.setValueAtTime(.15, c.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .6); o.start(); o.stop(c.currentTime + .6);
    } catch (e) {}
  }
  function pmPaint() {
    const time = document.getElementById("pmTime"), ring = document.getElementById("pmRing");
    const m = String(Math.floor(PM.left / 60)).padStart(2, "0"), sec = String(PM.left % 60).padStart(2, "0");
    if (time) time.textContent = `${m}:${sec}`;
    if (ring) ring.style.strokeDashoffset = String(327 * (1 - PM.left / PM.dur[PM.mode]));
    document.title = PM.run ? `(${m}:${sec}) AFU Digital Library` : "AFU Digital Library";
  }
  function pmTick() {
    PM.left = Math.max(0, Math.round((PM.end - Date.now()) / 1000));
    if (PM.left <= 0) {
      clearInterval(PM.id); PM.run = false; beep();
      if (PM.mode === "focus") { const d = new Date().toLocaleDateString("sv-SE"); LS.set("afu-pomo", { d, n: pmToday() + 1 }); }
      toast(t(PM.mode === "focus" ? "pm_done_f" : "pm_done_b"));
      PM.mode = PM.mode === "focus" ? "break" : "focus"; PM.left = PM.dur[PM.mode];
      pmDraw(); return;
    }
    pmPaint();
  }
  const pomoHTML = () => `
    <section class="pomo" id="pomo"><div class="pomo-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="pb"/><circle id="pmRing" cx="60" cy="60" r="52" class="pf"/></svg><b id="pmTime">25:00</b></div>
      <div class="pomo-txt"><h2>${ICON.clock}${esc(t("pm_t"))}</h2><p>${esc(t("pm_d"))}</p>
        <div class="seg" role="tablist"><button type="button" data-pm="focus" aria-pressed="true">${esc(t("pm_focus"))} 25</button><button type="button" data-pm="break" aria-pressed="false">${esc(t("pm_break"))} 5</button></div>
        <div class="btns"><button class="btn" id="pmGo" type="button"></button><button class="btn ghost" id="pmReset" type="button">${ICON.redo}${esc(t("pm_reset"))}</button></div>
        <p class="muted" id="pmN"></p></div></section>`;
  function pmDraw() {
    const go = document.getElementById("pmGo"); if (!go) return pmPaint();
    go.innerHTML = (PM.run ? ICON.pause : ICON.play) + esc(t(PM.run ? "pm_pause" : "pm_start"));
    document.querySelectorAll("[data-pm]").forEach(b => b.setAttribute("aria-pressed", b.dataset.pm === PM.mode));
    document.getElementById("pomo")?.classList.toggle("brk", PM.mode === "break");
    const n = document.getElementById("pmN"); if (n) n.textContent = t("pm_today", pmToday());
    pmPaint();
  }
  function bindPomo() {
    const el = document.getElementById("pomo"); if (!el) return;
    document.getElementById("pmGo").onclick = () => {
      if (PM.run) { clearInterval(PM.id); PM.run = false; }
      else { PM.run = true; PM.end = Date.now() + PM.left * 1000; clearInterval(PM.id); PM.id = setInterval(pmTick, 500); }
      pmDraw();
    };
    document.getElementById("pmReset").onclick = () => { clearInterval(PM.id); PM.run = false; PM.left = PM.dur[PM.mode]; pmDraw(); };
    el.querySelectorAll("[data-pm]").forEach(b => (b.onclick = () => { clearInterval(PM.id); PM.run = false; PM.mode = b.dataset.pm; PM.left = PM.dur[PM.mode]; pmDraw(); }));
    pmDraw();
  }

  function home() {
    app.innerHTML = `
      <section class="hero"><div class="wrap hero-in">
        <div class="hero-txt">
          <h1>${esc(t("hero_title"))}</h1>
          <p class="lead">${esc(t("hero_desc"))}</p>
          <label class="search gs">${ICON.search}<input id="gq" type="search" placeholder="${esc(t("gsearch_ph"))}" autocomplete="off"></label>
        </div>
        ${honey()}
      </div></section>
      <section class="wrap" id="gres" aria-live="polite"></section>
      ${countdownHTML()}
      ${stripHTML()}
      <section class="wrap choose">
        <h2 class="sr">${esc(t("choose"))}</h2>
        <div class="grid2">
          <a class="card big" href="/modul"><span class="ico">${ICON.book}</span>
            <h3>${esc(t("modul_t"))}</h3><p>${esc(t("modul_d"))}</p><span class="go">${esc(t("open"))}${ICON.next}</span></a>
          <a class="card big alt" href="/pembahasan"><span class="ico">${ICON.doc}</span>
            <h3>${esc(t("pemb_t"))}</h3><p>${esc(t("pemb_d"))}</p><span class="go">${esc(t("open"))}${ICON.next}</span></a>
        </div>
        ${tryoutBannerHTML()}
        <div id="latest"></div>
        <div id="recent"></div>
        ${promoHTML()}
        ${pomoHTML()}
        <h2 class="how-t">${esc(t("how_t"))}</h2>
        <ol class="steps">
          ${[1, 2, 3].map(n => `<li><b>${n}</b><div><strong>${esc(t("st" + n))}</strong><span>${esc(t("st" + n + "d"))}</span></div></li>`).join("")}
        </ol>
      </section>`;
    stagger(); startCountdown(); fillLatest(); fillStrip(); bindPomo();
    let timer;
    document.getElementById("gq").addEventListener("input", e => { clearTimeout(timer); timer = setTimeout(() => globalSearch(e.target.value), 250); });
  }
  async function fillLatest() {
    if (!AFU.configured) return;
    try {
      const all = await loadAll(), box = document.getElementById("latest");
      if (!box || !all.length) return;
      box.innerHTML = `<h2 class="how-t">${esc(t("latest"))}</h2><div class="grid2">${all.slice(0, 6).map(d =>
        docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`;
      stagger(); fillRecent();
    } catch (e) {}
  }
  async function globalSearch(v) {
    const box = document.getElementById("gres"); if (!box) return;
    v = v.trim().toLowerCase();
    if (v.length < 2) { box.innerHTML = ""; return; }
    if (!AFU.configured) { box.innerHTML = `<p class="notice warn">${esc(t("nocfg"))}</p>`; return; }
    try {
      const all = await loadAll();
      const res = all.filter(d => (d.title + " " + (d.description || "") + " " + (d.category || "")).toLowerCase().includes(v)).slice(0, 12);
      if (!box.isConnected) return;
      box.innerHTML = res.length
        ? `<div class="grid2 gres-list">${res.map(d => docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`
        : `<p class="notice">${esc(t("no_match"))}</p>`;
      stagger();
    } catch (e) { box.innerHTML = `<p class="notice warn">${esc(t("err"))}</p>`; }
  }

  // ---- daftar subtes (rak buku) ----
  async function subtests(type) {
    if (!AFU.configured) return (app.innerHTML = msg(t("nocfg"), "warn"));
    app.innerHTML = msg(t("loading"));
    let docs = [];
    try { docs = await load(TYPES[type]); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(title(type))}</h1><p class="lead sm">${esc(t("pick_sub"))}</p>
        <div class="shelf">${SUB.map((k, i) => {
          const n = docs.filter(d => d.subtest === k).length;
          return `<a class="card book" href="/${type}/${k}" style="--c:var(--b${i + 1})">
            <span class="spine"><b>${ABBR[k]}</b></span>
            <span class="bk"><h3>${esc(t("s_" + k))}</h3><span class="muted">${esc(t("docs_count", n))}</span></span>
            <span class="arrow">${ICON.next}</span></a>`;
        }).join("")}</div>
      </section>`;
    stagger();
  }

  // ---- halaman dokumen: filter kategori, cari, urutkan ----
  async function docsPage(type, sub) {
    if (!AFU.configured) return (app.innerHTML = msg(t("nocfg"), "warn"));
    app.innerHTML = msg(t("loading"));
    let docs;
    try { docs = (await load(TYPES[type])).filter(d => d.subtest === sub); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    const catOf = d => d.category?.trim() || t("uncat");
    const cats = [...new Set(docs.map(catOf))];
    const idx = SUB.indexOf(sub) + 1;
    const st = { cat: "", sort: "new", q: "" };
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="/${type}">${ICON.back}${esc(title(type))}</a>
        <h1 class="sub-h" style="--c:var(--b${idx})"><span class="badge lg">${ABBR[sub]}</span> ${esc(t("s_" + sub))}</h1>
        <p class="sub-d">${esc(t("sd_" + sub))}</p>
        ${docs.length ? `<div class="toolbar">
          <label class="search">${ICON.search}<input id="q" type="search" placeholder="${esc(t("search_ph"))}"></label>
          <label class="sortbox"><span class="sr">${esc(t("sort_label"))}</span><select id="sort"><option value="new">${esc(t("sort_new"))}</option><option value="az">${esc(t("sort_az"))}</option></select></label>
        </div>
        ${cats.length > 1 ? `<div class="chips" id="chips"><button class="chip" type="button" data-cat="" aria-pressed="true">${esc(t("all"))}</button>${cats.map(c => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}</div>` : ""}
        <div id="docs"></div>`
        : `<p class="notice">${esc(t("empty"))}</p><a class="btn" href="${IG_DM}" target="_blank" rel="noopener">${ICON.chat}${esc(t("request"))}</a>`}
      </section>`;
    if (!docs.length) return;
    const box = document.getElementById("docs");
    const draw = () => {
      const v = st.q.toLowerCase();
      let list = docs.filter(d => (!st.cat || catOf(d) === st.cat) && (!v || (d.title + " " + (d.description || "")).toLowerCase().includes(v)));
      if (st.sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title, "id", { numeric: true }));
      if (!list.length) { box.innerHTML = `<p class="notice">${esc(t("no_match"))}</p>`; return; }
      const groups = {};
      list.forEach(d => (groups[catOf(d)] ||= []).push(d));
      box.innerHTML = Object.entries(groups).map(([c, l]) =>
        `<section class="grp"><h2 class="cat">${esc(c)}</h2><div class="grid2">${l.map(d => docCard(d)).join("")}</div></section>`).join("");
      stagger();
    };
    document.getElementById("q").addEventListener("input", e => { st.q = e.target.value.trim(); draw(); });
    document.getElementById("sort").addEventListener("change", e => { st.sort = e.target.value; draw(); });
    document.getElementById("chips")?.addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      st.cat = b.dataset.cat;
      document.querySelectorAll("#chips .chip").forEach(x => x.setAttribute("aria-pressed", x === b));
      draw();
    });
    draw();
  }

  // ---- favorit ----
  async function favPage() {
    if (!AFU.configured) return (app.innerHTML = msg(t("nocfg"), "warn"));
    try { await loadAll(); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    const list = favs().map(id => cache.byId[id]).filter(Boolean);
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(t("fav_t"))}</h1><p class="lead sm">${esc(t("fav_note"))}</p>
        ${list.length ? `<div class="grid2">${list.map(d => docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`
          : `<p class="notice">${esc(t("fav_empty"))}</p>`}
      </section>`;
    stagger();
  }

  // ---- tentang + FAQ ----
  function aboutPage() {
    app.innerHTML = `
      <section class="wrap page narrow-p">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(t("about_t"))}</h1><p class="lead sm">${esc(t("about_p"))}</p>
        <div class="req card"><div><h3>${esc(t("request"))}</h3><p>${esc(t("request_d"))}</p></div>
          <a class="btn" href="${IG_DM}" target="_blank" rel="noopener">${ICON.chat}${esc(t("request"))}</a></div>
        <h2 class="how-t">${esc(t("faq_t"))}</h2>
        <div class="faq">${[1, 2, 3, 4, 5, 6].map(n => `<details><summary>${esc(t("q" + n))}</summary><p>${esc(t("a" + n))}</p></details>`).join("")}</div>
      </section>`;
  }

  // ---- router (tanpa #, pakai History API) ----
  function route() {
    clearInterval(cdTimer);
    const [type, sub] = location.pathname.split("/").filter(Boolean);
    page = type || "";
    window.scrollTo(0, 0);
    window.goatcounter?.count?.({ path: location.pathname });
    document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "/" + (page && (TYPES[page] || page === "favorit" || page === "tentang" || page === "tryout") ? page : "")));
    app.classList.remove("enter"); void app.offsetWidth; app.classList.add("enter");
    updFavN();
    if (page === "favorit") return favPage();
    if (page === "tentang") return aboutPage();
    if (page === "tryout") return AFU.TO.render(sub);
    if (!TYPES[type]) return home();
    if (!SUB.includes(sub)) return subtests(type);
    return docsPage(type, sub);
  }

  // ---- PWA ----
  let installEvt;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; document.getElementById("installBtn").hidden = false; });
  document.getElementById("installBtn").addEventListener("click", async () => {
    if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice; installEvt = null; document.getElementById("installBtn").hidden = true;
  });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));

  AFU.init(() => { renderBanner(); if (AFU.TO.busy()) AFU.TO.repaint(); else route(); });

  // helper untuk file lain (tryout.js, assistant.js)
  window.AFUApp = { ICON, toast, copy, stagger, loadAll, S, IG_DM, esc, get docs() { return cache.all || []; } };
  let lastPath = location.pathname;

  // pindah halaman tanpa reload
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href^='/']");
    if (!a || a.target || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (a.getAttribute("href").startsWith("/admin")) return;
    e.preventDefault();
    if (!AFU.TO.leaving()) return;
    history.pushState(null, "", a.getAttribute("href"));
    lastPath = location.pathname;
    route();
  });
  window.addEventListener("popstate", () => {
    if (!AFU.TO.leaving()) { history.pushState(null, "", lastPath); return; }
    lastPath = location.pathname;
    route();
  });
  // link lama (/#/modul/pu) diarahkan ke bentuk baru
  if (location.hash.startsWith("#/")) history.replaceState(null, "", location.hash.slice(1));

  loadSettings().finally(() => { renderBanner(); route(); });

  // ---- sentuhan UI: progres gulir, tombol ke atas, pintasan "/" ----
  (() => {
    const bar = document.createElement("div"); bar.className = "scrollbar"; bar.setAttribute("aria-hidden", "true");
    const up = document.createElement("button"); up.type = "button"; up.className = "totop"; up.hidden = true; up.innerHTML = ICON.up;
    up.setAttribute("aria-label", t("totop")); up.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.append(bar, up);
    let raf = 0;
    const upd = () => {
      raf = 0;
      const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
      up.hidden = h.scrollTop < 700;
    };
    window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    document.addEventListener("keydown", e => {
      if (e.key !== "/" || e.target.closest("input,textarea,select") || e.metaKey || e.ctrlKey) return;
      const q = document.getElementById("gq"); if (q) { e.preventDefault(); q.focus(); }
    });
  })();
})();

// ---------- v8: aurora latar ikut kursor, kartu miring saat kursor di dalamnya, cahaya aurora di dalam kartu, tombol magnetik ----------
(() => {
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const app = document.getElementById("app");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ===== aurora latar: 4 gumpalan cahaya, diselipkan sebagai latar =====
  const au = document.createElement("div");
  au.className = "aurora"; au.setAttribute("aria-hidden", "true");
  au.innerHTML = "<i></i><i></i><i></i><i></i>";
  document.body.prepend(au);
  document.documentElement.classList.add("has-aurora");
  const blobs = [...au.children], FOLLOW = [.32, .20, .28, .16]; // makin besar = makin jauh ikut kursor
  let ax = 0, ay = 0, tx = 0, ty = 0, auRun = false;
  const auLoop = () => {
    ax += (tx - ax) * .06; ay += (ty - ay) * .06; // gerak halus, ada "ekor"
    blobs.forEach((b, i) => { b.style.translate = `${(ax * FOLLOW[i]).toFixed(1)}px ${(ay * FOLLOW[i]).toFixed(1)}px`; });
    if (Math.abs(tx - ax) > .3 || Math.abs(ty - ay) > .3) requestAnimationFrame(auLoop); else auRun = false;
  };

  // ===== kartu: miring HANYA saat kursor ada di dalam kartu =====
  // DIR = 1  -> sisi kartu yang dekat kursor "menghadap" kursor. Ubah ke -1 kalau mau kebalikannya.
  const DIR = 1;
  // max = sudut miring maksimal (derajat) saat kursor di tepi kartu. Kecilkan angkanya kalau masih terlalu miring.
  const GROUPS = [
    { sel: ".card.big,.card.to-card", max: 6 },        // kartu besar beranda + kartu try out
    { sel: ".card.book", max: 5 },                      // kartu subtes
    { sel: ".card.doc", max: 3.5 },                     // kartu dokumen (lebar, jadi miringnya lebih kecil)
    { sel: ".honey", max: 7, minWidth: 821 }            // 7 heksagon = satu kartu, miring bersama
  ];
  const ALL = GROUPS.map(g => g.sel).join(","), MAG = ".promo-btn,.soc,.ctrl .icon-btn";
  const groupOf = el => GROUPS.find(g => el.matches(g.sel));
  const resetT = el => { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); };
  const resetM = el => { el.style.translate = ""; };
  let px = 0, py = 0, has = false, pRaf = 0, curT = null, curM = null;

  // satu titik kursor -> cari kartu di bawahnya -> miringkan + gerakkan cahaya di dalamnya
  const point = (x, y, target) => {
    const el = target && target.closest ? target.closest(ALL) : null;
    if (curT && curT !== el) resetT(curT); // kursor keluar dari kartu -> kartu kembali lurus
    curT = el;
    if (!el) return;
    const g = groupOf(el);
    if (g.minWidth && innerWidth < g.minWidth) return resetT(el);
    const r = el.getBoundingClientRect();
    const fx = clamp((x - r.left) / r.width, 0, 1), fy = clamp((y - r.top) / r.height, 0, 1); // posisi kursor di dalam kartu, 0..1
    el.style.setProperty("--ry", (DIR * (fx - .5) * 2 * g.max).toFixed(2) + "deg");
    el.style.setProperty("--rx", (-DIR * (fy - .5) * 2 * g.max).toFixed(2) + "deg");
    el.style.setProperty("--mx", (fx * 100).toFixed(1) + "%"); // posisi cahaya aurora di dalam kartu
    el.style.setProperty("--my", (fy * 100).toFixed(1) + "%");
  };
  const sched = target => {
    if (pRaf) return;
    pRaf = requestAnimationFrame(() => { pRaf = 0; if (has) point(px, py, target || document.elementFromPoint(px, py)); });
  };

  if (fine && !reduce) {
    addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX; py = e.clientY; has = true;
      sched(e.target);

      // aurora latar ikut kursor
      tx = px - innerWidth / 2; ty = py - innerHeight / 2;
      if (!auRun) { auRun = true; requestAnimationFrame(auLoop); }

      // tombol magnetik
      const m = e.target.closest && e.target.closest(MAG);
      if (curM && curM !== m) resetM(curM);
      curM = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.translate = `${((px - (r.left + r.width / 2)) * .25).toFixed(1)}px ${((py - (r.top + r.height / 2)) * .25).toFixed(1)}px`;
      }
    }, { passive: true });
    addEventListener("scroll", () => sched(null), { passive: true }); // kartu bergeser saat gulir, hitung ulang
    document.documentElement.addEventListener("mouseleave", () => {
      has = false;
      if (curT) resetT(curT); curT = null;
      if (curM) resetM(curM); curM = null;
    });
  }

  // ===== muncul halus saat digulir + dipasang ulang tiap halaman dirender =====
  let scan = () => {};
  if (!reduce && app && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
    const SEL = ".promo,.count,.how-t,.steps,.faq,.req,.tbanner,.pomo";
    scan = () => app.querySelectorAll(SEL).forEach(el => { if (el.dataset.rv) return; el.dataset.rv = "1"; el.classList.add("reveal"); io.observe(el); });
  }
  if (app) {
    let mRaf = 0;
    new MutationObserver(() => { if (!mRaf) mRaf = requestAnimationFrame(() => { mRaf = 0; scan(); }); }).observe(app, { childList: true, subtree: true });
    scan();
  }
})();
