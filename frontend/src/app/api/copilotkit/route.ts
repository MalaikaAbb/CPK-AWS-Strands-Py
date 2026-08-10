import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

import { AGENT_IDS, A2UI_FIXED_AGENT_ID, agentUrl } from "@/lib/agents";

// The Quickstart's runtime, widened from one agent to the whole registry.
//
// It registers `strands_agent: new HttpAgent({ url: "http://localhost:8000" })`
// because it has exactly one agent and `create_strands_app(agui_agent, "/")`
// puts it at the server root. This harness has one agent per doc route, so the
// Python server gives each its own app and mounts it at `/{agent_id}` — hence
// the trailing slash that `agentUrl()` adds. The ids are the same strings the
// routes pass as `agentId`.
const serviceAdapter = new ExperimentalEmptyAdapter();

const agents = Object.fromEntries(
  AGENT_IDS.map((id) => [id, new HttpAgent({ url: agentUrl(id) })]),
);

const runtime = new CopilotRuntime({
  agents,
  // A2UI, scoped to the fixed-schema agent with tool injection off, exactly as
  // the Copilot Runtime page describes the option. Note what this cannot do:
  // the middleware detects an operations container in a tool result and
  // forwards it, and no Strands agent in this repo returns one, because the
  // tool that would is never attached to an agent on any doc page. The wiring
  // is here so the runtime side is inspectable; the agent side is a doc gap.
  //
  // The dynamic-schema route deliberately does not go through this runtime —
  // it has its own at /api/copilotkit-declarative-gen-ui, where the catalog on
  // the provider is what turns A2UI on.
  a2ui: { injectA2UITool: false, agents: [A2UI_FIXED_AGENT_ID] },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
