import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { agentUrl } from "@/lib/agents";

// The Transports page's `app/api/copilotkit/route.ts`. The page prints only the
// `CopilotRuntime` call, with an `agent` it never defines.
//
// Harness glue (pattern from CPK-LangGraph-TS / aws-strands-ts): `agent` (this
// repo's Strands `genui` agent), the `shop` entry, and the handler. `shop` is
// the id the page's "Only some agents" sample lists in `agentIds`, so the demo
// has one agent inside that list and one (`default`) outside it.
const agent = new HttpAgent({ url: agentUrl("genui") });

//#region transports-runtime
const runtime = new CopilotRuntime({
  agents: { default: agent, shop: new HttpAgent({ url: agentUrl("genui-shop") }) /* harness glue */ },
  generativeUI: true,
});
//#endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui-transports",
});

export const GET = handler;
export const POST = handler;
