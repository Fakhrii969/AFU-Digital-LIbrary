(() => {
  const { t, esc, sb, SUB, ABBR } = AFU;
  const app = document.getElementById("app");
  const TYPES = { modul: "soal", pembahasan: "pembahasan" };
  const IG_DM = "https://ig.me/m/1khsanzz";
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
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
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
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const i = document.createElement("input"); i.value = text; document.body.appendChild(i); i.select(); document.execCommand("copy"); i.remove(); }
    toast(t("copied"));
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
            <a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${ICON.eye}${esc(t("read"))}</a>
            <a class="btn ghost" href="${esc(AFU.url(d.file_path, d.title + ".pdf"))}">${ICON.dl}${esc(t("download"))}</a>
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
    `<a class="hex" href="#/modul/${SUB[i]}" title="${esc(t("s_" + SUB[i]))}" aria-label="${esc(t("s_" + SUB[i]))}" style="left:${x - 55}px;top:${y - 63}px;--c:var(--b${i + 1});--d:${i * 80}ms">${ABBR[SUB[i]]}</a>`).join("")}</div>`;

  // ---- promo "belajar di mana saja" ----
  const promoHTML = () => `
    <section class="promo" aria-labelledby="promoT">
      <div class="promo-art">
        <span class="spark sp1"></span><span class="spark sp2"></span><span class="spark sp3"></span>
        <img src="assets/mascot-study.webp" alt="${esc(t("promo_alt"))}" width="800" height="711" loading="lazy" decoding="async">
      </div>
      <div class="promo-txt">
        <h2 id="promoT">${esc(t("promo_a"))}<br><em>${esc(t("promo_b"))}<span class="swoosh" aria-hidden="true"><svg viewBox="0 0 300 14" preserveAspectRatio="none"><path d="M3 10C70 2 190 1 297 8"/></svg></span></em></h2>
        <p>${esc(t("promo_d"))}</p>
        <a class="btn promo-btn" href="#/modul">${esc(t("promo_btn"))}${ICON.arrow}</a>
      </div>
    </section>`;

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
      <section class="wrap choose">
        <h2 class="sr">${esc(t("choose"))}</h2>
        <div class="grid2">
          <a class="card big" href="#/modul"><span class="ico">${ICON.book}</span>
            <h3>${esc(t("modul_t"))}</h3><p>${esc(t("modul_d"))}</p><span class="go">${esc(t("open"))}${ICON.next}</span></a>
          <a class="card big alt" href="#/pembahasan"><span class="ico">${ICON.doc}</span>
            <h3>${esc(t("pemb_t"))}</h3><p>${esc(t("pemb_d"))}</p><span class="go">${esc(t("open"))}${ICON.next}</span></a>
        </div>
        <div id="latest"></div>
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
      const all = await loadAll(), box = document.getElementById("latest");
      if (!box || !all.length) return;
      box.innerHTML = `<h2 class="how-t">${esc(t("latest"))}</h2><div class="grid2">${all.slice(0, 6).map(d =>
        docCard(d, `${t(d.type === "soal" ? "modul_t" : "pemb_t")} · ${ABBR[d.subtest]}`)).join("")}</div>`;
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
    app.innerHTML = msg(t("loading"));
    let docs = [];
    try { docs = await load(TYPES[type]); } catch (e) { return (app.innerHTML = msg(t("err"), "warn")); }
    app.innerHTML = `
      <section class="wrap page">
        <a class="back" href="#/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(title(type))}</h1><p class="lead sm">${esc(t("pick_sub"))}</p>
        <div class="shelf">${SUB.map((k, i) => {
          const n = docs.filter(d => d.subtest === k).length;
          return `<a class="card book" href="#/${type}/${k}" style="--c:var(--b${i + 1})">
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
        <a class="back" href="#/${type}">${ICON.back}${esc(title(type))}</a>
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
        <a class="back" href="#/">${ICON.back}${esc(t("back"))}</a>
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
        <a class="back" href="#/">${ICON.back}${esc(t("back"))}</a>
        <h1>${esc(t("about_t"))}</h1><p class="lead sm">${esc(t("about_p"))}</p>
        <div class="req card"><div><h3>${esc(t("request"))}</h3><p>${esc(t("request_d"))}</p></div>
          <a class="btn" href="${IG_DM}" target="_blank" rel="noopener">${ICON.chat}${esc(t("request"))}</a></div>
        <h2 class="how-t">${esc(t("faq_t"))}</h2>
        <div class="faq">${[1, 2, 3, 4, 5, 6].map(n => `<details><summary>${esc(t("q" + n))}</summary><p>${esc(t("a" + n))}</p></details>`).join("")}</div>
      </section>`;
  }

  // ---- router ----
  function route() {
    clearInterval(cdTimer);
    const [type, sub] = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    page = type || "";
    window.scrollTo(0, 0);
    window.goatcounter?.count?.({ path: "/" + location.hash.replace(/^#\/?/, "") });
    document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#/" + (page && (TYPES[page] || page === "favorit" || page === "tentang") ? page : "")));
    app.classList.remove("enter"); void app.offsetWidth; app.classList.add("enter");
    updFavN();
    if (page === "favorit") return favPage();
    if (page === "tentang") return aboutPage();
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
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

  AFU.init(() => { renderBanner(); route(); });
  window.addEventListener("hashchange", route);
  loadSettings().finally(() => { renderBanner(); route(); });
})();
