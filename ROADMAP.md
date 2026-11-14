# Reach — Roadmap: the native Android step

**Status: Roadmap — designed, not built.** Nothing in this document
is a shipped capability. The shipped product today is the web demo
(Layer 1 in [DESIGN.md](DESIGN.md) §3): a dependency-free PWA whose
agent perceives staged apps through their real DOM. This document
specifies the next step — a native Android layer — so the step can
be picked up without re-deriving the design. It expands DESIGN.md
§3 Layer 2 and §7 item 6 (v4); where this document and DESIGN.md
differ, DESIGN.md governs until both are updated together.

*Written 2026-11-13, post-hackathon polish (deep work loop,
tranche C-4). No dates are committed here: sequencing is by phase,
and each phase starts on a human decision, not a calendar.*

---

## 1 · The pattern: OpenPhoneUse

The native layer follows the shape proven by **OpenPhoneUse**
(github.com/joungminsung/OpenPhoneUse), an open-source phone-use
agent from this event's own ecosystem:

- Runs **on-device on Android** — no PC, no root, no ADB.
- **One AccessibilityService** is the whole perception/input layer:
  it reads the live accessibility tree of other apps and dispatches
  taps, scrolls, and text entry into fields.
- Declared purpose: the service exists to operate the phone at the
  user's direction.

Reach adopts that shape exactly — one accessibility service, the
accessibility tree as perception, declared purpose — and adds the
one component a general phone-use agent does not need but an
outreach agent must have: **the approval gate, interposed before
any send** (§3). The pattern is proven; the gate is Reach's own
work and is the part that must be tested hardest.

## 2 · What the native layer must carry over, unchanged

The rails are the product, and they do not relax at the native
layer — they move from the page into the service:

- **Draft-first, exact-copy approval.** The agent cannot approve
  its own work. A send happens only after a human taps approval on
  the exact text, on-device.
- **Suppression before drafting.** A do-not-contact person is a
  refusal, stated out loud — never a draft — in every app the
  service can touch.
- **Personalisation gate.** No context on record, no draft.
  Unknowns become `[bracketed prompts]`, never invented details.
- **Caps as counters.** 90 sends/day per mailbox, ≤250 cold/day —
  persisted per calendar day, binding the account across devices,
  never multiplied by them. At the cap, sends are refused.
- **Provenance on every item.** Seed, added-by-you, imported, or
  pack — labelled on the card, in native UI as in the web demo.
- **House separation.** Holding desks (Fellowship / Foundation /
  BuilderSpace) keep their own people slots; a desk's queue can
  only hold its own holding's people.
- **Tracing.** Every draft, approval, cap refusal and suppression
  refusal traced, metadata only, as the web demo already does
  (LangSmith project `reach`).

## 3 · The approval gate, interposed

Mechanically, the gate sits between the agent's *act* step and the
target app:

1. The service perceives the target app's accessibility tree and
   prepares the full action sequence (open thread → type exact
   text → **stop**).
2. Typing is permitted; the send control is not. Before any node
   matching a send/post/submit action can be dispatched, the
   sequence halts and Reach renders its own approval card — the
   exact text, the recipient as shown by the target app, the
   provenance label, the day's cap counters.
3. Only a human tap on that card releases the single send action.
   Editing the text voids the approval: the edited text is a new
   draft and is re-presented.
4. After the send, the service re-reads the tree and verifies the
   message landed (the loop's *verify* step), then writes the
   outcome back — to the CRM via agent-net packet, per DESIGN.md
   §4. The phone renders a slice; it does not fork the data.

A target app whose send control cannot be reliably identified is
**not** automated: the flow degrades to the web demo's Copy/Share
bridge — the honest bridge, in the human's hand.

## 4 · Phases

Each phase ends at a named gate; no phase auto-starts the next.

- **Phase 0 — Spike (one app, one phone).** A throwaway
  AccessibilityService on a single Pixel device that reads one
  messaging app's tree and types a draft into its composer —
  send control never dispatched. Proves perception + typing on
  the real tree, the native analogue of the demo's DOM reads.
  *Gate: tree reads and typing verified on-device, by a human
  watching.*
- **Phase 1 — Gate interposition.** The §3 approval card wired
  into the spike: send dispatch exists only behind the card;
  edit-voids-approval and post-send verify implemented; refusal
  paths (suppressed contact, cap reached) rendered natively.
  *Gate: the harness asserts — no send without an approval event,
  byte-for-byte text equality between card and composer.*
- **Phase 2 — Notification-driven queue.** A
  NotificationListenerService surfaces inbound replies across
  apps into the Reach queue, so "reply to the first unread
  message" becomes a cross-app instruction. Morning Brief and
  the impact panel read native state. *Gate: queue counts
  reconcile against the apps' own unread badges on-device.*
- **Phase 3 — Fleet desks.** Holding Mode desks run natively,
  one desk per device, under the same assignment recorded in
  `app.js` (`FLEET_CONFIG`) and [PHONE-FLEET.md](PHONE-FLEET.md).
  Work arrives and returns as agent-net packets. *Gate: the
  fleet isolation tests (no holding's people on another holding's
  phone) pass against the native build, as they do against the
  web demo.*
- **Phase 4 — Distribution readiness.** Accessibility-purpose
  declaration and store disclosures (§5), onboarding that grants
  the accessibility permission with its purpose stated in plain
  language, and a no-permission degraded mode that is the web
  demo's Copy/Share bridge. *Gate: Mike's review of the exact
  declaration and disclosure text before anything is submitted
  anywhere.*

## 5 · Obligations the design already anticipates

- Android requires accessibility-API apps to **declare their
  purpose**; Reach's declaration writes itself from DESIGN.md §2 —
  the user directs, the agent drafts, the human approves,
  suppression and caps enforced by the agent layer, not by the
  target app.
- Accessibility permission is powerful and the onboarding must
  say so plainly, in the app's own voice, before the system
  prompt appears — no dark patterns, no bundling with unrelated
  consent.
- Store policy for accessibility services changes; Phase 4
  re-checks the then-current policy rather than relying on this
  document.

## 6 · iOS — deliberately smaller (unchanged from DESIGN.md)

iOS forbids cross-app screen reading and synthetic input outside
an app's own sandbox. There is no honest version of this roadmap
on iOS, and Reach will not pretend otherwise. The iOS shape stays
an **approval console**: drafts prepared elsewhere arrive as
approval cards; the human approves; the PhoneUse execution layer
(the fork, AGIFutureFoundation/phoneuse) or a connector acts.
The human's decision — the part that must stay human — is fully
mobile on iOS even though the agent's hands are not.

## 7 · What stays off the roadmap

- No covert automation of third-party apps against their terms.
- No sending without a human approval event, on any layer, ever.
  The approval is not a v1 limitation to be optimised away; it
  is the product.
- No inferred or pattern-generated contact addresses, no
  personalisation invented to fill a gap — at the native layer
  exactly as in the web demo.
- No claim of native capability from the web build, in any copy,
  anywhere. Until Phase 0 lands, this document is the whole of
  the native story, and it is labelled roadmap wherever it is
  summarised.

## 8 · Open decisions (Mike's, when the step is picked up)

1. **First target app** for the Phase 0 spike — the app whose tree
   the fleet's desks need most.
2. **Distribution route** — direct APK, an alternative store, or
   Play — which decides how much of §5's store machinery applies.
3. **Device for the spike** — a fleet Pixel (the hosted fleet is
   paid until 13 Dec 2026 and its desks have day jobs) or a
   separate development device, so the spike never competes with
   a live desk.
