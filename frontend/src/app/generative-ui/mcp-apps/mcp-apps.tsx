"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

import { Chat } from "./chat";

/**
 * "No frontend renderer needed", from
 * https://docs.copilotkit.ai/strands/generative-ui/mcp-apps
 *
 * The published block starts mid-function at a comment followed by
 * `return (`, so the function wrapper and both imports are harness-authored.
 * Everything between the region markers is the page's, unchanged. `Chat` is
 * never defined on the page — see `./chat`.
 */
export default function McpAppsDemo() {
  // #region mcp-apps — verbatim
  // src/app/demos/mcp-apps/page.tsx
  // No `renderActivityMessages`, no `useRenderActivityMessage` — the
  // CopilotKitProvider auto-registers the built-in `MCPAppsActivityRenderer`
  // for the "mcp-apps" activity type. A plain <CopilotChat /> is enough.
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-mcp-apps" agent="mcp-apps">
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
  // #endregion
}
