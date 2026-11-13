"use strict";
/* Reach integrations — the sponsor stack, bring-your-own-key.
   Tavily (live research) · ElevenLabs (the voice) · LangSmith
   (the audit trail). Loaded after app.js; everything here is
   progressive enhancement. With no keys connected, Reach behaves
   exactly as it did without this file — every adapter checks for
   its key first and quietly steps aside.

   Key discipline: keys live ONLY in the on-device store
   (store.integrations, the same localStorage entry as the rest of
   Reach), are sent ONLY to their own provider's API, directly from
   this browser, and are never exported, never committed, and never
   routed through any server of ours. Disconnect erases the key;
   Erase-my-data erases everything, keys included.

   Failure discipline: none of the three vendors' docs promise
   browser CORS (see INTEGRATIONS.md), so every call is built to
   fail gracefully — Tavily falls back to the labelled staged
   profile, ElevenLabs to the browser voice, LangSmith is
   fire-and-forget and its failure is invisible. Nothing here ever
   fakes a live result. */

(function () {
  if (typeof store === "undefined" || typeof persist !== "function" || typeof narrate !== "function") return;

  const TAVILY_SEARCH_URL = "https://api.tavily.com/search";
  const ELEVEN_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech/";
  const ELEVEN_MODEL = "eleven_flash_v2_5";
  const ELEVEN_DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"; /* Rachel — a warm premade voice */
  const LANGSMITH_RUNS_URL = "https://api.smith.langchain.com/runs";

  /* ---------------- connection state ---------------- */

  function keys() {
    if (!store.integrations) {
      store.integrations = { tavilyKey: "", elevenKey: "", elevenVoice: "", langsmithKey: "", langsmithProject: "reach" };
    }
    return store.integrations;
  }
  function tavilyConnected() { return !!keys().tavilyKey; }
  function elevenConnected() { return !!keys().elevenKey; }
  function langsmithConnected() { return !!keys().langsmithKey; }
  function voiceId() { return (keys().elevenVoice || "").trim() || ELEVEN_DEFAULT_VOICE; }
  function projectName() { return (keys().langsmithProject || "").trim() || "reach"; }

  /* ---------------- Tavily: live research ----------------
     POST /search, Bearer auth, basic depth = 1 credit. Returns the
     top result as {title, url, content} or null on ANY failure —
     the caller narrates the fallback and labels the staged card. */

  async function tavilySearch(query) {
    const key = keys().tavilyKey;
    if (!key || typeof fetch !== "function") return null;
    try {
      const res = await fetch(TAVILY_SEARCH_URL, {
        method: "POST",
        headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
        body: JSON.stringify({
          query: String(query || ""),
          search_depth: "basic",
          max_results: 3,
          include_answer: false
        })
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      const results = (data && data.results) || [];
      const top = results.find(r => r && r.title);
      if (!top) return null;
      return {
        title: String(top.title).trim(),
        url: String(top.url || "").trim(),
        content: String(top.content || "").trim().slice(0, 320)
      };
    } catch (_) {
      return null;
    }
  }

  /* ---------------- ElevenLabs: the voice ----------------
     POST /v1/text-to-speech/{voice_id}, xi-api-key header, audio
     back as an MP3 blob, played inline through an Audio element.
     Only one line owns the voice at a time: a newer line interrupts
     the current one, the way the browser voice's cancel() does. */

  let elevenSeq = 0;
  let elevenCurrent = null; /* { audio, settle } */

  function settleCurrent(outcome) {
    if (!elevenCurrent) return;
    const cur = elevenCurrent;
    elevenCurrent = null;
    try { cur.audio.pause(); } catch (_) { /* already stopped */ }
    cur.settle(outcome);
  }

  async function fetchElevenBlob(text) {
    const res = await fetch(ELEVEN_TTS_URL + encodeURIComponent(voiceId()), {
      method: "POST",
      headers: { "Accept": "audio/mpeg", "Content-Type": "application/json", "xi-api-key": keys().elevenKey },
      body: JSON.stringify({ text: String(text || "").slice(0, 900), model_id: ELEVEN_MODEL })
    });
    if (!res || !res.ok) throw new Error("elevenlabs http " + (res && res.status));
    return res.blob();
  }

  /* Resolves "played" (line finished), "interrupted" (a newer line
     took the voice), or "failed" (call or playback failed — the
     caller falls back to the browser voice). */
  function playElevenLine(text) {
    const mySeq = ++elevenSeq;
    settleCurrent("interrupted");
    if (typeof fetch !== "function") return Promise.resolve("failed");
    return fetchElevenBlob(text).then(blob => {
      if (mySeq !== elevenSeq) return "interrupted";
      return new Promise(resolve => {
        let url = "";
        try { url = URL.createObjectURL(blob); } catch (_) { resolve("failed"); return; }
        const audio = new Audio(url);
        const settle = outcome => {
          if (elevenCurrent && elevenCurrent.audio === audio) elevenCurrent = null;
          try { URL.revokeObjectURL(url); } catch (_) { /* already gone */ }
          resolve(outcome);
        };
        elevenCurrent = { audio, settle };
        audio.addEventListener("ended", () => settle("played"));
        audio.addEventListener("error", () => settle("failed"));
        try {
          const p = audio.play();
          if (p && typeof p.catch === "function") p.catch(() => settle("failed"));
        } catch (_) {
          settle("failed");
        }
      });
    }).catch(() => (mySeq !== elevenSeq ? "interrupted" : "failed"));
  }

  /* One line, in the ElevenLabs voice. True unless it genuinely
     failed (an interruption counts as handled — the newer line
     owns the voice now). */
  async function speakEleven(text) {
    if (!elevenConnected()) return false;
    const outcome = await playElevenLine(text);
    return outcome !== "failed";
  }

  function speakBrowserLine(text) {
    try {
      if (!("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.03;
      window.speechSynthesis.speak(u);
    } catch (_) { /* the log still carries the line */ }
  }

  /* Listen mode, in the ElevenLabs voice: line by line, in order,
     with the browser voice speaking any line ElevenLabs can't. */
  async function speakSeriesEleven(lines) {
    for (const line of lines) {
      const outcome = await playElevenLine(line);
      if (outcome === "interrupted") return;
      if (outcome === "failed") speakBrowserLine(line);
    }
  }

  /* ---------------- LangSmith: the audit trail ----------------
     One POST /runs per action, a completed run carrying the event
     in its name (reach.draft_created, reach.cap_refusal, …) and
     the metadata in extra.metadata. Dispatched and never awaited:
     a failed trace never blocks, delays, or even visibly touches
     the product. Metadata only — no message text, no contact
     details beyond first names already on screen. */

  function newRunId() {
    try {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    } catch (_) { /* fall through to the manual v4 */ }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function trace(event, meta) {
    const key = keys().langsmithKey;
    if (!key || typeof fetch !== "function") return false;
    try {
      const now = new Date().toISOString();
      const run = {
        id: newRunId(),
        name: "reach." + event,
        run_type: "chain",
        inputs: { event: event },
        outputs: { recorded: true },
        start_time: now,
        end_time: now,
        session_name: projectName(),
        tags: ["reach"],
        extra: { metadata: Object.assign({ app: "reach", surface: "phone-demo" }, meta || {}) }
      };
      const p = fetch(LANGSMITH_RUNS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key },
        body: JSON.stringify(run),
        keepalive: true
      });
      if (p && typeof p.catch === "function") p.catch(() => {});
      return true;
    } catch (_) {
      return false;
    }
  }

  /* ---------------- the panel ---------------- */

  function setStatus(id, text, on) {
    const el = $(id);
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("on", !!on);
  }
  function setMsg(id, text) {
    const el = $(id);
    if (el) el.textContent = text || "";
  }

  function renderPanel() {
    setStatus("#status-tavily", tavilyConnected() ? "Connected" : "Not connected", tavilyConnected());
    setStatus("#status-eleven", elevenConnected() ? "Connected" : "Not connected", elevenConnected());
    setStatus("#status-langsmith", langsmithConnected() ? "Tracing: on (LangSmith)" : "Tracing: off", langsmithConnected());
    const voice = $("#key-eleven-voice");
    if (voice && !voice.value) voice.value = keys().elevenVoice || "";
    const proj = $("#key-langsmith-project");
    if (proj && !proj.value) proj.value = projectName();
  }

  function wireClick(id, fn) {
    const el = $(id);
    if (el) el.addEventListener("click", fn);
  }

  wireClick("#connect-tavily", async () => {
    const input = $("#key-tavily");
    const value = input ? (input.value || "").trim() : "";
    if (!value) { setMsg("#msg-tavily", "Paste your Tavily key first — it starts with tvly-."); return; }
    keys().tavilyKey = value;
    persist();
    renderPanel();
    if (input) input.value = "";
    setMsg("#msg-tavily", "Key saved on this phone. Testing a live search…");
    const hit = await tavilySearch("Reach — never let a warm connection go cold");
    if (hit) {
      setMsg("#msg-tavily", `Connected — the live search answered: “${hit.title}”. The reply flow's research step is live now.`);
      narrate("Tavily is connected — the research step in the reply flow now runs live, and the card says Live · Tavily when it does.", "log-done");
    } else {
      setMsg("#msg-tavily", "Key saved, but the test search didn't answer — wrong key, no network, or the browser blocked the call. Reach will try live each time and fall back to the labelled staged profile; it never fakes a result.");
    }
  });

  wireClick("#disconnect-tavily", () => {
    keys().tavilyKey = "";
    persist();
    renderPanel();
    setMsg("#msg-tavily", "Disconnected — the key is erased from this phone. The research step is back to the labelled staged profile.");
    narrate("Tavily disconnected and its key erased from this phone.");
  });

  wireClick("#connect-eleven", async () => {
    const input = $("#key-eleven");
    const value = input ? (input.value || "").trim() : "";
    const voiceInput = $("#key-eleven-voice");
    if (voiceInput) keys().elevenVoice = (voiceInput.value || "").trim();
    if (!value && !elevenConnected()) { setMsg("#msg-eleven", "Paste your ElevenLabs key first."); persist(); return; }
    if (value) keys().elevenKey = value;
    persist();
    renderPanel();
    if (input) input.value = "";
    setMsg("#msg-eleven", "Key saved on this phone. Testing the voice…");
    const ok = await speakEleven("Reach is connected. This is the ElevenLabs voice — warm, live, and yours to change.");
    if (ok) {
      setMsg("#msg-eleven", "Connected — that was the ElevenLabs voice. Listen mode and read-aloud use it now; the browser voice stays as the instant fallback.");
      narrate("ElevenLabs is connected — Listen mode and read-aloud now speak in that voice, with the browser voice as fallback.", "log-done");
    } else {
      setMsg("#msg-eleven", "Key saved, but the voice test didn't play — wrong key, no network, or the browser blocked the call. Reach will try ElevenLabs first each time and fall back to the browser voice, so nothing ever goes unsaid.");
    }
  });

  wireClick("#disconnect-eleven", () => {
    keys().elevenKey = "";
    settleCurrent("interrupted");
    persist();
    renderPanel();
    setMsg("#msg-eleven", "Disconnected — the key is erased from this phone. Read-aloud is back to the browser voice.");
    narrate("ElevenLabs disconnected and its key erased from this phone.");
  });

  wireClick("#connect-langsmith", () => {
    const input = $("#key-langsmith");
    const value = input ? (input.value || "").trim() : "";
    const projInput = $("#key-langsmith-project");
    if (projInput) keys().langsmithProject = (projInput.value || "").trim() || "reach";
    if (!value && !langsmithConnected()) { setMsg("#msg-langsmith", "Paste your LangSmith key first — it starts with ls-."); persist(); return; }
    if (value) keys().langsmithKey = value;
    persist();
    renderPanel();
    if (input) input.value = "";
    const sent = trace("connection_test", { via: "sponsor-panel" });
    setMsg("#msg-langsmith", sent
      ? `Tracing is on. A test run — reach.connection_test — was dispatched to the “${projectName()}” project. Ingestion is fire-and-forget, so open LangSmith and watch it land; from now on every draft, approval, and refusal is on the record.`
      : "Key saved, but this browser couldn't dispatch the test run. Tracing stays best-effort and never blocks Reach.");
    if (sent) narrate("LangSmith tracing is on — every draft, approval, and refusal Reach makes is now on the record.", "log-done");
  });

  wireClick("#disconnect-langsmith", () => {
    keys().langsmithKey = "";
    persist();
    renderPanel();
    setMsg("#msg-langsmith", "Disconnected — the key is erased from this phone and tracing is off. Runs already sent stay in your LangSmith project.");
    narrate("LangSmith disconnected and its key erased from this phone. Tracing is off.");
  });

  /* Voice ID and project name save as they're edited, key or no key. */
  const voiceField = $("#key-eleven-voice");
  if (voiceField) voiceField.addEventListener("change", () => { keys().elevenVoice = (voiceField.value || "").trim(); persist(); });
  const projField = $("#key-langsmith-project");
  if (projField) projField.addEventListener("change", () => { keys().langsmithProject = (projField.value || "").trim() || "reach"; persist(); renderPanel(); });

  renderPanel();

  window.ReachIntegrations = {
    tavilyConnected,
    elevenConnected,
    langsmithConnected,
    tavilySearch,
    speakEleven,
    speakSeriesEleven,
    trace
  };
})();
