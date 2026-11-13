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

## PhoneUse — the local execution layer (v2.3)

| | |
|---|---|
| **What it is** | PhoneUse Local — the hackathon sponsor PhoneUse's open-source local iPhone automation. A Mac controls a USB-connected iPhone via WebDriverAgent: live video, OCR screen reading, tap / type / scroll, driven by natural-language tasks. **Our fork: https://github.com/AGIFutureFoundation/phoneuse** (MIT). |
| **Surfaces** | A local REST API at `http://127.0.0.1:8765` and an MCP server. Reach's adapter uses only the health check: `GET /health`, which answers ok. |
| **Auth** | **None — there is no key.** The store holds exactly one boolean, `phoneuseOk`: whether the last detection succeeded. |
| **Browser limits** | From a public HTTPS page, browsers usually block calls to a local service (mixed-content and local-network rules), so detection from the live site will usually fail. The panel copy treats that as the normal case, in writing, in advance — never as an error state. A short timeout (2.5s) keeps the check from hanging the panel. |

**Reach behaviour.** *Detect PhoneUse* runs the health check. On ok:
the row reads **“Connected · PhoneUse local API”** and the message
says what that means and doesn't — detection today, task execution
is the native-path next step. On any failure: the boolean clears and
the honest fallback is narrated — PhoneUse is the Mac-side layer, a
web page usually can't see it, nothing is broken.

**Why it belongs in Reach.** Reach's honest architecture has always
had a deliberately smaller iOS layer: no cross-app reading exists on
iOS, so the PWA is an approval console. PhoneUse is what makes those
approvals *real* on an iPhone: an approved Reach card becomes a
PhoneUse task (REST or MCP) executed on the user's own Mac + phone —
read the screen, tap, type, reply — and **nothing reaches PhoneUse
that Reach didn't get a tap for**. The rails stay Reach's (draft →
exact-copy approval → suppression and cap checks, all before the
hand-off); the hands are PhoneUse's. Integration today is
architectural plus this live health-check detection; the PWA does
**not** send messages through PhoneUse, and no copy anywhere claims
it does.

## The pattern the stack shares

1. **BYOK, on-device.** No Reach server exists; there is nothing to
   route keys through. The store is the same namespaced localStorage
   entry as the profile and people; keys are excluded from Export and
   removed by Disconnect and by Erase. (PhoneUse has no key at all —
   the store holds one boolean for it.)
2. **Labels never blur.** A result is live or it is staged, and the
   UI says which, on its face, every time.
3. **Failure is a designed path, not an error state.** Each adapter
   has a fallback that is itself a feature of the demo: the staged
   profile, the browser voice, the silent trace.
4. **No keys, no change.** With the panel untouched, the app is
   behaviour-identical to v2.1 — the original assertion suites still
   pass untouched inside the extended harness, which at v2.3 runs
   **133 assertions, all green**: the v2 core, the v2.1 habit layer,
   the v2.2 adapters, and the v2.3 brief / impact / judge-mode /
   warmth-report / captured-snapshot / PhoneUse-detection
   behaviours.
