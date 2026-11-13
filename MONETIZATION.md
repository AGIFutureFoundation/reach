# Reach — Monetization

*The model, in plain terms. Prices are set at launch; this document
commits to the shape of the model, not to dollar figures. No traction,
revenue, or user numbers are claimed anywhere in it — Reach was built
at a hackathon on 2026-11-13 and this is the plan it launches with.*

## The one-sentence version

Reach is free to try with your own keys, paid when it becomes a daily
habit, and priced per seat when a team trusts it with real
relationships — because the thing being sold is not drafting, it is
**drafting a team can trust**: every message approved as exact copy,
suppression enforced before drafting, caps enforced as counters, and
an audit trail of every refusal.

## Tiers

### Free — BYOK (bring your own keys)

- The full PWA: Today, the three daily touches, the reply / thank-you /
  reconnection flows, the draft studio, Copy/Share to real apps.
- Sponsor-stack integrations with the user's own keys: Tavily research,
  ElevenLabs voice, LangSmith tracing. The user pays those providers
  directly, at the providers' own rates — Reach carries no inference
  or voice margin, and the user's usage is visible in their own
  dashboards.
- The rails are not a paid feature. Suppression, caps, provenance, and
  exact-copy approval are on in Free, because a tool that only behaves
  safely on the paid tier is not a safe tool.

### Pro — for individuals

For the founder, freelancer, or community builder whose phone *is*
the CRM:

- Morning Brief (the composed, read-aloud start to the day).
- Use-case packs beyond the starter set, and personal pack building.
- Voice-first operation end to end (ElevenLabs voices, Listen mode).
- Follow-up intelligence: the nudge engine across 3 / 7 / 30 days,
  warmth reporting.
- Priority on the native layers as they land (below).

### Team — per seat

For the 2–20 person teams in the Path to revenue (agencies, studios,
community builders, small sales and outreach teams):

- **Shared suppression lists** — one do-not-contact truth for the
  whole team, enforced before drafting on every seat.
- **The LangSmith audit trail as a team artifact** — every draft,
  approval, refusal, and cap event, metadata only, in the team's own
  workspace. This is the compliance story a team with a duty of care
  over outreach actually buys.
- **Caps per seat and per team**, so a programme's limits are a
  property of the organisation, not of each person's memory.
- Shared use-case packs and per-person fit notes.

### Execution add-on — the native layer

- Reach's approval console paired with a **PhoneUse-style execution
  layer** (the sponsor's open-source local iPhone automation; our fork
  carries the integration doc): approved cards become tasks on the
  user's own Mac + iPhone. Priced as an add-on because it is a
  different operational commitment — local hardware, scoped keys,
  read-back verification — not because approval is premium. Approval
  stays free; *execution* is the add-on.
- Android native, on the OpenPhoneUse pattern (one AccessibilityService,
  approval gate interposed before any send), joins the same add-on
  when it ships.

## Pricing posture

- **Set at launch.** No figure in this document is a price; when
  prices are published they will be published here first and changed
  only with a dated note.
- Per-seat for Team, flat for Pro — the unit is a person whose warm
  connections stop going cold.
- Metered third-party costs (research credits, voice characters)
  stay with the user's own provider accounts under BYOK at every
  tier. Reach does not mark them up.

## Channels

1. **This repository** — the live demo is the funnel: use it free,
   hit the limit of the free tier, join the waitlist from inside the
   app ("Reach Pro — join the waitlist" composes a prefilled email;
   no form vendor, no tracking).
2. **The network store** — the AGIFutureFoundation network already
   sells books, packs, and services (agicorp.network/store); Reach
   Pro and Team join that storefront as products when pricing lands,
   and the waitlist converts there.
3. **Services around the product** — the network's existing
   gig pattern (build-alongs, train-the-trainer, DevRel and course
   design, sold on Fiverr and direct): "Reach for your team" setup,
   pack-building, and rails audits are services revenue that needs
   no new machinery and funds the product roadmap.

## What is NOT the model

- No selling contact data, ever — Reach's contacts live on the
  user's device; there is nothing to sell and the posture is the brand.
- No ads, no affiliate links inside the product.
- No invented urgency: no fake seats-left counters, no launch
  discounts on prices that don't exist yet.
- No charging for safety: the rails ship in Free (above).

*Companion documents: JUDGING.md (the pitch and prize fit),
INTEGRATIONS.md (the sponsor-stack review), DESIGN.md (the product),
and the PhoneUse-side integration doc in the
[phoneuse fork](https://github.com/AGIFutureFoundation/phoneuse/blob/main/docs/REACH.md).*
