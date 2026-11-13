# Reach

**An accessibility-first phone agent for outreach.**

> The rule: everything has to be accessible from a phone.
> The agent reads the screen, taps, types, and replies.

Reach is a working demo of that rule. It runs a real outreach workflow —
answering inbound replies and working a contact queue — entirely from a
phone-sized web page, with the human making exactly one decision per send:
*approve this exact text?*

**Try it:** open the demo on a phone, tap **“Reply to first unread
message”** or **“Work the outreach queue”**, and watch the action log. Or
speak the command, where your browser supports it.

Every person and organisation in the demo is fictional. Nothing sends
anywhere real.

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

- **v1.1** — personalisation-gate enforcement as code, hard cap counters,
  per-item provenance lines.
- **v2** — a real inbox behind the stage (read-only first); approvals
  handed to a send connector; Sent-verification returned to the phone;
  agent-net packets as transport.
- **v3** — Android native layer (AccessibilityService + notification
  listener); iOS approval console.

## Non-goals

Reach will not send unapproved messages in any version, draft to a
suppressed contact, infer anyone's address, or claim native phone control
from a web build.

---

*Reach · an AGI Future Foundation hackathon build · Made at **Do Not Disturb:
Phone Use Hackathon** (Exit 1), Frontier Tower edition · 2026-11-13 ·
"Your phone is on Do Not Disturb. Your agent isn't."*
