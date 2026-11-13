# FLEET-EXPANSION — the phone fleet's capability review and rapid expansion plan

*Mike's order, 2026-11-13 12:17 PT: "review the capabilities of the
remote phones and make full use of them to expand our projects,
social media, and agentic outreach and presence — rapidly expand
and bring the goals we have set into reality."*

*This is a plan and spec document. It sends nothing, posts nothing,
calls no one, pushes nothing, and operates no console. It builds on
the fleet's verified record (`PHONE-FLEET.md`), the operating
programme (`FLEET-OPS.md`), the voice/text design
(`VOICE-AGENTS.md`), the social setup matrix
(`~/workspace/your_files/social-setup-2026-11/
SOCIAL-SETUP-MATRIX.md`), the Ask Humanity programme
(`~/workspace/your_files/ask-humanity-promo-2026-11/`), and the
robotics fleet review (`~/workspace/your_files/
robotics-training-2026-11/ROBOTICS-FLEET-REVIEW.md`). Where those
documents already carry a queue, this plan points at it and orders
it; it does not fork their contents.*

*Labels: **VERIFIED** = proven from a named source on record.
**UNVERIFIED** = not proven by anything on record, with the exact
verification step named. A capability that is UNVERIFIED is not
used, promised, or planned around until its step lands.*

---

## 1 · Capability matrix — what the fleet actually is

The fleet is three capability layers, and they prove different
things. Keeping them separate is the whole discipline: the hosted
console is where the five Pixels live, the local fork is a
different product that controls a USB iPhone from a Mac, and Reach
is the software the desks run. No layer borrows another layer's
proof.

### Layer (a) — the hosted console fleet (console.phoneuse.com)

| Capability | Label | Source / verification step |
|---|---|---|
| Five Google Pixel 7 Pro (US) devices exist, device IDs `ACP6BC9P8ZEML2Z1`, `ACP6BD9Q64XX8XE9`, `ACP6B99O2IWFKAA4`, `ATP68K8IGMSLAIBB`, `ACP6BD9PTE0T2ASG` | VERIFIED | Vendor setup emails (Abdulla, CEO of PhoneUse), relayed by Mike 2026-11-13 11:49–11:50 PT; inventory in `PHONE-FLEET.md` |
| All five on one console account: agent@agifellowship.church; all paid until 13 Dec 2026 | VERIFIED | Same vendor setup emails; `PHONE-FLEET.md` |
| Approved assignments: Phone 1 Fellowship, Phone 2 Foundation, Phone 3 BuilderSpace, Phone 4 demo/booth, Phone 5 reserve | VERIFIED | Mike's ruling, 2026-11-13 11:51 PT; recorded in `PHONE-FLEET.md`, the role cards, and `FLEET_CONFIG.phoneuse.consoleDevices` in Reach `app.js` |
| Agent-side console sign-in (the Fellowship account) | **UNVERIFIED — step pending** | Verification step: Mike saves the Fellowship console login through the secure card in chat; the waiting console window then signs in. Until that save lands, no agent has seen the inside of the console. |
| Per-device live status (online state, health, last activity) | **UNVERIFIED** | Verification step: the console sweep — first action after the Fellowship login lands: open each of the five device pages and record live status verbatim into `PHONE-FLEET.md`. The inventory proves the phones exist and are paid; it does not prove their current status. |
| Console API keys (e.g. a `reach-fleet-fellowship` key) | **UNVERIFIED** | Verification step: during the sweep, check whether the console offers API key creation; if it does, create the key named `reach-fleet-fellowship` and record only its existence, never its value. If the console offers no keys, that absence is the recorded result. |
| Hosted console API surface (base URL, endpoints, remote task submission) | **UNVERIFIED** | Verification step: read the console's own pages and any vendor API documentation reachable from inside the account during the sweep. Until a surface is proven from the vendor's own material, `consoleApiBase` in Reach stays `""` and no console API is claimed anywhere. |
| Remote device control / automation through the console UI | **UNVERIFIED** | Verification step: during the sweep, open one device page (the demo phone first) and record what controls the console actually exposes. Nothing is operated beyond read-only inspection in the sweep itself. |
| Phone numbers on the hosted devices | **UNVERIFIED** | Verification step: read each device page in the sweep and record whether a number is shown, per device. Nothing on record today proves any hosted device has a number. |
| Placing or receiving calls on the hosted devices | **UNVERIFIED** | Verification step: the device-page read in the sweep plus the vendor's own console documentation. Keypad-by-automation is not a calling path and is never relied on (see `VOICE-AGENTS.md` §1.4). Voice-to-voice calling is designed on the ElevenAgents path for exactly this reason. |
| Renaming devices in the console | **UNVERIFIED** | Verification step: note during the sweep whether renaming is available. Do not rename anything in the sweep. |

### Layer (b) — the local fork (AGIFutureFoundation/phoneuse)

PhoneUse Local — a separate product from the hosted platform, and
upstream says so in its own README. Everything below is VERIFIED
from the fork's source and docs, read 2026-11-13.

| Capability | Label | Source |
|---|---|---|
| Screen control of a USB-connected iPhone from a Mac via WebDriverAgent: live video, OCR screen reading, tap / type / scroll, natural-language tasks | VERIFIED | Fork README + `docs/REACH.md` |
| Local REST API at `http://127.0.0.1:8765` (`GET /health` answers) | VERIFIED | Fork source |
| MCP server for the same device control | VERIFIED | Fork source |
| Web UI on port 3109 | VERIFIED | Fork source |
| Reach bridge: `POST /api/ai/tasks`, Bearer auth, body `{device_id, task}` | VERIFIED | Fork source + Reach v2.4 implementation |
| Origin allowlist: the API accepts only `http://localhost:3109` and `http://127.0.0.1:3109` origins — the supported configuration is Reach served from localhost:3109 on the same Mac; refusals from the public site are expected behaviour | VERIFIED | Fork source; Reach bridge copy narrates refusals as expected |
| Byte-exact hand-off: while PhoneUse is detected, an approval card offers "Send to my phone via PhoneUse" and the POSTed task is the card's approved text, byte-for-byte (harness-asserted); bridge key + device ID live in page memory only, never stored; submitted is never described as delivered | VERIFIED | Reach v2.4 + harness |
| Telephony in the fork: no telephony API, no numbers exposed | VERIFIED (absent) | Fork README/docs — upstream states local is separate from the hosted platform; no endpoint places or receives a carrier call |
| Fleet mode in the fork: approved assignments + real device IDs in the fleet config and `docs/REACH-FLEET.md` | VERIFIED | Fork commits through `6942434b` (2026-11-13) |

### Layer (c) — Reach itself (the desks' software)

All VERIFIED from the shipped app: Reach v2.5 live at
reach.agicorp.network, test suites green (216/216 at v2.5 ship,
including the 44 fleet assertions).

| Capability | Notes |
|---|---|
| Holding Mode: three isolated holding desks (Fellowship / Foundation / BuilderSpace) beside the user's own list; a desk's slot holds only its own holding's people — isolation is architectural, not procedural | Schema stays v3; `holdingId` additive; the user's own list is never overwritten |
| The approval law: agent reads, researches, drafts; a human approves the exact text; only then does anything move. Suppression is checked before drafting and a refusal is narrated out loud | Every desk, every phone, every channel |
| PhoneUse bridge hand-off (Layer b) from approval cards | Booth configuration: Reach on localhost:3109, same Mac |
| BYOK integrations panel: the user's own ElevenLabs / LangSmith / Tavily keys, held on-device in `store.integrations`, excluded from Export; adapters fail gracefully and narrate | Keys never enter a repo, a doc, or a trace |
| Voice out: ElevenLabs TTS (default voice Sarah, `EXAVITQu4vr4xnSDxMaL`) with browser-voice fallback; voice in: browser SpeechRecognition. Morning Brief composes from real state and reads aloud | No server-side STT and no telephony path inside Reach — see `VOICE-AGENTS.md` §1.1 |
| Use-case packs (Founder follow-ups, Recruiter pipeline, Nonprofit donors, Creator collabs) and Judge Mode with the fleet beat | Demo data is fictional and labelled; demo numbers are booth numbers |
| Tracing: LangSmith project `reach` (id `b87d1237-b76e-486d-8fe3-e650067df1b1`), metadata and outcome only | The same audit trail the fleet's research and (staged) voice runs join |

### What the fleet can do TODAY vs the moment the consoles open

**Today, with zero console access:**

- Reach v2.5 runs the three desks in Holding Mode with the full
  approval law, briefs, impact counters, and Judge Mode — the
  software half of the fleet is live and demonstrable.
- The local bridge works in the booth configuration: approved text
  crosses to the fork's iPhone byte-for-byte from Reach on
  localhost:3109.
- Every queue in §2 below can be **built, staged, and ordered**
  today: research packets written, wave items staged from finished
  packs, social copy packs approved, interview pilot lists drawn.
  Staging is desk work; it needs no console.
- The demo phone's booth duty runs on Reach alone.

**The moment the Fellowship console login lands:**

- The console sweep (§4, hours 0–2) converts every UNVERIFIED row
  in Layer (a) into a recorded fact — live status per device,
  numbers or their absence, calling or its absence, API keys and
  surface or their absence. `PHONE-FLEET.md` gains the status rows;
  `consoleApiBase` is filled only if a surface is proven.
- Native-app social work (§2.2) starts: the fleet phones sign into
  their own holdings' apps and stay signed in — the fleet
  end-state — which is the only route to the phone-only profile
  fields the web cannot set.
- On-device research execution (§2.1) starts: packets stop being
  staged paperwork and start returning labelled findings from
  pages actually opened on a phone.
- Everything else stays exactly as gated as it is today: sends
  ride approved waves inside programme caps, voice rides the
  basis gate and Mike's tier/script decisions, interviews ride
  the activation conditions. The console opening changes what the
  fleet can *reach*, never what it is *allowed* to do.

---

## 2 · Expansion assignments — per phone, per front, ordered queues

Three fronts, five phones. Every queue below is ordered: work the
items in sequence, write back before moving on, and stop at the
named gate rather than improvising past it. The operating
programme (`FLEET-OPS.md`) owns the cadence and the metrics; this
section owns the assignments.

### 2.1 Front one — PROJECTS (the research machine, per desk)

Research goes first because it carries no send risk and produces
the verified facts every other front is allowed to use. Method is
`FLEET-OPS.md` §2, unchanged: agent-net signed packets,
claim-by-commit per desk, Tavily-shaped queries desk-side, then
the phone opens the actual page the claim depends on; every task
traces in LangSmith project `reach`; findings write back labelled
VERIFIED / REPORTED / HYPOTHESIS. A fact the phone could not open
stays UNVERIFIED and is written back as such.

**Phone 1 — Fellowship desk: the 15 city guides, verified on the
phone.**
The Fellowship's 15 city guides (Albuquerque, Atlanta,
Bakersfield, Boston, Chicago, Denver, Fresno, Los Angeles, New
Orleans, New York City, Oklahoma City, Portland, San Francisco,
Seattle, Washington DC) list shelters, food banks and pantries,
Bishops' Storehouse / JustServe points, Catholic Charities and
St. Vincent de Paul services, and mental-health triage routing.
Ordered queue:

1. Pull the guide verification queue section by section from the
   city-guides workstream (which already keeps a verification
   log). Each listing is one packet: name, claimed address /
   phone / hours as currently published in the guide.
2. On the phone, open the provider's own page — and its map
   listing where that is the public face — and confirm or
   contradict each field as a resident would meet it (mobile
   page, tap-to-call presentation viewed, never called; calls
   are a human's step, or a Type C verification call under
   `VOICE-AGENTS.md` once voice is live).
3. Write back per listing: confirmed → VERIFIED note with URL +
   date; changed → corrected field, sourced, into the
   guide-correction queue (corrections publish only through the
   guides' existing approval gate — the phone never edits a live
   guide); dead → flagged for the Fellowship steward, who decides
   removal.
4. Cadence: one city's full pass per week in rotation, plus
   same-week re-checks of any listing a community partner reports
   changed. Robotics community lane (below) interleaves after the
   first full city pass.

Robotics community lane (from `ROBOTICS-FLEET-REVIEW.md` §5,
Fellowship phone): workforce and reentry nonprofits whose clients
match technician-track prerequisites (support needs asked, never
assumed — research notes only; any partnership conversation is
the steward's to open); community-college open-enrolment feeder
courses RT-1's boundary lesson can point to, from the
institutions' own pages; faith-community hosts' interest in a
future information session recorded, never scheduled against a
plan; city-guide partners in the lab's region hear about the lab
from this desk first. Fellowship-separate throughout — no
cross-posting into Foundation or BuilderSpace surfaces.

**Phone 2 — Foundation desk: partner/funder briefs + the robotics
partner lane.**
Ordered queue:

1. Funding-sprint programmes approaching deadlines, in deadline
   order: for each, build the one-page research brief *before*
   any draft exists — what the programme funds, its stated
   eligibility and deadlines from its own pages, the named
   contact route it publishes, and what the Foundation can
   truthfully say in reply (filed facts only).
2. Partner organisations with a specific open ask, oldest ask
   first: same brief discipline.
3. Robotics partner/funder warmth list (from
   `ROBOTICS-FLEET-REVIEW.md` §5, Foundation phone), each brief
   assembled from the partner's own published pages before any
   approach: the FANUC Academy / CERT pathway (authorised-
   instructor status is the asset; published requirements first);
   Standard Bots (US-made SME arm; plausible equipment +
   curriculum partner; the $37k RO1 list is a company figure,
   never a quote to us); workforce-development funders whose
   published programmes cover industrial-skills training in
   LA/NE; apprenticeship intermediaries (Amazon's Mechatronics &
   Robotics Apprenticeship studied as the template model;
   approached only where a published partnership route exists);
   regional universities in the tour geography — carrying
   LAB-011 §10's caveat verbatim: their robotics programmes were
   not verified in that pass — verify before any outreach, and do
   not name them publicly until they agree in writing.
4. Discipline on every item: the filings graph may *rank and
   time* this queue; it is never a contact source. A brief that
   finds the Foundation ineligible says so plainly and closes the
   item — a verified no is a deliverable. Briefs feed drafts a
   human approves; Russell Vacanti is the desk's human handoff.

**Phone 3 — BuilderSpace desk: employer and lab discovery, in
tour-town order.**
Session 01's town (New Orleans) first, then the tour order, then
the robotics employer map. Discovery produces **research
targets** — organisation, why it fits, published route in —
staged in the tour's records. Discovery is not a send list:
nothing discovered here is contacted until it enters a wave pack
through the programme's gates. Categories and planning counts
are `ROBOTICS-FLEET-REVIEW.md` §5's, carried verbatim — they are
planning targets set by the programme, not discovered facts:

1. 3PL & warehouse operators in tour corridors — sites running
   AMR fleets; posted technician roles and their named skill
   stacks: **10–15 organisations per tour town**.
2. Robotics integrators (regional) — cell builders and service
   firms who hire PLC / vision / robot techs: **3–5 profiles per
   region**.
3. AMR-deploying distribution operators — fleet-size signals,
   maintenance model (in-house vs vendor), hiring cadence:
   **5–8 profiles across the LA/NE corridors**.
4. Plant-construction & industrial employers (the LAB-010 wave —
   the Meta Richland Parish build, Amazon's Northwest Louisiana
   operations, the Hyundai–POSCO Ascension Parish plant wave are
   the region's named robotics-adjacent employers in
   LAB-010/011, REPORTED as employers; their training needs are
   discovered, never assumed): **every LAB-010-named employer,
   profiled once**.
5. Vendor academies & CERT-network schools — FANUC CERT schools,
   vendor training centres, who teaches what where: **2–3
   profiles per state**.
6. Alongside the robotics categories, the tour's own discovery:
   session venues, meetup organisers, community editors who list
   sessions, and employers who meet builders at the demo table —
   from their own published pages, published institutional
   contacts only.

Each profile lands as a labelled research note (employer, own-page
evidence, posted-skill extracts VERIFIED from postings, fit note
against RT-module artefacts for the robotics lane).

**Phone 4 — demo/booth: today's duty, then standing duty.**
Today (2026-11-13) Phone 4 is at the Do Not Disturb hackathon
table running Reach in Judge Mode — the fleet beat, the isolation
demo, the refusal spoken aloud — on demo data only: no mailbox,
no queues, and its numbers are booth numbers wherever they
appear. Standing duty after today: the evaluation unit for every
new fleet capability (the console sweep inspects Phone 4's device
page first, §1), the interview-demo unit (the interview flow
shown end-to-end on staged practice runs before any live lane
activates, ASK-HUMANITY-PROMO §8 step 4), and event duty wherever
the network shows Reach.

**Phone 5 — reserve: cold, with named activation triggers.**
Phone 5 stays cold — charged, updated, unassigned — until exactly
one of three triggers fires:

1. A working phone's queue exceeds its day twice (the desk's
   claimed packets or staged items cannot be worked inside the
   daily cadence two days running, counted from the desk logs);
2. A working phone fails (hardware, console status, or account
   fault that takes it out of service);
3. A fourth holding desk opens.

On a trigger, Phone 5 rotates in **wholesale** under the same
rails and takes the desk's slot entire — queues are never split
across two phones mid-wave (`PHONE-FLEET.md`). Incoming phones
from the other $149-plan console accounts (Foundation x@ and AGI
Corp x@agicorp.network, both mid-setup) enter only through the
growth rule in `FLEET-OPS.md` §1 — verified inventory row →
Mike-approved assignment → one-item pilot — in the planned role
order: second-desk capacity, regional spares, research-only
endpoints. No device count is asserted for them anywhere until a
device verifies.

### 2.2 Front two — SOCIAL MEDIA (the phones as the native-app surface)

The estate's social problem is specific: the profiles exist, the
approved copy exists (the social copy pack, approved by Mike
2026-11-13 12:03 PT), and a set of finishing steps are
**app-only** — desktop and the connectors cannot set them at any
price. A fleet phone signed into its own holding's apps is the
only instrument that completes them. That is this front's whole
job: each holding's social operation moves onto its phone as the
native-app surface, and the phone keeps those accounts signed in.
That is the fleet end-state the matrix's waves already describe.

**The cap law, stated plainly before any queue:** platform caps
and the pacing law bind the **account**, not the device. The law
is one platform at a time, ~2 minutes between posts on the same
platform, ≤25 actions per platform per day network-wide, and the
first warning stops that platform for the day. Five phones never
multiply a platform cap, an account's limits, or a day's actions —
the phones divide the work; they do not divide the law.

**Phone 1 — Fellowship socials (app-only steps first):**

1. Instagram @agifellowship: set the website link →
   https://www.agifellowship.church (the link field is editable
   only in the mobile app — "Editing your links is only available
   on mobile"). Gate: the @agifellowship IG login is not in the
   vault; Mike saves it (Wave 0), then this step runs.
2. Threads @agifellowship: complete the blank profile in-app —
   name "AGI Fellowship", the approved bio, link
   agifellowship.church — with read-back proof. (Execution batch
   1 stopped this fill correctly: the vault kept offering the
   Foundation's login, and no Fellowship login was submitted.)
3. TikTok @wavetranslator: set the website link →
   agifellowship.church (desktop Edit profile has no website
   field; phone step only). Keep-vs-rename is Mike's call; any
   rename waits until the 7-day block lifts after Nov 19, 2026.
4. Then standing duty: Fellowship posts and replies from this
   phone only, approved copy only, pacing law. Fellowship
   surfaces carry nothing commercial, ever.

**Phone 2 — Foundation socials:**

1. Instagram @agifuturefoundation: set the website link →
   https://www.agifuturefoundation.org (app-only field, same as
   above). The Professional-switch decision for both nonprofit
   IGs is Mike's (Wave 0) and is applied here once ruled.
2. Threads @agifuturefoundation: profile fill — completed and
   read-back-verified in execution batch 1 (name, approved bio,
   agifuturefoundation.org link all live); this phone adopts the
   account as its standing Threads surface.
3. Standing duty: Foundation posts and replies from this phone,
   approved copy only, pacing law. (Facebook for both nonprofits
   is already EXISTS-complete and connector-managed; batch 1
   verified all three Pages and fixed the AGI Corp Page website
   to https://www.agicorp.network — no phone work owed there.)

**Phone 3 — BuilderSpace / AGI Corp socials:**

1. Instagram @builderspacetech (Business — the estate's only
   Shopping-eligible IG): verify branding against the copy pack
   and apply it (bio / avatar / link target per Mike's Wave 0
   ruling: builderspace.tech home vs /stack). Gate: creds not in
   the vault; Mike saves them.
2. Threads BuilderSpace: activate @builderspacetech Threads via
   the live IG account's Instagram SSO — the matrix's one
   agent-creatable Threads cell — then complete the profile from
   the copy pack.
3. X @agicorp_eth: bio + website wiring from the approved pack
   text, in Mike's X session (the saved X login on file is not
   this handle's). No fresh X signup anywhere while the
   @AGIFutureFdn suspension appeal pends.
4. Standing duty: BuilderSpace + Corp posts and replies from
   this phone, approved copy only, pacing law.

**Batch-2 queue (from the matrix, in dependency order):**

1. **Threads BuilderSpace** via IG SSO — Phone 3, needs only the
   saved @builderspacetech session.
2. **Bluesky profile fills** — the three creations (Foundation
   x@agifuturefoundation.org, Fellowship
   agent@agifellowship.church, AGI Corp x@agicorp.network, with
   the matrix's handles, bios, and sites) complete in browser
   windows behind Mike's per-account password cards; once the
   accounts exist, their in-app profile completion and standing
   operation land on Phones 2 / 1 / 3 respectively. BuilderSpace
   Bluesky (@builderspacetech.bsky.social) already
   EXISTS-complete.
3. **AGI Corp Instagram** — claim order @agicorpnetwork →
   @agicorp.network → @agicorpnet — gated on the x@agicorp.network
   mailbox password being saved (never saved yet); creation is a
   browser step, then Phone 3 adopts it and Corp Threads follows
   from it.
4. **TikTok Foundation** — Mike-present signup (password via
   vault card; DOB entry authorised by Mike for brand signups);
   Phone 2 adopts it. **TikTok Corp** — creation window already
   staged, pends the bioacoustics.cloud@gmail.com Google login;
   Phone 3 adopts it.
5. **Substack** — publications for the holdings Mike routes
   (route decision is Wave 0; sign-ins staged for all three);
   once routed, each publication's standing operation sits with
   its holding's phone. This is the estate's most direct
   paid-content rail once a publication exists.
6. **Held regardless of batch:** X @AGIFutureFdn stays unlinked
   until Mike's in-account appeal lands; the AGI Corp LinkedIn
   company page stays uncreated until the Mike/counsel ruling;
   LinkedIn company pages for both nonprofits wait on Mike
   restoring access + hand-supplying the iCloud-mailed code; the
   Discord network server waits on Mike's login re-save +
   developer-portal step, and the Telegram @agicorpnetwork
   channel on Mike's phone step — neither is fleet-phone work,
   and neither is improvised around.

### 2.3 Front three — AGENTIC OUTREACH + PRESENCE (the fleet as execution layer)

The outreach programme already exists and already obeys the law;
the fleet is its execution layer, not a second programme
(`PHONE-FLEET.md` wiring spec, `FLEET-OPS.md` §3). Nothing here
originates a campaign, widens a cap, or invents a queue.

**Approved waves only.** Items reach a phone finished: CRM v4 →
wave pack → personalisation gate → suppression diff → 48-address
wave guard → caps check → the wave's existing approval. Caps are
programme-wide and unchanged — **90/day per mailbox, ≤250
cold/day across the programme** — and three working phones divide
them, never multiply them; a phone's staged sends count against
its own mailbox's cap. Cold contact happens by email, in waves,
or not at all.

**Per-mailbox triage + reply-watch (each working phone operates
its holding's mailbox):** Phone 1 ↔ agent@agifellowship.church,
Phone 2 ↔ x@agifuturefoundation.org, Phone 3 ↔
x@agicorp.network. The sort, same on every desk: hard bounce →
suppression write-back; unsubscribe / "stop" → suppressed
everywhere, all lanes, all phones; reply → the reply-watch queue
with a gracious, informative drafted reply from AGI's
perspective that always offers the human connection; human asked
for → handoff flag to the desk's human (Fellowship steward /
Russell Vacanti / Mike) and the thread leaves automation the
same run. The hourly `foundation-reply-watch` and
`fellowship-press-reply-watch` jobs are the duty the phones grow
into carrying — same queues, same voice rule, a device closer to
the inbox. Programme state the fleet inherits: 140 verified
sends toward 30,000, Foundation's C3 lane paused after Wave 4's
bounce rate crossed the threshold (re-audit before the Nov 17
wave), and the next wave — Sat Nov 14, Fellowship agent@ S6 press
follow-ups part 1, 48 addresses under the guard — already staged.

**Voice and text conversations (the basis gate binds).** Per
`VOICE-AGENTS.md` §2.3: a call or text stages only on a live
basis — the contact replied, requested a call, holds an existing
relationship on record, or (verification calls only) a published
institutional switchboard during business hours. Never:
suppressed contacts, cold voice or text (cold stays email-only,
inside the wave caps), personal mobile numbers from any list.
Staged guardrails awaiting Mike's ruling in that document: ≤20
staged calls per desk per day, ≤2 attempts per contact per week,
one voicemail per thread. Disclosure in the first breath on
every call; refusal ends the call in one sentence and fires the
same-run suppression write-back (address + number, all lanes).
Calls and texts log to LangSmith project `reach` as
`reach.voice_call` / `reach.text_touch` — metadata and outcome
only. The voice path itself waits on Mike's setup decisions in
`VOICE-AGENTS.md` §2.9 (ElevenLabs tier, LLM, telephony route)
and on the console sweep's numbers/calling verdict (§1).

**The Ask Humanity engine — the fleet's presence multiplier.**
Every desk agent carries the Ask Humanity module
(`VOICE-AGENTS.md` §2.7, programme of record
`ASK-HUMANITY-PROMO.md`): invite, talk about the project from
`AGENT-KNOWLEDGE.md`, quote the canonical 20 verbatim or not at
all, explain consent plainly. The 50 fields run as 50 promotion
lanes, distributed by home holding:

- **Foundation desk (Phone 2)** — fields 01–11 (interview
  science, agent operations, WAVE & bioacoustics, nonprofit
  compliance, founder credits, x402 economics, outlier mapping,
  funding-stack advisory, evidence-labelled publishing, credits
  philanthropy, micro-grants).
- **Fellowship desk (Phone 1)** — fields 12–21 (advisory
  governance, technology for nonprofits, faith-community
  engagement, ministry formation, community messaging,
  donated-credits stewardship, faith-and-AI scholarship,
  community care navigation, agent membership, interfaith
  dialogue).
- **BuilderSpace desk (Phone 3)** — fields 41–50 (event
  production, university partnerships, sponsorship development,
  employer matching, Louisiana & Nebraska founder ecosystems,
  builder training delivery, hackathon design, university
  venues, competitive hackathon building, consent-based
  directories & data ethics).
- **General invitation lanes** — fields 22–40 (AGI Corp 22–30,
  W3 LLC 31–40). No desk owns these; they run through the
  flagship invitation surfaces — Ask Humanity's own posts, the
  email block that already rides every outreach email, the
  network's general posts — never through a holding's mailbox or
  phone. Fields 32 (robotics) and 33 (SmartCiti.X) carry noted
  secondary angles (BuilderSpace workforce / tour) that colour a
  general post without moving the lane.

Every lane has the same conversion endpoint: **an offered
interview**, by voice or text at the person's choice. The order
never rearranges — invitation → interview offered → **consent
gate** → interview — and the hard opt-in binds every interview:
explicit, captured agreement before the first question, per
Mike's ruling of 2026-11-13 12:09 PT (interviews launch under
the draft consent with hard opt-in; counsel's pass proceeds in
parallel as a recommendation, its wording adopted on arrival).
A lane's interviews activate only when its conditions complete
(`ASK-HUMANITY-PROMO.md` §2): (a) the interview system is built
(`INTERVIEW-SYSTEM.md` + `INTERVIEW-SCRIPTS.md`); (b) the
interviewing agent configuration passes the **20-Question Eval**
(citation accuracy, abstention, dissent fidelity); (c) pilot
interviews with warm candidates complete review. Until then a
lane invites and captures interest, and its agent says exactly
that — the offer is made in the future tense, never the present.

**Conversation saving — the two-tier model.** Promotion
conversations save a summary + outcome to the conversation store
under the spoken save-notice line ("This conversation is noted
for the project — I keep a short summary of what we covered and
the outcome"). Interviews save the full record — conversation
and answers — only inside the interview consent flow, with the
consent record attached to everything saved and ingestion toward
the field's Human Graph under the consent actually given.
Nothing else is saved as data: no covert notes-as-data, no
transcripts in a desk log, no answer taken on a promotion
surface. A person who starts answering on a promotion call is
received warmly, not transcribed, and routed to an interview.

---

## 3 · Goals map — which queue moves which goal

One line per goal. A goal appears here only where a phone queue
in §2 genuinely serves it; where no queue serves a goal, that is
stated instead of a linkage being invented.

| Goal (workspace slug) | The phone queue that advances it |
|---|---|
| Get noticed by Anthropic and others for acquisition or hire (`get-noticed-by-anthropic-and-others-for-acquisition-or-hire`) | All three desks' social completion (§2.2) makes the proof-of-work surfaces real — wired profiles, working links, one consistent filed-fact-safe presence — and field 30 (proof-of-work, positioning & venture communications) rides the general lanes; the fleet's counted proof metrics (§4) are the evidence the presence points at. |
| BuilderSpace hackathon tour (`builderspace-hackathon-tour`) | Phone 3's discovery queue (§2.1) works the tour towns in session order — venues, organisers, community editors, employers — and fields 41–50 (§2.3) give each town's outreach its Ask Humanity angle. |
| UnspokenSmiles VR training app / Perilux (`unspokensmiles-vr-training-app`) | Phone 4's standing event duty (§2.1) is the demo surface the UnspokenSmiles prototype was built for — a demo-prototype, shown as a prototype, with no partnership or endorsement claimed; no outreach queue serves this goal, and none is invented for it. |
| Funding targets and grant applications (`funding-targets-and-grant-applications-for-agi-projects`) | Phone 2's brief queue (§2.1) builds the one-page research brief behind each funding-sprint programme in deadline order — eligibility, deadlines, published contact route — including the verified noes that close items cleanly. |
| 30K outreach program (`30k-outreach-program`) | The whole of §2.3: the three desk phones operate the three mailboxes, stage approved waves inside the unchanged caps, and carry the triage + reply-watch duty the programme runs on. |
| 183-contact research outreach (`183-contact-research-outreach`) | The same mailbox machinery (§2.3) — the thought-leader threads live in the Foundation and Fellowship inboxes the desk phones triage, with human-askers flagged out of automation the same run. |
| Fellowship city resource guides (`fellowship-city-resource-guides`) | Phone 1's verification queue (§2.1) is this goal's accuracy engine: every listing in all 15 guides confirmed, corrected, or flagged from the provider's own page, opened on the phone. |
| Manufacturing property acquisition (`manufacturing-property-acquisition`) | Phone 3's LAB-010 wave category (§2.1) profiles every named employer in the region's industrial build wave once — the ground-truth employer map the facility work reasons from; no property contact is made by a phone. |
| Louisiana school curriculum (`louisiana-school-curriculum`) | Phone 3's university partnership and venue discovery (fields 42/48 lanes, §2.3; tour-town discovery, §2.1) builds the parish-and-campus relationship map the curriculum's Louisiana build-out deploys into. |
| Locator.X real estate curriculum (`locator-x-real-estate-curriculum`) | Field 36 (location equity frameworks — Locator.X) is a general invitation lane (§2.3): flagship surfaces only, no desk queue; the fleet serves it by keeping those surfaces complete and posting under the pacing law — stated as the limit of the linkage. |
| Nightshift hackathon sprint (`nightshift-hackathon-sprint`) | No phone queue serves Nightshift. It stays in its own context under Bino's approval law, separate from the fleet exactly as it is separate from every other project; Phone 4's booth duty today belongs to Reach at the Do Not Disturb hackathon, not to Nightshift. |
| Ten Thousand Answers / Ask Humanity interviews (`ten-thousand-answers-alignment-interviews`) | §2.3's engine entire: 50 lanes across the three desks and the flagship surfaces, every lane converting to an offered interview under the hard opt-in once its activation conditions complete. |
| Agent-Net (`agent-net-agent-to-agent-repository`) | The research machine's transport (§2.1): every phone task is an agent-net packet — signed, claim-by-commit per desk, hash-chained — so the fleet is agent-net's first physical workload. |
| Profitable companies via x402 (`profitable-companies-earning-from-agent-research-and-data-via-x402`) | Field 06 (agent payments & x402 protocol economics) rides the Foundation desk's lanes, and Phone 2's brief discipline (filings rank, never source) is the research posture the filings data service sells; no phone takes a payment or signs anything, ever. |
| Verified contact directory buildout (`verified-contact-directory-and-100k-buildout`) | Phone 3's discovery (§2.1) stages published institutional contacts as research targets under that goal's own rails — published work contacts only, lists local, directory rows never blended with email-contactable rows. |
| Books, guides, courses and site stores (`books-guides-courses-and-site-stores-build-out`) | Phone 3's standing duty (§2.2) runs the BuilderSpace surfaces whose /stack page is the Credit Farm and store front door; the link-target ruling (home vs /stack) decides which one the fleet's profiles point at. |

---

## 4 · First 48 hours once the consoles open

The clock starts when the Fellowship console login lands and the
sweep can run. Blocks are ordered; a block starts when the one
before it writes back, not when the wall clock says so. Mike's
hands are needed only where a block says so.

**Hours 0–2 — the verification sweep (converts §1 Layer (a) from
UNVERIFIED to record).**
Sign in on the Fellowship console account. Open the demo phone's
device page first and record what the console exposes (controls,
status fields, number fields). Then open all five device pages
and record per-device live status verbatim into `PHONE-FLEET.md`.
Check for API key creation: if offered, create
`reach-fleet-fellowship` and record its existence only. Record
the numbers verdict and the calling verdict per device, from the
console's own pages and vendor documentation — proven or absent,
both are results. Fill `consoleApiBase` only if an API surface is
proven. Note whether renaming is available; rename nothing.
Close the block by updating this document's §1 table in place.

**Hours 2–6 — keys, packets, first claims.**
Create scoped PhoneUse keys per phone per the fork's
`create-key.py` pattern (one phone per key, expiries set; keys in
page memory / the Mac-side bridge, never in the store). Each desk
claims its first research packet: Phone 1 takes the first city of
the guide rotation, Phone 2 the nearest-deadline funding
programme, Phone 3 New Orleans. Caps reconciliation dry run:
phone counters and the programme send-log are compared and the
agreement noted before any wave item stages on a phone.

**Hours 4–8 — native-app social completions (Wave 1; Mike
present for the vault saves).**
Mike's Wave 0 sitting runs inside this block: vault saves
(@agifellowship IG, @builderspacetech IG creds, x@agicorp.network
mailbox password, Discord re-save), the @AGI-Corp YouTube holder
account named, the IG Professional-switch decision, the TikTok
handle call, the Substack route, the BuilderSpace IG link
target. As each save lands, its phone executes: Phone 1 sets the
@agifellowship IG website link, completes Threads @agifellowship,
sets the @wavetranslator TikTok website link. Phone 2 sets the
@agifuturefoundation IG website link and adopts Threads
@agifuturefoundation. Phone 3 verifies and applies the
@builderspacetech IG copy once its creds land. Every change reads
back before the block closes.

**Hours 8–12 — research queues start returning findings.**
The three claimed packets work to write-back: guide listings
labelled and correction queue seeded (Phone 1); the first funder
brief filed, including a verified no if that is the answer
(Phone 2); the first New Orleans discovery profiles staged as
research targets (Phone 3). First robotics categories open in
parallel on Phone 3 (3PL/warehouse, 10–15 target for the town)
and Phone 2 (the FANUC CERT pathway brief). Nothing discovered
is contacted; everything lands labelled.

**Hours 12–24 — first execution under the law + batch-2 social.**
One pilot outreach item per desk, end to end on its assigned
phone, write-back verified in SEND-LOG and the people graph
before any queue larger than one loads (the `PHONE-FLEET.md`
go-live checklist). The next morning brief runs the real caps
reconciliation: counters and send-log agree, in writing.
Batch-2 social runs alongside: Threads BuilderSpace activates
via IG SSO on Phone 3; the three Bluesky creations complete
behind Mike's password cards and their profiles fill; the AGI
Corp TikTok window resumes behind its Google login. Sat Nov 14's
staged wave (Fellowship S6 press follow-ups, part 1, 48
addresses) runs through the programme's own lanes as scheduled —
the fleet stages and triages; it does not re-time the wave.

**Hours 24–36 — the interview pilot prepares.**
The interviewing agent configuration runs the 20-Question Eval
(citation accuracy incl. the character-for-character question
diff, abstention, dissent fidelity). The pilot offer list is
drawn only from the warm set — people who replied, requested a
call, or hold a working relationship — per desk, per the first
fields in §2.3's distribution, and staged for Mike's per-field
approval of question set + invitation list. Phone 4 rehearses the
full interview flow on staged practice runs (offer → consent
gate → verbatim questions → save under consent) so the pilot's
first live offer is not the flow's first run. Voice setup
decisions (ElevenLabs tier, LLM, telephony route) are Mike's
sitting in this block if he wants the pilot on voice; the text
path needs none of them.

**Hours 36–48 — pilot offers out, second rotations, first proof.**
On Mike's per-field approval, the first pilot interview offers
go to the warm candidates — voice or text at the person's
choice, hard opt-in before the first question, every record
human-reviewed before the next batch. Research rotations
continue: Phone 1 opens its second city section, Phone 3 opens
the integrator category (3–5 per region), Phone 2 opens the
robotics funder category. The fleet note to the Team
Coordination HQ records goes out: counts only, no individual
contact data. The 48 hours close with the metrics table below
computed from logs for the first time.

**The metrics that prove expansion** (from `FLEET-OPS.md` §5 —
counted from logs that already exist, recomputed never estimated;
demo-phone numbers are labelled booth numbers wherever they
appear):

- Research tasks completed per desk (agent-net packet log +
  LangSmith `reach` runs).
- Verified findings — write-backs labelled VERIFIED with URL +
  date present.
- Guide accuracy movement — listings confirmed / corrected /
  flagged-dead per city pass; correction-queue depth.
- Briefs that closed a question — including verified noes.
- Discovery yield — BuilderSpace research targets staged per
  town, by category, against §2.1's planning counts.
- Triage latency — median time from a reply landing in a desk
  mailbox to its reply-watch draft staging.
- Approval throughput — items presented per sitting; approvals /
  edits / refusals counted separately.
- **Write-back completeness** — phone outcomes present in
  SEND-LOG + people graph ÷ phone outcomes executed. Target
  100%, reported as counted.
- **Suppression integrity** — suppressed addresses appearing in
  any staged queue. Target zero; any occurrence is an incident,
  not a statistic.
- Social completions — app-only fields set and read back, per
  account (this plan's §2.2 queues, counted as they close).
- Ask Humanity counts (post-activation only) — interviews
  offered, interviews consented & completed, per lane, from the
  interview system store; before activation these report as
  *not yet active*, never estimated.

Nothing else is reported as expansion: no projected reach, no
modelled conversions, no count that mixes demo data with
programme data.

---

## 5 · What this plan does not do

It does not open the consoles, save a login, set a password, or
click anything — the sweep in §4 runs when Mike's login saves
land, through the windows already waiting. It does not approve
copy (the social copy pack is approved; voice scripts and the
promo copy pack remain Mike's exact-text units), set an
ElevenLabs tier, choose a telephony route, approve a field's
interview lane, or rule on any Wave 0 decision — every one of
those stays with the human the source documents name. And it
does not move a single rail: caps bind the programme, platform
caps bind the account, suppression is law on every phone, houses
never cross, and no phone ever approves its own draft, takes a
payment, signs, files, or commits a holding to anything.

*End of FLEET-EXPANSION. Companions: `PHONE-FLEET.md` (fleet
record + wiring spec, with the pointer section to this plan),
`FLEET-OPS.md` (operating programme: capacity, cadence, metrics),
`VOICE-AGENTS.md` (voice/text design + setup steps), and
`ROBOTICS-FLEET-REVIEW.md` in the robotics training package
(employer/partner planning counts and categories).*

---

## 6 · The phones as the social + posting surface

*Mike's order, 2026-11-13 12:19 PT: "use the phones to set up
social media accounts and post articles from the websites."*

This section is the operating order that runs the §2.2 queues as
one workstream with one sequence: **on each holding's phone,
finish that holding's social account setup natively in-app
first, then run that holding's article-posting rotation from the
same device.** The setup queues themselves — every cell, handle,
bio, link target, and gate — live in §2.2 and the social setup
matrix (`~/workspace/your_files/social-setup-2026-11/
SOCIAL-SETUP-MATRIX.md`); this section orders their execution
and adds the posting rotation. It forks neither document.

**Phone-only steps first.** On each phone, the app-only work
leads, because it is the work no other surface can do at all:

- **Phone 1 — Fellowship.** Instagram @agifellowship: set the
  website link → https://www.agifellowship.church (the link
  field is editable only in the mobile app). Threads
  @agifellowship: complete the blank profile in-app (name,
  approved bio, agifellowship.church link, read back). TikTok
  @wavetranslator: set the website link → agifellowship.church
  (no website field exists on desktop). Gates: the IG login save
  (Wave 0) precedes the first two; keep-vs-rename stays Mike's
  call, and any rename waits until the 7-day block lifts after
  Nov 19, 2026.
- **Phone 2 — Foundation.** Instagram @agifuturefoundation: set
  the website link → https://www.agifuturefoundation.org
  (app-only field, same as above). Threads
  @agifuturefoundation: already filled and read-back-verified in
  execution batch 1 — this phone adopts the account in-app and
  confirms the same values are live there. The IG
  Professional-switch decision is Mike's and applies on this
  phone once ruled.
- **Phone 3 — BuilderSpace / AGI Corp.** Instagram
  @builderspacetech: verify and apply the copy-pack branding —
  bio, avatar, and the link target per Mike's Wave 0 ruling
  (builderspace.tech home vs /stack) — once its credentials are
  saved. Threads BuilderSpace: activate via the live IG account's
  Instagram SSO and complete the profile from the copy pack. X
  @agicorp_eth: apply the approved bio + website wiring inside
  Mike's X session.

**Then that holding's remaining cells.** Once a phone's
app-only steps read back, the phone's desk works the rest of its
holding's matrix cells in the batch-2 dependency order §2.2
already fixes: Bluesky profile fills as each creation completes
(Phones 2 / 1 / 3 adopt Foundation / Fellowship / AGI Corp
respectively; BuilderSpace Bluesky already EXISTS-complete);
AGI Corp Instagram claimed in the matrix's order once the
x@agicorp.network mailbox password is saved, adopted by Phone 3,
Corp Threads following from it; TikTok Foundation adopted by
Phone 2 and TikTok Corp by Phone 3 as their creation routes
complete; Substack publications adopted per holding once Mike
rules the route. The held cells in §2.2 stay held on the phones
too — a phone never routes around a named gate (the suspended
@AGIFutureFdn stays unlinked pending Mike's in-account appeal;
no LinkedIn company page is created ahead of its ruling;
Discord and Telegram are not fleet-phone work).

**The article-posting rotation.** With its holding's accounts
live in-app, each phone runs the article-posting rotation its
desk owns in `ARTICLE-POSTING-QUEUE.md` (same folder as this
plan; the queue's build runs in parallel with this section —
where an article is not yet in the queue, it is not posted from
this section's authority; the queue governs). The rotation's
law, stated here so no phone improvises it:

1. **A holding's own website articles post to that holding's own
   accounts only** — Fellowship articles to Fellowship accounts,
   Foundation articles to Foundation accounts, BuilderSpace /
   AGI Corp articles to theirs. Houses never cross, in posting
   exactly as in everything else; Fellowship surfaces carry
   nothing commercial, ever.
2. **Approved copy only.** The post text is the queue's approved
   copy for that article — the social copy pack where it covers
   the post, otherwise copy staged for Mike's exact-text
   approval before the rotation reaches it. No phone drafts,
   trims, or re-heads a post on the device.
3. **The pacing law binds the account, never the device** — one
   platform at a time, ~2 minutes between posts on the same
   platform, ≤25 actions per platform per day network-wide,
   first warning stops that platform for the day. The phones
   divide the work; they do not divide the law, and no rotation
   slot is ever doubled because two phones could reach the same
   platform.
4. **Read-back is the completion test.** A rotation item closes
   only when the post is read back live on the account it was
   meant for; the queue's log records account, article, time,
   and the read-back, and the §4 social-completions metric counts
   from that log.

**Phones 4 and 5 in this workstream.** Phone 4 (demo/booth)
carries no holding's social accounts and posts nothing: its §1 /
§4 duty — first device page inspected in the console sweep,
interview-flow rehearsal, event surface — is unchanged, and its
numbers stay booth numbers wherever they appear. Phone 5
(reserve) stays cold under its §2.1 triggers; a trigger rotates
it in wholesale under the same rails, and it inherits the desk's
social + posting duties entire — queues are never split across
two phones mid-wave.

**Activation, stated plainly.** This workstream starts the
moment the Fellowship console login lands and each console
opens: the sweep (§4, hours 0–2) proves the fleet, and the
native-app completions follow in the §4 sequence (Wave 1 inside
hours 4–8, batch-2 alongside hours 12–24, the posting rotation
running as each holding's accounts finish). Nothing in this
section waits for the other console accounts mid-setup — each
phone begins on the Fellowship-account fleet the moment its own
sign-in lands, and the Foundation and AGI Corp console accounts
join through the `FLEET-OPS.md` growth rule when they verify.
**Meanwhile, the web route continues setup in parallel, and its
record stands as of this section's writing**: Bluesky Foundation
created and verified (@agifuturefdn.bsky.social — the primary
handle exceeded Bluesky's 18-character limit, so the first
approved fallback took), with Fellowship and AGI Corp Bluesky
pending their per-account password cards; Threads Foundation
filled and read back, Threads Fellowship pending the
@agifellowship Instagram login save; Facebook verified across
all three Pages with the AGI Corp Page website fixed to
https://www.agicorp.network. The phones do not redo any of that
— they pick the estate up exactly where the web route leaves
it, and the app-only steps at the head of this section are the
first things they finish.
