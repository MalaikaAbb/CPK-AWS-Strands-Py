# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-10

### 10:00 UTC — 19 pages, highest severity high

**High — Slots**

`/strands/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Tool calls”

23 code lines, 1 heading, 15 prose lines changed. The number of fenced code blocks changed.

````diff
+ ### Tool calls
+ 
+ The `assistantMessage` slot holds `toolCallsView`, which renders the tool calls
+ of one assistant message. Wrap the default `CopilotChatToolCallsView` to change
+ the container while keeping your registered tool renderers:
+ 
+ ```tsx title="page.tsx"
+ import {
````

**High — Frontend Tools**

`/strands/frontend-tools` · route `/frontend-tools` · under “Nothing to wire on the agent” · in a `python` block

2 code lines changed.

````diff
- model=OpenAIModel(model_id="gpt-4o"),
+ model=OpenAIModel(model_id="gpt-6-luna"),
````

**High — A2UI · Dynamic Schema**

`/strands/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “The A2UI agent tool” · in a `python` block

2 code lines changed.

````diff
- "model": ChatOpenAI(model="gpt-4o"),
+ "model": ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
````

**High — A2UI · Fixed Schema**

`/strands/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Generate the schema dynamically” · in a `python` block

105 code lines changed.

````diff
+ import uuid
+ from strands.types.tools import ToolContext
+ from tools.a2ui_catalog import read_client_catalog, validate_client_surface
- # Shared tool implementations, symlinked at the project root
- # (→ ../../shared/python/tools). ``build_a2ui_operations_from_tool_call`` wraps
- # the inner model's ``render_a2ui`` arguments in the nested A2UI v0.9
- # ``a2ui_operations`` envelope the middleware detects in a tool result.
- """Shape of the structured error dict returned by generate_a2ui branches.
````

**High — Hashbrown**

`/strands/generative-ui/hashbrown` · route `/generative-ui/hashbrown` · under “Hashbrown”

36 code lines, 2 headings, 11 prose lines changed. The number of fenced code blocks changed.

````diff
- > Bring your own component library. Have the agent stream structured output and let Hashbrown's progressive JSON parser render it as React components in real time.
+ > Stream a structured sales dashboard through Hashbrown's UI kit and progressive JSON parser.
- 
- You have a chat surface and you want the agent to draw a dashboard, not just describe one in prose. By the end of this guide, the agent will stream a structured output object, [`@hashbrownai/react`](https://www.npmjs.com/package/@hashbrownai/react)'s progressive JSON parser will hand each finished slice to your renderer as it arrives, and the user sees the dashboard fill in live.
- 
- ## When to use this
- 
- - **Streaming dashboards** where partial state should render before the full payload arrives.
````

**High — JSON Render**

`/strands/generative-ui/json-render` · route `/generative-ui/json-render` · under “JSON Render”

53 code lines, 2 headings, 11 prose lines changed. The number of fenced code blocks changed.

````diff
- > Bring your own component library. Have the agent emit a JSON spec and let json-render render it against a Zod-validated catalog of React components.
+ > Bring your own component library. Have the agent emit a JSON spec and render allowed component types through a typed React registry.
- 
- You have a chat surface and you want the agent to draw a dashboard from a typed JSON spec. By the end of this guide, the agent will emit a `{ root, elements }` object, [`@json-render/react`](https://www.npmjs.com/package/@json-render/react) will validate it against a Zod-described catalog, and the user sees the dashboard render as a single React tree.
+ ```typescript
+ // src/app/demos/declarative-json-render/chat.tsx
+ "use client";
- ## When to use this
````

**High — MCP Apps**

`/strands/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps` · under “MCP Apps with Intelligence”

48 code lines, 2 headings, 45 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## MCP Apps with Intelligence
+ 
+ The `mcpApps` option works the same way on a runtime connected to
+ [Intelligence](/strands/intelligence/quickstart). The two options do different jobs:
+ 
+ - `mcpApps` configures the agent side. On every run, the runtime attaches the
+ MCP Apps middleware to the agent.
+ - `intelligence` replaces the runner. Intelligence stores the threads and runs,
````

**High — Components as Tools**

`/strands/generative-ui/tool-based` · route `/generative-ui/tool-based` · under “Nothing to wire on the agent” · in a `python` block

2 code lines changed.

````diff
- model=OpenAIModel(model_id="gpt-4o"),
+ model=OpenAIModel(model_id="gpt-6-luna"),
````

**High — Tool Call Rendering**

`/strands/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Default tool rendering (zero-config)”

86 code lines, 1 heading, 35 prose lines changed. The number of fenced code blocks changed.

````diff
- any UI.
+ any UI. Calls the agent makes in a row are grouped into one card; see
+ [Grouping tool calls](#grouping-tool-calls).
+ ## Grouping tool calls
+ 
+ Agents often call several tools in a row. By default, CopilotKit collapses
+ each run of calls drawn by the built-in card from `useDefaultRenderTool()` into
+ one card that reads "Used 3 tools". While a call runs, the card names it
````

**High — Sub-Agents**

`/strands/multi-agent/subagents` · route `/multi-agent/subagents`

Rewritten past the diff cap.

**High — Threads Drawer**

`/strands/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “Add your own "New conversation" button”

41 code lines, 1 heading, 19 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Add your own "New conversation" button
+ 
+ The Drawer has its own "New Conversation" row. Your app can also keep its own
+ button, for example in a toolbar or a page header. To start a new conversation
+ from that button, call `startNewThread()` from
+ [`useCopilotChatConfiguration`](/reference/hooks/useCopilotChatConfiguration).
+ This is the same function the Drawer calls for its own row.
+ 
````

**High — Quickstart**

`/strands/quickstart` · route `/quickstart` · under “Expose your agent via AG-UI” · in a `python` block

4 code lines changed.

````diff
- model_id="gpt-5.4",
+ model_id="gpt-6-luna",
- modelId: "gpt-5.4",
+ modelId: "gpt-6-luna",
````

**High — Reading agent state**

`/strands/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Setup your agent with state” · in a `python` block

4 code lines changed.

````diff
- model_id="gpt-4o",
+ model_id="gpt-6-luna",
- modelId: "gpt-4o",
+ modelId: "gpt-6-luna",
````

**High — Writing agent state**

`/strands/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Setup your agent with state” · in a `python` block

4 code lines changed.

````diff
- model_id="gpt-4o",
+ model_id="gpt-6-luna",
- modelId: "gpt-4o",
+ modelId: "gpt-6-luna",
````

**High — Import & Synchronize History**

`/strands/threads-import` · route `/threads-import` · under “Add AG-UI Streams to Existing Threads”

1 code line, 7 headings, 32 prose lines changed. The number of fenced code blocks changed.

````diff
- # Add AG-UI Streams to Existing Threads
+ # Add AG-UI Streams to Strands Conversations
- 
- Add reconnection, catch-up, and delivery across devices to the conversations your agent already manages. Follow the [Intelligence quickstart](/strands/intelligence/quickstart) to connect your existing CopilotKit app and Runtime, then verify that a new conversation is saved. That setup enables AG-UI streams for runs through CopilotKit; importing old conversations is not required.
- 
- Your framework continues managing agent context and execution state. Keep your durable LangGraph checkpointer or durable ADK session service configured and keep the mapping between CopilotKit `threadId` values and native framework conversation identifiers stable. See [AG-UI Streams & Framework Threads](/strands/intelligence/threads-explained#how-threads-work-with-framework-storage) for the responsibilities of each layer.
+ Give users reconnection, catch-up, and delivery across devices around your Strands agent. Follow the [Intelligence quickstart](/strands/intelligence/quickstart) to connect your existing CopilotKit app and Runtime, then verify that a new conversation is saved. This enables AG-UI streams for runs through CopilotKit; no historical import is required.
- For a concrete example without historical import, see [keep an existing LangGraph conversation](/strands/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation).
````

**Low — Copilot Runtime**

`/strands/copilot-runtime` · route `/copilot-runtime` · under “CopilotKit Intelligence”

4 prose lines changed.

````diff
- Features like [threads](/strands/threads) and the [inspector](/strands/inspector) are provided through the runtime and CopilotKit Intelligence. These give you conversation persistence and debugging capabilities out of the box.
+ Features like [threads](/strands/AG-UI-Streams) and the [inspector](/strands/inspector) are provided through the runtime and CopilotKit Intelligence. These give you conversation persistence and debugging capabilities out of the box.
- 2. **Many ecosystem features won't work.** The AG-UI protocol supports a middleware layer designed to run on the backend. Many features in the CopilotKit ecosystem depend on this server-side middleware. Without the runtime, these features — including [threads](/strands/threads) and other capabilities — will not be available.
+ 2. **Many ecosystem features won't work.** The AG-UI protocol supports a middleware layer designed to run on the backend. Many features in the CopilotKit ecosystem depend on this server-side middleware. Without the runtime, these features — including [threads](/strands/AG-UI-Streams) and other capabilities — will not be available.
````

**Low — Open Generative UI**

`/strands/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui` · under “Minimal setup”

24 prose lines changed.

````diff
- auto-registered by `CopilotKit`, so no extra wiring is needed.
+ auto-registered by `CopilotKit`, so no extra frontend wiring is needed. Your
+ agent must still give the run's frontend tools to its model (see the warning
+ below).
+ 
+ <Callout type="warn" title="Your agent must pass frontend tools to its model">
+ `generateSandboxedUi` reaches the agent as a frontend tool in the run input.
+ The agent calls it only if it gives the run's frontend tools to its model.
````

**Low — Open, close, and feedback**

`/strands/prebuilt-components/chat-controls` · route `/prebuilt-components/chat-controls` · under “Capture message feedback (thumbs up / down)”

12 prose lines changed.

````diff
- slot**. The buttons only render when a handler is provided:
+ slot**. Without Automatic Learning capture, the buttons only render when a
+ handler or a custom thumb slot is provided:
+ 
+ With [Automatic Learning capture](/strands/intelligence/capture-interactions#collect-reply-ratings)
+ on and a Trajectory started, the buttons appear without handlers in every chat
+ that renders messages with `CopilotChatMessageView` inside a
+ `CopilotChatConfigurationProvider`, as `CopilotChat`, `CopilotPopup`, and
````

**Low — Voice**

`/strands/voice` · route `/voice` · under “Custom transcription backends”

18 prose lines changed.

````diff
+ <Callout type="info" title="TranscriptionServiceOpenAI takes an openai 5.x client">
+ `@copilotkit/voice` depends on `openai` `^5.9.0`, and the `openai` option of
+ `TranscriptionServiceOpenAI` is typed against the copy of `openai` that
+ `@copilotkit/voice` resolves. Pass an `OpenAI` instance created from that same
+ installed copy. The `OpenAI` class has private (`#private`) members, so an
+ instance from another copy or another major version fails type-checking, even
+ when it looks the same.
+ 
````

---

## 2026-10-19

### 07:35 UTC — 15 pages, highest severity high

**High — Tool Call Rendering**

`/strands/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “The backend tool definition” · in a `python` block

4 code lines changed.

````diff
+ Context,
+ from strands.types.tools import ToolContext
+ 
+ input_data = with_state_context(input_data)
````

**High — Sub-Agents**

`/strands/multi-agent/subagents` · route `/multi-agent/subagents` · under “Setting up sub-agents” · in a `python` block

86 code lines changed.

````diff
+ Context,
+ from strands.types.tools import ToolContext
+ input_data = with_state_context(input_data)
+ 
- @tool
- def manage_sales_todos(todos: list[dict]):
+ # Native agent state key holding the sales pipeline. A configured Strands
+ # SessionManager persists ``agent.state`` with the session and restores it on
````

**High — Quickstart**

`/strands/quickstart` · route `/quickstart` · under “Install CopilotKit packages” · in a `npm` block

2 code lines changed.

````diff
- npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@0.0.59
+ npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.2
````

**High — Import & Synchronize History**

`/strands/threads-import` · route `/threads-import` · under “Add Intelligence to your existing app”

5 code lines, 31 prose lines changed. The number of fenced code blocks changed.

````diff
+ For a concrete example without historical import, see [keep an existing LangGraph conversation](/strands/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation).
+ 
- If you also want users to reopen history recorded before Intelligence was connected, copy supported history into Intelligence using the steps below. The importer currently supports Google ADK and LangGraph stores. It copies historical content; it does not enable live delivery, recover past execution, or establish ongoing database replication.
+ If you also want users to reopen history recorded before Intelligence was connected, copy supported history into Intelligence using the steps below. This guide covers Google ADK, LangGraph, and Mastra stores. It copies historical content; it does not enable live delivery, recover past execution, or establish ongoing database replication.
+ | Mastra | [Add AG-UI streams to Mastra conversations](/mastra/threads-import) | Saved conversations from a local LibSQL database or a Mastra server. |
+ - saved agent state when supported by the source
- It does not import agent state snapshots, framework transport noise, LangSmith traces, or unsupported source stores.
+ It does not import framework transport noise, LangSmith traces, or unsupported source stores. What is available depends on what your source saved; see your framework’s import guide for details.
````

**Medium — Copilot Runtime**

`/strands/copilot-runtime` · route `/copilot-runtime` · under “Runtime languages”

1 heading, 24 prose lines changed.

````diff
+ ## Runtime languages
+ 
+ **TypeScript is the default and most fully featured runtime. It is the only runtime that can run without CopilotKit Intelligence.** Use it for an open-source setup, or connect it to Intelligence when you need its services.
+ 
+ Python, Go, Ruby, and C#/.NET runtimes require an Intelligence project and server-side API key. They work with both [cloud-hosted](/strands/intelligence/managed-intelligence-platform) and [self-hosted](/strands/intelligence/self-hosting) Intelligence; they do not provide an in-memory or SQLite runner.
+ 
+ | Language | Host | Without Intelligence |
+ | --- | --- | --- |
````

**Medium — Thread & History Lifecycle**

`/strands/threads-lifecycle` · route `/threads-lifecycle` · under “Future runs can remain durable in both places”

1 heading, 7 prose lines changed.

````diff
- After historical import, future conversations that run through CopilotKit are
- written to CopilotKit Intelligence as threads. If your LangGraph agent
+ Once Intelligence is connected, conversations that run through that runtime are
+ recorded automatically in Intelligence. Historical import is optional. If your LangGraph agent
+ 
+ ## Example: keep an existing LangGraph conversation
+ 
+ Follow [Bring your own thread system](/strands/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation) for an example that keeps native persistence and continues the same conversation.
````

**Low — AG-UI**

`/strands/ag-ui` · route `/ag-ui` · under “How agents slot into the runtime”

3 prose lines changed.

````diff
+ To write the custom implementation yourself, and keep its own fields through
+ the clone in step 2, see [Write your own AG-UI agent](/strands/backend/custom-ag-ui-agent).
+ 
````

**Low — Programmatic Control**

`/strands/programmatic-control` · route `/programmatic-control` · under “What is this?”

4 prose lines changed.

````diff
- - `agent.subscribe(subscriber)` — low-level AG-UI event subscription (`onCustomEvent`, `onRunStartedEvent`, `onRunFinalized`, `onRunFailed`, …). Pairs with `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` to drive interrupt resolution from arbitrary UI.
+ - `agent.subscribe(subscriber)` — low-level AG-UI event subscription (`onCustomEvent`, `onRunStartedEvent`, `onRunFinalized`, `onRunFailed`, …). Pairs with `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events, to drive interrupt resolution from arbitrary UI.
- - **`agent.runAgent(options)`** — low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or chain follow-ups. Reach for this only when you need direct control. (For the interrupt-resume case, use `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` — see the snippet below — so the subscriber lifecycle still wraps the resumed run.)
+ - **`agent.runAgent(options)`** — low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or chain follow-ups. Reach for this only when you need direct control. (For the interrupt-resume case, use `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events — the snippet below shows the legacy form — so the subscriber lifecycle still wraps the resumed run.)
````

**Info — Markdown Rendering**

`/strands/custom-look-and-feel/markdown` · route `/custom-look-and-feel/markdown`

Now tracked for the first time.

**Info — Hashbrown**

`/strands/generative-ui/hashbrown` · route `/generative-ui/hashbrown`

Now tracked for the first time.

**Info — JSON Render**

`/strands/generative-ui/json-render` · route `/generative-ui/json-render`

Now tracked for the first time.

**Info — MCP Apps**

`/strands/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps`

Now tracked for the first time.

**Info — Open Generative UI**

`/strands/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui`

Now tracked for the first time.

**Info — Governed Action Approval UI**

`/strands/human-in-the-loop/governed-actions` · route `/human-in-the-loop/governed-actions`

Now tracked for the first time.

**Info — Headless Interrupts**

`/strands/human-in-the-loop/headless` · route `/human-in-the-loop/headless`

Now tracked for the first time.

---

---

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

---
