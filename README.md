# CopilotKit + AWS Strands Test Suite

A navigable, running harness for the CopilotKit ↔ AWS Strands (Python) integration — one route per doc page, each running what that page teaches, and each saying plainly where the page stops short of publishing enough to run it.

| | |
| --- | --- |
| **Doc-sync date** | 2026-08-26 — see `doc-snapshot/CHANGELOG.md` for what moved, and §9.17 for the Quickstart rewrite this repo followed |
| **Docs tracked** | <https://docs.copilotkit.ai/strands> |
| **CopilotKit packages** | `@copilotkit/react-core` 1.66.2 · `@copilotkit/runtime` 1.66.2 · `@copilotkit/a2ui-renderer` 1.66.2 · `@copilotkit/voice` 1.66.2 |
| **AG-UI / Strands packages** | `ag-ui-strands` 0.2.4 · `strands-agents` 1.50.2 · `@ag-ui/client` 0.0.57 (pinned exactly — see §10) |
| **Frontend** | Next.js 16.3.0 (App Router, Turbopack) · React 19.2.8 · TypeScript 5 · Tailwind 4 |
| **Routes** | 32 tracked doc pages · 25 registered agents |
| **Status** | ✅ 23 working · ⚠️ 3 partial · ❌ 4 broken · 📘 3 reference |
| **Build** | `npm run build` and `tsc --noEmit` both clean; no CI configured |

---

## 2. Overview

AWS Strands is Amazon's Python agent SDK. `ag-ui-strands` wraps a Strands `Agent` in a `StrandsAgent` and turns it into an ASGI app speaking the [AG-UI protocol](https://ag-ui.com), which CopilotKit's runtime consumes over SSE.

This repo is a QA harness for that integration, not a demo app. Every doc page listed in §12 becomes a route with two halves: a notes page showing the real source of what runs, read off disk at render time, and a chrome-free `/demo-chat` surface you can drive or screen-record.

**Read the status column before you read a red badge as a bug.** Four routes are marked Broken, and none of that is CopilotKit or Strands misbehaving at runtime. It is that the Strands doc tree does not publish enough backend code to make the feature work — seven pages replace their backend section with a literal `<!-- setup skipped: … is not bundled for strands -->` comment, and the one Strands backend file that *is* published appears on three pages as three progressively longer prefixes of the same truncated file. This repo does not fill those gaps in. Where the docs stop, so does the implementation, and the route says exactly where.

Worth knowing before you read §9 as an indictment: several of those empty setup sections turned out to be empty *because there is nothing to put in them* — Strands needs no agent-side wiring for client-registered tools, and five routes work on the Quickstart's four lines alone (§9.3). The full ledger is §9, and it is also rendered in-app at `/status`.

---

## 3. Architecture

```
Browser
  │  CopilotChat / CopilotSidebar / CopilotPopup / your own hooks
  │  @copilotkit/react-core/v2
  ▼
Next.js route handler  ── frontend/src/app/api/copilotkit/[[...slug]]/route.ts
  │  CopilotRuntime { agents, a2ui, intelligence?, identifyUser? }   @copilotkit/runtime/v2
  │  createCopilotRuntimeHandler({ runtime, basePath })  →  GET + POST
  │  (+ two extra endpoints, same shape — see §7, /copilot-runtime)
  ▼  AG-UI over HTTP/SSE
FastAPI parent app  ── backend/src/agent_server.py
  │  app.mount("/<agent-id>", create_strands_app(agui_agent, "/"))  × 25
  ▼
ag_ui_strands.StrandsAgent  →  strands.Agent  →  OpenAIModel
                                                    │
                                                    ▼
                                              OpenAI (gpt-4o)
```

**Backend language: Python.** The Strands Quickstart offers a Python and a TypeScript tab; this repo takes the Python one, which the doc sidebar calls "AWS Strands (Python)". Two processes, two ports.

**One app per agent.** `create_strands_app(agui_agent, "/")` is one app for one agent, and nothing on any Strands page shows two agents in one process. So the server calls that documented function once per agent and mounts each result with Starlette's `app.mount`. The documented call is untouched; the composition around it is this repo's. A consequence worth remembering: an agent's AG-UI root is `/<agent-id>/` **with the trailing slash**.

---

## 4. Prerequisites

| | |
| --- | --- |
| **Node.js** | 20+ (Next 16 requires it; the Quickstart also says 20+) |
| **Python** | 3.12+ (the Quickstart's stated prerequisite; `pyproject.toml` enforces it) |
| **Package managers** | `npm` for the frontend, [`uv`](https://docs.astral.sh/uv/) for the backend — `uv` is what the Quickstart uses |
| **API keys** | An OpenAI API key. Nothing else. There is no CopilotKit Cloud key in this repo — no premium feature is exercised. |
| **AWS credentials** | **Not needed.** "AWS Strands" is the SDK's name, not a hosted service; the agents run in your process against OpenAI. `boto3` arrives as a `strands-agents` dependency and is never used here. |

---

## 5. Setup

```bash
# 1. Clone
git clone <this-repo> aws-strands-py
cd aws-strands-py

# 2. Frontend dependencies
cd frontend && npm install && cd ..

# 3. Backend dependencies  (creates backend/.venv)
cd backend && uv sync && cd ..

# 4. Environment — the two processes read different subsets of the same file
cp .env.example backend/.env
cp .env.example frontend/.env.local
```

Then open both copies and set the one required value:

| Variable | Used by | What it does |
| --- | --- | --- |
| `OPENAI_API_KEY` | **both** | The model provider key. The Python server passes it to `OpenAIModel(client_args={"api_key": …})`; the Next process needs it only for `/voice`, where transcription goes through OpenAI Whisper. One key, both jobs. |
| `MODEL_ID` | backend | Which OpenAI model every agent runs on. Defaults to `gpt-4o`. Set it to `gpt-5.4` to reproduce the Quickstart's literal value — see §9.1. |
| `AGENT_HOST` / `AGENT_PORT` | backend | Where uvicorn binds. Defaults to `0.0.0.0:8000`. |
| `LOG_LEVEL` | backend | Python logging level. Defaults to `INFO`. |
| `AGENT_URL` | frontend | Where the Next runtime looks for the agent server. Defaults to `http://localhost:8000`. |
| `NEXT_PUBLIC_COPILOTKIT_INSPECTOR` | frontend | Set to `off` to disable the inspector overlay everywhere. Localhost-only by default. |
| `INTELLIGENCE_API_KEY` | frontend | CopilotKit Intelligence project key — turns on persistent threads and the inspector. Optional; without it every runtime falls back to SSE mode. **Server-side secret — never prefix it `NEXT_PUBLIC_`.** See §9.17. |
| `NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY` | frontend | The **client** half of Intelligence — the Threads Drawer page's `publicLicenseKey="ck_pub_..."`. Threads need this *and* `INTELLIGENCE_API_KEY`; with only one you get a silent half-failure. Genuinely public, hence the prefix. See §9.21. |
| `COPILOTKIT_TELEMETRY_DISABLED` | frontend | Set to `true` to opt out of the runtime's anonymous telemetry. |

**Default ports: frontend `3000`, backend `8000`.**

---

## 6. Running the project

Two terminals — there is no single command, because the Quickstart's bring-your-own path has none.

```bash
# Terminal 1 — the agent server
cd backend
uv run python src/agent_server.py
```

Successful startup looks like:

```
INFO:agent_server:Mounted 25 agents on model gpt-4o: a2ui-fixed-schema, agent-config, agentic_chat, …
INFO:     Started server process [12345]
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

```bash
# Terminal 2 — the Next app
cd frontend
npm run dev
```

```
▲ Next.js 16.3.0 (Turbopack)
- Local:  http://localhost:3000
✓ Ready in 1.2s
```

Open **<http://localhost:3000>**.

### Smoke test before you debug anything else

```bash
# 1. Every agent mounted, and which model they are on
curl -s http://localhost:8000/health | python3 -m json.tool

# 2. One agent's AG-UI endpoint answers (note the trailing slash)
curl -s http://localhost:8000/strands_agent/ping

# 3. The protocol actually flows
curl -s -X POST http://localhost:8000/strands_agent/ \
  -H 'Content-Type: application/json' \
  -d '{"threadId":"t1","runId":"r1","messages":[{"id":"m1","role":"user","content":"hi"}],
       "state":{},"tools":[],"context":[],"forwardedProps":{}}'
```

Step 3 should stream `RUN_STARTED → STATE_SNAPSHOT → MESSAGES_SNAPSHOT → … → RUN_FINISHED`. A `404` on step 2 or 3 means you dropped the trailing slash.

There is also `GET /gaps`, which returns the per-agent list of what the docs omit.

**Confirming CopilotKit Intelligence.** Open `/copilot-runtime` — the banner at
the top reports whether the runtimes constructed a `CopilotKitIntelligence`
client or fell back to SSE mode. Note that a working chat is *not* evidence
either way: `premium/connect-your-runtime` is explicit that a runtime in SSE
mode replies normally with the key unread. The only real confirmation is a
thread appearing in the
[dashboard](https://dashboard.operations.copilotkit.ai) after you send a
message.

---

## 7. What to expect — walkthrough per section

Every route has a notes page at the path below and a live surface at `<path>/demo-chat`. Routes with a doc gap render a red panel above their own prose listing exactly what the page failed to publish; that panel is the primary deliverable on the Broken routes.

### Getting Started

**`/` — Introduction**
Orientation: the status split, the agent count, how a message travels, and the standing warning about red badges. No agent.

**`/quickstart` — the bring-your-own path**
The only page whose backend is published end to end. Try `Can you tell me a joke?`
✅ Tokens stream a word at a time and render as markdown.
❌ An error banner — check the Python server is up on `:8000` and `OPENAI_API_KEY` is set. If the error names an unknown model, you have `MODEL_ID=gpt-5.4` set; see §9.1.

### Prebuilt Components

**`/prebuilt-components/chat` — `<CopilotChat>`**
The base inline surface, filling its container. Try `What can you help me with?`
✅ Suggestion pills render before the first message; clicking one sends it and the reply streams.
❌ An empty box with no input — the container has no height.

**`/prebuilt-components/sidebar` — `<CopilotSidebar>`**
The docked collapsible chat, opened with `defaultOpen`. Toggle it closed and open.
✅ The main content reflows around it rather than being covered; state survives the toggle.
❌ It overlays the content instead of wrapping it — that is the Popup's behaviour, not the Sidebar's.

**`/prebuilt-components/popup` — `<CopilotPopup>`**
The floating launcher. Ask it anything, then close and reopen.
✅ The overlay sits on top without reflowing the page, and the transcript survives.
❌ No launcher bubble at all.

**`/prebuilt-components/chat-controls` — open, close, feedback**
Drives modal state from your own button via `useCopilotChatConfiguration`, and shows thumbs up/down. Send one message, then click 👍.
✅ Your button opens and closes the chat, and the thumbs buttons appear on assistant messages only (they render only when a handler is supplied).
❌ Your button is inert — `setModalOpen` is undefined because no provider in the tree owns modal state.

### Custom Look and Feel

**`/custom-look-and-feel/css` — CSS customization**
The doc's HALCYON theme, scoped to a wrapper class. Send a message that produces markdown, e.g. `Explain SSE with a bulleted list and a code block`.
✅ Warm parchment palette, serif headings, user messages as monospace "transmissions" with a copper `→` marker.
❌ Default CopilotKit chrome — `theme.css` did not load, or the scope class is not on the wrapper.

**`/custom-look-and-feel/slots` — slots**
Three overrides at three depths: `welcomeScreen`, `messageView.assistantMessage`, `input.disclaimer`.
✅ Before the first message: the custom gradient welcome card. After: every assistant reply is wrapped in a tinted card with a "slot" badge, and the disclaimer under the composer is visibly tagged.
❌ Any of the three renders as the default component.

**`/custom-look-and-feel/headless-ui` — headless UI**
A chat assembled from `useAgent` + `useCopilotKit` alone, no CopilotKit chrome.
✅ Messages, streaming and send all work through a UI with none of the package's CSS.
❌ Messages never appear though the network tab shows SSE — the subscriber is not re-rendering.

### Input Modalities

**`/multimodal-attachments` — attachments**
Try attaching a screenshot and asking `What is in this image?`, then attaching a `.zip`.
✅ The image renders as a thumbnail in your message and the reply describes its actual contents; the `.zip` never sends and an amber banner names it with reason `invalid-type`.
❌ The reply describes the *filename* rather than the picture — the model received text, not an image part.

**`/voice` — speech to text**
Needs `OPENAI_API_KEY` in `frontend/.env.local`.
✅ A mic button appears in the composer (that is the runtime advertising `audioFileTranscriptionEnabled` on `/info`). Recording transcribes and auto-sends. The "Try a sample audio" button works with no key at all.
❌ No mic button — the runtime has no `transcriptionService`, or `basePath` does not match the route directory.

### Rich Threads

All four need CopilotKit Intelligence. Without it they compile and render, and the feature is locked — which is itself the thing these routes document.

**`/prebuilt-components/copilot-threads-drawer`** ⚠️ — the drop-in conversation sidebar, with the page's integration reproduced in full. Send a message, press "New Conversation", send another, then click back to the first row.
✅ Two auto-named rows; clicking one replays its history into the chat. Nothing in the demo tracks an active `threadId` — that is the page's actual claim.
❌ A locked panel where the list should be: that is the no-license state the page documents, not a bug. An empty list *with* a key means the runtime is in SSE mode — check `/copilot-runtime`.

**`/headless-threads`** ⚠️ — the same data behind your own UI via `useThreads`, and the only place `renameThread` is reachable. Send a message, then press Rename on the row.
✅ A row per conversation, most recent first; Rename sets the literal string `"Renamed"` (the doc's own handler), Archive hides it from the default list.
❌ An empty sidebar beside a working chat — the page calls this out as a quiet failure. A thrown error from `useThreads` would be a real one.

**`/threads-lifecycle`** ⚠️ — where a `threadId` comes from and what makes history replay. Send a message, press "New chat", then paste the earlier id back and press "Open conversation".
✅ "New chat" clears to a welcome screen; reopening the id replays that conversation.
❌ Open conversation clears instead of replaying — with no store to replay from, which the page states plainly, that is expected.

**`/threads-import`** 📘 — reference only, and not because of this repo: the page's own supported-sources table is Google ADK and LangGraph. There is no Strands importer, so there is nothing to run. See §9.20.

### Generative UI

**`/generative-ui/tool-based` — components as tools** ✅
`useComponent` registers a bar chart. Try `Chart the number of days in each month of 2026`.
✅ A bar chart renders inline in the chat with the model's numbers, and the reply does not repeat them as a list.
❌ Plain text with the numbers written out — the model did not call the tool. Make the request explicitly visual.

This route works **despite** the page's backend section being the §9.2 placeholder: the frontend-tool channel evidently reaches a Strands agent with no documented wiring at all. See §9.3 for what that implies for the sibling routes still marked Broken.

**`/generative-ui/tool-rendering` — tool call rendering** ✅
Two named renderers plus a wildcard, against the one backend tool any Strands page prints. Try `What's the weather in Tokyo?`
✅ A sky-blue card with the city and "Calling weather API…", filling in with 68°, Sunny, humidity and wind; the reply does not restate the numbers.
❌ Raw JSON or the generic catch-all card instead of the `WeatherCard` — the renderer's name does not match the tool's.

Two caveats. `get_weather_impl` is borrowed from the Google ADK page (§9.4), and the `search_flights` renderer has no backend tool, so asking about flights gets prose.

**`/generative-ui/your-components/display-only`** ✅ — the page's own `useComponent` snippets, typed and untyped, both firing. Try `Show weather in Tokyo where the condition is sunny and the temperature is 77`.
✅ A weather card inline in the chat, and a blue greeting box on the second prompt.
❌ Plain text with the values written out — the model did not call the component.

**`/generative-ui/your-components/interactive`** ✅ — the page's single `useHumanInTheLoop` approval gate, reproduced with its unstyled markup intact. Try `Execute command ls`.
✅ The run pauses, an unstyled block appears with the command in a `<pre>` and two buttons, and nothing further streams until you press one.
❌ Prose with no gate, or a gate that appears while the run continues underneath it (meaning `respond` was never called).
The doc page's entire published source is four lines — see §9.7.

**`/generative-ui/a2ui/dynamic-schema`** ❌ — catalog, definitions and renderers all wired as printed. Try `Build me a dashboard for a SaaS company's Q3`.
✅ *(what actually passes)* `createCatalog` builds, the nested provider mounts, the chat streams.
❌ A TypeScript error in `renderers.tsx` — which is the interesting failure, since the doc ships that file with no import line at all (§9.6).

**`/generative-ui/a2ui/fixed-schema`** ❌ — the five-component catalog and `injectA2UITool: false` runtime are both live; the agent-side tool that would return an operations container is not published, and neither is the schema JSON.

### App Control

**`/frontend-tools`** ✅ — `useFrontendTool` registers `change_background`. Try `Make the background a warm sunset gradient`.
✅ The page background changes within a second or two, the CSS value under the heading updates to match, and the agent confirms in words.
❌ The agent describes a gradient without applying one — the tool was not on its list, or the handler threw before `setState` ran.

**`/human-in-the-loop`** ✅ — `useHumanInTheLoop` registers a time picker. Try `Book an intro call with the sales team`.
✅ A picker renders inline with four slots and nothing further streams until you pick; the card then collapses to a green "Booked" badge and the agent's confirmation names your slot.
❌ Prose with some times in it and no picker, or a picker that appears while the run continues underneath it.
Note that the other half of this doc page, `useInterrupt`, is LangGraph-only and does not apply to Strands at all — see §9.3.

**`/programmatic-control`** ⚠️ — Google ADK's implementation, carried over verbatim on request.
✅ A blank pane under the demo header, and no build error. That is faithful: the doc's `headless-complete` snippet is a hook body with no `return`, so there is no UI to render. The route's value is the source panel and the three primitives it documents.
❌ A runtime error from `useAgent` / `useCopilotKit`.

### Shared State

**`/shared-state/rendering-in-app`** ⚠️ — Google ADK's implementation, carried over verbatim on request. The doc's `<Canvas>` reading `agent.state` outside the chat.
✅ Whatever the UI writes with `setState` shows in the canvas immediately and survives a chat turn.
❌ `setState` writes vanish on the next agent turn.

**`/shared-state/agent-readonly`** ❌ — three `useAgentContext` entries publish cleanly; nothing documents where a Strands agent would read them. Ask `Who am I?`
✅ *(what actually passes)* The agent says it has no information about you, and the Inspector's Context tab shows all three entries registering and unregistering.

**`/shared-state/in-app-agent-read`** ✅ — reads `agent.state?.language` in a component well away from the chat.
✅ The agent replies in whatever language state holds, and the raw `agent.state` block shows it.
❌ The raw block stays empty after the write route has set a language — the two routes are not sharing one agent instance.

**`/shared-state/in-app-agent-write`** ✅ — **the one route where a Strands agent reads something the UI wrote**, via `StrandsAgentConfig(state_context_builder=…)`. Press *Toggle Language*, then send `tell me a joke`.
✅ The joke comes back in the new language — the toggle changed behaviour, not just the panel. *Toggle & re-run* does it with no typing.
❌ The panel flips but replies stay in the old language: the config is not attached, or the state key the builder looks for is not the one `setState` wrote.

### Multi-Agent

**`/multi-agent/subagents`** ⚠️ — this page prints more Strands backend than any other (947 lines); its Sub-Agents section is reproduced byte-for-byte in `backend/src/agents/subagents.py`. Try `Write a short paragraph explaining why agent-native UIs beat chatbots`.
✅ Three tool calls in order — `research_agent`, `writing_agent`, `critique_agent` — then a final answer carrying the draft and a line about the critique.
❌ A direct answer with no tool calls, or the same sub-agent firing repeatedly.
**The delegation log stays empty, and that is expected.** `subagent_state_from_result` — the hook that would write `state["delegations"]` — is named in the section's own comments and never printed, so delegation works and the live reporting does not. See §9.4.

### Agent Config

**`/agent-config`** ❌ — the settings panel publishes a typed object through `useAgentContext`; the "Python" the page shows for the backend is LangGraph code (§9.5). Ask the same question at `expertise=beginner` and `expert`.
✅ *(what actually passes)* Identical answers, and the context entries visibly updating in the Inspector.

### AWS Strands (Python)

**`/copilot-runtime`** ✅ — this repo's live runtime config, whether Intelligence is on, all 25 agents, and a split demo with three agent tabs: raw AG-UI events on the left, the reply those events carry on the right. The tabs (`agentic_chat`, `tool-rendering`, `shared-state-language`) were picked so the event streams differ visibly — text only, then `TOOL_CALL_*` rows, then a non-empty `STATE_SNAPSHOT`. Type `Hello` and press Run, then switch tabs.
✅ Left: `RUN_STARTED → TEXT_MESSAGE_START → a collapsing TEXT_MESSAGE_CONTENT row → TEXT_MESSAGE_END → RUN_FINISHED`. Right: your prompt, then the reply filling in a few characters at a time in step with the delta counter, with a "streaming" pill until the run finishes. No chat component is involved — the text is rebuilt from `textMessageBuffer` off the subscriber.
❌ `RUN_FAILED`, or nothing. Deltas climbing on the left with the right pane empty means the buffer is not being read.

**`/ag-ui`** ✅ — subscribes to **every** callback in the doc page's event table, not just the three its snippet shows, so the table becomes a test. Split demo: callbacks left, reply right. Press Run.
✅ Left: the lifecycle above plus `onMessagesSnapshotEvent` and `onStateSnapshotEvent`, with the counter settling well short of 18 — the absences are the finding, see §9.8 for the one that resolves in your favour. Right: the reply assembled twice from the same callbacks — `textMessageBuffer` streaming character by character, and `agent.messages` via `onMessagesChanged` staying empty until the deltas are folded in, then landing whole.
❌ Nothing at all, or `onRunErrorEvent`. Both reply boxes empty while the delta counter climbs means the buffer is not being read.

---

## 8. Testing checklist / current status

| Doc page | Route | Status | Notes |
| --- | --- | --- | --- |
| `/strands` | `/` | 📘 Reference | Landing page: status split, agent roster, doc-gap ledger. |
| `/strands/quickstart?agent=bring-your-own` | `/quickstart` | ✅ Working | The only fully published backend. Model id is not — §9.1. |
| `/strands/prebuilt-components/chat` | `/prebuilt-components/chat` | ✅ Working | Not in the doc sidebar; resolves by URL. |
| `/strands/prebuilt-components/sidebar` | `/prebuilt-components/sidebar` | ✅ Working | Not in the doc sidebar. |
| `/strands/prebuilt-components/popup` | `/prebuilt-components/popup` | ✅ Working | Not in the doc sidebar. |
| `/strands/prebuilt-components/chat-controls` | `/prebuilt-components/chat-controls` | ✅ Working | Not in the doc sidebar. |
| `/strands/custom-look-and-feel/css` | `/custom-look-and-feel/css` | ✅ Working | Not in the doc sidebar. v1/v2 token split — §9.10. |
| `/strands/custom-look-and-feel/slots` | `/custom-look-and-feel/slots` | ✅ Working | Not in the doc sidebar. |
| `/strands/custom-look-and-feel/headless-ui` | `/custom-look-and-feel/headless-ui` | ✅ Working | Not in the doc sidebar. |
| `/strands/prebuilt-components/copilot-threads-drawer` | `/prebuilt-components/copilot-threads-drawer` | ⚠️ Partial | Integration reproduced in full; locked without an Intelligence key. |
| `/strands/headless-threads` | `/headless-threads` | ⚠️ Partial | All three snippets run; the page's own step-2/step-3 prop mismatch reconciled — §9.21. |
| `/strands/threads-lifecycle` | `/threads-lifecycle` | ⚠️ Partial | One runnable component; three snippets call undefined symbols — §9.21. |
| `/strands/threads-import` | `/threads-import` | 📘 Reference | No Strands importer exists — §9.20. |
| `/strands/multimodal-attachments` | `/multimodal-attachments` | ✅ Working | Images fine on gpt-4o; audio parts are refused by the model. |
| `/strands/voice` | `/voice` | ✅ Working | Mic needs `OPENAI_API_KEY` in the Next process too. |
| `/strands/generative-ui/tool-based` | `/generative-ui/tool-based` | ✅ Working | Works with no documented backend wiring — see §9.3. |
| `/strands/generative-ui/tool-rendering` | `/generative-ui/tool-rendering` | ✅ Working | Doc now publishes WeatherCard, FlightListCard and parseJsonResult; search_flights renderer added. |
| `/strands/generative-ui/your-components/display-only` | `/generative-ui/your-components/display-only` | ✅ Working | Not in the doc sidebar. Needs no backend section — see §9.3. |
| `/strands/generative-ui/your-components/interactive` | `/generative-ui/your-components/interactive` | ✅ Working | Not in the doc sidebar. Page is still four lines — §9.7. |
| `/strands/generative-ui/a2ui/dynamic-schema` | `/generative-ui/a2ui/dynamic-schema` | ❌ Broken | `renderers.tsx` has no imports — §9.6. A2UI tool unattached. |
| `/strands/generative-ui/a2ui/fixed-schema` | `/generative-ui/a2ui/fixed-schema` | ❌ Broken | No `display_flight`, no schema JSON. Action handlers documented as unsupported. |
| `/strands/frontend-tools` | `/frontend-tools` | ✅ Working | Works despite `setup skipped` — §9.3. |
| `/strands/human-in-the-loop` | `/human-in-the-loop` | ✅ Working | Works despite `setup skipped`; the page's other pattern is LangGraph-only. |
| `/strands/programmatic-control` | `/programmatic-control` | ✅ Working | Doc replaced the unrunnable snippet with a self-contained AgentTrigger — §9.9. |
| `/strands/shared-state/rendering-in-app` | `/shared-state/rendering-in-app` | ✅ Working | Doc added a seeded initial state, so the canvas renders on first paint. |
| `/strands/shared-state/agent-readonly` | `/shared-state/agent-readonly` | ❌ Broken | `setup skipped`; `CopilotKitMiddleware` named but never shown. |
| `/strands/shared-state/in-app-agent-read` | `/shared-state/in-app-agent-read` | ✅ Working | Page's own `agentId` contradicts its own backend — §9.11. |
| `/strands/shared-state/in-app-agent-write` | `/shared-state/in-app-agent-write` | ✅ Working | The only documented UI → agent data path. Missing `import os` — §9.12. |
| `/strands/multi-agent/subagents` | `/multi-agent/subagents` | ✅ Working | Delegation log fills in; the state hook the docs never print is written locally, outside the verbatim region. |
| `/strands/agent-config` | `/agent-config` | ❌ Broken | Backend sample is LangGraph — §9.5. |
| `/strands/copilot-runtime` | `/copilot-runtime` | ✅ Working | Page never mentions Strands — §9.13. |
| `/strands/ag-ui` | `/ag-ui` | ✅ Working | Also the probe for which AG-UI events the adapter emits. |

**Not tracked by this repo** (present in the Strands sidebar, outside the requested page list): CLI, Build with agents, all five Concepts pages, the six Rich Threads pages, Reasoning, MCP Apps, the eight `/backend/*` Runtime pages, Inspector, VS Code Extension, all four Intelligence Platform pages, AWS AgentCore, and the three migration guides.

---

## 9. Known issues / doc-vs-implementation discrepancies

All verified against the live docs on **2026-08-07**, and rendered in-app at `/status` and on each affected route.

### 9.1 The Quickstart names a model that does not exist
[quickstart](https://docs.copilotkit.ai/strands/quickstart?agent=bring-your-own) sets `model_id="gpt-5.4"`. The callout directly beneath it says the example "uses OpenAI's GPT-4o", and both Shared State pages build the same model with `model_id="gpt-4o"`. **Resolution:** `MODEL_ID` env var, defaulting to `gpt-4o`; the literal value is preserved as `DOC_QUICKSTART_MODEL_ID` in `backend/src/agents/model.py` and shown on the Quickstart route.

### 9.2 Seven pages emit a placeholder where the backend snippet belongs
The published markdown contains, verbatim:

```
<!-- setup skipped: frontend-tools-setup is not bundled for strands -->
```

on `frontend-tools`, `generative-ui/tool-based`, `human-in-the-loop`, `shared-state/agent-readonly`, `agent-config`, `programmatic-control`, and `multi-agent/subagents`. The Google ADK version of each page prints a complete agent definition at that exact spot. There is no published Strands backend for any of them.

### 9.3 Nothing documents how frontend tools reach a Strands agent
ADK opens CopilotKit's frontend-tool channel with `AGUIToolset()` in the agent's `tools=` list, and says so on every affected page. No Strands page names an equivalent, and the pages that would (`frontend-tools`, `generative-ui/tool-based`, `human-in-the-loop`) all replace that section with the §9.2 placeholder.

**The channel does work — the omission is documentation-only, not a capability gap.** Every route that registers a client-side tool is confirmed Working with no backend wiring beyond the Quickstart's four lines:

| Route | Hook |
| --- | --- |
| `/generative-ui/tool-based` | `useComponent` |
| `/generative-ui/your-components/display-only` | `useComponent`, typed and untyped |
| `/generative-ui/your-components/interactive` | `useHumanInTheLoop` |
| `/frontend-tools` | `useFrontendTool` |
| `/human-in-the-loop` | `useHumanInTheLoop`, with a real picker card |

The mechanism is visible on the adapter: `ag_ui_strands.StrandsAgent` carries a `_proxy_tool_names_by_thread` map and clones the underlying `strands.Agent` per thread, re-attaching proxied client-registered tools alongside any `tools=` the agent was built with. Nothing on any doc page mentions this — which is presumably *why* the setup sections are empty, but an empty section reads as "unsupported" rather than "nothing to do."

**What would fix the docs:** one sentence on each of those five pages saying the frontend registration is sufficient on Strands and no agent-side wiring is required.

### 9.4 The published backend file is a truncated prefix, and imports two modules that do not exist
`src/agents/agent.py` appears across two pages at 322, 626 and 794 lines — all prefixes of one file, and even the longest stops mid-file. **The 2026-08-26 sync shrank it:** it used to be 332 / 585 / 947 across three pages, then `a2ui/fixed-schema` stopped printing it entirely and the docs pulled `_A2uiError` and the whole 145-line `generate_a2ui` tool out of the file. The longest published prefix went from 947 lines to 794. It imports `from tools import get_weather_impl, …` — a module a comment locates at `../../shared/python/tools`, outside anything the docs ship — and `from agents.gen_ui_agent import …`, likewise unpublished. Every published `@tool` body delegates to one of those `_impl` functions, so none can execute as printed. `build_showcase_agent(...)`, the function that would attach the `@tool`s to an agent and register their `ToolBehavior(state_from_result=…)` hooks, is referenced twice in comments and never printed.

**What this repo does about it, for one tool only.** [`backend/src/agents/doc_tools.py`](backend/src/agents/doc_tools.py) reproduces the `get_weather` declaration verbatim and supplies `get_weather_impl` from the **Google ADK** version of the same page, which prints the payload inline rather than behind an `_impl` indirection. Its five keys (`city`, `temperature`, `humidity`, `wind_speed`, `conditions`) are exactly the ones the Strands page's own frontend renderer reads, so the shape is confirmed by published Strands code even though the values are not. `chat_agents.tool_rendering_agent` then does `Agent(…, tools=[get_weather])` — plain Strands SDK, but a composition no Strands page shows. Nothing equivalent was done for the other thirteen `@tool`s. `ToolBehavior`, `HookProvider`, `HookRegistry` and `StateSnapshotEvent` are all imported and never used in the printed lines. `_seed_delegations_from_state` is fully defined and called by nothing. Full inventory: [`backend/docs_verbatim/README.md`](backend/docs_verbatim/README.md), with the excerpt kept byte-for-byte beside it.

### 9.5 The Agent Config backend sample is LangGraph, not Strands
Under a `python title="backend/agent.py"` label, [agent-config](https://docs.copilotkit.ai/strands/agent-config) defines `async def my_agent_node(state: AgentState, config: RunnableConfig)` reading `state.get("copilotkit", {}).get("context", [])`. `AgentState` and `RunnableConfig` are LangGraph types, a node function is a LangGraph shape, and that state path is where LangGraph's middleware puts context entries. Strands has none of the three. The framework-gated slot that should hold the Strands version is the §9.2 placeholder.

### 9.6 `renderers.tsx` is published with no imports
The [dynamic-schema](https://docs.copilotkit.ai/strands/generative-ui/a2ui/dynamic-schema) block opens on line one at `export const myRenderers: CatalogRenderers<MyDefinitions> = {`. `CatalogRenderers` (from `@copilotkit/a2ui-renderer`), `MyDefinitions` (from the sibling `definitions.ts`) and React are all used; none is imported. The 350-line file does not compile as printed. This repo reconstructs the import line from the neighbouring `definitions.ts` and `catalog.ts` blocks, which do show theirs.

### 9.7 The Interactive page has no Strands content
The entire published source of [your-components/interactive](https://docs.copilotkit.ai/strands/generative-ui/your-components/interactive) is a title, a one-line description, and `<Interactive components={props.components} framework="aws-strands" />`. The rendered page falls back to generic frontend-tool prose whose opening sentence is about frontend tools rather than interactive components, plus one `useHumanInTheLoop` example that is not Strands-specific. The route reproduces both.

### 9.8 The `MessagesSnapshotEvent` workaround is stale — and this one resolves in your favour
The published `agent.py` states that `ag_ui_strands` "through at least v0.1.7" emits no `MessagesSnapshotEvent`, that without it "responses that include tool calls never render as assistant messages in the DOM", and then prints a 200-line `_MessagesSnapshotWrapper` to inject them by hand. **Verified false against `ag-ui-strands` 0.2.4:** a raw AG-UI POST returns `RUN_STARTED → STATE_SNAPSHOT → MESSAGES_SNAPSHOT → STATE_SNAPSHOT → RUN_FINISHED` with no wrapper in the call path (reproduce it with step 3 of the §6 smoke test). The adapter handles it natively; the doc has not caught up. This harness does not install the wrapper.

### 9.9 ~~The headless send pipeline destructures helpers that are never printed~~ — FIXED 2026-08-26
[programmatic-control](https://docs.copilotkit.ai/strands/programmatic-control)'s `headless-complete` snippet opens by destructuring ten values from a `useAttachmentsConfig()` that appears on no page, and also calls `useAutoScroll` and `buildContent`. All three are reconstructed in `frontend/src/app/programmatic-control/headless-helpers.ts`. The snippet's function body also ends at `handleReset` with no `return`, so it renders nothing — carried over as-is, which is why the route is Partial. The page's interrupt-resolution half matches neither of its own framework branches for Strands: the `native` branch is LangGraph's, and the promise-based one collapses to `<!-- snippet skipped: region 'headless-promise-primitives' missing in strands::interrupt-headless -->`.

### 9.19 What the 2026-08-26 sync changed, page by page

The repo carries a doc-drift tracker (`doc-snapshot/`, surfaced at `/doc-sync`). Its 2026-08-26 run flagged 14 pages; the snapshot has since been verified byte-identical to live for every one of them. What each meant here:

| Page | Change | Effect on this repo |
| --- | --- | --- |
| Quickstart | Runtime step rewritten to a v2 `[[...slug]]` handler + `CopilotKitIntelligence` | All three endpoints moved; Intelligence wired — §9.17, §9.18 |
| Copilot Runtime | Same v2 shape, plus `InMemoryAgentRunner`, `/info`, and a `useSingleEndpoint` warning | Warning verified against 1.66.2; every nested provider passes the prop |
| Programmatic Control | Unrunnable snippet replaced with a self-contained `AgentTrigger` | Route ⚠️ → ✅; helpers and parked snippet deleted — §9.9 |
| Render state in your app | Added `INITIAL_CANVAS_STATE`, `isReady`, seeding effect | Route ⚠️ → ✅; canvas now renders on first paint |
| Tool Call Rendering | Now publishes `WeatherCard`, `FlightListCard`, `parseJsonResult` | Those stopped being repo-authored; `search_flights` renderer added |
| Sub-Agents | `agent.py` excerpt reorganised and **shortened** | Excerpt refreshed 947 → 794 lines — §9.4 |
| A2UI · Fixed Schema | Stopped printing `agent.py` at all | One fewer published prefix; A2UI backend still undocumented |
| Agent Config | `WhenFrameworkHas` gates deleted | The LangGraph sample is now presented unconditionally as *the* backend — §9.5 got worse |
| Frontend Tools · Human-in-the-Loop · Agent Read-Only Context | Each gained a "See this in Inspector" callout | Added to all three routes |
| Voice | The ADK-specific extra-hop paragraph was deleted | Route now notes the trailing slash is the only surviving clue |
| Open, close, and feedback | Prose on `rawEvent` metadata reaching thumbs callbacks | Informational; no code change |
| AG-UI | "Enterprise Intelligence Platform" → "CopilotKit Intelligence" | Rebrand only |
| CopilotPopup | Flagged as a **local snapshot edit, not an upstream change** | No action; snapshot re-verified against live |

### 9.20 There is no Strands thread importer

[`threads-import`](https://docs.copilotkit.ai/strands/threads-import) sits under `/strands/`, and its own "Supported sources" table lists exactly two: **Google ADK** and **LangGraph**. The prose says "Built-in import currently supports Google ADK and LangGraph, with more sources coming soon," and every link out of the import flow points at `/google-adk/threads-import` or `/langgraph-python/threads-import`. `--source strands` is not an option the CLI offers.

The page is otherwise complete and correct — it is just describing a feature this integration cannot use. `/threads-import` records the commands and says so rather than pretending there is something to run.

### 9.21 Three smaller findings across the thread pages

**Two credentials, introduced separately, and neither page mentions the other.** `INTELLIGENCE_API_KEY` is server-side and goes to `new CopilotKitIntelligence({ apiKey })`. `publicLicenseKey` is client-side and appears inline as `ck_pub_...` on the Threads Drawer page only. Having just one produces a silent half-failure — a locked drawer with a working runtime, or an empty list with a working client. Both are wired here, the second from `NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY`.

**The Headless Threads snippets do not compose as printed.** Step 2 defines `function ThreadSidebar()` with no parameters; step 3 renders `<ThreadSidebar onSelectThread={setActiveThreadId} />`. The prop exists only at the call site. Pasting both — which step 3 tells you to do — gives a sidebar that lists threads and cannot select one. The demo adds the parameter, the smallest change that makes step 3 mean what it says.

**Three lifecycle snippets call symbols the page never defines.** `ThreadControls` passes a bare `existingId`; the mint-up-front and headless submit-time examples call `myApi.createThread()`; the `identifyUser` example calls `verifyAppSession(request)`. The last two are openly stand-ins for your backend, but `ThreadControls` is presented as a working component. Only `existingId` is supplied here (from an input); the other two are not reconstructed.

### 9.10 The CSS page mixes v1 and v2 token systems
Its inline-override example does `import { CopilotKitCSSProperties } from "@copilotkit/react-ui"` and sets `--copilot-kit-primary-color`. Those are the **v1** tokens; the v2 components this repo uses read the shadcn set (`--primary`, `--background`, …) documented lower down the same page. Both halves are correct in isolation and cannot be combined. This repo uses the v2 half.

### 9.11 The Shared State read and write pages disagree on the agent id
Both print the same `agent/main.py`, which ends `name="languageAgent"`. The write page's frontend calls `useAgent({ agentId: "languageAgent" })`; the read page's calls `useAgent({ agentId: "strands_agent" })` — an id that page never defines. Copied literally, the read page addresses a nonexistent agent. Mounted once here, as `shared-state-language`, addressed by both routes.

### 9.12 The Shared State backend calls `os.getenv` without importing `os`
`agent/main.py` on both pages opens with `from ag_ui_strands import …` and uses `os.getenv("OPENAI_API_KEY", "")` three lines later. As printed, the module raises `NameError` at import. `backend/src/agents/language_agent.py` adds the import and documents the addition.

### 9.13 Two pages never mention Strands
`/strands/copilot-runtime` is framework-neutral apart from cross-links — its runtime snippet registers `// your agents go here`, its default-agent example points an `HttpAgent` at `https://my-agent.example.com` without importing `HttpAgent`, and it never connects either to the `create_strands_app` endpoint the Quickstart produces. `/strands/ag-ui` is the same. This repo infers the wiring from the Quickstart.

### 9.17 The Quickstart's runtime route was rewritten (2026-08-26 sync)

The page this harness tracks most closely changed shape. What it used to publish, and what this repo was built on:

```ts title="app/api/copilotkit/route.ts — the old shape"
import { CopilotRuntime, ExperimentalEmptyAdapter,
         copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
const serviceAdapter = new ExperimentalEmptyAdapter();
export const POST = async (req: NextRequest) => { /* … */ };
```

What it publishes now:

```ts title="app/api/copilotkit/[[...slug]]/route.ts — the current shape"
import { CopilotKitIntelligence, CopilotRuntime,
         createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";
const runtime = new CopilotRuntime({ agents, intelligence, identifyUser });
const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit" });
export const GET = handler;
export const POST = handler;
```

Four changes, all of them followed here:

1. **`[[...slug]]` catch-all**, so the runtime owns its own sub-routing (`/info`, `/agent/:id/run`, `/transcribe`) under `basePath`. All three endpoints in this repo moved.
2. **v2 factory**, and the `ExperimentalEmptyAdapter` is gone — there is no service adapter any more.
3. **`GET` as well as `POST`.** The old route exported only `POST`; the client's `/info` probe is a `GET`, which is why single-endpoint mode had worked before.
4. **`useSingleEndpoint={false}` on the provider** — the client half of (1). A catch-all route with single-endpoint mode still on gets no `/info`. Set on the root provider and on all three nested ones.

The rebrand rode along with it: "Enterprise Intelligence Platform" is now **CopilotKit Intelligence** throughout, and the CLI is `npx copilotkit@latest create --framework aws-strands-py`.

### 9.18 Intelligence is wired but unproven here

`intelligence` and `identifyUser` are set on all three runtimes from [`frontend/src/lib/intelligence.ts`](frontend/src/lib/intelligence.ts). Two honest caveats:

- **The options are conditional, and the doc sanctions that.** The page writes `process.env.INTELLIGENCE_API_KEY!` — a non-null assertion on a key most people cloning this will not have. Its own callout says dropping `intelligence` and `identifyUser` falls back to SSE mode with an in-memory runner, so they are omitted rather than passed empty when the key is absent. `/copilot-runtime` reports which mode is live.
- **No key was available to test against.** `premium/connect-your-runtime` is explicit that this cannot be confirmed from the client: "A build that compiles and a chat that replies both prove nothing about Intelligence — a runtime in SSE mode does all of that with the key unread." So what is verified here is that the wiring typechecks, builds, and routes; that threads actually persist needs a key and a look at the dashboard.

### 9.14 Broken cross-framework links
Both Shared State pages say "follow the instructions in the Getting Started guide" and link to `/langgraph/quickstart` rather than `/strands/quickstart`. The Quickstart's own "What's next" cards link to `/aws-strands/generative-ui/tool-rendering` and `/aws-strands/frontend-tools` — a path prefix that does not exist; the live tree is `/strands/...`.

### 9.15 Twelve tracked pages are absent from the doc sidebar
`prebuilt-components/*` (4), `custom-look-and-feel/*` (3) and `generative-ui/your-components/*` (2) all resolve by URL and are cross-linked from pages that *are* in the sidebar, but none appears in it. They are flagged **Not in doc sidebar** in-app and in §8.

### 9.16 Two frontend API mismatches inherited from the doc snippets
- `useAgent` has no `initialState` — both Shared State pages seed the hook with it; `UseAgentProps` in 1.66.2 has no such field. Defaults are applied in the render instead.
- `useAgent` has no `render` — the read page's "Rendering agent state in the chat" section passes one. That prop does not exist.
- The `<CopilotChat>` page's sample calls `useAgenticChatSuggestions()`, a helper local to CopilotKit's own demo app and exported by no package. It wraps `useConfigureSuggestions`, which *is* exported, so this repo calls that directly.

---

## 10. Troubleshooting

The Strands tree has no Common Issues page; its troubleshooting content is the Quickstart's accordion plus three migration guides. Translated into this repo's symptoms:

| Symptom | Cause | Fix |
| --- | --- | --- |
| Chat shows an error banner immediately | Agent server not running, or unreachable | `curl http://localhost:8000/health`. Start it with `uv run python src/agent_server.py` from `backend/`. |
| `404` from the agent server | Missing trailing slash | Each agent is a mounted sub-app, so its AG-UI root is `/<agent-id>/`. `lib/agents.ts` adds the slash; hand-written curl often does not. |
| Connection refused on `localhost` but not `127.0.0.1` | IPv6/IPv4 resolution | The Quickstart's own accordion says to try `0.0.0.0` or `127.0.0.1` instead of `localhost`. Set `AGENT_URL=http://127.0.0.1:8000`. |
| Every agent fails with an unknown-model error | `MODEL_ID=gpt-5.4` | That is the Quickstart's literal value and it does not resolve. Unset it or use `gpt-4o` — §9.1. |
| Mic button missing on `/voice` | Runtime advertises no transcription | `transcriptionService` exists only on the **v2** runtime; the v1 wrapper drops it silently. Also check `basePath` matches the route directory exactly. |
| Mic button present, transcription 4xx | `OPENAI_API_KEY` not visible to Next | It must be in `frontend/.env.local`, not only `backend/.env`. The sample-audio button works without it. |
| Two inspectors on one page / a hung dev server | Two `CopilotKitProvider`s each mounting an inspector | Fatal — two lit custom elements spin into an assert loop. Any route with a nested provider must be listed in `frontend/src/lib/inspector.ts`. |
| Tool-shaped features do nothing | Not a bug here | §9.3. Six routes are blocked on one undocumented step. |
| `Type 'HttpAgent' is not assignable to type 'AbstractAgent'` | Two copies of `@ag-ui/client` | Every CopilotKit package hard-pins `0.0.57`; a `^0.0.57` range in `package.json` floats to `0.0.58` and the two classes stop being assignable (`separate declarations of a private property '_debug'`). `@ag-ui/client` and `@ag-ui/core` are pinned exactly here for that reason. Check with `find node_modules -path '*@ag-ui/client/package.json'`. |
| `404` from `/api/copilotkit/info` | Endpoint mode and route shape disagree | The runtime is a `[[...slug]]` catch-all, so the provider needs `useSingleEndpoint={false}`. Set one without the other and the client either probes a path the route does not serve, or posts everything to a route expecting sub-paths. |
| Chat works, no threads in the dashboard | `intelligence` never reached the runtime | The runtime is in SSE mode. Check `INTELLIGENCE_API_KEY` is set **in `frontend/.env.local`**, then read the banner on `/copilot-runtime` — it reports the live mode. |
| `@copilotkit/react-ui` not found | Following the Quickstart's install line | It names `@copilotkit/react-ui` (v1) and then imports everything from `@copilotkit/react-core/v2`. This repo does not depend on the v1 package. See the framework's [migrate-to-v2](https://docs.copilotkit.ai/strands/troubleshooting/migrate-to-v2) guide. |

---

## Doc drift detection

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind all 28 tracked doc pages, diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

Doc pages are fetched by appending `.md` to their URL, which returns the authored MDX rather than 250 KB of rendered HTML. Every response is checked for `text/markdown` before it is allowed near the snapshot: a URL that misses the markdown handler still answers `200` with the HTML app shell, and writing that in would destroy the baseline and report the whole corpus as rewritten on the next run. A run commits all pages or none.

**Severity is decided by where the edit landed**, not how big it was:

| Level | Trigger |
|---|---|
| **High** | a changed line inside a fenced code block, a changed fence count, or a page that now 404s and is gone from the sitemap |
| **Medium** | a changed heading, changed frontmatter `title`/`description`, or prose in the same section as changed code |
| **Low** | other prose |

**Sections checked** lists every tracked page in nav order with a mark — `✓` unchanged, `!` changed, `+` stored, `✗` 404, `~` unstable, `·` not checked. Expanding a row shows the comparison: for a changed page the diff (`−` existing snapshot, `+` newly fetched), and for an unchanged one the two matching hashes, which is the evidence the check ran.

**`doc-snapshot/CHANGELOG.md`** is the record that survives a re-sync. Because syncing replaces the copy it just compared against, the run *after* a change reports nothing — so the changelog is written at the moment of discovery and never rewritten later. Only changed pages are recorded; a clean run does not touch the file. It keeps the three most recent dated entries, counted rather than aged, so a change from six weeks ago still shows if nothing has happened since.

**One sync date.** `syncedAt` in `doc-snapshot/manifest.json`, rewritten on every run and shown on `/`, `/status` and `/doc-sync`. There is no hand-maintained date to keep in step with it.

**To test it**, edit any `doc-snapshot/pages/*.md` file and press the button — a line inside a code fence for High, a `##` heading for Medium, a sentence for Low. The comparison reads the stored file itself, so nothing else needs changing. Both `/doc-sync` and the changelog label the result as a local snapshot edit rather than upstream drift.

Commit `doc-snapshot/` — `pages/`, `manifest.json` and `CHANGELOG.md` are the baseline every diff is taken against. `reports/` is gitignored derived data.

---

## 11. Project structure

```
aws-strands-py/
├── CLAUDE.md                    # build instructions this repo was produced from
├── README.md                    # this file
├── .env.example                 # copy to backend/.env AND frontend/.env.local
│
├── backend/
│   ├── pyproject.toml           # the Quickstart's four dependencies
│   ├── src/
│   │   ├── agent_server.py      # FastAPI parent; mounts one create_strands_app per agent
│   │   └── agents/
│   │       ├── model.py         # MODEL_ID + the Quickstart's OpenAIModel
│   │       ├── chat_agents.py   # the Quickstart agent shape, per route
│   │       ├── language_agent.py# the ONE agent the docs wire to shared state
│   │       └── registry.py      # id → (factory, doc page, doc gaps)
│   └── docs_verbatim/
│       ├── agent_py_published_excerpt.py   # 947 lines, byte-exact, not imported
│       └── README.md            # what it references and never defines
│
└── frontend/
    ├── src/lib/
    │   ├── intelligence.ts      # CopilotKitIntelligence + identifyUser, shared by all 3 runtimes
    │   ├── nav-config.ts        # THE spine: routes, doc links, statuses
    │   ├── doc-gaps.ts          # every doc-gap finding, and which routes it hits
    │   ├── agents.ts            # agent ids + agentUrl() (trailing slash lives here)
    │   ├── source.ts            # reads repo files so pages show real code
    │   └── inspector.ts         # which provider owns the inspector per route
    ├── src/components/
    │   ├── doc-gaps.tsx         # the red panel every affected route renders
    │   ├── route-header.tsx     # title + status badge + doc link + DocGaps
    │   ├── nav-sidebar.tsx      # nav, dot-coloured by status
    │   └── providers.tsx        # the single app-wide CopilotKitProvider
    └── src/app/
        ├── api/copilotkit/[[...slug]]/route.ts      # main runtime, 25 agents
        ├── api/copilotkit-voice/[[...slug]]/route.ts # v2 runtime + transcription
        ├── api/copilotkit-declarative-gen-ui/[[...slug]]/route.ts # A2UI auto-inject
        ├── <doc-route>/page.tsx                     # notes + real source
        ├── <doc-route>/demo-chat/page.tsx           # the live, chrome-free surface
        └── status/page.tsx                          # status table + doc-gap ledger
```

---

## 12. References

Grouped as the Strands doc sidebar groups them, with the pages this repo tracks marked ▸.

**Get Started** — ▸ [Introduction](https://docs.copilotkit.ai/strands) · ▸ [Quickstart](https://docs.copilotkit.ai/strands/quickstart?agent=bring-your-own) · [CopilotKit CLI](https://docs.copilotkit.ai/strands/cli) · [Build with agents](https://docs.copilotkit.ai/strands/build-with-agents)

**Concepts** — [Architecture](https://docs.copilotkit.ai/strands/concepts/architecture) · [Generative UI](https://docs.copilotkit.ai/strands/concepts/generative-ui-overview) · [Which Hook for Which Job](https://docs.copilotkit.ai/strands/concepts/which-hook) · [OSS vs Enterprise](https://docs.copilotkit.ai/strands/concepts/oss-vs-enterprise) · [Agentic Protocols](https://docs.copilotkit.ai/strands/agentic-protocols)

**Build Chat UIs — Rich Threads** — [Overview](https://docs.copilotkit.ai/strands/threads) · ▸ [Threads Drawer](https://docs.copilotkit.ai/strands/prebuilt-components/copilot-threads-drawer) · ▸ [Headless Threads](https://docs.copilotkit.ai/strands/headless-threads) · ▸ [Thread & History Lifecycle](https://docs.copilotkit.ai/strands/threads-lifecycle) · ▸ [Synchronize Thread History](https://docs.copilotkit.ai/strands/threads-import) · [Threads & Persistence Architecture](https://docs.copilotkit.ai/strands/premium/threads-explained)

**Build Chat UIs — Custom Look and Feel** — ▸ [Multimodal Attachments](https://docs.copilotkit.ai/strands/multimodal-attachments) · ▸ [Voice](https://docs.copilotkit.ai/strands/voice) · [Reasoning](https://docs.copilotkit.ai/strands/generative-ui/reasoning)

**Prebuilt Components** *(not in the sidebar; reachable by URL)* — ▸ [CopilotChat](https://docs.copilotkit.ai/strands/prebuilt-components/chat) · ▸ [CopilotSidebar](https://docs.copilotkit.ai/strands/prebuilt-components/sidebar) · ▸ [CopilotPopup](https://docs.copilotkit.ai/strands/prebuilt-components/popup) · ▸ [Open, close, and feedback](https://docs.copilotkit.ai/strands/prebuilt-components/chat-controls)

**Custom Look and Feel** *(not in the sidebar; reachable by URL)* — ▸ [CSS](https://docs.copilotkit.ai/strands/custom-look-and-feel/css) · ▸ [Slots](https://docs.copilotkit.ai/strands/custom-look-and-feel/slots) · ▸ [Headless UI](https://docs.copilotkit.ai/strands/custom-look-and-feel/headless-ui)

**Build Generative UI** — ▸ [Components as Tools](https://docs.copilotkit.ai/strands/generative-ui/tool-based) · ▸ [Tool Call Rendering](https://docs.copilotkit.ai/strands/generative-ui/tool-rendering) · [State Rendering](https://docs.copilotkit.ai/strands/generative-ui/state-rendering) · ▸ [A2UI · Dynamic Schema](https://docs.copilotkit.ai/strands/generative-ui/a2ui/dynamic-schema) · ▸ [A2UI · Fixed Schema](https://docs.copilotkit.ai/strands/generative-ui/a2ui/fixed-schema) · [MCP Apps](https://docs.copilotkit.ai/strands/generative-ui/mcp-apps) · ▸ [Your Components · Display-only](https://docs.copilotkit.ai/strands/generative-ui/your-components/display-only) *(not in sidebar)* · ▸ [Your Components · Interactive](https://docs.copilotkit.ai/strands/generative-ui/your-components/interactive) *(not in sidebar)*

**Add Agent Powers** — ▸ [Frontend Tools](https://docs.copilotkit.ai/strands/frontend-tools) · ▸ [Human-in-the-Loop](https://docs.copilotkit.ai/strands/human-in-the-loop) · ▸ [Sub-Agents](https://docs.copilotkit.ai/strands/multi-agent/subagents) · ▸ [Agent Config](https://docs.copilotkit.ai/strands/agent-config) · ▸ [Programmatic Control](https://docs.copilotkit.ai/strands/programmatic-control)

**Shared State** — ▸ [Render state in your app](https://docs.copilotkit.ai/strands/shared-state/rendering-in-app) · ▸ [Agent Read-Only Context](https://docs.copilotkit.ai/strands/shared-state/agent-readonly) · ▸ [Reading agent state](https://docs.copilotkit.ai/strands/shared-state/in-app-agent-read) · ▸ [Writing agent state](https://docs.copilotkit.ai/strands/shared-state/in-app-agent-write)

**AWS Strands (Python)** — ▸ [Copilot Runtime](https://docs.copilotkit.ai/strands/copilot-runtime) · ▸ [AG-UI](https://docs.copilotkit.ai/strands/ag-ui) · [AWS AgentCore](https://docs.copilotkit.ai/strands/deploy-agentcore) · [Migrate to V2](https://docs.copilotkit.ai/strands/troubleshooting/migrate-to-v2) · [Migrate to 1.10.X](https://docs.copilotkit.ai/strands/troubleshooting/migrate-to-1.10.X) · [Migrate to 1.8.2](https://docs.copilotkit.ai/strands/troubleshooting/migrate-to-1.8.2)

**Runtime** — [Copilot Runtime](https://docs.copilotkit.ai/strands/backend/copilot-runtime) · [Runtime HTTP endpoints](https://docs.copilotkit.ai/strands/backend/runtime-endpoints) · [Use any model router](https://docs.copilotkit.ai/strands/backend/custom-agent) · [AgentRunner and persistence](https://docs.copilotkit.ai/strands/backend/agent-runner) · [Self-managed agents](https://docs.copilotkit.ai/strands/backend/self-managed-agents) · [Connect AG-UI agents](https://docs.copilotkit.ai/strands/backend/ag-ui) · [Deploy to any runtime](https://docs.copilotkit.ai/strands/runtime-server-adapter) · [Authentication](https://docs.copilotkit.ai/strands/auth)

**Observe & Operate** — [Inspector](https://docs.copilotkit.ai/strands/inspector) · [VS Code Extension](https://docs.copilotkit.ai/strands/vs-code-extension)

**Intelligence Platform** *(premium — not exercised here)* — [Overview](https://docs.copilotkit.ai/strands/premium/overview) · [Cloud-Hosted](https://docs.copilotkit.ai/strands/premium/managed-intelligence-platform) · [Self-Hosting](https://docs.copilotkit.ai/strands/premium/self-hosting) · [Architecture](https://docs.copilotkit.ai/strands/premium/intelligence-platform)

**Deploy** — [AWS AgentCore](https://docs.copilotkit.ai/strands/deploy/agentcore)
