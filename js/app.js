(() => {
  const { t, esc, sb, SUB, ABBR } = AFU;
  const app = document.getElementById("app");
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
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.3 1.2.9 1.9 1.7 2.2C10.3 8.3 10.5 5.5 12 3z"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M21 3L10 14M21 3l-6.5 18-3.5-7.5L3.5 10z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg>',
    tt: '<svg viewBox="0 0 24 24"><path d="M14 3.5v10.2a3.7 3.7 0 1 1-3.7-3.7"/><path d="M14 3.5c.3 2.6 2 4.4 4.7 4.6"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.4-4A8 8 0 1 1 20 11.5z"/><path d="M9.2 8.8c.3 2.6 2.6 4.8 5.6 5.5l1.3-1.3-1.9-1.1-1 .7a4.6 4.6 0 0 1-2-2l.7-1-1.1-1.9z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7.5l8.5 6 8.5-6"/></svg>'
  };
  const cache = {};
  let cdTimer, page = "";

  // ---- v6: penanda selesai, streak, hitungan buka, skeleton, bagikan ----
  const ls = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const dones = () => ls("afu-done", []);
  const isDone = id => dones().includes(id);
  const tagOf = d => `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`;
  const dayStr = ms => new Date(ms).toLocaleDateString("sv-SE");
  const streakNow = () => { const s = ls("afu-streak", { n: 0, last: "" }); return s.last === dayStr(Date.now()) || s.last === dayStr(Date.now() - 864e5) ? s.n : 0; };
  const streakHTML = () => { const n = streakNow(); return `<div class="streak${n ? " on" : ""}" id="streak">${ICON.flame}<span>${esc(n ? t("streak_days", n) : t("streak_start"))}</span></div>`; };
  function streakBump() {
    const s = ls("afu-streak", { n: 0, last: "" }), td = dayStr(Date.now());
    if (s.last === td) return;
    s.n = s.last === dayStr(Date.now() - 864e5) ? s.n + 1 : 1; s.last = td; lsSet("afu-streak", s);
    const el = document.getElementById("streak");
    if (el) { el.outerHTML = streakHTML(); document.getElementById("streak")?.classList.add("bump"); }
    toast(t("streak_days", s.n));
  }
  const skel = (n = 6) => `<div class="wrap page"><div class="sk skel-h"></div><div class="grid2">${Array(n).fill(`<div class="card skel"><span class="sk sk-pdf"></span><div class="sk-lines"><i class="sk"></i><i class="sk"></i><i class="sk" style="width:55%"></i></div></div>`).join("")}</div></div>`;
  const progOf = list => { const n = list.filter(d => isDone(d.id)).length; return { n, p: list.length ? Math.round(n / list.length * 100) : 0 }; };
  const progHTML = list => { const { n, p } = progOf(list); return `<div class="prog" id="prog"><div class="prog-bar"><i style="width:${p}%"></i></div><span>${esc(t("prog_txt", n, list.length))}</span></div>`; };
  function updProg() {
    const el = document.getElementById("prog"); if (!el || !cache.cur) return;
    const { n, p } = progOf(cache.cur);
    el.querySelector("i").style.width = p + "%"; el.querySelector("span").textContent = t("prog_txt", n, cache.cur.length);
  }
  function toggleDone(btn) {
    const id = btn.dataset.done; let a = dones(); const on = !a.includes(id);
    a = on ? [...a, id] : a.filter(x => x !== id); lsSet("afu-done", a);
    document.querySelectorAll(`[data-done="${id}"]`).forEach(b => {
      b.setAttribute("aria-pressed", on); b.querySelector("span").textContent = t(on ? "done" : "mark_done");
      b.closest(".doc")?.classList.toggle("is-done", on);
    });
    if (on) streakBump();
    updProg();
    if (on && cache.cur && cache.cur.some(d => d.id === id) && cache.cur.every(d => isDone(d.id))) { toast(t("all_done")); AFU.confetti?.(); }
  }
  function hit(id) {
    const d = cache.byId?.[id]; if (!d || !AFU.configured) return;
    let seen = []; try { seen = JSON.parse(sessionStorage.getItem("afu-hit")) || []; } catch (e) {}
    if (seen.includes(id)) return;
    seen.push(id); try { sessionStorage.setItem("afu-hit", JSON.stringify(seen)); } catch (e) {}
    d.hits = (d.hits || 0) + 1;
    try { sb.rpc("inc_hit", { doc: id }).then(() => {}, () => {}); } catch (e) {}
  }
  async function share(id) {
    const d = cache.byId?.[id]; if (!d) return;
    const link = location.origin + "/" + (d.type === "soal" ? "modul" : "pembahasan") + "/" + d.subtest;
    const text = t("share_msg") + d.title;
    if (navigator.share) { try { await navigator.share({ title: d.title, text, url: link }); return; } catch (e) { if (e.name === "AbortError") return; } }
    window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + link), "_blank", "noopener");
  }
  function countUp(el, n) {
    if (!el) return;
    if (n < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = n; return; }
    const t0 = performance.now();
    (function f(now) { const p = Math.min(1, (now - t0) / 900); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  const statsHTML = () => `<div class="stats"><div class="stat"><b id="stDocs">0</b><span>${esc(t("stat_docs"))}</span></div><div class="stat"><b>7</b><span>${esc(t("stat_sub"))}</span></div><div class="stat"><b>100%</b><span>${esc(t("stat_free"))}</span></div></div>`;

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
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const i = document.createElement("input"); i.value = text; document.body.appendChild(i); i.select(); document.execCommand("copy"); i.remove(); }
    toast(t("copied"));
  }
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-copy]"); if (c) return copy(c.dataset.copy);
    const h = e.target.closest("[data-hit]"); if (h) { hit(h.dataset.hit); streakBump(); }
    const sh = e.target.closest("[data-share]"); if (sh) return share(sh.dataset.share);
    const dn = e.target.closest("[data-done]"); if (dn) return toggleDone(dn);
    const f = e.target.closest("[data-fav]"); if (!f) return;
    const id = f.dataset.fav; let a = favs(); const on = !a.includes(id);
    a = on ? [...a, id] : a.filter(x => x !== id); saveFavs(a);
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => { b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", t(on ? "fav_rm" : "fav_add")); });
    updFavN();
    if (page === "favorit" && !on) setTimeout(favPage, 250);
  });

  // ---- kartu dokumen ----
  function docCard(d, tag) {
    const loc = AFU.lang === "id" ? "id-ID" : "en-US";
    const date = new Date(d.created_at).toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" });
    const meta = [AFU.fmtSize(d.size_bytes), t("added") + " " + date, d.hits > 0 ? t("hits_txt", d.hits) : ""].filter(Boolean).join(" · ");
    const url = AFU.url(d.file_path);
    const partner = d.pair_id && cache.byId?.[d.pair_id];
    const on = favs().includes(d.id), dn = isDone(d.id);
    return `
      <article class="card doc${dn ? " is-done" : ""}" data-q="${esc((d.title + " " + (d.description || "")).toLowerCase())}">
        <button class="fav" type="button" data-fav="${esc(d.id)}" aria-pressed="${on}" aria-label="${esc(t(on ? "fav_rm" : "fav_add"))}">${ICON.star}</button>
        <span class="pdf">${ICON.doc}<small>PDF</small></span>
        <div class="doc-b">
          ${tag ? `<span class="tag">${esc(tag)}</span>` : ""}
          <h3>${esc(d.title)}${isNew(d) ? `<span class="new">${esc(t("new_badge"))}</span>` : ""}</h3>
          ${d.description ? `<p>${esc(d.description)}</p>` : ""}
          <span class="muted">${esc(meta)}</span>
          <div class="btns">
            <a class="btn" data-hit="${esc(d.id)}" href="${esc(url)}" target="_blank" rel="noopener">${ICON.eye}${esc(t("read"))}</a>
            <a class="btn ghost" data-hit="${esc(d.id)}" href="${esc(AFU.url(d.file_path, d.title + ".pdf"))}">${ICON.dl}${esc(t("download"))}</a>
            <button class="btn ghost sm" type="button" data-copy="${esc(url)}">${ICON.copy}${esc(t("copy"))}</button>
            <button class="btn ghost sm" type="button" data-share="${esc(d.id)}">${ICON.share}${esc(t("share"))}</button>
            <button class="btn ghost sm done-btn" type="button" data-done="${esc(d.id)}" aria-pressed="${dn}">${ICON.check}<span>${esc(t(dn ? "done" : "mark_done"))}</span></button>
            ${partner ? `<a class="btn ghost sm" data-hit="${esc(partner.id)}" href="${esc(AFU.url(partner.file_path))}" target="_blank" rel="noopener">${ICON.link}${esc(t(d.type === "soal" ? "see_pemb" : "see_soal"))}</a>` : ""}
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

  function home() {
    app.innerHTML = `
      <section class="hero"><div class="wrap hero-in">
        <div class="hero-txt">
          <h1>${esc(t("hero_title"))}</h1>
          <p class="lead">${esc(t("hero_desc"))}</p>
          <label class="search gs">${ICON.search}<input id="gq" type="search" placeholder="${esc(t("gsearch_ph"))}" autocomplete="off"></label>
          ${streakHTML()}${statsHTML()}
        </div>
        ${honey()}
      </div></section>
      <section class="wrap" id="gres" aria-live="polite"></section>
      ${countdownHTML()}
      <section class="wrap choose">
        <h2 class="sr">${esc(t("choose"))}</h2>
        <div class="grid2">
          <a class="card big" href="/modul"><span class="ico">${ICON.book}</span>
            <h3>${esc(t("modul_t"))}</h3><p>${esc(t("modul_d"))}</p><span class="go">${esc(t("open"))}${ICON.next}</span></a>
          <a class="card big alt" href="/pembahasan"><span class="ico">${ICON.doc}</span>
            <h3>${esc(t("pemb_t"))}</h3><p>${esc(t("pemb_d"))}</p><span class="go">${esc(t("open"))}${ICON.next}</span></a>
        </div>
        <div id="popular"></div><div id="latest"></div>
        ${promoHTML()}
        <h2 class="how-t">${esc(t("how_t"))}</h2>
        <ol class="steps">
          ${[1, 2, 3].map(n => `<li><b>${n}</b><div><strong>${esc(t("st" + n))}</strong><span>${esc(t("st" + n + "d"))}</span></div></li>`).join("")}
        </ol>
      </section>`;
    stagger(); startCountdown(); fillLatest();
    let timer;
    document.getElementById("gq").addEventListener("input", e => { clearTimeout(timer); timer = setTimeout(() => globalSearch(e.target.value), 250); });
  }
  async function fillLatest() {
    if (!AFU.configured) return;
    try {
      const all = await loadAll();
      countUp(document.getElementById("stDocs"), all.length);
      const pbox = document.getElementById("popular");
      const pop = [...all].filter(d => d.hits > 0).sort((a, b) => b.hits - a.hits).slice(0, 4);
      if (pbox && pop.length >= 2) pbox.innerHTML = `<h2 class="how-t">${esc(t("popular"))}</h2><div class="grid2">${pop.map(d => docCard(d, tagOf(d))).join("")}</div>`;
      const box = document.getElementById("latest");
      if (box && all.length) box.innerHTML = `<h2 class="how-t">${esc(t("latest"))}</h2><div class="grid2">${all.slice(0, 6).map(d => docCard(d, tagOf(d))).join("")}</div>`;
      stagger();
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
    app.innerHTML = skel();
    let docs = [];
    try { docs = await load(TYPES[type]); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(title(type))}</h1><p class="lead sm">${esc(t("pick_sub"))}</p>
        <div class="shelf">${SUB.map((k, i) => {
          const n = docs.filter(d => d.subtest === k).length;
          const dn = docs.filter(d => d.subtest === k && isDone(d.id)).length, pc = n ? Math.round(dn / n * 100) : 0;
          return `<a class="card book" href="/${type}/${k}" style="--c:var(--b${i + 1})">
            <span class="spine"><b>${ABBR[k]}</b></span>
            <span class="bk"><h3>${esc(t("s_" + k))}</h3><span class="muted">${esc(t("docs_count", n))}</span></span>
            ${n ? `<span class="ring" style="--p:${pc}" title="${esc(t("prog_txt", dn, n))}"><b>${pc}%</b></span>` : ""}
            <span class="arrow">${ICON.next}</span></a>`;
        }).join("")}</div>
      </section>`;
    stagger();
  }

  // ---- halaman dokumen: filter kategori, cari, urutkan ----
  async function docsPage(type, sub) {
    if (!AFU.configured) return (app.innerHTML = msg(t("nocfg"), "warn"));
    app.innerHTML = skel();
    let docs;
    try { docs = (await load(TYPES[type])).filter(d => d.subtest === sub); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    cache.cur = docs;
    const catOf = d => d.category?.trim() || t("uncat");
    const cats = [...new Set(docs.map(catOf))];
    const idx = SUB.indexOf(sub) + 1;
    const st = { cat: "", sort: "new", q: "" };
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="/${type}">${ICON.back}${esc(title(type))}</a>
        <h1 class="sub-h" style="--c:var(--b${idx})"><span class="badge lg">${ABBR[sub]}</span> ${esc(t("s_" + sub))}</h1>
        <p class="sub-d">${esc(t("sd_" + sub))}</p>
        ${docs.length ? progHTML(docs) : ""}
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
        ${reqFormHTML()}
        <h2 class="how-t">${esc(t("faq_t"))}</h2>
        <div class="faq">${[1, 2, 3, 4, 5, 6].map(n => `<details><summary>${esc(t("q" + n))}</summary><p>${esc(t("a" + n))}</p></details>`).join("")}</div>
      </section>`;
  }

  // ---- form permintaan materi ----
  const reqFormHTML = () => `
    <section class="card form req-f" id="reqCard">
      <h2>${esc(t("req_t"))}</h2>
      <form id="reqForm" novalidate>
        <label>${esc(t("req_sub"))}<select id="rq_sub"><option value="">${esc(t("req_any"))}</option>${SUB.map(k => `<option value="${k}">${ABBR[k]} · ${esc(t("s_" + k))}</option>`).join("")}</select></label>
        <label>${esc(t("req_msg"))}<textarea id="rq_msg" rows="3" maxlength="500" placeholder="${esc(t("req_msg_ph"))}"></textarea></label>
        <label>${esc(t("req_contact"))}<input id="rq_ct" maxlength="120" autocomplete="off"></label>
        <input id="rq_hp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0">
        <button class="btn" type="submit">${ICON.send}${esc(t("req_send"))}</button>
      </form>
      <p id="rq_note" class="notice" hidden></p>
    </section>`;
  function bindReq() {
    const f = document.getElementById("reqForm"); if (!f) return;
    const note = (txt, ok) => { const n = document.getElementById("rq_note"); n.textContent = txt; n.className = "notice " + (ok ? "ok" : "warn"); n.hidden = !txt; };
    f.addEventListener("submit", async e => {
      e.preventDefault();
      if (document.getElementById("rq_hp").value) return;
      const message = document.getElementById("rq_msg").value.trim();
      if (message.length < 5) return note(t("req_short"), false);
      if (Date.now() - (+localStorage.getItem("afu-req") || 0) < 60000) return note(t("req_wait"), false);
      if (!AFU.configured) return note(t("nocfg"), false);
      const btn = f.querySelector("button"); btn.disabled = true;
      const { error } = await sb.from("requests").insert({ subtest: document.getElementById("rq_sub").value || null, message, contact: document.getElementById("rq_ct").value.trim() || null });
      btn.disabled = false;
      if (error) return note(t("req_err"), false);
      try { localStorage.setItem("afu-req", String(Date.now())); } catch (e) {}
      f.reset(); note(t("req_ok"), true); AFU.confetti?.();
    });
  }

  // ---- privasi, kontak, 404 ----
  function legalPage() {
    app.innerHTML = `
      <section class="wrap page narrow-p legal">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(t("pv_t"))}</h1><p class="muted">${esc(t("pv_updated"))}</p>
        ${[1, 2, 3, 4, 5, 6].map(n => `<h2>${esc(t("pv_h" + n))}</h2><p>${esc(t("pv_p" + n))}</p>`).join("")}
      </section>`;
  }
  const CH = [["ig", "https://www.instagram.com/afu.digital.library/", "@AFU.Digital.Library", "f_c_ig"], ["tt", "https://www.tiktok.com/@afu.digital.library", "AFU Digital Library", "f_c_tt"], ["wa", "https://wa.me/6282225013782", "0822-2501-3782", "f_c_wa"], ["mail", "mailto:afudigitallibrary@gmail.com", "afudigitallibrary@gmail.com", "f_c_em"]];
  function contactPage() {
    app.innerHTML = `
      <section class="wrap page narrow-p">
        <a class="back" href="/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(t("ct_t"))}</h1><p class="lead sm">${esc(t("ct_d"))}</p>
        <div class="ctl">${CH.map(([ic, href, name, sub]) => `<a class="card ctrow" href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}><span class="ico">${ICON[ic]}</span><span><b>${esc(name)}</b><small>${esc(t(sub))}</small></span></a>`).join("")}</div>
        <p class="muted">${esc(t("ct_note"))}</p>
        <a class="btn" href="/tentang">${ICON.send}${esc(t("req_t"))}</a>
      </section>`;
    stagger();
  }
  function notFound() {
    app.innerHTML = `<section class="wrap page"><h1>404</h1><p class="lead sm">${esc(t("nf_d"))}</p><a class="btn" href="/">${ICON.back}${esc(t("back"))}</a></section>`;
  }

  // ---- SEO: judul, deskripsi, canonical per halaman ----
  function setTag(sel, attr, val, make) {
    let el = document.querySelector(sel);
    if (!el && make) { el = make(); document.head.appendChild(el); }
    if (el) el.setAttribute(attr, val);
  }
  const INFO = { favorit: ["nav_fav", "fav_note"], tentang: ["about_t", "about_p"], privasi: ["pv_t", "pv_p1"], kontak: ["ct_t", "ct_d"] };
  function seo(type, sub) {
    const site = "AFU Digital Library";
    let ti = t("seo_home_t"), de = t("seo_home_d"), path = "/", known = true;
    if (TYPES[type]) {
      const base = t(type === "modul" ? "modul_t" : "pemb_t");
      path = "/" + type; ti = base + " UTBK | " + site; de = t(type === "modul" ? "seo_modul_d" : "seo_pemb_d");
      if (SUB.includes(sub)) { path += "/" + sub; ti = `${base} ${t("s_" + sub)} (${ABBR[sub]}) UTBK | ${site}`; de = t("sd_" + sub); }
    } else if (INFO[type]) { path = "/" + type; ti = t(INFO[type][0]) + " | " + site; de = t(INFO[type][1]); }
    else if (type) known = false;
    const url = (AFU.C.SITE_URL || location.origin).replace(/\/$/, "") + (known ? path : "/");
    document.title = known ? ti : "404 | " + site;
    setTag('meta[name="description"]', "content", de, () => Object.assign(document.createElement("meta"), { name: "description" }));
    setTag('link[rel="canonical"]', "href", url, () => Object.assign(document.createElement("link"), { rel: "canonical" }));
    setTag('meta[property="og:title"]', "content", ti);
    setTag('meta[property="og:description"]', "content", de);
    setTag('meta[property="og:url"]', "content", url);
    setTag('meta[name="robots"]', "content", known ? "index,follow,max-image-preview:large" : "noindex", () => Object.assign(document.createElement("meta"), { name: "robots" }));
  }

  // ---- router (tanpa #, pakai History API) ----
  function route() {
    clearInterval(cdTimer);
    const [type, sub] = location.pathname.split("/").filter(Boolean);
    page = type || "";
    cache.cur = null;
    seo(type, sub);
    window.scrollTo(0, 0);
    window.goatcounter?.count?.({ path: location.pathname });
    document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "/" + (page && (TYPES[page] || page === "favorit" || page === "tentang") ? page : "")));
    app.classList.remove("enter"); void app.offsetWidth; app.classList.add("enter");
    updFavN();
    if (page === "favorit") return favPage();
    if (page === "tentang") { aboutPage(); bindReq(); return; }
    if (page === "privasi") return legalPage();
    if (page === "kontak") return contactPage();
    if (page && !TYPES[type]) return notFound();
    if (!TYPES[type]) return home();
    if (!SUB.includes(sub)) return subtests(type);
    return docsPage(type, sub);
  }

  // pindah halaman dengan transisi halus (kalau browser mendukung)
  function go(href) {
    const run = () => { history.pushState(null, "", href); return route(); };
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(run);
    else run();
  }

  // ---- PWA ----
  let installEvt;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; document.getElementById("installBtn").hidden = false; });
  document.getElementById("installBtn").addEventListener("click", async () => {
    if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice; installEvt = null; document.getElementById("installBtn").hidden = true;
  });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));

  AFU.init(() => { renderBanner(); route(); });
  Object.assign(AFU, { go, loadAll, hit, cache }); // dipakai extra.js

  // pindah halaman tanpa reload
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href^='/']");
    if (!a || a.target || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (a.getAttribute("href").startsWith("/admin")) return;
    e.preventDefault();
    go(a.getAttribute("href"));
  });
  window.addEventListener("popstate", route);
  // link lama (/#/modul/pu) diarahkan ke bentuk baru
  if (location.hash.startsWith("#/")) history.replaceState(null, "", location.hash.slice(1));

  loadSettings().finally(() => { renderBanner(); route(); });
})();

// AFU v6: efek tambahan (kartu 3D, command palette, konfeti, transisi tema, maskot interaktif)
// Dimuat SETELAH app.js. Semua efek hormati pengaturan "kurangi gerak" bila perlu.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const t = (...a) => AFU.t(...a);

  // ---------- bar progres scroll ----------
  const sp = document.createElement("div");
  sp.id = "sp"; sp.setAttribute("aria-hidden", "true"); document.body.appendChild(sp);
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    sp.style.setProperty("--p", max > 0 ? (h.scrollTop / max).toFixed(4) : 0);
  };
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();

  // ---------- konfeti ----------
  AFU.confetti = (x, y) => {
    if (reduce) return;
    const c = document.createElement("canvas"); c.id = "confetti";
    const W = (c.width = innerWidth), H = (c.height = innerHeight), ctx = c.getContext("2d");
    document.body.appendChild(c);
    const cols = ["#7ba7ff", "#8fe3cf", "#ffb8a8", "#ffe29a", "#c5b4ff", "#ff9ec4"];
    const ox = x ?? W / 2, oy = y ?? H * 0.35;
    const ps = Array.from({ length: 120 }, () => ({ x: ox, y: oy, vx: (Math.random() - .5) * 14, vy: Math.random() * -12 - 3, w: 6 + Math.random() * 6, h: 4 + Math.random() * 5, r: Math.random() * 6.28, vr: (Math.random() - .5) * .4, c: cols[(Math.random() * cols.length) | 0] }));
    let f = 0;
    (function step() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      if (++f < 150) requestAnimationFrame(step); else c.remove();
    })();
  };

  // ---------- kartu 3D, tombol magnetik, heksagon ikut kursor ----------
  const TILT = ".card.big,.card.book,.card.doc", MAG = ".promo-btn,.soc,.ctrl .icon-btn";
  let curT = null, curM = null;
  const resetT = el => { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); };
  const resetM = el => { el.style.translate = ""; };
  if (fine && !reduce) {
    addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const c = e.target.closest?.(TILT);
      if (curT && curT !== c) resetT(curT);
      curT = c;
      if (c) {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height, max = c.classList.contains("doc") ? 4 : 8;
        c.style.setProperty("--rx", ((.5 - y) * max).toFixed(2) + "deg");
        c.style.setProperty("--ry", ((x - .5) * max).toFixed(2) + "deg");
        c.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        c.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      }
      const m = e.target.closest?.(MAG);
      if (curM && curM !== m) resetM(curM);
      curM = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.translate = `${((e.clientX - (r.left + r.width / 2)) * .25).toFixed(1)}px ${((e.clientY - (r.top + r.height / 2)) * .25).toFixed(1)}px`;
      }
      const h = $(".honey");
      if (h && innerWidth > 820) {
        h.style.setProperty("--hx", ((e.clientX / innerWidth - .5) * 14).toFixed(2) + "deg");
        h.style.setProperty("--hy", (-(e.clientY / innerHeight - .5) * 10).toFixed(2) + "deg");
      }
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => { if (curT) resetT(curT); if (curM) resetM(curM); curT = curM = null; });
  }

  // ---------- muncul saat di-scroll ----------
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
    const SEL = ".promo,.count,.how-t,.steps,.faq,.req,.req-f,.stats,.ctl,.legal h2";
    const mark = root => { if (root.nodeType !== 1) return; const list = root.matches(SEL) ? [root] : []; list.push(...root.querySelectorAll(SEL)); list.forEach(el => { if (!el.classList.contains("rv")) { el.classList.add("rv"); io.observe(el); } }); };
    const app = document.getElementById("app");
    if (app) {
      new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(mark))).observe(app, { childList: true, subtree: true });
      mark(app);
    }
  }

  // ---------- maskot interaktif ----------
  let mc = 0, mt, bub;
  document.addEventListener("click", e => {
    const m = e.target.closest(".mascot"); if (!m) return;
    m.classList.remove("wig"); void m.offsetWidth; m.classList.add("wig");
    mc++; clearTimeout(mt); mt = setTimeout(() => (mc = 0), 1500);
    const r = m.getBoundingClientRect(), egg = mc >= 5;
    bub?.remove(); bub = document.createElement("div"); bub.className = "bubble"; bub.setAttribute("role", "status");
    bub.textContent = egg ? t("mascot_egg") : t("mascot_" + (1 + ((Math.random() * 4) | 0)));
    bub.style.right = innerWidth - r.left + 8 + "px"; bub.style.top = r.top + r.height * .2 + "px";
    document.body.appendChild(bub); const b = bub; setTimeout(() => b.remove(), 2400);
    if (egg) { AFU.confetti(r.left + r.width / 2, r.top + r.height / 2); mc = 0; }
  });

  // ---------- ganti tema dengan efek lingkaran melebar ----------
  document.addEventListener("click", e => {
    const b = e.target.closest("#themeBtn"); if (!b || !document.startViewTransition || reduce) return;
    e.stopImmediatePropagation(); e.preventDefault();
    const r = b.getBoundingClientRect(), x = e.detail ? e.clientX : r.left + r.width / 2, y = e.detail ? e.clientY : r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)), root = document.documentElement;
    root.classList.add("vt-theme");
    const tr = document.startViewTransition(() => {
      const n = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = n; try { localStorage.setItem("afu-theme", n); } catch (er) {}
    });
    tr.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] }, { duration: 650, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" })).catch(() => {});
    tr.finished.finally(() => root.classList.remove("vt-theme"));
  }, true);

  // ---------- command palette (Ctrl+K atau /) ----------
  let box, input, list, items = [], sel = 0, docs = null, prevFocus = null;
  const SVG = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  const norm = s => String(s || "").toLowerCase();
  function build() {
    box = document.createElement("div"); box.id = "cmd"; box.hidden = true;
    box.innerHTML = `<div class="cmd-box" role="dialog" aria-modal="true"><div class="cmd-in">${SVG}<input type="text" autocomplete="off" spellcheck="false" aria-label="Search"><kbd>Esc</kbd></div><ul class="cmd-list" role="listbox"></ul><div class="cmd-hint"></div></div>`;
    document.body.appendChild(box);
    input = $("input", box); list = $(".cmd-list", box);
    input.addEventListener("input", () => { sel = 0; render(); });
    box.addEventListener("mousedown", e => { if (e.target === box) close(); });
    list.addEventListener("click", e => { const li = e.target.closest("[data-i]"); if (li) run(items[+li.dataset.i]); });
    list.addEventListener("mousemove", e => { const li = e.target.closest("[data-i]"); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; paint(); } });
    box.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(items.length, 1); paint(true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + items.length) % Math.max(items.length, 1); paint(true); }
      else if (e.key === "Enter") { e.preventDefault(); if (items[sel]) run(items[sel]); }
      else if (e.key === "Tab") e.preventDefault();
    });
  }
  function source() {
    const pages = [["nav_home", "/"], ["modul_t", "/modul"], ["pemb_t", "/pembahasan"], ["nav_fav", "/favorit"], ["nav_about", "/tentang"], ["ct_t", "/kontak"], ["pv_t", "/privasi"]]
      .map(([k, go]) => ({ g: "cmd_pages", label: t(k), go }));
    const subs = ["modul", "pembahasan"].flatMap(ty => AFU.SUB.map(s => ({ g: "cmd_pages", label: `${t(ty === "modul" ? "modul_t" : "pemb_t")} · ${AFU.ABBR[s]}`, sub: t("s_" + s), go: `/${ty}/${s}` })));
    const acts = [{ g: "cmd_acts", label: t("cmd_theme"), run: () => $("#themeBtn")?.click() }, { g: "cmd_acts", label: t("lang"), run: () => $("#langBtn")?.click() }];
    return { pages, subs, acts };
  }
  function render() {
    const q = norm(input.value).trim(), toks = q.split(/\s+/).filter(Boolean), { pages, subs, acts } = source();
    const hit = o => toks.every(k => norm(o.label + " " + (o.sub || "")).includes(k));
    let out = [];
    if (!q) out = [...pages, ...acts];
    else {
      out = [...pages.filter(hit), ...subs.filter(hit), ...acts.filter(hit)].slice(0, 8);
      if (docs && q.length >= 2) out.push(...docs.filter(d => toks.every(k => norm(d.title + " " + (d.description || "") + " " + (d.category || "")).includes(k))).slice(0, 6)
        .map(d => ({ g: "cmd_docs", label: d.title, sub: `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${AFU.ABBR[d.subtest]}`, doc: d })));
    }
    items = out;
    if (sel >= items.length) sel = 0;
    let html = "", last = "";
    items.forEach((it, i) => {
      if (it.g !== last) { html += `<li class="cmd-g" role="presentation">${AFU.esc(t(it.g))}</li>`; last = it.g; }
      html += `<li class="cmd-it" role="option" data-i="${i}"><span>${AFU.esc(it.label)}</span>${it.sub ? `<small>${AFU.esc(it.sub)}</small>` : ""}</li>`;
    });
    list.innerHTML = html || `<li class="cmd-empty">${AFU.esc(t("cmd_empty"))}</li>`;
    paint();
  }
  function paint(scroll) {
    list.querySelectorAll("[data-i]").forEach(li => { const on = +li.dataset.i === sel; li.setAttribute("aria-selected", on); if (on && scroll) li.scrollIntoView({ block: "nearest" }); });
  }
  function run(it) {
    if (!it) return;
    close();
    if (it.go) AFU.go(it.go);
    else if (it.doc) { AFU.hit?.(it.doc.id); window.open(AFU.url(it.doc.file_path), "_blank", "noopener"); }
    else if (it.run) it.run();
  }
  function open() {
    if (!box) build();
    prevFocus = document.activeElement;
    $(".cmd-hint", box).textContent = t("cmd_hint");
    input.placeholder = t("cmd_ph"); input.value = ""; sel = 0; box.hidden = false; render(); input.focus();
    if (!docs && AFU.configured) AFU.loadAll().then(a => { docs = a; if (!box.hidden) render(); }).catch(() => {});
  }
  function close() { if (!box || box.hidden) return; box.hidden = true; prevFocus?.focus?.(); }
  document.addEventListener("keydown", e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); box && !box.hidden ? close() : open(); }
    else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); open(); }
  });
  document.addEventListener("click", e => { if (e.target.closest("#cmdBtn")) open(); });
})();
