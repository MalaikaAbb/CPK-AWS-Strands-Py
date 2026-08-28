import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { agentUrl } from "@/lib/agents";
import { intelligenceOptions } from "@/lib/intelligence";

/**
 * A second runtime for the A2UI dynamic-schema route, matching the doc's
 * `runtimeUrl="/api/copilotkit-declarative-gen-ui"`.
 *
 * Note the absence of an `a2ui` block. That is the whole point of the page:
 * passing a catalog to the provider auto-enables A2UI and injects the
 * `generate_a2ui` tool, so the runtime needs no configuration at all. It has to
 * be a separate endpoint from `/api/copilotkit` because that one turns
 * injection off for the fixed-schema agent.
 *
 * Moved to the v2 factory and a `[[...slug]]` catch-all alongside the main
 * runtime, so all three endpoints in this app share one shape and one
 * Intelligence client.
 */

const runtime = new CopilotRuntime({
  agents: {
    "declarative-gen-ui": new HttpAgent({
      url: agentUrl("declarative-gen-ui"),
    }),
  },
  ...intelligenceOptions,
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-declarative-gen-ui",
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
