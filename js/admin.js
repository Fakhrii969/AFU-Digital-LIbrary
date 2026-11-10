(() => {
  const { sb, esc, C } = AFU;
  const $ = id => document.getElementById(id);
  const SUBN = { pu: "Penalaran Umum (PU)", ppu: "Pengetahuan dan Pemahaman Umum (PPU)", pbm: "Pemahaman Bacaan dan Menulis (PBM)", pk: "Pengetahuan Kuantitatif (PK)", lbi: "Literasi Bahasa Indonesia", lbe: "Literasi Bahasa Inggris", pm: "Penalaran Matematika (PM)" };
  const MAX = 50 * 1024 * 1024;
  $("subtest").innerHTML = AFU.SUB.map(k => `<option value="${k}">${SUBN[k]}</option>`).join("");
  const say = (el, text, ok) => { el.textContent = text; el.className = "notice " + (ok ? "ok" : "warn"); el.hidden = !text; };
  let editId = null, rows = {};

  if (!AFU.configured) { $("login").hidden = false; say($("loginMsg"), "Isi js/config.js terlebih dahulu.", false); return; }

  async function show() {
    const { data: { session } } = await sb.auth.getSession();
    let isAdm = false;
    if (session) { const r = await sb.rpc("is_admin"); isAdm = !!r.data; }
    $("login").hidden = isAdm; $("panel").hidden = !isAdm;
    if (session && !isAdm) say($("loginMsg"), "Akun " + session.user.email + " bukan admin. Masuk dengan akun admin.", false);
    if (isAdm) { $("who").textContent = session.user.email; list(); loadSettings(); tryouts(); }
  }
  $("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const { error } = await sb.auth.signInWithPassword({ email: $("email").value, password: $("password").value });
    if (error) return say($("loginMsg"), "Login gagal: " + error.message, false);
    say($("loginMsg"), "", true); show();
  });
  $("logout").addEventListener("click", async () => { await sb.auth.signOut(); show(); });

  // ---- pengaturan situs ----
  async function loadSettings() {
    const { data } = await sb.from("site_settings").select("key,value");
    const s = Object.fromEntries((data || []).map(r => [r.key, r.value]));
    $("set_ann").value = s.announcement || "";
    $("set_date").value = (s.utbk_date || "2027-04-21T08:00:00+07:00").slice(0, 16);
    $("set_conf").checked = s.utbk_confirmed === "true";
  }
  $("setForm").addEventListener("submit", async e => {
    e.preventDefault();
    const { error } = await sb.from("site_settings").upsert([
      { key: "announcement", value: $("set_ann").value.trim() },
      { key: "utbk_date", value: $("set_date").value + ":00+07:00" },
      { key: "utbk_confirmed", value: String($("set_conf").checked) }
    ]);
    say($("setMsg"), error ? "Gagal menyimpan: " + error.message + " (sudah menjalankan migrasi-v3.sql?)" : "Pengaturan disimpan. Muat ulang website untuk melihat hasilnya.", !error);
  });

  // ---- mode tambah / edit ----
  function resetForm() {
    editId = null; $("uploadForm").reset();
    $("formTitle").textContent = "Tambah dokumen PDF"; $("uploadBtn").textContent = "Upload";
    $("fileLabel").hidden = false; $("titleHint").hidden = false; $("cancelEdit").hidden = true; $("pairLabel").hidden = true;
  }
  function startEdit(id) {
    const d = rows[id]; if (!d) return;
    editId = id;
    $("type").value = d.type; $("subtest").value = d.subtest; $("category").value = d.category || "";
    $("title").value = d.title; $("desc").value = d.description || "";
    const opts = Object.values(rows).filter(r => r.id !== id && r.type !== d.type && r.subtest === d.subtest);
    $("pair").innerHTML = '<option value="">Tanpa pasangan</option>' + opts.map(r => `<option value="${r.id}">${esc(r.title)}</option>`).join("");
    $("pair").value = d.pair_id && rows[d.pair_id] ? d.pair_id : "";
    $("pairLabel").hidden = false;
    $("formTitle").textContent = "Edit dokumen"; $("uploadBtn").textContent = "Simpan perubahan";
    $("fileLabel").hidden = true; $("titleHint").hidden = true; $("cancelEdit").hidden = false;
    say($("upMsg"), "", true);
    $("formCard").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $("cancelEdit").addEventListener("click", resetForm);

  $("uploadForm").addEventListener("submit", async e => {
    e.preventDefault();
    const type = $("type").value, subtest = $("subtest").value;
    const category = $("category").value.trim() || null, description = $("desc").value.trim() || null, title = $("title").value.trim();
    const btn = $("uploadBtn");

    if (editId) {
      if (!title) return say($("upMsg"), "Judul tidak boleh kosong.", false);
      btn.disabled = true;
      const newPair = $("pair").value || null, old = rows[editId].pair_id || null;
      const r = await sb.from("documents").update({ type, subtest, category, title, description, pair_id: newPair }).eq("id", editId);
      if (r.error) { btn.disabled = false; return say($("upMsg"), "Gagal menyimpan: " + r.error.message + " (sudah menjalankan migrasi-v3.sql?)", false); }
      // jaga hubungan dua arah
      if (old && old !== newPair) await sb.from("documents").update({ pair_id: null }).eq("id", old).eq("pair_id", editId);
      if (newPair) {
        const prev = rows[newPair]?.pair_id;
        if (prev && prev !== editId) await sb.from("documents").update({ pair_id: null }).eq("id", prev);
        await sb.from("documents").update({ pair_id: editId }).eq("id", newPair);
      }
      btn.disabled = false; resetForm(); say($("upMsg"), "Perubahan disimpan.", true); return list();
    }

    const files = [...$("file").files];
    if (!files.length) return say($("upMsg"), "Pilih minimal satu file PDF.", false);
    if (files.some(f => f.type !== "application/pdf")) return say($("upMsg"), "Semua file harus berformat PDF.", false);
    if (files.length === 1 && !title) return say($("upMsg"), "Isi judul dokumen.", false);

    btn.disabled = true; let ok = 0; const failed = [];
    for (const [i, f] of files.entries()) {
      say($("upMsg"), `Mengunggah ${i + 1} dari ${files.length}: ${f.name}`, true);
      if (f.size > MAX) { failed.push(f.name + " (lebih dari 50 MB)"); continue; }
      const docTitle = files.length === 1 ? title : f.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim();
      const safe = f.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const path = `${type}/${subtest}/${Date.now()}-${i}-${safe}`;
      const up = await sb.storage.from(C.BUCKET).upload(path, f, { contentType: "application/pdf" });
      if (up.error) { failed.push(f.name + ": " + up.error.message); continue; }
      const ins = await sb.from("documents").insert({ type, subtest, category, title: docTitle, description, file_path: path, size_bytes: f.size });
      if (ins.error) { await sb.storage.from(C.BUCKET).remove([path]); failed.push(f.name + ": " + ins.error.message); continue; }
      ok++;
    }
    btn.disabled = false;
    if (!failed.length) { resetForm(); say($("upMsg"), `${ok} dokumen berhasil ditambahkan.`, true); }
    else say($("upMsg"), `${ok} berhasil. Gagal: ${failed.join("; ")}`, false);
    list();
  });

  // ---- daftar + ekspor CSV ----
  async function list() {
    const { data, error } = await sb.from("documents").select("*").order("created_at", { ascending: false });
    if (error) return ($("rows").innerHTML = `<p class="notice warn">${esc(error.message)}</p>`);
    rows = Object.fromEntries(data.map(d => [d.id, d]));
    $("cats").innerHTML = [...new Set(data.map(d => d.category).filter(Boolean))].map(c => `<option value="${esc(c)}">`).join("");
    $("rows").innerHTML = data.length ? data.map(d => `
      <div class="row"><div><strong>${esc(d.title)}</strong>
        <div class="muted">${d.type === "soal" ? "Modul Soal" : "Pembahasan"} · ${esc(SUBN[d.subtest])}${d.category ? " · " + esc(d.category) : ""}${d.size_bytes ? " · " + AFU.fmtSize(d.size_bytes) : ""}${d.pair_id && rows[d.pair_id] ? " · berpasangan" : ""}</div></div>
        <div class="row-btns">
          <button class="btn ghost sm edit" data-edit="${d.id}" type="button">Edit</button>
          <button class="btn ghost sm danger" data-del="${d.id}" data-path="${esc(d.file_path)}" type="button">Hapus</button>
        </div></div>`).join("")
      : '<p class="notice">Belum ada dokumen.</p>';
    $("rows").querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => startEdit(b.dataset.edit)));
    $("rows").querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", async () => {
      if (!confirm("Hapus dokumen ini?")) return;
      await sb.storage.from(C.BUCKET).remove([b.dataset.path]);
      await sb.from("documents").delete().eq("id", b.dataset.del);
      if (editId === b.dataset.del) resetForm();
      list();
    }));
  }

  // ---- try out ----
  let toEdit = null, toRows = {}, impTo = null;
  const toSay = (text, ok) => say($("toMsg"), text, ok);
  const impSay = (text, ok) => say($("impMsg"), text, ok);
  const dbHint = " (sudah menjalankan migrasi-v4.sql?)";
  function toReset() { toEdit = null; $("toForm").reset(); $("to_dur").value = 90; $("to_pub").checked = true; $("toSave").textContent = "Buat try out"; $("toCancel").hidden = true; }
  $("toCancel").addEventListener("click", toReset);
  $("toForm").addEventListener("submit", async e => {
    e.preventDefault();
    const row = { title: $("to_title").value.trim(), description: $("to_desc").value.trim() || null, duration_min: +$("to_dur").value || 90, published: $("to_pub").checked };
    if (!row.title) return toSay("Judul tidak boleh kosong.", false);
    const r = toEdit ? await sb.from("tryouts").update(row).eq("id", toEdit) : await sb.from("tryouts").insert(row);
    if (r.error) return toSay("Gagal menyimpan: " + r.error.message + dbHint, false);
    toSay(toEdit ? "Perubahan disimpan." : "Try out dibuat. Klik Tambah soal untuk mengisi soalnya.", true);
    toReset(); tryouts();
  });
  async function tryouts() {
    const { data, error } = await sb.from("tryouts").select("*").order("created_at", { ascending: false });
    if (error) return ($("toRows").innerHTML = `<p class="notice warn">${esc(error.message)}${dbHint}</p>`);
    toRows = Object.fromEntries(data.map(d => [d.id, d]));
    const cnt = {}, att = {};
    const q = await sb.from("tryout_questions").select("tryout_id").limit(5000);
    (q.data || []).forEach(r => (cnt[r.tryout_id] = (cnt[r.tryout_id] || 0) + 1));
    const a = await sb.from("tryout_attempts").select("tryout_id,score").limit(5000);
    (a.data || []).forEach(r => { const o = (att[r.tryout_id] ||= { n: 0, s: 0 }); o.n++; o.s += r.score; });
    $("toRows").innerHTML = data.length ? data.map(d => `
      <div class="row"><div><strong>${esc(d.title)}</strong>
        <div class="muted">${cnt[d.id] || 0} soal · ${d.duration_min} menit · ${d.published ? "Terbit" : "Disembunyikan"}${att[d.id] ? ` · ${att[d.id].n} peserta, rata-rata ${Math.round(att[d.id].s / att[d.id].n)}` : ""}</div></div>
        <div class="row-btns">
          <button class="btn sm" data-addq="${d.id}" type="button">Tambah soal</button>
          <button class="btn ghost sm edit" data-toedit="${d.id}" type="button">Edit</button>
          <button class="btn ghost sm danger" data-todel="${d.id}" type="button">Hapus</button>
        </div></div>`).join("") : '<p class="notice">Belum ada try out.</p>';
  }
  $("toRows").addEventListener("click", async e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.toedit) {
      const d = toRows[b.dataset.toedit]; toEdit = d.id;
      $("to_title").value = d.title; $("to_desc").value = d.description || ""; $("to_dur").value = d.duration_min; $("to_pub").checked = d.published;
      $("toSave").textContent = "Simpan perubahan"; $("toCancel").hidden = false; $("toCard").scrollIntoView({ behavior: "smooth" });
    } else if (b.dataset.todel) {
      if (!confirm("Hapus try out ini beserta semua soal dan hasil pesertanya?")) return;
      const r = await sb.from("tryouts").delete().eq("id", b.dataset.todel);
      if (r.error) return toSay("Gagal menghapus: " + r.error.message, false);
      if (impTo === b.dataset.todel) $("impBox").hidden = true;
      tryouts();
    } else if (b.dataset.addq) {
      impTo = b.dataset.addq; $("impTitle").textContent = "Tambah soal: " + toRows[impTo].title;
      $("impBox").hidden = false; impSay("", true); $("impBox").scrollIntoView({ behavior: "smooth" }); qList();
    }
  });
  $("impClose").addEventListener("click", () => ($("impBox").hidden = true));
  function impParse() {
    const r = AFU_parseTO($("impText").value, $("impSub").value);
    const by = {}; r.qs.forEach(x => (by[x.subtest] = (by[x.subtest] || 0) + 1));
    const sum = Object.entries(by).map(([k, v]) => k.toUpperCase() + " " + v).join(", ") || "-";
    return { r, sum };
  }
  $("impCheck").addEventListener("click", () => {
    const { r, sum } = impParse();
    impSay(`Terbaca ${r.qs.length} soal (${sum}).` + (r.errors.length ? " Perbaiki: " + r.errors.slice(0, 6).join("; ") : " Format sudah benar."), !r.errors.length && r.qs.length > 0);
  });
  $("impSave").addEventListener("click", async () => {
    if (!impTo) return;
    const { r } = impParse();
    if (r.errors.length) return impSay("Perbaiki dulu: " + r.errors.slice(0, 6).join("; "), false);
    if (!r.qs.length) return impSay("Belum ada soal yang terbaca.", false);
    const btn = $("impSave"); btn.disabled = true;
    const last = await sb.from("tryout_questions").select("position").eq("tryout_id", impTo).order("position", { ascending: false }).limit(1);
    let base = (last.data?.[0]?.position ?? -1) + 1, ok = 0;
    for (let i = 0; i < r.qs.length; i += 50) {
      const chunk = r.qs.slice(i, i + 50).map((x, j) => ({ ...x, tryout_id: impTo, position: base + i + j }));
      const ins = await sb.from("tryout_questions").insert(chunk);
      if (ins.error) { btn.disabled = false; return impSay(`${ok} soal tersimpan, lalu gagal: ${ins.error.message}`, false); }
      ok += chunk.length;
    }
    btn.disabled = false; $("impText").value = ""; impSay(`${ok} soal berhasil disimpan.`, true); qList(); tryouts();
  });
  // ---- form input satu soal ----
  const fqSay = (text, ok) => say($("fqMsg"), text, ok);
  let fqUrl = "";
  async function uploadImg(f) {
    if (f.size > 5 * 1024 * 1024) throw new Error("Gambar lebih dari 5 MB.");
    const path = `${impTo || "umum"}/${Date.now()}-${f.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-")}`;
    const up = await sb.storage.from("tryout-img").upload(path, f, { contentType: f.type });
    if (up.error) throw new Error("Gagal mengunggah: " + up.error.message + dbHint);
    return sb.storage.from("tryout-img").getPublicUrl(path).data.publicUrl;
  }
  function fqReset() {
    ["fqBody", "fqA", "fqB", "fqC", "fqD", "fqE", "fqExp"].forEach(i => ($(i).value = ""));
    $("fqKey").value = ""; $("fqImg").value = ""; fqUrl = ""; $("fqPrev").hidden = true; $("fqPrevImg").removeAttribute("src");
  }
  $("fqImg").addEventListener("change", async e => {
    const f = e.target.files[0]; if (!f) return;
    fqSay("Mengunggah foto...", true);
    try {
      fqUrl = await uploadImg(f);
      $("fqPrevImg").src = fqUrl; $("fqPrev").hidden = false; fqSay("Foto terunggah.", true);
    } catch (err) { fqUrl = ""; e.target.value = ""; fqSay(err.message, false); }
  });
  $("fqImgDel").addEventListener("click", () => { fqUrl = ""; $("fqImg").value = ""; $("fqPrev").hidden = true; $("fqPrevImg").removeAttribute("src"); fqSay("Foto dihapus dari soal ini.", true); });
  $("fqClear").addEventListener("click", () => { fqReset(); fqSay("", true); });
  $("fqSave").addEventListener("click", async () => {
    if (!impTo) return;
    const sub = $("impSub").value, body = $("fqBody").value.trim();
    const opts = ["fqA", "fqB", "fqC", "fqD", "fqE"].map(i => $(i).value.trim());
    let n = opts.findIndex(o => !o); if (n < 0) n = 5;
    if (!sub) return fqSay("Pilih subtes dulu (kotak paling atas).", false);
    if (!body) return fqSay("Soal belum diisi.", false);
    if (n < 2) return fqSay("Isi minimal pilihan A dan B.", false);
    if (opts.slice(n).some(o => o)) return fqSay("Isi pilihan secara berurutan, jangan ada yang dikosongkan di tengah.", false);
    const key = $("fqKey").value;
    if (key === "") return fqSay("Pilih kunci jawabannya.", false);
    if (+key >= n) return fqSay("Kunci menunjuk ke pilihan yang kosong.", false);
    const btn = $("fqSave"); btn.disabled = true;
    const last = await sb.from("tryout_questions").select("position").eq("tryout_id", impTo).order("position", { ascending: false }).limit(1);
    const row = { tryout_id: impTo, subtest: sub, position: (last.data?.[0]?.position ?? -1) + 1, body, options: opts.slice(0, n), answer: +key, explanation: $("fqExp").value.trim() || null, image_url: fqUrl || null };
    const ins = await sb.from("tryout_questions").insert(row);
    btn.disabled = false;
    if (ins.error) return fqSay("Gagal menyimpan: " + ins.error.message + dbHint, false);
    fqReset(); fqSay("Soal tersimpan. Silakan isi soal berikutnya.", true); $("fqBody").focus(); qList(); tryouts();
  });
  $("impImg").addEventListener("change", async e => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 5 * 1024 * 1024) { e.target.value = ""; return impSay("Gambar lebih dari 5 MB.", false); }
    impSay("Mengunggah gambar...", true);
    const path = `${impTo || "umum"}/${Date.now()}-${f.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-")}`;
    const up = await sb.storage.from("tryout-img").upload(path, f, { contentType: f.type });
    e.target.value = "";
    if (up.error) return impSay("Gagal mengunggah: " + up.error.message + dbHint, false);
    const url = sb.storage.from("tryout-img").getPublicUrl(path).data.publicUrl;
    const ta = $("impText"), pos = ta.selectionStart ?? ta.value.length;
    ta.value = ta.value.slice(0, pos) + (pos && ta.value[pos - 1] !== "\n" ? "\n" : "") + "Gambar: " + url + "\n" + ta.value.slice(pos);
    impSay("Gambar diunggah dan barisnya disisipkan.", true);
  });
  async function qList() {
    const { data, error } = await sb.rpc("admin_questions", { p_tryout: impTo });
    if (error) return ($("qRows").innerHTML = `<p class="notice warn">${esc(error.message)}</p>`);
    $("qRows").innerHTML = data.length ? data.map(d => `<div class="row"><div><strong>${esc(d.subtest.toUpperCase())}</strong> <span class="muted">${esc(d.body.slice(0, 90))} · kunci ${"ABCDE"[d.answer]}</span></div>
      <button class="btn ghost sm danger" data-qdel="${d.id}" type="button">Hapus</button></div>`).join("") : '<p class="muted">Belum ada soal.</p>';
  }
  $("qRows").addEventListener("click", async e => {
    const b = e.target.closest("[data-qdel]"); if (!b || !confirm("Hapus soal ini?")) return;
    await sb.from("tryout_questions").delete().eq("id", b.dataset.qdel); qList(); tryouts();
  });
  $("csvBtn").addEventListener("click", () => {
    const cols = ["type", "subtest", "category", "title", "description", "size_bytes", "created_at", "file_path"];
    const q = v => '"' + String(v ?? "").replace(/"/g, '""') + '"';
    const lines = [cols.join(","), ...Object.values(rows).map(d => [...cols.map(c => q(d[c])), q(AFU.url(d.file_path))].join(","))];
    lines[0] += ",public_url";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    a.download = "afu-dokumen-" + new Date().toISOString().slice(0, 10) + ".csv"; a.click(); URL.revokeObjectURL(a.href);
  });
  show();
})();
