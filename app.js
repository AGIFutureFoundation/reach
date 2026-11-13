"use strict";
/* Reach v2.1 — accessibility-first phone agent (demo).
   v2 promise: never let a warm connection go cold. Every person and
   organisation in the seeded data below is fictional. The agent reads
   the stage's real DOM, acts on real elements, and never sends anything
   without a human approving the exact text first. Anything you add —
   profile, people, saved drafts — stays in this browser's local
   storage, on this phone only. */

/* ---------------- demo data (all fictional) ---------------- */

const state = {
  activeView: "messages",
  activeThreadId: null,
  busy: false,
  sentCount: 0,
  threads: [
    {
      id: "t-maya", name: "Maya Chen", org: "Harborlight Studio", unread: true,
      messages: [
        { from: "them", text: "Hi! Harborlight is hosting a repair café next month and we'd love your workshop crew involved.", time: "Tue 09:12" },
        { from: "them", text: "Is there a short session you could run for first-timers? Happy to work around your schedule.", time: "Tue 09:13" }
      ],
      draft: "Hi Maya — thanks for thinking of us. Yes: we can run a 45-minute first-timers' session at the repair café. People bring a broken small appliance and leave with it diagnosed, plus a plan to fix it. Send me the date you're leaning toward and I'll confirm the crew this week.",
      profile: "Harborlight Studio — a community workshop space that runs a monthly repair café, drawing 40–60 neighbours a session. Known for first-timer-friendly teaching and a bring-one-fix-one format."
    },
    {
      id: "t-devon", name: "Devon Park", org: "North Pier Books", unread: true,
      messages: [
        { from: "me", text: "The reading list for the winter window is nearly ready — two titles to go.", time: "Mon 16:40" },
        { from: "them", text: "Thanks! Could you send the two titles you mentioned for our winter window display?", time: "Mon 17:02" }
      ],
      draft: "Hi Devon — of course. For the window: “The Repair Café Handbook” for the practical shelf, and “A Field Guide to City Birds” for the glass — both hold up well with younger readers. Want me to drop off the display cards when they're printed?",
      profile: "North Pier Books — an independent bookshop whose winter window display weekend is its busiest footfall of the season; the display pairs a practical title with a nature title."
    },
    {
      id: "t-ruth", name: "Ruth Callahan", org: "Fernhill Community Hall", unread: false,
      messages: [
        { from: "them", text: "The hall is booked for your Saturday session — keys are with Ana at the front desk.", time: "Fri 11:20" },
        { from: "me", text: "Perfect, thank you Ruth. We'll leave the room as we found it.", time: "Fri 11:34" }
      ],
      draft: ""
    }
  ],
  queue: [
    {
      id: "q-sam", name: "Sam Okafor", org: "Bayview Tool Library", suppressed: false,
      fit: "Sam posted in the neighbourhood forum that members keep asking to reserve tools ahead — exactly the one-page booking sheet your crew already uses.",
      draft: "Hi Sam — I saw your forum post about members wanting to reserve tools ahead. We use a one-page reserve sheet for exactly that; two lending libraries nearby run on it now. Open to a 15-minute look next week? No pitch — just the working page, and you can keep it either way.",
      status: "waiting"
    },
    {
      id: "q-lee", name: "Lee Hoffmann", org: "Canal Street Print Co.", suppressed: true,
      suppressReason: "Asked not to be contacted again (October 2026). On the programme's do-not-contact list.",
      fit: "", draft: "", status: "suppressed"
    },
    {
      id: "q-ana", name: "Ana Ruiz", org: "Mission Night Market", suppressed: false,
      fit: "Ana coordinates 40+ market vendors and told the traders' association that no-show stall fees are eating the market's margin.",
      draft: "Hi Ana — a fellow vendor coordinator mentioned no-show stall fees are eating the night market's margin. A two-tap stall confirmation the week before cut no-shows sharply at a similar market. Worth a short call to see whether it fits how your vendors already work?",
      status: "waiting", move: "follow-up"
    },
    {
      id: "q-priya", name: "Priya Nair", org: "Fernhill Writing Circle", suppressed: false, move: "thank",
      fit: "Priya read the whole workshop handout draft last month and sent back two pages of notes that made it clearer — she never got a proper thank-you.",
      draft: "",
      status: "waiting"
    },
    {
      id: "q-jordan", name: "Jordan Ellis", org: "South Bay Repair Crew", suppressed: false, move: "reconnect",
      fit: "Jordan ran the spring fix-it session alongside your crew and you have not spoken since — the kind of warm connection that quietly goes cold.",
      draft: "",
      status: "waiting"
    }
  ],
  approvals: [], /* {id, kind: 'reply'|'outreach'|'studio', refId, toName, org, text} */
  saved: [] /* drafts saved for later (persisted) */
};

let approvalSeq = 0;

/* ---------------- local store: profile, your people, saved drafts, the day ----------------
   Everything here lives in this browser's localStorage, on this device
   only. No account, no server, no external request. If storage is
   unavailable (private mode, blocked), Reach runs on in-memory state. */

const LS_KEY = "reach.v2";
const LS_VERSION = 3;

/* Sponsor-stack connections (v2.2): the user's own API keys for
   Tavily, ElevenLabs and LangSmith, stored in this same on-device
   store under `integrations` — additive field, no schema bump, so
   v2/v3 stores migrate forward untouched. Keys are sent only to
   their own provider's API, are never exported, and are erased with
   everything else by the Erase control. Empty = not connected, and
   Reach behaves exactly as it did before the stack existed. */
const DEFAULT_INTEGRATIONS = {
  tavilyKey: "", elevenKey: "", elevenVoice: "", langsmithKey: "", langsmithProject: "reach",
  phoneuseOk: false /* v2.3: PhoneUse detection is a boolean — there is no key */
};

const DEFAULT_PROFILE = {
  name: "", role: "", tone: "Warm", signoff: "", intention: "Keep in touch with people who matter",
  textSize: "100"
};

function dateKey(d) {
  d = d || new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function freshDay() { return { date: dateKey(), touches: 0, kinds: [], mailbox: 0, cold: 0 }; }

/* v2.3 additive fields, same trick as `integrations`: refusal
   counters for the impact panel, and the Judge mode flag. No schema
   bump — older stores take the defaults and migrate untouched. The
   refusal counters start when this version lands, and the panel
   says so; they are never back-filled or estimated. */
const DEFAULT_STATS = { suppression: 0, cap: 0 };

function loadStore() {
  const blank = { version: LS_VERSION, profile: { ...DEFAULT_PROFILE }, people: [], saved: [], day: freshDay(), nudges: [], history: [], integrations: { ...DEFAULT_INTEGRATIONS }, stats: { ...DEFAULT_STATS }, judgeMode: false };
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return blank;
    const parsed = JSON.parse(raw);
    /* v2 stores migrate forward: profile, people, saved drafts and
       history survive; the new fields take their defaults. */
    if (!parsed || (parsed.version !== 2 && parsed.version !== LS_VERSION)) return blank;
    const out = {
      version: LS_VERSION,
      profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
      people: Array.isArray(parsed.people) ? parsed.people : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      day: parsed.day && parsed.day.date === dateKey() ? { ...freshDay(), ...parsed.day, date: dateKey() } : freshDay(),
      nudges: Array.isArray(parsed.nudges) ? parsed.nudges : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      integrations: { ...DEFAULT_INTEGRATIONS, ...(parsed.integrations || {}) },
      stats: { ...DEFAULT_STATS, ...((parsed.stats && typeof parsed.stats === "object") ? parsed.stats : {}) },
      judgeMode: !!parsed.judgeMode
    };
    return out;
  } catch (_) {
    return blank;
  }
}

function bumpStat(kind) {
  if (!store.stats) store.stats = { ...DEFAULT_STATS };
  store.stats[kind] = (store.stats[kind] || 0) + 1;
  persist();
}

const store = loadStore();
let storageOK = true;

function persist() {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(store));
  } catch (_) {
    storageOK = false;
  }
}

/* Your people join the queue alongside the seeded demo people; user
   entries are never overwritten by seeds. */
store.people.forEach(p => {
  if (!state.queue.some(q => q.id === p.id)) state.queue.push(p);
});
state.saved = store.saved.slice();

function persistPeople() {
  store.people = state.queue.filter(q => q.user);
  persist();
}
function persistSaved() {
  store.saved = state.saved.slice();
  persist();
}

/* A "touch" is a completed connection: an approved staged send, or a
   draft you copied/shared out to a real app. Counted per calendar day. */
function recordTouch(kind, name) {
  ensureToday();
  store.day.touches += 1;
  if (!store.day.kinds.includes(kind)) store.day.kinds.push(kind);
  store.history.push({ date: store.day.date, kind, name: name || "" });
  if (store.history.length > 200) store.history = store.history.slice(-200);
  persist();
  renderToday();
}

/* ---------------- real counters: the programme caps as state ----------------
   DESIGN §7, made real in v2.1: every staged send counts against the
   mailbox's 90/day cap; queue and studio sends also count against the
   ≤250/day cold cap. The counters live in the day state, persist with
   it, reset with the calendar day, and refuse the send at the cap. */

const MAILBOX_CAP = 90;
const COLD_CAP = 250;

function ensureToday() {
  if (store.day.date !== dateKey()) store.day = freshDay();
  return store.day;
}

function sendCounts() {
  const d = ensureToday();
  return { mailbox: d.mailbox || 0, cold: d.cold || 0 };
}

function recordSend(cold) {
  const d = ensureToday();
  d.mailbox = (d.mailbox || 0) + 1;
  if (cold) d.cold = (d.cold || 0) + 1;
  persist();
  renderToday();
  return sendCounts();
}

/* Provenance travels with every item (DESIGN §2): one line saying
   where this person came from, on the queue card and the approval. */
function provenanceOf(q) {
  if (!q) return "";
  if (q.user) return q.imported ? "Source: imported by you · context on record" : "Source: added by you · context on record";
  return "Seed demo data";
}

/* Sponsor-stack tracing (LangSmith): every consequential action —
   a draft, an approval, a refusal — can be put on the record.
   integrations.js supplies the transport when the user connects a
   key; without one this is a no-op. Fire-and-forget by design:
   tracing is a witness, never a gate, and it carries metadata only
   (event, kind, first name already on screen, counters) — never
   message text, never contact details. */
function traceEvent(event, meta) {
  try {
    const ig = window.ReachIntegrations;
    if (ig && ig.trace) ig.trace(event, meta || {});
  } catch (_) { /* the audit trail must never break the product */ }
}

function firstName(full) { return (full || "").trim().split(/\s+/)[0] || "there"; }

function capitalise(s) {
  s = (s || "").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/* ---------------- follow-ups: nudges you scheduled ----------------
   After a send, copy, or share, Reach offers one gentle thing: a
   nudge in 3, 7, or 30 days. Nudges persist on the phone and surface
   on Today when due — no notifications, no nagging, just the row. */

let pendingNudge = null;

function addDaysKey(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

function fmtDay(key) {
  const parts = String(key).split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function offerNudge(info) {
  pendingNudge = info;
  renderNudgeOffer();
}

function renderNudgeOffer() {
  const box = $("#nudge-offer");
  if (!box) return;
  if (!pendingNudge) { box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  box.innerHTML = `
    <p class="nudge-offer-text">Follow up with <strong>${escapeHtml(pendingNudge.name)}</strong> so this one doesn't go cold?</p>
    <div class="nudge-offer-actions">
      <button type="button" class="mini-btn" data-nudge-days="3">Nudge in 3 days</button>
      <button type="button" class="mini-btn" data-nudge-days="7">Nudge in 7 days</button>
      <button type="button" class="mini-btn" data-nudge-days="30">Nudge in 30 days</button>
      <button type="button" class="mini-btn" data-nudge-days="0">No thanks</button>
    </div>`;
  $$("[data-nudge-days]", box).forEach(b => b.addEventListener("click", () => {
    const days = Number(b.dataset.nudgeDays);
    const info = pendingNudge;
    pendingNudge = null;
    renderNudgeOffer();
    if (!info) return;
    if (days === 0) { narrate(`No nudge for ${info.name} — the queue is there whenever you're ready.`); return; }
    const nudge = { id: "n-" + Date.now().toString(36), personId: info.personId, name: info.name, org: info.org, fit: info.fit || "", due: addDaysKey(days) };
    store.nudges.push(nudge);
    persist();
    renderToday();
    narrate(`Nudge set — ${info.name} will surface on Today on ${fmtDay(nudge.due)}. Stored on this phone only.`, "log-done");
  }));
}

function dueNudges() {
  const today = dateKey();
  return (store.nudges || []).filter(n => n.due <= today);
}

async function draftNudge(id) {
  const n = (store.nudges || []).find(x => x.id === id);
  if (!n) return;
  store.nudges = store.nudges.filter(x => x.id !== id);
  persist();
  const personLike = { name: n.name, org: n.org, fit: n.fit || "" };
  const text = generateDraft(personLike, "follow-up");
  addApproval("studio", n.personId, n.name, n.org, text, "follow-up", "Nudge you scheduled · from your follow-ups");
  switchView("approvals");
  renderToday();
  narrate(`Here's the follow-up for ${n.name} — drafted from what's on record. Approve it, copy it, or save it for later.`, "log-done");
}

/* ---------------- draft studio generator ----------------
   Builds a draft ONLY from the facts on record for the person (their
   context/fit note) plus your profile (tone, sign-off). Anything Reach
   does not know becomes a [bracketed prompt] for you — never an
   invented detail. */

const MOVE_LABELS = {
  "reply": "Reply", "follow-up": "Follow up", "thank": "Thank",
  "invite": "Invite", "introduce": "Introduce", "reconnect": "Reconnect"
};

function generateDraft(person, move) {
  const first = firstName(person.name);
  const ctx = capitalise(person.fit || "");
  const ctxSentence = ctx ? (ctx.endsWith(".") ? ctx : ctx + ".") : "";
  const prof = store.profile;
  const tone = prof.tone || "Warm";
  const sign = prof.signoff ? `\n\n${prof.signoff}` : "";
  let open = `Hi ${first} —`;
  if (tone === "Direct") open = `Hi ${first},`;
  if (tone === "Playful") open = `Hi ${first} — small message, real intent:`;
  let body = "";
  switch (move) {
    case "thank":
      body = `${open} I wanted to say a proper thank-you. ${ctxSentence} It genuinely made a difference. [Add the specific moment it helped, if you want to.]${sign}`;
      break;
    case "reconnect":
      body = `${open} it's been a while, and you came back to mind. ${ctxSentence} How have you been? [Add one line about what's new with you.]${sign}`;
      break;
    case "invite":
      body = `${open} I'd love to invite you to [the event or thing — and when]. ${ctxSentence} You were the first person I thought of. No pressure at all if the timing's wrong.${sign}`;
      break;
    case "introduce":
      body = `${open} I'd like to connect you with [someone's name — a person in your world who should know ${first}]. ${ctxSentence} I think you'd get on well. Happy for me to make the introduction?${sign}`;
      break;
    case "reply":
      body = `${open} thanks for getting back to me. ${ctxSentence} [Your answer to their last point goes here.]${sign}`;
      break;
    default: /* follow-up */
      body = `${open} circling back while it's fresh. ${ctxSentence} [Where did you leave it? One line.] Still glad to help if it's useful.${sign}`;
      break;
  }
  if (tone === "Direct") body = body.replace("I wanted to say a proper thank-you.", "Thank you.").replace("it's been a while, and you came back to mind.", "it's been a while.");
  return body;
}

/* ---------------- helpers ---------------- */

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function wait(ms) { return new Promise(r => setTimeout(r, REDUCED ? Math.min(ms, 60) : ms)); }

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------- narration + speech out ---------------- */

const logEl = $("#action-log");
const speakToggle = $("#speak-toggle");
let forceSpeak = false; /* reserved: series speech is handled by speakSeries */
let narrateSilent = false; /* Listen mode logs lines without speaking each one */

function speakBrowser(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.03;
  window.speechSynthesis.speak(u);
}

function speak(text, force) {
  if (!force && !forceSpeak && !speakToggle.checked) return;
  /* Sponsor stack: when the user has connected ElevenLabs, that is
     the voice. Any failure falls back to the browser voice, so the
     line is always spoken by something. */
  const ig = window.ReachIntegrations;
  if (ig && ig.elevenConnected()) {
    ig.speakEleven(text).then(ok => { if (!ok) speakBrowser(text); });
    return;
  }
  speakBrowser(text);
}

/* Speak a whole series (Listen mode): cancel once, then let the
   utterances queue so the day reads aloud in order. With ElevenLabs
   connected, the series plays in that voice instead, line by line,
   with the browser voice as the per-line fallback. */
function speakSeries(lines) {
  const ig = window.ReachIntegrations;
  if (ig && ig.elevenConnected()) {
    ig.speakSeriesEleven(lines);
    return true;
  }
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  lines.forEach(text => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.03;
    window.speechSynthesis.speak(u);
  });
  return true;
}

function tick() {
  try { if (navigator.vibrate) navigator.vibrate(10); } catch (_) { /* optional */ }
}

function narrate(text, cls) {
  const li = document.createElement("li");
  if (cls) li.className = cls;
  li.textContent = text;
  logEl.appendChild(li);
  while (logEl.children.length > 60) logEl.removeChild(logEl.firstChild);
  logEl.scrollTop = logEl.scrollHeight;
  if (!narrateSilent) speak(text);
}

function narrateUser(text) {
  const li = document.createElement("li");
  li.className = "log-user";
  li.textContent = "You: " + text;
  logEl.appendChild(li);
  logEl.scrollTop = logEl.scrollHeight;
}

/* Show where the agent is acting, then let it act. */
async function agentTouch(el, narration) {
  if (narration) narrate(narration);
  if (el) {
    el.classList.add("agent-focus");
    el.scrollIntoView({ block: "nearest", behavior: REDUCED ? "auto" : "smooth" });
    await wait(750);
    el.classList.remove("agent-focus");
  } else {
    await wait(300);
  }
}

async function typeInto(textarea, text) {
  textarea.focus();
  if (REDUCED) {
    textarea.value = text;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(120);
    return;
  }
  textarea.value = "";
  const step = 3;
  for (let i = 0; i <= text.length; i += step) {
    textarea.value = text.slice(0, i);
    textarea.scrollTop = textarea.scrollHeight;
    await new Promise(r => setTimeout(r, 14));
  }
  textarea.value = text;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/* ---------------- rendering ---------------- */

const VIEW_TITLES = { today: "Today", messages: "Messages", thread: "Conversation", queue: "Outreach Queue", approvals: "Approvals" };

function switchView(name) {
  state.activeView = name;
  ["today", "messages", "thread", "queue", "approvals"].forEach(v => {
    $("#view-" + v).hidden = v !== name;
  });
  const tabName = name === "thread" ? "messages" : name;
  $$(".tab").forEach(t => t.setAttribute("aria-pressed", String(t.dataset.view === tabName)));
  $("#stage-app-title").textContent = VIEW_TITLES[name];
  $("#stage-screen").scrollTop = 0;
}

function updateBadges() {
  const unread = state.threads.filter(t => t.unread).length;
  const bm = $("#badge-messages");
  bm.hidden = unread === 0;
  bm.textContent = unread;
  const ba = $("#badge-approvals");
  ba.hidden = state.approvals.length === 0;
  ba.textContent = state.approvals.length;
}

/* ---------------- Today: the daily habit ---------------- */

function nextAction() {
  if (state.approvals.length > 0) {
    return { kind: "approvals", label: `Decide on ${state.approvals.length} waiting draft${state.approvals.length === 1 ? "" : "s"}`,
      sub: "Your decision is the only step left — one tap or one word." };
  }
  const unread = state.threads.find(t => t.unread);
  if (unread) {
    return { kind: "reply", label: `Reply to ${unread.name}`,
      sub: `${unread.org} is waiting. Reach reads it, drafts, you approve.` };
  }
  const dueN = dueNudges()[0];
  if (dueN) {
    return { kind: "nudge", refId: dueN.id, label: `Follow up with ${dueN.name}`,
      sub: "A nudge you scheduled is due. One draft, from what's on record." };
  }
  const waiting = state.queue.find(q => !q.suppressed && q.status === "waiting" && q.fit);
  if (waiting) {
    return { kind: "draft", refId: waiting.id, label: `${MOVE_LABELS[waiting.move] || "Reach out"} — ${waiting.name}`,
      sub: `One draft, from what's on record about ${firstName(waiting.name)}. Nothing sends without you.` };
  }
  const thank = state.queue.find(q => !q.suppressed && q.move === "thank" && q.status !== "sent" && q.status !== "skipped");
  if (thank && !store.day.kinds.includes("thank")) {
    return { kind: "draft", refId: thank.id, label: `Thank ${thank.name}`, sub: "A thank-you is the cheapest warmth there is." };
  }
  const recon = state.queue.find(q => !q.suppressed && q.move === "reconnect" && q.status !== "sent" && q.status !== "skipped");
  if (recon && !store.day.kinds.includes("reconnect")) {
    return { kind: "draft", refId: recon.id, label: `Reconnect with ${recon.name}`, sub: "Warm connections go cold quietly. This one takes a minute." };
  }
  return null;
}

/* ---------------- Your Reach so far: the impact panel ----------------
   Every number here is computed from this phone's own persisted
   record at render time — the touch history, the scheduled nudges,
   the queue's do-not-contact state, and the refusal counters.
   Nothing is estimated, projected, or rounded up. Touches on the
   seeded demo stage count, and the panel heading says so. */

function impactStats() {
  const hist = store.history || [];
  const carried = hist.filter(h => h.kind === "copy" || h.kind === "share").length;
  const stats = store.stats || { ...DEFAULT_STATS };
  return {
    touches: hist.length,
    sends: hist.length - carried,
    carried,
    followUpsPending: (store.nudges || []).length,
    followUpsDue: dueNudges().length,
    protectedCount: state.queue.filter(q => q.suppressed).length,
    refusals: (stats.suppression || 0) + (stats.cap || 0),
    suppressionRefusals: stats.suppression || 0,
    capRefusals: stats.cap || 0,
    days: new Set(hist.map(h => h.date)).size
  };
}

function renderImpact() {
  const grid = $("#impact-grid");
  if (!grid) return;
  const s = impactStats();
  const tiles = [
    { n: s.touches, label: "Touches completed", sub: "sends, copies and shares you finished" },
    { n: s.sends, label: "Drafts approved", sub: "exact text, approved by you, then sent" },
    { n: s.carried, label: "Carried to real apps", sub: "copied or shared out by your own hand" },
    { n: s.followUpsPending, label: "Follow-ups scheduled", sub: s.followUpsDue ? `${s.followUpsDue} due right now` : "none due right now" },
    { n: s.refusals, label: "Refusals honored", sub: `suppression ${s.suppressionRefusals} · cap ${s.capRefusals} — counted since v2.3` },
    { n: s.protectedCount, label: "People protected", sub: "on the do-not-contact list, never drafted to" },
    { n: s.days, label: "Days active", sub: "days with at least one touch, on this phone" }
  ];
  grid.innerHTML = tiles.map(t => `
    <div class="impact-tile">
      <span class="impact-num">${t.n}</span>
      <span class="impact-label">${escapeHtml(t.label)}</span>
      <span class="impact-sub">${escapeHtml(t.sub)}</span>
    </div>`).join("");
}

/* The warmth report: the same counted numbers, as one shareable
   card. Rendered on a canvas from the stats and the promise line —
   no external images, no tracking, nothing leaves the phone except
   through the share sheet you invoke. */
function warmthLines() {
  const s = impactStats();
  return [
    "Never let a warm connection go cold.",
    `${s.touches} touches completed · ${s.sends} drafts approved by a human`,
    `${s.carried} carried to real apps · ${s.followUpsPending} follow-ups scheduled`,
    `${s.refusals} refusals honored · ${s.protectedCount} people protected, never contacted`,
    `${s.days} day${s.days === 1 ? "" : "s"} of showing up — counted on my phone by Reach.`
  ];
}

async function shareWarmthReport() {
  const lines = warmthLines();
  const text = "My warmth report — Reach\n" + lines.join("\n");
  let canvas = null;
  let ctx = null;
  try {
    canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 630;
    ctx = canvas.getContext ? canvas.getContext("2d") : null;
  } catch (_) { ctx = null; }
  if (!ctx) {
    narrate("This browser can't draw the report card, so here's the text version — copy it anywhere:", "log-done");
    lines.forEach(l => narrate(l));
    return;
  }
  ctx.fillStyle = "#0b1e3a";
  ctx.fillRect(0, 0, 1200, 630);
  ctx.strokeStyle = "#e8c85a";
  ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(108, 522, 34, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 9;
  ctx.beginPath(); ctx.arc(108, 522, 62, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
  ctx.beginPath(); ctx.arc(108, 522, 92, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
  ctx.fillStyle = "#e8c85a";
  ctx.font = "800 44px Georgia, serif";
  ctx.fillText("REACH — MY WARMTH REPORT", 70, 110);
  ctx.fillStyle = "#fffdf7";
  ctx.font = "italic 600 40px Georgia, serif";
  ctx.fillText("“Never let a warm connection go cold.”", 70, 185);
  ctx.font = "500 33px system-ui, sans-serif";
  lines.slice(1).forEach((l, i) => ctx.fillText(l, 70, 285 + i * 62));
  ctx.fillStyle = "#c7d2df";
  ctx.font = "500 25px system-ui, sans-serif";
  ctx.fillText(new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + " · Counted on my phone — nothing uploaded, nothing estimated.", 70, 585);
  const shareFile = blob => {
    try {
      if (blob && typeof File === "function" && navigator.canShare) {
        const file = new File([blob], "reach-warmth-report.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text }).catch(() => {});
          narrate("Warmth report card is in the share sheet — send it wherever your people are.", "log-done");
          return;
        }
      }
    } catch (_) { /* fall through to download */ }
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "reach-warmth-report.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      narrate("Warmth report card downloaded — an image drawn from this phone's own counts.", "log-done");
    } catch (_) {
      narrate("The card couldn't be saved in this browser — the numbers are in “Your Reach so far” above, and the text version is:", "log-done");
      lines.forEach(l => narrate(l));
    }
  };
  try {
    if (canvas.toBlob) { canvas.toBlob(shareFile, "image/png"); return; }
    if (canvas.toDataURL) {
      const bin = atob(canvas.toDataURL("image/png").split(",")[1]);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      shareFile(new Blob([bytes], { type: "image/png" }));
      return;
    }
  } catch (_) { /* fall through */ }
  narrate("The card couldn't be rendered in this browser — the text version is:", "log-done");
  lines.forEach(l => narrate(l));
}

function renderToday() {
  const greetEl = $("#today-greeting");
  if (!greetEl) return;
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const name = (store.profile.name || "").trim();
  greetEl.textContent = name ? `${part}, ${firstName(name)}.` : `${part}.`;
  const touches = Math.min(store.day.touches, 3);
  $$("#today-sparks .spark").forEach((s, i) => s.classList.toggle("lit", i < touches));
  $("#today-progress-text").textContent = store.day.touches >= 3
    ? `Three touches done today — the habit is the whole game.`
    : `${store.day.touches} of 3 touches today. One warm message counts.`;
  const na = nextAction();
  const btn = $("#next-action-btn");
  if (na) {
    btn.disabled = false;
    $("#next-action-label").textContent = na.label;
    $("#next-action-sub").textContent = na.sub;
    $("#today-clear").hidden = true;
  } else {
    btn.disabled = true;
    $("#next-action-label").textContent = "Nothing needs you right now";
    $("#next-action-sub").textContent = "Replies answered, drafts decided, queue warm.";
    $("#today-clear").hidden = false;
  }
  const counts = sendCounts();
  const capsEl = $("#caps-line");
  if (capsEl) capsEl.textContent = `Sends today: ${counts.mailbox} of ${MAILBOX_CAP} per mailbox · ${counts.cold} of ${COLD_CAP} cold. The programme's real caps — counted, and enforced.`;
  const due = dueNudges();
  const fBlock = $("#followups-block");
  if (fBlock) {
    fBlock.hidden = due.length === 0;
    $("#followups-list").innerHTML = due.map(n => `
      <li class="followup-row">
        <span class="followup-who"><strong>${escapeHtml(n.name)}</strong> · ${escapeHtml(n.org)} <span class="followup-due">Due ${n.due === dateKey() ? "today" : fmtDay(n.due)}</span></span>
        <span class="followup-actions">
          <button type="button" class="mini-btn" data-nudge-draft="${n.id}">Draft the nudge</button>
          <button type="button" class="mini-btn" data-nudge-done="${n.id}">Done</button>
        </span>
      </li>`).join("");
    $$("[data-nudge-draft]", fBlock).forEach(b => b.addEventListener("click", () => draftNudge(b.dataset.nudgeDraft)));
    $$("[data-nudge-done]", fBlock).forEach(b => b.addEventListener("click", () => {
      store.nudges = store.nudges.filter(x => x.id !== b.dataset.nudgeDone);
      persist();
      renderToday();
      narrate("Follow-up cleared — warm connection kept.", "log-done");
    }));
  }
  const unreadCount = state.threads.filter(t => t.unread).length;
  $("#mission-reply-count").textContent = unreadCount ? `${unreadCount} unread` : "All answered";
  const thankQ = state.queue.find(q => q.move === "thank" && !q.suppressed);
  $("#mission-thank-count").textContent = thankQ ? (thankQ.status === "sent" ? "Thanked today" : `For ${thankQ.name}`) : "Nobody waiting";
  const reconQ = state.queue.find(q => q.move === "reconnect" && !q.suppressed);
  $("#mission-reconnect-count").textContent = reconQ ? (reconQ.status === "sent" ? "Reconnected" : `For ${reconQ.name}`) : "Nobody waiting";
  renderImpact();
}

async function runNextAction() {
  const na = nextAction();
  if (!na) { narrate("You're clear — every warm connection is warm.", "log-done"); switchView("today"); return; }
  if (na.kind === "approvals") { switchView("approvals"); narrate(`${state.approvals.length} draft${state.approvals.length === 1 ? "" : "s"} waiting on your decision. Read, edit if you like, then approve — or copy one out to a real app.`); return; }
  if (na.kind === "reply") return flowReply();
  if (na.kind === "nudge") return draftNudge(na.refId);
  if (na.kind === "draft") return flowDraftOne(na.refId);
}

function renderThreads() {
  const ul = $("#thread-list");
  ul.innerHTML = state.threads.map(t => {
    const last = t.messages[t.messages.length - 1];
    return `<li><button type="button" class="thread-row" data-thread="${t.id}">
      <span class="thread-name">${escapeHtml(t.name)}</span>
      ${t.unread ? '<span class="unread-dot">Unread</span>' : ""}
      <span class="thread-org">${escapeHtml(t.org)}</span>
      <span class="thread-preview">${escapeHtml(last ? last.text : "")}</span>
    </button></li>`;
  }).join("");
  $$(".thread-row", ul).forEach(btn => btn.addEventListener("click", () => openThread(btn.dataset.thread)));
}

function openThread(id) {
  state.activeThreadId = id;
  $("#research-card").hidden = true;
  renderThread();
  switchView("thread");
}

function renderThread() {
  const t = state.threads.find(x => x.id === state.activeThreadId);
  if (!t) return;
  $("#thread-title").textContent = `${t.name} · ${t.org}`;
  $("#bubble-stream").innerHTML = t.messages.map(m =>
    `<div class="bubble ${m.from}">${escapeHtml(m.text)}<span class="bubble-meta">${m.from === "me" ? "You" : escapeHtml(t.name)} · ${escapeHtml(m.time)}</span></div>`
  ).join("");
  $("#stage-screen").scrollTop = $("#stage-screen").scrollHeight;
}

function renderQueue() {
  const ul = $("#queue-list");
  const labels = {
    waiting: ["Waiting", "status-waiting"],
    drafted: ["Draft waiting for you", "status-drafted"],
    sent: ["Sent this session", "status-sent"],
    skipped: ["Skipped by you", "status-waiting"],
    saved: ["Draft saved for later", "status-drafted"],
    suppressed: ["Do not contact", "status-suppressed"]
  };
  ul.innerHTML = state.queue.map(q => {
    const [label, cls] = labels[q.status] || labels.waiting;
    const canDraft = !q.suppressed && (q.status === "waiting" || q.status === "saved");
    return `<li><article class="queue-card" data-queue="${q.id}">
      <h3>${escapeHtml(q.name)}</h3>
      <p class="queue-org">${escapeHtml(q.org)}${q.move ? ` · ${escapeHtml(MOVE_LABELS[q.move] || "Follow up")}` : ""}${q.user ? ` · <span class="yours-tag">Added by you</span>` : ""}</p>
      <p class="provenance">${escapeHtml(provenanceOf(q))}</p>
      ${q.suppressed
        ? `<p class="suppress-note"><strong>Do not contact.</strong> ${escapeHtml(q.suppressReason)}</p>`
        : `<p class="fit-note"><strong>Why them:</strong> ${escapeHtml(q.fit || "No context on record — Reach will hold, not invent one.")}</p>`}
      <p class="queue-status ${cls}">${label}</p>
      ${canDraft ? `<button type="button" class="queue-draft-btn" data-draft="${q.id}">Draft for ${escapeHtml(firstName(q.name))}</button>` : ""}
    </article></li>`;
  }).join("");
  $$("[data-draft]", ul).forEach(b => b.addEventListener("click", () => flowDraftOne(b.dataset.draft)));
  renderToday();
}

function draftKindLabel(a) {
  if (a.kind === "reply") return "Reply";
  if (a.kind === "studio") return `${MOVE_LABELS[a.move] || "Draft"} · from the Draft studio`;
  return "Outreach";
}

function renderApprovals() {
  const wrap = $("#approval-list");
  $("#approvals-empty").hidden = state.approvals.length > 0 || state.saved.length > 0;
  wrap.innerHTML = state.approvals.map(a => `
    <article class="approval-card" data-approval="${a.id}" tabindex="0">
      <p class="approval-kind">${escapeHtml(draftKindLabel(a))} · waiting for your decision</p>
      <p class="approval-to">To: ${escapeHtml(a.toName)} · ${escapeHtml(a.org)}</p>
      ${a.prov ? `<p class="approval-prov">${escapeHtml(a.prov)}</p>` : ""}
      <label class="visually-hidden" for="draft-${a.id}">Draft message to ${escapeHtml(a.toName)} — edit if you like, then approve the exact text</label>
      <textarea class="approval-draft" id="draft-${a.id}" rows="6">${escapeHtml(a.text)}</textarea>
      <div class="approval-actions">
        <button type="button" class="approve-btn" data-approve="${a.id}">Approve &amp; send</button>
        <button type="button" class="skip-btn" data-listen="${a.id}">Listen</button>
        <button type="button" class="skip-btn" data-skip="${a.id}">Skip</button>
      </div>
      <div class="approval-actions approval-actions-secondary">
        <button type="button" class="mini-btn" data-copy="${a.id}">Copy</button>
        <button type="button" class="mini-btn" data-share="${a.id}">Share</button>
        <button type="button" class="mini-btn" data-save="${a.id}">Save for later</button>
      </div>
      <p class="bridge-note">Copy or Share takes this exact text into a real app on your phone — the honest bridge until connectors land.</p>
    </article>`).join("");
  $$("[data-approve]", wrap).forEach(b => b.addEventListener("click", () => approveApproval(b.dataset.approve)));
  $$("[data-skip]", wrap).forEach(b => b.addEventListener("click", () => skipApproval(b.dataset.skip)));
  $$("[data-copy]", wrap).forEach(b => b.addEventListener("click", () => copyApproval(b.dataset.copy)));
  $$("[data-share]", wrap).forEach(b => b.addEventListener("click", () => shareApproval(b.dataset.share)));
  $$("[data-save]", wrap).forEach(b => b.addEventListener("click", () => saveApproval(b.dataset.save)));
  $$("[data-listen]", wrap).forEach(b => b.addEventListener("click", () => {
    const a = state.approvals.find(x => x.id === b.dataset.listen);
    const ta = a && $("#draft-" + a.id);
    if (ta) speak(ta.value, true);
  }));

  const savedWrap = $("#saved-list");
  $("#saved-heading").hidden = state.saved.length === 0;
  savedWrap.innerHTML = state.saved.map(s => `
    <article class="approval-card saved-card" data-saved="${s.id}">
      <p class="approval-kind">Saved for later · ${escapeHtml(MOVE_LABELS[s.move] || "Draft")}</p>
      <p class="approval-to">To: ${escapeHtml(s.toName)} · ${escapeHtml(s.org)}</p>
      ${s.prov ? `<p class="approval-prov">${escapeHtml(s.prov)}</p>` : ""}
      <p class="saved-text">${escapeHtml(s.text)}</p>
      <div class="approval-actions">
        <button type="button" class="mini-btn" data-restore="${s.id}">Back to approvals</button>
        <button type="button" class="mini-btn" data-copy-saved="${s.id}">Copy</button>
        <button type="button" class="mini-btn" data-drop-saved="${s.id}">Discard</button>
      </div>
    </article>`).join("");
  $$("[data-restore]", savedWrap).forEach(b => b.addEventListener("click", () => restoreSaved(b.dataset.restore)));
  $$("[data-copy-saved]", savedWrap).forEach(b => b.addEventListener("click", () => {
    const s = state.saved.find(x => x.id === b.dataset.copySaved);
    if (s) copyText(s.text, s.toName, true);
  }));
  $$("[data-drop-saved]", savedWrap).forEach(b => b.addEventListener("click", () => {
    const idx = state.saved.findIndex(x => x.id === b.dataset.dropSaved);
    if (idx === -1) return;
    const s = state.saved[idx];
    state.saved.splice(idx, 1);
    const q = state.queue.find(x => x.id === s.refId);
    if (q && q.status === "saved") { q.status = "waiting"; renderQueue(); }
    persistSaved();
    renderApprovals();
    narrate(`Discarded the saved draft for ${s.toName}.`);
  }));
  updateBadges();
  renderToday();
}

/* ---------------- approvals: the human decision ---------------- */

function addApproval(kind, refId, toName, org, text, move, prov) {
  const a = { id: "a" + (++approvalSeq), kind, refId, toName, org, text, move: move || "", prov: prov || "" };
  state.approvals.push(a);
  renderApprovals();
  traceEvent("draft_created", { kind: a.kind, to: firstName(a.toName), move: a.move || "" });
  return a;
}

/* Copy / Share: the honest bridge to real apps today. The text you
   approved-by-eye leaves with you — Reach sends nothing itself. */
async function copyText(text, toName, fromSaved) {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch (_) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute"; ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { ok = document.execCommand("copy"); } catch (__) { ok = false; }
    document.body.removeChild(ta);
  }
  if (ok) {
    narrate(fromSaved
      ? `Copied the saved draft for ${toName} — paste it into any app on your phone.`
      : `Copied the draft for ${toName} — paste it into any app on your phone. That counts as a touch.`, "log-done");
    if (!fromSaved) recordTouch("copy", toName);
  } else {
    narrate("Copy didn't work in this browser — the text is in the card; long-press to copy it by hand.");
  }
  return ok;
}

function approvalCurrentText(a) {
  const ta = $("#draft-" + a.id);
  return ta ? ta.value : a.text;
}

function nudgeInfoFor(a) {
  const q = state.queue.find(x => x.id === a.refId);
  return { personId: a.refId, name: a.toName, org: a.org, fit: (q && q.fit) || "" };
}

function copyApproval(id) {
  const a = state.approvals.find(x => x.id === id);
  if (!a) return;
  copyText(approvalCurrentText(a), a.toName, false).then(ok => { if (ok) offerNudge(nudgeInfoFor(a)); });
}

async function shareApproval(id) {
  const a = state.approvals.find(x => x.id === id);
  if (!a) return;
  const text = approvalCurrentText(a);
  if (navigator.share) {
    try {
      await navigator.share({ text });
      narrate(`Shared the draft for ${a.toName} — send it from the app you picked. That counts as a touch.`, "log-done");
      recordTouch("share", a.toName);
      offerNudge(nudgeInfoFor(a));
      return;
    } catch (_) { /* dismissed — fall through to copy */ }
  }
  const ok = await copyText(text, a.toName, false);
  if (ok) offerNudge(nudgeInfoFor(a));
}

function saveApproval(id) {
  const idx = state.approvals.findIndex(a => a.id === id);
  if (idx === -1) return;
  const a = state.approvals[idx];
  a.text = approvalCurrentText(a);
  state.approvals.splice(idx, 1);
  state.saved.push({ id: a.id, kind: a.kind, refId: a.refId, toName: a.toName, org: a.org, text: a.text, move: a.move || "", prov: a.prov || "" });
  if (a.kind !== "reply") {
    const q = state.queue.find(x => x.id === a.refId);
    if (q && q.status === "drafted") { q.status = "saved"; renderQueue(); }
  }
  persistSaved();
  renderApprovals();
  narrate(`Saved the draft for ${a.toName} for later. It'll wait here — no expiry, no nagging.`);
}

function restoreSaved(id) {
  const idx = state.saved.findIndex(s => s.id === id);
  if (idx === -1) return;
  const s = state.saved[idx];
  state.saved.splice(idx, 1);
  addApproval(s.kind || "outreach", s.refId, s.toName, s.org, s.text, s.move, s.prov || "");
  const q = state.queue.find(x => x.id === s.refId);
  if (q && q.status === "saved") { q.status = "drafted"; renderQueue(); }
  persistSaved();
  renderApprovals();
  narrate(`The draft for ${s.toName} is back in Approvals, waiting for your decision.`);
}

/* Full keyboard operation for approval cards: focus a card, then
   ↑ / ↓ move between cards, A approves, C copies, S shares. Keys
   never fire while you are editing the draft text itself. */
$("#approval-list").addEventListener("keydown", e => {
  if (e.target.closest("textarea, input, select")) return;
  const card = e.target.closest("[data-approval]");
  if (!card) return;
  const id = card.dataset.approval;
  const key = (e.key || "").toLowerCase();
  if (key === "arrowdown" || key === "arrowup") {
    e.preventDefault();
    const cards = $$(".approval-card", $("#approval-list"));
    const i = cards.indexOf(card);
    const next = cards[key === "arrowdown" ? Math.min(i + 1, cards.length - 1) : Math.max(i - 1, 0)];
    if (next) next.focus();
    return;
  }
  if (key === "a") { e.preventDefault(); approveApproval(id); }
  else if (key === "c") { e.preventDefault(); copyApproval(id); }
  else if (key === "s") { e.preventDefault(); shareApproval(id); }
});

/* After a decision completes, focus lands somewhere sensible: the
   next waiting card, or the empty note when the queue is decided. */
function focusAfterDecision() {
  const first = $(".approval-card");
  if (first) { first.focus(); return; }
  if (state.activeView === "approvals") {
    const empty = $("#approvals-empty");
    if (empty) { empty.setAttribute("tabindex", "-1"); empty.focus(); }
  }
}

async function approveApproval(id) {
  const idx = state.approvals.findIndex(a => a.id === id);
  if (idx === -1) return;
  const a = state.approvals[idx];
  /* The caps are state now, not narration: at the mailbox cap the
     send is refused and the draft stays in Approvals for tomorrow. */
  const before = sendCounts();
  if (before.mailbox >= MAILBOX_CAP) {
    narrate(`Today's mailbox cap is reached — ${before.mailbox} of ${MAILBOX_CAP} sends used. The real programme stops the wave here rather than risk the mailbox, so this draft stays in Approvals; the counters reset tomorrow.`, "log-refusal");
    traceEvent("cap_refusal", { to: firstName(a.toName), mailbox: before.mailbox, cap: MAILBOX_CAP });
    bumpStat("cap");
    return;
  }
  const ta = $("#draft-" + id);
  const finalText = ta ? ta.value.trim() : a.text;
  state.approvals.splice(idx, 1);
  renderApprovals();

  if (a.kind === "reply") {
    const t = state.threads.find(x => x.id === a.refId);
    openThread(a.refId);
    await agentTouch($("#composer-input"), "You approved it. Opening the thread and typing the reply into the composer…");
    await typeInto($("#composer-input"), finalText);
    await agentTouch($("#composer-send"), "Sending…");
    t.messages.push({ from: "me", text: finalText, time: "Now" });
    t.unread = false;
    $("#composer-input").value = "";
    renderThread();
    renderThreads();
    updateBadges();
    tick();
    recordTouch("reply", t.name);
    const c = recordSend(false);
    narrate(`Reply sent to ${t.name}. It's in the thread now — you can scroll up and check it. (${c.mailbox} of ${MAILBOX_CAP} sends used today.)`, "log-done");
    offerNudge({ personId: t.id, name: t.name, org: t.org, fit: "" });
  } else {
    const q = state.queue.find(x => x.id === a.refId);
    if (q) q.status = "sent";
    state.sentCount += 1;
    renderQueue();
    switchView("queue");
    await agentTouch(q ? $(`[data-queue="${q.id}"]`) : null, `You approved it. Sending to ${a.toName} at ${a.org}…`);
    tick();
    recordTouch(a.move || "outreach", a.toName);
    const c = recordSend(true);
    narrate(`Sent to ${a.toName}. That's send number ${state.sentCount} this session — ${c.mailbox} of ${MAILBOX_CAP} sends used today, ${c.cold} of ${COLD_CAP} cold. Reach keeps the programme's pace instead of blasting the whole queue at once.`, "log-done");
    offerNudge({ personId: a.refId, name: a.toName, org: a.org, fit: (q && q.fit) || "" });
  }
  const after = sendCounts();
  traceEvent("approval_granted", { kind: a.kind, to: firstName(a.toName) });
  traceEvent("send_staged", { kind: a.kind, to: firstName(a.toName), mailbox: after.mailbox, cold: after.cold });
  focusAfterDecision();
}

function skipApproval(id) {
  const idx = state.approvals.findIndex(a => a.id === id);
  if (idx === -1) return;
  const a = state.approvals[idx];
  state.approvals.splice(idx, 1);
  if (a.kind !== "reply") {
    const q = state.queue.find(x => x.id === a.refId);
    if (q && q.status === "drafted") { q.status = "skipped"; renderQueue(); }
  }
  renderApprovals();
  narrate(`Skipped the draft for ${a.toName}. Nothing was sent.`);
}

/* ---------------- the three demo flows ---------------- */

let flowReturnFocus = null;

function setBusy(b) {
  if (b) flowReturnFocus = document.activeElement;
  state.busy = b;
  $$(".flow-btn, .mission-btn, #next-action-btn, #studio-generate").forEach(btn => { btn.disabled = b; });
  if (!b) {
    renderToday();
    /* Focus returns to a sensible place: the control that launched
       the flow if it is still on the page, otherwise the tab of the
       view the flow left you on. */
    if (flowReturnFocus && flowReturnFocus !== document.body && document.contains(flowReturnFocus)) {
      flowReturnFocus.focus();
    } else {
      const tabName = state.activeView === "thread" ? "messages" : state.activeView;
      const tab = $(`.tab[data-view="${tabName}"]`);
      if (tab) tab.focus();
    }
    flowReturnFocus = null;
  }
}

async function flowReply() {
  if (state.busy) return;
  setBusy(true);
  try {
    narrate("Working on it — replying to the first unread message.");
    switchView("messages");
    const rows = $$("#thread-list .thread-row");
    await agentTouch(rows[0], `Opening Messages and reading the thread list — ${rows.length} conversations here.`);
    const t = state.threads.find(x => x.unread);
    if (!t) {
      narrate("No unread messages — there's nothing waiting for a reply.", "log-done");
      return;
    }
    if (state.approvals.some(a => a.kind === "reply" && a.refId === t.id)) {
      switchView("approvals");
      narrate(`A draft reply to ${t.name} is already written and waiting in Approvals.`, "log-done");
      return;
    }
    await agentTouch($(`[data-thread="${t.id}"]`), `${t.name} from ${t.org} is first unread. Opening the thread.`);
    openThread(t.id);
    const last = [...t.messages].reverse().find(m => m.from === "them");
    await wait(500);
    narrate(`Reading the latest message from ${t.name}: “${last.text}”`);
    if (t.profile) {
      const card = $("#research-card");
      const ig = window.ReachIntegrations;
      let live = null;
      if (ig && ig.tavilyConnected()) {
        narrate(`Before drafting, I'll look up ${t.org} — Tavily is connected in the sponsor stack, so this research step runs live.`);
        live = await ig.tavilySearch(`${t.org} — ${t.name}`);
      }
      if (live) {
        $("#research-kind").textContent = "Live research · Tavily";
        $("#research-text").textContent = `${live.title} — ${live.content}`;
        $("#research-note").textContent = `Live · Tavily — fetched just now. Source: ${live.url}`;
        card.hidden = false;
        traceEvent("research_live", { org: t.org, source: live.url });
        await agentTouch(card, `Live research via Tavily: “${live.title}” (${live.url}). The card is labelled Live · Tavily, so you always know which kind of research you're seeing.`);
      } else {
        if (ig && ig.tavilyConnected()) {
          narrate("The live Tavily lookup didn't come back, so I'm falling back to the staged profile for this thread — labelled as staged, never passed off as live.", "log-refusal");
          traceEvent("research_fallback", { org: t.org });
        } else {
          narrate(`Before drafting, I'll look up ${t.org}. In the live product this step is a web-research lookup (Tavily-style); in this demo it reads a staged profile — the card says so on its face. Connect Tavily in the sponsor stack below and this step runs live.`);
        }
        $("#research-kind").textContent = "Agent research · org profile";
        $("#research-text").textContent = t.profile;
        $("#research-note").textContent = "Staged profile — in the live product, this card is filled by a web-research lookup.";
        card.hidden = false;
        await agentTouch(card, `Research found: ${t.profile}`);
      }
    }
    narrate("Drafting a reply that answers it…");
    await wait(900);
    addApproval("reply", t.id, t.name, t.org, t.draft, "", "Seed demo data — staged conversation");
    switchView("approvals");
    narrate(`Draft written and parked in Approvals. Nothing sends until you approve the exact text — you can edit it first, or have it read aloud with the Listen button.`, "log-done");
  } finally {
    setBusy(false);
  }
}

async function flowQueue() {
  if (state.busy) return;
  setBusy(true);
  try {
    narrate("Working on it — going through the outreach queue in order.");
    switchView("queue");
    renderQueue();
    let made = 0;
    for (const q of state.queue) {
      const card = $(`[data-queue="${q.id}"]`);
      if (q.suppressed) {
        await agentTouch(card, "");
        narrate(`Skipping ${q.name} at ${q.org}. They asked not to be contacted again, so they're on the do-not-contact list — I won't draft anything for them, ever.`, "log-refusal");
        traceEvent("suppression_refusal", { to: firstName(q.name) });
        bumpStat("suppression");
        continue;
      }
      if (q.status === "sent") { narrate(`${q.name} — already sent this session.`); continue; }
      if (q.status === "drafted") { narrate(`${q.name} — a draft is already waiting for your approval.`); continue; }
      if (q.status === "saved") { narrate(`${q.name} — you saved that draft for later; it's waiting in Approvals.`); continue; }
      if (q.status === "skipped") { narrate(`${q.name} — you skipped their last draft, so I'll leave them alone unless you ask again.`); continue; }
      if (!q.fit) {
        await agentTouch(card, "");
        narrate(`Holding ${q.name} at ${q.org}. There's no reason-on-record for contacting them, and I won't invent one — add the context and I'll draft.`, "log-refusal");
        continue;
      }
      await agentTouch(card, `Reading the fit note for ${q.name} at ${q.org}: ${q.fit}`);
      narrate(`Drafting a personalised message for ${q.name}…`);
      await wait(900);
      q.status = "drafted";
      renderQueue();
      addApproval("outreach", q.id, q.name, q.org, q.draft || generateDraft(q, q.move || "follow-up"), q.move || "follow-up", provenanceOf(q));
      made += 1;
      narrate(`Draft for ${q.name} is in Approvals.`);
    }
    if (state.approvals.length > 0) {
      switchView("approvals");
      narrate(`That's the queue worked — ${made} new draft${made === 1 ? "" : "s"} made. Every one is waiting on your decision; I never send on my own.`, "log-done");
    } else {
      narrate("The queue is fully worked and no drafts are waiting.", "log-done");
    }
  } finally {
    setBusy(false);
  }
}

async function flowSummarize() {
  if (state.busy) return;
  setBusy(true);
  try {
    narrate("Reading the whole stage, as it stands right now…");
    await wait(600);
    // Genuine read of the rendered stage, not just the model:
    const domThreads = $$("#thread-list .thread-row").length;
    const domUnread = $$("#thread-list .unread-dot").length;
    const unreadNames = state.threads.filter(t => t.unread).map(t => t.name).join(" and ");
    const waiting = state.queue.filter(q => q.status === "waiting").length;
    const sent = state.queue.filter(q => q.status === "sent").length;
    const suppressed = state.queue.filter(q => q.suppressed).length;
    narrate(`Messages: ${domThreads} conversations, ${domUnread} unread${unreadNames ? " — from " + unreadNames : ""}.`);
    narrate(`Outreach queue: ${state.queue.length} people — ${waiting} waiting to be drafted, ${sent} sent this session, ${suppressed} on the do-not-contact list who will never be drafted to.`);
    narrate(`Approvals: ${state.approvals.length} draft${state.approvals.length === 1 ? "" : "s"} waiting for your decision. Nothing has sent without you — ${state.sentCount} send${state.sentCount === 1 ? "" : "s"} approved so far this session.`, "log-done");
  } finally {
    setBusy(false);
  }
}

/* Draft for one person — used by queue cards, Today missions, and
   the Next best action button. */
async function flowDraftOne(id) {
  if (state.busy) return;
  const q = state.queue.find(x => x.id === id);
  if (!q) return;
  if (q.suppressed) {
    switchView("queue");
    narrate(`${q.name} is on the do-not-contact list — ${q.suppressReason} I won't draft anything for them, ever.`, "log-refusal");
    traceEvent("suppression_refusal", { to: firstName(q.name) });
    bumpStat("suppression");
    return;
  }
  if (state.approvals.some(a => a.refId === q.id && a.kind !== "reply")) {
    switchView("approvals");
    narrate(`A draft for ${q.name} is already written and waiting in Approvals.`, "log-done");
    return;
  }
  if (state.saved.some(s => s.refId === q.id)) {
    switchView("approvals");
    narrate(`You already have a draft for ${q.name} saved for later — it's under Approvals, below the waiting cards. Restore it when you're ready.`, "log-done");
    return;
  }
  if (q.status === "sent") { narrate(`${q.name} — already sent this session.`); return; }
  setBusy(true);
  try {
    switchView("queue");
    renderQueue();
    const card = $(`[data-queue="${q.id}"]`);
    if (!q.fit) {
      await agentTouch(card, "");
      narrate(`Holding ${q.name}. No context on record — I won't invent a reason. Add why them, and I'll draft in seconds.`, "log-refusal");
      return;
    }
    await agentTouch(card, `Reading what's on record for ${q.name} at ${q.org}: ${q.fit}`);
    narrate(`Drafting a ${MOVE_LABELS[q.move] || "follow-up"} in your ${store.profile.tone || "Warm"} tone…`);
    await wait(900);
    q.status = "drafted";
    renderQueue();
    addApproval("outreach", q.id, q.name, q.org, q.draft || generateDraft(q, q.move || "follow-up"), q.move || "follow-up", provenanceOf(q));
    switchView("approvals");
    narrate(`Draft for ${q.name} is in Approvals. Read it, edit it, approve it — or copy it into a real app instead.`, "log-done");
  } finally {
    setBusy(false);
  }
}

/* ---------------- Listen mode: the day, read aloud ---------------- */

async function flowListen() {
  if (state.busy) return;
  setBusy(true);
  try {
    const lines = [];
    const name = (store.profile.name || "").trim();
    lines.push(name ? `Here's your day, ${firstName(name)}.` : "Here's your day.");
    const unreads = state.threads.filter(t => t.unread);
    if (unreads.length) {
      lines.push(`Messages: ${unreads.length} unread — ${unreads.map(t => `${t.name} at ${t.org}`).join("; ")}.`);
    } else {
      lines.push("Messages: nothing unread. Every reply is answered.");
    }
    const na = nextAction();
    lines.push(na ? `Your next best action: ${na.label}. ${na.sub}` : "You're clear — every warm connection is warm.");
    if (state.approvals.length) {
      lines.push(`${state.approvals.length} draft${state.approvals.length === 1 ? "" : "s"} waiting for your decision:`);
      state.approvals.forEach(a => lines.push(`For ${a.toName}: ${approvalCurrentText(a).split(/(?<=[.!?])\s/)[0]}`));
    }
    const dueLines = dueNudges();
    if (dueLines.length) {
      lines.push(`Follow-ups due: ${dueLines.length} — ${dueLines.map(n => n.name).join("; ")}.`);
    }
    const countsNow = sendCounts();
    lines.push(`Sends today: ${countsNow.mailbox} of ${MAILBOX_CAP} from this mailbox, ${countsNow.cold} of ${COLD_CAP} cold.`);
    lines.push(`Touches today: ${store.day.touches} of 3.`);
    narrate("Listen mode — reading your day aloud, in order.", "log-done");
    narrateSilent = true;
    lines.forEach(l => narrate(l));
    narrateSilent = false;
    const spoke = speakSeries(lines);
    if (!spoke) narrate("This browser can't speak aloud, so your day is in the log above instead — a screen reader will read it the same way.");
  } finally {
    setBusy(false);
  }
}

/* ---------------- Morning brief: the day, composed and read ----------------
   The daily-habit hero: one tap (or "brief me") and Reach composes
   the morning from real state — due follow-ups first, then waiting
   approvals, unreads, the caps, your impact so far, and the next
   best action — and reads it aloud, in the ElevenLabs voice when
   you've connected one, the browser voice otherwise, saying which. */

function buildBriefLines() {
  const lines = [];
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const name = (store.profile.name || "").trim();
  const todayStr = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  lines.push(name ? `${part}, ${firstName(name)}. It's ${todayStr}. Here's your brief.` : `${part}. It's ${todayStr}. Here's your brief.`);
  const due = dueNudges();
  lines.push(due.length
    ? `Follow-ups due: ${due.length} — ${due.map(n => n.name).join("; ")}. One tap each drafts the follow-up from what's on record.`
    : "Follow-ups: none due. Nothing you scheduled is waiting on you.");
  lines.push(state.approvals.length
    ? `Drafts waiting: ${state.approvals.length} — the first is for ${state.approvals[0].toName}. Your decision is the only step left on each.`
    : "Drafts waiting: none. Nothing is parked on your approval.");
  const unreads = state.threads.filter(t => t.unread);
  lines.push(unreads.length
    ? `Unread messages: ${unreads.length} — ${unreads[0].name} at ${unreads[0].org} is first.`
    : "Unread messages: none. Every reply is answered.");
  const counts = sendCounts();
  lines.push(counts.mailbox >= MAILBOX_CAP
    ? `Sends today: ${counts.mailbox} of ${MAILBOX_CAP} from this mailbox — at the cap, so new sends wait for tomorrow. The cap held.`
    : `Sends today: ${counts.mailbox} of ${MAILBOX_CAP} from this mailbox, ${counts.cold} of ${COLD_CAP} cold. The caps are counters, enforced as state, not advice.`);
  const s = impactStats();
  lines.push(`Your Reach so far: ${s.touches} touches completed, ${s.refusals} refusals honored, across ${s.days} day${s.days === 1 ? "" : "s"} of showing up.`);
  const na = nextAction();
  lines.push(na ? `Your next best action: ${na.label}. ${na.sub}` : "You're clear — every warm connection is warm. That's the whole brief.");
  return lines;
}

async function flowBrief() {
  if (state.busy) return;
  setBusy(true);
  try {
    switchView("today");
    renderToday();
    const ig = window.ReachIntegrations;
    const inEleven = !!(ig && ig.elevenConnected());
    narrate(inEleven
      ? "Morning brief — reading it aloud in the ElevenLabs voice you connected. The browser voice stays as the fallback for any line it can't say."
      : "Morning brief — reading it aloud in your browser's voice. Connect ElevenLabs in the sponsor stack below and the brief speaks in that warm voice instead.", "log-done");
    const lines = buildBriefLines();
    narrateSilent = true;
    lines.forEach(l => narrate(l));
    narrateSilent = false;
    traceEvent("morning_brief", { lines: lines.length, voice: inEleven ? "elevenlabs" : "browser" });
    const spoke = speakSeries(lines);
    if (!spoke) narrate("This browser can't speak aloud, so your brief is in the log above instead — a screen reader will read it the same way.");
  } finally {
    setBusy(false);
  }
}

/* ---------------- Judge mode: the staged lap, fully reversible ---------
   One toggle: the 30-second pitch appears on Today, the Next best
   action grows, and the tour gains a sponsor-stack lap (connect →
   live research → the refusal that lands on the record). The flag
   persists like any other setting; toggling off removes the class,
   the banner, and the extra beats — nothing else about the app
   changes. */

let pitchDismissed = false;

function judgeModeOn() {
  return !!store.judgeMode;
}

function applyJudgeMode() {
  const on = judgeModeOn();
  const toggle = $("#judge-toggle");
  if (toggle) toggle.checked = on;
  document.body.classList.toggle("judge-on", on);
  const banner = $("#pitch-banner");
  if (banner) banner.hidden = !(on && !pitchDismissed);
}

/* ---------------- Guided demo: Mike's 90-second judging flow ---------------- */

async function flowTour() {
  if (state.busy) return;
  setBusy(true);
  try {
    narrate("Welcome to Reach — the 90-second tour. The promise in one line: never let a warm connection go cold.", "log-done");
    switchView("today");
    await wait(1400);
    narrate("This is Today. Not an inbox — a short list of the people who'd notice if you showed up today: one reply, one thank-you, one reconnection. Three touches, two minutes each.");
    await wait(1400);
    const unread = state.threads.find(t => t.unread);
    if (unread && !state.approvals.some(a => a.kind === "reply" && a.refId === unread.id)) {
      setBusy(false);
      await flowReply();
      setBusy(true);
    }
    if (state.approvals.length) {
      switchView("approvals");
      await wait(1200);
      narrate("Here's the whole product in one card. Reach read the screen, did the research step, and typed this draft. In real use the next tap is always, only, yours — for this tour, I'll press approve as your stand-in so you can watch the loop close.");
      await wait(1600);
      await approveApproval(state.approvals[0].id);
      await wait(800);
    }
    const thankQ = state.queue.find(q => q.move === "thank" && !q.suppressed && q.status === "waiting");
    if (thankQ) {
      setBusy(false);
      await flowDraftOne(thankQ.id);
      setBusy(true);
      narrate("That draft was built only from what's on record about " + thankQ.name.split(" ")[0] + " — anything Reach didn't know became a bracketed prompt, never an invented detail. It waits for a human, like everything here.");
      await wait(1200);
    }
    if (judgeModeOn()) {
      /* The sponsor-stack lap: connect, live research, the refusal —
         each beat uses the real adapter state, and says plainly when
         a provider isn't connected. */
      narrate("Judge mode adds one lap — the sponsor stack, live.", "log-done");
      await wait(600);
      const ig = window.ReachIntegrations;
      const tav = !!(ig && ig.tavilyConnected());
      const elv = !!(ig && ig.elevenConnected());
      const ls = !!(ig && ig.langsmithConnected());
      const pu = !!(ig && ig.phoneuseConnected && ig.phoneuseConnected());
      narrate(`Sponsor stack, as it stands: Tavily ${tav ? "connected — research runs live" : "not connected"}, ElevenLabs ${elv ? "connected — the warm voice is on" : "not connected"}, LangSmith ${ls ? "connected — runs are landing on the record" : "not connected"}, PhoneUse ${pu ? "detected — the local iPhone execution layer answered its health check" : "not detected from this page, which is the normal result for a local service"}. Keys live on this device only; without yours, every step falls back cleanly — nothing breaks, it just says so.`);
      switchView("messages");
      if (state.threads.some(t => t.unread)) {
        narrate("Beat one — research before drafting. Replying to Maya Chen runs the research step first:");
        setBusy(false);
        await flowReply();
        setBusy(true);
        narrate(`That card was ${tav ? "labelled Live · Tavily, with your own sources merged in" : "labelled Staged · profile — no key connected, so Reach used the captured profile and the on-device notes, and said so on the card"}. Now the refusal:`);
      } else {
        narrate(`Beat one — research before drafting: you saw it in the tour, where the reply to Maya Chen opened with a research card ${tav ? "labelled Live · Tavily, with your own sources merged in" : "labelled Staged · profile — no key connected, so Reach used the captured profile and the on-device notes, and said so on the card"}. Now the refusal:`);
      }
      setBusy(false);
      await flowQueue();
      setBusy(true);
      narrate(`That refusal was traced ${ls ? "to LangSmith, project “reach” — the no is on the record, metadata only" : "in the log above — connect LangSmith and the same refusal lands on the record as a reach.suppression_refusal run"}. Draft-first, approval-gated, suppression-checked: that is the whole product, in one lap.`, "log-done");
    }
    switchView("today");
    renderToday();
    narrate(`Tour complete. Touches today: ${store.day.touches} of 3 — the spark row at the top of Today is the habit, made visible. Everything you add stays on this phone: no account, nothing uploaded. Reach drafts; you decide.`, "log-done");
  } finally {
    setBusy(false);
  }
}

/* ---------------- commands (typed or spoken) ---------------- */

async function handleCommand(raw) {
  const text = (raw || "").trim();
  if (!text) return;
  narrateUser(text);
  const t = text.toLowerCase();
  if (state.busy) {
    narrate("I'm still working on the last instruction — one thing at a time.");
    return;
  }
  if (/^approve/.test(t)) {
    const a = state.approvals[0];
    if (a) { narrate(`Approving the oldest waiting draft — the one for ${a.toName}.`); await approveApproval(a.id); }
    else narrate("There's no draft waiting for approval right now.");
    return;
  }
  if (t === "next" || t.includes("next action") || t.includes("next best")) return runNextAction();
  if (t === "copy" || t.startsWith("copy")) {
    const a = state.approvals[0];
    if (a) return copyApproval(a.id);
    narrate("No draft is waiting to copy. Ask me to reply or work the queue first.");
    return;
  }
  if (t === "skip" || t.startsWith("skip")) {
    const a = state.approvals[0];
    if (a) { skipApproval(a.id); return; }
    narrate("No draft is waiting to skip.");
    return;
  }
  if (t.includes("brief")) return flowBrief();
  if (t.includes("listen") || t.includes("read my day") || t.includes("read the day")) return flowListen();
  if (t.includes("today") || t === "home") { switchView("today"); narrate("Today's three touches are on the stage — one tap on Next best action and I'll walk it with you."); return; }
  if (t.includes("thank")) {
    const q = state.queue.find(x => x.move === "thank" && !x.suppressed);
    if (q) return flowDraftOne(q.id);
  }
  if (t.includes("reconnect")) {
    const q = state.queue.find(x => x.move === "reconnect" && !x.suppressed);
    if (q) return flowDraftOne(q.id);
  }
  if (t.includes("tour") || t.includes("show me")) return flowTour();
  if (t.includes("summar") || t.includes("what do you see") || t.includes("what can you see")) return flowSummarize();
  if (t.includes("queue") || t.includes("outreach")) return flowQueue();
  if (t.includes("reply") || t.includes("unread") || t.includes("message")) return flowReply();
  narrate("I can: brief you on your day, reply to the first unread message, work the outreach queue, draft a thank-you or a reconnection, listen to your day, or summarize what I see. Try “brief me” or “next” — or tap a big button.");
}

$$(".flow-btn").forEach(btn => btn.addEventListener("click", () => {
  const f = btn.dataset.flow;
  if (f === "reply") { narrateUser("Reply to the first unread message"); flowReply(); }
  if (f === "queue") { narrateUser("Work the outreach queue"); flowQueue(); }
  if (f === "summarize") { narrateUser("Summarize what you see"); flowSummarize(); }
  if (f === "tour") { narrateUser("Show me Reach"); flowTour(); }
  if (f === "listen") { narrateUser("Listen to my day"); flowListen(); }
  if (f === "brief") { narrateUser("Brief me"); flowBrief(); }
}));

$("#command-form").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#command-input");
  handleCommand(input.value);
  input.value = "";
});

/* ---------------- voice in (where the browser offers it) ---------------- */

const micBtn = $("#mic-btn");
const micNote = $("#mic-note");
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) {
  micBtn.disabled = true;
  micNote.textContent = "Voice input isn't offered by this browser, so the mic stays off — typing works everywhere. On Android Chrome and many mobile browsers, the mic lights up.";
} else {
  micNote.textContent = "Voice input works in this browser — tap the mic and say “work the queue”, “reply”, or “summarize”.";
  const rec = new SR();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.addEventListener("result", e => {
    const said = e.results[0][0].transcript;
    $("#command-input").value = said;
    handleCommand(said);
  });
  rec.addEventListener("end", () => micBtn.classList.remove("listening"));
  rec.addEventListener("error", () => {
    micBtn.classList.remove("listening");
    micNote.textContent = "The mic didn't catch that — typing the command works just as well.";
  });
  micBtn.addEventListener("click", () => {
    try { rec.start(); micBtn.classList.add("listening"); } catch (_) { /* already listening */ }
  });
}

/* ---------------- stage chrome: tabs, back, composer ---------------- */

$$(".tab").forEach(tab => tab.addEventListener("click", () => switchView(tab.dataset.view)));
$("#thread-back").addEventListener("click", () => switchView("messages"));

$("#composer-form").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#composer-input");
  const text = input.value.trim();
  const t = state.threads.find(x => x.id === state.activeThreadId);
  if (!text || !t) return;
  t.messages.push({ from: "me", text, time: "Now" });
  t.unread = false;
  input.value = "";
  renderThread();
  renderThreads();
  updateBadges();
  const c = recordSend(false);
  narrate(`You sent that one yourself, straight from the composer. (${c.mailbox} of ${MAILBOX_CAP} sends used today.)`);
});

/* ---------------- Today wiring: next action + missions ---------------- */

$("#next-action-btn").addEventListener("click", () => { narrateUser("Next best action"); runNextAction(); });
$$(".mission-btn").forEach(btn => btn.addEventListener("click", () => {
  const m = btn.dataset.mission;
  narrateUser(btn.textContent.trim().replace(/\s+/g, " "));
  if (m === "reply") flowReply();
  if (m === "thank") { const q = state.queue.find(x => x.move === "thank" && !x.suppressed); if (q) flowDraftOne(q.id); else narrate("No thank-you is waiting — add someone from the Outreach queue."); }
  if (m === "reconnect") { const q = state.queue.find(x => x.move === "reconnect" && !x.suppressed); if (q) flowDraftOne(q.id); else narrate("No reconnection is waiting — add someone from the Outreach queue."); }
}));
$("#warmth-share-btn").addEventListener("click", () => { shareWarmthReport(); });

$("#judge-toggle").addEventListener("change", () => {
  store.judgeMode = $("#judge-toggle").checked;
  persist();
  applyJudgeMode();
  if (store.judgeMode) {
    switchView("today");
    renderToday();
    narrate("Judge mode is on: the 30-second pitch is on Today, the Next best action is bigger, and the guided tour gains the sponsor-stack lap — connect, live research, the refusal on the record. Toggle it off and everything returns to normal.", "log-done");
  } else {
    narrate("Judge mode is off — pitch away, normal sizing, standard tour. Nothing else changed.", "log-done");
  }
});

$("#pitch-dismiss").addEventListener("click", () => {
  pitchDismissed = true;
  const banner = $("#pitch-banner");
  if (banner) banner.hidden = true;
  narrate("Pitch hidden. Judge mode stays on — the tour still runs the sponsor lap; toggle Judge mode off to return everything to normal.");
});

$("#today-add-btn").addEventListener("click", () => {
  switchView("queue");
  const el = $("#person-name");
  if (el) el.focus();
});

/* ---------------- Your people: add-person form ---------------- */

$("#person-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#person-name").value.trim();
  const org = $("#person-org").value.trim();
  const fit = $("#person-fit").value.trim();
  const move = $("#person-move").value;
  const dnc = $("#person-dnc").checked;
  if (!name) { narrate("A name is the one thing I can't guess — add that and I'll keep the rest."); return; }
  if (!dnc && !fit) { narrate(`I need one line of context for ${name} — why them? I draft only from what's on record, never from guesses.`); return; }
  const person = {
    id: "u-" + Date.now().toString(36),
    name, org: org || "—", fit, move,
    suppressed: dnc,
    suppressReason: dnc ? "You marked this person do-not-contact." : "",
    draft: "", status: dnc ? "suppressed" : "waiting", user: true
  };
  state.queue.push(person);
  persistPeople();
  renderQueue();
  populateStudioPeople();
  e.target.reset();
  switchView("queue");
  if (dnc) narrate(`${name} is on your do-not-contact list. I'll never draft for them, and I'll say so if they ever come up.`, "log-refusal");
  else narrate(`${name} is in your queue, saved on this phone. Tap “Draft” on their card, or let the Next best action find them.`, "log-done");
});

/* ---------------- Import your people ----------------
   Paste a list; it is parsed entirely on this device and nothing
   is uploaded anywhere. One person per line:
     Name
     Name, a note about them
     name,org,note            (CSV)
   A leading "!" marks the person do-not-contact. Names already in
   the queue are flagged as duplicates and always skipped. */

let importRows = [];

function parseImport(text) {
  const rows = [];
  const seen = new Set(state.queue.map(q => q.name.trim().toLowerCase()));
  String(text || "").split(/\r?\n/).forEach(raw => {
    let line = raw.trim();
    if (!line) return;
    let dnc = false;
    if (line.startsWith("!")) { dnc = true; line = line.slice(1).trim(); }
    if (!line) return;
    const parts = line.split(",").map(s => s.trim());
    const name = parts[0] || "";
    if (!name) return;
    let org = "", note = "";
    if (parts.length >= 3) { org = parts[1]; note = parts.slice(2).join(", "); }
    else if (parts.length === 2) { note = parts[1]; }
    const key = name.toLowerCase();
    const dupe = seen.has(key);
    if (!dupe) seen.add(key);
    rows.push({ name, org, note, dnc, dupe, include: !dupe });
  });
  return rows;
}

function renderImportPreview() {
  const wrap = $("#import-preview");
  const list = $("#import-list");
  if (!wrap || !list) return;
  if (!importRows.length) { wrap.hidden = true; list.innerHTML = ""; return; }
  wrap.hidden = false;
  list.innerHTML = importRows.map((r, i) => `
    <li class="import-row${r.dupe ? " import-dupe" : ""}">
      <label class="import-main">
        <input type="checkbox" data-import-include="${i}" ${r.include && !r.dupe ? "checked" : ""} ${r.dupe ? "disabled" : ""}>
        <span><strong>${escapeHtml(r.name)}</strong>${r.org ? ` · ${escapeHtml(r.org)}` : ""}${r.note ? `<span class="import-note">${escapeHtml(r.note)}</span>` : ""}</span>
      </label>
      ${r.dupe
        ? `<span class="import-badge">Already in your queue — skipped</span>`
        : `<label class="import-dnc"><input type="checkbox" data-import-dnc="${i}" ${r.dnc ? "checked" : ""}> Do not contact</label>`}
    </li>`).join("");
  $$("[data-import-include]", list).forEach(cb => cb.addEventListener("change", () => { importRows[Number(cb.dataset.importInclude)].include = cb.checked; }));
  $$("[data-import-dnc]", list).forEach(cb => cb.addEventListener("change", () => { importRows[Number(cb.dataset.importDnc)].dnc = cb.checked; }));
}

$("#import-preview-btn").addEventListener("click", () => {
  importRows = parseImport($("#import-text").value);
  renderImportPreview();
  if (!importRows.length) { narrate("Nothing to import yet — paste one person per line: a name, then an optional note after a comma."); return; }
  const fresh = importRows.filter(r => !r.dupe).length;
  narrate(`Parsed ${importRows.length} line${importRows.length === 1 ? "" : "s"} right here on this phone — nothing was uploaded anywhere. ${fresh} new, ${importRows.length - fresh} already in your queue. Check the rows, mark anyone do-not-contact, then add them.`);
});

$("#import-form").addEventListener("submit", e => {
  e.preventDefault();
  const chosen = importRows.filter(r => r.include && !r.dupe);
  if (!chosen.length) { narrate("No new people selected — duplicates are always skipped, and unchecked rows stay out."); return; }
  chosen.forEach((r, i) => {
    state.queue.push({
      id: "u-" + Date.now().toString(36) + "-" + i,
      name: r.name, org: r.org || "—", fit: r.note || "", move: "follow-up",
      suppressed: !!r.dnc,
      suppressReason: r.dnc ? "You marked this person do-not-contact at import." : "",
      draft: "", status: r.dnc ? "suppressed" : "waiting", user: true, imported: true
    });
  });
  persistPeople();
  renderQueue();
  populateStudioPeople();
  importRows = [];
  renderImportPreview();
  $("#import-text").value = "";
  switchView("queue");
  narrate(`Imported ${chosen.length} ${chosen.length === 1 ? "person" : "people"} into your queue — parsed and stored on this phone only. Reach drafts where a note gives it context, and never for anyone marked do-not-contact.`, "log-done");
});

/* ---------------- Draft studio ---------------- */

function populateStudioPeople() {
  const sel = $("#studio-person");
  const people = state.queue.filter(q => !q.suppressed);
  sel.innerHTML = people.map(q => `<option value="${escapeHtml(q.id)}">${escapeHtml(q.name)} · ${escapeHtml(q.org)}</option>`).join("");
}

$("#studio-generate").addEventListener("click", () => {
  const person = state.queue.find(q => q.id === $("#studio-person").value);
  if (!person) { narrate("Pick a person first — the studio drafts for people in your queue."); return; }
  const move = $("#studio-move").value;
  narrateUser(`Draft a ${MOVE_LABELS[move] || "message"} for ${person.name}`);
  if (!person.fit) { narrate(`Holding ${person.name} — no context on record, and the studio won't invent one.`); return; }
  const text = generateDraft(person, move);
  addApproval("studio", person.id, person.name, person.org, text, move, provenanceOf(person));
  switchView("approvals");
  narrate(`Studio draft for ${person.name} is in Approvals — built only from what's on record, in your ${store.profile.tone || "Warm"} tone. Approve it here, or copy it into a real app.`, "log-done");
});

/* ---------------- Profile: make it yours + trust controls ---------------- */

/* Text size (100 / 125 / 150%) — persisted in the profile and
   applied to the whole page, panel and stage alike. */
function applyTextSize() {
  const pct = Number(store.profile.textSize || "100");
  const root = document.documentElement;
  if (pct === 100) {
    root.style.fontSize = "";
    document.body.style.fontSize = "";
  } else {
    root.style.fontSize = pct + "%";
    document.body.style.fontSize = (16 * pct / 100) + "px";
  }
}

function fillProfileForm() {
  $("#profile-name").value = store.profile.name || "";
  $("#profile-role").value = store.profile.role || "";
  $("#profile-tone").value = store.profile.tone || "Warm";
  const ts = $("#profile-textsize");
  if (ts) ts.value = store.profile.textSize || "100";
  $("#profile-signoff").value = store.profile.signoff || "";
  $("#profile-intention").value = store.profile.intention || "Keep in touch with people who matter";
}

$("#profile-form").addEventListener("submit", e => {
  e.preventDefault();
  store.profile = {
    name: $("#profile-name").value.trim(),
    role: $("#profile-role").value.trim(),
    tone: $("#profile-tone").value,
    textSize: $("#profile-textsize") ? $("#profile-textsize").value : (store.profile.textSize || "100"),
    signoff: $("#profile-signoff").value.trim(),
    intention: $("#profile-intention").value
  };
  persist();
  applyTextSize();
  renderToday();
  narrate(storageOK
    ? `Saved — on this phone only. New drafts will sound like you: ${store.profile.tone} tone${store.profile.signoff ? `, signed “${store.profile.signoff}”` : ""}.`
    : "Saved for this session — this browser isn't keeping local storage, so it won't survive a reload.", "log-done");
});

$("#export-btn").addEventListener("click", () => {
  const payload = {
    exportedFrom: "Reach v2.2 (this phone, local data only)",
    sponsorStack: "Connection state is not exported. API keys never leave this phone in an export — they are not in this file.",
    profile: store.profile,
    people: state.queue.filter(q => q.user),
    savedDrafts: state.saved,
    followUps: store.nudges || [],
    sendsToday: sendCounts(),
    history: store.history
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reach-my-data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  narrate("Exported — one JSON file with your profile, your people, saved drafts, and touch history. It came from this phone and goes only where you send it.", "log-done");
});

$("#reset-demo-btn").addEventListener("click", () => {
  store.people = [];
  store.saved = [];
  store.nudges = [];
  store.day = freshDay();
  store.history = [];
  store.stats = { ...DEFAULT_STATS };
  persist();
  narrate("Demo reset — your added people, saved drafts, and today's touches are cleared; your profile stays. Reloading the seeds…", "log-done");
  setTimeout(() => window.location.reload(), 900);
});

$("#erase-btn").addEventListener("click", () => {
  const sure = window.confirm("Erase everything Reach keeps on this phone — profile, your people, saved drafts, history — and return to the fresh demo?");
  if (!sure) { narrate("Erase cancelled. Nothing was touched."); return; }
  try { window.localStorage.removeItem(LS_KEY); } catch (_) { /* already gone */ }
  narrate("Erased. This phone now holds only the fictional demo data. Reloading…", "log-done");
  setTimeout(() => window.location.reload(), 900);
});

/* ---------------- init ---------------- */

renderThreads();
renderQueue();
renderApprovals();
updateBadges();
populateStudioPeople();
fillProfileForm();
applyTextSize();
renderToday();
applyJudgeMode();
switchView("today");
narrate("Reach is ready. Never let a warm connection go cold — that's the whole idea.");
narrate("Today is on the stage: three small touches, each one read, drafted, and waiting on your approval. Tap “Next best action”, or take the 90-second tour in the panel.");
