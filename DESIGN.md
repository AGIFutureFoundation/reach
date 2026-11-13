# Reach — Design

**An accessibility-first phone agent for outreach.**
*AGI Future Foundation — hackathon build, 2026-11-13.*

> The rule that shapes everything: **everything has to be accessible from a phone.
> The agent reads the screen, taps, types, and replies.**

Reach is a working demo of that rule, built as an outreach tool. This document is
the thinking pass: who it serves, why outreach is the right job for it, what a
phone browser can honestly do today, what the demo proves, and where the real
product goes next.

Status labels used throughout, per the network design system: **Live** (in the
demo now), **Planned** (designed, not built), **Roadmap** (needs a native layer
or a connector that does not exist yet).

## The event frame

Reach was built at **Do Not Disturb: Phone Use Hackathon** (organiser:
**Exit 1**; co-hosts include Sahar Mor / Bond AI, Intertech Talents, and
Tavily Events), Frontier Tower edition, 2026-11-13. The event's rule is the
brief above — every project must be phone-accessible, built for agents that
use a phone — and its tagline is the thesis Reach is built on:

> "Your phone is on Do Not Disturb. Your agent isn't."

Partners and sponsors published for the series: Entrepreneurs First, Phone
Use, LangChain, Replit, Bond AI, Intertech Talents; Tavily co-hosts this
edition. Two of those names shape the architecture below directly: the demo
includes one visible **web-research step** in the reply flow (the research
slot a production agent fills with a Tavily-style lookup), and the
production agent loop is described as an **orchestration graph** —
perceive → research → draft → approve → act → verify — of the kind
LangChain-style frameworks formalise. The demo itself is dependency-free
vanilla JS: it borrows the shape, not the libraries, and says so.

---

## 1 · The accessibility thesis

### Who this serves

- **People with motor impairments** for whom fifty small taps through a CRM,
  an inbox, and a spreadsheet is not an inconvenience — it is the whole cost of
  the work, paid every day, in pain or fatigue.
- **People with low vision** who can direct work by voice and ear far more
  easily than they can scan dense desktop tables.
- **Hands-busy workers** — carers, tradespeople, community organisers between
  visits — whose work happens away from desks and whose outreach dies in a
  desktop tab they never reopen.
- **Anyone whose phone is their only computer.** For a large share of the
  world's community organisers, that is simply true. Desktop-first outreach
  tooling quietly excludes them from running outreach at all.

### Why "reads the screen, taps, types, replies" is the whole interface

Outreach is, mechanically, a loop of four acts: **read** what someone said,
**decide** what to say back, **type** it, **send** it — repeated across an
inbox and a contact queue. Every one of those acts is also a barrier when the
interface assumes a mouse, a large monitor, and two free hands.

Reach collapses the loop to one instruction and one decision:

1. The human says (or types) what they want: *"Reply to the first unread
   message." "Work the outreach queue."*
2. The agent **reads** the screen itself, **taps** through the app, **types**
   a draft.
3. The human makes the only decision that must stay human — *approve this
   exact text?* — with one tap or one spoken word.
4. The agent sends, and **narrates** what it did in plain language.

The narration is not decoration. A live, plain-language action log — every
read, tap, and type announced as it happens — is what makes the work
**checkable by ear**. A user who cannot watch the screen can still audit the
agent. That is the accessibility proof, and it is why the log is a first-class
surface in the demo, driven through an ARIA live region so a screen reader
speaks it too.

### Design commitments that follow

- **Voice and text are equals.** Voice command in (Web Speech API) and voice
  narration out (speech synthesis) are offered, never required. Every voice
  action has a tap equivalent of the same size and prominence.
- **One decision at a time.** Approvals arrive as single cards, in order,
  with the full draft text visible. No batch-approve, no "send all".
- **Nothing is hover-only, nothing is small.** Touch targets are 48px or
  larger; focus rings are 3px and visible on light and dark grounds; the
  layout survives 200% zoom without horizontal scrolling.
- **Motion explains, never decorates.** The moving highlight that shows where
  the agent is "looking" is information. Under `prefers-reduced-motion` it
  disappears and the narration carries the same information alone.

---

## 2 · The outreach thesis

### The problem: outreach is trapped on desktops

The network's real outreach programme — the 30,000-person programme run by the
AGI Future Foundation since 2026-11-11 — lives in CRM tables, harvested
contact pools, per-wave send packs, and a webmail window. It works, but every
step assumes a desk. The person who actually knows the community — who met
the tool-library coordinator, who runs the night market — is rarely the
person sitting in front of that stack. So outreach centralises to whoever
can operate the tooling, and the knowledge and the sending drift apart.

### The Reach answer: bring the queue to the phone, keep the rails

Reach does not loosen the programme's discipline to make it mobile. It
carries the discipline in as **system behaviour**:

| Programme rail (real, from the running programme) | How Reach embodies it |
|---|---|
| **Draft-first, exact-copy approval.** Nothing sends that a human has not read and approved verbatim. | Every send is gated behind an approval card showing the full draft. The agent cannot approve its own work. (**Live**) |
| **Suppression is law.** Anyone who asked not to be contacted — bounced, unsubscribed, declined — is never contacted again. | Suppression is checked **before drafting**, not before sending. Faced with a suppressed contact, the agent refuses, skips, and says why in the log. No draft is ever produced for them. (**Live**) |
| **Personalisation gate.** Every outreach record needs a real reason this person, from a real source — or the send is held, never invented. | Queue items carry a visible *fit note* (why this person, from what signal). An item without one is held by the agent, not padded out — the gate is enforced as code in the queue flow, the draft-one path, and the studio. (**Live** since v2) |
| **Caps and pacing.** 90 sends/day per mailbox, ≤250 cold sends/day, sends spaced rather than blasted; a day already over cap stops the wave. | The caps are **hard counters in the day's persisted state**: every staged send decrements the visible count on Today, and at the cap the send is refused and the draft held for tomorrow. (**Live** since v2.1; narration-only before) |
| **Published contacts only.** Pools are built from published emails, never inferred or pattern-generated. | A one-line data-provenance travels with each queue item and approval card — *Seed demo data* / *Source: added by you* / *Source: imported by you*. (**Live** since v2.1) |
| **Verified numbers only.** The programme reports Sent-verified counts, never "we sent about…". | The demo's summary flow counts actual state — unreads, drafts, sends that happened in the session — nothing projected. (**Live**) |

### Why this is genuinely useful, not a novelty

- **The queue becomes a five-minute phone task.** Approve three drafts from a
  bus seat and the day's outreach is done — by the person who knows the
  recipients, not by whoever was free at a desk.
- **Replies stop dying.** Inbound replies are where outreach converts to
  relationships; they are also what a busy organiser misses. "Reply to the
  first unread" is a complete morning routine in one instruction.
- **The rails travel with the tool.** Desktop outreach keeps its discipline
  in documents and habit. In Reach the discipline *is* the interaction —
  you cannot skip the approval, you cannot draft to a suppressed contact,
  because the agent's hands are the only hands and they refuse.

---

## 3 · Honest architecture — what a phone can do today

Reach never claims a capability the build does not have. The demo is labelled
**Demo — fictional data** in its own header, and this section is the claim
boundary.

### Layer 1 — The phone browser (what this demo is) — **Live**

A static progressive web app. No server, no build step, installable to the
home screen.

- **Screen reading = structured reading.** Inside the app's own stage, the
  agent reads the same DOM a screen reader reads — real elements, real text,
  real state. This is deliberate: the honest proxy for how a native agent
  should perceive a phone is the **accessibility tree**, not screenshots and
  pixel-guessing.
- **Taps and types are real operations** on the staged apps: opening a thread
  changes state, typing fills the actual composer, sending appends the actual
  message to the thread. Nothing is a video or a mock animation of work that
  isn't happening.
- **Voice in:** the Web Speech API (`SpeechRecognition`) where the browser
  offers it (Chrome/Android, Safari partial); the mic button explains itself
  and steps aside where unsupported. **Voice out:** `speechSynthesis`
  behind an explicit toggle.
- **Limits, stated plainly:** a web page cannot read or touch *other* apps.
  The stage is a simulation of the phone, not control of the phone. Anyone
  who tells you their web demo drives your real WhatsApp is not telling the
  truth; Reach's demo drives its staged Messages and Outreach apps, for real,
  inside the page.

### Layer 2 — Android native (the real product's next step) — **Roadmap**

Android is where a true cross-app phone agent is permitted to exist:

- An **AccessibilityService** exposes the live accessibility tree of other
  apps — the real version of what the demo reads from its stage — and can
  dispatch taps, scrolls, and text entry into fields.
- A **NotificationListenerService** surfaces inbound replies across apps,
  which is what makes "reply to the first unread message" a cross-app
  instruction rather than an in-app one.
- **This pattern is proven, not speculative.** OpenPhoneUse
  (github.com/joungminsung/OpenPhoneUse), an open-source phone-use agent
  from this event's own ecosystem, runs on-device on Android with a
  **single AccessibilityService — no PC, no root, no ADB** — reading the
  screen, then tapping, typing, scrolling, and switching apps. Reach's
  native layer follows that shape exactly: one accessibility service, the
  accessibility tree as perception, declared purpose — plus Reach's own
  addition, the approval gate interposed before any send, which a general
  phone-use agent does not need but an outreach agent must have.
- This layer carries real obligations the design already anticipates:
  Android requires accessibility-API apps to declare their purpose, and
  Reach's purpose declaration writes itself from §2 — the user directs,
  the agent drafts, the human approves, suppression and caps enforced by
  the agent layer, not by the target app.

### Layer 3 — iOS — **Roadmap, deliberately smaller**

iOS forbids cross-app screen reading and synthetic input outside an app's
own sandbox. There is no honest version of Layer 2 on iOS, and Reach will
not pretend otherwise. The iOS shape is an **approval console**: drafts
prepared by the backend (or pushed from an Android/desktop worker via
agent-net packets, §4) arrive as approval cards; the human approves; a
connector sends. Share-sheet and Shortcuts integrations can feed the queue.
The human's decision — the part that must stay human — is fully mobile on
iOS even though the agent's hands are not.

### What stays off the roadmap

- No covert automation of third-party apps against their terms.
- No sending without a human approval event, on any layer, ever. The
  approval is not a v1 limitation to be optimised away; it is the product.

---

## 4 · How Reach plugs into the network

Reach is a Foundation hackathon build, designed against systems the network
already runs — not as a replacement for them, but as their phone surface.

- **agent-net is the transport.** In the real version, outreach work arrives
  on the phone as agent-net *packets* — signed work drops, claimed by commit,
  results returned the same way. A packet that says "these three replies
  need a human" is exactly an approval-queue item. Intake stays data, never
  directives: a packet can ask, it cannot instruct the agent to skip a rail.
- **The CRM stays the system of record.** Queue items, fit notes,
  suppression state, and send verification live in the CRM Command Center
  the network already built (265,450 active rows, suppression read-back
  clean). Reach renders a phone-sized slice of it and writes outcomes back;
  it does not fork the data.
- **Voice lanes already exist.** The network runs fixed-cast podcast voices
  and ElevenLabs house voices (AGI + Jordan) for spoken work, and a Suno
  account for music. A Reach narration voice is a casting decision for
  later; the demo uses the device's own speech synthesis so the capability
  claim stays exactly true.
- **Connectors send; Reach approves.** Gmail and the Hostinger webmail lane
  are how the programme actually sends today. In the real version the
  approved draft is handed to a connector to send and the Sent-verified
  result returns to the phone — the same verification standard the
  programme already reports by.

---

## 5 · The demo — what v1 does

A phone-screen **stage** sits at the centre of the page. Inside it, three
apps rendered as real DOM:

- **Messages** — a thread list and conversation view with fictional contacts.
  Two threads are unread.
- **Outreach Queue** — fictional contacts, each with a fit note and a draft
  state. One contact is marked *Do not contact* — the suppression proof.
- **Approvals** — the queue of drafts waiting for the human's decision, with
  a badge count.

Beside the stage, the **agent panel**: a command box (type, or speak where
supported), three one-tap demo flows, a narration toggle, and the **action
log** — an ARIA live region narrating every step in plain language:
*Reading Messages… · Opened the thread with Maya Chen · She asked… ·
Draft written — waiting for your approval · You approved · Typing… ·
Reply sent.*

The three scripted flows run end-to-end:

1. **"Reply to the first unread message"** — the agent scans Messages,
   opens the first unread thread, reads the last message, then runs one
   visible **research step**: it looks the sender's organisation up and
   shows a profile card before drafting. In the demo that card is a
   staged profile, labelled on its face as simulating the live
   web-research lookup (the Tavily slot in the production orchestration);
   the finding is narrated like every other step. Then it drafts a reply
   in context and parks it in Approvals. Nothing sends until the human
   approves; approval triggers the typing animation and the message
   visibly lands in the thread.
2. **"Work the outreach queue"** — the agent walks the queue in order:
   drafts for the contacts with fit notes, an explicit refusal-and-skip for
   the suppressed contact, each draft parked in Approvals one at a time,
   with cap/pacing narration as sends are approved.
3. **"Summarize what you see"** — the agent reads the current stage state
   and reports counts that are true of the session: unreads, drafts
   waiting, sends completed, contacts skipped and why.

Free-text commands route by intent ("reply…", "queue…", "summarize…",
"approve" approves the oldest waiting draft — including by voice).

---

## 6 · Judging criteria mapping

| Criterion | Where Reach answers it |
|---|---|
| **Everything accessible from a phone** | The whole product is one mobile web page. The stage, the agent, the approvals — no desktop surface exists or is needed. Add-to-homescreen via the web app manifest. |
| **Agent reads the screen** | The agent perceives the staged apps through their real DOM — the web-honest form of the accessibility tree — and its reads are narrated. |
| **Agent taps** | Every navigation and button press in a flow is executed by the agent on real elements, with a visible highlight showing where it acted. |
| **Agent types** | Drafts are typed into real composers and approval cards by the agent; the human edits nothing unless they choose to. |
| **Agent replies** | Replies and outreach sends land as real state changes in the staged threads and queue — after the human's approval, which is the point. |
| **Useful, not a toy** | It runs a real programme's real workflow — reply handling and a rail-bound outreach queue — with that programme's actual rules (approval, suppression, personalisation, caps) enforced as behaviour. |
| **Accessibility beyond the brief** | The tool is *for* accessibility and *built* accessibly: 48px targets, AA contrast, ARIA live narration, screen-reader operable, reduced-motion support, 200%-zoom safe. |
| **Honesty** | Fictional data, labelled. Capability claims stop exactly where the build stops; the native path is a labelled roadmap, including the iOS boundary. |

---

## 7 · Roadmap

1. **v1 (this build)** — staged demo: Messages + Outreach Queue + Approvals,
   three flows, voice in/out where the browser supports it. **Live**
2. **v1.1** — personalisation-gate enforcement in the queue flow (hold items
   with no fit note), hard cap counters, per-item provenance lines.
   *The gate landed early, in v2 (§9); the counters and provenance
   landed in v2.1 (§10).*
3. **v2 (shipped — see §9)** — the habit layer: Today home, local profile,
   your people, draft studio, Copy/Share bridge, Listen mode, trust
   controls. **Live**
4. **v2.1 (shipped — see §10)** — the deep build: hard cap counters +
   provenance, paste-import, follow-up nudges, service-worker shell,
   text size + approval-card keyboard operation. **Live**
5. **v3** — connector-backed: a real inbox behind the stage (read-only
   first), approvals handed to a send connector, Sent-verification returned
   to the phone. agent-net packets as the work transport. **Roadmap**
6. **v4** — Android native layer: AccessibilityService reading + input,
   notification-driven reply queue. iOS approval console. **Roadmap**

---

## 8 · Non-goals and refusals

- Reach will not send anything a human has not approved, in any version.
- Reach will not draft to a suppressed contact, infer a contact's address,
  or invent a personalisation reason.
- Reach will not claim native phone control from a web build.
- Reach's demo data is fictional — no real person, organisation, or CRM row
  appears in the stage.

---

## 9 · v2 — the habit layer: from outreach tool to daily ritual

v1 answered the hackathon brief. It did not yet answer the harder
question: **why would a person open this tomorrow?** v2 is the answer,
and it changes the product's centre of gravity without moving a single
v1 rail.

### The promise

> **Never let a warm connection go cold.**

Outreach (v1's frame) is something a programme does to a list. Warmth is
something a person maintains with *their* people — the reply that's been
sitting two days, the thank-you that was meant and never sent, the
collaborator from spring who quietly drifted. Those losses are not a
discipline problem; they are a *bandwidth* problem, and they happen on
phones, in two-minute pockets of time. v2 makes Reach the agent of those
pockets: founders, community builders, freelancers, organisers, job
seekers — anyone whose network is their livelihood and whose desk is
wherever they are standing.

### The habit loop

1. **Trigger — Today, not an inbox.** The app opens on a Today screen:
   a greeting, three missions (Reply · Thank · Reconnect), and **one**
   Next best action button. The unit of work is a *named person*, never
   a count of records. Decision fatigue — the thing that kills CRMs on
   phones — is designed out by making the next action singular.
2. **Action — the v1 loop, unchanged.** Read → research → draft →
   approve → act → verify. The human's contribution stays exactly one
   decision per message, by tap or voice.
3. **Reward — a finish line, not a feed.** Three touches a day, shown as
   sparks that fill. At three, or when nothing is pending, Today says
   *“You're clear — every warm connection is warm”* and stops asking.
   A tool that lets you finish earns tomorrow's open; a tool with an
   infinite queue trains you to avoid it.
4. **Investment — it becomes yours.** A local profile (name, tone,
   sign-off, intention) makes drafts sound like their author; the people
   you add and the history you accumulate make each day start smarter
   than the last. Investment is stored **on the device only** — the
   privacy posture below is what makes the investment safe to make.

### What v2 adds, mapped to the loop

| Addition | Loop role | Status |
|---|---|---|
| **Today home** — greeting, sparks (3 touches/day, persisted per calendar date), missions, one Next best action, all-done state | Trigger + reward | **Live** |
| **Make it yours** — profile (name, role/goal, tone Warm/Direct/Playful, sign-off, intention) in localStorage, schema-versioned, graceful fallback when storage is unavailable | Investment | **Live** |
| **Your people** — add-person form (context + move, or do-not-contact) joining queue + missions, persisted; seeds labelled; reset restores seeds and never silently overwrites user entries | Investment + trigger | **Live** |
| **Draft studio** — person × move generation from on-record facts only; unknowns as `[bracketed prompts]`; the §2 personalisation gate enforced as code (no context → hold, with the reason narrated) | Action | **Live** |
| **Copy / Share** on every approval card, plus **Save for later** (persisted, restorable) | Action — the bridge out | **Live** |
| **Listen mode** — the day read aloud in order (unreads → next action → waiting drafts → touches); voice commands extended: next, copy, skip, thank, reconnect, listen | Trigger, eyes-free | **Live** |
| **Trust controls** — Export my data (JSON) and Erase my data (confirmed local wipe to seeds) in the profile panel | Investment safety | **Live** |
| **Guided demo** — “Show me Reach (90 seconds)”: Today → draft → approval → completion, hands-free, narrating value; at the approval step it says plainly that in real use that tap is the human's, and that the tour presses it as a stand-in | Judging flow | **Live** |

### The Copy/Share bridge — v2's honest answer to “but does it send?”

Until connectors exist (v3), a web build cannot send from a user's real
apps — §3 says so and v2 does not fudge it. What v2 does instead is make
the human's carry trivial: one tap copies the exact approved text, or
opens the phone's share sheet with it. The draft crosses into the real
world *in the user's own hand*, which keeps the approval rail literally
true: Reach never sends; the user sends Reach's draft from their own
app, or approves the staged send in the demo. Copy/Share completions
count as touches, because in the user's day they are the completed
connection. When a connector lands, it replaces the bridge on that lane
only — the card, the approval, and the count stay identical.

### Privacy posture

- No account, no server, no external request. The build makes zero
  network calls beyond loading its own static files.
- Profile, people, saved drafts, day counters, and history live under
  one namespaced, schema-versioned localStorage key. If storage is
  blocked, Reach degrades to in-memory state and says so when saving a
  profile.
- The seeded stage remains fictional and is labelled as such in the
  header chip, the Today note, and the footer. User-added data is marked
  “Added by you” wherever it renders.
- Export is a user-initiated download; Erase is a confirmed, total,
  local wipe. There is no telemetry to opt out of because there is none.

### What v2 deliberately did not do

- No notifications, streaks, or badges beyond the day itself — the
  all-done state is the retention mechanic; nagging would betray the
  “Do Not Disturb” thesis the product was born under.
- No background sync, no address book access. (v2.1 added the narrow,
  honest form of import — a list the user pastes themselves, parsed
  on-device — see §10. Address-book access still arrives only with the
  connector layer, under the programme's published-contacts-only rule.)
- No loosening of §8. The guided demo's single stand-in approval is
  narrated as exactly that, and no other flow can approve anything.

---

## 10 · v2.1 — the deep build: rails become state

v2 made Reach a habit. v2.1 makes its claims *mechanical*. Everything in
this pass was previously true as narration or documentation; now it is
true as code, persisted in the same on-device store (schema v3, migrated
forward from v2 — profile, people, and history survive the upgrade).

| Addition | What changed | Status |
|---|---|---|
| **Cap counters** | Sends live in the day state: mailbox sends against 90/day, queue/studio sends also against ≤250 cold/day. Today shows them ("3 of 90 sends used today"); at the cap, approval is refused with the reason narrated and the draft held — the exact behaviour the real programme's stop-the-wave rule describes. | **Live** |
| **Provenance lines** | One line on every queue card and approval card: *Seed demo data* · *Source: added by you · context on record* · *Source: imported by you · context on record* · *Nudge you scheduled*. Provenance is part of the item, persisted with saved drafts. | **Live** |
| **Paste-import** | One person per line — `Name`, `Name, note`, or CSV `name,org,note`; `!` prefix or per-row toggle marks do-not-contact; duplicates against the existing queue (and within the paste) are flagged and always skipped. Parsed entirely on-device; the form says, in bold, that nothing is uploaded anywhere. Imported people join the queue, the missions, and the studio like added people, flagged *Imported by you*. | **Live** |
| **Follow-up nudges** | After a staged send, a copy, or a share, Reach offers *Nudge in 3 / 7 / 30 days*. The nudge persists; when due it appears on Today as a fourth row — **Due follow-ups** — leads the Next best action, and drafts the follow-up from the on-record context in one tap. No notifications: the row is the reminder, which keeps the Do Not Disturb thesis intact. | **Live** |
| **Service worker** | Same-origin, versioned (`reach-shell-v3`), cache-first with background refresh for the app shell only; `skipWaiting` on update, old caches dropped on activate. Registered from index.html inside try/catch as progressive enhancement — with the worker blocked or absent, the app is byte-for-byte the v2 experience. | **Live** |
| **Text size** | 100% / 125% / 150%, chosen in the profile, persisted with it, applied to panel and stage alike on every load. | **Live** |
| **Keyboard approvals** | Approval cards are focusable; ↑ / ↓ move between cards, **A** approves, **C** copies, **S** shares — never while editing the draft text. After any flow completes, focus returns to the control that launched it (or the current view's tab), and after a decision, to the next waiting card. | **Live** |

Verification for this pass: the v2 smoke harness was extended from 28 to
67 assertions — the original 28 (flows, gate, suppression, save/restore,
tour) plus counters decrementing and persisting, refusal at the cap,
provenance rendering, import parsing/dedupe/do-not-contact, nudge
scheduling/surfacing/drafting, and text-size persistence across a
simulated reload. All pass against the real `app.js`.
