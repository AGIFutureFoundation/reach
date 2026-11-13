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
   approves, connectors send.
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
