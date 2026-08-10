/**
 * The agent ids this app can address.
 *
 * Mirrors the keys of `REGISTRY` in `backend/src/agents/registry.py`, which is
 * also where each agent is mounted: id `tool-rendering` is served at
 * `${AGENT_URL}/tool-rendering/`. Keeping the list here rather than fetching it
 * means the runtime route can be built synchronously at module load.
 *
 * If you add an agent to the Python registry, add its id here too — the
 * `/copilot-runtime` route cross-checks the two lists at runtime and reports
 * any drift.
 */

export const AGENT_IDS = [
  "strands_agent",
  "agentic_chat",
  "prebuilt-sidebar",
  "prebuilt-popup",
  "chat-controls",
  "chat-customization-css",
  "chat-slots",
  "headless-simple",
  "headless-complete",
  "multimodal",
  "voice",
  "gen-ui-tool-based",
  "tool-rendering",
  "gen-ui-display-only",
  "gen-ui-interactive",
  "a2ui-fixed-schema",
  "declarative-gen-ui",
  "frontend_tools",
  "hitl-in-chat",
  "programmatic-control",
  "shared-state-language",
  "shared-state-read-write",
  "readonly-state-agent-context",
  "subagents",
  "agent-config",
] as const;

export type AgentId = (typeof AGENT_IDS)[number];

/** Where the Python agent server is listening. */
export const AGENT_URL = process.env.AGENT_URL ?? "http://localhost:8000";

/**
 * The AG-UI endpoint for an agent.
 *
 * Trailing slash on purpose. `agent_server.py` gives each agent its own
 * `create_strands_app(..., "/")` and mounts it at `/{id}`, so the AG-UI root
 * for that agent is `/{id}/`. The Voice doc page writes its `HttpAgent` URL
 * the same way (`${AGENT_URL}/voice/`).
 */
export function agentUrl(id: string): string {
  return `${AGENT_URL}/${id}/`;
}

/** The one agent the A2UI fixed-schema route scopes its runtime middleware to. */
export const A2UI_FIXED_AGENT_ID = "a2ui-fixed-schema";
