// Nilai di bawah ini sudah terisi. Key "publishable" aman dipakai di browser.
// JANGAN PERNAH menaruh key secret / service_role di sini.
window.AFU_CONFIG = {
  SUPABASE_URL: "https://yoskcwmmysogshyuhlbn.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_fA3Dgl9yDtPxH5ExsVd2tA_aVNCyeOB",
  BUCKET: "documents",
  GOATCOUNTER: "1khsan",
  // Asisten AI (Gemini lewat Supabase Edge Function). FAQ dijawab dulu di website; fungsi ini hanya dipanggil untuk pertanyaan di luar FAQ. Kosongkan = hanya FAQ.
  AI_ENDPOINT: "https://yoskcwmmysogshyuhlbn.supabase.co/functions/v1/afu-assistant",
}
