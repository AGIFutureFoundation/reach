"use strict";
/* Reach — accessibility-first phone agent (demo).
   Every person and organisation below is fictional. The agent reads the
   stage's real DOM, acts on real elements, and never sends anything
   without a human approving the exact text first. */

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
      status: "waiting"
    }
  ],
  approvals: [] /* {id, kind: 'reply'|'outreach', refId, toName, org, text} */
};

let approvalSeq = 0;

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

function speak(text, force) {
  if (!("speechSynthesis" in window)) return;
  if (!force && !speakToggle.checked) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.03;
  window.speechSynthesis.speak(u);
}

function narrate(text, cls) {
  const li = document.createElement("li");
  if (cls) li.className = cls;
  li.textContent = text;
  logEl.appendChild(li);
  while (logEl.children.length > 60) logEl.removeChild(logEl.firstChild);
  logEl.scrollTop = logEl.scrollHeight;
  speak(text);
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

const VIEW_TITLES = { messages: "Messages", thread: "Conversation", queue: "Outreach Queue", approvals: "Approvals" };

function switchView(name) {
  state.activeView = name;
  ["messages", "thread", "queue", "approvals"].forEach(v => {
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
    suppressed: ["Do not contact", "status-suppressed"]
  };
  ul.innerHTML = state.queue.map(q => {
    const [label, cls] = labels[q.status] || labels.waiting;
    return `<li><article class="queue-card" data-queue="${q.id}">
      <h3>${escapeHtml(q.name)}</h3>
      <p class="queue-org">${escapeHtml(q.org)}</p>
      ${q.suppressed
        ? `<p class="suppress-note"><strong>Do not contact.</strong> ${escapeHtml(q.suppressReason)}</p>`
        : `<p class="fit-note"><strong>Why them:</strong> ${escapeHtml(q.fit)}</p>`}
      <p class="queue-status ${cls}">${label}</p>
    </article></li>`;
  }).join("");
}

function renderApprovals() {
  const wrap = $("#approval-list");
  $("#approvals-empty").hidden = state.approvals.length > 0;
  wrap.innerHTML = state.approvals.map(a => `
    <article class="approval-card" data-approval="${a.id}">
      <p class="approval-kind">${a.kind === "reply" ? "Reply" : "Outreach"} · waiting for your decision</p>
      <p class="approval-to">To: ${escapeHtml(a.toName)} · ${escapeHtml(a.org)}</p>
      <label class="visually-hidden" for="draft-${a.id}">Draft message to ${escapeHtml(a.toName)} — edit if you like, then approve the exact text</label>
      <textarea class="approval-draft" id="draft-${a.id}" rows="6">${escapeHtml(a.text)}</textarea>
      <div class="approval-actions">
        <button type="button" class="approve-btn" data-approve="${a.id}">Approve &amp; send</button>
        <button type="button" class="skip-btn" data-listen="${a.id}">Listen</button>
        <button type="button" class="skip-btn" data-skip="${a.id}">Skip</button>
      </div>
    </article>`).join("");
  $$("[data-approve]", wrap).forEach(b => b.addEventListener("click", () => approveApproval(b.dataset.approve)));
  $$("[data-skip]", wrap).forEach(b => b.addEventListener("click", () => skipApproval(b.dataset.skip)));
  $$("[data-listen]", wrap).forEach(b => b.addEventListener("click", () => {
    const a = state.approvals.find(x => x.id === b.dataset.listen);
    const ta = a && $("#draft-" + a.id);
    if (ta) speak(ta.value, true);
  }));
  updateBadges();
}

/* ---------------- approvals: the human decision ---------------- */

function addApproval(kind, refId, toName, org, text) {
  const a = { id: "a" + (++approvalSeq), kind, refId, toName, org, text };
  state.approvals.push(a);
  renderApprovals();
  return a;
}

async function approveApproval(id) {
  const idx = state.approvals.findIndex(a => a.id === id);
  if (idx === -1) return;
  const a = state.approvals[idx];
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
    narrate(`Reply sent to ${t.name}. It's in the thread now — you can scroll up and check it.`, "log-done");
  } else {
    const q = state.queue.find(x => x.id === a.refId);
    q.status = "sent";
    state.sentCount += 1;
    renderQueue();
    switchView("queue");
    await agentTouch($(`[data-queue="${q.id}"]`), `You approved it. Sending to ${q.name} at ${q.org}…`);
    narrate(`Sent to ${q.name}. That's send number ${state.sentCount} this session.`, "log-done");
    narrate("The real programme spaces sends out and caps each mailbox at 90 a day — Reach keeps that pace instead of blasting the whole queue at once.");
  }
}

function skipApproval(id) {
  const idx = state.approvals.findIndex(a => a.id === id);
  if (idx === -1) return;
  const a = state.approvals[idx];
  state.approvals.splice(idx, 1);
  if (a.kind === "outreach") {
    const q = state.queue.find(x => x.id === a.refId);
    if (q) { q.status = "skipped"; renderQueue(); }
  }
  renderApprovals();
  narrate(`Skipped the draft for ${a.toName}. Nothing was sent.`);
}

/* ---------------- the three demo flows ---------------- */

function setBusy(b) {
  state.busy = b;
  $$(".flow-btn").forEach(btn => { btn.disabled = b; });
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
      narrate(`Before drafting, I'll look up ${t.org}. In the live product this step is a web-research lookup (Tavily-style); in this demo it reads a staged profile — the card says so on its face.`);
      const card = $("#research-card");
      $("#research-text").textContent = t.profile;
      card.hidden = false;
      await agentTouch(card, `Research found: ${t.profile}`);
    }
    narrate("Drafting a reply that answers it…");
    await wait(900);
    addApproval("reply", t.id, t.name, t.org, t.draft);
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
        continue;
      }
      if (q.status === "sent") { narrate(`${q.name} — already sent this session.`); continue; }
      if (q.status === "drafted") { narrate(`${q.name} — a draft is already waiting for your approval.`); continue; }
      if (q.status === "skipped") { narrate(`${q.name} — you skipped their last draft, so I'll leave them alone unless you ask again.`); continue; }
      await agentTouch(card, `Reading the fit note for ${q.name} at ${q.org}: ${q.fit}`);
      narrate(`Drafting a personalised message for ${q.name}…`);
      await wait(900);
      q.status = "drafted";
      renderQueue();
      addApproval("outreach", q.id, q.name, q.org, q.draft);
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
  if (t.includes("summar") || t.includes("what do you see") || t.includes("what can you see")) return flowSummarize();
  if (t.includes("queue") || t.includes("outreach")) return flowQueue();
  if (t.includes("reply") || t.includes("unread") || t.includes("message")) return flowReply();
  narrate("In this demo I can do three things: reply to the first unread message, work the outreach queue, or summarize what I see. Try a big button — or type “approve” when a draft is waiting.");
}

$$(".flow-btn").forEach(btn => btn.addEventListener("click", () => {
  const f = btn.dataset.flow;
  if (f === "reply") { narrateUser("Reply to the first unread message"); flowReply(); }
  if (f === "queue") { narrateUser("Work the outreach queue"); flowQueue(); }
  if (f === "summarize") { narrateUser("Summarize what you see"); flowSummarize(); }
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
  narrate("You sent that one yourself, straight from the composer.");
});

/* ---------------- init ---------------- */

renderThreads();
renderQueue();
renderApprovals();
updateBadges();
switchView("messages");
narrate("Reach is ready. The stage below is a demo — every person on it is fictional, and nothing here can send anything real.");
narrate("Try a big button: I'll reply to the first unread message, work the outreach queue, or summarize what I see. I draft; you decide.");
