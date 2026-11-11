import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { agentUrl } from "@/lib/agents";

// The Transports page's `app/api/copilotkit/route.ts`. The page prints only the
// `CopilotRuntime` call, with an `agent` it never defines; the section's only
// agent is the overview's TanStack `BuiltInAgent` factory.
//
// Agent: Strands, not the doc's BuiltInAgent. `agent` is this repo's Strands
// `genui` agent over AG-UI. Harness glue: the imports, `agent` and the handler.
// The `shop` agent the "Only some agents" sample names is not built by any page
// and is not registered. README §9.35.
const agent = new HttpAgent({ url: agentUrl("genui") });

//#region transports-runtime
const runtime = new CopilotRuntime({
  agents: { default: agent },
  generativeUI: true,
});
//#endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui-transports",
});

export const GET = handler;
export const POST = handler;
