"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

/**
 * Harness-authored. The MCP Apps snippet renders `<Chat />` and the page never
 * defines it. Its own comment says a plain `<CopilotChat />` is enough, so
 * that is all this is; the agent comes from the surrounding
 * `<CopilotKit agent="mcp-apps">`. `className="h-full"` only so it fills the
 * doc's `h-full` column.
 */
export function Chat() {
  return <CopilotChat className="h-full" />;
}
