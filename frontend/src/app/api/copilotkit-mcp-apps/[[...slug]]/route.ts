import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { agentUrl } from "@/lib/agents";

/**
 * The MCP Apps runtime, at the path the doc's provider names
 * (`runtimeUrl="/api/copilotkit-mcp-apps"`).
 *
 * The page prints the `const runtime = new CopilotRuntime({ … })` statement
 * and nothing around it. Harness-authored here: the imports, `agents` (the
 * one id the page's provider names, pointed at this repo's per-agent mount —
 * the page shows no agent behind it), and the handler + verb exports, as in
 * every other runtime route in this repo.
 *
 * The statement itself is the page's, byte-for-byte, including the fallback
 * URL `https://mcp.excalidraw.com`. That URL answers every request with a
 * `308` to `/mcp`, and `@ag-ui/mcp-apps-middleware` 0.1.1 builds its
 * transport with `redirect: "error"` — so with `MCP_SERVER_URL` unset, tool
 * discovery fails, the runtime logs `MCP tool discovery failed`, and the
 * agent runs with no MCP tools at all. `.env.example` sets
 * `MCP_SERVER_URL=https://mcp.excalidraw.com/mcp`, the endpoint the redirect
 * points at. Delete that line to reproduce the doc's default. README §9.24.
 *
 * Scoped to its one agent: the page says the runtime applies the middleware
 * to every registered agent, which is exactly why this lives on its own
 * endpoint rather than on the shared `/api/copilotkit`.
 */
const agents = {
  "mcp-apps": new HttpAgent({ url: agentUrl("mcp-apps") }),
};

// #region runtime — verbatim
// src/app/api/copilotkit-mcp-apps/route.ts
// The `mcpApps.servers` config is all you need server-side. The runtime
// auto-applies the MCP Apps middleware to every registered agent: on each
// MCP tool call it fetches the associated UI resource and emits an
// `activity` event that the built-in `MCPAppsActivityRenderer` renders
// inline in the chat.
const runtime = new CopilotRuntime({
  // @ts-ignore -- see main route.ts; published CopilotRuntime's `agents`
  // type wraps Record in MaybePromise<NonEmptyRecord<...>> which rejects
  // plain Records. Fixed in source, pending release.
  agents,
  mcpApps: {
    servers: [
      {
        type: "http",
        url: process.env.MCP_SERVER_URL || "https://mcp.excalidraw.com",
        // Always pin a stable `serverId`. Without it CopilotKit hashes the
        // URL, and a URL change silently breaks restoration of persisted
        // MCP Apps in prior conversation threads.
        serverId: "excalidraw",
      },
    ],
  },
});
// #endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  // Must match this file's directory, or the runtime's sub-routing 404s.
  basePath: "/api/copilotkit-mcp-apps",
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
