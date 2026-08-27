import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { AGENT_IDS, A2UI_FIXED_AGENT_ID, agentUrl } from "@/lib/agents";

/**
 * The app-wide runtime, on the Quickstart's current shape.
 *
 * That shape changed: the page used to build a v1 endpoint at
 * `app/api/copilotkit/route.ts` with `copilotRuntimeNextJSAppRouterEndpoint`
 * and an `ExperimentalEmptyAdapter`. It now uses the **v2** factory at a
 * `[[...slug]]` catch-all, which is what lets the runtime own its own
 * sub-routing (`/info`, `/agent/:id/run`, `/transcribe`) under `basePath` —
 * and it drops the service adapter entirely. The provider's matching
 * `useSingleEndpoint={false}` is the client half of the same change.
 *
 * Two things are this repo's rather than the page's:
 *
 *  1. **The agent map.** The page registers one agent, because
 *     `create_strands_app(agui_agent, "/")` is one app at the server root.
 *     This harness has one agent per doc route, so the Python server mounts
 *     each at `/{agent_id}/` — hence the trailing slash `agentUrl()` adds.
 *  2. **`a2ui`.** Scoped to the fixed-schema agent with tool injection off,
 *     exactly as the Copilot Runtime page describes the option. Note what it
 *     cannot do: the middleware forwards an operations container out of a tool
 *     result, and no Strands agent here returns one, because the tool that
 *     would is never attached to an agent on any doc page. The runtime side is
 *     wired so it is inspectable; the agent side is a doc gap.
 *
 * The dynamic-schema route deliberately does not go through this runtime — it
 * has its own endpoint, where the catalog on the provider is what turns A2UI on.
 */

const agents = Object.fromEntries(
  AGENT_IDS.map((id) => [id, new HttpAgent({ url: agentUrl(id) })]),
);

/**
 * SSE mode on purpose — no `intelligenceOptions` here.
 *
 * An Intelligence runtime makes the client open a thread channel per advertised
 * agent, and this one advertises 25. Attaching Intelligence here meant ~25 list
 * fetches plus 25 retrying WebSockets on every page load, chat or not. The
 * Rich Threads routes use `/api/copilotkit-threads`, which registers exactly
 * one agent; see that file for the full story.
 */
const runtime = new CopilotRuntime({
  agents,
  a2ui: { injectA2UITool: false, agents: [A2UI_FIXED_AGENT_ID] },
});

const handler = createCopilotRuntimeHandler({
  runtime,
  // Must match this file's directory, or the runtime's sub-routing 404s.
  basePath: "/api/copilotkit",
});

/**
 * Every verb the runtime dispatches on, not just the two the docs print.
 *
 * The Quickstart and the Copilot Runtime page both end their route at:
 *
 *     export const GET = handler;
 *     export const POST = handler;
 *
 * That is enough for chat, and it is why the omission is easy to miss. It is
 * not enough for threads. The runtime's `threads/update` route dispatches on
 * `PATCH` (rename, archive, unarchive) and `DELETE` (delete) — and in Next, a
 * verb with no export is rejected with a 405 *before* the handler runs, so the
 * runtime never gets a chance to answer. `deleteThread()` fails with
 * `Request failed: 405` and nothing reaches the server logs.
 *
 * `createCopilotRuntimeHandler` returns one fetch handler that reads
 * `request.method` itself, so every verb points at the same function. The set
 * below is the runtime's own `DEFAULT_METHODS` from `fetch-cors`, minus the
 * `HEAD`/`OPTIONS` pair Next handles.
 */
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
