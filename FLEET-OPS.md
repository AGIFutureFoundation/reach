# FLEET-OPS — the phone fleet's operating programme

*Mike's order, 2026-11-13 12:00 PT: "make full use of the new phones
to do research and outreach — using the existing agents and networks —
make this an impressive use of the networks and phones." This is the
programme that order produces. It is a staged operating spec: **it
sends nothing, changes no live outreach, and operates no console.**
`PHONE-FLEET.md` remains the fleet's verified record (inventory,
assignments, wiring spec, go-live checklist); this document is the
work programme that runs on top of it once Mike says go.*

## Why this fleet is more than five phones

A phone fleet by itself is five rented screens. What makes this one
an operating asset is everything it plugs into:

- **Three holdings with real work queues** — the Fellowship's 15
  city guides and community partners, the Foundation's partner and
  funder commitments, BuilderSpace's tour towns and employers.
- **An outreach programme that already runs** — CRM v4 (265,458
  active rows at last count), wave packs, SEND-LOG, suppression law,
  hourly reply watches. The phones inherit its discipline instead of
  inventing their own.
- **The agentic network's own rails** — agent-net packets (signed
  work drops, claim-by-commit), LangSmith tracing (project `reach`),
  the people graph, and a research lab whose claims carry
  VERIFIED / REPORTED / HYPOTHESIS labels.
- **A sponsor stack that is connected, not promised** — Tavily for
  research, ElevenLabs for voice, LangSmith for the record, and
  PhoneUse itself for execution on real devices.

The fleet's job is to make those systems touch the physical world —
real listings opened on a real phone, real inboxes triaged, real
approved text executed — while the approval law stays exactly where
Reach put it: a human taps, then the world moves.

## 1 · Capacity model

### In service now — the Fellowship-account fleet (verified)

Five Google Pixel 7 Pro (US), all on the console account
**agent@agifellowship.church**, all paid until 13 Dec 2026,
assignments approved by Mike 2026-11-13 (full inventory in
`PHONE-FLEET.md`):

| Phone | Device ID | Assignment | Working load |
|---|---|---|---|
| 1 | `ACP6BC9P8ZEML2Z1` | Fellowship desk | City-guide verification + Fellowship mailbox (agent@agifellowship.church) |
| 2 | `ACP6BD9Q64XX8XE9` | Foundation desk | Partner/funder research + Foundation mailbox (x@agifuturefoundation.org) |
| 3 | `ACP6B99O2IWFKAA4` | BuilderSpace desk | Employer/lab discovery + BuilderSpace mailbox (x@agicorp.network) |
| 4 | `ATP68K8IGMSLAIBB` | Demo / booth | Reach live at the booth; evaluation unit; no mailbox, no queues |
| 5 | `ACP6BD9PTE0T2ASG` | Reserve | Cold; rotates in wholesale for a desk (queues are never split mid-wave) |

Working capacity today is therefore **three desk phones**, one demo
phone, and one spare — not five outreach lanes. That ratio is the
programme's honesty: the caps (§3) bind the programme, not the
device count, so extra phones buy resilience and research hours,
never send volume.

### Incoming — the other $149-plan accounts

Mike is spinning up further $149-plan console accounts on his other
emails to optimize the credits remotely. Two are mid-setup:

- **Foundation console** — x@agifuturefoundation.org (signed up by
  Mike; the takeover review is queued behind his login save).
- **AGI Corp console** — x@agicorp.network (existing-account check
  in flight; sign-in or sign-up completes once its card lands).

**No device count is asserted for either account** — nothing about
their phones enters this programme until a device appears in a
vendor setup email or a console inventory, lands as a VERIFIED row
in `PHONE-FLEET.md`, and receives an assignment from Mike. When
they land, the planned roles, in order:

1. **Second-desk capacity for the busiest desk** — the desk whose
   queue depth and triage latency (§5 metrics) prove the need gets
   a second phone; queues still never split mid-wave — the second
   phone takes research and triage while the primary keeps
   execution, or takes the desk wholesale on rotation.
2. **Regional spares** — a charged, updated spare staged for the
   tour (BuilderSpace travel days) and for booth redundancy.
3. **Research-only endpoints** — any phone beyond that joins the
   research machine (§2) only: verification and discovery work,
   which is rate-limited by the quality bar, not by send caps.

### Fleet growth rule

A phone enters service through exactly three gates, in order:
**inventory** (verified row in `PHONE-FLEET.md`) → **assignment**
(Mike approves desk and role) → **pilot** (one end-to-end item with
write-back verified, per the go-live checklist in
`PHONE-FLEET.md`). No phone skips a gate because it is already paid
for; paid-until dates (13 Dec 2026 on the current fleet) are
renewal facts, not go-live pressure.

## 2 · The research machine

Research is where the fleet earns its keep first: it carries no
send risk, it feeds every queue the programme already runs, and it
produces the verified facts the outreach drafts are allowed to use.
The phones are **research endpoints in agent-net**: work arrives as
signed packets, a desk claims its packet by commit (claim-by-commit
— no two desks work the same item), the phone does the on-device
part, and the result returns as a packet with its evidence label
attached.

**Method, the same on every desk:**

1. **Query shaping** — the desk agent composes Tavily-shaped
   queries (specific institution + specific fact sought, never a
   fishing expedition) and runs the desk-side search first.
2. **On-phone verification** — the phone opens the actual page the
   claim depends on: the shelter's own listing, the employer's own
   careers page, the funder's own programme page. A search snippet
   is a lead; the opened page is the evidence. This is the step a
   desktop-only pipeline fakes and a phone does for real — mobile
   pages, app listings, and tap-to-call flows are checked as a
   resident would meet them.
3. **Traced execution** — every research task runs as a LangSmith
   trace in project `reach`, typed by desk and task kind
   (`reach.research_verify`, `reach.research_brief`,
   `reach.research_discover`), so the fleet's research is
   inspectable run by run, the same record the judging tour replays.
4. **Labelled write-back** — findings land as notes labelled
   **VERIFIED** (read on the institution's own page, with the URL
   and the date), **REPORTED** (a credible secondary source, named),
   or **HYPOTHESIS** (the desk's inference, never presented as a
   fact about the institution). Unlabelled findings do not exist.

### Fellowship desk (Phone 1) — city-guide verification

The Fellowship's 15 city guides (Albuquerque, Atlanta, Bakersfield,
Boston, Chicago, Denver, Fresno, Los Angeles, New Orleans, New York
City, Oklahoma City, Portland, San Francisco, Seattle,
Washington DC) list shelters, food banks and pantries, Bishops'
Storehouse / JustServe points, Catholic Charities and St. Vincent
de Paul services, and mental-health triage routing. A wrong listing
is not a typo — it is a person in need sent to a closed door.

- **Queue**: the guides' listings, section by section, pulled from
  the city-guides workstream (which already keeps a verification
  log). Each listing is one packet: name, claimed address/phone/
  hours as currently published in the guide.
- **Phone work**: open the provider's own page (and its map listing
  where that is the public face), confirm or contradict each field,
  and check the phone number presents as live (the listing is
  viewed, not called — calls are a human's step).
- **Write-back**: confirmed → VERIFIED note with date; changed →
  the corrected field, sourced, into the guide-correction queue
  (corrections publish only through the guides' existing approval
  gate — the phone never edits a live guide); dead → flagged for
  the steward, who decides removal. The Fellowship steward is the
  desk's human for anything a listing raises beyond facts.
- **Cadence**: one city's full pass per week in rotation, plus
  same-week re-checks of any listing a community partner reports
  changed.

### Foundation desk (Phone 2) — partner and funder research briefs

- **Queue**: the Foundation's live programme work — funding-sprint
  programmes approaching deadlines, partner organisations with a
  specific open ask, the robotics training programme's partner
  lane (see `ROBOTICS-FLEET-REVIEW.md` in the training package).
- **Phone work**: build the one-page research brief behind each
  queue item *before* any draft exists: what the programme funds,
  its stated eligibility and deadlines (from its own pages),
  the named contact route it publishes, and what the Foundation
  can truthfully say in reply — filed facts only.
- **Discipline**: the filings graph may *rank and time* this queue
  (a funder's own filing cadence is a signal); it is never a
  contact source. Briefs are inputs to drafts a human approves;
  Russell Vacanti is the desk's human handoff, and anyone who asks
  for a human in any resulting thread goes to him the same run.
- **Write-back**: briefs file to the programme's records with
  labels; a brief that finds the Foundation ineligible says so
  plainly and closes the item — a verified no is a deliverable.

### BuilderSpace desk (Phone 3) — employer and lab discovery

- **Queue**: tour towns in session order (Session 01, New Orleans,
  first), then the robotics employer map (per-module targets in
  `ROBOTICS-FLEET-REVIEW.md`).
- **Phone work**: discover the town's builder-relevant employers,
  venues, meetup organisers, community editors, and — for the
  robotics line — warehouses, integrators, and training buyers,
  from their own published pages. Published institutional contacts
  only, staged as **research targets** (organisation, why it fits,
  published route in) — discovery is not a send list, and nothing
  discovered here is contacted until it enters a wave pack through
  the programme's gates.
- **Write-back**: each target lands as a labelled research note in
  the tour's records; employer needs surfaced in discovery (a
  posted role, a stated hiring plan) are recorded as REPORTED with
  the posting as source, never paraphrased into a promise.

### What the research machine never does

No inferred or pattern-generated contact details. No scraping
behind logins. No purchases of data. No "verification" by sending a
test message. A fact the phone could not open stays UNVERIFIED and
is written back as such.

## 3 · The outreach machine

The outreach half is deliberately unoriginal — its power is that
it already exists and already obeys the law. (`PHONE-FLEET.md`
carries the full wiring spec; this section is the operating
summary.)

- **Source of items**: finished wave packs from the 30,000-person
  programme (CRM v4 → pack → suppression diff → 48-address wave
  guard → caps check), personalised per segment, reconciled
  against SEND-LOG so nothing already sent is re-queued.
- **The phone's role**: stage its desk's approved items, present
  them for the human's tap on the exact text, execute on approval
  through its desk's channel, and log the outcome the same day.
- **Caps, unchanged and programme-wide**: 90/day per mailbox,
  ≤250 cold/day across the programme. Three working phones divide
  those caps; five phones — or fifteen — never multiply them. A
  phone's staged sends count against its own mailbox's cap.
- **Inbox triage and reply-watch**: each working phone operates
  its holding's mailbox (Phone 1 ↔ agent@agifellowship.church,
  Phone 2 ↔ x@agifuturefoundation.org, Phone 3 ↔
  x@agicorp.network): hard bounce → suppression write-back;
  unsubscribe → suppressed everywhere; reply → reply-watch queue
  with a gracious, informative draft from AGI's perspective that
  always offers the human connection; human asked for → handoff
  flag (Fellowship steward / Russell Vacanti / Mike) and the
  thread leaves automation the same run. The hourly
  `foundation-reply-watch` and `fellowship-press-reply-watch`
  jobs are the duty the phones grow into carrying — same queues,
  same voice rule, a device closer to the inbox.
- **Social items**: only on the desk's own holding accounts,
  inside the social pacing law (one platform at a time, ~2
  minutes between same-platform posts, ≤25 actions/platform/day
  network-wide, first warning = full stop that platform that day).
- **Never**: cold sends outside a wave, cross-holding queues,
  self-approval, re-queueing the dead, invented anything,
  payments, signings, submissions.

## 4 · Cadence

**Daily (each working phone, its own desk):**

| Time | Beat |
|---|---|
| 07:00 | Morning Brief on the phone — due follow-ups by name, drafts waiting, unreads, cap counters, the desk's impact so far, next best action — read aloud (ElevenLabs when connected, browser voice otherwise) |
| Morning | Research block: the desk's claimed packets worked in order; verification findings written back before any drafting begins |
| Midday | Approval sitting: the wave's drafts batched for the human's tap — the human spends minutes deciding, not waiting |
| Afternoon | Execution + triage: approved items executed; the desk's mailbox triaged; reply-watch drafts staged; handoffs flagged to the desk's human the same run |
| Close | Write-back reconciliation: sends, bounces, unsubscribes, replies all in SEND-LOG / suppression / people graph; the day counts itself from those logs |

**Weekly:**

- One full city-guide pass (Fellowship desk, rotating city).
- Queue-vs-send-log reconciliation per desk — nothing already sent
  is ever re-queued.
- Robotics discovery sprint (BuilderSpace desk) against the
  current module targets in `ROBOTICS-FLEET-REVIEW.md`.
- Fleet health pass: reserve phone charged and updated; incoming
  accounts' inventories checked for new VERIFIED rows; the
  metrics table (§5) refreshed from logs.
- A one-page fleet note to the Team Coordination HQ records:
  counts only, no individual contact data.

## 5 · Metrics that prove use

Every number below is **counted from a log that already exists** —
SEND-LOG, SUPPRESSION-LOG, the people graph, the city-guides
verification log, LangSmith project `reach`. A metric that cannot
be recomputed from a log is not reported. Estimates are labelled
estimates or not published at all.

| Metric | Definition | Source |
|---|---|---|
| Research tasks completed | Packets claimed and closed per desk, by task type | agent-net packet log + LangSmith `reach` runs |
| Verified findings | Write-backs labelled VERIFIED, with URL + date present | desk research notes |
| Guide accuracy movement | Listings confirmed / corrected / flagged-dead per city pass; correction-queue depth | city-guides verification log |
| Briefs that closed a question | Foundation briefs ending in a stated eligibility answer (including verified noes) | programme records |
| Discovery yield | BuilderSpace research targets staged per town, by category | tour records |
| Triage latency | Median time from a reply landing in a desk mailbox to its reply-watch draft staging | reply-watch seen files |
| Approval throughput | Items presented per sitting; approvals / edits / refusals counted separately | Reach impact counters + wave records |
| Write-back completeness | Phone outcomes present in SEND-LOG + people graph ÷ phone outcomes executed — target 100%, reported as counted | reconciliation pass |
| Suppression integrity | Suppressed addresses appearing in any staged queue — target zero, any occurrence is an incident, not a statistic | suppression diff at pack build + on-phone recheck |

What is never reported: projected reach, "potential impressions,"
modelled conversions, or any count that mixes demo data with
programme data. The demo phone's numbers are booth numbers and are
labelled as such wherever they appear.

## 6 · Booth tie-in

Phone 4 runs this programme live at the table. Judge Mode's tour
already performs the fleet beat — three desks, isolation proven by
trying to break it, the refusal spoken aloud. FLEET-OPS adds the
second act for a judge who stays: the demo phone works **one real
research packet shape end to end** on demo data — query shaped,
listing opened, finding labelled, write-back shown — and then the
same queue discipline on the outreach side: a staged item, the
tap, the log line. The booth claim is narrow and true: *this is
the operating programme these phones run on Monday, with the demo
data swapped for the desks' real queues through the go-live
checklist.* Nothing at the booth claims a live send happened.

## 7 · The readiness layers — what is live, what waits, and on whom

**Live today (verified):**

- Reach v2.5 with Holding Mode, per-desk briefs and impact, the
  fleet beat in the Judge Mode tour — live at
  reach.agicorp.network, tests green.
- The five-phone fleet itself: purchased, inventoried, assigned —
  vendor-verified facts in `PHONE-FLEET.md`.
- The local PhoneUse bridge in the booth configuration: fork API
  at `http://127.0.0.1:8765`, Reach served from
  `http://localhost:3109` on the same Mac; approved text crosses
  byte-for-byte; the scoped key lives in page memory only.
- The programme machinery the fleet serves: CRM v4, wave packs,
  suppression, reply watches, the 15 city guides, agent-net,
  LangSmith project `reach`.

**Waiting on Mike (human-hand steps only he can do):**

- Save the Fellowship console login through the secure card in
  chat — the one step between this spec and the console sweep
  (per-device live status, the `reach-fleet-fellowship` key).
- The same login saves for the Foundation (x@) and AGI Corp
  (x@agicorp.network) console accounts as their setups complete —
  their devices join through the §1 growth rule when they land.

**Waiting on verification (nobody's fault, nobody's shortcut):**

- The hosted console's API surface is **UNVERIFIED** — no console
  API base or endpoint is claimed anywhere in Reach or these
  documents; `consoleApiBase` stays empty until a surface is
  verified from the vendor's own material. Until then, console
  work is console-UI work, and remote execution runs on the
  verified local bridge.
- Per-device live status from the console sweep — the inventory
  proves the phones exist and are paid; their console-reported
  status lands with the sweep.

## 8 · Go-live sequence (when Mike says go)

1. Console sweep on the Fellowship account; per-device status
   rows added to `PHONE-FLEET.md`; scoped keys per phone created
   and held per the fork's pattern (page memory / Mac-side
   bridge, never in the store).
2. Research machine first: one city-guide pass (Phone 1), one
   funder-brief batch (Phone 2), one tour-town discovery sprint
   (Phone 3) — each desk proves its packet loop with zero sends.
3. One pilot outreach item per desk, end to end, write-back
   verified in SEND-LOG and the people graph (the `PHONE-FLEET.md`
   checklist), before any queue larger than one is loaded.
4. Caps reconciliation at the first morning brief: phone counters
   and programme send-log agree, in writing, before wave work
   stages on phones.
5. Robotics activation (BuilderSpace + Foundation + Fellowship
   desks) per `ROBOTICS-FLEET-REVIEW.md` §5, inside the same
   gates.

*End of FLEET-OPS. Companion documents: `PHONE-FLEET.md` (fleet
record + wiring spec), `JUDGING.md` (booth script), the phoneuse
fork's `docs/REACH-FLEET.md` (execution-side mirror), and
`ROBOTICS-FLEET-REVIEW.md` in the robotics training package.*
