# Reach — Judging Guide

*For the Do Not Disturb: Phone Use Hackathon (Exit 1), Frontier Tower, 2026-11-13.
Live demo: https://reach.agicorp.network/ · https://agifuturefoundation.github.io/reach/*

## The 30-second pitch

> Your phone is on Do Not Disturb. Your agent isn't.
>
> Reach is a relationship action agent for phone-first people. Every day it
> surfaces the few people who need a reply, a thank-you, or a reconnection —
> it reads the screen, does the research step, and types the draft. You make
> exactly one decision per message: *approve this exact text?* Nothing sends
> without you, nobody on a do-not-contact list is ever drafted to, and the
> sending caps of a real outreach programme are enforced as counters, not
> advice. Three touches a day, two minutes each — **never let a warm
> connection go cold.**

## The 90-second tour (button by button)

Tap **“Show me Reach (90 seconds)”** in the panel — the gold button. It runs
hands-free; narrate over it with these beats:

1. **Today (0:00)** — "Not an inbox. A short list of people: one reply, one
   thank-you, one reconnection. The spark row is the habit — three touches
   a day. The counters under it are the real programme caps: sends used
   today, out of 90 per mailbox and 250 cold."
2. **The reply flow (0:20)** — Reach opens Messages, reads the first unread
   thread aloud, then runs a visible **research step** (the card says on its
   face that it simulates the live web-research lookup) before drafting.
   "The agent reads the same structured elements a screen reader reads —
   the accessibility tree, not screenshots."
3. **The approval card (0:45)** — "The whole product in one card. Reach read,
   researched, and typed. The next tap is always, only, the human's — in
   this tour it presses approve as a stand-in, and says so." Watch the reply
   type itself into the composer and land in the thread; watch a send
   counter tick up on Today.
4. **The thank-you draft (1:05)** — built only from what's on record about
   that person. "Anything Reach doesn't know becomes a bracketed prompt —
   never an invented detail."
5. **Close (1:20)** — back on Today, a touch is lit. "Everything you add
   stays on this phone. Reach drafts; you decide."

If a judge wants the refusal: tap **Work the outreach queue** — the second
contact is on the do-not-contact list, and the agent refuses, out loud,
before drafting anything. If a judge wants *their* data in it: **Outreach →
Import your people** — paste two lines, watch them join the queue, parsed
on-device, uploaded nowhere.

## v2.3 — the judges build (new today)

Three additions, all from real state, all reversible:

- **Judge mode** — one toggle under the flow buttons. On: the 30-second
  pitch appears as a dismissible banner on Today, the **Next best action**
  grows, and the 90-second tour gains a **sponsor-stack lap** — it reports
  each provider's real connection state, replays the research beat, and
  works the queue so the refusal lands while LangSmith watches. Off:
  everything returns to normal; the flag is one persisted boolean.
- **Morning Brief** — the **Brief me** button (or say/type “brief me”):
  the daily-habit hero. Reach composes the morning from live state —
  due follow-ups by name, drafts waiting, unread count, the cap
  counters, your impact so far, and the next best action — and **reads
  it aloud**, in the ElevenLabs voice when one is connected (default:
  Sarah, chosen for the brief), the browser voice otherwise, saying
  which. A `reach.morning_brief` run joins the LangSmith record when
  tracing is on.
- **Your Reach so far** — an impact panel on Today: touches completed,
  drafts approved, items carried to real apps, follow-ups scheduled,
  **refusals honored** (suppression + cap, counted since v2.3 and
  labelled so — nothing back-filled), people protected, days active.
  Every number is computed at render time from this phone's own
  persisted record; demo touches on the seeded stage are counted and
  the panel says so. **Share my warmth report** renders those same
  numbers as a shareable card — “Never let a warm connection go
  cold” — drawn on-device, no external images, no tracking.

## v2.4 — the winner expansion (new today)

Three more additions, each aimed at a question judges actually ask:

- **Use-case packs** — *“Fine, but who is it for?”* The Outreach view
  carries one-tap scenario loaders: **Founder follow-ups** (investors
  + advisors), **Recruiter pipeline** (candidates kept warm),
  **Nonprofit donors** (thank-yous + updates), **Creator collabs**
  (brand/partner outreach). Each pack loads its own small fictional
  team, narrates what it loaded, and its first person runs the
  complete flow — **research → draft → approval**. Packs live in their
  own slot: loading one stashes your real list untouched, pack saved
  drafts are never persisted, and “My people” restores everything
  exactly. The isolation is not a claim — the harness proves it
  against the store (23 pack assertions). The recruiter and nonprofit
  packs each include a do-not-contact person, so the refusal demos
  inside a real use case, not just the seed data.
- **The PhoneUse bridge** — *“But does it ever touch a real phone?”*
  v2.3 detected the sponsor's PhoneUse stack; v2.4 hands off to it.
  While PhoneUse is detected, every approval card offers **“Send to
  my phone via PhoneUse”**: the card's exact text is POSTed to the
  local API's documented task endpoint (`POST /api/ai/tasks`) as the
  task payload — byte-for-byte, which the harness asserts against
  the captured request body. The bridge key is a scoped PhoneUse key
  kept in page memory only, never stored. The environment truth is
  stated in the app and in INTEGRATIONS.md: the API allowlists only
  its local origins, so the supported configuration is Reach served
  on the same Mac (the booth setup) — from the public site the
  refusal is narrated and Copy/Share carries the message. A submitted
  task is narrated as submitted, never as delivered.
- **Reach Pro, for real** — *“How does this make money?”* A
  **“Reach Pro — join the waitlist”** card in the panel composes a
  prefilled email to the team's own inbox via the judge's own mail
  app — functional today, no form vendor, no tracking. The full
  model is **MONETIZATION.md**: Free BYOK, Pro for individuals, Team
  per seat (shared suppression, audit trail, caps per seat), and the
  PhoneUse execution add-on — prices set at launch, no invented
  figures.

## v2.5 — holding mode: the fleet (new today)

*“Fine — but does it run anything real?”* The PhoneUse console
account (agent@agifellowship.church) holds **five phones**, set up
for exactly this. v2.5 turns them into a fleet:

- **One desk per holding, routed to the fleet** — the **Fellowship
  desk** (community and city-guide outreach; human handoff: a
  Fellowship steward), the **Foundation desk** (partner and funder
  warmth; handoff: Russell Vacanti, the co-founder), the
  **BuilderSpace desk**
  (builder and employer outreach in the tour towns; handoff: Mike).
  The switcher sits beside the pack loader in the Outreach view.
- **Each desk is a world**: its own people slot, profile name,
  mission, and starter set in its own voice — the Fellowship lead's
  thank-you to a shelter partner, the Foundation lead's follow-up
  to a programme officer (offering Russell by name), the
  BuilderSpace lead's session-format reply to a meetup organiser.
  Each first card runs the full flow: research → draft → approval.
- **Isolation is architectural, and the tour proves it.** The
  Judge Mode tour gains a **fleet beat**: it ends standing on the
  Fellowship phone, drafts its first card in the Fellowship's
  voice, and states the cross-check out loud — Clara Whitfield
  exists on the Foundation phone; the Fellowship phone has never
  heard of her. Houses never cross because a slot can only hold
  its own people — asserted in the harness, including the negative
  space (37 fleet assertions).
- **The brief and the proof follow the desk.** On a holding desk,
  the Morning Brief names the desk, its profile, its mission and
  its handoff, and the impact panel counts that desk's own
  touches, labelled as such. On “My people”, both behave exactly
  as before.
- **Config, not claims.** The hosted console's API surface is
  under review in parallel, so Reach hard-codes none of it: the
  fleet config carries the verified local surface (from the fork)
  and deliberately empty console slots — device IDs land as
  configuration when the review reports, and the harness asserts
  the slots ship empty. The full operating design — role cards,
  daily rhythm, and the spec wiring the phones into the existing
  outreach programme's waves, suppression law, and caps — is
  **PHONE-FLEET.md**.

**The booth version:** three of the fleet's five phones on the
table, three holdings at their desks, one approval law. Load each
phone with its holding's desk, run the brief on one, a refusal on
the second, an approval on the third — then try to load the
Foundation's queue on the Fellowship desk, live, and let the
architecture answer. (Which physical phone serves which holding
is assigned from the console inventory — PENDING in the config,
by design.)

## Sponsor stack — live (v2.2, new today)

The three sponsor tools are not logos in this build — they are wired
in, behind a **bring-your-own-key** panel at the bottom of the page
(“Connect the sponsor stack”), and each one degrades honestly when it
isn't connected. The 20-second version, live on stage:

1. **Tavily (0:00)** — paste a Tavily key, tap *Connect & test*: the
   panel reports a real live search result. Then run *Reply to first
   unread* — the research step now hits the live web, and the card is
   labelled **Live · Tavily** with its source shown. Disconnect, run
   it again: the staged profile returns, labelled as staged. The two
   are never blurred, and a failed live call narrates its fallback.
2. **ElevenLabs (0:10)** — paste a key, tap *Connect & test*: the
   test sentence plays in a real ElevenLabs voice. *Listen to my day*
   now reads in that voice; kill the network and it falls back to the
   browser voice mid-demo without missing a line.
3. **LangSmith (0:15)** — paste a key: the panel flips to
   **“Tracing: on (LangSmith)”** and a `reach.connection_test` run is
   dispatched. Now work the queue: the do-not-contact refusal, every
   draft, every approval lands in the project as a run —
   `reach.suppression_refusal`, `reach.draft_created`,
   `reach.cap_refusal`. *Every refusal Reach makes is on the record.*
   Tracing is fire-and-forget metadata only: no message text, no
   contact details, and a dead network changes nothing on screen.
   Since v2.3 the runs collect in a dedicated project named
   **`reach`** (created for this build; the panel's Project field
   defaults to it).

4. **PhoneUse (0:20, v2.3)** — the fourth row needs no key at all:
   *Detect PhoneUse* asks the local service at `127.0.0.1:8765` for
   its health. **If PhoneUse is running on the Mac at the booth, the
   panel detects it live** — “Connected · PhoneUse local API.” From
   the public site it will usually read “not detected,” and the copy
   on the row already says why that's the normal result (browsers
   block local calls from HTTPS pages) — the fork and the
   architecture carry the beat: **https://github.com/AGIFutureFoundation/phoneuse**.
   The story: PhoneUse is Reach's iOS execution layer — an approved
   card here becomes a PhoneUse task on your own Mac + iPhone, and
   nothing reaches PhoneUse that Reach didn't get a tap for. Today
   that's architecture + live detection; we don't claim the PWA
   sends through it.

**The honesty paragraph.** Keys live only in this browser's local
storage, are sent only to their own provider, and are never exported
or routed through us. None of the three vendors' docs promise
browser CORS, so every integration is built to fail gracefully —
the review, with sources and the exact request shapes, is in
[INTEGRATIONS.md](INTEGRATIONS.md). And with no keys connected, the
demo behaves exactly as v2.1 did: the integrations are progressive
enhancement, not a dependency.

## Architecture in 10 lines

1. Today: a dependency-free **PWA** — one static page, no server, no build.
2. The agent perceives the staged apps through their real DOM — the
   web-honest form of the accessibility tree — and its taps and typing are
   real operations on real elements.
3. The loop is an orchestration shape: perceive → research → draft →
   approve → act → verify, with the research step visible in the UI.
4. State (profile, people, drafts, counters, nudges) lives in one
   namespaced, schema-versioned localStorage key; a service worker caches
   only the app shell, same-origin, cache-first.
5. Copy/Share is the honest bridge to real apps until connectors land.
6. **Next: v3** — a real inbox behind the stage (read-only first), approved
   drafts handed to send connectors, Sent-verification back to the phone,
   agent-net packets as the work transport.
7. **Then Android native**, on the OpenPhoneUse pattern: one
   AccessibilityService reading the live accessibility tree — no root, no
   ADB — plus a notification listener for the cross-app reply queue, with
   Reach's approval gate interposed before any send.
8. **iOS is deliberately smaller**: no cross-app reading exists there, so
   Reach is an approval console — drafts arrive as cards, the human
   approves — and **PhoneUse** (the sponsor's open-source local stack;
   our fork: github.com/AGIFutureFoundation/phoneuse) is the execution
   layer that makes an approval real on an iPhone: the approved card
   becomes a task on the user's own Mac + phone, via its local API or
   MCP server. The v2.3 panel detects a running PhoneUse by its health
   check; the task hand-off is the native-path next step.
9. The CRM stays the system of record; Reach is its phone surface, not a fork.
10. The approval is not a v1 limitation. It is the product, on every layer.

## The rails (all enforced as behaviour, not promises)

- **Draft-first, exact-copy approval.** The agent cannot approve its own work.
- **Suppression is law** — checked *before* drafting; the refusal is narrated.
- **Personalisation gate** — no context on record, no draft; unknowns become
  `[bracketed prompts]`, never invented details.
- **Caps as counters** — 90 sends/day per mailbox, ≤250 cold/day, persisted
  per calendar day; at the cap the send is refused and the draft waits.
- **Provenance on every item** — seed demo data, added by you, or imported
  by you, in one line, on the queue card and the approval card.
- **Verified numbers only** — summaries count what actually happened.

## Path to revenue

*The full model — tiers, pricing posture, channels — is in
[MONETIZATION.md](MONETIZATION.md). The short version:*

The model, stated plainly — no invented figures, no traction claims:

- **Per-seat pricing for small outreach and founder teams.** The buyer
  is a 2–20 person team whose relationships live in the founder's
  phone: agencies, studios, community builders, small sales teams.
  Reach is priced per seat, per month — the unit is a person whose
  warm connections stop going cold.
- **The rails are the paid differentiator.** Draft-first exact-copy
  approval, suppression checked before drafting, caps enforced as
  counters, provenance on every item. Free tools will draft anything
  to anyone; Reach is the one a team can trust near its real
  relationships, because the no is enforced, narrated, and — with
  LangSmith connected — on the record.
- **Metered costs sit with the user, by design.** The BYOK model means
  Tavily research credits and ElevenLabs voice characters are spent
  from the customer's own provider accounts, at the provider's own
  rates. Reach carries no inference or voice margin risk; the
  customer's usage is the customer's bill, visible in their own
  dashboards.
- **LangSmith traces are the enterprise audit story.** The same
  fire-and-forget run record that demos today becomes the compliance
  artifact a larger team buys: every draft, approval, refusal, and
  cap event, metadata only, in their own workspace. That is the
  upsell from seats to teams to organisations with a duty of care
  over outreach.

## Prize fit

What the event record supports, and nothing more: the Do Not Disturb:
Phone Use Hackathon (Exit 1, Frontier Tower, 2026-11-13) awards
**$3,000 in overall prizes — $1,500 / $1,000 / $500** — and Reach is
built to contend for the overall prizes on the strength of a working,
useful, rails-first phone agent. The build also runs on the stacks of
two of the event's partners, for real: **LangChain** (LangSmith
tracing, in a project created for this app) and **Tavily** (live
research, co-host of this edition) — plus ElevenLabs voice. And the
practical-use-case proof is a working fleet, not a slide: as of
v2.5, the five phones on the sponsor's own console carry a real
network's three holdings as isolated desks, each running the same
rails-first agent in its own voice, under one approval law. No category or
sponsor-specific prizes are claimed, because none are on the event
record.

## Deliberately NOT in the demo

- **No real sending.** The stage's apps are staged; Copy/Share is the bridge
  to real apps, in the user's own hand. Nothing here mails anyone.
- **Fictional seeds, labelled** — in the header chip, on Today, and in the
  footer. Anything a judge adds is marked as theirs and stored only on
  their phone.
- **No notifications, streaks, or badges** — the all-done state ("You're
  clear — every warm connection is warm") is the retention mechanic.
  Nagging would betray the Do Not Disturb thesis.
- **No contact import from the address book** — paste-import only, parsed
  on-device; the connector layer inherits the programme's
  published-contacts-only rule.
- **No native phone control claimed from a web build** — the Android layer
  is a labelled roadmap with a proven pattern, and the iOS boundary is
  stated, not papered over.
