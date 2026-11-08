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
    $("login").hidden = !!session; $("panel").hidden = !session;
    if (session) { $("who").textContent = session.user.email; list(); loadSettings(); }
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
