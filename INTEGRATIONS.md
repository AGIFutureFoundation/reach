# Reach — Sponsor-stack integrations: the review

*Reviewed 2026-11-13, during the Do Not Disturb: Phone Use Hackathon,
from each vendor's primary documentation. This file records exactly
what the docs settle, what they don't, and the smallest request shape
Reach ships for each provider. Implementation: `integrations.js`,
wired into `app.js` as progressive enhancement. Architecture:
bring-your-own-key — the user's key lives only in the on-device
store and is sent only to its own provider, directly from the
browser.*

## Tavily — live research

| | |
|---|---|
| **Endpoint** | `POST https://api.tavily.com/search` |
| **Auth** | `Authorization: Bearer <key>` header, `Content-Type: application/json`. (The body field `api_key` is the legacy alternative; Reach uses the header.) |
| **Smallest body** | `{ "query": "…" }` — only `query` is required. Reach sends `{query, search_depth: "basic", max_results: 3, include_answer: false}`. |
| **Response shape** | `{ results: [{ title, url, content, score, published_date }], usage: { credits }, request_id }` — Reach reads the top result's `title`, `url`, `content`. |
| **Free tier** | Researcher plan: **1,000 credits/month, free, no card**. A `basic` search costs **1 credit** (advanced costs 2). A judged demo day costs single-digit credits. |
| **Browser CORS** | **UNVERIFIED** — the docs do not state a CORS policy for browser-origin calls. Designed for graceful failure: any failed call falls back to the labelled staged profile, narrated. |
| **Sources** | docs.tavily.com — Search API reference (response schema, fetched 2026-11-13) and *Credits & Pricing* (free tier + per-depth credit costs, page updated 2026-11-13). |

**Reach behaviour.** Connected: the reply flow's research step calls
`/search` with the thread's organisation and contact name, and the
card shows the top result's title + content with its source URL,
labelled **Live · Tavily**. Not connected, or any failure: the
original staged profile runs, labelled exactly as before, and the
fallback is narrated — a live result is never faked.

**Captured at build time (v2.3).** While no key is connected, the
Tavily panel row also shows a **“Captured live at build time ·
Tavily · Nov 13, 2026”** block: two real searches run from the build
machine on 2026-11-13, about the org types behind two seeded queue
contacts — (1) *tool library community lending library of things how
it works* → “What is a Tool Library?” (Northeastern Tool Library),
for Sam Okafor's Bayview Tool Library; (2) *community night market
local vendors small business benefits* → “Night Market Philadelphia”
(The Food Trust), for Ana Ruiz's Mission Night Market. The block is
labelled as a dated capture on its face, hides the moment a key
connects, and is never presented as live — it exists so a judge
without a key still sees what real Tavily output looks like, and
exactly how Reach labels the difference.

## ElevenLabs — the voice

| | |
|---|---|
| **Endpoint** | `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` |
| **Auth** | `xi-api-key: <key>` header (NOT a Bearer token). `Accept: audio/mpeg`, JSON body. |
| **Smallest body** | `{ "text": "…" }` — only `text` is required. Reach sends `{text, model_id: "eleven_flash_v2_5"}` (fast, half-credit model; stable narration alternative is `eleven_multilingual_v2`). |
| **Response** | Binary audio (default `mp3_44100_128`), played inline via an `Audio` element on an object URL. |
| **Default voice** | **Sarah — `EXAVITQu4vr4xnSDxMaL`** (v2.3). Chosen from the live account's voice list (`GET /v1/voices`, 21 voices, verified 2026-11-13): Sarah is catalogued as “Mature, Reassuring, Confident” — the calmest, warmest read for a spoken morning brief, ahead of George (“Warm, Captivating Storyteller”, the runner-up). The v2.2 default was Rachel — `21m00Tcm4TlvDq8ikWAM`. The panel's Voice ID field overrides the default with any voice the user's account can use. |
| **Free tier** | **10,000 credits/month** on the free plan (≈10 minutes of standard TTS; Flash models go roughly twice as far). Free-tier output carries attribution/non-commercial terms — fine for a demo; a shipped product wants a paid plan. |
| **Browser CORS** | **UNVERIFIED** from the docs — and note ElevenLabs' own security guidance says API keys are secrets that belong server-side. Reach's BYOK pattern is the deliberate demo answer to that: the key never leaves the user's own device except to ElevenLabs itself, and the panel says so before anything is pasted. Any failure falls back to the browser voice instantly. |
| **Sources** | elevenlabs.io/docs — API reference, *Text to Speech* (endpoint, `xi-api-key` header, required `text`, `model_id`); ElevenLabs pricing/terms for the free-tier credit allowance (also verified in this team's ElevenLabs account review, 2026-11-13). |

**Reach behaviour.** Connected: Listen mode and every read-aloud use
ElevenLabs, one line owning the voice at a time (a newer line
interrupts, like the browser voice's cancel). Any failed line falls
back to the browser voice for that line. Nothing autoplays — speech
only ever starts from the user's own toggles, buttons, and flows.

## LangSmith — the audit trail

| | |
|---|---|
| **Endpoint** | `POST https://api.smith.langchain.com/runs` (create run); `PATCH /runs/{id}` exists for later updates — Reach posts completed runs in one call instead. Batch ingestion (`POST /runs/multipart`) exists for throughput and is unnecessary at demo scale. |
| **Auth** | `x-api-key: <key>` header. |
| **Smallest body** | `{ id (UUID), name, run_type, inputs, start_time }` — Reach sends a completed run: `{id, name: "reach.<event>", run_type: "chain", inputs: {event}, outputs: {recorded: true}, start_time, end_time, session_name: <project>, tags: ["reach"], extra: {metadata: {…}}}`. |
| **Free tier** | Developer plan: **free, 1 seat, 5,000 base traces/month**. A demo day of judging is a few hundred traces at most. |
| **Browser CORS** | **UNVERIFIED** — the docs bless SDK and REST tracing without stating a browser CORS policy. Irrelevant by design: tracing is fire-and-forget, so a blocked or failed POST is invisible to the user and to the product. |
| **Sources** | docs.langchain.com — *LangSmith: Trace with API* (POST/PATCH `/runs`, batch multipart, fetched 2026-11-13); langchain.com/pricing (Developer plan: 5k base traces/mo). |

**Reach behaviour.** Connected: every consequential action emits one
run — `reach.draft_created`, `reach.approval_granted`,
`reach.send_staged`, `reach.cap_refusal`, `reach.suppression_refusal`,
plus `reach.research_live` / `reach.research_fallback` and, since
v2.3, `reach.morning_brief`. Metadata
only: event kind, the draft kind, first names already on screen, and
the cap counters. **Message text and contact details are never
traced** (the smoke harness asserts this). The panel's status line
reads “Tracing: on (LangSmith)” while connected. This is the audit
story in one line: *every refusal Reach makes is on the record.*

**Project (v2.3).** Reach traces land in a dedicated LangSmith
project named **`reach`**, created through the API on 2026-11-13 —
project id `b87d1237-b76e-486d-8fe3-e650067df1b1`, described as
“Reach hackathon app traces — drafts, approvals, refusals (metadata
only).” The panel's Project field defaults to `reach` (it is the
client-side `session_name` on each run — a label, not a credential),
so a judge who connects their own key sees Reach's runs collect
under the same name in their own workspace.

## PhoneUse — the local execution layer (v2.3; bridge v2.4)

| | |
|---|---|
| **What it is** | PhoneUse Local — the hackathon sponsor PhoneUse's open-source local iPhone automation. A Mac controls a USB-connected iPhone via WebDriverAgent: live video, OCR screen reading, tap / type / scroll, driven by natural-language tasks. **Our fork: https://github.com/AGIFutureFoundation/phoneuse** (MIT; the fork's `docs/REACH.md` tells this integration from the PhoneUse side, and `examples/reach-bridge/` is a Mac-side client sketch). |
| **Surfaces** | A local REST API at `http://127.0.0.1:8765` and an MCP server. Reach uses `GET /health` (detection) and, since v2.4, `POST /api/ai/tasks` (the bridge) — both shapes read from the fork's `docs/INTEGRATIONS.md` and `platform/backend/task_api.py` / `api.py` on 2026-11-13. |
| **Detection** | `GET /health`, unauthenticated, answers ok. The store holds exactly one boolean for detection, `phoneuseOk` — there is no detection key, and the harness asserts the stored record carries no PhoneUse key field. |
| **Bridge auth** | `POST /api/ai/tasks` requires `Authorization: Bearer <key>`. Reach takes a **scoped key** (created with the fork's `platform/create-key.py` — one phone, with an expiry) plus the device ID, and keeps both in **page memory only**: never in the store, never exported, gone on reload. The key is sent only to `127.0.0.1:8765`. |
| **Bridge body** | `{ "device_id": "<udid>", "task": "<the approved card text>" }`. The `task` field is the approval card's current text **byte-for-byte** — no instruction template, no additions, no paraphrase. The harness asserts `JSON.parse(postedBody).task === approvalCurrentText(card)`, and that the key appears nowhere in localStorage. (A Mac-side bridge may wrap the same text, unaltered, in a fixed instruction — see the fork's sketch, which asserts the invariant in code.) |
| **Origin reality** | The API allowlists exactly two browser origins — `http://localhost:3109` and `http://127.0.0.1:3109`, its own web UI (verified in the fork's `platform/backend/api.py`: CORS middleware + an origin check returning 403 “Origin not allowed”). Every other origin is refused, and a public HTTPS page additionally faces mixed-content/local-network blocking. |
| **Supported bridge configuration** | **Reach served from the allowlisted local origin on the same Mac as PhoneUse** — the booth/local setup (or the Mac-side bridge process in the fork's example). From `https://reach.agicorp.network/` the POST is expected to fail; Reach narrates the refusal with the reason, claims nothing was sent, and Copy/Share remain the bridge. A submitted task is also narrated as *submitted, not delivered* — delivery is read back on the phone. |
| **Browser limits (detection)** | From a public HTTPS page, browsers usually block calls to a local service, so detection from the live site will usually fail. The panel copy treats that as the normal case, in writing, in advance — never as an error state. A short timeout (2.5s detection, 6s bridge) keeps the checks from hanging the panel. |

**Reach behaviour.** *Detect PhoneUse* runs the health check. On ok:
the row reads **“Connected · PhoneUse local API”**, and approval
cards gain a **“Send to my phone via PhoneUse”** button (v2.4). The
button is a delivery decision for that card's exact text — the same
standing Copy and Share have — and it is inert without the session
key + device ID: tapped unarmed, it narrates what's needed and sends
nothing. On a successful submission the button retires for that
card, a `reach.phoneuse_task` run is traced (metadata only), and the
narration states the task is queued, not delivered. On any failure:
the honest refusal is narrated and the card stays waiting. On
detection failure: the boolean clears and the fallback is narrated —
PhoneUse is the Mac-side layer, a web page usually can't see it,
nothing is broken.

**Why it belongs in Reach.** Reach's honest architecture has always
had a deliberately smaller iOS layer: no cross-app reading exists on
iOS, so the PWA is an approval console. PhoneUse is what makes those
approvals *real* on an iPhone: an approved Reach card becomes a
PhoneUse task (REST or MCP) executed on the user's own Mac + phone —
read the screen, tap, type, reply — and **nothing reaches PhoneUse
that Reach didn't get a tap for**. The rails stay Reach's (draft →
exact-copy approval → suppression and cap checks, all before the
hand-off); the hands are PhoneUse's. The hand-off code path is real
and tested against the documented API; whether a given browser can
reach the local API is an environment fact Reach reports, never a
result it fakes.

## The fleet — five hosted phones, three holding desks (v2.5)

The PhoneUse console account **agent@agifellowship.church** holds
**five hosted phones** (set up by Mike, 2026-11-13). v2.5's
Holding Mode models the network's three holdings — Fellowship,
Foundation, BuilderSpace — as Reach-side **desks** that route to
phones in that fleet. Which physical phone serves which holding
is **PENDING** the console inventory and is asserted nowhere. The
operating design is **PHONE-FLEET.md**. What belongs in this
review is the surface discipline:

- **Verified (local):** everything in the PhoneUse section above —
  `GET /health`, `POST /api/ai/tasks`, Bearer scoped keys, the two
  allowlisted local origins. Reach's fleet configuration
  (`FLEET_CONFIG` in `app.js`) carries exactly this surface as
  `localBase` + `localTasksPath`.
- **Known (console facts):** the account (agent@agifellowship
  .church) and the device count (five) — carried in `FLEET_CONFIG`
  as `consoleAccount` / `consoleDeviceCount`.
- **UNVERIFIED (hosted console):** the console's own API — its base,
  its task endpoint shape, its device addressing — is **not
  claimed** anywhere in Reach. A console review is pulling the
  device inventory in parallel; until it reports,
  `FLEET_CONFIG.phoneuse` carries `consoleApiBase: ""` and a
  `consoleDevices` slot per holding, all empty and marked
  PENDING, and the harness asserts they ship empty (hf-05). The
  design treats device IDs, assignments, and console endpoints as
  **config that lands later**, never as literals baked into the
  app.
- **Addressing rule (design, pending the assignments):** a task is
  addressed to exactly one holding's assigned device, and the
  holding → device mapping is part of the approval record, so a
  misaddressed task is visible before it runs.

## The pattern the stack shares

1. **BYOK, on-device.** No Reach server exists; there is nothing to
   route keys through. The store is the same namespaced localStorage
   entry as the profile and people; keys are excluded from Export and
   removed by Disconnect and by Erase. (PhoneUse detection stores one
   boolean; its bridge key is stricter still — page memory only,
   never stored at all.)
2. **Labels never blur.** A result is live or it is staged, and the
   UI says which, on its face, every time.
3. **Failure is a designed path, not an error state.** Each adapter
   has a fallback that is itself a feature of the demo: the staged
   profile, the browser voice, the silent trace.
4. **No keys, no change.** With the panel untouched, the app is
   behaviour-identical to v2.1 — the original assertion suites still
   pass untouched inside the extended harness, which at v2.5 runs
   **210 assertions, all green**: the v2 core, the v2.1 habit layer,
   the v2.2 adapters, the v2.3 brief / impact / judge-mode /
   warmth-report / captured-snapshot / PhoneUse-detection
   behaviours, the v2.4 use-case packs (isolation of your list
   proven against the store), the PhoneUse bridge (payload equality
   proven byte-for-byte), the Pro waitlist, and v2.5's holding mode
   (fleet isolation, per-holding brief/impact, and the
   config-not-claims invariant, all proven against the store).
