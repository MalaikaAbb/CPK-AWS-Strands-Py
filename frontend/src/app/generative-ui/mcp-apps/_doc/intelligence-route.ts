// "MCP Apps with Intelligence" snippet from
// https://docs.copilotkit.ai/strands/generative-ui/mcp-apps (title
// app/api/copilotkit/[[...slug]]/route.ts), verbatim below the line EXCEPT the
// agent. Type-checked, never served: `_doc` is a private App Router folder and
// nothing imports it. Running it needs a CopilotKit Intelligence key (premium
// — not testable locally).
//
// Agent: Strands, not the doc's BuiltInAgent. The page prints
//   import { BuiltInAgent, ... } from "@copilotkit/runtime/v2";
//   const agent = new BuiltInAgent({
//     model: "openai/gpt-6-luna",
//     prompt: "You are a helpful assistant.",
//   });
// — a framework-generic agent, not a Strands one. This harness swaps in the
// Strands agent the route's MCP Apps demo already runs (`mcp-apps` in
// backend/src/agents/registry.py), reached over AG-UI with `HttpAgent` the way
// the page's own Code-tab route.ts does. Everything else is the page's.
// README §9.24.
// ---------------------------------------------------------------------------
import { HttpAgent } from "@ag-ui/client";
import {
  CopilotKitIntelligence,
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { agentUrl } from "@/lib/agents";

// Harness swap (see header): the doc's `new BuiltInAgent({ … })`.
const agent = new HttpAgent({ url: agentUrl("mcp-apps") });

const runtime = new CopilotRuntime({
  agents: { default: agent },
  // Intelligence stores threads and runs. Do not pass `runner` as well.
  intelligence: new CopilotKitIntelligence({
    apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
  }),
  // Replace this fixed user with the user from your verified session.
  identifyUser: () => ({ id: "demo-user", name: "Demo User" }),
  // Unchanged from the in-memory setup.
  mcpApps: {
    servers: [
      {
        type: "http",
        url: "https://mcp.excalidraw.com/mcp",
        serverId: "excalidraw",
      },
    ],
  },
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
