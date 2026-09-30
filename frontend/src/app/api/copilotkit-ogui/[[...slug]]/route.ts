import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { agentUrl } from "@/lib/agents";

/**
 * The Open Generative UI runtime, at the path the doc's provider names
 * (`runtimeUrl="/api/copilotkit-ogui"`).
 *
 * The page prints one fragment — `runtime: new CopilotRuntime({ … }),` — the
 * property of some enclosing object it never shows, referencing an `agents`
 * it never defines. So, harness-authored here:
 *
 *  - `agents`: the two ids the fragment names, each an `HttpAgent` at this
 *    repo's per-agent mount (`agentUrl()` adds the trailing slash). The page
 *    publishes no agent behind either id — see `backend/src/agents/gen_ui_agents.py`.
 *  - the enclosing object: `createCopilotRuntimeHandler({ runtime, basePath })`,
 *    the same v2 factory every other runtime in this repo uses. The fragment's
 *    `runtime:` key and indentation fit it as-is.
 *  - the verb exports, as in `api/copilotkit/[[...slug]]/route.ts`.
 *
 * Scoped to its two agents on purpose: `openGenerativeUI` wraps each listed
 * agent in `OpenGenerativeUIMiddleware`, and keeping it off the shared
 * `/api/copilotkit` runtime means no other route can pick it up.
 *
 * No `intelligenceOptions` spread: the doc constructs the runtime without
 * them, and this file keeps its constructor exactly as printed.
 */
const agents = {
  "open-gen-ui": new HttpAgent({ url: agentUrl("open-gen-ui") }),
  "open-gen-ui-advanced": new HttpAgent({ url: agentUrl("open-gen-ui-advanced") }),
};

const handler = createCopilotRuntimeHandler({
  // #region runtime — verbatim
  // src/app/api/copilotkit-ogui/route.ts
      runtime: new CopilotRuntime({
        // @ts-ignore -- see main route.ts
        agents,
        openGenerativeUI: {
          agents: ["open-gen-ui", "open-gen-ui-advanced"],
        },
      }),
  // #endregion
  // Must match this file's directory, or the runtime's sub-routing 404s.
  basePath: "/api/copilotkit-ogui",
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
