import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { THREADS_AGENT_ID, agentUrl } from "@/lib/agents";
import { intelligenceOptions } from "@/lib/intelligence";

/**
 * The only Intelligence-mode runtime here, and the only one registering a
 * single agent. Those two facts are the same decision.
 *
 * When a provider connects to an Intelligence runtime, the client starts a
 * thread adapter for **every agent that runtime advertises on `/info`** — not
 * just the one the page is chatting with, and not only on pages that mount a
 * chat. Each adapter does a `GET /threads?agentId=…`, a
 * `POST /threads/subscribe` for realtime credentials, and then opens a
 * WebSocket that retries on failure (`MAX_SOCKET_RETRIES = 5`, 15s timeout).
 *
 * The app-wide runtime registers 25 agents. With Intelligence attached there,
 * every page load — including ones with no chat at all — fired 25 list
 * fetches and 25 subscribe/retry loops, which is enough to lock up a machine
 * in dev, where Next also mirrors each browser warning back to the server.
 *
 * So Intelligence lives here, on one agent, reached only by the Rich Threads
 * routes. Everything else runs in SSE mode and pays none of that cost.
 */
const runtime = new CopilotRuntime({
  agents: {
    [THREADS_AGENT_ID]: new HttpAgent({ url: agentUrl(THREADS_AGENT_ID) }),
  },
  ...intelligenceOptions,
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-threads",
});

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
