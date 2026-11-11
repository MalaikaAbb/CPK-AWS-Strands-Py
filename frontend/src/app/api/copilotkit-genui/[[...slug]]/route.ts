import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

import { agentUrl } from "@/lib/agents";

// The runtime every Components and surfaces demo points at, from the overview
// page's `app/api/copilotkit/[[...slug]]/route.ts`
// (https://docs.copilotkit.ai/strands/generative-ui/components).
//
// Agent: Strands, not the doc's BuiltInAgent. The page builds `agent` as a
// TanStack `BuiltInAgent` factory; here it is this repo's Strands `genui`
// agent (backend/src/agents/genui_agent.py) over AG-UI, the way every other
// runtime route in this repo reaches its agent. The `CopilotRuntime` options
// are the page's. Mounted at its own path rather than `/api/copilotkit` so the
// catalog's `render_ui` never reaches other routes' agents. README §9.35.
const agent = new HttpAgent({ url: agentUrl("genui") });

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui",
});

export const GET = handler;
export const POST = handler;
