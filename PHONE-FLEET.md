# The Reach Phone Fleet — three phones, three holdings, one approval law

*The system design for the three phones on the AGI Future Foundation's
PhoneUse console account (x@agifuturefoundation.org), built at the Do Not
Disturb: Phone Use Hackathon, Frontier Tower, 2026-11-13. Reach v2.5
ships the software half of this design as **Holding Mode**; this document
is the operating half — who each phone is, what it may do, and how it
plugs into the outreach programme that already exists.*

## The system in one paragraph

The agentic network has three holdings that talk to the world:
**AGI Fellowship** (agifellowship.church), **AGI Future Foundation**
(agifuturefoundation.org), and **BuilderSpace** (builderspace.tech).
Each gets **one phone**. Each phone runs Reach in Holding Mode: its own
people slot, its own profile name, its own mission, its own human
handoff. A phone only ever holds **its own holding's** queue — houses
never cross — and every phone obeys the same law as everything else in
Reach: the agent reads, researches, and drafts; a human approves the
exact text; only then does anything move. Three phones on the table,
three holdings, one approval law.

Why a phone per holding, rather than one phone with three lists?
Because the failure mode of outreach at scale is cross-contamination —
the wrong voice, the wrong list, the wrong house's ask landing in the
wrong inbox. A slot per phone makes that failure **architectural**,
not procedural: the Fellowship phone cannot draft to a Foundation
contact because the Foundation's people are not on it. Isolation you
can point at beats isolation you promise.

## Role cards

### Phone 1 — the Fellowship phone

| | |
|---|---|
| **Holding** | AGI Fellowship — California nonprofit religious corporation (filed 2026-05-13). A deep hub for all faiths and a resource for communities in need. |
| **Domain** | agifellowship.church |
| **Reach profile name** | **AGI Fellowship — community desk** |
| **Mission** | Community and city-guide outreach: keep the shelter, food-bank, pantry, and gathering partners behind the Fellowship's 15 city guides warm, so the guides stay accurate and the Fellowship stays useful to people in need. Thank-yous to partners, guide-update checks, invitations to community tables. |
| **Queue sources** | The Fellowship's own partner records: city-guide listings (shelters, food banks and pantries, Bishops' Storehouse / JustServe points, Catholic Charities, St. Vincent de Paul societies), community organisations that asked to be listed, and the Fellowship outreach lanes (L1 agent@agifellowship.church segments S1, S6, S7, S8, S11). |
| **Daily rhythm** | 07:00 brief → work the guide-partner queue (checks and thank-yous first) → approvals sit with the steward → 3/7/30-day follow-up nudges surface on Today. |
| **Human handoff** | **A Fellowship steward.** Anyone who asks for a human — in any reply, on any channel — leaves the automated thread immediately and is flagged to the steward the same run. Agents operate under human board/minister direction; agents do not enact doctrine. |
| **Voice** | Warm, invitational, plain. The Fellowship is a hub for all faiths: the phone never preaches, never ranks traditions, and never lets a Sparks rendering be mistaken for a translation of record. |
| **Hard rails** | Fellowship funds and Fellowship asks never route to a for-profit or a SAFE. No cross-posting into Foundation or BuilderSpace surfaces. Interview and press replies route to the steward, never to an agent's improvisation. |

### Phone 2 — the Foundation phone

| | |
|---|---|
| **Holding** | AGI Future Foundation — California Nonprofit Public Benefit Corporation (filed 2026-04-24). The stewardship hub of the network: it manages companies to mission standards. |
| **Domain** | agifuturefoundation.org |
| **Reach profile name** | **AGI Future Foundation — partnerships desk** |
| **Mission** | Partner and funder warmth: answer every programme officer's specific ask on time (the one-pager, the outcomes summary, the compliance pack), keep commitments exact, and keep first replies human-adjacent — every draft offers the human connection up front. |
| **Queue sources** | The Foundation's own partner and programme records, and the Foundation outreach lane (L2 x@agifuturefoundation.org). Filings-derived timing may *rank* a queue the Foundation already lawfully holds; the filings graph is never a contact source. |
| **Daily rhythm** | 07:00 brief → oldest specific asks first → approvals → follow-ups on the 3/7/30 cadence; a weekly pass reconciles the phone's queue against the programme send-log so nothing already sent is re-queued. |
| **Human handoff** | **Russell Vacanti**, the Foundation's co-founder and accepted director. Anyone who asks for a human on a Foundation matter is flagged to Russell the same run and leaves the automated thread. |
| **Voice** | Gracious and informative, precise about status: the Foundation states what is filed, funded, or verified — and what is not. It never claims IRS tax-exempt status (no determination letter is on file) and never presents an intended structure as a formed one. |
| **Hard rails** | No donation framing in outreach. No SAFE or securities language, ever — agents prepare, humans execute. Stripe and Mercury matters are Russell's and Mike's hands, never the phone's. |

### Phone 3 — the BuilderSpace phone

| | |
|---|---|
| **Holding** | BuilderSpace — the network's builder tour: it brings the coding and startup world to tour towns, bridges the tech divide, and matches builders with employers. |
| **Domain** | builderspace.tech |
| **Reach profile name** | **BuilderSpace — tour desk** |
| **Mission** | Builder and employer outreach in the tour towns: venues and meetup organisers who host sessions, community editors who list them, and the employers who meet builders at the demo table. |
| **Queue sources** | BuilderSpace's own tour records: session venues, organiser contacts, employer partners from prior sessions, and the /stack community (Credit Farm offers, the store). Session pages stay exactly as approved on Luma — the phone never edits an event. |
| **Daily rhythm** | 07:00 brief → next-town queue first (the town whose session is soonest) → organiser and venue follow-ups → employer warmth after sessions, while demos are fresh. |
| **Human handoff** | **Mike**, BuilderSpace's organiser. Pricing, sponsorship, and venue-commitment questions go straight to him. |
| **Voice** | Concrete and builder-to-builder: formats, dates, run sheets. No hype, no invented sponsors, venues, or attendance. |
| **Hard rails** | BuilderSpace pages and copy carry no SmartCiti.X material — the tour is its own context. Sponsor and employer pages stay held until a sponsor conversation opens; the phone never sends ahead of that gate. |

## The daily rhythm, shared

Every phone runs the same day; only the queue and voice differ.

1. **Morning Brief (07:00).** Reach composes the day from the phone's
   own state — due follow-ups by name, drafts waiting, unreads, the
   cap counters, the phone's own impact so far, and its next best
   action — and reads it aloud (ElevenLabs voice when connected,
   browser voice otherwise). On a holding phone the brief names the
   phone, its profile, its mission, and its human handoff.
2. **Queue.** Reach works the phone's queue in order: research step
   (live via Tavily when connected, labelled; staged and labelled
   otherwise), then a draft built only from what is on record.
   Suppressed people are refused *before* drafting — out loud, and
   on the record.
3. **Approvals.** Nothing executes without the human's tap on the
   exact text. Approved drafts move by Copy/Share in the PWA today,
   or by the PhoneUse bridge where the local configuration supports
   it (below).
4. **Follow-ups.** Every completed touch offers a 3/7/30-day nudge.
   Nudges surface on Today when due — no notifications, no nagging.
5. **Write-back.** Every outcome — sent, bounced, unsubscribed,
   replied, refused — lands in the programme's records the same day
   (the wiring spec below), so tomorrow's queue starts from truth.

## The PhoneUse layer: verified and UNVERIFIED

The fleet's execution hands are PhoneUse's. Two surfaces exist, and
this design keeps them strictly separate:

- **The local API — verified from the fork** (AGIFutureFoundation/
  phoneuse, read 2026-11-13): base `http://127.0.0.1:8765`,
  `GET /health` for detection, `POST /api/ai/tasks` with
  `Authorization: Bearer <scoped key>` and body
  `{ "device_id": "<udid>", "task": "<text>" }` for task hand-off.
  The API allowlists only its own web-UI origins
  (`http://localhost:3109`, `http://127.0.0.1:3109`), so the
  supported bridge configuration is Reach served on the same Mac —
  the booth setup. Reach v2.4 already implements this hand-off: the
  POSTed task is the approval card's exact text, byte-for-byte, and
  the scoped key lives in page memory only.
- **The hosted console — UNVERIFIED.** The console at
  console.phoneuse.com (account: x@agifuturefoundation.org) is where
  the three hosted phones live. A separate console review is
  inventorying its devices, plan, and surface in parallel. **Until
  that review lands, no console API base, endpoint, or device ID is
  claimed anywhere in Reach or in this document.** In the code, the
  console surface is configuration, not literals: `FLEET_CONFIG`
  in `app.js` carries `consoleApiBase` (empty) and a
  `consoleDevices` slot per holding (empty), and the harness asserts
  they ship unset. When the review relays the facts, they land in
  those slots and this section is updated with a dated note — the
  design does not change, only the config fills in.

**Task addressing, once config lands.** A phone task is addressed to
exactly one holding's device: `{holding → device}` from
`FLEET_CONFIG.phoneuse.consoleDevices`. A task for the Fellowship
queue can only be addressed to the Fellowship phone's device ID —
the mapping is part of the approval record, so a misaddressed task
is visible in the log before it runs, not after.

## The booth story (demo script extension)

*This is the fleet beat JUDGING.md's tour now performs; on the table
it reads like this. Three phones stand in a row, each showing Reach
on its own holding.*

> "One agent product, one approval law — but a network isn't one
> voice. So the fleet is three phones. This one is the **Fellowship
> phone**: it keeps the partners behind our city guides warm, and
> anyone who asks for a human reaches a Fellowship steward. This one
> is the **Foundation phone**: funders and partners, every specific
> ask answered on time, and a human — Russell, our co-founder — one
> reply away. And this is the **BuilderSpace phone**: the tour towns,
> the organisers, the employers at the demo table.
>
> Watch me try to break it: I'll load the Foundation's queue *on the
> Fellowship phone*. I can't — the Fellowship phone has never heard
> of Clara Whitfield. Her queue lives on her own phone, with her own
> phone's record of what's been sent, refused, and promised. That's
> not a setting. That's the architecture.
>
> And the law doesn't change with the phone: research first,
> labelled. Drafts only from what's on record. Nobody on a
> do-not-contact list is ever drafted to — the refusal is spoken and
> traced. Nothing sends without the tap. Three phones, three
> holdings, one approval law."

## Outreach wiring spec — phones inside the existing programme

*Docs only. This spec changes nothing about the running programme
and authorises no sends. It states how phone task queues connect to
the outreach machinery that already exists — the 30,000-person
programme (Nov 11 – Dec 22, 2026) in `~/workspace/your_files/
outreach-15k/`, CRM v4, and the people graph — when Mike puts it
live.*

### The principle

**Phones are an execution surface, not a source.** The programme
decides *who* may be contacted, *why*, and *with what* — through its
existing gates. A phone receives a finished, approved item, executes
it on its holding's device, and logs the outcome back. A phone never
originates a queue, never widens one, and never re-times one.

### What flows where

| Stage | Owner today | Phone's role |
|---|---|---|
| Pool building | CRM v4 + Firecrawl pools: **published institutional contacts only**, dedupe + suppression diff before anything stages | None. Phones never build pools. |
| Wave pack | The programme's wave packs (`WAVE-*-PACK.md`), personalised per SEGMENTS.md, reconciled against SEND-LOG.md, **48-address wave guard**, caps checked | None. A pack is finished before a phone sees it. |
| Approval | The wave's existing approval (Mike's exact-text approval for campaign copy; Reach's per-item tap for phone-stage items) | The phone presents the item for its tap; the item's text is frozen at approval. |
| Execution | Webmail / Resend lanes (L1 agent@, L2 x@, L3 research@, …) inside **90/day per mailbox** and **≤250 cold/day** | An item already approved for a phone-executable channel (SMS / iMessage / a native app action via PhoneUse) is handed to **that holding's phone only**, as a PhoneUse task carrying the approved text byte-for-byte. The phone's staged sends count against the same daily caps — the counters are shared programme state, not per-device allowances. |
| Social | The distribution calendar under the social pacing law (one platform at a time, ~2 min between same-platform posts, ≤25 actions/platform/day, first warning = full stop that day) | A phone may execute an approved social item on its holding's own accounts only, inside the same pacing law. Fellowship accounts are never operated from the Foundation or BuilderSpace phone. |
| Write-back | SEND-LOG.md (every send, with evidence), SUPPRESSION-LOG.md, people-graph `people.json` contact events | Every phone outcome writes back the same day: sent → send-log row + contact event; hard bounce → address marked DEAD in suppression; unsubscribe / "stop" → suppressed everywhere, all lanes, all phones; reply → reply-watch queue; human asked for → handoff flag to that holding's human (Fellowship steward / Russell / Mike) and the thread leaves automation. |

### Queue assignment rules

1. **One holding, one phone, one queue.** A wave pack item carries
   its lane (L1/L2/L3…) and segment; the lane's holding decides the
   phone. L1 (Fellowship) items can only ever queue on the
   Fellowship phone; L2 (Foundation) items only on the Foundation
   phone. BuilderSpace items come from the tour's own records, not
   the email programme's lanes.
2. **Suppression is checked twice**: once when the pack is built
   (programme gate) and again on the phone before drafting
   (Reach's rail). Either check can refuse; neither can override
   the other.
3. **Caps are shared.** The 90/day mailbox cap and ≤250 cold/day
   cap bind the programme, not the device. Three phones do not
   triple the caps; they divide them. Reach's on-device counters
   are the visible surface of the same numbers.
4. **Provenance rides along.** Every phone queue item carries its
   wave, segment, lane, and approval reference, shown on the card —
   the same provenance discipline Reach applies to its demo items.

### What the phones must never do

- **No cold sends outside a wave.** If it isn't in an approved wave
  pack, it doesn't exist for a phone.
- **No inferred contacts.** No pattern-generated, guessed, or
  brokered addresses — published institutional contacts only, the
  programme's standing rule, unchanged by the channel.
- **No house crossing.** A Fellowship phone never touches a
  Foundation or BuilderSpace queue, contact, account, or draft —
  and vice versa. The slot architecture exists to make this a
  property, not a promise.
- **No self-approval.** The agent that drafts an item never
  approves it; the tap is a human's, on the exact text, every time.
- **No re-queueing the dead.** Bounced, unsubscribed, and
  do-not-contact addresses are dead on every phone the moment the
  write-back lands — Simon Sharwood's standing suppression is the
  canonical example, and it binds the fleet exactly as it binds
  the mailboxes.
- **No invented anything.** No contact, count, venue, sponsor,
  reply, or result is ever fabricated to make a queue look fuller
  or a day look better. Verified numbers only.
- **No payments, signings, or submissions.** A phone drafts and,
  on approval, executes messages. It never moves money, signs,
  files, or commits a holding to anything.

### Go-live checklist (for when Mike says go)

1. Console review facts land → fill `FLEET_CONFIG.phoneuse`
   (console API base if one is verified; the three device IDs).
2. Scoped PhoneUse keys per phone, created per the fork's
   `create-key.py` pattern — one phone per key, with expiries;
   keys live in page memory / the Mac-side bridge, never in the
   store.
3. One pilot item per phone, end to end, with the write-back
   verified in SEND-LOG.md and the people graph before any queue
   larger than one is loaded.
4. Caps reconciliation: the phones' counters and the programme's
   send-log agree on day one, checked at the first morning brief.

## What ships today vs. what this designs

**Ships today (Reach v2.5, live):** Holding Mode in the app — the
switcher, the three isolated slots with fictional starter sets and a
complete demo flow each, per-holding brief and impact, the fleet
beat in the Judge Mode tour, and this document.

**Designed here, gated on facts and Mike's go:** console device
addressing (console review in flight), live queue feeds from the
wave packs (go-live checklist above), and any real sending — which
stays exactly where today's programme keeps it: behind approvals,
inside caps, on the record.
