# Reach

> **Your phone is on Do Not Disturb. Your agent isn't.**

**Live demo: https://reach.agicorp.network/** ·
Built at the **Do Not Disturb: Phone Use Hackathon** (Exit 1),
Frontier Tower, San Francisco — 2026-11-13, by AGI Future Foundation.

Reach is a **relationship action agent** for phone-first people —
founders, community builders, freelancers, organisers, job seekers.
Every day it surfaces the few people who need a reply, a thank-you,
or a reconnection; it reads the screen, does the research step, and
types the draft. You make exactly one decision per message:
*approve this exact text?* Three touches a day, two minutes each —
**never let a warm connection go cold.**

**Try it:** open the live demo on a phone, tap **“Show me Reach
(90 seconds)”** — or press **Next best action** on Today. Turn on
**Judge mode** in the panel for the staged tour with the
sponsor-stack lap.

## The rails are the product

Everything below is enforced as behaviour, tested, not promised:

- **Draft-first, exact-copy approval.** The agent cannot approve its
  own work. Nothing sends without the human's tap on the exact text.
- **Suppression before drafting.** A do-not-contact person is a
  refusal, stated out loud — never a draft.
- **Personalisation gate.** No context on record, no draft. Unknowns
  become `[bracketed prompts]`, never invented details.
- **Caps as counters.** 90 sends/day per mailbox, ≤250 cold/day —
  persisted per calendar day; at the cap, sends are refused.
- **Provenance on every item.** Seed demo data, added by you,
  imported by you, or a use-case pack — labelled on the card.

## What's in the demo

- **Today** — three touches, a spark row, one dominant Next best
  action, due follow-ups, and **Your Reach so far**: an impact panel
  whose every number is computed from the phone's own record.
- **Morning Brief** — the day composed from real state (follow-ups,
  waiting drafts, unreads, caps, next action) and read aloud.
- **Use-case packs** *(v2.4)* — one-tap scenario loaders:
  **Founder follow-ups**, **Recruiter pipeline**, **Nonprofit
  donors**, **Creator collabs**. Each loads a small fictional team
  in its own slot — your own people are never touched — and each
  pack's first person runs the full flow: research → draft →
  approval.
- **Holding mode — the fleet** *(v2.5)* — one desk per holding of
  the agentic network, routed to a five-phone fleet on the
  PhoneUse console: the **Fellowship desk** (community and
  city-guide outreach), the **Foundation desk** (partner and
  funder warmth), the **BuilderSpace desk** (builder and employer
  outreach). Each runs Reach with its own people slot, profile
  name, mission, and human handoff — a Fellowship steward, Russell
  Vacanti, Mike — under one approval law. Houses never cross: a
  holding's queue can only hold its own people, and the brief and
  impact panel count the active desk's own work. (Assignments
  approved by Mike, 2026-11-13: Phone 1 Fellowship, Phone 2
  Foundation, Phone 3 BuilderSpace, Phone 4 demo/booth, Phone 5
  Interview & Monitoring (Mike's 13:33 PT amendment — activated,
  not a reserve) — recorded in the app config.) The operating design is
  [PHONE-FLEET.md](PHONE-FLEET.md).
- **Draft studio, Listen mode, paste-import** — drafts only from
  what's on record; your list parsed on-device, uploaded nowhere.
- **Copy / Share** — the honest bridge to real apps, in your hand.

## Built on today's sponsor stack — for real

Bring-your-own-key, from the panel at the bottom of the page. Keys
live only in the browser's on-device store, are sent only to their
own provider, and every integration degrades with a labelled
fallback when it isn't connected. The full review — endpoints,
request shapes, what the docs do and don't settle — is in
[INTEGRATIONS.md](INTEGRATIONS.md).

- **[Tavily](https://tavily.com)** — the reply flow's research step
  runs live and the card is labelled **Live · Tavily** with its
  source; otherwise the staged profile runs, labelled as staged.
- **[ElevenLabs](https://elevenlabs.io)** — Listen mode, read-aloud,
  and the Morning Brief speak in a real voice (default: Sarah),
  with the browser voice as the instant per-line fallback.
- **[LangSmith](https://www.langchain.com/langsmith)** (LangChain) —
  every draft, approval, cap refusal and suppression refusal is
  traced, metadata only, to a project named `reach`. *Every refusal
  Reach makes is on the record.*
- **[PhoneUse](https://phoneuse.com)** — the sponsor's open-source
  local iPhone automation, and Reach's iOS execution layer.
  **Our fork: [AGIFutureFoundation/phoneuse](https://github.com/AGIFutureFoundation/phoneuse)**
  — its `docs/REACH.md` tells the integration from the PhoneUse
  side. Reach detects the local API (`GET /health`); since v2.4,
  approval cards can hand their exact text to it as a task
  (`POST /api/ai/tasks`, byte-for-byte — asserted in tests) in the
  supported same-Mac configuration. Boundaries are stated in the
  app, not papered over.

## Architecture in five lines

1. A dependency-free **PWA**: one static page, no server, no build.
2. The agent perceives the staged apps through their real DOM — the
   web-honest form of the accessibility tree — and its taps and
   typing are real operations on real elements.
3. State lives in one namespaced, schema-versioned localStorage
   entry; a service worker caches only the app shell.
4. The loop: perceive → research → draft → approve → act → verify,
   with the research step visible in the UI.
5. Next layers, labelled as roadmap: Android native on the
   OpenPhoneUse pattern (one AccessibilityService, approval gate
   interposed); iOS via the PhoneUse execution layer above.
   The native step is specified in [ROADMAP.md](ROADMAP.md).

## Tests

A Node harness executes the real `app.js` + `integrations.js`
against a DOM stub and asserts behaviour end to end:
**216 assertions, all green** — the v2 core, the habit layer, the
caps/provenance/import machinery, the sponsor adapters (live +
fallback paths), the brief/impact/judge-mode/warmth surfaces,
pack isolation proven against the store, the PhoneUse bridge's
payload equality proven byte-for-byte, and holding-mode fleet
isolation (including the negative space: no holding's people ever
appear on another holding's phone).

## Prize fit

The event awards **$3,000 in overall prizes — $1,500 / $1,000 /
$500** — and Reach contends for them on a working, useful,
rails-first phone agent. The practical-use-case proof is a working
fleet: the five phones on the sponsor's console carry a real
network's three holdings as isolated desks, each running Reach in
its own voice under one approval law (v2.5, PHONE-FLEET.md). It also
runs, for real, on the stacks of the event's partners: LangChain
(LangSmith), Tavily (co-host of this edition), PhoneUse (whose
open-source stack is forked above), and ElevenLabs. No category or sponsor-specific prizes are claimed,
because none are on the event record. The judging script is
[JUDGING.md](JUDGING.md).

## Monetization

[MONETIZATION.md](MONETIZATION.md) — Free BYOK; Pro for
individuals; Team per seat (shared suppression lists, the audit
trail, caps per seat); the PhoneUse execution add-on. Prices are
set at launch; the document commits to the model, not to invented
figures. The in-app **“Reach Pro — join the waitlist”** card
composes a real email via your own mail app — the funnel works
today.

## Honesty notes

The seeded people and organisations are fictional and labelled as
such everywhere they appear. Nothing in the web demo sends anywhere
real; Copy/Share moves text *you* choose into your own apps.
Anything you add — profile, people, drafts — is stored only in
your browser, on your device; export or erase it any time. Where a
claim stops, the copy says so: see the footer of the live demo and
[DESIGN.md](DESIGN.md).
