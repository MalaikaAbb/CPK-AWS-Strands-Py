/**
 * The nav, the route headers, and the README status table all read from here,
 * so a doc page and its implementation status are described exactly once.
 *
 * Route paths mirror the doc URLs under docs.copilotkit.ai/strands.
 * `agentId` is the id the agent is registered under in
 * `backend/src/agents/registry.py`, which is also the path it is mounted at —
 * so a route, its doc page, and its agent line up in one place.
 *
 * The grouping is this harness's, not the doc sidebar's. The Strands sidebar
 * scatters these pages across "Build Chat UIs", "Build Generative UI", "Add
 * Agent Powers" and "AWS Strands (Python)"; several pages in the list below
 * (the `prebuilt-components/*` and `custom-look-and-feel/*` routes, and both
 * `your-components/*` routes) are reachable by URL but do not appear in that
 * sidebar at all. They are marked `offNav`.
 */

/**
 * There is exactly one doc-sync date in this repo, and it is not here: it is
 * `syncedAt` in `doc-snapshot/manifest.json`, written every time the sync
 * button runs. A hand-maintained date alongside it only ever drifted out of
 * agreement with the machine one, so it was removed — `/doc-sync` is the
 * single place that answers "how current are these docs".
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/strands";

export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export interface RouteMeta {
  path: string;
  title: string;
  docPath: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  /** Reachable by URL but absent from the Strands doc sidebar. */
  offNav?: boolean;
  /** Owns a live surface at `<path>/demo-chat`. */
  hasDemo?: boolean;
  /** Agent id from `backend/src/agents/registry.py`. */
  agentId?: string;
}

export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/strands",
        summary: "What this harness covers and how the pieces fit together.",
        status: "reference",
        statusNote: "Landing page — orientation, the agent roster, and the doc-gap ledger.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        agentId: "strands_agent",
        title: "Quickstart",
        docPath: "/strands/quickstart?agent=bring-your-own",
        summary:
          "The bring-your-own-agent path: a Strands Agent wrapped in StrandsAgent, served by create_strands_app, reached over HTTP by the Copilot Runtime.",
        status: "working",
        statusNote:
          "The one page whose backend is published end to end. Its model id is not — see the doc gaps below.",
      },
    ],
  },
  {
    title: "Prebuilt Components",
    routes: [
      {
        path: "/prebuilt-components/chat",
        hasDemo: true,
        agentId: "agentic_chat",
        offNav: true,
        title: "CopilotChat",
        docPath: "/strands/prebuilt-components/chat",
        summary:
          "The base inline chat surface, sized to fill whatever container you give it.",
        status: "working",
      },
      {
        path: "/prebuilt-components/sidebar",
        hasDemo: true,
        agentId: "prebuilt-sidebar",
        offNav: true,
        title: "CopilotSidebar",
        docPath: "/strands/prebuilt-components/sidebar",
        summary:
          "The collapsible docked chat that wraps your main content rather than covering it.",
        status: "working",
      },
      {
        path: "/prebuilt-components/popup",
        hasDemo: true,
        agentId: "prebuilt-popup",
        offNav: true,
        title: "CopilotPopup",
        docPath: "/strands/prebuilt-components/popup",
        summary:
          "The floating launcher that opens an overlay chat on top of the page.",
        status: "working",
      },
      {
        path: "/prebuilt-components/chat-controls",
        hasDemo: true,
        agentId: "chat-controls",
        offNav: true,
        title: "Open, close, and feedback",
        docPath: "/strands/prebuilt-components/chat-controls",
        summary:
          "Driving modal state from your own UI with useCopilotChatConfiguration, and capturing thumbs up/down.",
        status: "working",
      },
    ],
  },
  {
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/css",
        hasDemo: true,
        agentId: "chat-customization-css",
        offNav: true,
        title: "CSS Customization",
        docPath: "/strands/custom-look-and-feel/css",
        summary:
          "Re-skinning the chat with the v2 shadcn design tokens and the .copilotKit* class hooks.",
        status: "working",
      },
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        agentId: "chat-slots",
        offNav: true,
        title: "Slots",
        docPath: "/strands/custom-look-and-feel/slots",
        summary:
          "Overriding chat sub-components at all three levels: class strings, prop objects, and whole components.",
        status: "working",
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        agentId: "headless-simple",
        offNav: true,
        title: "Headless UI",
        docPath: "/strands/custom-look-and-feel/headless-ui",
        summary:
          "A chat built from useAgent, useCopilotKit and useRenderToolCall alone, with no CopilotKit chrome.",
        status: "working",
      },
    ],
  },
  {
    title: "Rich Threads",
    routes: [
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        hasDemo: true,
        agentId: "agentic_chat",
        title: "Threads Drawer",
        docPath: "/strands/prebuilt-components/copilot-threads-drawer",
        summary:
          "The drop-in conversation sidebar: list, switch, archive and delete threads with no active-thread state of your own.",
        status: "working",
        statusNote:
          "The page's integration is reproduced in full and compiles. Threads need CopilotKit Intelligence — without a key the drawer renders its documented locked view, which is what this route currently shows.",
      },
      {
        path: "/headless-threads",
        hasDemo: true,
        agentId: "agentic_chat",
        title: "Headless Threads",
        docPath: "/strands/headless-threads",
        summary:
          "The same thread data behind your own UI, via useThreads — and the only route where rename is reachable.",
        status: "working",
        statusNote:
          "All three of the page's snippets run, with its own step-2/step-3 prop mismatch reconciled. Without an Intelligence key useThreads returns an empty list beside a working chat, which the page calls a quiet failure.",
      },
      {
        path: "/threads-lifecycle",
        hasDemo: true,
        agentId: "agentic_chat",
        title: "Thread & History Lifecycle",
        docPath: "/strands/threads-lifecycle",
        summary:
          "Where a threadId comes from, what makes history replay, and the two setters that silently no-op if you also pass the prop.",
        status: "working",
        statusNote:
          "Reference-heavy: one runnable component out of everything published. Three of its snippets call symbols it never defines; none is reconstructed here.",
      },
      {
        path: "/threads-import",
        title: "Import & Synchronize History",
        docPath: "/strands/threads-import",
        summary:
          "Moving existing framework conversations into Intelligence as Rich Threads — a CLI migration with no React surface.",
        status: "reference",
        statusNote:
          "Nothing to run: the page's own supported-sources table is Google ADK and LangGraph only. There is no Strands importer.",
      },
    ],
  },
  {
    title: "Input Modalities",
    routes: [
      {
        path: "/multimodal-attachments",
        hasDemo: true,
        agentId: "multimodal",
        title: "Multimodal Attachments",
        docPath: "/strands/multimodal-attachments",
        summary:
          "Drag-and-drop file attachments sent to the agent as AG-UI content parts.",
        status: "working",
      },
      {
        path: "/voice",
        hasDemo: true,
        agentId: "voice",
        title: "Voice",
        docPath: "/strands/voice",
        summary:
          "A second runtime carrying a TranscriptionService, which is what makes the composer grow a mic button.",
        status: "working",
        statusNote:
          "The mic transcribes through OpenAI Whisper, so it needs OPENAI_API_KEY. Without one the route still runs via the doc's sample-audio button.",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/tool-based",
        hasDemo: true,
        agentId: "gen-ui-tool-based",
        title: "Components as Tools",
        docPath: "/strands/generative-ui/tool-based",
        summary:
          "useComponent registering a React component as a tool the agent calls to render it.",
        status: "working",
        statusNote:
          "The agent does call the registered component, despite the page's backend section being a `setup skipped` placeholder — so the frontend-tool channel reaches a Strands agent with no documented wiring at all.",
      },
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        agentId: "tool-rendering",
        title: "Tool Call Rendering",
        docPath: "/strands/generative-ui/tool-rendering",
        summary:
          "Named renderers for get_weather and search_flights, plus the wildcard catch-all from useDefaultRenderTool.",
        status: "working",
        statusNote:
          "get_weather only — it is the sole backend tool any Strands page prints, and its `_impl` body had to be borrowed. The search_flights renderer has nothing to render.",
      },
      {
        path: "/generative-ui/your-components/display-only",
        hasDemo: true,
        agentId: "gen-ui-display-only",
        offNav: true,
        title: "Your Components · Display-only",
        docPath: "/strands/generative-ui/your-components/display-only",
        summary:
          "The page's own useComponent example: a weather card the agent renders with no handler and no interaction.",
        status: "working",
        statusNote:
          "The doc's snippet verbatim, both the typed and the untyped registration. Same undocumented channel as Components as Tools.",
      },
      {
        path: "/generative-ui/your-components/interactive",
        hasDemo: true,
        agentId: "gen-ui-interactive",
        offNav: true,
        title: "Your Components · Interactive",
        docPath: "/strands/generative-ui/your-components/interactive",
        summary:
          "The page's single useHumanInTheLoop approval example — an approve/deny gate around a command.",
        status: "working",
        statusNote:
          "The gate itself works. The page is still almost empty — one React placeholder tag and one generic snippet — and is reproduced as-is, unstyled markup included.",
      },
      {
        path: "/generative-ui/a2ui/dynamic-schema",
        hasDemo: true,
        agentId: "declarative-gen-ui",
        title: "A2UI · Dynamic Schema",
        docPath: "/strands/generative-ui/a2ui/dynamic-schema",
        summary:
          "A bring-your-own-catalog surface where a secondary LLM designs the layout per request.",
        status: "broken",
        statusNote:
          "The catalog, definitions and renderers are wired as printed. Nothing drives them: `generate_a2ui` is never attached to a Strands agent, and renderers.tsx ships with no import line.",
      },
      {
        path: "/generative-ui/a2ui/fixed-schema",
        hasDemo: true,
        agentId: "a2ui-fixed-schema",
        title: "A2UI · Fixed Schema",
        docPath: "/strands/generative-ui/a2ui/fixed-schema",
        summary:
          "A flight card whose component tree is authored as JSON up front; the tool supplies only the data.",
        status: "broken",
        statusNote:
          "Catalog and runtime middleware are registered. The agent-side half — the tool that returns the operations container — is not published.",
      },
    ],
  },
  {
    title: "App Control",
    routes: [
      {
        path: "/frontend-tools",
        hasDemo: true,
        agentId: "frontend_tools",
        title: "Frontend Tools",
        docPath: "/strands/frontend-tools",
        summary:
          "A tool the agent calls that executes in the browser and changes the page.",
        status: "working",
        statusNote:
          "useFrontendTool exactly as the page shows, and the agent calls it — even though the page's Strands setup section is a placeholder.",
      },
      {
        path: "/human-in-the-loop",
        hasDemo: true,
        agentId: "hitl-in-chat",
        title: "Human in the Loop",
        docPath: "/strands/human-in-the-loop",
        summary:
          "useHumanInTheLoop suspending the run behind a picker until the user answers.",
        status: "working",
        statusNote:
          "The tool-based pause works. The page's other half is `useInterrupt`, which is LangGraph-only and does not apply to Strands at all.",
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        agentId: "programmatic-control",
        title: "Programmatic Control",
        docPath: "/strands/programmatic-control",
        summary:
          "Driving runs from code with addMessage, runAgent, stopAgent and subscribe — no chat component.",
        status: "working",
        statusNote:
          "The 2026-08-26 rewrite replaced the unrunnable headless-complete snippet with a self-contained AgentTrigger; the demo runs it verbatim. The page's interrupt half is still a skipped snippet.",
      },
    ],
  },
  {
    title: "Shared State",
    routes: [
      {
        path: "/shared-state/rendering-in-app",
        hasDemo: true,
        agentId: "shared-state-read-write",
        title: "Render state in your app",
        docPath: "/strands/shared-state/rendering-in-app",
        summary:
          "useAgent read outside the chat: a main-view canvas subscribing to the same agent state the chat uses.",
        status: "working",
        statusNote:
          "The 2026-08-26 rewrite added a seeded initial state, so the canvas renders on first paint. Reads and setState both round-trip; nothing on the Strands side writes state back, so the agent still cannot drive it.",
      },
      {
        path: "/shared-state/agent-readonly",
        hasDemo: true,
        agentId: "readonly-state-agent-context",
        title: "Agent Read-Only Context",
        docPath: "/strands/shared-state/agent-readonly",
        summary:
          "useAgentContext as a one-way UI-to-agent channel — props for the agent, with no setter.",
        status: "broken",
        statusNote:
          "The frontend publishes context entries as printed. Whether a Strands agent ever sees them is undocumented: the page's backend section is a placeholder.",
      },
      {
        path: "/shared-state/in-app-agent-read",
        hasDemo: true,
        agentId: "shared-state-language",
        title: "Reading agent state",
        docPath: "/strands/shared-state/in-app-agent-read",
        summary:
          "Reading agent.state in your own components, against the one Strands agent the docs wire to state.",
        status: "working",
        statusNote:
          "The page's own agentId contradicts its own backend; this route addresses the agent the backend actually names.",
      },
      {
        path: "/shared-state/in-app-agent-write",
        hasDemo: true,
        agentId: "shared-state-language",
        title: "Writing agent state",
        docPath: "/strands/shared-state/in-app-agent-write",
        summary:
          "agent.setState writing back, folded into the prompt by StrandsAgentConfig(state_context_builder).",
        status: "working",
      },
    ],
  },
  {
    title: "Multi-Agent",
    routes: [
      {
        path: "/multi-agent/subagents",
        hasDemo: true,
        agentId: "subagents",
        title: "Sub-Agents",
        docPath: "/strands/multi-agent/subagents",
        summary:
          "A supervisor delegating to research, writing and critique sub-agents, with a live delegation log.",
        status: "working",
        statusNote:
          "Delegation runs and the live log fills in. The state hook the page names three times and never prints is written locally, outside the verbatim region — see backend/src/agents/subagents.py.",
      },
    ],
  },
  {
    title: "Agent Config",
    routes: [
      {
        path: "/agent-config",
        hasDemo: true,
        agentId: "agent-config",
        title: "Agent Config",
        docPath: "/strands/agent-config",
        summary:
          "A typed config object the UI owns, published with useAgentContext and rebuilt into the system prompt each turn.",
        status: "broken",
        statusNote:
          "The UI half works. The backend half the page shows is LangGraph code under a generic `backend/agent.py` label; the Strands slot next to it is a placeholder.",
      },
    ],
  },
  {
    title: "AWS Strands (Python)",
    routes: [
      {
        path: "/copilot-runtime",
        hasDemo: true,
        agentId: "agentic_chat",
        title: "Copilot Runtime",
        docPath: "/strands/copilot-runtime",
        summary:
          "This repo's live runtime config, every agent it routes to, and a raw AG-UI event capture.",
        status: "working",
      },
      {
        path: "/ag-ui",
        hasDemo: true,
        agentId: "agentic_chat",
        title: "AG-UI",
        docPath: "/strands/ag-ui",
        summary:
          "useAgent as the AbstractAgent handle, and agent.subscribe walking the full event stream live.",
        status: "working",
      },
    ],
  },
  {
    title: "Doc Sync",
    routes: [
      {
        path: "/doc-sync",
        title: "Doc drift",
        docPath: "/strands",
        summary:
          "Re-fetches the markdown behind every tracked doc page and diffs it against the stored snapshot, flagging changes inside code blocks.",
        status: "reference",
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};
