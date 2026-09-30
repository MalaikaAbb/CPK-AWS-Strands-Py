# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-09-30

### 11:21 UTC — 20 pages, highest severity high

**High — Copilot Runtime**

`/strands/copilot-runtime` · route `/copilot-runtime` · under “Setting Up the Runtime” · in a `ts` block

15 code lines, 1 heading, 37 prose lines changed. The number of fenced code blocks changed.

````diff
+ export const PATCH = handler;
+ export const DELETE = handler;
+ 
+ ## Which name identifies an agent
+ 
+ The name you use to address an agent from the frontend must equal a **key of the
+ runtime's `agents` map**. That key is the only name the frontend can ask for. An
+ agent's own `name`, `id`, or class name is never used for routing, and the two are
````

**High — Frontend Tools**

`/strands/frontend-tools` · route `/frontend-tools` · under “Registering a list of tools”

10 code lines, 1 heading, 14 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Registering a list of tools
+ 
+ `useFrontendTool` registers one tool per call, so it cannot be called in a loop
+ over a list whose length changes between renders. When the set of tools comes
+ from state, from props, or from a backend response, use
+ [`useFrontendTools`](/reference/hooks/useFrontendTools) instead. It takes an
+ array and runs a single effect over it, so the array can be empty on one render
+ and hold twenty entries on the next.
````

**High — A2UI · Fixed Schema**

`/strands/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Fixed Schema A2UI”

2 code lines, 22 prose lines changed.

````diff
- - **Schema-loading** (langgraph-python, langgraph-typescript,
- langgraph-fastapi, llamaindex, crewai-crews, pydantic-ai,
- ms-agent-python, google-adk), the schema is saved as a `.json`
- file next to the agent and loaded once at startup.
+ - **Schema-loading** (including Strands TypeScript), the schema is saved
+ as a `.json` file next to the agent and loaded once at startup.
- - **LLM-driven** (mastra, strands), the agent runs a secondary LLM
- call to produce the operations container per-request. The catalog
````

**High — Components as Tools**

`/strands/generative-ui/tool-based` · route `/generative-ui/tool-based` · under “Tell the model when to call it”

5 code lines, 1 heading, 27 prose lines changed. The number of fenced code blocks changed.

````diff
- discover it, and Zod validates the LLM's arguments before they reach your
- component.
+ discover it, and the schema becomes that tool's parameter definition — it is
+ what tells the model which arguments to send.
+ <Callout type="warn">
+ `parameters` is optional, but leaving it out advertises the tool with an
+ empty parameter schema (`{ "type": "object", "properties": {} }`). The model
+ then has nothing to fill in, so it calls the tool with no arguments and your
````

**High — Headless Threads**

`/strands/headless-threads` · route `/headless-threads` · under “Headless Threads”

7 code lines, 1 heading, 47 prose lines changed. The number of fenced code blocks changed.

````diff
+ Intelligence’s AG-UI streams power the history and delivery behind this custom UI. Use `useThreads` to list and manage conversations, and pass their `threadId` to your chat.
+ 
- CopilotKit Rich Threads enable persistent, resumable multi-turn conversations. The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
+ The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
- [scope Rich Threads to the signed-in user](/strands/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
+ [scope AG-UI Streams to the signed-in user](/strands/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
- <Callout type="info" title="Migrating existing history?">
- Threads capture new CopilotKit conversations once your app is connected to
````

**High — Human in the Loop**

`/strands/human-in-the-loop` · route `/human-in-the-loop` · under “Two patterns for HITL in CopilotKit”

41 code lines, 1 heading, 15 prose lines changed. The number of fenced code blocks changed.

````diff
- <!-- setup skipped: human-in-the-loop-setup is not bundled for strands -->
+ <Steps>
+ <Step>
+ ### Pause a tool with Strands' native interrupt
+ 
+ AWS Strands ships a first-class
+ [interrupt primitive](https://strandsagents.com/docs/user-guide/concepts/interrupts/).
+ A tool declared with `@tool(context=True)` calls
````

**High — Sub-Agents**

`/strands/multi-agent/subagents` · route `/multi-agent/subagents` · under “Setting up sub-agents” · in a `python` block

28 code lines, 9 prose lines changed.

````diff
- # Strands has no native interrupt primitive, so the gen-ui-interrupt and
- # interrupt-headless demos register `schedule_meeting` as a frontend tool
- # through the frontend's tool registration API. Its async handler returns a
- # Promise that only resolves once the user picks a slot or cancels in the
- # in-chat picker
- # (the Strands shim for LangGraph's `interrupt()` / `resolve()` pair).
+ # `hitl-in-chat` registers `schedule_meeting` as a FRONTEND tool, so its async
+ # handler resolves only once the user picks a slot or cancels in the in-chat
````

**High — CopilotChat**

`/strands/prebuilt-components/chat` · route `/prebuilt-components/chat` · under “Basic setup” · in a `tsx` block

4 code lines, 7 prose lines changed. The number of fenced code blocks changed.

````diff
+ ```tsx
+ import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2";
+ import "@copilotkit/react-core/v2/styles.css";
+ ```
+ 
+ <Callout type="warn">
+ `@copilotkit/react-ui` also exports a component named `CopilotChat`. That one
+ is the [deprecated v1 chat](/strands/migrate/v2). This page documents the v2 chat,
````

**High — Threads Drawer**

`/strands/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “When should I use this?”

27 code lines, 3 headings, 54 prose lines changed. The number of fenced code blocks changed.

````diff
- server-side). <SignupLink surface="docs_drawer">Get a free developer account</SignupLink> to set that up.
+ server-side). <SignupLink surface="docs_drawer">Start cloud-hosted setup</SignupLink> to create or select a project.
- [scope Rich Threads to the signed-in user](/strands/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
+ [scope AG-UI Streams to the signed-in user](/strands/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
- body="Get persistent threads and realtime sync on the free Developer tier."
+ body="Connect a cloud-hosted project to get persistent threads and realtime sync."
+ <Callout type="warn">
+ **The Drawer ships only in `@copilotkit/react-core/v2`.** There is no v1
````

**High — CopilotPopup**

`/strands/prebuilt-components/popup` · route `/prebuilt-components/popup` · under “Basic setup” · in a `tsx` block

4 code lines, 7 prose lines changed. The number of fenced code blocks changed.

````diff
+ ```tsx
+ import { CopilotKit, CopilotPopup } from "@copilotkit/react-core/v2";
+ import "@copilotkit/react-core/v2/styles.css";
+ ```
+ 
+ <Callout type="warn">
+ `@copilotkit/react-ui` also exports a component named `CopilotPopup`. That one
+ is the [deprecated v1 popup](/strands/migrate/v2). This page documents the v2 popup,
````

**High — CopilotSidebar**

`/strands/prebuilt-components/sidebar` · route `/prebuilt-components/sidebar` · under “When should I use this?”

4 code lines, 11 prose lines changed. The number of fenced code blocks changed.

````diff
- use [`<CopilotChat>`](/strands/prebuilt-components/chat) directly.
+ use [`<CopilotChat>`](/strands/prebuilt-components/chat) directly. For saved
+ conversations and switching between them, the sidebar hosts the
+ [Threads Drawer](/strands/prebuilt-components/copilot-threads-drawer).
+ 
+ ```tsx
+ import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
+ import "@copilotkit/react-core/v2/styles.css";
````

**High — Programmatic Control**

`/strands/programmatic-control` · route `/programmatic-control` · under “Resolving a LangGraph interrupt from a button”

36 code lines, 2 headings, 15 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Resolving a LangGraph interrupt from a button
+ The `interrupt-headless` cell demonstrates the full pattern without
+ `useInterrupt` or a chat surface. A plain hook subscribes to
+ `on_interrupt` custom events, buffers the payload until the run
+ finalizes (so the UI doesn't flash mid-stream), and exposes a
+ `resolve(response)` callback that calls `copilotkit.runAgent({ agent,
+ forwardedProps: { command: { resume, interruptEvent } } })` to unblock
+ the graph:
````

**High — Quickstart**

`/strands/quickstart` · route `/quickstart` · under “Quickstart”

70 code lines, 3 headings, 65 prose lines changed. The number of fenced code blocks changed.

````diff
- <IntelligenceOnboardingPrompt
- feature="learning"
- surface="docs_aws_strands_quickstart"
- />
+ ## Start with your coding agent
+ Use this prompt to connect your AWS Strands agent to CopilotKit and verify a working conversation. Your coding agent will follow this guide in your project, or you can work through the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
````

**Medium — Headless UI**

`/strands/custom-look-and-feel/headless-ui` · route `/custom-look-and-feel/headless-ui` · under “Fully Headless UI”

2 headings changed.

````diff
- # Fully Headless UI
+ # Headless UI
````

**Medium — Tool Call Rendering**

`/strands/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Tool inputs and results are separate”

1 heading, 15 prose lines changed.

````diff
+ ### Tool inputs and results are separate
+ 
+ In `useRenderTool`, `parameters` contains the **inputs** the agent sent to the
+ tool. It does not change into the tool's return value when `status` becomes
+ `"complete"`. The completed output arrives separately as `result`, a string.
+ For a tool that returns JSON, parse that string before reading its fields.
+ 
+ For example, `get_weather` might receive `{ "location": "Paris" }` and return
````

**Medium — Import & Synchronize History**

`/strands/threads-import` · route `/threads-import` · under “Import & Synchronize Thread History”

7 headings, 27 prose lines changed.

````diff
- # Import & Synchronize Thread History
+ # Add AG-UI Streams to Existing Threads
- > Import historical conversations into CopilotKit Intelligence, then keep future CopilotKit runs synchronized with Rich Threads.
+ > Add Intelligence’s AG-UI streams to your existing agent conversations, with optional historical import for supported stores.
- ## What is this?
+ <span id="what-is-this" />
- Import and synchronization bring existing conversations into CopilotKit Intelligence as Rich Threads without replacing the native storage or analytics you already use. Import supported history once, then continue running those conversations through CopilotKit so users can resume them through the same thread UI as new conversations.
+ ## Add Intelligence to your existing app
````

**Medium — Thread & History Lifecycle**

`/strands/threads-lifecycle` · route `/threads-lifecycle` · under “The lifecycle at a glance”

2 headings, 12 prose lines changed.

````diff
- 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/strands/intelligence/threads-explained) for the full server-side model.
+ 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [AG-UI Streams & Framework Threads](/strands/intelligence/threads-explained) for the full server-side model.
- ## Scope Rich Threads to the signed-in user
+ <span id="scope-rich-threads-to-the-signed-in-user" />
+ ## Scope AG-UI Streams to the signed-in user
+ 
- [Connect your runtime to Intelligence](/strands/intelligence/connect-your-runtime) covers the
+ [Connect your runtime to Intelligence](/strands/intelligence/quickstart) covers the
````

**Low — Introduction**

`/strands` · routes `/`, `/doc-sync` · under “Introduction”

57 prose lines changed.

````diff
- > Bring your AWS Strands agents to your users with CopilotKit via AG-UI.
+ > Redirect notice for a landing page that is served from a data record.
- <FrameworkOverview
- frameworkName="AWS Strands"
- frameworkIcon={<AwsStrandsIcon className="h-10 w-10" />}
- header="Bring your AWS Strands agents to your users"
- subheader="Give your AWS Strands agents real user-interactivity using CopilotKit and AG-UI. Build rich, interactive, agent-powered applications."
- bannerVideo="https://cdn.copilotkit.ai/docs/copilotkit/videos/coagents/overview.mp4"
````

**Low — Slots**

`/strands/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Three levels deep”

4 prose lines changed.

````diff
+ The `assistantMessage` slot also holds `markdownRenderer`, which controls how
+ assistant markdown is rendered. It has its own guide:
+ [Markdown Rendering](/strands/custom-look-and-feel/markdown).
+ 
````

**Low — Voice**

`/strands/voice` · route `/voice` · under “Next.js API route”

26 prose lines changed.

````diff
+ <Callout type="warn" title="Without a service, `/transcribe` answers 503">
+ A runtime with no `transcriptionService` still serves the route, and answers every request
+ `503` with `{ "error": "service_not_configured" }`. The mic button never appears, so the
+ symptom is a chat with no voice input rather than a visible server error — check `/info` for
+ `audioFileTranscriptionEnabled` when voice silently doesn't show up.
+ </Callout>
+ <Callout type="warn" title="Calling `/transcribe` yourself">
+ The chat handles this for you; these are the rules if you post to the route directly. As
````

---

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
