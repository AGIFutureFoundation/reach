# Reach

**An accessibility-first phone agent. v2 promise: never let a warm connection go cold.**

> The rule: everything has to be accessible from a phone.
> The agent reads the screen, taps, types, and replies.

v1 proved an agent can run outreach from a phone. v2 gives a person a
reason to open Reach every day: it is a **relationship action agent** for
phone-first people — founders, community builders, freelancers,
organisers, job seekers — that surfaces the few people who need a reply,
a thank-you, or a reconnection *today*, does the reading and typing, and
leaves the human exactly one decision per message: *approve this exact
text?* Outreach is the professional use case; the daily habit is keeping
warm connections alive in two-minute pockets of time.

**Try it:** open the demo on a phone and tap **“Show me Reach
(90 seconds)”** — or start on **Today** and press **Next best action**.
Speak commands where your browser supports it.

The seeded people and organisations are fictional. Anything *you* add —
your profile, your people, your saved drafts — is stored only in your
browser, on your phone. Nothing sends anywhere real.

## What's new in v2 — the habit layer

- **Today home.** A greeting, your **three touches today** as a row of
  sparks that fill as you complete them, three missions (Reply · Thank ·
  Reconnect), and **one dominant Next best action button** that always
  points at the highest-value pending thing. When nothing needs you,
  Today says so: *“You're clear — every warm connection is warm.”*
- **Make it yours.** Your name, role, tone (Warm / Direct / Playful),
  sign-off, and intention — kept in local storage and used by every
  generated draft. No account. A “Private on this phone” note travels
  with the panel: nothing leaves the device in this build.
- **Your people.** Add anyone with one honest line of context and a move
  (reply / follow-up / thank / invite / introduce / reconnect) — or mark
  them do-not-contact and Reach will protect that, out loud, forever.
  Your entries persist on the device and join the queue and Today's
  missions alongside the labelled demo seeds. Reset restores the seeds;
  your entries are never silently overwritten.
- **Draft studio.** Pick a person and a move; Reach drafts **only from
  the facts on record** for that person, shaped by your tone. Anything it
  doesn't know becomes a `[bracketed prompt]` for you — never an invented
  detail. No context on record, no draft: the personalisation gate from
  the outreach programme, now enforced as code.
- **Copy / Share — the honest bridge to real apps.** Every approval card
  can send (in the staged apps, as in v1), be **copied**, be **shared**
  through the phone's share sheet, or be **saved for later** (saved
  drafts persist too). Until connectors land, Copy/Share is how a Reach
  draft becomes a real message today: the text you approved-by-eye,
  carried by you, into your own apps. Reach itself sends nothing.
- **Listen mode.** One tap reads the day aloud in order — unreads, next
  action, waiting drafts, touches so far. Voice commands now include
  “next”, “copy”, “skip”, “thank”, “reconnect”, and “listen”.
- **Trust controls.** Export my data (one JSON file: profile, people,
  saved drafts, history) and Erase my data (confirm, local wipe back to
  seeds) live in the profile panel.
- **Delight, with restraint.** Sparks that fill, a warm all-done state, a
  tiny haptic tick on approval where the device offers one — all of it
  subordinate to the existing floors: 48px targets, AA contrast, ARIA
  live narration, `prefers-reduced-motion` respected everywhere.


## Why people come back

A CRM is a place you visit when you must. Reach is built as a daily
two-minute ritual instead:

1. **A reason to open it:** three named people, not a database — one
   reply, one thank-you, one reconnection.
2. **Zero blank-page cost:** the agent reads, researches, and types; the
   human only decides.
3. **A visible finish line:** three sparks. Fill them and the day is
   *done* — Reach says “you're clear” and lets you go, rather than
   inventing more queue to keep you scrolling.
4. **It sounds like you:** your tone and sign-off are in every draft, so
   approving feels like sending your own words, not a robot's.
5. **It remembers, privately:** your people and history live on your
   phone, exportable and erasable by you at any time.

## Why outreach, why a phone

Outreach tooling assumes a desk: CRM tables, harvested contact pools, a
webmail window. The people who know the community are rarely the people
sitting in front of that stack, and for organisers with motor impairments,
low vision, full hands, or no computer at all, the desktop *is* the
barrier. Reach collapses the work to one instruction and one decision:

1. You say (or type) what you want.
2. The agent reads the screen itself, taps through the app, types a draft.
3. You approve the exact text — one tap, or the word “approve”.
4. The agent sends, and narrates everything it did in plain language, so
   the work is checkable by ear through the live action log (an ARIA live
   region — screen readers speak it too).

## The rails are the product

Reach carries the rules of the AGI Future Foundation's real outreach
programme as system behaviour, not etiquette:

- **Draft-first, exact-copy approval.** Nothing sends that a human has not
  read and approved verbatim. The agent cannot approve its own work.
- **Suppression is law.** Anyone who asked not to be contacted is checked
  *before* drafting. The agent refuses, skips them, and says why. Try the
  queue flow — the second contact is on the do-not-contact list.
- **Personalisation gate.** Every queue item carries a visible fit note —
  the real reason this person. No reason, no draft.
- **Caps and pacing.** Sends are spaced and capped (the real programme:
  90/day per mailbox, ≤250 cold/day). The agent narrates the pace.
- **Verified numbers only.** Summaries count what actually happened in
  the session — never projections.

## How the demo maps to the real architecture

| Demo (this build) | Real version |
|---|---|
| Staged Messages / Outreach / Approvals apps, built as ordinary DOM | The phone's real apps, perceived through Android's accessibility tree |
| Agent reads the stage's elements and text | AccessibilityService reading the live accessibility tree — structured perception, not screenshots |
| Agent taps elements and types into the real composer | AccessibilityService gestures and text entry; notification listener surfacing replies across apps |
| Approval cards in the stage | Approval cards everywhere — including iOS, where cross-app reading is forbidden, so Reach is an approval console and connectors do the sending |
| Fictional queue with fit notes + suppression flags | The network's CRM as system of record; agent-net packets as the work transport; send connectors (Gmail / webmail) returning Sent-verified results |

The full reasoning — who this serves, the honest capability boundary of a
phone browser, the Android and iOS shapes, and the judging-criteria
mapping — is in [DESIGN.md](DESIGN.md).

## Run it

Static site, no build step, no dependencies:

```text
index.html · app.js · style.css · manifest.webmanifest · icon.svg
```

Serve the folder with any static host (GitHub Pages works) or open
`index.html` from a local server. Add it to a phone home screen and it
runs standalone.

Built to the network's accessibility floors: 48px+ touch targets, WCAG
AA contrast, visible focus rings, screen-reader operable, reduced-motion
support, safe at 200% zoom.

## Roadmap

- **v2 (this build)** — the habit layer: Today home, local profile,
  your people, draft studio, Copy/Share bridge, saved drafts, Listen
  mode, export/erase. **Live**
- **v3** — a real inbox behind the stage (read-only first); approvals
  handed to a send connector, replacing the Copy/Share bridge where a
  connector exists; Sent-verification returned to the phone; agent-net
  packets as transport. **Roadmap**
- **v4** — Android native layer (AccessibilityService + notification
  listener); iOS approval console. **Roadmap**

## Non-goals

Reach will not send unapproved messages in any version, draft to a
suppressed contact, infer anyone's address, or claim native phone control
from a web build.

---

*Reach · an AGI Future Foundation hackathon build · Made at **Do Not Disturb:
Phone Use Hackathon** (Exit 1), Frontier Tower edition · 2026-11-13 ·
"Your phone is on Do Not Disturb. Your agent isn't."*
