import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { agentUrl } from "@/lib/agents";
import { intelligenceOptions } from "@/lib/intelligence";

/**
 * Repo-authored — not from the docs.
 *
 * The hashbrown page's prose `page.tsx` block points at
 * `runtimeUrl="/api/copilotkit-byoc-hashbrown"` with `agent="byoc_hashbrown"`, and never
 * shows that route. (The page's embedded demo does publish a route.ts, but at
 * a different path, `/api/copilotkit-declarative-hashbrown`, reproduced verbatim
 * next to this one.) Same shape as this app's other secondary runtimes: one
 * agent, no middleware. It reaches the same backend agent the demo's route
 * does, the doc's own `byoc_hashbrown.py` mounted at `/byoc-hashbrown/`.
 */

const runtime = new CopilotRuntime({
  agents: {
    byoc_hashbrown: new HttpAgent({ url: agentUrl("byoc-hashbrown") }),
  },
  ...intelligenceOptions,
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-byoc-hashbrown",
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
