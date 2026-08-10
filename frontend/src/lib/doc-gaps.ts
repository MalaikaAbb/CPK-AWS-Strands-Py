/**
 * Everything docs.copilotkit.ai/strands does not publish.
 *
 * Every entry is a statement about the docs, verified against the page it
 * cites on the doc-sync date in `nav-config.ts`. Nothing here describes a
 * limitation of this repo or of AWS Strands itself — only of the
 * documentation, which is what this harness exists to test.
 *
 * `GAP_LIST` is the full record — every finding stays here once written, and
 * the /status ledger shows all of them. `ROUTE_GAPS` is narrower: it decides
 * which routes surface a panel, and a route drops out of it once the feature
 * works regardless of what the docs left out. So a gap with no route is normal,
 * not an orphan.
 *
 * `backend/src/agents/registry.py` keeps its own per-agent `gaps` field, served
 * at `GET /gaps`. That one is a backend-side record and is maintained by hand;
 * it does not have to match `ROUTE_GAPS`.
 *
 * When a doc page starts publishing the missing half, delete the entry. The
 * panel disappears from the route and the README status table follows.
 */

export type GapSeverity = "blocking" | "degraded" | "note";

export interface DocGap {
  id: string;
  /** One line, in the imperative: what is missing. */
  title: string;
  detail: string;
  severity: GapSeverity;
  /** The doc page the claim is about. */
  docPath: string;
}

const GAP_LIST: DocGap[] = [
  {
    id: "setup-skipped",
    title: "The page emits a placeholder where the backend snippet should be",
    detail:
      'Instead of Strands code, the published markdown contains the literal comment `<!-- setup skipped: … is not bundled for strands -->`. The same page for Google ADK prints a full agent definition at that spot. Seven pages are affected: frontend-tools, generative-ui/tool-based, human-in-the-loop, shared-state/agent-readonly, agent-config, programmatic-control, multi-agent/subagents.',
    severity: "blocking",
    docPath: "/strands",
  },
  {
    id: "no-tool-wiring",
    title: "No page attaches a tool to a Strands agent",
    detail:
      "The published `src/agents/agent.py` declares 14 `@tool` functions, then hands them to `build_showcase_agent(...)` — a function referenced twice in comments and never printed. No Strands page passes `tools=` to a Strands `Agent` anywhere, so the one agent here that does carry a tool (`tool_rendering_agent`) spells the wiring out itself with plain Strands SDK. Every other agent is tool-free; see `backend/src/agents/chat_agents.py`.",
    severity: "blocking",
    docPath: "/strands/generative-ui/tool-rendering",
  },
  {
    id: "truncated-agent-py",
    title: "The published backend file is a truncated prefix",
    detail:
      "`src/agents/agent.py` appears on three pages at 332, 585 and 947 lines. They are not three files — each shorter one is byte-identical to the head of the next, and even the longest stops mid-file. `ToolBehavior`, `HookProvider`, `HookRegistry`, `StateSnapshotEvent` and a dozen other imports are declared at the top and first used only in the part that is cut off. Full analysis in `backend/docs_verbatim/README.md`.",
    severity: "blocking",
    docPath: "/strands/multi-agent/subagents",
  },
  {
    id: "unpublished-tools-module",
    title: "The backend imports two modules that are never published",
    detail:
      "`from tools import get_weather_impl, search_flights_impl, build_a2ui_operations_from_tool_call, …` and `from agents.gen_ui_agent import GEN_UI_AGENT_PROMPT, set_steps, steps_state_from_args`. A comment locates `tools` at `../../shared/python/tools`, outside anything the docs ship. Every `@tool` body delegates to one of those `_impl` functions, so no published tool can execute.",
    severity: "blocking",
    docPath: "/strands/generative-ui/tool-rendering",
  },
  {
    id: "no-frontend-tool-channel",
    title: "Nothing documents how frontend tools reach a Strands agent",
    detail:
      "Google ADK opens CopilotKit's frontend-tool channel with `AGUIToolset()` in the agent's `tools=` list, and its doc pages say so. The Strands pages that cover frontend tools, components-as-tools and human-in-the-loop all replace that section with the `setup skipped` placeholder. If `ag_ui_strands` forwards frontend tools automatically, no page says it.",
    severity: "blocking",
    docPath: "/strands/frontend-tools",
  },
  {
    id: "no-state-from-result",
    title: "The tool → state binding is imported but never constructed",
    detail:
      "`ToolBehavior` is in the import block of the published `agent.py` and appears in no expression in the 947 printed lines. The `*_state_from_args` hooks (`notes_state_from_args`, `document_state_from_args`) are printed in full, but the `ToolBehavior(state_from_result=…)` that would attach one to a tool is only described in a comment.",
    severity: "blocking",
    docPath: "/strands/multi-agent/subagents",
  },
  {
    id: "messages-snapshot-missing",
    title: "The MessagesSnapshotEvent workaround is stale — the adapter emits them now",
    detail:
      'The published `agent.py` states that `ag_ui_strands` "through at least v0.1.7" emits no `MessagesSnapshotEvent`, and that without it "responses that include tool calls never render as assistant messages in the DOM". It then prints a 200-line `_MessagesSnapshotWrapper` to inject them — the one complete, self-contained thing in the excerpt — and never wires it into any published `create_strands_app` call. Verified against ag-ui-strands 0.2.4: a raw AG-UI POST to a mounted agent returns RUN_STARTED → STATE_SNAPSHOT → **MESSAGES_SNAPSHOT** → STATE_SNAPSHOT → RUN_FINISHED. The adapter emits them natively; the workaround is obsolete and the doc has not caught up. This harness does not install it.',
    severity: "note",
    docPath: "/strands/generative-ui/tool-rendering",
  },
  {
    id: "quickstart-model-id",
    title: "The Quickstart names a model that does not exist",
    detail:
      'The code block sets `model_id="gpt-5.4"`. The callout immediately under it says the example "uses OpenAI\'s GPT-4o", and the two Shared State pages build the same model with `model_id="gpt-4o"`. This repo defaults to `gpt-4o` and exposes `MODEL_ID` so you can set it back to the literal value and watch it fail.',
    severity: "degraded",
    docPath: "/strands/quickstart?agent=bring-your-own",
  },
  {
    id: "language-agent-id-mismatch",
    title: "The read and write pages disagree on the agent id",
    detail:
      'Both pages print the same backend, which names the agent `languageAgent`. The *write* page\'s frontend calls `useAgent({ agentId: "languageAgent" })`; the *read* page\'s calls `useAgent({ agentId: "strands_agent" })` — an id that page never defines. Copied literally, the read page addresses an agent that does not exist. Mounted once here, as `shared-state-language`.',
    severity: "degraded",
    docPath: "/strands/shared-state/in-app-agent-read",
  },
  {
    id: "language-agent-missing-import",
    title: "The Shared State backend calls os.getenv without importing os",
    detail:
      "`agent/main.py` on both Shared State pages opens with `from ag_ui_strands import …` and uses `os.getenv(\"OPENAI_API_KEY\", \"\")` two lines later. There is no `import os`. Copied as printed the module raises `NameError` at import time; `backend/src/agents/language_agent.py` adds the import and says so in its docstring.",
    severity: "degraded",
    docPath: "/strands/shared-state/in-app-agent-write",
  },
  {
    id: "renderers-missing-imports",
    title: "renderers.tsx is printed with no imports",
    detail:
      "The A2UI dynamic-schema page's `renderers.tsx` block opens directly at `export const myRenderers: CatalogRenderers<MyDefinitions> = {`. `CatalogRenderers`, `MyDefinitions` and React are all used and none is imported. The block does not compile as printed — the import line has to be reconstructed from the neighbouring `definitions.ts` and `catalog.ts` snippets.",
    severity: "degraded",
    docPath: "/strands/generative-ui/a2ui/dynamic-schema",
  },
  {
    id: "agent-config-wrong-framework",
    title: "The Agent Config backend sample is LangGraph, not Strands",
    detail:
      'Under a `python title="backend/agent.py"` label the page shows `async def my_agent_node(state: AgentState, config: RunnableConfig)` reading `state.get("copilotkit", {}).get("context", [])`. That is the LangGraph node signature and the LangGraph context location. Strands has neither. The Strands half of the page is the `setup skipped` placeholder.',
    severity: "blocking",
    docPath: "/strands/agent-config",
  },
  {
    id: "interactive-page-empty",
    title: "The Interactive page has no Strands content of its own",
    detail:
      "`generative-ui/your-components/interactive` renders as a single React placeholder — `<Interactive components={props.components} framework=\"aws-strands\" />` — with a two-line intro and nothing else. The rendered page falls back to generic frontend-tool prose and one `useHumanInTheLoop` example that is not Strands-specific.",
    severity: "degraded",
    docPath: "/strands/generative-ui/your-components/interactive",
  },
  {
    id: "interrupt-not-available",
    title: "Strands has no interrupt primitive, so half of Programmatic Control does not apply",
    detail:
      "The page's interrupt-resolution section is gated behind `<WhenFrameworkHas flag=\"interrupt_pattern\" …>`. For Strands neither the `native` nor the `promise-based` branch resolves — the page's own fallback text says to use `useHumanInTheLoop` instead, and the promise-based snippet is replaced by `<!-- snippet skipped: region 'headless-promise-primitives' missing in strands::interrupt-headless -->`. The three primitives (`addMessage`, `runAgent`, `subscribe`) are unaffected.",
    severity: "note",
    docPath: "/strands/programmatic-control",
  },
  {
    id: "headless-helpers-undefined",
    title: "The headless send pipeline destructures helpers it never defines",
    detail:
      "The `headless-complete` snippet opens with `const { attachments, fileInputRef, containerRef, handleFileUpload, handleDragOver, handleDragLeave, handleDrop, dragOver, removeAttachment, consumeAttachments } = useAttachmentsConfig();` and also calls `useAutoScroll` and `buildContent`. None of the three is printed on any page. This repo reconstructs them in `headless-helpers.ts`, which is why the route is Partial.",
    severity: "degraded",
    docPath: "/strands/programmatic-control",
  },
  {
    id: "cross-framework-links",
    title: "The Shared State pages link out to LangGraph's docs",
    detail:
      'Both `in-app-agent-read` and `in-app-agent-write` tell you to "follow the instructions in the Getting Started guide" and link to `/langgraph/quickstart` rather than `/strands/quickstart`. The Quickstart\'s own "What\'s next" cards link to `/aws-strands/...`, a path prefix that does not exist — the live tree is `/strands/...`.',
    severity: "note",
    docPath: "/strands/shared-state/in-app-agent-read",
  },
  {
    id: "css-v1-import",
    title: "The CSS page's inline-override example imports from the v1 package",
    detail:
      "`import { CopilotKitCSSProperties } from \"@copilotkit/react-ui\";` sits in the middle of a page whose demo is v2. The `--copilot-kit-*` variables it sets are the v1 token set; the v2 components read the shadcn `--primary` / `--background` tokens documented lower down the same page. Both halves are correct in isolation and cannot be combined.",
    severity: "note",
    docPath: "/strands/custom-look-and-feel/css",
  },
  {
    id: "no-agent-server-composition",
    title: "No page shows more than one agent in a Strands process",
    detail:
      "Every published example ends at `create_strands_app(agui_agent, \"/\")` — one app, one agent, one root. Nothing documents how to serve a second agent from the same process. `agent_server.py` here mounts one `create_strands_app` per agent with plain Starlette `app.mount`, leaving the documented call untouched, but the composition is this repo's.",
    severity: "note",
    docPath: "/strands/quickstart?agent=bring-your-own",
  },
  {
    id: "runtime-page-frameworkless",
    title: "The Copilot Runtime page never mentions Strands",
    detail:
      "Apart from cross-links, the page is framework-neutral: its runtime snippet registers `// your agents go here` and its default-agent example points an `HttpAgent` at `https://my-agent.example.com`. It never connects that to the `create_strands_app` endpoint the Quickstart produces, and the `HttpAgent` import is used but not shown.",
    severity: "note",
    docPath: "/strands/copilot-runtime",
  },
];

export const DOC_GAPS: Record<string, DocGap> = Object.fromEntries(
  GAP_LIST.map((g) => [g.id, g]),
);

export type GapId = string;

/**
 * Which gaps apply to which route. Order matters — the most damaging one for
 * that route goes first, because that is what the panel leads with.
 *
 * Components as Tools has no entry either: its `useComponent` registration is
 * confirmed working against a live agent, so the frontend-tool channel does
 * reach Strands even though no page documents it. Nor does Tool Call
 * Rendering, which runs a real backend tool — what it had to borrow to get
 * there is spelled out on the route itself, in the panel above its source.
 * Both `your-components/*` routes are out for the same reason as Components as
 * Tools, and so are Frontend Tools and Human in the Loop: every one of them
 * registers through the same proxied-tool channel, and it works. What the docs
 * omit about that channel is still recorded as `no-frontend-tool-channel` on
 * the /status ledger — a documentation gap, not a broken feature, so it no
 * longer flags a route as impaired.
 *
 * Quickstart deliberately has no entry. Its two findings — the model id and the
 * one-app-per-agent composition — are already spelled out in that route's own
 * "What this repo changed, and why" callout, so a panel above it would only say
 * the same thing twice. Both remain on the /status ledger.
 */
export const ROUTE_GAPS: Record<string, GapId[]> = {
  "/custom-look-and-feel/css": ["css-v1-import"],

  "/generative-ui/a2ui/dynamic-schema": [
    "renderers-missing-imports",
  ],
};

export function gapsFor(path: string): DocGap[] {
  return (ROUTE_GAPS[path] ?? []).map((id) => {
    const gap = DOC_GAPS[id];
    if (!gap) throw new Error(`Unknown doc gap id "${id}" on route ${path}`);
    return gap;
  });
}

/** Total distinct gaps, for the status page's headline. */
export const ALL_GAPS = GAP_LIST;
