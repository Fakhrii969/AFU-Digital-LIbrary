// Parser format soal try out (dipakai admin). Contoh format ada di admin.html.
(function (root) {
  const SUBS = ["pu", "ppu", "pbm", "pk", "lbi", "lbe", "pm"];
  function parse(text, defSub) {
    const qs = [], errors = [];
    let sub = SUBS.includes(String(defSub || "").toLowerCase()) ? String(defSub).toLowerCase() : null, cur = null, field = null;
    const lines = String(text || "").replace(/\r/g, "").split("\n");
    const flush = () => {
      if (!cur) return;
      const n = cur.num, bad = m => errors.push(`Soal ${n} (${(cur.subtest || "?").toUpperCase()}): ${m}`);
      cur.body = cur.body.trim(); cur.options = cur.options.map(o => o.trim());
      if (!cur.body) bad("teks soal kosong");
      else if (cur.options.length < 2) bad("minimal 2 pilihan (A., B., ...)");
      else if (cur.options.some(o => !o)) bad("ada pilihan kosong");
      else if (cur.answer === null) bad("baris 'Kunci: X' belum ada");
      else if (cur.answer >= cur.options.length) bad("kunci di luar pilihan yang ada");
      else qs.push({ subtest: cur.subtest, body: cur.body, options: cur.options, answer: cur.answer, explanation: (cur.explanation || "").trim() || null, image_url: cur.image || null });
      cur = null; field = null;
    };
    for (const raw of lines) {
      const line = raw.replace(/\s+$/, "");
      const h = line.match(/^[#\[=\s]*([A-Za-z]{2,3})[\]=\s]*$/);
      if (h && SUBS.includes(h[1].toLowerCase()) && /^[#\[=]/.test(line.trim())) { flush(); sub = h[1].toLowerCase(); continue; }
      let m;
      if ((m = line.match(/^\s*(\d{1,3})\s*[.)]\s*(.*)$/)) && (!cur || cur.answer !== null || field === "exp" || !cur.options.length || cur.options.length >= 2)) {
        // nomor baru dianggap soal baru kalau soal sebelumnya sudah punya kunci, atau belum ada soal
        if (!cur || cur.answer !== null || (cur.options.length >= 2 && field !== "body")) {
          flush();
          if (!sub) { errors.push(`Soal ${m[1]}: belum ada penanda subtes (mis. #PU) di atasnya`); cur = { num: m[1], subtest: null, body: "", options: [], answer: null }; field = "body"; cur.skip = true; cur.body = m[2]; continue; }
          cur = { num: m[1], subtest: sub, body: m[2], options: [], answer: null, explanation: "", image: "" }; field = "body"; continue;
        }
      }
      if (!cur) { if (line.trim()) errors.push("Teks di luar soal diabaikan: " + line.trim().slice(0, 40)); continue; }
      if ((m = line.match(/^\s*(?:(?:kunci|key)\s*[:=]?|(?:jawaban|answer)\s*[:=])\s*([A-Ea-e])\b/i))) { cur.answer = "abcde".indexOf(m[1].toLowerCase()); field = null; continue; }
      if ((m = line.match(/^\s*(?:pembahasan|penjelasan|explanation)\s*[:=]\s*(.*)$/i))) { cur.explanation = m[1]; field = "exp"; continue; }
      if ((m = line.match(/^\s*(?:gambar|image|img)\s*[:=]\s*(https:\/\/\S+)/i))) { cur.image = m[1]; field = null; continue; }
      if ((m = line.match(/^\s*([A-Ea-e])\s*[.)]\s*(.*)$/)) && "abcde".indexOf(m[1].toLowerCase()) === cur.options.length && cur.answer === null) {
        cur.options.push(m[2]); field = "opt"; continue;
      }
      if (field === "body") cur.body += "\n" + line;
      else if (field === "opt") cur.options[cur.options.length - 1] += "\n" + line;
      else if (field === "exp") cur.explanation += "\n" + line;
    }
    flush();
    // soal tanpa subtes sudah dicatat sebagai error; buang yang bertanda skip
    return { qs, errors };
  }
  // Format cepat: soal dipisah baris "---", nomor boleh dihilangkan, "#PU" boleh dihilangkan jika subtes dipilih (defSub).
  // Format lama (#PU + nomor 1. 2. 3.) tetap bisa dipakai.
  function parseAny(text, defSub) {
    const t = String(text || "").replace(/\r/g, "");
    if (!/^\s*-{3,}\s*$/m.test(t)) return parse(t, defSub);
    const qs = [], errors = [];
    t.split(/^\s*-{3,}\s*$/m).forEach((blk, i) => {
      if (!blk.trim()) return;
      let b = blk.replace(/^\s*\n/, "");
      const lines = b.split("\n");
      let k = 0; while (k < lines.length && !lines[k].trim()) k++;
      const hasHead = /^\s*[#\[=]\s*[A-Za-z]{2,3}\s*[\]=]?\s*$/.test(lines[k] || "");
      const first = hasHead ? (lines[k + 1] || "") : (lines[k] || "");
      const hasNum = /^\s*\d{1,3}\s*[.)]/.test(first);
      let txt = b;
      if (!hasNum) { const arr = lines.slice(); arr.splice(hasHead ? k + 1 : k, 0, "1. "); txt = arr.join("\n").replace(/^(\s*\d{1,3}\s*[.)])\s*\n/m, "$1 "); }
      const r = parse(txt, defSub);
      r.qs.forEach(q => qs.push(q));
      r.errors.forEach(e => errors.push(hasNum ? e : e.replace(/^Soal \d+/, "Soal ke-" + (i + 1))));
    });
    return { qs, errors };
  }
  root.AFU_parseTO = parseAny;
  if (typeof module !== "undefined") module.exports = parseAny;
})(typeof window !== "undefined" ? window : globalThis);
