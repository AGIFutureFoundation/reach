# Voice + text outreach agents — review and staged setup

*Mike's order, 2026-11-13 12:01 PT: "review and set up agents to do
voice to voice calls as well as text outreach to contacts." This
document is the review and the setup design. **SET UP here means
specs, configs, and scripts staged and checked against the real
stack. Nothing has been dialed, sent, signed up for, or changed in
any console.** Every script lives in `VOICE-SCRIPTS.md` and is a
DRAFT pending Mike's approval. Claims are labelled VERIFIED
(read from source or a live account read today), REPORTED (from a
dated secondary record of a vendor page), or UNVERIFIED (not
proven by anything on record).*

---

## Part 1 — Review: what exists today

### 1.1 Reach's voice today — VERIFIED

From `INTEGRATIONS.md` and `integrations.js` / `app.js`, read
2026-11-13:

- **Out (speech):** ElevenLabs TTS, `POST
  https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`,
  `xi-api-key` header, model `eleven_flash_v2_5` (half-credit,
  fast). Default voice **Sarah — `EXAVITQu4vr4xnSDxMaL`**
  ("Mature, Reassuring, Confident"), chosen in v2.3 from the live
  account's 21-voice list ahead of George. The panel's Voice ID
  field overrides the default. One line owns the voice at a time;
  any failed line falls back to the browser voice for that line.
- **In (speech):** browser SpeechRecognition
  (`window.SpeechRecognition || webkitSpeechRecognition`, `app.js`)
  — on-device browser dictation for commands and drafting. There
  is **no server-side speech-to-text and no telephony audio path
  in Reach today** — Reach speaks and listens inside a browser
  tab, and nothing else.
- **Bring-your-own-key discipline:** the user's ElevenLabs key
  lives only in the on-device store, is excluded from Export, and
  is sent only to ElevenLabs. The fleet bridge key for PhoneUse is
  stricter still (page memory only). Any voice-agent setup below
  keeps this discipline: keys never enter this document, a repo,
  or a trace.

### 1.2 The ElevenLabs account reality — VERIFIED live read, 2026-11-13

Read today through the registered connector
(`custom.elevenlabs`, `el.py verify` + `el.py voices`, both 200):

| Field | Value |
|---|---|
| Account | "Wave" account, bioacoustics.cloud@gmail.com, workspace admin |
| Key on file | "Reach hackathon" key, created 2026-11-13 |
| Tier | **free** |
| Character limit | **10,000 characters/month** |
| Characters used | **0** |
| Voice slots | 3 total, **0 used** |
| Instant / professional voice cloning | **Not available on this tier** (both flags false in the account read) |
| Commercial use of output | **Not licensed on free** — free-tier output is non-commercial forever, and a later upgrade does not retroactively license it (connector doc, verified from ElevenLabs terms 2026-11-13) |

**What the free tier can carry:**

- Reach's read-aloud today: morning briefs and Listen mode for a
  demo. 10,000 characters ≈ **10 minutes of standard-model speech
  a month** (INTEGRATIONS.md); the Flash model Reach actually
  sends runs at half credit, so roughly twice that — still
  demo-scale, not programme-scale.
- A handful of test calls, if the voice-to-voice path below is
  piloted on the Agents free allotment (see 1.3).

**What it cannot carry:**

- Any real calling programme. At a modest shape — 15 answered
  calls a day across three desks, 4 minutes each — the fleet
  needs ≈1,800 call minutes a month, **120× the free Agents
  allotment**. Even the follow-up-only pilot (5 calls/day) needs
  ≈600 minutes.
- Any cloned voice (Mike's or anyone's): cloning is closed on
  this tier, full stop.
- Any commercial or published use of generated audio: unlicensed
  on free, permanently, for anything generated while free.

### 1.3 What a paid tier costs — REPORTED, dated

`elevenlabs.io` was not reachable from this environment today
(direct fetch blocked), so tier figures are REPORTED from
ElevenLabs' own pricing pages as read and cross-checked by
multiple pricing trackers on **2026-11-07 to 2026-11-10**. The
figures agree across sources; Mike should still confirm on the
live page before paying — prices exclude tax and change.

**Text-to-speech tiers** (elevenlabs.io/pricing):

| Tier | Price/mo | Credits/mo | ≈ standard speech | Notes |
|---|---|---|---|---|
| Free | $0 | 10,000 | ~10 min | No commercial licence, no cloning |
| Starter | $6 | 30,000 | ~30 min | Commercial licence starts here; instant cloning |
| Creator | $22 | 121,000 | ~121 min | Adds professional voice cloning |
| Pro | $99 | 600,000 | ~600 min | Higher-fidelity API audio |
| Scale | $299 | 1,800,000 | ~1,800 min | 3 seats |

**Voice-agent (ElevenAgents / Conversational AI) tiers**
(elevenlabs.io/pricing/agents) — this is the voice-to-voice
product: speech-to-text + LLM + TTS in one hosted agent, billed
per call minute, **separately** from the TTS credit pool:

| Tier | Price/mo | Included call minutes | Concurrent calls |
|---|---|---|---|
| Free | $0 | 15 | 4 |
| Starter | $6 | 75 | 6 |
| Creator | $22 | 275 | 10 |
| Pro | $99 | 1,238 | 20 |
| Scale | $299 | 3,738 | 30 |

Overage **$0.08/min** on every tier; burst (above concurrency)
$0.16/min; agent text messages $0.003 each. Two costs sit
**outside** these numbers on the vendor's own wording: **the LLM
and any telephony are billed separately, based on usage.** A
phone number and a telephony route are therefore a second setup
step (see §2.4), not something the ElevenLabs tier includes by
itself.

**Recommendation (Mike's purchase decision, not made here):**

- **Pilot: Creator ($22/mo).** 275 Agents minutes ≈ 60–90 short
  pilot calls, 10 concurrent — enough to prove one desk end to
  end. The same tier's TTS pool (121,000 credits) also covers
  Reach read-aloud headroom, and its commercial licence fixes
  the free tier's publishing bar.
- **Production: Pro ($99/mo).** 1,238 Agents minutes covers the
  follow-up-only programme shape (≈600 min/mo) with headroom;
  move to Scale only when the call log — not a forecast — shows
  sustained use above ~1,100 minutes.
- Starter is the floor if the only goal is the commercial TTS
  licence; it is not a calling tier (75 minutes).

### 1.4 PhoneUse calling capability — mostly UNVERIFIED, stated plainly

Two different things carry the PhoneUse name, and the record
proves different things about each:

**PhoneUse Local (the fork, AGIFutureFoundation/phoneuse) —
VERIFIED from the fork's README and `docs/REACH.md`, read
2026-11-13:**

- It is **screen control of a USB-connected iPhone from a Mac**:
  live video, OCR screen reading, tap / type / scroll, driven by
  natural-language tasks through the local API
  (`http://127.0.0.1:8765`) or MCP. Upstream states plainly that
  it "is separate from the hosted PhoneUse platform and does not
  include hosted phones."
- **There is no telephony API in it** — no endpoint places or
  receives a carrier call, and no phone number is exposed. Its
  demos do show app-level messaging by UI automation (a Telegram
  message sent, a DoorDash text update), which proves a task can
  operate a messaging app's interface on that iPhone — it does
  not prove anything about voice calls, and driving the Phone
  app's keypad by tap automation is **not a documented or
  verified calling path**. This design does not rely on it.

**The hosted console fleet (console.phoneuse.com) — inventory
VERIFIED, calling UNVERIFIED:**

- VERIFIED (vendor setup emails, relayed by Mike 2026-11-13, in
  PHONE-FLEET.md): five Google Pixel 7 Pro (US) hosted phones on
  the one account agent@agifellowship.church, paid until 13 Dec
  2026, device IDs as assigned in §2.1.
- **UNVERIFIED:** whether the hosted devices expose phone
  numbers, carry carrier service, can place or receive calls, or
  expose any console API at all. Nothing on record — no console
  page read, no vendor document — proves any of it.
  `FLEET_CONFIG.phoneuse.consoleApiBase` in the app stays `""`
  for exactly this reason. The verification step is §2.9, step 2,
  and it waits on the Fellowship console login landing.

**Consequence for the design:** voice-to-voice calls are designed
on the **ElevenAgents path** (hosted agent + a telephony route to
be set up), because that is the only calling stack whose
capabilities are actually documented. The fleet phones carry the
**text** channels and the Reach approval surface. If console
verification later proves the hosted Pixels can place calls with
numbers, the desks can add a phone-native call path as a second
route — the basis gate and scripts below are written to bind
either route unchanged.

### 1.5 The outreach law the agents inherit — VERIFIED from the record

From MEMORY.md and the programme files
(`~/workspace/your_files/outreach-15k/`: PROGRAM.md, SEGMENTS.md,
SEND-LOG.md, SUPPRESSION-LOG.md), read 2026-11-13:

- **Cold contact happens by email, in waves, or not at all.**
  Published institutional contacts only; no pattern-generated or
  inferred addresses; suppression diffed before every wave;
  48-address wave guard; caps **90/day per mailbox** and
  **≤250 cold/day programme-wide**.
- **The email voice rule (Mike, 2026-11-13):** everything is
  written from AGI's perspective — gracious and informative — and
  **always offers the human connection**: Mike generally, Russell
  Vacanti on Foundation matters, a Fellowship steward on
  Fellowship matters. Anyone who asks for a human leaves the
  automated thread immediately and is flagged to that human the
  same run.
- **Suppression is law,** on every channel, checked before
  drafting (Reach refuses a suppressed contact out loud, before
  any draft exists) and written back the same day on every
  outcome: bounce, unsubscribe, refusal.
- **Houses never cross:** a desk holds only its own holding's
  people, mailbox, and voice (PHONE-FLEET.md).

Voice and text inherit all of it, plus the stricter basis gate in
§2.3 — because a ringing phone is more intrusive than an email,
the voice channel's basis bar is set **higher** than email's, not
equal to it.

---

## Part 2 — Setup: the staged design

*Two named modules ride on every desk agent and are specified in
full at §2.7 and §2.8: **Module — Ask Humanity** (every agent can
invite people to the Twenty Questions and the 50 fields, explain
the project and its consent, and collects nothing) and
**Module — All-projects knowledge** (every agent can talk about
the whole network, grounded only on `AGENT-KNOWLEDGE.md`, and
abstains rather than improvising).*

### 2.1 Three voice agents, one per desk

Each desk's voice agent is the voice of that desk's Reach slot,
bound to that desk's assigned phone for text channels and to the
desk's ElevenAgents configuration for calls. Personas extend the
role cards in PHONE-FLEET.md; voices are picked from the verified
21-voice catalog read today.

| | Fellowship agent | Foundation agent | BuilderSpace agent |
|---|---|---|---|
| **Desk / phone** | Fellowship desk → Phone 1, `ACP6BC9P8ZEML2Z1` | Foundation desk → Phone 2, `ACP6BD9Q64XX8XE9` | BuilderSpace desk → Phone 3, `ACP6B99O2IWFKAA4` |
| **Reach profile name** | AGI Fellowship — community desk | AGI Future Foundation — partnerships desk | BuilderSpace — tour desk |
| **Persona** | A warm community coordinator for a hub for all faiths. Plain, invitational, unhurried. Never preaches, never ranks traditions. | A precise partnerships coordinator. Gracious, informative, exact about status — states what is filed and verified, and what is not. | A builder talking to builders. Concrete: formats, dates, run sheets. No hype. |
| **ElevenLabs voice** | **Sarah** — `EXAVITQu4vr4xnSDxMaL` ("Mature, Reassuring, Confident") | **Matilda** — `XrExE9yKIg1WjnnlVkGX` ("Knowledgable, Professional") | **Charlie** — `IKne3meq5aSn9XLyUdCD` ("Deep, Confident, Energetic") |
| **Why this voice** | Reach's default is already Sarah — the calmest, warmest read in the catalog — and the community desk is where calm matters most: shelters, food banks, gathering partners. Keeping her here also keeps the booth demo's voice familiar. | The partnerships desk trades in specifics — deadlines, documents, commitments. A knowledgeable, professional read carries detail without warmth curdling into salesmanship. Distinct from Sarah so a contact who hears both desks never confuses the houses. | The tour desk's calls are logistics with organisers and employers; an energetic, confident read matches builder-to-builder register without sounding like an ad. |
| **Model** | `eleven_flash_v2_5` for live call turns (latency, half credit); `eleven_multilingual_v2` for recorded voicemail drops where quality beats speed | Same | Same |
| **Human handoff** | A Fellowship steward | Russell Vacanti | Mike |
| **Mailbox it manages** | agent@agifellowship.church (L1) | x@agifuturefoundation.org (L2) | x@agicorp.network |

Voice-clone note: all three are catalog voices. **No cloned voice
is part of this setup.** If Mike wants his own voice used, that
is a separate, explicit consent step (§2.9, step 4) — and a
Creator-tier-or-above feature (professional cloning), unavailable
on the current free account in any case.

### 2.2 How a voice-to-voice call works (ElevenAgents path)

Staged configuration per desk agent — fields named so they map
onto an ElevenAgents agent definition when the tier exists:

```text
agent_id:            reach-voice-<fellowship|foundation|builderspace>
name:                "AGI — <holding> desk"
voice_id:            <per §2.1>
model_tts:           eleven_flash_v2_5
first_message:       <the desk's opening disclosure, VOICE-SCRIPTS.md §1>
system_prompt:       <the desk's rails block: identity disclosure,
                      purpose-only conversation, no claims beyond the
                      record, filed-fact-safe status lines, handoff
                      offer, refusal = end + suppress>
llm:                 <provider/model chosen at tier setup; billed
                      separately — a setup decision, §2.9 step 1>
telephony:           <number + route assigned at setup; §2.9 step 1>
tools:               handoff_flag, suppression_writeback,
                     call_log (LangSmith) — and nothing else:
                     no payment, signing, or submission tools exist
max_duration:        10 minutes hard cap per call
language:            en (additional languages only per-desk, later)
```

Flow discipline, every call:

1. **Disclosure in the first breath.** The agent's first sentence
   names itself as AGI, an AI agent, and the holding it calls for
   (scripts §1). No call opens as if a human were speaking.
2. **Purpose in the second breath.** One sentence: which sent
   email / request / listing this call follows up, and what the
   call is for. If the contact can't place it, the agent offers
   to re-send the email and ends the call — it does not pitch
   cold on a voice call, ever (§2.3).
3. **One goal per call** (§2.4's call types). The agent works
   toward that goal, answers questions only from what is on
   record for that desk, and says "I don't have that in front of
   me — I'll have [human] follow up" rather than inventing.
4. **Handoff always on the table.** The human offer is made on
   every call, early. A request for a human, at any point, ends
   the agent's part of the call: flag to the desk's human the
   same run, contact leaves the automated thread.
5. **Refusal ends everything.** "No," "stop," "don't call again,"
   or an unsubscribe in any wording → the agent thanks them, ends
   the call within one sentence, and the suppression write-back
   fires (§2.4). No rebuttal, no second ask, no "just one more
   thing."
6. **Logging.** Every call — answered, voicemail, no-answer,
   refused — emits one LangSmith run (§2.6). Metadata and outcome
   only.

### 2.3 The basis gate — who may be called or texted

Voice and SMS are **warm channels**. The gate is a property of
the contact record, checked before a call or text is staged, the
same way Reach checks suppression before drafting:

**A voice call may be staged only when at least one basis holds:**

| Basis | What it means | Provenance required on the call card |
|---|---|---|
| **Replied** | The contact replied to a programme email and the thread is live | SEND-LOG row + reply reference |
| **Requested** | The contact asked for a call (in a reply, a form, or a conversation on record) | The request, quoted or linked |
| **Relationship** | An existing working relationship on record — partner, venue, programme contact with prior two-way contact | The record of the prior exchange |
| **Published switchboard (verification only)** | A published institutional main line, called during that institution's business hours, only to verify a listing or a published fact (city-guide resources, venue details) | The published page the number came from |

**Never callable, no exceptions:**

- Anyone on the suppression list, in any lane, for any reason.
- Cold contacts. There is no voice equivalent of a cold wave —
  a CRM record with no reply, request, or relationship is
  **email-only**, inside the existing wave caps.
- Personal mobile numbers from any list, purchased data, or
  inference. Numbers come from the contact's own reply, their
  request, or the institution's own published page — nowhere
  else.
- Anyone who has asked for a human: they are with the human now.
- Outside reasonable hours: calls stage only for the contact's
  local business hours (09:00–17:00 for institutions; the
  window the contact themselves proposed, when they proposed
  one). Voicemail drops obey the same window.

**Text (SMS / messaging apps) basis:** the same four bases, minus
switchboard (no texting a switchboard). SMS is a follow-up
channel to a live thread, never an opener to a cold contact. The
email waves remain the only cold channel, under their existing
caps — and voice/text touches count in the desk's daily picture
on the Reach Today counters alongside sends, so no channel
quietly multiplies a desk's volume.

Volume guardrails for voice, staged as defaults for Mike to rule
on: **max 20 staged calls per desk per day, max 2 call attempts
per contact per week, one voicemail per contact per thread.**
These sit *inside* the programme caps; they never widen them.

### 2.4 Call types and flows

Four call types exist. Full wording for every line is in
`VOICE-SCRIPTS.md`; this is the flow each script implements.

**Type A — Follow-up on a sent email** (all desks).
Goal: reach the person who has the email but hasn't replied, and
earn either a reply, a meeting, or a clean no.
Flow: disclosure → "I'm following up on the email [desk] sent on
[date] about [one-line subject]" → the single specific ask from
that email → listen → handoff offer → close with the exact next
step and its date. If they never saw the email: offer to re-send
and end. Nothing new is pitched that wasn't in the email.

**Type B — Appointment setting** (all desks; only Basis =
Replied or Requested).
Goal: one confirmed time with the desk's human.
Flow: disclosure → purpose ("you asked about speaking with
[human]") → offer two concrete times → confirm one, including
timezone stated aloud → confirm the channel (phone / Meet) and
the number or link → close by repeating time + human's name.
The agent books nothing it cannot state exactly; scheduling
itself lands through the existing scheduling flow, and the call
card carries the confirmed details for the human's calendar.

**Type C — Resource verification** (Fellowship desk primarily;
Basis = Published switchboard).
Goal: keep the 15 city guides true — confirm a shelter, food
bank, pantry, or service point is still operating, its hours,
and its intake rules.
Flow: disclosure → "we list [organisation] in a community guide
and I'm verifying the listing" → confirm name, address, hours,
services, any change → thank them → close. Nothing is asked of
the organisation beyond the facts of its own listing; no
fundraising, no partnership pitch on a verification call. The
verified facts write back to the guide record labelled VERIFIED
with the call date — the same labelling discipline as the
research programme.

**Type D — Employer / partner discovery** (BuilderSpace desk;
Foundation variant for programme partners).
Goal: find the right human and the right published contact route
for a tour-town employer or a programme partner — not to pitch.
Flow: disclosure → purpose ("BuilderSpace runs builder sessions
in [town]; I'm identifying who handles community partnerships")
→ ask for the right person and their published email → thank
them → close. Anything learned stages as a **research note**; a
new contact enters the CRM only through the programme's normal
published-contact gates — a phone call never mints a mailable
contact by itself.

**Voicemail** (all types): one script per desk (scripts §10) —
name, holding, one-line purpose, the human's name, the desk's
email as the reply route, and a plain statement that no further
calls follow unless they reply. **One voicemail per contact per
thread**, ever (§2.3).

**Refusal / stop handling** (scripts §7): one sentence of thanks,
call ends, and within the same run: (1) suppression record
written — address **and** number, all lanes, all phones; (2)
people-graph contact event noting the refusal and channel; (3)
the queue item closed as refused with the LangSmith trace ID.
The same write-back fires for "stop" by text and unsubscribe by
email — one suppression record, every channel honours it.

### 2.5 Text outreach agents — per phone, channels in order

Text runs on the desk's assigned fleet phone (once console
execution is verified, §1.4) and, until then, through the
programme's existing lanes — the design is channel-ordered so
the phone slots in without changing the law:

1. **Email (unchanged).** The wave programme is the cold channel
   and the system of record. Text never replaces a wave item; it
   follows one.
2. **SMS follow-up (warm only).** To contacts with a §2.3 basis
   and a number they themselves supplied or published for their
   role: a short follow-up to a specific sent email or a
   confirmed appointment (templates in scripts §8). Sent from the
   desk's phone so the thread lives on the holding's own device.
   STOP in any reply suppresses everywhere, same write-back as
   voice.
3. **In-app messages (where the holding's accounts exist).**
   Instagram / Threads / LinkedIn messages on the holding's own
   accounts, inside the social pacing law (one platform at a
   time, ~2 min between actions, ≤25 actions/platform/day, first
   warning = full stop that platform that day). A phone never
   operates another holding's accounts — Fellowship accounts are
   never run from the Foundation or BuilderSpace desk, per
   PHONE-FLEET.md's wiring spec.

Every text template is staged in `VOICE-SCRIPTS.md` §8 as a
DRAFT. Texts carry the same voice rule as email: from AGI,
gracious and informative, human offered — in 160 characters that
means the offer is a standing line ("Reply here, or ask for
Russell and he'll pick it up himself"), not an afterthought.

### 2.6 Call logging — LangSmith trace schema (staged)

Project **`reach`** (created 2026-11-13; id
`b87d1237-b76e-486d-8fe3-e650067df1b1`), same project as Reach's
existing runs, so a call sits in the same audit trail as the
draft and approval that led to it. One run per call:

```text
name:        reach.voice_call
run_type:    chain
session:     reach
tags:        ["reach", "voice", "desk:<holding>"]
inputs:      { event: "voice_call", call_type: "A|B|C|D",
               basis: "replied|requested|relationship|switchboard",
               queue_ref: "<wave/segment/item provenance>" }
outputs:     { outcome: "answered|voicemail|no_answer|refused|
                        handoff|booked",
               duration_s: <int>, attempts_this_week: <int> }
metadata:    { desk, device_id (desk phone), voice_id,
               script_version, suppression_checked: true,
               human_handoff_to: "<name or null>" }
```

And one run per text touch, same shape: `reach.text_touch` with
`channel: "sms|instagram|threads|linkedin"` and the same basis +
outcome fields.

Discipline, matching Reach's existing tracing law:

- **Metadata and outcome only.** No message text, no contact
  details, no transcript, no audio in a trace — the same rule the
  current `reach.*` runs already assert. A call's *content* lives
  where the programme keeps content (the thread, the call card),
  not in the trace.
- **No recording claims.** This setup does not assert that calls
  are recorded — the ElevenAgents/telephony recording behaviour
  is part of what tier setup must confirm (§2.9, step 1). Until
  then, the
  log is the record: who was called, on what basis, which script
  version, what outcome.
- Refusals trace too — `reach.suppression_refusal` already exists
  for drafts; a voice refusal emits it with
  `channel: "voice"` so the refusal record is one query wide.

### 2.7 Module — Ask Humanity (all three desk agents)

*Mike's addition, 2026-11-13 12:02 PT. This module rides on
every desk agent, on calls and on texts: the agents promote Ask
Humanity — the invitation, the Twenty Questions, and the 50
fields — alongside whatever the call or text was already for.
Wording for the module's beats is in `VOICE-SCRIPTS.md` §9.*

**What the agents do:**

- **Invite.** Where it fits the conversation — a warm thread, a
  community partner, a builder or funder asking what the network
  is about — the agent invites the person to the invitation and
  the public Ask Humanity pages, by their public route (the
  Ask Humanity site and field pages), and offers to send the
  link by email or text after the call. The invitation is an
  offer, never a pivot that hijacks the call's own goal: one
  beat, warmly made, then back to the call's purpose — or the
  call closes with the invitation as its close if the person
  leans in.
- **Talk about the project.** What Ask Humanity is, in the
  record's own terms: a cornerstone invitation — twenty
  questions, fifty fields of human life, The Human Graph as the
  corpus they build. Project facts come from the Ask Humanity
  brief in `AGENT-KNOWLEDGE.md` (§2.8) — status, what is public
  today, what is still gated — and nowhere else.
- **Quote the questions verbatim or not at all.** The canonical
  Twenty Questions are quoted **exactly as written** — the agent
  reads a question word-for-word from the canonical text carried
  in the Ask Humanity brief, or it does not quote it. No
  paraphrase, no "it's basically asking…", no rewording for the
  channel, ever. If the canonical text is not in front of the
  agent, it describes the invitation without quoting and offers
  the link.
- **Explain consent.** Plainly, before any enthusiasm: answers
  are given only by people who choose to give them, through the
  project's own consented route; what an answer becomes part of
  (The Human Graph); that nobody has to answer anything. The
  consent explanation uses the approved consent wording from
  the brief — which is itself a draft until counsel's review
  (§2.7 hard line below) — and the agent never softens, shortens,
  or improvises it.

**The hard line — no collection on calls or texts:**

> **The voice and text agents do not collect answers. They do
> not record answers. If a person starts answering a question on
> a call or in a text thread, the agent thanks them, does not
> write the answer into any record, and routes them to the
> project's own consented route instead.**

Live collection of answers stays gated on **counsel's consent
review plus per-field approval**, exactly as the programme
holds it today — no call, text, or module in this document
opens that gate, narrows it, or pre-collects against it. The
Phase 0 public layer is read-only; the agents point at it, they
do not extend it. A person who insists on answering "right now,
to you" gets the warm refusal in `VOICE-SCRIPTS.md` §9 — the
answer matters too much to take it outside the consented route.

Ask Humanity mentions trace like everything else:
`reach.voice_call` / `reach.text_touch` metadata gains
`ask_humanity: "invited|quoted|consent_explained|declined"` —
the beat that happened, never any part of an answer.

### 2.8 Module — All-projects knowledge (all three desk agents)

*Mike's addition, 2026-11-13 12:02 PT. A desk agent mostly talks
about its own holding — but contacts ask about the whole
network, and "I only know my desk" is the wrong answer from a
network that works as one team. This module makes each agent
able to talk about **all** the network's projects, under a
grounding discipline strict enough to trust on a live call.*

**The knowledge requirement.** Each agent must be able to, for
every project in the network:

- say what it is and who it belongs to (which holding — houses
  stay separate even in conversation; a Fellowship project is
  never described as a Foundation one);
- state its current status exactly as the record holds it —
  filed vs intended, live vs staged vs gated, shipped vs
  designed — with the labels intact;
- give its public route (site, page, repo) where one exists;
- name its human (the person a contact would be handed to about
  it), matching the handoff map in PHONE-FLEET.md and the
  programme.

**The single source: `AGENT-KNOWLEDGE.md`.** A sibling build is
producing the companion file `AGENT-KNOWLEDGE.md` (same folder
as this document): per-project verified-facts briefs plus the
abstention rules. **The agents ground only on that file.** It is
loaded as the agents' knowledge base at setup; nothing else is —
not this document, not a web search mid-call, not a model's
general knowledge of the network (there is none worth trusting).
Facts not in the brief are not facts the agent has.

**Abstention rules (from the brief, enforced as behaviour):**

1. **Not in the brief → not claimed.** The agent says it doesn't
   have that in front of it and offers the desk's human — the
   same move as §2.2's flow discipline, now covering every
   project, not just the desk's own record.
2. **Label uncertainty out loud.** Where the brief marks a fact
   REPORTED or time-sensitive, the agent carries the label into
   speech ("as of last month's filing…" / "that's reported, not
   yet verified") rather than flattening it into certainty.
3. **Never improvise connective tissue.** No invented partners,
   counts, dates, venues, or status upgrades to make an answer
   sound complete — the standing accuracy law, applied to
   conversation. A shorter true answer beats a fluent invented
   one, every time, on every desk.
4. **Filed vs intended stays apart in speech.** The two
   nonprofits are filed California corporations with no IRS
   determination letter on file; the Wyoming entity is dissolved
   and is never presented as operating; intended structures are
   "planned," never "formed." The brief carries the exact status
   lines; the agent speaks them as written.
5. **Wrong-desk questions get a bridge, not a blur.** If a
   Foundation contact asks Fellowship business, the agent
   answers from the brief at the level the brief allows and
   offers the other desk's human — it does not adopt the other
   house's voice or make its commitments.

**Currency.** The brief is only as good as its date. The setup
carries a standing refresh: the brief is re-issued when a
project's status changes (a filing lands, a gate opens, a launch
ships), and an agent whose brief is stale abstains on the stale
project rather than reciting the old status. Brief version +
date ride in every call's LangSmith metadata
(`knowledge_version`), so a wrong claim can be traced to the
exact brief that grounded it.

### 2.9 Remaining setup steps (in order)

1. **Tier decision — Mike's purchase.** Confirm the REPORTED
   prices on elevenlabs.io/pricing and elevenlabs.io/pricing/
   agents, then choose: Creator ($22, pilot) or Pro ($99,
   production) per §1.3. At the same sitting: pick the LLM for
   the agents (billed separately) and the telephony route (a
   number provider; also billed separately), and confirm the
   recording/consent settings the chosen stack offers. Nothing
   in this document pre-commits any of those.
2. **Console verification — gated on the Fellowship login.**
   When the console login lands: read each hosted device's page
   and record — does the device expose a number? carrier? can it
   place/receive calls? does a console API exist (base +
   endpoints)? Only proven facts get written into
   `FLEET_CONFIG` / PHONE-FLEET.md; `consoleApiBase` stays `""`
   until an API surface is proven. This step decides whether a
   phone-native call path exists alongside the ElevenAgents path.
3. **Script approval — Mike.** `VOICE-SCRIPTS.md` is DRAFT end to
   end. No call or text stages until Mike approves the exact
   wording, the same exact-text law as email copy.
4. **Voice-clone consent — only if Mike wants his own voice.**
   Not assumed, not staged. If he does: his explicit consent,
   recorded; a tier with professional cloning (Creator+); the
   clone is created from his own recordings under ElevenLabs'
   consent verification. Absent that step, the three catalog
   voices in §2.1 are the fleet's voices.
5. **Trace schema landing.** Add `reach.voice_call` /
   `reach.text_touch` emitters beside the existing `reach.*`
   runs, asserting the metadata-only rule in the harness like
   the current traces do.
6. **Pilot, one desk, one call type.** Fellowship Type C
   (resource verification) is the lowest-stakes first run: the
   basis is a published switchboard, the goal is factual, and
   the write-back improves a guide. One pilot call, log reviewed
   against this document, before any desk runs a second.
7. **Ask Humanity module activation (§2.7).** The module ships
   with the canonical Twenty Questions text and the approved
   consent wording loaded from the Ask Humanity brief — and it
   activates for **promotion only**: invite, talk, quote
   verbatim, explain consent, collect nothing. Answer collection
   is not a setup step in this document at any later stage
   either; it waits on counsel's consent review + per-field
   approval in the Ask Humanity programme itself.
8. **Knowledge grounding (§2.8).** No desk agent goes live
   until `AGENT-KNOWLEDGE.md` exists, is loaded as its sole
   knowledge base, and the agent has passed a spoken-check pass
   against the brief: per project, correct status line, correct
   holding, correct human — and a demonstrated abstention on
   questions the brief doesn't cover. The brief's version is
   recorded in the agent config (`knowledge_version`) from day
   one.

---

## Claims ledger

| Claim | Label | Source |
|---|---|---|
| Reach TTS = ElevenLabs, Sarah default, Flash model, browser fallback | VERIFIED | INTEGRATIONS.md + integrations.js, 2026-11-13 |
| Browser speech recognition in app.js | VERIFIED | app.js (`SpeechRecognition`), 2026-11-13 |
| ElevenLabs account: free, 10,000 chars/mo, 0 used, 3 voice slots, no cloning | VERIFIED | Live connector read (`el.py verify`), 2026-11-13 |
| 21-voice catalog incl. Sarah / Matilda / Charlie IDs | VERIFIED | Live connector read (`el.py voices`), 2026-11-13 |
| Free-tier output non-commercial forever; upgrades don't retro-license | VERIFIED | Connector doc, from ElevenLabs terms, 2026-11-13 |
| LangSmith project "reach" + id, metadata-only tracing law | VERIFIED | INTEGRATIONS.md, 2026-11-13 |
| Five Pixel 7 Pro (US) hosted phones, device IDs, paid until 13 Dec 2026, account agent@agifellowship.church | VERIFIED | Vendor setup emails via Mike; PHONE-FLEET.md, 2026-11-13 |
| PhoneUse Local = iPhone screen control via local API/MCP; no telephony API; separate from hosted platform | VERIFIED | Fork README + docs/REACH.md, 2026-11-13 |
| Caps 90/mailbox, ≤250 cold/day; suppression law; email voice rule + handoffs | VERIFIED | MEMORY.md + outreach-15k programme files, 2026-11-13 |
| TTS tier prices/credits (Starter $6/30k … Pro $99/600k) | REPORTED | elevenlabs.io/pricing as read by pricing trackers, 2026-11-07→10 |
| Agents tier prices/minutes (Creator $22/275 min, Pro $99/1,238 min; $0.08/min overage; LLM + telephony billed separately) | REPORTED | elevenlabs.io/pricing/agents as read by pricing trackers, 2026-08→11 |
| Hosted console devices expose numbers / can place or receive calls | **UNVERIFIED** | Nothing on record proves it — §1.4; §2.9 step 2 |
| Console API surface (base, endpoints) | **UNVERIFIED** | `consoleApiBase` stays `""` until proven — §1.4 |
| Driving a phone keypad by UI automation as a calling path | **UNVERIFIED** | Not documented in the fork; this design does not rely on it |
| Ask Humanity shape: the invitation, canonical Twenty Questions, 50 fields, The Human Graph as corpus; live collection gated on counsel consent review + per-field approval | VERIFIED | Programme record (MEMORY.md), restated in Mike's 2026-11-13 12:02 PT addition |
| `AGENT-KNOWLEDGE.md` exists and is loaded | **UNVERIFIED — pending** | Companion file is a sibling build in flight; §2.8 makes it a go-live gate (§2.9 step 8) |
