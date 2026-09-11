# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-09-11

### 08:00 UTC — 14 pages, highest severity high

**High — Agent Config**

`/strands/agent-config` · route `/agent-config` · under “How it works”

36 code lines, 5 prose lines changed. The number of fenced code blocks changed.

````diff
- The backend half is also a single node. Read the latest config context at the top of every run and use it to build the system prompt for that turn:
- 
- ```python title="backend/agent.py — agent reads config and rebuilds the system prompt"
- import json
- 
- CONFIG_KEYS = ("tone", "expertise", "responseLength")
- 
- def read_config_value(entry):
````

**High — Frontend Tools**

`/strands/frontend-tools` · route `/frontend-tools` · under “Frontend Tools”

27 code lines, 2 headings, 36 prose lines changed. The number of fenced code blocks changed.

````diff
- <Callout type="info" title="See this in Inspector">
- Open Inspector on localhost. Go to **Inspect**, then **Event Snippets**.
- You can compile a tool call, reasoning, text, or activity, run it on the live
- agent, and save it. Saved snippets are grouped by recipe. On localhost chat,
- **Save as snippet** uses the recipe for the thing you click and fills the form.
- On a tool call, generative UI, or A2UI, the bookmark sits to the right of the
- block (or to the left if there is no room on the right).
- Run of a `generateSandboxedUi` tool call paints the sandbox UI in chat.
````

**High — Components as Tools**

`/strands/generative-ui/tool-based` · route `/generative-ui/tool-based` · under “How it works in code”

27 code lines, 2 headings, 28 prose lines changed. The number of fenced code blocks changed.

````diff
- <!-- setup skipped: frontend-tools-setup is not bundled for strands -->
+ <Steps>
+ <Step>
+ ### Nothing to wire on the agent
+ 
+ On every run the AG-UI Strands adapter registers a proxy tool in the
+ agent's tool registry for each tool the request carries, so the agent
+ declares none of its own. A component registered with `useComponent`
````

**High — Multimodal Attachments**

`/strands/multimodal-attachments` · route `/multimodal-attachments` · under “Configuration”

9 code lines, 1 heading, 11 prose lines changed. The number of fenced code blocks changed.

````diff
+ | `maxConcurrentUploads` | `number` | `1` | How many files upload at the same time. See [Upload concurrency](#upload-concurrency). |
+ 
+ ## Upload concurrency
+ 
+ When a user attaches several files at once, they upload one at a time by default. Every picked file shows in the attachment queue immediately, whether or not its upload has started.
+ 
+ Set `maxConcurrentUploads` to upload several together — worth raising when your upload endpoint handles parallel requests:
+ 
````

**High — Open, close, and feedback**

`/strands/prebuilt-components/chat-controls` · route `/prebuilt-components/chat-controls` · under “Control the open state from your own UI”

20 code lines, 1 heading, 36 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Control the open state from your own UI
+ 
+ Pass `open` and `onOpenChange` to `<CopilotSidebar>` or `<CopilotPopup>` to own
+ the open state yourself. This is the controlled pattern: the surface renders
+ whatever `open` says, and every request to open or close (the toggle button,
+ click-outside on the popup) arrives on `onOpenChange` instead of moving the
+ surface directly.
+ 
````

**High — Programmatic Control**

`/strands/programmatic-control` · route `/programmatic-control` · under “Sending a message from code” · in a `tsx` block

2 code lines changed.

````diff
+ "use client";
+ 
````

**High — Quickstart**

`/strands/quickstart` · route `/quickstart` · under “Quickstart”

4 code lines, 11 prose lines changed.

````diff
- <OpsPlatformCTA
- variant="card"
- title="Ship AWS Strands to production"
- body="Add persistent threads and the inspector with CopilotKit Intelligence."
- ctaLabel="Create a free account"
+ <IntelligenceOnboardingPrompt
+ feature="learning"
- apiKey: process.env.INTELLIGENCE_API_KEY!,
````

**High — Reading agent state**

`/strands/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Use the `useAgent` Hook”

30 code lines, 2 headings, 9 prose lines changed.

````diff
- With your agent connected and running, call the `useAgent` hook, pass the agent's name, and
- optionally provide an initial state.
+ With your agent connected and running, call the `useAgent` hook, wait for the real agent, and
+ initialize any missing UI-owned state with `agent.setState`.
+ import { useEffect } from "react";
+ import { useAgent } from "@copilotkit/react-core/v2";
- // [!code highlight:5]
- const { agent } = useAgent({
````

**High — Writing agent state**

`/strands/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Use the `useAgent` Hook” · in a `tsx` block

14 code lines changed.

````diff
+ import { useEffect } from "react";
+ import { useAgent } from "@copilotkit/react-core/v2";
- const { agent } = useAgent({
+ const { agent, isReady } = useAgent({
- // optionally provide a type-safe initial state
- initialState: { language: "spanish" }
+ const state = (agent.state ?? {}) as Partial<AgentState>;
+ useEffect(() => {
````

**Low — A2UI · Fixed Schema**

`/strands/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Fixed Schema A2UI”

14 prose lines changed.

````diff
+ <Callout type="info" title="The flight card is an illustrative domain">
+ Everything below uses flight booking so the wiring has something concrete to
+ render — `display_flight`, `flight-fixed-catalog`, and the airport/airline
+ components are this page's example, not part of the API.
+ 
+ What transfers is the **shape**: a fixed catalog, a tool that returns data
+ against it, and `a2ui.render(...)` with `createSurface` + `updateComponents` +
+ `updateDataModel`. Keep your own application's domain and substitute your own
````

**Info — Headless Threads**

`/strands/headless-threads` · route `/headless-threads`

Now tracked for the first time.

**Info — Threads Drawer**

`/strands/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer`

Now tracked for the first time.

**Info — Import & Synchronize History**

`/strands/threads-import` · route `/threads-import`

Now tracked for the first time.

**Info — Thread & History Lifecycle**

`/strands/threads-lifecycle` · route `/threads-lifecycle`

Now tracked for the first time.

---

## 2026-08-26

### 09:37 UTC — 14 pages, highest severity high

**High — Agent Config**

`/strands/agent-config` · route `/agent-config` · under “When to use this”

16 code lines, 1 heading, 20 prose lines changed. The number of fenced code blocks changed.

````diff
- <WhenFrameworkHas flag="agent_config_pattern" equals="shared-state">
+ 
- </WhenFrameworkHas>
- <WhenFrameworkHas flag="agent_config_pattern" equals="runtime-properties">
- ## How it works
- The runtime owns the agent in-process, so config travels through frontend
- runtime properties rather than agent state. There's no separate backend service
- to push state into: the typed object becomes the input to the agent factory
````

**High — Copilot Runtime**

`/strands/copilot-runtime` · route `/copilot-runtime` · under “Setting Up the Runtime”

41 code lines, 2 headings, 15 prose lines changed. The number of fenced code blocks changed.

````diff
- The runtime is a lightweight server endpoint that you add to your backend. Here's a minimal example using Next.js:
+ The runtime is a lightweight server endpoint that you add to your backend:
- ```ts title="app/api/copilotkit/route.ts"
+ ```npm
+ npm install @copilotkit/runtime
+ ```
+ 
+ Here's a minimal example using Next.js. `createCopilotRuntimeHandler` returns a
````

**High — A2UI · Fixed Schema**

`/strands/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema`

Rewritten past the diff cap.

**High — Tool Call Rendering**

`/strands/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “What is this?”

127 code lines, 16 prose lines changed. The number of fenced code blocks changed.

````diff
- **Free course:** See this pattern built end-to-end in [Build Interactive Agents with Generative UI](https://www.deeplearning.ai/short-courses/build-interactive-agents-with-generative-ui/) — a free DeepLearning.AI short course taught by CopilotKit's CEO covering the full Generative UI spectrum (Controlled, Declarative, and Open-Ended).
+ **Free course:** See this pattern built end-to-end in [Build Interactive
+ Agents with Generative
+ UI](https://www.deeplearning.ai/short-courses/build-interactive-agents-with-generative-ui/)
+ — a free DeepLearning.AI short course taught by CopilotKit's CEO covering the
+ full Generative UI spectrum (Controlled, Declarative, and Open-Ended).
- ```typescript
- // src/app/demos/tool-rendering/page.tsx
````

**High — Sub-Agents**

`/strands/multi-agent/subagents` · route `/multi-agent/subagents`

Rewritten past the diff cap.

**High — Programmatic Control**

`/strands/programmatic-control` · route `/programmatic-control` · under “What is this?”

87 code lines, 2 headings, 38 prose lines changed. The number of fenced code blocks changed.

````diff
- Every example on this page is pulled from two live cells:
- `headless-complete` (full chat surface, shown here for the message-send
- path) and `interrupt-headless` (button-driven interrupt resolver, shown
- here for the subscribe + resume path).
+ The send-and-stop example below is intentionally self-contained. The
+ later subscription and interrupt examples are pulled from the live
+ `interrupt-headless` cell.
- The message-send path in `headless-complete` is the canonical pattern:
````

**High — Quickstart**

`/strands/quickstart` · route `/quickstart` · under “Quickstart”

54 code lines, 1 heading, 37 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
- body="Add persistent threads and the inspector with the Enterprise Intelligence Platform."
+ body="Add persistent threads and the inspector with CopilotKit Intelligence."
- - Python 3.12+
+ - Python 3.12+ (Python agents only)
- <SignupLink surface="docs_aws_strands_quickstart_step1">Sign up for a free developer account</SignupLink> on our Enterprise Intelligence Platform to get a license key. You'll use it later to enable persistent threads and the inspector.
+ <SignupLink surface="docs_aws_strands_quickstart_step1">Sign up for a free developer account</SignupLink> for CopilotKit Intelligence to get a license key. You'll use it later to enable persistent threads and the inspector.
- ```bash
````

**High — Render state in your app**

`/strands/shared-state/rendering-in-app` · route `/shared-state/rendering-in-app` · under “The pattern” · in a `tsx` block

29 code lines, 6 prose lines changed.

````diff
+ import { useEffect } from "react";
+ const INITIAL_CANVAS_STATE: CanvasState = {
+ title: "Project launch",
+ items: [
+ { id: "research", label: "Research user needs", done: true },
+ { id: "prototype", label: "Build a prototype", done: false },
+ ],
+ };
````

**Low — AG-UI**

`/strands/ag-ui` · route `/ag-ui` · under “The proxy pattern”

2 prose lines changed.

````diff
- routing, and CopilotKit Enterprise Intelligence without changing how the
+ routing, and CopilotKit Intelligence without changing how the
````

**Low — Frontend Tools**

`/strands/frontend-tools` · route `/frontend-tools` · under “Frontend Tools”

21 prose lines changed.

````diff
+ 
+ 
+ 
+ <Callout type="info" title="See this in Inspector">
+ Open Inspector on localhost. Go to **Agents**, then **Frontend Tools**.
+ Your tool and its schema are listed.
+ 
+ More detail: [Inspector](/strands/inspector).
````

**Low — Human in the Loop**

`/strands/human-in-the-loop` · route `/human-in-the-loop` · under “HITL Overview”

9 prose lines changed.

````diff
+ 
+ 
+ 
+ <Callout type="info" title="See this in Inspector">
+ Open Inspector on localhost. Go to **Agents**, then **Frontend Tools**.
+ Your tool and its schema are listed.
+ 
+ More detail: [Inspector](/strands/inspector).
````

**Low — Open, close, and feedback**

`/strands/prebuilt-components/chat-controls` · route `/prebuilt-components/chat-controls` · under “Capture message feedback (thumbs up / down)”

11 prose lines changed.

````diff
- slot**. The buttons only render when a handler is provided:
+ When the slot is rendered through `CopilotChatMessageView`, a live assistant
+ message created by a direct AG-UI `TEXT_MESSAGE_START` can also include that
+ event's opaque `rawEvent` value. The join happens when the thumbs callback runs;
+ canonical messages and future run input stay unchanged. Chunk, snapshot,
+ persisted, legacy, and direct `CopilotChatAssistantMessage` paths don't provide
+ this callback metadata.
+ 
````

**Low — Agent Read-Only Context**

`/strands/shared-state/agent-readonly` · route `/shared-state/agent-readonly` · under “Agent Read-Only Context”

9 prose lines changed.

````diff
+ 
+ 
+ 
+ <Callout type="info" title="See this in Inspector">
+ Open Inspector on localhost. Go to **Agents**, then **Context**.
+ The values you publish with `useAgentContext` appear here.
+ 
+ More detail: [Inspector](/strands/inspector).
````

**Low — Voice**

`/strands/voice` · route `/voice` · under “Next.js API route”

4 prose lines changed.

````diff
- <WhenFrameworkHas flag="voice_backend_pattern" equals="adk-fastapi-agent-path">
- For the Google ADK showcase, agent runs take one more hop: this Next.js route registers the `voice-demo` agent with an `HttpAgent` pointed at `${AGENT_URL}/voice`. The Python `agent_server.py` mounts registered ADK agents with `add_adk_fastapi_endpoint(app, ..., path=f"/{agent_name}")`, so the browser talks to `/api/copilotkit-voice` while the Next.js runtime forwards voice-demo agent runs to the backend `/voice` endpoint.
- </WhenFrameworkHas>
+ 
````

---

---

## 2026-08-17

### 12:31 UTC — 1 page, highest severity high

**High — CopilotPopup** · _local snapshot edit, not an upstream change_

`/strands/prebuilt-components/popup` · route `/prebuilt-components/popup` · under “Basic setup” · in a `typescript` block

8 code lines changed.

````diff
- 
+ <CopilotPopup
+ agentId="prebuilt-popup"
+ defaultOpen={true}
+ labels={{
+ chatInputPlaceholder: "Ask the popup anything...",
+ }}
+ />
````
